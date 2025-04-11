import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axiosInstance from "./axios";
import { useNavigate } from "react-router-dom";

async function getUserWorkspace() {
  const response = await axiosInstance.get("api/workspaces/");
  return response.data;
}

export function useGetUserWorkspace() {
  return useQuery({
    queryFn: getUserWorkspace,
    queryKey: ["workspace"],
  });
}

async function createWorkspace({
  name,
  email,
  country,
  industry,
  phone_number,
}) {
  const response = await axiosInstance.post("create-workspace/", {
    name,
    email,
    country,
    industry,
    phone_number,
  });
  return response.data;
}

export function useCreateWorkspace() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createWorkspace,
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["workspace"] });
      toast.success("Workspace created successfully");
      navigate(`/workspaceinvite/${data.id}`, { state: { id: data.id } });
    },
    onError: (error) => {
      console.log(error);
      toast.error(error?.response?.data?.error || "Failed creating workspace");
    },
  });
}

async function inviteWorkspace({ workspace_id, emails }) {
  const response = await axiosInstance.post(
    `workspaces/${workspace_id}/invitations/`,
    { emails }
  );
  return response.data;
}




export function useInviteWorkspace() {
  const queryClient = useQueryClient();
  /*   const navigate = useNavigate(); */
  return useMutation({
    mutationFn: inviteWorkspace,
    onSuccess: (data) => {
      /*   console.log(data); */
      /*   navigate("/workspacesetupdone"); */
      queryClient.invalidateQueries({ queryKey: ["workspace"] });
      toast.success(data?.message);
    },
    onError: (error) => {
      console.log(error);
      toast.error(error?.response?.data?.error || "Failed sending invitations");
    },
  });
}
