import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { NavBar } from "./UserOverview";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useWorkspace from "./useWorkspace";

import toast from "react-hot-toast";


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




export const MoreProfileOptions = () => {
  const navigate = useNavigate();
  const { workspaces, activeWorkspace, switchWorkspace } = useWorkspace(); // Use the custom hook
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    toast.success('You have been logged out');
    localStorage.removeItem('activeWorkspace'); 
    navigate('/');
  };

  const handleWorkspaceChange = (workspace) => {
    switchWorkspace(workspace); // Switch workspace using the custom hook
    setIsWorkspaceDropdownOpen(false); // Close the dropdown
  };

  return (
    <Popover>
      <PopoverTrigger>
        <div className="flex w-[158px] h-[44px] gap-2">
          <div className="border border-black rounded-full h-11 w-11"></div>
          <div>
            <h1 className="font-bold">John Doe</h1>
            <p className="text-xs text-textSecondary">Super Admin</p>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[297px] py-4 px-6 flex flex-col items-center gap-2 max-h-[80vh] overflow-auto">
        <div className="flex flex-col items-center">
          <div className="h-[50px] w-[50px] rounded-full border border-black"></div>
          <h1 className="text-xs text-textSecondary">Default Workspace</h1>
        </div>
        <div className="flex flex-col w-full gap-2">
          {/* Custom Workspace Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen)}
              className="w-full h-[40px] bg-backgroundGreen text-white rounded-xl flex items-center justify-between px-4"
            >
              <span>{activeWorkspace?.name || 'Select a workspace'}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isWorkspaceDropdownOpen && (
              <div className="absolute top-12 left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {workspaces.map((workspace) => (
                  <div
                    key={workspace.id}
                    onClick={() => handleWorkspaceChange(workspace)}
                    className="p-3 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                  >
                    <span>{workspace.name}</span>
                    {workspace.id === activeWorkspace?.id && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add New Workspace Button */}
          <button
            onClick={() => navigate('/Onboarding-phase-one')}
            className="w-full h-[40px] bg-backgroundGreen text-white rounded-xl flex items-center justify-center gap-2"
          >
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

          {/* My Profile Button */}
          <button className="border rounded-xl bg-backgroundGreen text-white h-[40px] w-full">
            My Profile
          </button>

          {/* Active Workspace Display */}
          <h1 className="text-center text-[18px] mt-2">
            Active Workspace: {activeWorkspace?.name || 'Default Workspace'}
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