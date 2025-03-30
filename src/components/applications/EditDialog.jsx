import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { jobStatuses } from "@/constants";
import toast from "react-hot-toast";
import { useUpdateApplicationStatus } from "@/services/post";

const EditDialog = ({ onClose, application }) => {
  const [status, setStatus] = useState(application?.status || "");
  const mutation = useUpdateApplicationStatus();


  const getAvailableStatuses = () => {
    const currentStatus = application?.status;

    const rejected = jobStatuses.find(status => status.name === "Rejected");
    
    switch (currentStatus) {
      case "Submitted":
        return jobStatuses.filter(status => 
          ["Submitted", "In Review", "Rejected"].includes(status.name)
        );
      
      case "In Review":
        return jobStatuses.filter(status => 
          ["In Review", "Schedule Meeting", "Rejected"].includes(status.name)
        );
      
      case "Schedule Meeting":
        return jobStatuses.filter(status => 
          ["Schedule Meeting", "Approved", "Rejected"].includes(status.name)
        );
      
      case "Pending":
        return jobStatuses.filter(status => 
          ["Pending", "Rejected"].includes(status.name)
        );
      
      case "Approved":
        return jobStatuses.filter(status => 
          ["Approved", "Rejected"].includes(status.name)
        );
      
      case "Rejected":
        return [rejected];
      
      default:
        return jobStatuses;
    }
  };

  const handleStatusUpdate = () => {
    if (!status) {
      toast({
        title: "Error",
        description: "Please select a status",
        variant: "destructive",
      });
      return;
    }

  
    const availableStatuses = getAvailableStatuses().map(s => s.name);
    if (!availableStatuses.includes(status)) {
      toast({
        title: "Invalid Status Change",
        description: `Cannot change status from ${application.status} to ${status}`,
        variant: "destructive",
      });
      return;
    }

    mutation.mutate(
      {
        application_id: application.id,
        status: status,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle>Update Application Status</DialogTitle>
        <DialogDescription>
          Change the status of application
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-2 flex gap-3 items-center">
        <label className="text-sm font-medium">Status</label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {getAvailableStatuses().map((status) => (
              <SelectItem key={status.id} value={status.name}>
                {status.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleStatusUpdate} disabled={mutation.isPending}>
          {mutation.isPending ? "Updating..." : "Update Status"}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default EditDialog;