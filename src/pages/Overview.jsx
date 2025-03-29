import React from "react";
import Greetings from "@/components/overview/Greetings";
import UpcomingMeetings from "@/components/overview/UpcomingMeetings";
import MembersTable from "@/components/overview/MembersTable";
import WorkspaceGuard from "@/components/overview/WorkspaceGuard";

const Overview = () => {
  return (
    <WorkspaceGuard>
    <div className="flex flex-col space-y-6">
      <Greetings />
      <UpcomingMeetings />
      <MembersTable />
    </div>
    </WorkspaceGuard>
  );
};

export default Overview;
