import { useState, useEffect } from "react";
import remove from "../images/Commonimg/remove.png";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { NavBar } from "./UserOverview";

import api from "@/api";
import Lottie from 'react-lottie';



import NODATA from "../assets/NODATA.json";
import error404 from "../assets/error404.json";
export const Employee = () => {
  return (
    <div className="flex w-screen h-screen gap-8 bg-backgroundGray max-sm:px-0 px-[40px] pb-[80px] items-center xl:p-0">
      <NavBar />
      <ManageEmployeeCard />
    </div>
  );
};

export const ManageEmployeeCard = () => {
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  return (
    <div className="w-full max-w-[1100px] h-[755px] bg-white rounded-2xl px-6 py-6 flex flex-col gap-12">
      <div className="w-full border-b px-6 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-0 sm:h-[70px] pb-2 sm:pb-0">
  <div className="w-full">
    <h1 className="font-semibold text-textBlack text-[20px]">Manage Employee</h1>
    <p className="text-[14px] text-textSecondary font-normal">Manage teams and members.</p>
  </div>
  <Dialog>
    <DialogTrigger className="w-full sm:w-[101px] h-[40px] rounded-xl bg-buttonGreen text-white flex justify-center items-center p-2 sm:p-0">
      Invite
    </DialogTrigger>
    <InviteUserCard />
  </Dialog>
</div>
      <div>
        <input
          className="border w-full sm:w-[320px] h-11 rounded-xl px-4 py-2"
          placeholder="Search for email or name"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="overflow-scroll rounded-md whitespace-nowrap no-scrollbar">
        <div className="flex items-center border-t h-11 bg-backGroundCardGrayLight w-[1100px]">
          <h2 className="text-center min-w-14 h-fit text-headerGray2 text-[15px] font-medium">SN</h2>
          <h2 className="h-fit text-headerGray2 text-[15px] font-medium px-6 min-w-[296px]">Member Name</h2>
          <h2 className="h-fit text-headerGray2 text-[15px] font-medium px-6 min-w-[122px]">Join Date</h2>
          <h2 className="h-fit text-headerGray2 text-[15px] font-medium px-6 min-w-[122px]">DOB</h2>
          <h2 className="h-fit text-headerGray2 text-[15px] font-medium px-6 min-w-[117px]">Type</h2>
          <h2 className="h-fit text-headerGray2 text-[15px] font-medium px-6 min-w-[122px]">Ph.Number</h2>
          <h2 className="h-fit text-headerGray2 text-[15px] font-medium px-6 min-w-[100px]">Status</h2>
          <h2 className="h-fit text-headerGray2 text-[15px] font-medium px-6 min-w-[64px]">Action</h2>
        </div>
        <EmployeeTable searchQuery={searchQuery} />
      </div>
    </div>
  );
};





