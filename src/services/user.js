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

async function updateUser({ username, role, country, time_zone, description, skills, photo }) {
  const formData = new FormData();
  
  if (username) formData.append('username', username);
  if (role) formData.append('role', role);
  if (country) formData.append('country', country);
  if (time_zone) formData.append('time_zone', time_zone);
  if (description) formData.append('description', description);
  if (skills) formData.append('skills', skills);
  if (photo) formData.append('photo', photo);
  else if (photo === null) formData.append('photo', ''); // For photo removal

  const response = await axiosInstance.post(
    "profile/edit/",
    formData,
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
