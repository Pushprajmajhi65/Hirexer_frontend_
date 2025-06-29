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
import { Dialog, DialogContent } from "../ui/dialog";

import DeleteDialog from "./DeleteDialog";
import EditDialog from "./EditDialog";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useGetUserWorkspace } from "@/services/workspace";
import { Skeleton } from "../ui/skeleton";
import { CalendarX2 } from "lucide-react";

const TableRowSkeleton = () => (
  <TableRow>
    {employeeTableHeader.map((_, index) => (
      <TableCell key={index}>
        <Skeleton className="h-6 w-[100px]" />
      </TableCell>
    ))}
  </TableRow>
);

const EmployeeTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
const storedWorkspace = JSON.parse(localStorage.getItem("selectedWorkspace"));
const selectedWorkspaceId = storedWorkspace?.id;
  const { selectedWorkspace } = useWorkspace();
  const { data, isLoading, error } = useGetUserWorkspace();

  const handleCloseDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedEmployee(null);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedEmployee(null);
  };

  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (employee) => {
    setSelectedEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Error loading employee data: {error.message}
      </div>
    );
  }
  const workspaces = Array.isArray(data)
    ? data
    : data?.workspaces || [];

  const workspaceData = workspaces.find(
    (el) => el.name === selectedWorkspace?.name
  );

  const members = workspaceData?.members_details || [];

  const filteredData = members.filter((member) =>
    member.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-5">
        <Input
          type="text"
          className="w-max md:w-[320px]"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden">
        <Table>
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
            {isLoading &&
              Array(5)
                .fill(0)
                .map((_, index) => <TableRowSkeleton key={index} />)}

            {!isLoading && !selectedWorkspace && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  Please select a workspace
                </TableCell>
              </TableRow>
            )}

            {!isLoading && selectedWorkspace && members.length === 0 && (
              <TableRow>
               <TableCell colSpan={8} className="py-10 text-center text-gray-500">
                <div className="flex flex-col items-center justify-center">
                  <div className="mb-3 p-3 bg-gray-100 rounded-full">
                    <CalendarX2 size={32} className="text-gray-400" />
                  </div>
                  <p className="text-base font-medium text-gray-800 mb-1">
                    No members found in this workspace
                  </p>
                  <p className="text-sm text-gray-500 max-w-md">
                    You can invite new members by clicking the <strong>"Invite"</strong> button above.
                  </p>
                </div>
              </TableCell>
              </TableRow>
            )}

            {!isLoading && filteredData.length === 0 && searchQuery && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  No results found for "{searchQuery}"
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              filteredData.map((member) => (
                <TableRow key={member.id} className="border-b hover:bg-gray-50">
                  <TableCell>{member.id}</TableCell>
                  <TableCell>{member.username}</TableCell>
                  <TableCell>
                    {new Date(member.joined_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>
                    <EmployeeStatus status={member.status} />
                  </TableCell>
                  <TableCell className="flex gap-5">
                    <button
                      onClick={() => handleEditClick(member)}
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(member)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

     <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
  <DialogContent className="w-[400px]">
    <DeleteDialog
      onClose={handleCloseDialog}
      workspaceId={selectedWorkspaceId}   
      memberId={selectedEmployee?.id}    
    />
  </DialogContent>
</Dialog>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <EditDialog onClose={handleCloseEditDialog} employee={selectedEmployee} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeTable;