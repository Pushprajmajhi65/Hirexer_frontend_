import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import EmployeeTable from "@/components/employee/EmployeeTable";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Invite from "@/components/employee/Invite";

const Employee = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleCloseDialog = () => {
    setIsOpen(false);
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
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger className="bg-figmaPrimaryDark  w-[110px] py-2 rounded-md text-white hover:bg-figmaPrimary transition-colors ease-in-out duration-200 ">
              <span className="flex items-center justify-center">
                <Plus />
                Invite
              </span>
            </DialogTrigger>
            <DialogContent className="w-[352px]">
              <Invite onClose={handleCloseDialog} />
            </DialogContent>
          </Dialog>
        </CardContent>
        <Separator />
        <EmployeeTable />
      </Card>
    </div>
  );
};

export default Employee;
