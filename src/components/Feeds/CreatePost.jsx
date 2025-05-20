import React, { useCallback, useState } from "react";
import { DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { useForm, Controller } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Wrapper from "../auth/Wrapper";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { jobType, experienceLevel } from "@/constants";
import { useDropzone } from "react-dropzone";
import { X, Upload } from "lucide-react";
import toast from "react-hot-toast";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { useCreatePost } from "@/services/post";
import { useWorkspace } from "@/context/WorkspaceContext";

const MAX_FILE_SIZE = 150 * 1024 * 1024;

const CreatePost = ({ onClose }) => {
  const [file, setFile] = useState(null);
  const { selectedWorkspace } = useWorkspace();
  console.log(selectedWorkspace.id);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();

  const onDrop = useCallback(
    (acceptedFiles) => {
      const newFile = acceptedFiles[0];

      if (newFile.size > MAX_FILE_SIZE) {
        toast.error("File size must be less than 150MB");
        return;
      }

      if (file) {
        URL.revokeObjectURL(file.preview);
      }

      setFile({
        file: newFile,
        preview: URL.createObjectURL(newFile),
      });
    },
    [file]
  );

  const removeFile = () => {
    if (file) {
      URL.revokeObjectURL(file.preview);
      setFile(null);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
      // "video/*": [".mp4", ".mov"],
    },
    maxFiles: 1,
    multiple: false,
  });

  React.useEffect(() => {
    return () => {
      if (file) {
        URL.revokeObjectURL(file.preview);
      }
    };
  }, [file]);

  const mutation = useCreatePost();

  const onSubmit = (data) => {
    const formData = new FormData();
    
    formData.append('title', data.title);
    formData.append('post_description', data.post_description);
    formData.append('job_type', data.post_type);
    formData.append('experience', data.experienceLevel);
    formData.append('workspace', selectedWorkspace.id);
    
    if (file?.file) {
      formData.append('image', file.file);
    }
  
    mutation.mutate(formData, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <DialogHeader>
        <DialogTitle className="text-[24px] font-[600] text-center">
          Create a post
        </DialogTitle>
      </DialogHeader>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 w-full"
      >
        <div className="flex flex-col gap-6 ">
          <Wrapper>
            <Label className="custom_auth_label">Title</Label>
            <Input
              {...register("title", { required: "Title is required" })}
              placeholder="Enter your post title"
              className="custom_auth_input "
            />
            {errors.title && (
              <span className="text-red-500 text-sm">
                {errors.title.message}
              </span>
            )}
          </Wrapper>

          <Wrapper>
            <Label className="custom_auth_label">Post description</Label>
            <Textarea
              disabled={mutation.isPending}
              {...register("post_description", {
                required: "Description is required",
              })}
              placeholder="Enter your post description"
              className="custom_auth_input min-h-[80px] max-h-[200px] break-text break-all"
            />
            {errors.description && (
              <span className="text-red-500 text-sm">
                {errors.description.message}
              </span>
            )}
          </Wrapper>

          <Wrapper>
            <Label className="custom_auth_label">Post type</Label>
            <Controller
              name="post_type"
              control={control}
              rules={{ required: "Post type is required" }}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="custom_auth_input h-12 w-full">
                      <SelectValue placeholder="Select a post type" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobType.map((el) => (
                        <SelectItem value={el.name} key={el.id}>
                          {el.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {error && (
                    <span className="text-red-500 text-sm">
                      {error.message}
                    </span>
                  )}
                </>
              )}
            />
          </Wrapper>

          <Wrapper className="relative">
            <Label className="custom_auth_label">Experience level</Label>
            <Controller
              name="experienceLevel"
              control={control}
              rules={{ required: "Experience level is required" }}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="custom_auth_input h-12 w-full">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      {experienceLevel.map((el) => (
                        <SelectItem value={el.name} key={el.id}>
                          {el.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {error && (
                    <span className="text-red-500 text-sm">
                      {error.message}
                    </span>
                  )}
                </>
              )}
            />
          </Wrapper>
        </div>
        <Wrapper>
          <Label className="custom_auth_label">Media</Label>
          <div className="space-y-4">
            {file && (
              <div className="relative rounded-lg overflow-hidden w-full max-w-[450px] mx-auto">
                {file.file.type.startsWith("image/") ? (
                  <img
                    src={file.preview}
                    alt="Preview"
                    className="w-full h-[250px] object-cover rounded-lg"
                  />
                ) : (
                  <video
                    src={file.preview}
                    className="w-full h-[250px] object-cover rounded-lg"
                    controls
                  />
                )}
                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5
                    hover:bg-red-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            )}

            {!file && (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
                  ${
                    isDragActive
                      ? "border-primary bg-primary/10"
                      : "border-gray-300 hover:border-primary/50"
                  }`}
              >
                <input {...getInputProps()} disabled={mutation.isPending} />
                <div className="flex flex-col items-center gap-2 text-center">
                  <Upload className="h-8 w-8 text-gray-400" />
                  {isDragActive ? (
                    <p className="text-primary">Drop the file here ...</p>
                  ) : (
                    <div>
                      <p className="text-sm font-semibold text-gray-600 flex items-center justify-center">
                        <span className="text-figmaPrimary">
                          Add a photo or video
                        </span>
                        &nbsp;or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Supports images (JPG, PNG) and videos (MP4, MOV) up to
                        150MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </Wrapper>

        <DialogFooter className="gap-4 flex items-center justify-between w-full">
          <Button
            type="button"
            disabled={mutation.isPending}
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto text-figmaPrimary border-figmaPrimary"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Posting" : "Post"}
          </Button>
        </DialogFooter>
      </form>
    </div>
  );
};

export default CreatePost;
