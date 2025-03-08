import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { NavBar } from "./UserOverview";
import { useState, useEffect } from "react";

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
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    photo: null,
    company: "",
    role: "",
    country: "",
    timeZone: "",
  });

  const [isEditing, setIsEditing] = useState(false); // Flag to toggle edit mode
  const [updatedData, setUpdatedData] = useState(profileData); // Store the updated profile data

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('access_token'); // Retrieve the access token from localStorage

        const response = await fetch('http://127.0.0.1:8000/user-profile/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Add the Authorization header with the token
            'Content-Type': 'application/json', // Optional, but good practice
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }

        const data = await response.json();
        setProfileData(data);
        setUpdatedData(data); // Update the initial data
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle save changes
  const handleSave = async () => {
    try {
      const token = localStorage.getItem('access_token'); // Retrieve the access token from localStorage
      const response = await fetch('http://127.0.0.1:8000/edit-user-profile/', {  // Update the endpoint here
        method: 'PATCH', // Assuming PATCH is used to update user profile
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData), // Updated data to send to the server
      });
  
      if (!response.ok) {
        throw new Error('Failed to save profile data');
      }
  
      const data = await response.json();
      setProfileData(data); // Update profile data after successful save
      setIsEditing(false); // Exit editing mode
    } catch (error) {
      console.error("Error saving profile data:", error);
    }
  };
  

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
            {/* Name */}
            <div className="flex w-full gap-8">
              <h1 className="w-[280px]">Name</h1>
              <div className="flex gap-6 h-[44px] w-[512px]">
                <input
                  className="w-full border rounded-xl"
                  name="name"
                  value={updatedData.name || ""}
                  placeholder="Name"
                  onChange={handleChange}
                  disabled={!isEditing}
                />
                <input
                  className="w-full border rounded-xl"
                  name="lastName"
                  value={updatedData.lastName || ""}
                  placeholder="Last Name"
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex w-full gap-8">
              <h1 className="w-[280px]">Email address</h1>
              <div className="flex gap-6 h-[44px] w-[512px]">
                <input
                  className="w-full border rounded-xl"
                  type="email"
                  name="email"
                  value={updatedData.email || ""}
                  placeholder="Email"
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            {/* Photo */}
            <div className="flex w-full gap-8">
              <h1 className="w-[280px]">Your Photo</h1>
              <div className="flex gap-6 h-[126px] w-[512px]">
                <div className="flex gap-5">
                  <input
                    className="border rounded-xl w-[366px] h-[126px]"
                    type="file"
                    placeholder="Upload Photo"
                    disabled={!isEditing}
                  />
                  {updatedData.photo && (
                    <div className="w-[126px] h-[126px] rounded-full border">
                      <img
                        src={updatedData.photo}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Company */}
            <div className="flex w-full gap-8">
              <h1 className="w-[280px]">Company</h1>
              <div className="flex gap-6 h-[44px] w-[512px]">
                <input
                  className="w-full border rounded-xl"
                  name="company"
                  value={updatedData.company || ""}
                  placeholder="Company Name"
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            {/* Role */}
            <div className="flex w-full gap-8">
              <h1 className="w-[280px]">Role</h1>
              <div className="flex gap-6 h-[44px] w-[512px]">
                <input
                  className="w-full border rounded-xl"
                  name="role"
                  value={updatedData.role || ""}
                  placeholder="Your Role"
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            {/* Country */}
            <div className="flex w-full gap-8">
              <h1 className="w-[280px]">Country</h1>
              <div className="flex gap-6 h-[44px] w-[512px]">
                <input
                  className="w-full border rounded-xl"
                  name="country"
                  value={updatedData.country || ""}
                  placeholder="Country"
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            {/* Time Zone */}
            <div className="flex w-full gap-8">
              <h1 className="w-[280px]">Time Zone</h1>
              <div className="flex gap-6 h-[44px] w-[512px]">
                <input
                  className="w-full border rounded-xl"
                  name="timeZone"
                  value={updatedData.timeZone || ""}
                  placeholder="Time Zone"
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
          <div className="w-full border"></div>
        </div>
        <div className="flex justify-end gap-4">
          <button
            className="py-2 px-4 bg-blue-500 text-white rounded-xl"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
          {isEditing && (
            <button
              className="py-2 px-4 bg-green-500 text-white rounded-xl"
              onClick={handleSave}
            >
              Save
            </button>
          )}
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