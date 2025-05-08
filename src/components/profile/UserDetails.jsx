import React, { useEffect, useState } from "react";
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
import { Textarea } from "../ui/textarea";
import { useGetUserData, useUpdateUserData } from "@/services/user";
import Loader from "../shared/Loader";
import toast from "react-hot-toast";

const UserDetails = () => {
  const { 
    register, 
    handleSubmit, 
    control, 
    setValue,
    formState: { errors } // Destructure errors here
  } = useForm();
  
  const mutation = useUpdateUserData();
  const { data: userData, isLoading } = useGetUserData();

  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingPhoto, setExistingPhoto] = useState(null);
  const [photoRemoved, setPhotoRemoved] = useState(false);
  const [fileToUpload, setFileToUpload] = useState(null);

  useEffect(() => {
    if (userData) {
      setValue("username", userData.username || "");
      setValue("email", userData.email || "");
      setValue("description", userData.description || "");
      setValue("skills", userData.skills || "");
      setValue("role", userData.role || "");
      setValue("country", userData.country || "");
      setValue("time_zone", userData.time_zone || "");
      setExistingPhoto(userData.photo || null);
    }
  }, [userData, setValue]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleChange = (e) => {
    handleFile(e.target.files[0]);
  };

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size should not exceed 2MB");
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      if (img.width > 800 || img.height > 400) {
        toast.error("Image dimensions should not exceed 800x400px");
        return;
      }

      setFileToUpload(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
        setPhotoRemoved(false);
      };
      reader.readAsDataURL(file);
    };

    img.src = objectUrl;
  };

  const handleRemovePhoto = () => {
    setImagePreview(null);
    setFileToUpload(null);
    setPhotoRemoved(true);
  };

  const onSubmit = async (data) => {
    try {
      let photoToSubmit = existingPhoto;
  
      if (fileToUpload) {
        if (fileToUpload.size > 2 * 1024 * 1024) {
          toast.error("File size should not exceed 2MB");
          return;
        }
  
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = () => {
            if (img.width > 800 || img.height > 400) {
              toast.error("Image dimensions should not exceed 800x400px");
              reject(new Error("Invalid dimensions"));
            }
            resolve();
          };
          img.src = URL.createObjectURL(fileToUpload);
        });
  
        photoToSubmit = fileToUpload;
      } else if (photoRemoved) {
        photoToSubmit = null;
      }
  
      mutation.mutate({
        username: data.username,
        description: data.description,
        skills: data.skills,
        role: data.role,
        country: data.country,
        time_zone: data.time_zone,
        photo: photoToSubmit,
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error(error.response?.data?.error || "Failed to update profile");
    }
  };

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardContent className="">
          <div className="max-w-[1200px]">
            <CardTitle className="text-2xl">Personal info</CardTitle>
            <CardDescription className="mt-2">
              Update your photo and personal details here.
            </CardDescription>
            <Separator className="my-5" />

            {isLoading ? (
              <Loader />
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-8"
              >
                <Wrapper>
                  <Label className="min-w-[200px] xl:min-w-[300px] text-sm font-medium">
                    Name
                  </Label>
                  <div className="flex-1 max-w-[600px]">
                    <Input
                      type="text"
                      placeholder="Your name"
                      disabled={isLoading || mutation.isPending}
                      {...register("username", { 
                        required: "Username is required",
                        minLength: {
                          value: 3,
                          message: "Username must be at least 3 characters"
                        },
                        maxLength: {
                          value: 30,
                          message: "Username must not exceed 30 characters"
                        },
                        pattern: {
                          value: /^[a-zA-Z0-9_]+$/,
                          message: "Username can only contain letters, numbers and underscores"
                        }
                      })}
                      className="w-full p-4 placeholder:text-[15px] bg-gray-50"
                    />
                    {errors.username && (
                      <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                    )}
                  </div>
                </Wrapper>
                
                <Wrapper>
                  <Label className="min-w-[200px] xl:min-w-[300px] text-sm font-medium">
                    Email address
                  </Label>
                  <Input
                    type="email"
                    disabled
                    placeholder="hirexer@gmail.com"
                    className="flex-1 max-w-[600px] p-4 placeholder:text-[15px] bg-gray-50"
                    {...register("email")}
                  />
                </Wrapper>

                <Wrapper>
                  <section className="min-w-[200px] xl:min-w-[300px]">
                    <Label>Your photo</Label>
                    <span className="block text-muted-foreground text-xs">
                      This will be displayed on your profile.
                    </span>
                  </section>
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between flex-1 max-w-[600px]">
                    <div
                      className={`relative border-2 border-dashed rounded-lg p-4 md:p-6 flex-1 ${
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
                        disabled={isLoading || mutation.isPending}
                        onChange={handleChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="text-center flex items-center justify-center">
                        {imagePreview || (existingPhoto && !photoRemoved) ? (
                          <div className="flex flex-col md:flex-row items-center gap-4">
                            <img
                              src={imagePreview || existingPhoto}
                              alt="Preview"
                              className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover"
                            />
                            <div className="flex flex-col text-left text-center md:text-left">
                              <p className="text-sm font-medium">
                                Click or drag and drop to replace
                              </p>
                              <p className="text-xs md:text-sm text-muted-foreground">
                                Maximum file size: 2MB
                              </p>
                              <button
                                type="button"
                                onClick={handleRemovePhoto}
                                className="text-red-500 text-sm mt-1"
                                disabled={isLoading || mutation.isPending}
                              >
                                Remove photo
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
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
                            <section className="text-center">
                              <p className="text-sm font-medium text-figmaPrimary">
                                Click to upload{" "}
                                <span className="text-muted-foreground">
                                  or drag and drop
                                </span>
                              </p>
                              <p className="text-xs text-muted-foreground">
                                SVG, PNG, JPG or GIF (max. 800x400px)
                              </p>
                            </section>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Wrapper>

                <Wrapper>
                  <Label className="min-w-[200px] xl:min-w-[300px] text-sm font-medium">
                    Description
                  </Label>
                  <Textarea
                    placeholder="Description"
                    disabled={isLoading || mutation.isPending}
                    {...register("description", { required: "Description is required" })}
                    className="flex-1 max-w-[600px] max-h-[120px] p-4 placeholder:text-[15px] bg-gray-50"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                  )}
                </Wrapper>

                <Wrapper>
                  <Label className="min-w-[200px] xl:min-w-[300px] text-sm font-medium">
                    Skills
                  </Label>
                  <Textarea
                    placeholder="Skills"
                    disabled={isLoading || mutation.isPending}
                    {...register("skills", { required: "Skills are required" })}
                    className="flex-1 max-w-[600px] max-h-[120px] p-4 placeholder:text-[15px] bg-gray-50"
                  />
                  {errors.skills && (
                    <p className="text-red-500 text-sm mt-1">{errors.skills.message}</p>
                  )}
                </Wrapper>

                <Wrapper>
                  <Label className="min-w-[200px] xl:min-w-[300px] text-sm font-medium">
                    Role
                  </Label>
                  <Input
                    type="text"
                    placeholder="Your role"
                    disabled={isLoading || mutation.isPending}
                    {...register("role", { required: "Role is required" })}
                    className="flex-1 max-w-[600px] p-4 placeholder:text-[15px] bg-gray-50"
                  />
                  {errors.role && (
                    <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
                  )}
                </Wrapper>

                <Wrapper>
                  <Label className="min-w-[200px] xl:min-w-[300px] text-sm font-medium">
                    Country
                  </Label>
                  <Controller
                    name="country"
                    control={control}
                    defaultValue={userData?.country || ""}
                    rules={{ required: "Country is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <div className="flex-1 max-w-[600px]">
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={mutation.isPending || isLoading}
                        >
                          <SelectTrigger className="w-full p-4 placeholder:text-[15px] bg-gray-50">
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
                        {error && (
                          <p className="text-red-500 text-sm mt-1">{error.message}</p>
                        )}
                      </div>
                    )}
                  />
                </Wrapper>

                <Wrapper>
                  <Label className="min-w-[200px] xl:min-w-[300px] text-sm font-medium">
                    Timezone
                  </Label>
                  <Controller
                    name="time_zone"
                    control={control}
                    defaultValue={userData?.time_zone || ""}
                    rules={{ required: "Timezone is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <div className="flex-1 max-w-[600px]">
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isLoading || mutation.isPending}
                        >
                          <SelectTrigger className="w-full p-4 placeholder:text-[15px] bg-gray-50">
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
                        {error && (
                          <p className="text-red-500 text-sm mt-1">{error.message}</p>
                        )}
                      </div>
                    )}
                  />
                </Wrapper>

                <div className="flex justify-end mt-4">
                  <Button
                    type="submit"
                    className="w-[120px] cursor-pointer"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? "Saving..." : "Save"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDetails;