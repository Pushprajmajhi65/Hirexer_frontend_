import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MoveRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import EmployeeTable from "@/components/employee/EmployeeTable";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Invite from "@/components/employee/Invite";
import TransferDialog from "@/components/employee/TransferDialog"; // Import Transfer Dialog

const Employee = () => {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false); // State for transfer dialog
  const handleCloseInviteDialog = () => {
    setIsInviteOpen(false);
  };
  const handleCloseTransferDialog = () => {
    setIsTransferOpen(false);
  };

  return (
    <div>
      <Card className="">
        <CardContent className="flex items-center justify-between">
          <section className="">
            <h2 className="font-[600] text-base md:text-[20px] ">
              Manage Employee
            </h2>
            <h3 className=" text-xs md:text-[14px] text-muted-foreground">
              Manage teams and members
            </h3>
          </section>
          <div className="flex gap-2">
            {/* Invite Button */}
            <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
              <DialogTrigger className="bg-figmaPrimaryDark w-[110px] py-2 rounded-md text-white hover:bg-figmaPrimary transition-colors ease-in-out duration-200 ">
                <span className="flex items-center justify-center">
                  <Plus />
                  Invite
                </span>
              </DialogTrigger>
              <DialogContent className="w-[352px]">
                <Invite onClose={handleCloseInviteDialog} />
              </DialogContent>
            </Dialog>

            {/* Transfer Members Button */}
            <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
              <DialogTrigger className="bg-figmaPrimaryDark w-[140px] py-2 rounded-md text-white hover:bg-figmaPrimary transition-colors ease-in-out duration-200 ">
                <span className="flex items-center justify-center">
                  <MoveRight />
                  Transfer Members
                </span>
              </DialogTrigger>
              <DialogContent className="w-[352px]">
                {/* Transfer Members Dialog */}
                <TransferDialog
                  onClose={handleCloseTransferDialog}
                  memberEmails={[]} // Pass selected member emails if needed
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
        <Separator />
        <EmployeeTable />
      </Card>
    </div>
  );
};

export default Employee;