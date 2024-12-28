import notifaction from "../images/mainScreen/notifaction.png";
import settting from "../images/mainScreen/settings.png";
import orangeMeeting from "../images/Commonimg/meeting_orange.png";
import dateIcon from "../images/Commonimg/PastMeetings.png";
import options from "../images/Commonimg/options.png";
import { NavBar, SmallScreenNavBar } from "./UserOverview";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import navicon from "../images/Commonimg/navicon.png";
import { MoreProfileOptions } from "./profile";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export const MeetingUI = ({ connectToVideo }) => {
  const [date, setDate] = useState(new Date());
  const [showNavBar, setShowNavBar] = useState(false);
  const toggleNavBar = () => {
    setShowNavBar((prev) => !prev);
  };
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
            <img src={notifaction} className="w-5 h-5" />
            <img src={settting} className="w-5 h-5" />
          </div>
        </div>
        <div className="flex flex-wrap gap-8">
          <div className="flex flex-col gap-6">
            <h1 className="text-[32px] text-textPrimary font-medium">
              Meetings
            </h1>
            <div className="grid grid-cols-2 gap-6 max-lg:flex max-lg:flex-wrap max-md:w-full w-[660px]">
              <MeetingButton connectToVideo={connectToVideo} />
              <MeetingButton />
              <MeetingButton />
              <MeetingButton />
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
              className="border rounded-xl border-borderGray  max-sm:w-auto w-[332px] h-[340px] bg-white grid place-content-center font-[Poppins] p-4 gap-6"
            />
          </div>
        </div>
        <div className="flex flex-col h-[314px] w-full py-8 gap-[24px]">
          <h1 className="text-[24px] font-medium">Upcoming Meetings</h1>
          <div className="overflow-scroll rounded-md whitespace-nowrap no-scrollbar">
            <div className="flex gap-6">
              <UpcomingMettingCard />
              <UpcomingMettingCard />
              <UpcomingMettingCard />
              <UpcomingMettingCard />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <h1 className="text-[24px] font-medium">Past Meetings</h1>
          <div className="flex flex-wrap w-full gap-8">
            <PastMeetings />
            <PastMeetings />
            <PastMeetings />
            <PastMeetings />
            <PastMeetings />
            <PastMeetings />
            <PastMeetings />
            <PastMeetings />
            <PastMeetings />
            <PastMeetings />
            <PastMeetings />
          </div>
        </div>
      </div>
    </div>
  );
};

const MeetingButton = ({ connectToVideo }) => {
  const [meetingName, setMeetingName] = useState("");
  const [invalidInputMsg, setInvalidInputMsg] = useState("");

  console.log(meetingName);
  const handleConnect = (e) => {
    // trim spaces
    const trimmedChannelName = meetingName.trim();

    // validate input: make sure channelName is not empty
    if (trimmedChannelName === "") {
      e.preventDefault(); // keep the page from reloading on form submission
      setInvalidInputMsg("Channel name can't be empty."); // show warning
      setMeetingName(""); // resets channel name value in case user entered blank spaces
      return;
    }

    connectToVideo(trimmedChannelName);
  };
  const MembersCard = () => {
    return (
      <div className="flex flex-col w-full gap-6">
        <div className="w-full h-[51px] bg-white rounded-xl flex items-center p-[16px] gap-[14px] border">
          <div className="flex gap-[14px] items-center">
            <div className=" w-[25px] h-[25px] border rounded-full"></div>
            <div className="gap-2">
              <h1 className="text-[12px] font-bold text-textDarkBlue">
                Jim Hopper
              </h1>
              <p className="text-xs text-textDarkBlue">Workspace, others</p>
            </div>
          </div>
        </div>
      </div>
    );
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
                  onChange={(e) => {
                    setMeetingName(e.target.value);
                  }}
                />
              </h2>
              <h2>Meeting Time</h2>
              <h2>Meeting Type</h2>
            </div>
          </div>
          <div className="flex flex-col gap-[12px]">
            <h1>Members</h1>
            <div className="flex flex-col gap-2">
              <input
                className="w-full border h-[44px] rounded-xl p-2 font-normal text-[16px]"
                placeholder="hirexer@gmail.com"
              />
              <div className="flex flex-col gap-2">
                <MembersCard />
                <MembersCard />
                <MembersCard />
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-4">
            <button className="border w-[170px] h-[44px] rounded-xl bg-white text-textBlack">
              Cancel
            </button>
            <button
              className="border w-[170px] h-[44px] rounded-xl bg-buttonGreen text-white"
              onClick={() => {
                handleConnect();
              }}
            >
              Send Invites
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const UpcomingMettingCard = () => {
  return (
    <div className="flex flex-col w-[273px] h-[190px] bg-white rounded-xl border border-borderGray2 p-6 gap-6">
      <div>
        <div className="flex flex-col text-[12px] text-textPrimary gap-2">
          <h2>Meeting Name</h2>
          <h2>Nov 10, 11:30am - 01:20pm</h2>
          <div className="flex gap-3">
            <div className="px-2 py-1 border border-colorRed rounded-2xl text-colorRed">
              Meeting
            </div>
            <div className="px-2 py-1 border border-colorRed rounded-2xl text-colorRed">
              Desgin
            </div>
          </div>
        </div>
      </div>
      <div className="w-[225px] h-[53px] border-black border-t flex justify-end items-center pt-4 gap-8">
        <button className="border border-colorGreen py-2 px-4 text-[14px] text-colorGreen rounded-xl">
          Join Meeting
        </button>
      </div>
    </div>
  );
};

const PastMeetings = () => {
  return (
    <div className="max-md:w-full w-[345px] h-[114px] bg-white p-6 gap-6 flex items-center rounded-2xl">
      <div className="w-full">
        <div className="flex items-center w-full gap-4">
          <img src={dateIcon} className="h-[38px] w-[38px]" />

          <div className="flex flex-col text-[12px] text-textPrimary gap-2">
            <h2>Meeting Name</h2>
            <h2>Nov 10, 11:30am - 01:20pm</h2>
            <div className="flex gap-3">
              <div className="px-2 py-1 border border-colorRed rounded-2xl text-colorRed">
                Meeting
              </div>
              <div className="px-2 py-1 border border-colorRed rounded-2xl text-colorRed">
                Desgin
              </div>
            </div>
          </div>
          <img src={options} className="w-6 h-6 ml-auto" />
        </div>
      </div>
    </div>
  );
};
