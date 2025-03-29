import React from "react";
import { DialogHeader, DialogTitle } from "../ui/dialog";
import { useForm, useFieldArray } from "react-hook-form";
import Wrapper from "./Wrapper";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { X, Plus, Mail } from "lucide-react";
import { useCreateMeeting } from "@/services/meeting";

const CreateMeeting = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      start_time: "",
      end_time: "",
      description: "",
      members: [{ email: "" }],
    },
  });

  const mutation = useCreateMeeting();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "members",
  });

  const memberEmails = watch("members");
  const isLastEmailEmpty =
    memberEmails[memberEmails.length - 1]?.email.trim() === "";

  const handleAddMember = () => {
    if (!isLastEmailEmpty) append({ email: "" });
  };

  const onSubmit = (data) => {
    const cleanData = {
      ...data,
      members: data.members.filter((member) => member.email.trim() !== ""),
    };
     console.log(cleanData); 
    mutation.mutate(
      {
        title: cleanData.title,
        start_time: cleanData.start_time,
        end_time: cleanData.end_time,
        description: cleanData.description,
        invited_members: cleanData.members,
      },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      }
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto  bg-white dark:bg-gray-900 rounded-lg ">
      <DialogHeader className="mb-6">
        <DialogTitle className="text-2xl font-semibold text-gray-800 dark:text-white">
          📅 Create a Meeting
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Wrapper>
          <Label>Meeting Name</Label>
          <Input
            {...register("title", { required: "Meeting name is required" })}
            placeholder="Enter meeting name"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </Wrapper>

        <Wrapper>
          <Label>Start Time</Label>
          <Input
            type="datetime-local"
            {...register("start_time", { required: "Start time is required" })}
          />
        </Wrapper>

        <Wrapper>
          <Label>End Time</Label>
          <Input
            type="datetime-local"
            {...register("end_time", { required: "End time is required" })}
          />
        </Wrapper>

        <Wrapper>
          <Label>Description</Label>
          <Textarea
            className="max-h-[120px]"
            {...register("description", {
              required: "Description is required",
            })}
            placeholder="Enter meeting description"
          />
        </Wrapper>

        <div className="space-y-4">
          <Label>Invite Members</Label>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg max-h-48 overflow-y-auto">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex items-center gap-3 mb-3 bg-white dark:bg-gray-900 p-2 rounded-md shadow-sm"
              >
                <Mail className="w-5 h-5 text-gray-500" />
                <Input
                  {...register(`members.${index}.email`, {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  placeholder="member@example.com"
                  className="flex-1 border-none bg-transparent focus:ring-0"
                />
                {fields.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              onClick={handleAddMember}
              disabled={isLastEmailEmpty}
              className="mt-3 w-full flex justify-center items-center gap-2 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              <Plus className="w-4 h-4" /> Add Member
            </Button>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6">
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Creating" : "Create Meeting"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateMeeting;
