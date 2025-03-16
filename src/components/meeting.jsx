import React, { useEffect, useState } from "react";
import api from "@/api";
import { toast } from "react-hot-toast";
import { NavBar, SmallScreenNavBar } from "./UserOverview";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MoreProfileOptions } from "./profile";
import navicon from "../images/Commonimg/navicon.png";
import dateIcon from "../images/Commonimg/PastMeetings.png";
import options from "../images/Commonimg/options.png";
import orangeMeeting from "../images/Commonimg/meeting_orange.png";
import ChatTab from "./ChatTab";
import Lottie from 'react-lottie';
import NODATA from "../assets/NODATA.json";


export const MeetingUI = ({ connectToVideo }) => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showNavBar, setShowNavBar] = useState(false);
  const [activeTab, setActiveTab] = useState("upcoming");

  const toggleNavBar = () => setShowNavBar((prev) => !prev);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await api.get("/user-meetings/");
        setMeetings(response.data);
      } catch (err) {
        setError("Failed to fetch meetings");
      } finally {
        setLoading(false);
      }
    };
    fetchMeetings();
  }, []);

  const filteredMeetings = meetings.filter((meeting) => {
    const now = new Date();
    const startTime = new Date(meeting.start_time);
    const endTime = new Date(meeting.end_time);

    switch (activeTab) {
      case "upcoming":
        return startTime > now;
      case "past":
        return endTime < now;
      case "archived":
        return meeting.isArchived;
      default:
        return true;
    }
  });

  if (error) return <div>{error}</div>;

  return (
    <div className="flex w-full h-full bg-backgroundGray">
      {/* Sidebar */}
      <NavBar />
      {showNavBar && (
        <div className="fixed z-20 w-full h-full border" onClick={toggleNavBar}>
          <SmallScreenNavBar />
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 p-4 md:p-6 overflow-y-auto">
        {/* Header with Navbar Toggle and Buttons */}
        <div className="flex justify-between items-center mb-4">
          <button className="xl:hidden" onClick={toggleNavBar}>
            <img src={navicon} className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Meetups</h1>
          <MoreProfileOptions />
        </div>

        {/* Buttons for Create and Join Meetup */}
        <div className="flex flex-wrap md:flex-nowrap justify-between items-center mb-4 gap-2">
          <div className="ml-auto">
            <Dialog>
              <DialogTrigger>
                <button className="bg-[#1ED0C2] text-white px-4 py-2 rounded-lg shadow-md w-full md:w-auto">
                  Create new meeting
                </button>
              </DialogTrigger>
              <DialogContent>
                <CreateMeetingForm connectToVideo={connectToVideo} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-4 overflow-x-auto">
          {["upcoming", "past", "archived", "chat"].map((tab) => (
            <button
              key={tab}
              className={`text-muted-foreground border-b-2 whitespace-nowrap px-4 py-2 ${
                activeTab === tab ? "border-[#1ED0C2]" : "border-transparent"
              } hover:border-[#1ED0C2]`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Meetup Cards or Loading Skeleton */}
        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-200px)] md:max-h-[calc(100vh-150px)]">
          {loading ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-200 rounded-xl animate-pulse">
                <div>
                  <div className="flex items-center">
                    <div className="w-[46px] h-[42px] bg-gray-300 rounded-full"></div>
                    <div className="ml-2 w-32 h-4 bg-gray-300 rounded"></div>
                  </div>
                  <div className="mt-2 w-48 h-4 bg-gray-300 rounded"></div>
                </div>
                <div className="flex justify-center space-x-2">
                  <button className="bg-gray-300 text-white w-[120px] h-[48px] rounded-lg animate-pulse"></button>
                  <button className="bg-gray-300 text-white w-[120px] h-[48px] rounded-lg animate-pulse"></button>
                </div>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-200 rounded-xl animate-pulse">
                <div>
                  <div className="flex items-center">
                    <div className="w-[46px] h-[42px] bg-gray-300 rounded-full"></div>
                    <div className="ml-2 w-32 h-4 bg-gray-300 rounded"></div>
                  </div>
                  <div className="mt-2 w-48 h-4 bg-gray-300 rounded"></div>
                </div>
                <div className="flex justify-center space-x-2">
                  <button className="bg-gray-300 text-white w-[120px] h-[48px] rounded-lg animate-pulse"></button>
                  <button className="bg-gray-300 text-white w-[120px] h-[48px] rounded-lg animate-pulse"></button>
                </div>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-200 rounded-xl animate-pulse">
                <div>
                  <div className="flex items-center">
                    <div className="w-[46px] h-[42px] bg-gray-300 rounded-full"></div>
                    <div className="ml-2 w-32 h-4 bg-gray-300 rounded"></div>
                  </div>
                  <div className="mt-2 w-48 h-4 bg-gray-300 rounded"></div>
                </div>
                <div className="flex justify-center space-x-2">
                  <button className="bg-gray-300 text-white w-[120px] h-[48px] rounded-lg animate-pulse"></button>
                  <button className="bg-gray-300 text-white w-[120px] h-[48px] rounded-lg animate-pulse"></button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {filteredMeetings.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <Lottie
                    animationData={NODATA}
                    loop={true}
                    style={{ width: 300, height: 300 }}
                  />
                  <p className="text-muted-foreground mt-4">No meetings found.</p>
                </div>
              ) : (
                <>
                  {activeTab === "upcoming" && (
                    <UpcomingMeetups
                      meetings={filteredMeetings}
                      connectToVideo={connectToVideo}
                      deleteMeeting={deleteMeeting}
                    />
                  )}
                  {activeTab === "past" && <PastMeetups meetings={filteredMeetings} />}
                  {activeTab === "archived" && <ArchivedMeetups meetings={filteredMeetings} />}
                  {activeTab === "chat" && <ChatTab />}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};





export const CreateMeetingForm = ({ connectToVideo }) => {
  const [meetingName, setMeetingName] = useState("");
  const [members, setMembers] = useState([]);
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 16)); // Set default to current date and time
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle adding new member
  const handleAddMember = (email) => {
    if (email.trim()) {
      setMembers([...members, { id: Date.now(), email }]);
    }
  };

  // Handle creating a new meeting
  const handleCreateMeeting = async () => {
    if (!meetingName.trim()) {
      toast.error("Meetup name can't be empty.");
      return;
    }
    if (!startDate || !endDate) {
      toast.error("Start and End times are required.");
      return;
    }

    // Ensure start date is greater than current date
    const currentTime = new Date();
    const startTime = new Date(startDate);
    if (startTime <= currentTime) {
      toast.error("Start date must be in the future.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/create/", {
        title: meetingName,
        start_time: startTime.toISOString(),
        end_time: new Date(endDate).toISOString(),
        invited_members: members.map((member) => member.email),
      });

      console.log("API response:", response); // Log the response to verify its structure

      if (response.status === 200 || response.status === 201) {
        // Show the success message from the backend
        toast.success(response.data.message);
        connectToVideo(response.data.agora_channel_name);
      } else {
        toast.error("Unexpected response from the server.");
      }
    } catch (err) {
      toast.error("Error creating meeting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-medium text-[24px]">Create a Meetup</h1>
      <div className="flex flex-col gap-4">
        {/* Meetup Name Input */}
        <input
          type="text"
          placeholder="Enter meetup name"
          value={meetingName}
          onChange={(e) => setMeetingName(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />

        {/* Start Date Input */}
        <input
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />

        {/* End Date Input */}
        <input
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />

        {/* Dynamic Member Email Fields */}
        <input
          type="text"
          placeholder="Enter member email"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleAddMember(e.target.value);
              e.target.value = "";
            }
          }}
          className="w-full p-2 border rounded-lg"
        />

        {/* Displaying added members */}
        <div className="flex flex-col gap-2">
          {members.map((member) => (
            <MembersCard key={member.id} member={member} removeMember={() => handleRemoveMember(member.id)} />
          ))}
        </div>
      </div>

      {/* Create Meetup Button */}
      <button
        className="bg-[#1ED0C2] text-white px-4 py-2 rounded-lg"
        onClick={handleCreateMeeting}
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Meetup"}
      </button>
    </div>
  );
};

// Handle removing a member
const handleRemoveMember = (memberId) => {
  setMembers(members.filter(member => member.id !== memberId));
};

const deleteMeeting = async (meetingId) => {
  try {
    const response = await api.delete(`/delete/${meetingId}/`);
    if (response.status === 200 || response.status === 204) {
      toast.success("Meeting deleted successfully.");
      return { success: true };
    } else {
      throw new Error("Failed to delete the meeting");
    }
  } catch (error) {
    console.error("Error deleting meeting:", error);
    toast.error("Error deleting meeting.");
    return { success: false };
  }
};

const UpcomingMeetups = ({ meetings, connectToVideo, deleteMeeting }) => {
  const [meetingsList, setMeetingsList] = useState(meetings);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [meetingToDelete, setMeetingToDelete] = useState(null);
  const accessToken = localStorage.getItem("access_token");



const handleJoinMeeting = async (meeting) => {
  console.log("Step 1: Initiating join meeting process...");

  try {
    // Step 2: Make API call to join the meeting
    console.log("Step 2: Making API request to join the meeting...");
    const response = await api.post("/join/", {
      meeting_id: meeting.id,
    });
    
    console.log("API Response:", response.data); // Log the full response
    
    // Step 3: Validate API response
    if (!response.data.twilio_room_name || !response.data.twilio_token) {
      throw new Error("Error: Missing Twilio room name or token in the response.");
    }
    
    const { twilio_room_name, twilio_token, participants: participantsString } = response.data;
    console.log("Step 3: Extracted meeting details - Room Name:", twilio_room_name, "Token:", twilio_token);
    
    // Step 4: Parse participants data
    let participants = [];
    try {
      console.log("Step 4: Parsing participants data...");
      participants = JSON.parse(participantsString);
      console.log("Parsed participants:", participants);
    } catch (error) {
      console.warn("Step 4: Failed to parse participants data. Defaulting to an empty array.");
      participants = [];
    }

    // Step 5: Validate participants data
    if (!Array.isArray(participants)) {
      console.warn("Step 5: Invalid participants data format. Defaulting to an empty array.");
      participants = [];
    }

    // Step 6: Construct the meeting URL
    const url = `/live-video?channelName=${encodeURIComponent(twilio_room_name)}&token=${encodeURIComponent(twilio_token)}&participants=${encodeURIComponent(JSON.stringify(participants))}`;
    console.log("Step 6: Constructed meeting URL:", url);
    
    // Step 7: Open the meeting in a new tab
    console.log("Step 7: Opening the meeting URL in a new tab...");
    window.open(url, "_blank");
    console.log("Meeting opened successfully.");
    
  } catch (error) {
    // Step 8: Handle any errors that occur during the process
    console.error("Step 8: Error joining meeting:", error);
    toast.error(error.message || "Failed to join the meeting.");
  }
};
  const handleDeleteMeeting = (meetingId) => {
    setMeetingToDelete(meetingId);
    setShowConfirmPopup(true);
  };

  const confirmDelete = () => {
    deleteMeeting(meetingToDelete).then((response) => {
      if (response.success) {
        // Remove the deleted meeting from the list
        setMeetingsList(meetingsList.filter((meeting) => meeting.id !== meetingToDelete));
        setShowConfirmPopup(false); // Close the confirmation popup
      }
    });
  };

  const cancelDelete = () => {
    setShowConfirmPopup(false);
  };

  const sortedMeetings = meetingsList.sort(
    (a, b) => new Date(a.start_time) - new Date(b.start_time)
  );

  return (
    <div className="space-y-4">
      {sortedMeetings.map((meeting) => (
        <div
          key={meeting.id}
          className="flex justify-between items-center p-4 bg-[#FFFFFF] rounded-xl shadow-md"
        >
          <div>
            <div className="flex items-center">
              <img src={orangeMeeting} className="w-[46px] h-[42px]" />
              <span className="font-semibold ml-2">{meeting.title}</span>
            </div>
            <span className="text-muted-foreground">
              {new Date(meeting.start_time).toLocaleString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </span>
          </div>
          <div className="flex justify-center space-x-2">
            <button
              className="bg-[#1ED0C2] text-white w-[120px] h-[48px] rounded-lg"
              onClick={() => handleJoinMeeting(meeting)}
            >
              Join
            </button>
            <button
              className="bg-[#FF4D4D] text-white w-[120px] h-[48px] rounded-lg"
              onClick={() => handleDeleteMeeting(meeting.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {showConfirmPopup && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-xl shadow-md w-80">
            <h3 className="text-lg font-semibold">
              Are you sure you want to delete this meeting?
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              You won't be able to recover this meeting once deleted.
            </p>
            <div className="mt-4 flex justify-between">
              <button
                className="bg-gray-300 text-black w-32 py-2 rounded-lg"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white w-32 py-2 rounded-lg"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PastMeetups = ({ meetings }) => (
  <div className="space-y-4">
    {meetings.map((meeting) => (
      <div
        key={meeting.id}
        className="flex justify-between p-4 bg-white rounded-xl shadow-md"
      >
        <div>
          <div className="flex items-center">
            <img src={dateIcon} className="h-[38px] w-[38px]" />
            <span className="font-semibold ml-2">{meeting.title}</span>
          </div>
          <span className="text-muted-foreground">
            {new Date(meeting.start_time).toLocaleString()}
          </span>
        </div>
        <img src={options} className="w-6 h-6" />
      </div>
    ))}
  </div>
);

const fetchUserId = async () => {
  try {
    const response = await api.get("/get-user-id/");
    const user_id = response.data.user_id;
    localStorage.setItem("user_id", user_id); // Store user_id in local storage
  } catch (error) {
    console.error("Failed to fetch user ID:", error);
  }
};

// Call this function after the user logs in
fetchUserId();
const ArchivedMeetups = ({ meetings }) => (
  <div className="space-y-4">
    {meetings.map((meeting) => (
      <div
        key={meeting.id}
        className="flex justify-between p-4 bg-white rounded-xl shadow-md"
      >
        <div>
          <div className="flex items-center">
            <img src={dateIcon} className="h-[38px] w-[38px]" />
            <span className="font-semibold ml-2">{meeting.title}</span>
          </div>
          <span className="text-muted-foreground">
            {new Date(meeting.start_time).toLocaleString()}
          </span>
        </div>
        <img src={options} className="w-6 h-6" />
      </div>
    ))}
  </div>
);

const MembersCard = ({ member }) => (
  <div className="flex gap-[14px] items-center">
    <div className="w-[25px] h-[25px] border rounded-full"></div>
    <div className="gap-2">
      <h1 className="text-[12px] font-bold text-textDarkBlue">
        {member.email}
      </h1>
    </div>
  </div>
);

export default MeetingUI;