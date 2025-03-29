import React from "react";
import { useNavigate } from "react-router-dom";
import inboxImage from "../assets/inbox.png";
import { useForm, Controller } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { IndustryNames } from "@/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateWorkspace, useGetUserWorkspace } from "@/services/workspace";

const CreateWorkspace = () => {
  const { register, reset, control, handleSubmit } = useForm();
  const navigate = useNavigate();

  const mutation = useCreateWorkspace();
  const { data: workspaceData, isLoading } = useGetUserWorkspace();
  /* console.log(workspaceData); */

  const onSubmit = (data) => {
    /*   console.log(data); */
    mutation.mutate(
      {
        name: data.name,
        email: data.email,
        industry: data.industry,
        phone_number: data.phone_number,
        country: data.country,
      },
      {
        onSuccess: () => {
          reset();
        },
      }
    );
  };
  return (
    <div className="bg-figmaBackground min-h-screen px-4 xl:px-0 flex items-center justify-center">
      <Card className="w-[552px]">
        <CardContent className="flex items-center justify-center flex-col space-y-5 md:px-[48px] md:py-[64px]">
          <img
            src={inboxImage}
            alt="inbox image"
            className="h-24 bg-gray-100 p-4 rounded-full"
          />
          <h1 className="text-[30px] font-[600] tracking-wide text-center">
            Let’s start with your Onboarding
          </h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col space-y-4"
          >
            <Wrapper>
              <Label className="font-semibold">Workspace Name</Label>
              <Input
                disabled={mutation.isPending}
                type="text"
                className="p-5 placeholder:text-[15px] bg-gray-50"
                placeholder="Your workspace name"
                {...register("name", {
                  required: "Workspace name is required",
                })}
              />
            </Wrapper>

            <Wrapper>
              <Label className="font-semibold">Email</Label>
              <Input
                className="p-5 placeholder:text-[15px] bg-gray-50"
                type="email"
                disabled={mutation.isPending}
                {...register("email", {
                  required: "An Email address is required",
                })}
              />
            </Wrapper>

            <Wrapper>
              <Label className="font-semibold">Country</Label>
              <Input
                type="text"
                disabled={mutation.isPending}
                className="p-5 placeholder:text-[15px] bg-gray-50"
                {...register("country", { required: "Country is required" })}
              />
            </Wrapper>

            <Wrapper>
              <Label className="font-semibold">Industry</Label>
              <Controller
                name="industry"
                disabled={mutation.isPending}
                control={control}
                rules={{ required: "Industry is required" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="p-5 placeholder:text-[15px] bg-gray-50 w-full">
                      <SelectValue placeholder="Select an industry" />
                    </SelectTrigger>
                    <SelectContent>
                    {IndustryNames.map((el) => (
                        <SelectItem value={el.name} key={el.id}>
                          {el.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Wrapper>

            <Wrapper>
              <Label className="font-semibold">Phone Number</Label>
              <Input
                type="text"
                disabled={mutation.isPending}
                className="p-5 placeholder:text-[15px] bg-gray-50"
                placeholder="+977 9800000000"
                {...register("phone_number", {
                  required: "Phone Number is required",
                })}
              />
            </Wrapper>
            <Button
              disabled={mutation.isPending}
              type="submit"
              className="w-full cursor-pointer font-semibold "
            >
              {mutation.isPending ? "Creating workspace" : " Next"}
            </Button>
          </form>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/")}
            disabled={isLoading || workspaceData.length === 0}
          >
            Skip
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

const Wrapper = ({ children }) => {
  return <div className="flex flex-col space-y-1">{children}</div>;
};

export default CreateWorkspace;
