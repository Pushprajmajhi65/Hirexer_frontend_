import UserDetails from "@/components/profile/UserDetails";
import React from "react";

const Profile = () => {
  return (
    <div className="felx flex-col gap-[24px]">
      <h1 className="font-[700] text-[36px] text-primary/90">My Profile</h1>
      <UserDetails />
    </div>
  );
};

export default Profile;
