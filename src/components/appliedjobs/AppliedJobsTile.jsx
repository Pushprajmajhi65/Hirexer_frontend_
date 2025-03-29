import React from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { getStatusColor } from "@/utils/getStatusColor";
import { Button } from "../ui/button";

/* [
	{
    	"id": 16,
    	"post": 14,
    	"user": "pushprajmajhidc",
    	"email": "pushprajmajhi67+90@gmail.com",
    	"experience_level": 3,
    	"cv": null,
  	  "applied_at": "2025-03-21T11:58:32.691496Z",
    	"application_status": "submitted"
	} */

const AppliedJobsTile = ({ el }) => {
  return (
    <Card>
      <CardContent className="flex flex-col ">
        <span className="flex  justify-end">
          {" "}
          <Badge className={getStatusColor("rejected")}>
            {el.appication_status}
          </Badge>
        </span>
        <section className="pt-4 space-y-1">
          <h2 className="text-[15px] font-[600] text-primary/90">
            Workspace:
            <span className="text-muted-foreground text-[12px]">
              {e.post.workspace.name}
            </span>
          </h2>
          <h2 className="text-[15px] font-[600] text-primary/90">
            Description:
            <span className="text-muted-foreground text-[12px]">
              {e.post.post_description}
            </span>
          </h2>
          <h2 className="text-[15px] font-[600] text-primary/90">
            Experience:
            <span className="text-muted-foreground text-[12px]">
              {el.experience_level}
            </span>
          </h2>
          <h2 className="text-[15px] font-[600] text-primary/90">
            Email:
            <span className="text-muted-foreground text-[12px]">
              {el.email}
            </span>
          </h2>
          <h2 className="text-[15px] font-[600] text-primary/90">
            Applied On:
            <span className="text-muted-foreground text-[12px]">
              {new Date(el.applied_at).toLocaleDateString()}
            </span>
          </h2>
        </section>
        <section className="pt-3 flex items-center justify-between">
          <a href={el.cv_url} className="">
            View Details
          </a>
          <Button variant="destructive">Delete</Button>
        </section>
      </CardContent>
    </Card>
  );
};

export default AppliedJobsTile;
