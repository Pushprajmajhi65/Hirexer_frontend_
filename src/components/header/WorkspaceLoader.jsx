import React from "react";
import { Skeleton } from "../ui/skeleton";

const WorkspaceLoader = () => {
  return Array.from({ length: 5 }).map((_, index) => (
    <div
      key={index}
      className="flex flex-col items-center gap-1 min-w-[72px] p-2"
    >
      <Skeleton className="h-9 w-9 rounded-full" />
      <Skeleton className="h-4 w-16 rounded-md" />
    </div>
  ));
};

export default WorkspaceLoader;


