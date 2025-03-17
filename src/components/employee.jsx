import { useState, useEffect } from "react";
import remove from "../images/Commonimg/remove.png";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { NavBar } from "./UserOverview";

import api from "@/api";
import Lottie from 'react-lottie';
import { MoreProfileOptions } from "./profile";

import { useWorkspace } from "./WorkspaceContext";
import NODATA from "../assets/NODATA.json";
import error404 from "../assets/error404.json";
export const Employee = () => {
  return (
    <div className="flex w-screen h-screen gap-8 bg-backgroundGray max-sm:px-0 px-[40px] pb-[80px] items-center xl:p-0">
      <NavBar />

      {/* Header/Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 h-[70px] flex items-center justify-between px-6 z-50 max-w-[900px] mx-auto w-full">
        <div className="flex items-center gap-4"></div>
        <div className="flex items-center gap-4">
          <MoreProfileOptions />
        </div>
      </div>

      {/* Main Content */}
      <div className="mt-[70px] w-full">
        <ManageEmployeeCard />
      </div>
    </div>
  );
};

export const ManageEmployeeCard = () => {
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  return (
    <div className="w-full max-w-[1100px] h-[755px] bg-white rounded-2xl px-6 py-6 flex flex-col gap-12">
      {/* Top Section with Title, Invite Button, and Profile Options */}
      <div className="w-full border-b px-6 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-0 sm:h-[70px] pb-2 sm:pb-0">
        <div className="w-full">
          <h1 className="font-semibold text-textBlack text-[20px]">Manage Employee</h1>
          <p className="text-[14px] text-textSecondary font-normal">Manage teams and members.</p>
        </div>
        <div className="flex items-center gap-4">
          <MoreProfileOptions /> {/* Add MoreProfileOptions here */}
          <Dialog>
            <DialogTrigger className="w-full sm:w-[101px] h-[40px] rounded-xl bg-buttonGreen text-white flex justify-center items-center p-2 sm:p-0">
              Invite
            </DialogTrigger>
            <InviteUserCard />
          </Dialog>
        </div>
      </div>

      {/* Search Bar */}
      <div>
        <input
          className="border w-full sm:w-[320px] h-11 rounded-xl px-4 py-2"
          placeholder="Search for email or name"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Employee Table */}
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




const EmployeeTable = ({ searchQuery }) => {
  const { selectedWorkspace } = useWorkspace(); // Access selectedWorkspace from context
  const [loading, setLoading] = useState(false); // Add loading state if needed
  const [error, setError] = useState(false); // Add error state if needed

  // Use members_details from the selected workspace
  const members = selectedWorkspace?.members_details || [];

  // Filter members based on search query
  const filteredMembers = members.filter(
    (member) =>
      member.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Loading state (if needed for other purposes)
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

  // No members found
  if (filteredMembers.length === 0) {
    return (
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
    );
  }

  // Render member table
  return (
    <div className="bg-white">
      {filteredMembers.map((member, index) => (
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
          <h2 className="h-fit text-textBlack text-[14px] font-normal px-6 w-[64px]">
            <Dialog>
              <DialogTrigger>
                <img src={remove} className="w-6 h-6" alt="Remove" />
              </DialogTrigger>
              {/* <DeleteUser memberId={member.id} workspaceId={selectedWorkspace.id} /> */}
            </Dialog>
          </h2>
        </div>
      ))}
    </div>
  );
};

export default EmployeeTable;


export const InviteUserCard = () => {
  const { selectedWorkspace } = useWorkspace(); // Access selectedWorkspace from context
  const [emails, setEmails] = useState([""]);
  const [error, setError] = useState("");

  const handleInvite = async () => {
    if (!selectedWorkspace) {
      setError("No workspace selected");
      return;
    }

    try {
      const response = await api.post(`/workspaces/${selectedWorkspace.id}/invitations/`, {
        workspace: selectedWorkspace.id,
        emails: emails.filter((email) => email.trim() !== ""),
      });
      toast.success("Invitations sent successfully!");
    } catch (err) {
      console.error("Failed to send invitations:", err);
      setError(err.message || "Failed to send invitations");
      toast.error("Failed to send invitations");
    }
  };

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
          {emails.map((email, index) => (
            <input
              key={index}
              className="w-full border h-[44px] rounded-xl p-2 font-normal text-[16px]"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => {
                const newEmails = [...emails];
                newEmails[index] = e.target.value;
                setEmails(newEmails);
              }}
            />
          ))}
        </div>
        <p
          className="text-[14px] font-semibold text-textSecondary cursor-pointer"
          onClick={() => setEmails([...emails, ""])}
        >
          Add another
        </p>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex justify-center gap-4">
          <button className="border w-[170px] h-[44px] rounded-xl bg-white text-textBlack">Cancel</button>
          <button
            className="border w-[170px] h-[44px] rounded-xl bg-buttonGreen text-white"
            onClick={handleInvite}
          >
            Send Invites
          </button>
        </div>
      </div>
    </DialogContent>
  );
};