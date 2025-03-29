import { format, formatDistanceToNow, parseISO } from "date-fns";


export function formatUserReadableDate(isoString) {
  const date = new Date(isoString);

  const options = { 
    month: "long", 
    day: "numeric", 
    hour: "2-digit", 
    minute: "2-digit", 
    second: "2-digit", 
    hour12: true,
    timeZone: "UTC"
  };

  return date.toLocaleString("en-US", options).replace(",", "");
}

export function formatTime(isoString) {
  const date = new Date(isoString);

  const options = { 
    hour: "2-digit", 
    minute: "2-digit", 
    second: "2-digit", 
    hour12: true,
    timeZone: "UTC"
  };

  const timeString = date.toLocaleString("en-US", options);
  const timePart = timeString.split(",")[1];

  if (timePart) {
    return timePart.trim();
  } else {
    return timeString.trim(); 
  }
}

export const TimeAgo = ({ date }) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};
