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

const EditDialog = ({ onClose, employee }) => {
  const [status, setStatus] = useState(employee?.status || "");
const mutation=useUpdateApplicationStatus()

  const handleStatusUpdate = () => {
    if (!status) {
      toast({
        title: "Error",
        description: "Please select a status",
        variant: "destructive",
      });
      return;
    }

/*     console.log(employee.id,status.toLowerCase()) */
    mutation.mutate(
      {
        memberId: employee.id,
        status: status.toLowerCase(),
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
        <DialogTitle>Update Member Status</DialogTitle>
        <DialogDescription>
          Change the status for {employee?.username}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-2 flex gap-3 items-center">
        <label className="text-sm font-medium">Status</label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {jobStatuses.map((status) => (
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
