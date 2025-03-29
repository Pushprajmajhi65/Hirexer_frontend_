import ApplicationTable from "@/components/applications/ApplicationTable";
import React from "react";



const MyApplications = () => {
  return (
    <div className="flex flex-col gap-[24px] ">
      <h1 className="font-[700] text-[36px] text-primary/90"> My Applications</h1>
      <ApplicationTable />
    </div>
  );
};

export default MyApplications;
