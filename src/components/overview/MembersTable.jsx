import React from "react";
import { overviewTable } from "@/constants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useGetUserWorkspace } from "@/services/workspace";
import { Skeleton } from "../ui/skeleton";

const TableRowSkeleton = () => (
  <TableRow className="bg-white">
    {overviewTable.map((_, index) => (
      <TableCell key={index}>
        <Skeleton className="h-6 w-[100px]" />
      </TableCell>
    ))}
  </TableRow>
);

const MembersTable = () => {
  const { selectedWorkspace } = useWorkspace();
  const { data, isLoading } = useGetUserWorkspace();

  if (!selectedWorkspace) return <p className="text-center">No workspace selected</p>;

  if (isLoading) {
    return (
      <div>
        <Table className="border border-gray-400 rounded-xl overflow-hidden">
          <TableHeader className="bg-tableHeader">
            <TableRow className="h-[40px]">
              {overviewTable.map((el) => (
                <TableHead className="text-muted-foreground" key={el.name}>
                  {el.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((index) => (
              <TableRowSkeleton key={index} />
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  const workspaceData =
    data?.find((el) => el.name === selectedWorkspace?.name) || {};

  // Filtering only active members
  const activeMembers =
    workspaceData.members_details?.filter(
      (el) => el.role.toLowerCase() === "active"
    ) || [];

  return (
    <div>
      <Table className="border border-gray-400 rounded-xl overflow-hidden">
        <TableHeader className="bg-tableHeader">
          <TableRow className="h-[40px]">
            {overviewTable.map((el) => (
              <TableHead className="text-muted-foreground" key={el.name}>
                {el.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {activeMembers.length > 0 ? (
            activeMembers.map((el, index) => (
              <TableRow key={el.id} className="bg-white hover:bg-gray-50">
                <TableCell>{index + 1}</TableCell>
                <TableCell>{el.username}</TableCell>
                <TableCell>{el.email}</TableCell>
                <TableCell>
                  {new Date(el.joined_at).toLocaleDateString()}
                </TableCell>
                <TableCell>{el.role}</TableCell>
                <TableCell>{el.status}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={overviewTable.length} className="text-center">
                No active members found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default MembersTable;
