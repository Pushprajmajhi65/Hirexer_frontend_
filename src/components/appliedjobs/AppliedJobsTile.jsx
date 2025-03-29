import React from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { getStatusColor } from "@/utils/getStatusColor";
import { Button } from "../ui/button";
import { useGetUserApplications } from "@/services/post";

const AppliedJobsTile = () => {
  const { data, isLoading } = useGetUserApplications();
  return (
    <Card>
      <CardContent className="flex flex-col ">
        <span className="flex  justify-end">
          {" "}
          <Badge className={getStatusColor("rejected")}>Rejected</Badge>
        </span>
        <section className="pt-4 space-y-1">
          <h2 className="text-[15px] font-[600] text-primary/90">
            Workspace:
            <span className="text-muted-foreground text-[12px]">
              lorem Ipusm
            </span>
          </h2>
          <h2 className="text-[15px] font-[600] text-primary/90">
            Description:
            <span className="text-muted-foreground text-[12px]">
              lorem Ipusm
            </span>
          </h2>
          <h2 className="text-[15px] font-[600] text-primary/90">
            Experience:
            <span className="text-muted-foreground text-[12px]">
              lorem Ipusm
            </span>
          </h2>
          <h2 className="text-[15px] font-[600] text-primary/90">
            Email:
            <span className="text-muted-foreground text-[12px]">
              lorem Ipusm
            </span>
          </h2>
          <h2 className="text-[15px] font-[600] text-primary/90">
            Applied On:
            <span className="text-muted-foreground text-[12px]">
              lorem Ipusm
            </span>
          </h2>
        </section>
        <section className="pt-3 flex items-center justify-between">
          <Button>View Details</Button>
          <Button variant="destructive">Delete</Button>
        </section>
      </CardContent>
    </Card>
  );
};

export default AppliedJobsTile;
