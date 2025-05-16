import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axiosInstance from "./axios";
import { useNavigate } from "react-router-dom";

async function createMeeting({
  title,
  start_time,
  end_time,
  description,
  invited_members,
}) {
  const response = await axiosInstance.post("create/", {
    title,
    start_time,
    end_time,
    description,
    invited_members,
  });
  return response.data;
}

export function useCreateMeeting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMeeting,
    mutationKey: ["createMeeting"],
    onSuccess: (data) => {
      //console.log(data);
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["getUserMeetings"] });
    },
    onError: (error) => {
      console.log(error);
      toast.error(
        error.response.data.error ||
          error?.response.data.details ||
          "Failed creating meeting"
      );
    },
  });
}

async function editMeeting({
  meetingId,
  title,
  start_time,
  end_time,
  description,
  invited_members,
}) {
  const response = await axiosInstance.put(`edit/${meetingId}/`, {
    title,
    start_time,
    end_time,
    description,
    invited_members,
  });
  return response.data;
}

export function useEditMeeting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editMeeting,
    mutationKey: ["editMeeting"],
    onSuccess: (data) => {
      toast.success(data.message);
      // Invalidate the query for fetching user meetings to reflect the changes
      queryClient.invalidateQueries({ queryKey: ["getUserMeetings"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error(
        error.response.data.error ||
          error?.response.data.details ||
          "Failed editing meeting"
      );
    },
  });
}



async function inviteMembers({ meeting_id, user_emails }) {
  const response = await axiosInstance.post("invite/", {
    meeting_id,
    user_emails,
  });
  return response.data;
}

export function useInviteMeeting() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: inviteMembers,
    mutationKey: ["inviteMembers"],
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["getUserMeetings"] });
      queryClient.refetchQueries({ queryKey: ["getUserMeetings"] });
      
      // Show success message
      let toastMessage = data.message;
      
      // If there are errors, append them to the toast message
      if (data.errors && data.errors.length > 0) {
        toastMessage += '\n\nIssues with some invitations:';
        data.errors.forEach(error => {
          toastMessage += `\n• ${error}`;
        });
      }
      
      toast.success(toastMessage, {
        duration: data.errors?.length ? 5000 : 3000,
      });
    },
    onError: (error) => {
      const errorData = error.response?.data;
      
      if (errorData?.errors) {
        const errorMessage = errorData.errors.join('\n• ');
        toast.error(`Invitation errors:\n• ${errorMessage}`, {
          duration: 5000,
        });
      } else if (errorData?.error) {
        // If single error message
        toast.error(errorData.error);
      } else {
        // Generic fallback
        toast.error('Failed to send invitations. Please try again.');
      }
    },
  });
}

async function joinMeeting({ meeting_id }) {
  const response = await axiosInstance.post("join/", { meeting_id });
  return response.data;
}

export function useJoinMeeting() {
  return useMutation({
    mutationFn: joinMeeting,
    mutationKey: ["joinMeeting"],
    onSuccess: (data) => {
      console.log(data);
      const { twilio_room_name, twilio_token, participants } = data;

      // Construct URL with parameters
      const url = `/live-video?channelName=${encodeURIComponent(
        twilio_room_name
      )}&token=${encodeURIComponent(
        twilio_token
      )}&participants=${encodeURIComponent(JSON.stringify(participants))}`;

      // Open in new tab
      window.open(url, "_blank");

      toast.success("Successfully joined the meeting");
    },
    onError: (error) => {
      toast.error(error?.response.data.error || "Failed joining meeting");
    },
  });
}

async function getUserMeetings() {
  const response = await axiosInstance.get("user-meetings/");
  return response.data;
}

export function useGetUserMeetings() {
  return useQuery({
    queryKey: ["getUserMeetings"],
    queryFn: getUserMeetings,
  });
}

async function deleteMeeting({ id }) {
  console.log(id);
  const response = await axiosInstance.delete(`delete/${Number(id)}/`);
  return response.data;
}

export function useDeleteMeeting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMeeting,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["getUserMeetings"] });
      toast.success(data?.message || "Meeting deletion successful");
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.response.data.error || "Meeting deletion failed");
    },
  });
}
