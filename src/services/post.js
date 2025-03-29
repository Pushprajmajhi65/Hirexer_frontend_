import axiosInstance from "./axios";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

async function createPost(formData) {
  const response = await axiosInstance.post("posts/create/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPost,
    mutationKey: ["createPost"],
    onSuccess: () => {
      toast.success("Post created successfully");
      queryClient.invalidateQueries({ queryKey: ["getPosts"] });
      queryClient.invalidateQueries({ queryKey: ["getWorkspacePosts"] });
    },
    onError: (error) => {
      console.log(error);
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.detail ||
          "Failed creating post"
      );
    },
  });
}

async function getPosts() {
  const response = await axiosInstance.get("posts/");
  return response.data;
}

export function useGetPosts() {
  return useQuery({
    queryFn: getPosts,
    queryKey: ["getPosts"],
  });
}

async function getPostApplications({ queryKey }) {
  const [, post_id] = queryKey;
  const response = await axiosInstance.get(`posts/${post_id}/applications/`);
  return response.data;
}

export function useGetPostApplications(post_id) {
  return useQuery({
    queryFn: getPostApplications,
    queryKey: ["getPostApplications", post_id],
    enabled: !!post_id,
  });
}

async function applyPost({ post, email, experience_level, applied_at }) {
  const response = await axiosInstance.post("applications/apply/", {
    post,
    email,
    experience_level,
    applied_at,
  });
  return response.data;
}

export function useApplyPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: applyPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getPostApplications"] });
      queryClient.invalidateQueries({ queryKey: ["getMyApplications"] });
      toast.success("Applied for the post successfully");
    },
    onError: (error) => {
      toast.error(error?.response.data.error || "Failed to apply for the post");
    },
  });
}

async function getUserApplications() {
  const response = await axiosInstance.get("my-applications/");
  return response.data;
}

export function useGetUserApplications() {
  return useQuery({
    queryKey: ["getMyApplications"],
    queryFn: getUserApplications,
  });
}

async function updateApplicationStatus({ application_id, status }) {
  const response = await axiosInstance.patch(
    `applications/${application_id}/status/`,
    { status }
  );
  return response.data;
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateApplicationStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getPostApplications"] });
      queryClient.invalidateQueries({ queryKey: ["getMyApplications"] });
      queryClient.invalidateQueries({ queryKey: ["getMyApplications"] });
      toast.success("Status updated successfully");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data.error || "Failed to update application status"
      );
    },
  });
}

async function getWorkspacePosts({ queryKey }) {
  const [, workspace_id] = queryKey;
  const response = await axiosInstance.get(`workspaces/${workspace_id}/posts/`);
  return response.data;
}

export function useGetWorkspacePosts(workspace_id) {
  return useQuery({
    queryKey: ["getWorkspacePosts", workspace_id],
    queryFn: getWorkspacePosts,
    enabled: !!workspace_id,
  });
}
