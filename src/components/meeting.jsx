import React, { useEffect, useState } from "react";

import { toast } from "react-hot-toast";
import { NavBar, SmallScreenNavBar } from "./UserOverview";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MoreProfileOptions } from "./profile";
import navicon from "../images/Commonimg/navicon.png";
import dateIcon from "../images/Commonimg/PastMeetings.png";
import options from "../images/Commonimg/options.png";
import orangeMeeting from "../images/Commonimg/meeting_orange.png";
import ChatTab from "./ChatTab";
import Lottie from 'lottie-react';
import NODATA from "../assets/NODATA.json";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo, faCalendarAlt, faUsers } from "@fortawesome/free-solid-svg-icons";
import "react-datepicker/dist/react-datepicker.css"; 
import DatePicker from "react-datepicker";



import { useWorkspace } from "./WorkspaceContext"; // Import the hook
import { useQuery } from "@tanstack/react-query";
import api from "@/api";






export const MeetingUI = ({ connectToVideo }) => {
  const { selectedWorkspace } = useWorkspace();
  const [activeTab, setActiveTab] = useState("upcoming");

  const {
    data: meetings,
    isLoading: meetingsLoading,
    error: meetingsError,
  } = useQuery({
    queryKey: ["meetings", selectedWorkspace?.id],
    queryFn: async () => {
      const response = await api.get("/user-meetings/");
      console.log("API Response:", response.data);
      return response.data;
    },
    enabled: !!selectedWorkspace,
  });

  const nowUTC = new Date(new Date().toISOString());

  const pastMeetings = meetings?.filter((meeting) => {
    const endTime = new Date(meeting.end_time);
    return endTime < nowUTC;
  }) || [];

  console.log("Past Meetings:", pastMeetings);
  console.log("Active Tab:", activeTab);

  if (meetingsError) return <div>{meetingsError.message}</div>;

  return (
    <div className="flex w-full h-full bg-backgroundGray">
      {/* Sidebar */}
      <NavBar />

      {/* Main Content */}
      <div className="flex flex-col flex-1 p-4 md:p-6 overflow-y-auto max-w-[1128px] mx-auto w-full">
        {/* Header with Navbar Toggle and Buttons */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Meetups</h1>
          <MoreProfileOptions />
        </div>

        {/* Buttons for Create and Join Meetup */}
        <div className="flex flex-wrap md:flex-nowrap justify-between items-center mb-4 gap-2">
          <div className="ml-auto">
            <Dialog>
              <DialogTrigger asChild>
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
          {["upcoming", "past", "chat"].map((tab) => (
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
          {meetingsLoading ? (
            <div className="space-y-4">
              {/* Loading Skeleton */}
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-4 bg-gray-200 rounded-xl animate-pulse"
                >
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
              ))}
            </div>
          ) : (
            <>
              {!meetings || meetings.length === 0 ? (
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
                      meetings={meetings}
                      connectToVideo={connectToVideo}
                      deleteMeeting={deleteMeeting}
                    />
                  )}
                  {activeTab === "past" && <PastMeetups meetings={pastMeetings} />}
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
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle adding new member
  const handleAddMember = () => {
    if (newMemberEmail.trim()) {
      setMembers([...members, { id: Date.now(), email: newMemberEmail }]);
      setNewMemberEmail("");
    }
  };

  // Handle creating a new meeting
  const handleCreateMeeting = async () => {
    if (!meetingName.trim()) {
      toast.error("Meetup name can't be empty.");
      return;
    }
    if (!startDate || !endDate) {
      toast.error("Start and End dates are required.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/create/", {
        title: meetingName,
        start_time: startDate.toISOString(), // Send only the date
        end_time: endDate.toISOString(), // Send only the date
        invited_members: members.map((member) => member.email),
      });

      if (response.status === 200 || response.status === 201) {
        toast.success(response.data.message);
        connectToVideo(response.data.twilio_room_name);
      } else {
        toast.error("Unexpected response from the server.");
      }
    } catch (err) {
      toast.error("Error creating meeting.");
      console.error(err); // Log the error for debugging
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-medium text-[24px]">Create a Meetup</h1>
      <div className="flex flex-col gap-4">
        {/* Meetup Name Input */}
        <fieldset className="border-2 rounded-md">
          <legend className="text-sm ml-4 p-2 text-[12px] text-textPrimary">
            Meetup Name:
          </legend>
          <input
            type="text"
            placeholder="Enter meetup name"
            value={meetingName}
            onChange={(e) => setMeetingName(e.target.value)}
            className="w-[97%] h-[31px] text-[16px] outline-none mb-2 ml-2"
          />
        </fieldset>

        {/* Start Date Input */}
        <fieldset className="border-2 rounded-md">
          <legend className="text-sm ml-4 p-2 text-[12px] text-textPrimary">
            Start Date:
          </legend>
          <div className="p-2">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              placeholderText="Select start date"
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </fieldset>

        {/* End Date Input */}
        <fieldset className="border-2 rounded-md">
          <legend className="text-sm ml-4 p-2 text-[12px] text-textPrimary">
            End Date:
          </legend>
          <div className="p-2">
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              placeholderText="Select end date"
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </fieldset>

        {/* Add Members Input */}
        <fieldset className="border-2 rounded-md">
          <legend className="text-sm ml-4 p-2 text-[12px] text-textPrimary">
            Add Members:
          </legend>
          <div className="flex gap-2 p-2">
            <input
              type="email"
              placeholder="Enter member email"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
            <button
              className="bg-[#1ED0C2] text-white px-4 py-2 rounded-lg"
              onClick={handleAddMember}
            >
              Add
            </button>
          </div>
          <div className="p-2">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex justify-between items-center p-2 border-b"
              >
                <span>{member.email}</span>
                <button
                  className="text-red-500"
                  onClick={() =>
                    setMembers(members.filter((m) => m.id !== member.id))
                  }
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </fieldset>

        {/* Create Meetup Button */}
        <button
          className="bg-[#1ED0C2] text-white px-4 py-2 rounded-lg"
          onClick={handleCreateMeeting}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Meetup"}
        </button>
      </div>
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
    try {
      const response = await api.post("/join/", {
        meeting_id: meeting.id,
      });
  
      if (!response.data.twilio_room_name || !response.data.twilio_token) {
        throw new Error("Invalid response from the server.");
      }
  
      const { twilio_room_name, twilio_token, participants: participantsString } = response.data;
  
      // Parse participants data
      let participants = [];
      try {
        participants = JSON.parse(participantsString);
      } catch (error) {
        console.warn("Failed to parse participants data. Defaulting to an empty array.");
      }
  
      // Construct the meeting URL
      const url = `/live-video?channelName=${encodeURIComponent(twilio_room_name)}&token=${encodeURIComponent(twilio_token)}&participants=${encodeURIComponent(JSON.stringify(participants))}`;
  
      // Open the meeting in a new tab
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error joining meeting:", error);
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

    // Ensure meetingsList is an array before sorting
    const sortedMeetings = meetingsList && Array.isArray(meetingsList)
    ? meetingsList.sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
    : [];

  return (
    <div className="space-y-4">
      {sortedMeetings.map((meeting) => (
        <div
          key={meeting.id}
          className="flex justify-between items-center p-4 bg-[#FFFFFF] rounded-xl shadow-md"
        >

            <div className="flex items-center">
              <FontAwesomeIcon icon={faCalendarAlt} className="w-[46px] h-[42px] text-[#1ED0C2] mr-3" />
              
              <div className="flex flex-col">
                <span className="font-semibold">{meeting.title}</span>
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
const PastMeetups = ({ meetings, deleteMeeting }) => {
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [meetingToDelete, setMeetingToDelete] = useState(null);

  // Filter past meetings (ended at least one day before the current date)
  const pastMeetings = meetings.filter((meeting) => {
    const now = new Date();
    const endTime = new Date(meeting.end_time);
    const oneDayBefore = new Date(now);
    oneDayBefore.setDate(now.getDate() - 1); // Subtract one day from the current date
    return endTime < oneDayBefore;
  });

  const handleDeleteMeeting = (meetingId) => {
    setMeetingToDelete(meetingId);
    setShowConfirmPopup(true);
  };

  const confirmDelete = () => {
    deleteMeeting(meetingToDelete).then((response) => {
      if (response.success) {
        // Remove the deleted meeting from the list
        setShowConfirmPopup(false); // Close the confirmation popup
      }
    });
  };

  const cancelDelete = () => {
    setShowConfirmPopup(false);
  };

  return (
    <div className="space-y-4">
      {pastMeetings.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <Lottie
            animationData={NODATA}
            loop={true}
            style={{ width: 300, height: 300 }}
          />
          <p className="text-muted-foreground mt-4">No past meetings found.</p>
        </div>
      ) : (
        pastMeetings.map((meeting) => (
          <div
            key={meeting.id}
            className="flex justify-between items-center p-4 bg-[#FFFFFF] rounded-xl shadow-md"
          >
            <div className="flex items-center">
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="w-[46px] h-[42px] text-[#1ED0C2] mr-3"
              />
              <div className="flex flex-col">
                <span className="font-semibold">{meeting.title}</span>
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
            </div>
            <div className="flex justify-center space-x-2">
              <button
                className="bg-[#FF4D4D] text-white w-[120px] h-[48px] rounded-lg"
                onClick={() => handleDeleteMeeting(meeting.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}

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
const MembersCard = ({ member, removeMember }) => (
  <div className="flex gap-[14px] items-center">
    <div className="w-[25px] h-[25px] border rounded-full"></div>
    <div className="gap-2">
      <h1 className="text-[12px] font-bold text-textDarkBlue">
        {member.email}
      </h1>
    </div>
    <button
      className="text-red-500 text-sm"
      onClick={() => removeMember(member.id)}
    >
      Remove
    </button>
  </div>
);

export default MeetingUI;