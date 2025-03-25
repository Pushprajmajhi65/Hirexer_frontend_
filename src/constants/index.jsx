import { Newspaper, Users, LayoutGrid, Video, FileText } from "lucide-react";

export const DashBoardMenuItems = [
  {
    icon: <LayoutGrid size={20} />,
    name: "Overview",
  },
  {
    icon: <Newspaper size={20} />,
    name: "Feed",
  },
  {
    icon: <Video size={20} />,
    name: "Meetings",
  },
  {
    icon: <Users size={20} />,
    name: "Employee",
  },
  { icon: <FileText size={20} />, name: "Applications" },
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
  { id: 4, name: "DOB" },
  { id: 5, name: "Type" },
  { id: 6, name: "Ph. Number" },
  { id: 7, name: "Status" },
  { id: 8, name: "Actions" },
];
