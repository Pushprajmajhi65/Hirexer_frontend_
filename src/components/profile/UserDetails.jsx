import React from "react";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { useForm } from "react-hook-form";
import { Separator } from "../ui/separator";
import Wrapper from "./Wrapper";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const UserDetails = () => {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => {
    console.log(data);
  };
  return (
    <div>
      <Card>
        <CardContent>
          <CardTitle>Personal info</CardTitle>
          <CardDescription>
            Update your photo and personal details here.
          </CardDescription>
          <Separator className="my-5" />
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <Wrapper>
              <Label className=''>Name</Label>
              <Input type="text" {...register("name", { required: true })}  className='md:w-[512px]'/>
            </Wrapper>
            <Button type="submit" className='w-[120px]'>Save</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDetails;
