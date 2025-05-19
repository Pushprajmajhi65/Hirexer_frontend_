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
import { Skeleton } from "../ui/skeleton"
import { AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
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
  const { data, isLoading, isError } = useGetUserWorkspace();

if (!selectedWorkspace) {
  return (
    <div className="flex flex-col items-center justify-center p-8 border border-gray-200 rounded-xl bg-gray-50">
      <div className="mb-4 p-4 bg-yellow-100 rounded-full">
        <AlertCircle className="h-8 w-8 text-yellow-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No Workspace Selected
      </h3>
      <p className="text-gray-500 mb-6 text-center max-w-md">
        You haven't selected a workspace yet. Please add or choose a workspace to continue.
      </p>
      <div className="flex gap-3">
        <Button
          variant="default"
          onClick={() => {
            window.location.href = "/onboarding";
          }}
        >
          Add New Workspace
        </Button>
      </div>
    </div>
  );
}

  if (isLoading || !data) {
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

  if (isError) {
    return <p className="text-center">Error loading workspace data</p>;
  }
// Safely get workspace data
const workspaceData = Array.isArray(data)
  ? data.find((el) => el.name === selectedWorkspace?.name)
  : data?.workspaces?.find((el) => el.name === selectedWorkspace?.name);

if (!workspaceData || !workspaceData.members?.length) {
  return (
    <div className="flex flex-col items-center justify-center p-8 border border-gray-200 rounded-xl bg-gray-50">
      <div className="mb-4 p-4 bg-red-100 rounded-full">
        <AlertCircle className="h-8 w-8 text-red-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No Workspace Selected or Empty Workspace
      </h3>
      <p className="text-gray-500 mb-6 text-center max-w-md">
        It looks like you haven't selected a workspace yet or the selected workspace has no members. Please add a new workspace to continue.
      </p>
      <div className="flex gap-3">
        <Button
          variant="default"
          onClick={() => {
            window.location.href = "/onboarding";
          }}
        >
          Add New Workspace
        </Button>
      </div>
    </div>
  );
}
  // Safely get members with fallback to empty array
  const members = workspaceData?.members_details || [];
  
  // Filtering only active members
  const activeMembers = members.filter(
    (el) => el?.status?.toLowerCase() === "active"
  );

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
              <TableRow key={el.id || index} className="bg-white hover:bg-gray-50">
                <TableCell>{index + 1}</TableCell>
                <TableCell>{el.username || 'N/A'}</TableCell>
                <TableCell>{el.email || 'N/A'}</TableCell>
                <TableCell>
                  {el.joined_at ? new Date(el.joined_at).toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell>{el.role || 'N/A'}</TableCell>
                <TableCell>{el.status || 'N/A'}</TableCell>
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