import AppliedJobsTile from "@/components/appliedjobs/AppliedJobsTile";
import React from "react";

const AppliedJobs = () => {
  return (
    <div className="flex flex-col gap-[24px] ">
      <h1 className="font-[700] text-[36px] text-primary/90">Applied Jobs</h1>

     <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-2">
     <AppliedJobsTile />
     </div>
    </div>
  );
};

export default AppliedJobs;
