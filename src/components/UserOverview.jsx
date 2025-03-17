import React, { useState, useEffect } from 'react';
import notifaction from "../images/mainScreen/notifaction.png";
import settting from "../images/mainScreen/settings.png";
import logo from "../images/logo.png";
import overview from "../images/Commonimg/overview.png";
import feed from "../images/Commonimg/feed.png";
import meeting from "../images/Commonimg/meeting.png";
import weather from "../images/Commonimg/weather.png";
import navicon from "../images/Commonimg/navicon.png"; // Add this line

import { Link } from "react-router-dom";
import { MoreProfileOptions } from "./profile";
import EmployeeTable, { ManageEmployeeCard } from "./employee";
import { FaChartPie, FaNewspaper, FaUsers, FaUserTie, FaClipboardList, FaCalendarAlt } from "react-icons/fa";

export const UserOverviewUI = () => {
  const [showNavBar, setShowNavBar] = useState(false);
  const [weatherData, setWeatherData] = useState({ temperature: null, icon: null });
  const [location, setLocation] = useState('Kathmandu');

  const toggleNavBar = () => {
    setShowNavBar((prev) => !prev);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const date = now.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
    const day = now.toLocaleDateString([], { weekday: 'long' });
    return `${time} ${date} ${day}`;
  };

  useEffect(() => {
    const fetchWeather = async () => {
      const apiKey = 'b26e36966f597cdc7258c5b6dd7202d1';
      const city = location;
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        setWeatherData({
          temperature: Math.round(data.main.temp),
          icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        });
      } catch (error) {
        console.error('Failed to fetch weather data:', error);
      }
    };

    fetchWeather();
  }, [location]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchLocationName(latitude, longitude);
        },
        (error) => {
          console.error('Error fetching location:', error);
        }
      );
    }
  }, []);

  const fetchLocationName = async (latitude, longitude) => {
    const apiKey = 'b26e36966f597cdc7258c5b6dd7202d1';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setLocation(data.name);
    } catch (error) {
      console.error('Failed to fetch location:', error);
    }
  };
  return (
    <div className="flex w-full h-full gap-8 bg-backgroundGray px-5 max-sm:px-5 pb-[80px] justify-center xl:justify-start xl:p-0">
      <NavBar />
  
      {/* Overlay and Sidebar for Mobile */}
      {showNavBar && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300 ease-in-out"
            onClick={toggleNavBar}
          ></div>
          <div
            className="fixed z-30 w-[248px] h-screen bg-white rounded-r-lg px-6 py-8 transform transition-transform duration-300 ease-in-out"
            style={{
              transform: showNavBar ? "translateX(0)" : "translateX(-100%)",
            }}
          >
            <SmallScreenNavBar />
          </div>
        </>
      )}
  
      <div className="flex flex-col w-full max-w-[1100px] h-full gap-6 sm:px-2 px-[40px] sm:pb-0 pb-[80px] xl:px-0 xl:p-0">
        <div className="w-full h-[92px] flex items-center justify-end gap-[10px]">
          <button className="mr-auto xl:hidden" onClick={toggleNavBar}>
            <img
              src={showNavBar ? closeIcon : navicon} // Use the imported navicon and closeIcon
              className="w-6 h-6"
              alt={showNavBar ? "Close Menu" : "Open Menu"}
            />
          </button>
          <div className="flex items-center gap-2 p-3">
            <MoreProfileOptions />
          </div>
        </div>
  
        {/* Welcome Section */}
        <div className="h-auto md:h-[131px] w-full bg-backgroundGreen rounded-xl p-6 flex flex-col md:flex-row">
          <h1 className="text-[30px] font-semibold text-textPrimary">
            {getGreeting()},
            <br />
            Pushpraj
          </h1>
          <div className="md:ml-auto w-[214px] h-full p-4 flex flex-col items-center justify-center gap-2">
            <div className="flex items-center gap-8">
              <h1 className="text-[36px] font-semibold">{weatherData.temperature}°C</h1>
              {weatherData.icon && <img src={weatherData.icon} className="w-[66px] h-[53px]" alt="Weather" />}
            </div>
            <h2 className="text-xs font-semibold">
              {getCurrentDateTime()}
            </h2>
            <span className="w-full text-xs font-semibold text-end">
              {location}
            </span>
          </div>
        </div>
  
        {/* Upcoming Meetings */}
        <div className="flex flex-col w-full gap-6 xl:flex-row">
          <div className="flex flex-col gap-6 w-full">
            <h1 className="text-[32px] text-textPrimary font-medium">
              Upcoming Meetings
            </h1>
            <UpcomingMeetingCard />
          </div>
        </div>
  
        <ManageEmployeeCard />
      </div>
    </div>
  );


}



  export const NavBar = () => {
    return (
      <div className="hidden w-[248px] h-screen bg-white rounded-r-lg px-6 py-8 xl:flex flex-col gap-[70px] sticky top-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <img src={logo} className="w-[50px] h-[44px]" alt="Logo" />
        <div className="flex flex-col gap-4 text-[16px] font-normal text-textPrimary">
          <Link to="/overview" className="flex gap-2 hover:bg-backgroundGreen hover:border-l-[3px] hover:border-borderGreen h-[46px] items-center px-2 py-[10px] rounded-e-xl transition-all duration-300">
            <FaChartPie className="w-5 h-5" /> Overview
          </Link>
          <Link to="/feed" className="flex gap-2 hover:bg-backgroundGreen hover:border-l-[3px] hover:border-borderGreen h-[46px] items-center px-2 py-[10px] rounded-e-xl transition-all duration-300">
            <FaNewspaper className="w-5 h-5" /> Feed
          </Link>
          <Link to="/meeting" className="flex gap-2 hover:bg-backgroundGreen hover:border-l-[3px] hover:border-borderGreen h-[46px] items-center px-2 py-[10px] rounded-e-xl transition-all duration-300">
            <FaCalendarAlt className="w-5 h-5" /> Meetings
          </Link>
          <Link to="/employee" className="flex gap-2 hover:bg-backgroundGreen hover:border-l-[3px] hover:border-borderGreen h-[46px] items-center px-2 py-[10px] rounded-e-xl transition-all duration-300">
            <FaUsers className="w-5 h-5" /> Employees
          </Link>
          <Link to="/application" className="flex gap-2 hover:bg-backgroundGreen hover:border-l-[3px] hover:border-borderGreen h-[46px] items-center px-2 py-[10px] rounded-e-xl transition-all duration-300">
            <FaClipboardList className="w-5 h-5" /> Application
          </Link>
          <Link to="/applications" className="flex gap-2 hover:bg-backgroundGreen hover:border-l-[3px] hover:border-borderGreen h-[46px] items-center px-2 py-[10px] rounded-e-xl transition-all duration-300">
            <FaUserTie className="w-5 h-5" /> My Application
          </Link>
        </div>
      </div>
    );
  };
  
  export const SmallScreenNavBar = () => {
    return (
      <div className="flex flex-col gap-[70px]">
        <FaChartPie className="text-4xl text-gray-700" />
        <div className="flex flex-col gap-4 text-[16px] font-normal text-textPrimary">
          <Link to="/overview" className="flex gap-2 hover:bg-backgroundGreen hover:border-l-[3px] hover:border-borderGreen h-[46px] items-center px-2 py-[10px] rounded-e-xl transition-all duration-300">
            <FaChartPie className="w-5 h-5" /> Overview
          </Link>
          <Link to="/feed" className="flex gap-2 hover:bg-backgroundGreen hover:border-l-[3px] hover:border-borderGreen h-[46px] items-center px-2 py-[10px] rounded-e-xl transition-all duration-300">
            <FaNewspaper className="w-5 h-5" /> Feed
          </Link>
          <Link to="/meeting" className="flex gap-2 hover:bg-backgroundGreen hover:border-l-[3px] hover:border-borderGreen h-[46px] items-center px-2 py-[10px] rounded-e-xl transition-all duration-300">
            <FaCalendarAlt className="w-5 h-5" /> Meetings
          </Link>
          <Link to="/employee" className="flex gap-2 hover:bg-backgroundGreen hover:border-l-[3px] hover:border-borderGreen h-[46px] items-center px-2 py-[10px] rounded-e-xl transition-all duration-300">
            <FaUsers className="w-5 h-5" /> Employees
          </Link>
          <Link to="/application" className="flex gap-2 hover:bg-backgroundGreen hover:border-l-[3px] hover:border-borderGreen h-[46px] items-center px-2 py-[10px] rounded-e-xl transition-all duration-300">
            <FaClipboardList className="w-5 h-5" /> Application
          </Link>
          <Link to="/applications" className="flex gap-2 hover:bg-backgroundGreen hover:border-l-[3px] hover:border-borderGreen h-[46px] items-center px-2 py-[10px] rounded-e-xl transition-all duration-300">
            <FaUserTie className="w-5 h-5" /> My Application
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
    <div className="w-full h-auto bg-white rounded-2xl p-6 gap-4 flex flex-col">
      <div className="flex items-center">
        <h1 className="text-base font-bold">Upcoming appointments</h1>
        <span className="ml-auto text-xs font-semibold text-colorCyan">
          View all
        </span>
      </div>
      <div className="w-full h-[86px] rounded-2xl bg-backgroundCard py-[10px] px-3 flex flex-col max-md:gap-0 md:flex-row max-xl:gap-6 max-xl:items-center xl:flex-col xl:gap-1">
        <h2 className="text-colorCyan font-semibold text-[20px]">Today</h2>
        <h1 className="text-[16px] font-bold">Susan Kardashian</h1>
        <h3 className="font-medium text-borderGray text-[12px]">
          01:00PM - 03:00PM
        </h3>
      </div>
      <span className="w-full border border-borderGray2"></span>
      <div className="flex flex-wrap gap-3 w-full">
        <MeetingSceduleCard className="w-full md:w-[48%] lg:w-[32%]" />
        <MeetingSceduleCard className="w-full md:w-[48%] lg:w-[32%]" />
        <MeetingSceduleCard className="w-full md:w-[48%] lg:w-[32%]" />
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
