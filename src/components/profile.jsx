import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { NavBar } from "./UserOverview";
import { useState, useEffect } from "react";
import axios from "axios";
import api from "@/api";

import toast from "react-hot-toast";
import { useWorkspace } from "./WorkspaceContext";

export const MyProfile = () => {
  return (
    <div className="flex w-full h-full gap-8 bg-backgroundGray max-sm:px-0 px-[40px] pb-[80px] justify-center xl:justify-start xl:p-0">
      <NavBar />
      <MyProfileCard />
    </div>
  );
};

const MyProfileCard = () => {
  const { activeWorkspace } = useWorkspace(); // Access the active workspace

  return (
    <div className="w-[1100px] h-[1344px] bg-white rounded-2xl py-8 px-8">
      <div className="flex flex-col w-full gap-8">
        <h1 className="text-[32px] text-textBlack font-semibold">My Profile</h1>
        <div className="flex flex-col w-full gap-6">
          <div>
            <h2 className="text-[20px] font-semibold">Personal info</h2>
            <p className="text-[14px] text-textSecondary">
              Update your photo and personal details here.
            </p>
          </div>
          <div className="w-full border"></div>
          <div className="flex flex-col w-full gap-10">
            <div className="flex w-full gap-8">
              <h1 className="w-[280px]">Workspace</h1>
              <div className="flex gap-6 h-[44px] w-[512px]">
                <input
                  className="w-full border rounded-xl"
                  value={activeWorkspace?.name || "No workspace selected"}
                  readOnly
                />
              </div>
            </div>
            <div className="flex w-full gap-8">
              <h1 className="w-[280px]">Name</h1>
              <div className="flex gap-6 h-[44px] w-[512px]">
                <input
                  className="w-full border rounded-xl"
                  placeholder="Name"
                />
                <input
                  className="w-full border rounded-xl"
                  placeholder="LastName"
                />
              </div>
            </div>
            <div className="flex w-full gap-8">
              <h1 className="w-[280px]">Email address</h1>
              <div className="flex gap-6 h-[44px] w-[512px]">
                <input
                  className="w-full border rounded-xl"
                  type="email"
                  placeholder="Email"
                />
              </div>
            </div>
            <div className="flex w-full gap-8">
              <h1 className="w-[280px]">Your Photo</h1>
              <div className="flex gap-6 h-[126px] w-[512px]">
                <div className="flex gap-5">
                  <input
                    className="border rounded-xl w-[366px] h-[126px]"
                    type="file"
                    placeholder="Email"
                  />
                  <div className="w-[126px] h-[126px] rounded-full border"></div>
                </div>
              </div>
            </div>
            <div className="flex w-full gap-8">
              <h1 className="w-[280px]">Company</h1>
              <div className="flex gap-6 h-[44px] w-[512px]">
                <input
                  className="w-full border rounded-xl"
                  type="email"
                  placeholder="Z studio"
                />
              </div>
            </div>
            <div className="flex w-full gap-8">
              <h1 className="w-[280px]">Role</h1>
              <div className="flex gap-6 h-[44px] w-[512px]">
                <input
                  className="w-full border rounded-xl"
                  type="Product designer"
                  placeholder="Product Designer"
                />
              </div>
            </div>
            <div className="flex w-full gap-8">
              <h1 className="w-[280px]">Country</h1>
              <div className="flex gap-6 h-[44px] w-[512px]">
                <input
                  className="w-full border rounded-xl"
                  type="email"
                  placeholder="Email"
                />
              </div>
            </div>
            <div className="flex w-full gap-8">
              <h1 className="w-[280px]">Time Zone</h1>
              <div className="flex gap-6 h-[44px] w-[512px]">
                <input
                  className="w-full border rounded-xl"
                  type="email"
                  placeholder="Email"
                />
              </div>
            </div>
          </div>
          <div className="w-full border"></div>
        </div>
      </div>
    </div>
  );
};







import { Link } from "react-router-dom"; // For navigation



export const MoreProfileOptions = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const { activeWorkspace, setActiveWorkspace, setWorkspaceMembers } = useWorkspace(); 
  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const response = await api.get("/api/workspaces/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setWorkspaces(response.data);

        const savedWorkspace = localStorage.getItem("activeWorkspace");
        if (savedWorkspace) {
          const parsedWorkspace = JSON.parse(savedWorkspace);
          setActiveWorkspace(parsedWorkspace);
          fetchWorkspaceMembers(parsedWorkspace.id);
        }
      } catch (error) {
        console.error("Error fetching workspaces", error);
        toast.error("Failed to fetch workspaces");
      }
    };

    fetchWorkspaces();
  }, [accessToken, setActiveWorkspace]);

  const fetchWorkspaceMembers = async (workspaceId) => {
    try {
      const response = await api.get(`/api/workspaces/${workspaceId}/members/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setWorkspaceMembers(response.data); 
    } catch (error) {
      console.error("Error fetching workspace members:", error);
      toast.error("Failed to fetch workspace members");
    }
  };

  const handleWorkspaceSwitch = (workspaceId) => {
    const selectedWorkspace = workspaces.find((ws) => ws.id === workspaceId);
    if (selectedWorkspace) {
      setActiveWorkspace(selectedWorkspace);
      localStorage.setItem("activeWorkspace", JSON.stringify(selectedWorkspace));
      fetchWorkspaceMembers(selectedWorkspace.id);
      toast.success(`Switched to workspace: ${selectedWorkspace.name}`);
    } else {
      toast.error("Workspace not found");
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("activeWorkspace");
    toast.success("You have been logged out");
    navigate("/");
  };

  return (
    <Popover>
      <PopoverTrigger>
        <div className="flex w-[158px] h-[44px] gap-2">
          <div className="border border-black rounded-full h-11 w-11"></div>
          <div>
            <h1 className="font-bold">Jone Doe</h1>
            <p className="text-xs text-textSecondary">Super Admin</p>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[297px] py-4 px-6 flex flex-col items-center gap-2 max-h-[80vh] overflow-auto">
        <div className="flex flex-col items-center">
          <div className="h-[50px] w-[50px] rounded-full border border-black"></div>
          <h1 className="text-xs text-textSecondary">Workspace Name</h1>
        </div>
        <div className="flex flex-col w-full gap-2">
          {/* Workspace Dropdown */}
          <select
            onChange={(e) => handleWorkspaceSwitch(Number(e.target.value))}
            value={activeWorkspace?.id || ""}
            className="border rounded-xl h-[40px] w-full"
          >
            <option value="" disabled>
              Select a workspace
            </option>
            {workspaces.map((workspace) => (
              <option key={workspace.id} value={workspace.id}>
                {workspace.name}
              </option>
            ))}
          </select>

          {/* Add New Workspace Button */}
          <Link to="/Onboarding-phase-one">
            <button className="w-full h-[40px] bg-backgroundGreen text-white rounded-xl flex items-center justify-center gap-2">
              <span>Add New Workspace</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </Link>

          {/* My Profile Button */}
          <button className="border rounded-xl bg-backgroundGreen text-white h-[40px] w-full">
            My Profile
          </button>

          {/* Active Workspace Display */}
          <h1 className="text-center text-[18px] mt-2">
            {activeWorkspace && activeWorkspace.name
              ? `Active Workspace: ${activeWorkspace.name}`
              : "No Workspace Selected"}
          </h1>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="border rounded-xl border-colorRed text-colorRed h-[40px] w-full"
          >
            Logout
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};