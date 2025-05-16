import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DialogHeader, DialogTitle } from "../ui/dialog";
import { useForm, useFieldArray } from "react-hook-form";
import Wrapper from "./Wrapper";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { X, Plus, Mail, Calendar, Clock } from "lucide-react";
import { useEditMeeting } from "@/services/meeting";

const EditMeeting = ({ onClose, meetingData }) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      title: "",
      start_date: "",
      start_time: "09:00",
      end_time: "10:00",
      description: "",
      members: [{ email: "" }],
    },
  });

  const mutation = useEditMeeting();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "members",
  });

  // Generate time options every 30 minutes
  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hours = Math.floor(i / 2);
    const minutes = i % 2 === 0 ? "00" : "30";
    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  });

  const memberEmails = watch("members");
  const startDate = watch("start_date");
  const startTime = watch("start_time");
  const isLastEmailEmpty = memberEmails[memberEmails.length - 1]?.email.trim() === "";

  const handleAddMember = () => {
    if (!isLastEmailEmpty) append({ email: "" });
  };

  const validateEndTime = (value) => {
    if (!value) return "End time is required";
    
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = value.split(":").map(Number);
    
    if (endHour < startHour || (endHour === startHour && endMinute <= startMinute)) {
      return "End time must be after start time";
    }
    return true;
  };

  const onSubmit = (data) => {
    const cleanData = {
      title: data.title,
      start_time: `${data.start_date}T${data.start_time}:00`,
      end_time: `${data.start_date}T${data.end_time}:00`,
      description: data.description,
      members: data.members.filter((member) => member.email.trim() !== ""),
    };

    mutation.mutate(
      {
        meetingId: meetingData.id,
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

  useEffect(() => {
    if (meetingData) {
      // Parse the existing date and time from the meeting data
      const startDate = meetingData.start_time.split('T')[0];
      const startTime = meetingData.start_time.split('T')[1].substring(0, 5);
      const endTime = meetingData.end_time.split('T')[1].substring(0, 5);
      
      reset({
        title: meetingData.title,
        start_date: startDate,
        start_time: startTime,
        end_time: endTime,
        description: meetingData.description,
        members: meetingData.members?.length > 0 
          ? meetingData.members 
          : [{ email: "" }],
      });
    }
  }, [meetingData, reset]);

  // Animation variants
  const popupVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={popupVariants}
        transition={{ duration: 0.2 }}
        className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-xl"
      >
        <DialogHeader className="mb-6 px-6 pt-6">
          <DialogTitle className="text-2xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              ✏️
            </motion.div>
            Edit Meeting
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 pb-6">
          {/* Meeting Name */}
          <Wrapper>
            <Label>Meeting Name</Label>
            <Input
              {...register("title", { required: "Meeting name is required" })}
              placeholder="Team sync, 1:1, etc."
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </Wrapper>

          {/* Date */}
          <Wrapper className="w-full">
            <Label>Date</Label>
            <div className="relative w-full">
              <Input
                type="date"
                {...register("start_date", { required: "Date is required" })}
                min={new Date().toISOString().split('T')[0]}
                className="pl-10 w-full"
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
            {errors.start_date && (
              <p className="text-red-500 text-sm mt-1">{errors.start_date.message}</p>
            )}
          </Wrapper>

          <div className="w-full space-y-4">
            {/* Start Time */}
            <Wrapper className="w-full">
              <Label>Start Time</Label>
              <div className="relative w-full">
                <select
                  {...register("start_time", { required: "Start time is required" })}
                  className="w-full p-2 border rounded-md pl-10"
                >
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
            </Wrapper>

            {/* End Time */}
            <Wrapper className="w-full">
              <Label>End Time</Label>
              <div className="relative w-full">
                <select
                  {...register("end_time", { 
                    required: "End time is required",
                    validate: validateEndTime
                  })}
                  className="w-full p-2 border rounded-md pl-10"
                >
                  {timeOptions
                    .filter((time) => {
                      const [hour, minute] = time.split(":").map(Number);
                      const [startHour, startMinute] = startTime.split(":").map(Number);
                      return (
                        hour > startHour ||
                        (hour === startHour && minute > startMinute)
                      );
                    })
                    .map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                </select>
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
              {errors.end_time && (
                <p className="text-red-500 text-sm mt-1">{errors.end_time.message}</p>
              )}
            </Wrapper>
          </div>

          {/* Description */}
          <Wrapper>
            <Label>Description</Label>
            <Textarea
              className="max-h-[120px]"
              {...register("description", {
                required: "Description is required",
              })}
              placeholder="What's this meeting about?"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </Wrapper>

          {/* Invite Members */}
          <div className="space-y-4">
            <Label>Invite Members</Label>
            <motion.div 
              className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg max-h-48 overflow-y-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {fields.map((field, index) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
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
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-gray-500 hover:text-red-500 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </motion.div>
              ))}
              <motion.div whileHover={{ scale: 1.01 }}>
                <Button
                  type="button"
                  onClick={handleAddMember}
                  disabled={isLastEmailEmpty}
                  variant="default"
                  className="w-full mt-3"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Member
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Form Actions */}
          <motion.div 
            className="flex justify-end gap-3 pt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              disabled={mutation.isPending}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={mutation.isPending}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {mutation.isPending ? (
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Updating...
                </motion.span>
              ) : (
                "Update Meeting"
              )}
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditMeeting;