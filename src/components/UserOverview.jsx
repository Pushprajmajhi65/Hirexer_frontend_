import notifaction from "../images/mainScreen/notifaction.png";
import settting from "../images/mainScreen/settings.png";
import logo from "../images/logo.png";
import overview from "../images/Commonimg/overview.png";
import feed from "../images/Commonimg/feed.png";
import meeting from "../images/Commonimg/meeting.png";
import weather from "../images/Commonimg/weather.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import navicon from "../images/Commonimg/navicon.png";
import { MoreProfileOptions } from "./profile";

export const UserOverviewUI = () => {
  const [showNavBar, setShowNavBar] = useState(false);
  const toggleNavBar = () => {
    setShowNavBar((prev) => !prev);
  };

  return (
    <div className="flex w-ful h-full gap-8 bg-backgroundGray max-sm:px-0 px-[40px] pb-[80px] justify-center xl:justify-start xl:p-0">
      <NavBar />
      {showNavBar ? (
        <div className="fixed z-20 w-full h-full border" onClick={toggleNavBar}>
          <SmallScreenNavBar />
        </div>
      ) : null}
      <div className="flex flex-col w-full lg:w-[1100px]  h-full gap-6 px-[40px] pb-[80px] xl:p-0">
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
        <div className="h-auto md:h-[131px] w-full bg-backgroundGreen rounded-xl p-6 flex flex-col md:flex-row">
          <h1 className="text-[30px] font-semibold text-textPrimary">
            Good Morning,
            <br />
            Pushpraj
          </h1>
          <div className="md:ml-auto w-[214px] h-full p-4 flex flex-col items-center justify-center gap-2">
            <div className="flex items-center gap-8">
              <h1 className="text-[36px] font-semibold">16</h1>
              <img src={weather} className="w-[66px] h-[53px]" />
            </div>
            <h2 className="text-xs font-semibold">
              16:09 30th Sep Monday
              <h2 className="w-full text-xs font-semibold text-end">
                Kathmandu
              </h2>
            </h2>
          </div>
        </div>
        <div className="flex flex-col w-full gap-6 xl:flex-row">
          <div className="flex flex-col gap-6 xl:hidden">
            <h1 className="text-[32px] text-textPrimary font-medium">
              Upcoming Meetings
            </h1>
            <UpcomingMeetingCard />
          </div>
          <div className="flex flex-col items-start w-full gap-6 xl:hidden">
            <h1 className="text-[32px] text-textPrimary font-medium">
              Connections
            </h1>
            <div className="flex w-full gap-6 max-lg:flex-wrap">
              <div className="flex flex-col w-auto gap-4 max-md:w-full">
                <h1 className="text-[16px] text-textPrimary font-medium">
                  Requests
                </h1>
                <FriendRequestTab />
                <FriendRequestTab />
                <FriendRequestTab />
              </div>
              <div className="flex flex-col w-[360px] gap-4 max-md:w-full">
                <h1 className="text-[16px] text-textPrimary font-medium">
                  Friends
                </h1>
                <FriendsTab />
                <FriendsTab />
                <FriendsTab />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h1 className="text-[32px] text-textPrimary font-medium">
              Invitations
            </h1>
            <div className="w-full overflow-auto">
              <div className="h-[44px] w-full xl:w-[668px]  flex items-center gap-3 bg-white rounded-t-2xl">
                <h2 className="w-[48px] text-center text-textSecondary text-[12px]">
                  SN
                </h2>
                <h2 className="w-[170px] text-textSecondary text-[12px]">
                  Work Space
                </h2>
                <h2 className="w-[168px] text-textSecondary text-[12px] max-sm:hidden">
                  Invite Date
                </h2>
                <h2 className="w-[271px] text-textSecondary text-[12px] max-sm:hidden">
                  Message
                </h2>
              </div>
              <InvitationsCard />
              <InvitationsCard />
              <InvitationsCard />
            </div>
            <h1 className="text-[32px] text-textPrimary font-medium">Tasks</h1>
            <div className="w-full overflow-auto">
              <div className="h-[44px] w-full xl:w-[668px] flex items-center gap-3 bg-white rounded-t-2xl">
                <h2 className="w-[48px] text-center text-textSecondary text-[12px]">
                  SN
                </h2>
                <h2 className="w-[170px] text-textSecondary text-[12px]">
                  Task Name
                </h2>
                <h2 className="w-[168px] text-textSecondary text-[12px] max-sm:hidden">
                  Work Space
                </h2>
                <h2 className="w-[271px] text-textSecondary text-[12px] max-sm:hidden">
                  Due Date
                </h2>
              </div>
              <InvitationsCard />
              <InvitationsCard />
              <InvitationsCard />
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex-col hidden gap-6 xl:flex">
              <h1 className="text-[32px] text-textPrimary font-medium">
                Upcoming Meetings
              </h1>
              <UpcomingMeetingCard />
            </div>
            <div className="flex-col items-start hidden gap-6 xl:flex">
              <h1 className="text-[32px] text-textPrimary font-medium">
                Connections
              </h1>
              <div className="flex flex-col flex-wrap gap">
                <div className="flex flex-col gap-4 ">
                  <h1 className="text-[16px] text-textPrimary font-medium">
                    Requests
                  </h1>
                  <FriendRequestTab />
                  <FriendRequestTab />
                  <FriendRequestTab />
                </div>
                <div className="flex flex-col gap-4">
                  <h1 className="text-[16px] text-textPrimary font-medium">
                    Friends
                  </h1>
                  <FriendsTab />
                  <FriendsTab />
                  <FriendsTab />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const NavBar = () => {
  return (
    <div className="hidden w-[248px] h-screen bg-white rounded-r-lg px-6 py-8 xl:flex flex-col gap-[70px] sticky top-0">
      <img src={logo} className="w-[50px] h-[44px]" />
      <div className="flex flex-col gap-4 text-[16px] font-normal text-textPrimary">
        <Link
          to="/overview"
          className="flex gap-2 hover:bg-backgroundGreen hover:border-l-[3px] hover:border-borderGreen h-[46px] items-center px-2 py-[10px] rounded-e-xl"
        >
          <img src={overview} className="w-5 h-5" />
          Overview
        </Link>
        <Link
          to="/feed"
          className="flex gap-2 hover:bg-backgroundGreen hover:border-l-[3px] hover:border-borderGreen h-[46px] items-center px-2 py-[10px] rounded-e-xl"
        >
          <img src={feed} className="w-5 h-5" />
          Feed
        </Link>
        <Link
          to="/meeting"
          className="flex gap-2 hover:bg-backgroundGreen hover:border-l-[3px] hover:border-borderGreen h-[46px] items-center px-2 py-[10px] rounded-e-xl"
        >
          <img src={meeting} className="w-5 h-5" />
          Meetings
        </Link>
        <Link
          to="/employee"
          className="flex gap-2 hover:bg-backgroundGreen hover:border-l-[3px] hover:border-borderGreen h-[46px] items-center px-2 py-[10px] rounded-e-xl"
        >
          <img src={meeting} className="w-5 h-5" />
          Employees
        </Link>
      </div>
    </div>
  );
};
export const SmallScreenNavBar = () => {
  return (
    <div className="max-xl:flex hidden w-[248px] h-screen bg-white rounded-r-lg px-6 py-8 flex-col gap-[70px] fixed z-10 left-0">
      <img src={logo} className="w-[50px] h-[44px]" />
      <div className="flex flex-col gap-4 text-[16px] font-normal text-textPrimary">
        <Link
          to="/overview"
          className="flex gap-2 hover:bg-backgroundGreen hover:border-l-[3px] hover:border-borderGreen h-[46px] items-center px-2 py-[10px] rounded-e-xl"
        >
          <img src={overview} className="w-5 h-5" />
          Overview
        </Link>
        <Link
          to="/feed"
          className="flex gap-2 hover:bg-backgroundGreen hover:border-l-[3px] hover:border-borderGreen h-[46px] items-center px-2 py-[10px] rounded-e-xl"
        >
          <img src={feed} className="w-5 h-5" />
          Feed
        </Link>
        <Link
          to="/meeting"
          className="flex gap-2 hover:bg-backgroundGreen hover:border-l-[3px] hover:border-borderGreen h-[46px] items-center px-2 py-[10px] rounded-e-xl"
        >
          <img src={meeting} className="w-5 h-5" />
          Meetings
        </Link>
      </div>
    </div>
  );
};

export const FriendRequestTab = () => {
  return (
    <div className="flex flex-col gap-6 w-full max-sm:h-[130px]">
      <div className="w-full h-full sm:h-[96px] bg-white rounded-xl flex items-center p-[16px] gap-[14px]">
        <div className=" w-[40px] h-[40px] border rounded-full max-sm:hidden"></div>
        <div className="w-[276x] h-[64px] flex flex-col gap-[14px]">
          <h2 className="text-[10px] font-medium leading-5 text-textDarkBlue">
            <span className="font-bold">Rachel Podrez </span>sent you a
            connection request
          </h2>
          <div className="flex gap-4">
            <button className="w-[80px] sm:w-[130px] h-[36px] bg-buttonBlue rounded-3xl text-white">
              Accept
            </button>
            <button className="w-[80px] sm:w-[130px] h-[36px] bg-buttonLightGray rounded-3xl text-buttonBlue">
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export const FriendsTab = () => {
  return (
    <div className="flex flex-col w-full gap-6">
      <div className="w-full h-[96px] bg-white rounded-xl flex items-center p-[16px] gap-[14px]">
        <div className="flex gap-[14px] items-center">
          <div className=" w-[60px] h-[60px] border rounded-full"></div>
          <div className="gap-2">
            <h1 className="text-[16px] font-bold text-textDarkBlue">
              Jim Hopper
            </h1>
            <p className="text-xs text-textDarkBlue">Workspace, others</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const UpcomingMeetingCard = () => {
  return (
    <div className="w-full xl:w-[362px] max-sm:h-auto h-[414px] bg-white rounded-2xl p-6 gap-4 flex flex-col">
      <div className="flex items-center">
        <h1 className="text-base font-bold">Upcoming appointments</h1>
        <span className="ml-auto text-xs font-semibold text-colorCyan">
          View all
        </span>
      </div>
      <div className="w-full xl:w-[314px] h-[86px] rounded-2xl bg-backgroundCard py-[10px] px-3 flex-col flex max-md:gap-0 md:flex-row max-xl:gap-6 max-xl:items-center xl:flex-col xl:gap-1">
        <h2 className="text-colorCyan font-semibold text-[120x]">Today</h2>
        <h1 className="text-[16px] font-bold">Susan Kardashian</h1>
        <h3 className="font-medium text-borderGray text-[12px]">
          01:00PM - 03:00PM
        </h3>
      </div>
      <span className="w-full border border-borderGray2 h-2px"></span>
      <div className="flex flex-wrap gap-3">
        <MeetingSceduleCard />
        <MeetingSceduleCard />
        <MeetingSceduleCard />
      </div>
    </div>
  );
};

const MeetingSceduleCard = () => {
  const SmallCard = () => {
    return (
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center justify-center">
          <span className="text-[10px] font-bold">jan</span>
          <span className="text-[20px] font-bold">14</span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold">Rachel Rogers #123</span>
          <span className="text-xs text-borderGray">01:15PM - 02:00PM</span>
        </div>
      </div>
    );
  };
  return (
    <div className="flex px-3 bg-backgroundCard w-full lg:w-[314px] h-[64px] rounded-2xl">
      <SmallCard />
    </div>
  );
};

const InvitationsCard = () => {
  return (
    <div className=" w-full xl:w-[668px] h-[56px] bg-backgroundGray2 flex">
      <div className="flex items-center justify-center w-[48px] h-[56px] max-sm:p-6">
        1
      </div>
      <div className="flex flex-col items-center  w-[170px] h-[56px] py-2 px-4">
        <h1 className="w-full">John Doe</h1>
        <h2 className="text-[10px] w-full text-borderGray">
          john.doe@gmail.com
        </h2>
      </div>
      <div className="flex flex-col justify-center w-[168px] h-[56px] py-2 px-4">
        <h1 className="w-fit max-sm:hidden">Jan 1, 2022</h1>
      </div>
      <div className="flex flex-col justify-center w-[168px] h-[56px] py-2 px-4">
        <h1 className="w-full max-sm:hidden">No Message</h1>
      </div>
    </div>
  );
};
