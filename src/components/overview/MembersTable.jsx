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

  if (isLoading) {
    return (
      <div className="">
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
    data?.find((el) => el.name === selectedWorkspace.name) || {};

  return (
    <div className="">
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
          {workspaceData.members_details?.map((el,index) => (
            <TableRow key={el.id} className="bg-white hover:bg-gray-50">
              <TableCell>{index+1}</TableCell>
              <TableCell>{el.username}</TableCell>
              <TableCell>{el.email}</TableCell>
              <TableCell>{new Date(el.joined_at).toLocaleDateString()}</TableCell>
              <TableCell>{el.role}</TableCell>
              <TableCell>{el.status}</TableCell>
            </TableRow>
          ))}
          {!workspaceData.members_details?.length && (
            <TableRow>
              <TableCell colSpan={overviewTable.length} className="text-center">
                No members found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default MembersTable;
