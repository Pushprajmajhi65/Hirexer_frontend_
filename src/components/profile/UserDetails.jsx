import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { Controller, useForm } from "react-hook-form";
import { Separator } from "../ui/separator";
import Wrapper from "./Wrapper";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { countryData, timezoneData } from "@/constants";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "../ui/select";

const UserDetails = () => {
  const { register, handleSubmit, control } = useForm();

  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data) => {
    console.log(data);
  };
  return (
    <div className="w-full ">
      <Card className="w-full">
        <CardContent className="">
          <div className="max-w-[1200px]">
            <CardTitle className="text-2xl">Personal info</CardTitle>
            <CardDescription className="mt-2">
              Update your photo and personal details here.
            </CardDescription>
            <Separator className="my-5" />
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-8"
            >
              <Wrapper>
                <Label className=" min-w-[200px] xl:min-w-[300px] text-sm font-medium">
                  Name
                </Label>
                <Input
                  type="text"
                  placeholder="Your name"
                  {...register("name", { required: true })}
                  className="flex-1 max-w-[600px] p-4 placeholder:text-[15px] bg-gray-50"
                />
              </Wrapper>
              <Wrapper>
                <Label className="min-w-[200px] xl:min-w-[300px] text-sm font-medium">
                  Email address
                </Label>
                <Input
                  type="email"
                  placeholder="hirexer@gmail.com"
                  className="flex-1 max-w-[600px] p-4 placeholder:text-[15px] bg-gray-50"
                  {...register("email", { required: "This field is required" })}
                />
              </Wrapper>
              <Wrapper>
                <section className="min-w-[200px] xl:min-w-[300px]">
                  <Label>Your photo</Label>
                  <span className="block text-muted-foreground text-xs">
                    This will be displayed on your profile.
                  </span>
                </section>
                <div className="flex-1 max-w-[600px]">
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-6 ${
                      dragActive
                        ? "border-primary bg-primary/10"
                        : "border-gray-300"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="text-center flex  items-center justify-center">
                      {imagePreview ? (
                        <div className="flex items-center  gap-4">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-24 h-24 rounded-full object-cover"
                          />
                          <div className="hidden md:flex flex-col text-left">
                            <p className="text-sm font-medium">
                              Click or drag and drop to replace
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Maximum file size: 2MB
                            </p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                              />
                            </svg>
                          </div>
                          <p className="text-sm font-medium text-figmaPrimary">
                            Click to upload
                            <span className="text-muted-foreground">
                              {" "}
                              or drag and drop
                            </span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            SVG, PNG, JPG or GIF (max. 800x400px)
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Wrapper>
              <Wrapper>
                <Label className="min-w-[200px] xl:min-w-[300px] text-sm font-medium">
                  Company
                </Label>
                <Input
                  type="text"
                  placeholder="Company name"
                  {...register("company", { required: true })}
                  className="flex-1 max-w-[600px] p-4 placeholder:text-[15px] bg-gray-50"
                />
              </Wrapper>
              <Wrapper>
                <Label className="min-w-[200px] xl:min-w-[300px] text-sm font-medium">
                  Role
                </Label>
                <Input
                  type="text"
                  placeholder="Your role"
                  {...register("role", { required: true })}
                  className="flex-1 max-w-[600px] p-4 placeholder:text-[15px] bg-gray-50"
                />
              </Wrapper>
              <Wrapper>
                <Label className="min-w-[200px] xl:min-w-[300px] text-sm font-medium">
                  Country
                </Label>
                <Controller
                  name="country"
                  control={control}
                  rules={{ required: "Country is required" }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="flex-1 w-full max-w-[600px] p-4 placeholder:text-[15px] bg-gray-50">
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countryData.map((el) => (
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
                <Label className="min-w-[200px] xl:min-w-[300px] text-sm font-medium">
                  Timezone
                </Label>
                <Controller
                  name="timezone"
                  control={control}
                  rules={{ required: "Timezone is required" }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="flex-1 w-full max-w-[600px] p-4 placeholder:text-[15px] bg-gray-50">
                        <SelectValue placeholder="Select a timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        {timezoneData.map((el) => (
                          <SelectItem value={el.name} key={el.abbreviation}>
                            {el.name} ({el.abbreviation}){" "}
                            <span className="text-muted-foreground">
                              {el.utc_offset}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Wrapper>
              <div className="flex justify-end mt-4">
                <Button type="submit" className="w-[120px]">
                  Save
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDetails;
