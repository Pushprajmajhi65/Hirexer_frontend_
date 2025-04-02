import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axiosInstance from "./axios";

async function getUserData() {
  const response = await axiosInstance.get("api/user-profile/");
  return response.data;
}

export function useGetUserData() {
  return useQuery({
    queryFn: getUserData,
    queryKey: ["userdata"],
  });
}

async function updateUser({ role, country, time_zone,description,skills,photo }) {
  const response = await axiosInstance.post(
    "profile/edit/",
    { role, country, time_zone,description,skills,photo },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
}

export function useUpdateUserData() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUser,
    mutationKey: ["updateUser"],
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["userdata"] });
      queryClient.invalidateQueries({ queryKey: ["workspace"] });
      toast.success("User updated successfully");
    },
    onError: (error) => {
      console.log(error);
      toast.error(error?.response?.data?.error || "Profile update failed");
    },
  });
}
