import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { connect, createLocalVideoTrack } from "twilio-video";
import { toast } from "react-hot-toast";
import { NavBar, SmallScreenNavBar } from "./UserOverview";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MoreProfileOptions } from "./profile";
import api from "@/api"; // Assuming you have an API utility for making requests
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
    <div className="flex w-full h-full gap-8 bg-backgroundGray px-[40px] pb-[80px] xl:p-0">
      <NavBar />
      {showNavBar ? (
        <div className="fixed z-20 w-full h-full border" onClick={toggleNavBar}>
          <SmallScreenNavBar />
        </div>
      ) : null}
      <div className="flex flex-col xl:items-baseline w-full xl:w-[1100px] h-[100%] gap-6">
        <div className="w-full h-[92px] flex items-center justify-end gap-[10px]">
          <button className="mr-auto xl:hidden" onClick={toggleNavBar}>
            <img src={navicon} className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2 p-3">
            <MoreProfileOptions />
            <img src={""} className="w-5 h-5" />
          </div>
        </div>
        <div className="flex flex-wrap gap-8">
          <div className="flex flex-col gap-6">
            <h1 className="text-[32px] text-textPrimary font-medium">
              Meetings
            </h1>
            <div className="grid grid-cols-2 gap-6 max-lg:flex max-lg:flex-wrap max-md:w-full w-[660px]">
              <MeetingButton connectToVideo={connectToVideo} />
              {meetings.map((meeting) => (
                <MeetingButton
                  key={meeting.id}
                  meeting={meeting}
                  connectToVideo={connectToVideo}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <h1 className="text-[32px] text-textPrimary font-medium">
              Calendar
            </h1>
            <Calendar
              mode="range"
              selected={date}
              onSelect={setDate}
              className="border rounded-xl border-borderGray max-sm:w-auto w-[332px] h-[340px] bg-white grid place-content-center font-[Poppins] p-4 gap-6"
            />
          </div>
        </div>
        <div className="flex flex-col h-[314px] w-full py-8 gap-[24px]">
          <h1 className="text-[24px] font-medium">Upcoming Meetings</h1>
          <div className="overflow-scroll rounded-md whitespace-nowrap no-scrollbar">
            <div className="flex gap-6">
              {meetings.map((meeting) => (
                <UpcomingMettingCard
                  key={meeting.id}
                  meeting={meeting}
                  connectToVideo={connectToVideo}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <h1 className="text-[24px] font-medium">Past Meetings</h1>
          <div className="flex flex-wrap w-full gap-8">
            {meetings.map((meeting) => (
              <PastMeetings key={meeting.id} meeting={meeting} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const MeetingButton = ({ connectToVideo, meeting }) => {
  const [meetingName, setMeetingName] = useState("");
  const [invalidInputMsg, setInvalidInputMsg] = useState("");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateMeeting = async () => {
    if (!meetingName.trim()) {
      setInvalidInputMsg("Meeting name can't be empty.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/create/", {
        title: meetingName,
        start_time: new Date().toISOString(), // Replace with actual start time
        end_time: new Date().toISOString(), // Replace with actual end time
        invited_members: members.map((member) => member.id),
      });

      // Connect to the meeting using Twilio
      connectToVideo(response.data.twilio_room_name);
      toast.success("Meeting created successfully!");
    } catch (err) {
      setError("Failed to create meeting");
      toast.error("Failed to create meeting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="w-[318px] h-[158px] max-md:w-full bg-white rounded-xl py-4 px-6 flex flex-col gap-6 border border-borderGray2">
        <div className="flex flex-col gap-6">
          <img src={orangeMeeting} className="w-[46px] h-[42px]" />
          <h2 className="font-medium text-textPrimary">New Meeting</h2>
        </div>
      </DialogTrigger>
      <DialogContent className="h-auto w-[486px]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center">
            <h1 className="font-medium text-[24px] w-full">Create a Meeting</h1>
            <div className="w-full text-[18px] font-medium text-textGary">
              <h2>
                Meeting Name:{" "}
                <input
                  onChange={(e) => setMeetingName(e.target.value)}
                  placeholder="Enter meeting name"
                />
              </h2>
            </div>
          </div>
          <div className="flex flex-col gap-[12px]">
            <h1>Members</h1>
            <div className="flex flex-col gap-2">
              <input
                className="w-full border h-[44px] rounded-xl p-2 font-normal text-[16px]"
                placeholder="Enter member email"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    setMembers([...members, { id: Date.now(), email: e.target.value }]);
                    e.target.value = "";
                  }
                }}
              />
              <div className="flex flex-col gap-2">
                {members.map((member) => (
                  <MembersCard key={member.id} member={member} />
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              className="border w-[170px] h-[44px] rounded-xl bg-buttonGreen text-white"
              onClick={handleCreateMeeting}
              disabled={loading}
            >
              {loading ? "Creating..." : "Send Invites"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const UpcomingMettingCard = ({ meeting, connectToVideo }) => {
  const navigate = useNavigate();

  const handleJoinMeeting = async () => {
    try {
      const response = await api.post("/join/", { meeting_id: meeting.id });

      // Ensure the response contains the Twilio room name
      if (!response.data.twilio_room_name) {
        throw new Error("Twilio room name is missing in the response");
      }

      // Redirect to the LiveVideo page with the room name and token
      navigate(`/live-video`, {
        state: {
          twilio_room_name: response.data.twilio_room_name,
          twilio_token: response.data.twilio_token,
          participants: response.data.participants,
        },
      });
    } catch (err) {
      console.error("Failed to join meeting", err);
      toast.error("Failed to join meeting");
    }
  };

  return (
    <div className="flex flex-col w-[273px] h-[190px] bg-white rounded-xl border border-borderGray2 p-6 gap-6">
      <div>
        <div className="flex flex-col text-[12px] text-textPrimary gap-2">
          <h2>{meeting.title}</h2>
          <h2>
            {new Date(meeting.start_time).toLocaleString()} -{" "}
            {new Date(meeting.end_time).toLocaleString()}
          </h2>
        </div>
      </div>
      <div className="w-[225px] h-[53px] border-black border-t flex justify-end items-center pt-4 gap-8">
        <button
          className="border border-colorGreen py-2 px-4 text-[14px] text-colorGreen rounded-xl"
          onClick={handleJoinMeeting}
        >
          Join Meeting
        </button>
      </div>
    </div>
  );
};

const PastMeetings = ({ meeting }) => {
  return (
    <div className="max-md:w-full w-[345px] h-[114px] bg-white p-6 gap-6 flex items-center rounded-2xl">
      <div className="w-full">
        <div className="flex items-center w-full gap-4">
          <img src={dateIcon} className="h-[38px] w-[38px]" />
          <div className="flex flex-col text-[12px] text-textPrimary gap-2">
            <h2>{meeting.title}</h2>
            <h2>
              {new Date(meeting.start_time).toLocaleString()} -{" "}
              {new Date(meeting.end_time).toLocaleString()}
            </h2>
          </div>
          <img src={options} className="w-6 h-6 ml-auto" />
        </div>
      </div>
    </div>
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