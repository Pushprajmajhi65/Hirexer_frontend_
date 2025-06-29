import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { FileIcon, X, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { useWorkspace } from "@/context/WorkspaceContext";
import { UserCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { experienceLevel } from "@/constants";
import { useApplyPost } from "@/services/post";
const MAX_FILE_SIZE = 150 * 1024 * 1024;

const ApplyDialog = ({ open, onClose, id }) => {
  const { selectedWorkspace } = useWorkspace();
  const [cv, setCv] = useState(null);
  const [experience, setExperience] = useState("");
  const fileInputRef = useRef(null);
  const mutation = useApplyPost();

  const getCurrentUserEmail = () => {
    const localUsername = typeof window !== "undefined" 
      ? localStorage.getItem("hirexer_username") 
      : null;
    if (selectedWorkspace?.members_details && localUsername) {
      const currentUser = selectedWorkspace.members_details.find(
        member => member.username === localUsername
      );
      if (currentUser?.email) {
        return currentUser.email;
      }
    }
    const userData = typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : null;
    
    return userData?.email || '';
  };

  const currentUserEmail = getCurrentUserEmail();

  const handleFileUpload = (file) => {
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error("File size should be less than 150MB");
        return;
      }

      if (
        !file.type.includes("pdf") &&
        !file.type.includes("doc") &&
        !file.type.includes("docx")
      ) {
        toast.error("Please upload PDF or Word documents only");
        return;
      }

      setCv(file);
    }
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("border-primary");
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-primary");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-primary");
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const removeFile = () => {
    setCv(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!cv) {
      toast.error("Please upload your CV");
      return;
    }

    /*  if (!message.trim()) {
      toast.error("Please write a message");
      return;
    } */

    if (!experience) {
      toast.error("Please select your experience level");
      return;
    }

    const formData = new FormData();
    /*     formData.append("message", message); */
    formData.append("cv", cv);
    formData.append("experience_level", experience);

    console.log(experience);
    mutation.mutate(
      {
        cv,
        post: id,
        experience_level: experience,
        email: currentUserEmail,
        applied_at: new Date(),
      },
      {
        onSuccess: () => {
          setCv("");
          setExperience("");
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-[600] text-24px] text-center">
            Apply Now
          </DialogTitle>
        </DialogHeader>
        <Separator />

        <section className="flex items-center gap-2">
          <Avatar>
            <UserCircle className="h-10 w-10 text-[#1ED0C2]" /> 
          </Avatar>
          <section className="">
            <h3 className="text-primary/90 font-[600] text-[14px]">
              {selectedWorkspace?.name}
            </h3>
            <p className="text-[12px] text-muted-foreground">
              {currentUserEmail}
            </p>
          </section>
        </section>

        <div className="space-y-4 mt-4">
          <Select onValueChange={setExperience} value={experience}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select experience level" />
            </SelectTrigger>
            <SelectContent>
              {experienceLevel.map((level) => (
                <SelectItem key={level.id} value={level.name}>
                  {level.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/*     <div className="bg-background p-2">
            <Textarea
              placeholder="Write something about yourself..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[20px] resize-none border-0 focus:ring-0 p-0 focus-visible:ring-0"
            />
          </div> */}

          {!cv ? (
            <div
              className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">
                Upload your CV (PDF or Word)
              </p>
              <p className="text-xs text-gray-400 mt-1">Max size: 150MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files[0])}
              />
            </div>
          ) : (
            <div className="relative border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-2">
                <FileIcon className="h-8 w-8 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium truncate">{cv.name}</p>
                  <p className="text-xs text-gray-500">
                    {(cv.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={removeFile}
                  className="p-1 hover:bg-gray-200 rounded-full"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          <section className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={!cv || !experience || mutation.isPending}
            >
              {mutation.isPending ? "Submitting" : "Submit Application"}
            </Button>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplyDialog;
