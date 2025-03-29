import React from "react";
import ApplicationTile from "@/components/applications/ApplicationTile";
import { Card, CardContent } from "@/components/ui/card";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useGetWorkspacePosts } from "@/services/post";
import ApplicationLoader from "@/components/applications/ApplicationLoader";

const Applications = () => {
  const { selectedWorkspace } = useWorkspace();
  const { data, isLoading } = useGetWorkspacePosts(selectedWorkspace?.id);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-[24px]">
        <h1 className="font-[700] text-[36px] text-primary/90">Applications</h1>
        <Card>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {[1, 2, 3].map((index) => (
              <ApplicationLoader key={index} />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col gap-[24px]">
        <h1 className="font-[700] text-[36px] text-primary/90">Applications</h1>
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground text-center">
              No applications found. Create your first job posting to get
              started.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[24px]">
      <h1 className="font-[700] text-[36px] text-primary/90">Applications</h1>
      <Card>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {data.map((application) => (
            <ApplicationTile key={application.id} application={application} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Applications;
