import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "../ui/dialog";
import { Button } from "../ui/button";
import { MoveRight } from "lucide-react";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import toast from "react-hot-toast";
import { useTransferMembers } from "../../services/workspace";
import { useWorkspace } from "@/context/WorkspaceContext";
import { Skeleton } from "../ui/skeleton";

const TransferDialog = ({ onClose }) => {
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [targetWorkspaceId, setTargetWorkspaceId] = useState("");
  const { selectedWorkspace, workspaces, isLoading } = useWorkspace();
  const mutation = useTransferMembers();

  // Add local state to track if data is ready
  const [isDataReady, setIsDataReady] = useState(false);

  useEffect(() => {
    // Check if we have all required data
    if (!isLoading && selectedWorkspace && workspaces.length > 0) {
      setIsDataReady(true);
    } else {
      setIsDataReady(false);
    }
  }, [isLoading, selectedWorkspace, workspaces]);

  // Reset selections when workspace changes
  useEffect(() => {
    if (isDataReady) {
      setSelectedMembers([]);
      setTargetWorkspaceId("");
    }
  }, [selectedWorkspace?.id, isDataReady]);

  const availableWorkspaces = Array.isArray(workspaces) ? workspaces : [];
  const currentWorkspace = availableWorkspaces.find(ws => ws.id === selectedWorkspace?.id);
  const members = currentWorkspace?.members_details || [];

  const handleMemberSelection = (memberId, isChecked) => {
    setSelectedMembers(prev =>
      isChecked ? [...prev, memberId] : prev.filter(id => id !== memberId)
    );
  };

  const handleSelectAll = (isChecked) => {
    setSelectedMembers(isChecked ? members.map(m => m.id) : []);
  };

  const handleTransferMembers = () => {
    if (selectedMembers.length === 0) {
      toast.error("Please select at least one member to transfer");
      return;
    }

    if (!targetWorkspaceId) {
      toast.error("Please select a target workspace");
      return;
    }

    const memberEmails = members
      .filter(member => selectedMembers.includes(member.id))
      .map(member => member.email);

    mutation.mutate(
      {
        source_workspace_id: selectedWorkspace.id,
        target_workspace_id: targetWorkspaceId,
        member_emails: memberEmails,
      },
      {
        onSuccess: () => {
          toast.success("Members transferred successfully");
          onClose();
        },
        onError: (error) => {
          toast.error(error?.response?.data?.error || "Failed to transfer members");
        }
      }
    );
  };

  if (!isDataReady) {
    return (
      <div className="text-center flex items-center justify-center flex-col gap-3 w-full max-w-md mx-auto overflow-visible p-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
        <div className="flex gap-2 w-full pt-3">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="text-center flex items-center justify-center flex-col gap-3 w-full max-w-md mx-auto overflow-visible px-4"
    >
      <MoveRight className="h-12 w-12 text-figmaPrimaryDark" />
      <DialogTitle className="leading-7 pt-2">Transfer members</DialogTitle>
      <DialogDescription className="text-[14px]">
        Transfer members from this workspace to another workspace
      </DialogDescription>

      {/* Workspace Selection */}
      <section className="w-full flex flex-col gap-1">
        <Label>Target Workspace</Label>
        <Select
          value={targetWorkspaceId}
          onValueChange={setTargetWorkspaceId}
          disabled={mutation.isPending || availableWorkspaces.length <= 1}
        >
          <SelectTrigger className="w-full h-12">
            <SelectValue placeholder="Select target workspace" />
          </SelectTrigger>
          <SelectContent className="z-50 max-h-60 overflow-auto">
            {availableWorkspaces.length <= 1 ? (
              <SelectItem disabled>No other workspaces available</SelectItem>
            ) : (
              availableWorkspaces
                .filter(ws => ws.id !== selectedWorkspace?.id)
                .map(workspace => (
                  <SelectItem key={workspace.id} value={workspace.id}>
                    {workspace.name}
                  </SelectItem>
                ))
            )}
          </SelectContent>
        </Select>
      </section>

      {/* Member Selection */}
      <section className="w-full flex flex-col gap-1">
        <Label>Select Members to Transfer</Label>
        <div className="max-h-[180px] overflow-y-auto border rounded-md p-2">
          {members.length === 0 ? (
            <div className="text-sm text-muted-foreground py-2">
              No members available in this workspace
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-2 p-2 border-b">
                <Checkbox
                  id="select-all"
                  checked={selectedMembers.length === members.length}
                  onCheckedChange={handleSelectAll}
                  disabled={mutation.isPending || !targetWorkspaceId}
                />
                <label htmlFor="select-all" className="text-sm font-medium leading-none">
                  Select All
                </label>
              </div>
              {members.map(member => (
                <div key={member.id} className="flex items-center space-x-2 p-2">
                  <Checkbox
                    id={`member-${member.id}`}
                    checked={selectedMembers.includes(member.id)}
                    onCheckedChange={(checked) =>
                      handleMemberSelection(member.id, checked)
                    }
                    disabled={mutation.isPending || !targetWorkspaceId}
                  />
                  <label
                    htmlFor={`member-${member.id}`}
                    className="text-sm font-medium leading-none"
                  >
                    {member.username} ({member.email})
                  </label>
                </div>
              ))}
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <DialogFooter className="flex gap-2 w-full pt-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onClose}
          disabled={mutation.isPending}
        >
          Cancel
        </Button>
        <Button
          onClick={handleTransferMembers}
          disabled={
            mutation.isPending || selectedMembers.length === 0 || !targetWorkspaceId
          }
          className="flex-1 bg-figmaPrimaryDark"
        >
          Transfer Members
        </Button>
      </DialogFooter>
    </motion.div>
  );
};

export default TransferDialog;