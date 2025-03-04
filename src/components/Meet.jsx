import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const Meet = () => {
  const [meetings, setMeetings] = useState([]);
  const [meetingName, setMeetingName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [email, setEmail] = useState("");
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);
  const navigate = useNavigate();

  // Fetch all meetings for the logged-in user
  const fetchMeetings = async () => {
    try {
      const response = await axios.get("/api/meetings/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setMeetings(response.data.meetings);
    } catch (error) {
      toast.error("Failed to fetch meetings");
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  // Create a new meeting
  const handleCreateMeeting = async () => {
    try {
      const response = await axios.post(
        "/api/meetings/create/",
        {
          name: meetingName,
          start_time: startTime,
          end_time: endTime,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      toast.success("Meeting created successfully");
      setMeetingName("");
      setStartTime("");
      setEndTime("");
      fetchMeetings(); // Refresh the list of meetings
    } catch (error) {
      toast.error("Failed to create meeting");
    }
  };

  // Send an invitation to a meeting
  const handleSendInvitation = async (meetingId) => {
    try {
      await axios.post(
        `/api/meetings/${meetingId}/send-invitation/`,
        { email },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      toast.success("Invitation sent successfully");
      setEmail("");
    } catch (error) {
      toast.error("Failed to send invitation");
    }
  };

  // Join a meeting
  const handleJoinMeeting = async (meetingId) => {
    try {
      const response = await axios.get(`/api/meetings/${meetingId}/join/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      const { token, channel_name } = response.data;
      // Redirect to the video call page with the token and channel name
      navigate(`/video-call?token=${token}&channel=${channel_name}`);
    } catch (error) {
      toast.error("Failed to join meeting");
    }
  };

  return (
    <div className="flex flex-col w-full h-full gap-8 bg-backgroundGray px-[40px] pb-[80px] xl:p-0">
      <div className="flex flex-col xl:items-baseline w-full xl:w-[1100px] h-[100%] gap-6">
        <div className="w-full h-[92px] flex items-center justify-end gap-[10px]">
          <div className="flex items-center gap-2 p-3">
            <img src={notifaction} className="w-5 h-5" />
            <img src={settting} className="w-5 h-5" />
          </div>
        </div>
        <div className="flex flex-wrap gap-8">
          <div className="flex flex-col gap-6">
            <h1 className="text-[32px] text-textPrimary font-medium">Meetings</h1>
            <div className="grid grid-cols-2 gap-6 max-lg:flex max-lg:flex-wrap max-md:w-full w-[660px]">
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
                            value={meetingName}
                            onChange={(e) => setMeetingName(e.target.value)}
                            className="w-full border h-[44px] rounded-xl p-2 font-normal text-[16px]"
                          />
                        </h2>
                        <h2>
                          Start Time:{" "}
                          <input
                            type="datetime-local"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full border h-[44px] rounded-xl p-2 font-normal text-[16px]"
                          />
                        </h2>
                        <h2>
                          End Time:{" "}
                          <input
                            type="datetime-local"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full border h-[44px] rounded-xl p-2 font-normal text-[16px]"
                          />
                        </h2>
                      </div>
                    </div>
                    <div className="flex justify-center gap-4">
                      <button
                        className="border w-[170px] h-[44px] rounded-xl bg-white text-textBlack"
                        onClick={() => setMeetingName("")}
                      >
                        Cancel
                      </button>
                      <button
                        className="border w-[170px] h-[44px] rounded-xl bg-buttonGreen text-white"
                        onClick={handleCreateMeeting}
                      >
                        Create Meeting
                      </button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <h1 className="text-[32px] text-textPrimary font-medium">Calendar</h1>
            <Calendar
              mode="range"
              className="border rounded-xl border-borderGray max-sm:w-auto w-[332px] h-[340px] bg-white grid place-content-center font-[Poppins] p-4 gap-6"
            />
          </div>
        </div>
        <div className="flex flex-col h-[314px] w-full py-8 gap-[24px]">
          <h1 className="text-[24px] font-medium">Upcoming Meetings</h1>
          <div className="overflow-scroll rounded-md whitespace-nowrap no-scrollbar">
            <div className="flex gap-6">
              {meetings.map((meeting) => (
                <div
                  key={meeting.meeting_id}
                  className="flex flex-col w-[273px] h-[190px] bg-white rounded-xl border border-borderGray2 p-6 gap-6"
                >
                  <div>
                    <div className="flex flex-col text-[12px] text-textPrimary gap-2">
                      <h2>{meeting.name}</h2>
                      <h2>
                        {new Date(meeting.start_time).toLocaleString()} -{" "}
                        {new Date(meeting.end_time).toLocaleString()}
                      </h2>
                    </div>
                  </div>
                  <div className="w-[225px] h-[53px] border-black border-t flex justify-end items-center pt-4 gap-8">
                    <button
                      className="border border-colorGreen py-2 px-4 text-[14px] text-colorGreen rounded-xl"
                      onClick={() => handleJoinMeeting(meeting.meeting_id)}
                    >
                      Join Meeting
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Meet;