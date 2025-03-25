import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { employeeTableHeader } from "@/constants";
import EmployeeStatus from "./EmployeeStatus";
import { Edit2, Trash2Icon } from "lucide-react";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import DeleteDialog from "./DeleteDialog";

export const employeeTableData = [
  {
    id: 1,
    name: "John Doe",
    joinDate: "2023-06-15",
    dob: "1990-04-20",
    type: "Full-time",
    phoneNumber: "+1 234-567-8901",
    status: "Active",
    actions: "Edit | Delete",
  },
  {
    id: 2,
    name: "Jane Smith",
    joinDate: "2022-09-10",
    dob: "1985-11-05",
    type: "Part-time",
    phoneNumber: "+1 987-654-3210",
    status: "Inactive",
    actions: "Edit | Delete",
  },
  {
    id: 3,
    name: "Michael Johnson",
    joinDate: "2021-12-01",
    dob: "1995-07-25",
    type: "Contract",
    phoneNumber: "+44 1234-567890",
    status: "Active",
    actions: "Edit | Delete",
  },
  {
    id: 4,
    name: "Emily Davis",
    joinDate: "2020-03-18",
    dob: "1992-02-14",
    type: "Full-time",
    phoneNumber: "+91 98765-43210",
    status: "Inactive",
    actions: "Edit | Delete",
  },
  {
    id: 5,
    name: "Robert Brown",
    joinDate: "2024-01-05",
    dob: "2000-06-30",
    type: "Intern",
    phoneNumber: "+33 7654-321098",
    status: "Active",
    actions: "Edit | Delete",
  },
  {
    id: 6,
    name: "Sophia Wilson",
    joinDate: "2019-07-23",
    dob: "1988-09-12",
    type: "Part-time",
    phoneNumber: "+61 4567-890123",
    status: "Inactive",
    actions: "Edit | Delete",
  },
  {
    id: 7,
    name: "David Miller",
    joinDate: "2023-02-10",
    dob: "1998-01-05",
    type: "Full-time",
    phoneNumber: "+49 3214-567890",
    status: "Active",
    actions: "Edit | Delete",
  },
  {
    id: 8,
    name: "Olivia Martinez",
    joinDate: "2022-11-08",
    dob: "1993-05-22",
    type: "Contract",
    phoneNumber: "+81 9876-543210",
    status: "Inactive",
    actions: "Edit | Delete",
  },
];

const EmployeeTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleCloseDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const filteredData = employeeTableData.filter((el) =>
    el.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div>
      <Input
        type="text"
        className=" w-max md:w-[320px] mb-5 ml-5"
        placeholder="Search for"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <Table className=" border-1 border-gray-200">
        <TableHeader className="bg-tableHeader">
          <TableRow className="h-[40px]">
            {employeeTableHeader.map((el) => (
              <TableHead className="text-muted-foreground" key={el.id}>
                {el.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.length > 0 ? (
            filteredData.map((el, index) => (
              <TableRow key={el.id} className="border-b hover:bg-gray-50">
                <TableCell>{index + 1}</TableCell>
                <TableCell>{el.name}</TableCell>
                <TableCell>{el.joinDate}</TableCell>
                <TableCell>{el.dob}</TableCell>
                <TableCell>{el.type}</TableCell>
                <TableCell>{el.phoneNumber}</TableCell>
                <TableCell className="font-semibold">
                  <EmployeeStatus status={el.status} />
                </TableCell>
                <TableCell className="flex gap-3">
                  <Dialog
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                  >
                    <DialogTrigger className="text-red-500 hover:text-red-700 transition-colors ease-linear duration-150 cursor-pointer">
                      <Trash2Icon />
                    </DialogTrigger>
                    <DialogContent className="w-[400px]">
                      <DeleteDialog onClose={handleCloseDialog} />
                    </DialogContent>
                  </Dialog>
                  <Edit2 />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4">
                No results found for "{searchQuery}"
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeeTable;
