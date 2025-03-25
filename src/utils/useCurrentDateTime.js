import { useState, useEffect } from "react";

const getFormattedDate = () => {
  const date = new Date();

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  const day = date.getDate();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];

  const weekdayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const weekday = weekdayNames[date.getDay()];

  const daySuffix = (d) => {
    if (d > 3 && d < 21) return "th";
    switch (d % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${hours}:${minutes} ${day}${daySuffix(day)} ${month} ${weekday}`;
};

const useCurrentTime = () => {
  const [currentTime, setCurrentTime] = useState(getFormattedDate());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getFormattedDate());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return currentTime;
};

export default useCurrentTime;
