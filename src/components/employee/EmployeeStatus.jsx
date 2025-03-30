import React from "react";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { getStatusColor } from "@/utils/getStatusColor";

const EmployeeStatus = ({ status }) => {
  return <Badge className={getStatusColor(status)}>{status}</Badge>;
};

export default EmployeeStatus;
