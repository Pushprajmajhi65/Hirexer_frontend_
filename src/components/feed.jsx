import { NavBar } from "./UserOverview";
import { FriendRequestTab, FriendsTab } from "./UserOverview";
import notifaction from "../images/mainScreen/notifaction.png";
import settting from "../images/mainScreen/settings.png";
import ad from "../images/Commonimg/ad.png";
import options from "../images/Commonimg/options.png";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Separator } from "./ui/separator";
import { MoreProfileOptions } from "./profile";
import { useState } from "react";
import { SmallScreenNavBar } from "./UserOverview";
import navicon from "../images/Commonimg/navicon.png";

export const FeedUI = () => {
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
      <div className="flex flex-col w-full xl:w-[1100px] h-full gap-6 px-[40px] pb-[80px] xl:p-0">
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
        <div className="flex flex-row gap-6 max-xl:flex-wrap">
          <div className="flex flex-col gap-6">
            <h1 className="text-[32px] font-semibold text-textPrimary">
              My Feeds
            </h1>
            <FeedCard />
            <FeedCard />
            <FeedCard />
          </div>
          <div className="flex flex-col flex-wrap items-start w-full gap-6">
            <h1 className="text-[32px] text-textPrimary font-medium">
              Connections
            </h1>
            <div className="flex flex-wrap w-full gap-6">
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
        </div>
      </div>
    </div>
  );
};

const FeedCard = () => {
  return (
    <div className=" w-auto lg:w-[720px] h-auto lg:h-[596px] bg-white rounded-2xl p-6 flex flex-col gap-4">
      <div className="flex gap-2">
        <div className="w-[56px] h-[56px] border border-black rounded-full"></div>
        <div>
          <h1 className="font-semibold text-[16px] text-textPrimary">
            Workspace Name
          </h1>
          <p className="text-xs font-normal">Person Name</p>
          <p className="text-xs font-normal text-textSecondary">5min ago</p>
        </div>
        <div className="ml-auto">
          <Popover>
            <PopoverTrigger>
              <img src={options} className="w-6" />
            </PopoverTrigger>
            <PopoverContent className="flex bg-backgroundGray2">
              <div className="w-full h-[165px] flex flex-col gap-2">
                <div className="absolute flex items-center w-[213px] gap-2">
                  <div className="w-8 h-8 border border-black rounded-full"></div>
                  <div>
                    <h1 className="text-[14px] font-semibold">Person Name</h1>
                    <p className="text-[12px] text-textSecondary">
                      Person Name
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center w-full h-full gap-2">
                  <Separator className="mt-2" />
                  <button className="border rounded-xl bg-backgroundGreen text-white h-[40px] w-full">
                    Send Connections
                  </button>
                  <button className="border rounded-xl border-borderGreen text-borderGreen h-[40px] w-full">
                    Apply Now
                  </button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="text-[16px] w-auto lg:w-[672px]">
        Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo
        ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis
        dis parturient montes, nascetur ridiculus mus. Donec quam felis,
        ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa
        quis enim. Donec pede justo, fringilla vel, aliquet nec,
      </div>
      <img src={ad} className="w-auto" />
    </div>
  );
};
