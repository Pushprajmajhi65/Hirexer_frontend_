import React, { useState } from "react";
import { DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import invite from "../../assets/invite.png";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

const Invite = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const handleAdd = () => {};
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
        <Label>Email address</Label>
        <Input
          type="email"
          placeholder="hirexer@gmail.com"
          value={email}
          className='placeholder:text-[16px] h-12'
          onChange={(e) => setEmail(e.target.value)}
        />
      </section>
      <DialogFooter className="flex gap-2 w-full pt-3">
        <Button variant="outline" className="flex-1 " onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleAdd} className="flex-1 bg-figmaPrimaryDark">
          Send Invites
        </Button>
      </DialogFooter>
    </div>
  );
};

export default Invite;
