import { useState, useEffect } from "react";
import { NavBar, SmallScreenNavBar } from "./UserOverview";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import api from "@/api"; // Assuming you have an API utility for making requests
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast"; // For toast notifications

import orangeMeeting from "../images/Commonimg/meeting_orange.png";
import dateIcon from "../images/Commonimg/PastMeetings.png";
import options from "../images/Commonimg/options.png";
import navicon from "../images/Commonimg/navicon.png";

export const MeetingUI = ({ connectToVideo }) => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [date, setDate] = useState(new Date());
  const [showNavBar, setShowNavBar] = useState(false);
  const [activeTab, setActiveTab] = useState("upcoming"); // Tabs: upcoming, past, archived

  const toggleNavBar = () => {
    setShowNavBar((prev) => !prev);
  };

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6 bg-background">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Meetings</h1>
        <div>
          <Dialog>
            <DialogTrigger>
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg mr-2 shadow-md">
                Create meeting
              </button>
            </DialogTrigger>
            <DialogContent>
              <CreateMeetingForm connectToVideo={connectToVideo} />
            </DialogContent>
          </Dialog>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-md">
            Join meeting
          </button>
        </div>
      </div>

      <div className="flex space-x-4 mb-4">
        <button
          className={`text-muted-foreground border-b-2 ${
            activeTab === "upcoming" ? "border-primary" : "border-transparent"
          } hover:border-primary`}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming
        </button>
        <button
          className={`text-muted-foreground border-b-2 ${
            activeTab === "past" ? "border-primary" : "border-transparent"
          } hover:border-primary`}
          onClick={() => setActiveTab("past")}
        >
          Past
        </button>
        <button
          className={`text-muted-foreground border-b-2 ${
            activeTab === "archived" ? "border-primary" : "border-transparent"
          } hover:border-primary`}
          onClick={() => setActiveTab("archived")}
        >
          Archived
        </button>
      </div>

      <div className="space-y-4">
        {activeTab === "upcoming" && (
          <UpcomingMeetings meetings={meetings} connectToVideo={connectToVideo} />
        )}
        {activeTab === "past" && <PastMeetings meetings={meetings} />}
        {activeTab === "archived" && <ArchivedMeetings meetings={meetings} />}
      </div>
    </div>
  );
};

// Subcomponents
const CreateMeetingForm = ({ connectToVideo }) => {
  const [meetingName, setMeetingName] = useState("");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCreateMeeting = async () => {
    if (!meetingName.trim()) {
      toast.error("Meeting name can't be empty.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/create/", {
        title: meetingName,
        start_time: new Date().toISOString(),
        end_time: new Date().toISOString(),
        invited_members: members.map((member) => member.id),
      });

      connectToVideo(response.data.agora_channel_name);
      toast.success("Meeting created successfully!");
    } catch (err) {
      toast.error("Failed to create meeting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-medium text-[24px]">Create a Meeting</h1>
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Enter meeting name"
          value={meetingName}
          onChange={(e) => setMeetingName(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
        <input
          type="text"
          placeholder="Enter member email"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              setMembers([...members, { id: Date.now(), email: e.target.value }]);
              e.target.value = "";
            }
          }}
          className="w-full p-2 border rounded-lg"
        />
        <div className="flex flex-col gap-2">
          {members.map((member) => (
            <MembersCard key={member.id} member={member} />
          ))}
        </div>
      </div>
      <button
        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg"
        onClick={handleCreateMeeting}
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Meeting"}
      </button>
    </div>
  );
};

const UpcomingMeetings = ({ meetings, connectToVideo }) => {
  return (
    <>
      {meetings.map((meeting) => (
        <div
          key={meeting.id}
          className="flex items-center justify-between p-4 bg-[#AAB2C8] rounded-xl shadow-md"
        >
          <div>
            <div className="flex items-center">
              <i className="fas fa-star text-yellow-500 mr-2"></i>
              <span className="font-semibold">{meeting.title}</span>
            </div>
            <span className="text-muted-foreground">
              {new Date(meeting.start_time).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <i className="fas fa-users text-muted-foreground"></i>
            <span className="text-muted-foreground">10 Participants</span>
            <button
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg"
              onClick={() => connectToVideo(meeting.agora_channel_name)}
            >
              Join
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

const PastMeetings = ({ meetings }) => {
  return (
    <>
      {meetings.map((meeting) => (
        <div
          key={meeting.id}
          className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md"
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
    </>
  );
};

const ArchivedMeetings = ({ meetings }) => {
  return (
    <>
      {meetings.map((meeting) => (
        <div
          key={meeting.id}
          className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md"
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
    </>
  );
};

const MembersCard = ({ member }) => {
  return (
    <div className="flex gap-[14px] items-center">
      <div className="w-[25px] h-[25px] border rounded-full"></div>
      <div className="gap-2">
        <h1 className="text-[12px] font-bold text-textDarkBlue">
          {member.email}
        </h1>
      </div>
    </div>
  );
};

export default MeetingUI;