const EmployeeTable = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Simulate data fetch
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      setError(false); // Set true to test error state
    }, 2000); // Simulating API delay
  }, []);

  // Static employee data
  const employees = [
    {
      id: 1,
      username: "John Doe",
      email: "john.doe@example.com",
      joined_at: "2023-05-12",
      role: "Software Engineer",
      status: "Active",
    },
    {
      id: 2,
      username: "Jane Smith",
      email: "jane.smith@example.com",
      joined_at: "2022-11-25",
      role: "Project Manager",
      status: "Inactive",
    },
    {
      id: 3,
      username: "Michael Johnson",
      email: "michael.johnson@example.com",
      joined_at: "2021-07-19",
      role: "Designer",
      status: "Active",
    },
    {
      id: 4,
      username: "Emily Davis",
      email: "emily.davis@example.com",
      joined_at: "2020-09-30",
      role: "HR Manager",
      status: "Active",
    },
    {
      id: 5,
      username: "David Wilson",
      email: "david.wilson@example.com",
      joined_at: "2019-12-10",
      role: "Marketing Lead",
      status: "Inactive",
    },
  ];

  // Loading state
  if (loading) {
    return (
      <div className="bg-white">
        {[...Array(5)].map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="flex items-center w-full h-[72px] border-t border-b animate-pulse"
          >
            <div className="w-14 h-4 bg-gray-300 rounded"></div>
            <div className="h-fit px-6 w-[296px] flex gap-[12px] items-center">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div className="flex flex-col gap-2">
                <div className="bg-gray-300 rounded h-4 w-3/4"></div>
                <div className="bg-gray-300 rounded h-3 w-1/2"></div>
              </div>
            </div>
            <div className="h-fit px-6 w-[122px] bg-gray-300 rounded h-4"></div>
            <div className="h-fit px-6 w-[122px] bg-gray-300 rounded h-4"></div>
            <div className="h-fit px-6 w-[122px] bg-gray-300 rounded h-4"></div>
            <div className="h-fit px-6 w-[117px] bg-gray-300 rounded h-4"></div>
            <div className="h-fit px-6 w-[122px] bg-gray-300 rounded h-4"></div>
            <div className="h-fit px-6 w-[100px]">
              <div className="py-1 px-[6px] rounded-xl bg-gray-300 w-fit h-4"></div>
            </div>
            <div className="h-fit px-6 w-full">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center">
        <Lottie
          options={{
            animationData: error404,
            loop: true,
            autoplay: true,
          }}
          height={300}
          width={300}
        />
      </div>
    );
  }

  // Static employee table
  return (
    <div className="bg-white">
      {employees.length === 0 ? (
        <div className="flex justify-center items-center">
          <Lottie
            options={{
              animationData: NODATA,
              loop: true,
              autoplay: true,
            }}
            height={300}
            width={300}
          />
        </div>
      ) : (
        employees.map((member, index) => (
          <div
            key={member.id}
            className="flex items-center w-[1100px] h-[72px] border-t border-b"
          >
            <h2 className="text-center w-14 h-fit text-textBlack text-[15px] font-medium">
              {index + 1}
            </h2>
            <h2 className="h-fit text-textBlack text-[14px] font-normal px-6 w-[296px] flex gap-[12px] items-center">
              <div className="w-10 h-10 border rounded-full"></div>
              <div>
                <p>{member.username}</p>
                <p className="text-xs text-textSecondary">{member.email}</p>
              </div>
            </h2>
            <h2 className="h-fit text-textBlack text-[14px] font-normal px-6 w-[122px]">
              {new Date(member.joined_at).toLocaleDateString()}
            </h2>
            <h2 className="h-fit text-textBlack text-[14px] font-normal px-6 w-[122px]">
              {member.role}
            </h2>
            <h2 className="h-fit text-textBlack text-[14px] font-normal px-6 w-[100px]">
              <p className="py-1 px-[6px] rounded-xl border w-fit text-xs font-medium">
                {member.status}
              </p>
            </h2>
          </div>
        ))
      )}
    </div>
  );
};

export default EmployeeTable;

export const InviteUserCard = () => {
  return (
    <DialogContent className="h-auto w-[459px]">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center">
          <div className="border rounded-full w-[48px] h-[48px]"></div>
          <h1 className="font-semibold text-[20px]">Invite Members</h1>
          <p className="text-[14px] w-full text-center text-textSecondary">
            Invite new members to your workspace and begin collaborating.
          </p>
        </div>
        <div className="flex flex-col gap-[12px]">
          <h1>Email address</h1>
          <input
            className="w-full border h-[44px] rounded-xl p-2 font-normal text-[16px]"
            placeholder="hirexer@gmail.com"
          />
          <input
            className="w-full border h-[44px] rounded-xl p-2 font-normal text-[16px]"
            placeholder="hirexer@gmail.com"
          />
        </div>
        <p className="text-[14px] font-semibold text-textSecondary">Add another</p>
        <div className="flex justify-center gap-4">
          <button className="border w-[170px] h-[44px] rounded-xl bg-white text-textBlack">Cancel</button>
          <button className="border w-[170px] h-[44px] rounded-xl bg-buttonGreen text-white">Send Invites</button>
        </div>
      </div>
    </DialogContent>
  );
};

export const DeleteUser = () => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will permanently delete your account and remove your data from our servers.
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  );
};