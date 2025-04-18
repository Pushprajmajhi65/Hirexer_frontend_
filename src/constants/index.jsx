import {
  Newspaper,
  Users,
  LayoutGrid,
  Video,
  FileText,
  Briefcase,
  MessageCircle,
} from "lucide-react";

export const DashBoardMenuItems = [
  {
    icon: <LayoutGrid size={20} />,
    name: "Overview",
    allowedRoles: ["headmember", "member"],
  },
  {
    icon: <Newspaper size={20} />,
    name: "Feed",
    allowedRoles: ["headmember", "member"],
  },
  {
    icon: <Video size={20} />,
    name: "Meetings",
    allowedRoles: ["headmember", "member"],
  },
  {
    icon: <Users size={20} />,
    name: "Employee",
    allowedRoles: ["headmember"],
  },
  {
    icon: <FileText size={20} />,
    name: "Applications",
    allowedRoles: ["headmember"],
  },
  {
    icon: <Briefcase size={20} />,
    name: "Applied Jobs",
    allowedRoles: ["member"],
  },
  {
    icon: <MessageCircle size={20} />, 
    name: "Chat",
    allowedRoles: ["headmember", "member"],
  }
];

export const IndustryNames = [
  { id: 1, name: "Information Technology" },
  { id: 2, name: "Healthcare" },
  { id: 3, name: "Finance" },
  { id: 4, name: "Education" },
  { id: 5, name: "Manufacturing" },
  { id: 6, name: "Others" },
];

export const employeeTableHeader = [
  { id: 1, name: "SN" },
  { id: 2, name: "Member Name" },
  { id: 3, name: "Join Date" },
  { id: 4, name: "Email" },
  { id: 5, name: "Type" },
  { id: 7, name: "Status" },
  { id: 8, name: "Actions" },
];

export const countryData = [
  { id: 1, name: "Nepal" },
  { id: 2, name: "India" },
  { id: 3, name: "United States" },
  { id: 4, name: "United Kingdom" },
  { id: 5, name: "Canada" },
  { id: 6, name: "Australia" },
];

export const timezoneData = [
  {
    name: "Pacific Standard Time",
    abbreviation: "PST",
    utc_offset: "-08:00",
  },
  {
    name: "Nepal Standard Time",
    abbreviation: "NST",
    utc_offset: "+05:45",
  },
  {
    name: "Eastern Standard Time",
    abbreviation: "EST",
    utc_offset: "-05:00",
  },
  {
    name: "Greenwich Mean Time",
    abbreviation: "GMT",
    utc_offset: "±00:00",
  },
  {
    name: "Central European Time",
    abbreviation: "CET",
    utc_offset: "+01:00",
  },
];

export const jobType = [
  {
    id: 1,
    name: "Casual",
  },
  { id: 2, name: "Job" },
];

export const experienceLevel = [
  { id: 1, name: "Less than 1 year" },
  { id: 2, name: "1-2 years" },
  { id: 3, name: "2-5 years" },
  { id: 4, name: "More than 5 years" },
];

export const overviewTable = [
  { id: 1, name: "SN" },
  { id: 2, name: "Member Name" },
  { id: 3, name: "Email" },
  { id: 4, name: "Joined At" },
  { id: 5, name: "Type" },
  { id: 6, name: "Status" },
];

export const employeeStatus = [
  {
    id: 1,
    name: "InActive",
  },
  {
    id: 2,
    name: "Active",
  },
  { id: 3, name: "Transferred" },
];

export const jobStatuses = [
  {
    id: 1,
    name: "Submitted",
  },
  {
    id: 2,
    name: "In Review",
  },
  {
    id: 3,
    name: "Schedule Meeting",
  },
  {
    id: 4,
    name: "Pending",
  },
  {
    id: 5,
    name: "Approved",
  },
  {
    id: 6,
    name: "Rejected",
  },
];
