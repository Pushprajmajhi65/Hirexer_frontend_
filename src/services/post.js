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

async function applyPost({ post, email, experience_level, applied_at, cv }) {
  const response = await axiosInstance.post(
    "applications/apply/",
    {
      post,
      email,
      experience_level,
      applied_at,
      cv,
    },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
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
      console.log(error);
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

async function updateMemberStatus({ workspace_id, member_id, new_status }) {
  const response = await axiosInstance.post(
    `api/workspaces/${workspace_id}/change_member_status/`,
    { member_id, new_status }
  );
  return response.data;
}

export function useUpdateMemberStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMemberStatus,
    onSuccess: () => {
      /*    queryClient.invalidateQueries({ queryKey: ["getPostApplications"] }); */
      /*   queryClient.invalidateQueries({ queryKey: ["getMyApplications"] }); */
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.refetchQueries({ queryKey: ["workspace"] });
      toast.success("Status updated successfully");
    },
    onError: (error) => {
      console.log(error);
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

async function editPost({ post_id, formData }) {
  const response = await axiosInstance.put(
    `posts/${post_id}/edit/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
}
export function useEditPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editPost,
    onSuccess: () => {
      toast.success("Post updated successfully");
      queryClient.invalidateQueries({ queryKey: ["getPosts"] });
      queryClient.invalidateQueries({ queryKey: ["getWorkspacePosts"] });
    },
    onError: (error) => {
      console.log(error);
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.detail ||
          "Failed updating post"
      );
    },
  });
}


async function updateApplicationStatus({ application_id, status }) {
  const response = await axiosInstance.post(
    `applications/${application_id}/status/`,
    { status }
  );
  return response.data;
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateApplicationStatus,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["getWorkspacePosts"] });
      queryClient.invalidateQueries({ queryKey: ["getMyApplications"] });
      queryClient.invalidateQueries({ queryKey: ["getPostApplications"] });
      queryClient.invalidateQueries({ queryKey: ["getPosts"] });
      toast.success(data?.message || "Status updated successfully");
    },
    onError: (error) => {
      console.log(error);
      toast.error(error?.response?.data?.error || "Failed updating status");
    },
  });
}
