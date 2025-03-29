import React, { useState } from "react";
import { DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import invite from "../../assets/invite.png";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useInviteWorkspace } from "../../services/workspace";
import toast from "react-hot-toast";
import { useWorkspace } from "@/context/WorkspaceContext";

const Invite = ({ onClose }) => {
  const [emailInput, setEmailInput] = useState("");
  const { selectedWorkspace } = useWorkspace();
  /*   console.log(selectedWorkspace.id) */
  const mutation = useInviteWorkspace();

  const handleSendInvites = () => {
    const emails = emailInput
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email !== "");

    if (emails.length === 0) {
      toast.error("Please enter at least one email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = emails.filter((email) => !emailRegex.test(email));

    if (invalidEmails.length > 0) {
      toast.error(`Invalid email format: ${invalidEmails.join(", ")}`);
      return;
    }

    mutation.mutate(
      {
        workspace_id: selectedWorkspace.id,
        emails: emails,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <div className="text-center flex items-center justify-center flex-col gap-3">
      <img src={invite} alt="cross image" className="h-[48px] w-[48px]" />
      <DialogTitle className="leading-7 pt-2">Invite members</DialogTitle>
      <DialogDescription className="text-[14px] ">
        Invite new members to your workspace
        <br />
        and begin collaborating.
      </DialogDescription>
      <section className="w-full flex flex-col gap-1">
        <Label>Email addresses</Label>
        <Input
          type="text"
          placeholder="email1@example.com, email2@example.com"
          value={emailInput}
          disabled={mutation.isPending}
          className="placeholder:text-[16px] h-12"
          onChange={(e) => setEmailInput(e.target.value)}
        />
        <span className="text-sm text-gray-500 mt-1">
          Enter multiple email addresses separated by commas
        </span>
      </section>
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
          onClick={handleSendInvites}
          disabled={mutation.isPending || emailInput.length === 0}
          className="flex-1 bg-figmaPrimaryDark"
        >
          Send Invites
        </Button>
      </DialogFooter>
    </div>
  );
};

export default Invite;
