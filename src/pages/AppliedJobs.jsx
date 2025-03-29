import React from "react";
import AppliedJobsTile from "@/components/appliedjobs/AppliedJobsTile";
import { useGetUserApplications } from "@/services/post";
import AppliedJobsTileSkeleton from "@/components/appliedjobs/AppliedJobsSkeleton";

const AppliedJobs = () => {
  const { data, isLoading, error } = useGetUserApplications();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="font-bold text-2xl text-primary/90">Applied Jobs</h1>
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <AppliedJobsTileSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-lg text-center mt-6">
        ❌ Something went wrong. Please try again later.
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-gray-500 text-lg text-center mt-6">
        No applied jobs found.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-bold text-3xl text-primary/90">Applied Jobs</h1>
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        {data.map((el) => (
          <AppliedJobsTile key={el.id} el={el} />
        ))}
      </div>
    </div>
  );
};

export default AppliedJobs;
