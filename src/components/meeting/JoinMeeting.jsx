import { format } from "date-fns";
import { useJoinMeeting } from "@/services/meeting";
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { EmptyState } from "./EmptyState";
import { formatUserReadableDate } from "@/utils/formatDate";

export const JoinMeetingDialog = ({ upcomingMeetings }) => {
  const joinMeetingMutation = useJoinMeeting();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleJoinMeeting = (meetingId) => {
    try {
      joinMeetingMutation.mutate({ meeting_id: meetingId });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to join meeting:", error);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
      <DialogTrigger>
        <Button className="bg-figmaPrimaryDark">Join meeting</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl ">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold mb-4">
            Upcoming meetings
          </DialogTitle>
        </DialogHeader>
        {upcomingMeetings.length > 0 ? (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {upcomingMeetings.map((meeting) => (
              <div
                key={meeting.id}
                className="bg-gray-50 p-2 rounded-lg flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold text-lg">{meeting.title}</h3>
                  <p className="text-sm text-gray-600">
                    {formatUserReadableDate(meeting.start_time)}-{" "}
                    {formatUserReadableDate(meeting.end_time)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Participants: {meeting.participants.length}
                  </p>
                </div>
                <Button
                  onClick={() => handleJoinMeeting(meeting.id)}
                  disabled={joinMeetingMutation.isLoading}
                  className="bg-figmaPrimaryDark"
                >
                  {joinMeetingMutation.isLoading ? "Joining..." : "Join"}
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message="No upcoming meetings available to join" />
        )}
      </DialogContent>
    </Dialog>
  );
};
