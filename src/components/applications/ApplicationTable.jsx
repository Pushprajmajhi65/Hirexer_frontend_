import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";

export const data = [
  {
    job_post: "Software Developer",
    full_name: "Alex Johnson",
    email: "alex.johnson@example.com",
  },
  {
    job_post: "Graphic Designer",
    full_name: "Maria Gonzales",
    email: "maria.gonzales@example.com",
  },
  {
    job_post: "Data Analyst",
    full_name: "John Smith",
    email: "john.smith@example.com",
  },
  {
    job_post: "Project Manager",
    full_name: "Emily Davis",
    email: "emily.davis@example.com",
  },
  {
    job_post: "Cybersecurity Specialist",
    full_name: "Daniel Lee",
    email: "daniel.lee@example.com",
  },
];

const ApplicationTable = () => {
  return (
    <div>
      <Table className="border border-gray-400 rounded-xl overflow-hidden ">
        <TableHeader className="bg-tableHeader">
          <TableRow className=" h-[40px] ">
            <TableHead className="text-muted-foreground">Job post name</TableHead>
            <TableHead className='text-muted-foreground'>Full Name</TableHead>
            <TableHead className='text-muted-foreground'>Email Address</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((el) => (
            <TableRow className="bg-white hover:bg-gray-50" key={el.full_name}>
              <TableCell>{el.job_post}</TableCell>
              <TableCell>{el.full_name}</TableCell>
              <TableCell>{el.email}</TableCell>
              <TableCell>
                {" "}
                <Button className="bg-figmaPrimaryDark">View CV</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicationTable;
