import React from "react";
import { Card,CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const ApplicationLoader = () => {
  return (
    <Card className="md:h-[370px] md:w-[370px]">
      <CardContent className="flex flex-col justify-between h-full">
        <Skeleton className="h-[75px] w-[75px] mt-20" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationLoader;
