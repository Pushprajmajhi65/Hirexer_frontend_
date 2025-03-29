import React from "react";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const AppliedJobsTileSkeleton = () => {
  return (
    <Card>
      <CardContent className="flex flex-col animate-pulse">
        <div className="flex justify-end">
          <Skeleton className="w-16 h-6 rounded-md" />
        </div>
        <section className="pt-4 space-y-2">
          <Skeleton className="w-40 h-4" />
          <Skeleton className="w-60 h-4" />
          <Skeleton className="w-32 h-4" />
          <Skeleton className="w-48 h-4" />
          <Skeleton className="w-24 h-4" />
        </section>
        <section className="pt-3 flex items-center justify-between">
          <Skeleton className="w-24 h-6" />
          <Skeleton className="w-16 h-6 rounded-md" />
        </section>
      </CardContent>
    </Card>
  );
};

export default AppliedJobsTileSkeleton;
