import React from "react";
import Greetings from "@/components/overview/Greetings";
import UpcomingMeetings from "@/components/overview/UpcomingMeetings";
import MembersTable from "@/components/overview/MembersTable";

const Overview = () => {
  return (
    <div className="flex flex-col space-y-6">
      <Greetings />
      <UpcomingMeetings />
      <MembersTable />
    </div>
  );
};

export default Overview;
