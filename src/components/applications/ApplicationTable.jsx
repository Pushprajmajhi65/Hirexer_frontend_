import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { useParams } from "react-router-dom";
import { useGetPostApplications } from "@/services/post";
import { getStatusColor } from "@/utils/getStatusColor";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import EditDialog from "./EditDialog";
import { Edit } from "lucide-react";

const ApplicationTable = () => {
  const { id } = useParams();
  const [open, setIsOpen] = useState(false);
  /*   console.log(id); */
  const { data, isLoading } = useGetPostApplications(id);
  const handleClose = () => {
    setIsOpen(false);
  };
 
  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Applied Date</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Experience Level</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[1, 2, 3, 4, 5].map((index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="h-4 w-[200px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[250px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[100px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[120px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[100px]" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  if (!data?.length) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No applications found</p>
      </div>
    );
  }

  return (
    <Table className="border border-gray-400 rounded-xl overflow-hidden">
      <TableHeader className="bg-tableHeader">
        <TableRow className="h-[40px]">
          <TableHead className="text-muted-foreground">Applied Date</TableHead>
          <TableHead className="text-muted-foreground">Email</TableHead>
          <TableHead className="text-muted-foreground">
            Experience Level
          </TableHead>
          <TableHead className="text-muted-foreground">Status</TableHead>
          <TableHead className="text-muted-foreground">CV</TableHead>
          <TableHead className="text-muted-foreground">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((application) => (
          <TableRow key={application.id} className="bg-white hover:bg-gray-50">
            <TableCell>{formatDate(application.applied_at)}</TableCell>
            <TableCell>{application.email}</TableCell>
            <TableCell>{application.experience_level} years</TableCell>
            <TableCell>
              <Badge className={getStatusColor(application.application_status)}>
                {application.application_status}
              </Badge>
            </TableCell>
            <TableCell>
              <a
                href={application.cv}
                className="bg-figmaPrimary text-white px-3 py-2 rounded-md"
                target="_blank"
                rel="noopener noreferrer"
              >
                View CV
              </a>
            </TableCell>
            <TableCell>
              <Dialog>
                <DialogTrigger>
                  <Edit className="text-figmaPrimary" size={20}/>
                </DialogTrigger>
                <DialogContent>
                  <EditDialog application={application} onClose={handleClose} />
                </DialogContent>
              </Dialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ApplicationTable;
