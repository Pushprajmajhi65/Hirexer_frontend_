import React from "react";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

const EmployeeStatus = ({ status }) => {
  return (
    <Badge variant="outline">
      <span
        className={cn(
          "h-[5px] w-[5px] rounded-full",
          status === "active" || status === "Active" ? "bg-green-700" : "bg-red-700"
        )}
      ></span>
      {status}
    </Badge>
  );
};

export default EmployeeStatus;
