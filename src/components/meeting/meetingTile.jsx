import React, { useState } from "react";
import { formatUserReadableDate } from "@/utils/formatDate";
import { FaUsers, FaStar, FaTrash, FaEdit } from "react-icons/fa";
import { Minus, UserPlus } from "lucide-react";
import { useInviteMeeting, useDeleteMeeting } from "@/services/meeting";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EditMeeting from "./EditMeeting"; // Import the EditMeeting component

const MeetingTile = ({ el, refetch }) => {
  const [emails, setEmails] = useState("");
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const inviteMutation = useInviteMeeting();
  const deleteMutation = useDeleteMeeting();

  const isPastMeeting = new Date(`${el.end_date}`) < new Date();

  const handleInvite = (e) => {
    e.preventDefault();
    const emailList = emails.split(",").map((email) => email.trim());

    if (emailList.length === 0 || emailList[0] === '') {
      toast.error('Please enter at least one email address');
      return;
    }
    inviteMutation.mutate(
      { meeting_id: el.id, user_emails: emailList },
      {
        onSuccess: () => {
          setIsInviteOpen(false);
          setEmails("");

        },
       
      }
    );
  };
  const handleDelete = () => {
    deleteMutation.mutate(
      { id: el.id },
      {
        onSuccess: () => {
          setIsDeleteOpen(false);
        },
      }
    );
  };
  return (
    <div
      className={`h-auto min-h-[110px] ${
        isPastMeeting ? "bg-gray-100" : "bg-gray-50 hover:bg-gray-100"
      } transition-colors duration-200 rounded-md flex flex-col md:flex-row items-center gap-3 justify-between p-4 md:p-8`}
    >
      <div className="flex items-center space-x-3 md:space-x-6 w-full md:w-auto">
        <span>
          <FaStar
            className={isPastMeeting ? "text-gray-400" : "text-amber-300"}
          />
        </span>
        <section className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-[700] text-[15px] md:text-[20px] text-primary/90 line-clamp-1">
              {el.name}
            </h2>
            {isPastMeeting && (
              <span className="text-xs px-2 py-1 bg-gray-200 rounded-full text-gray-600">
                Past Meeting
              </span>
            )}
          </div>
          <div className="flex items-center flex-wrap text-[12px] text-gray-600">
            <span className="whitespace-nowrap">
              {formatUserReadableDate(el.start_date)}
            </span>
            <Minus className="mx-1 text-gray-400" size={16} />
            <span className="whitespace-nowrap">
              {formatUserReadableDate(el.end_date)}
            </span>
          </div>
        </section>
      </div>

      <div className="flex items-center gap-4 mt-3 md:mt-0">
        <section className="flex flex-col items-center justify-center">
          <span>
            <FaUsers
              size={30}
              className={isPastMeeting ? "text-gray-400" : "text-figmaPrimaryDark"}
            />
          </span>
          <span className="text-muted-foreground text-[10px]">
            {el.participants.length} Participants
          </span>
        </section>

        {/* Edit Button and Dialog */}
        {!isPastMeeting && (
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                title="Edit Meeting"
              >
                <FaEdit className="h-3 w-3" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <EditMeeting 
                meetingData={{
                  id: el.id,
                  title: el.name,
                  start_time: el.start_date,
                  end_time: el.end_date,
                  description: el.description || "",
                  members: el.participants.map(p => ({ email: p.email }))
                }} 
                onClose={() => setIsEditOpen(false)}
                refetch={refetch}
              />
            </DialogContent>
          </Dialog>
        )}

        {!isPastMeeting && (
          <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                title="Invite Members"
              >
                <UserPlus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Invite Members to {el.name}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleInvite} className="space-y-4 mt-4">
                <div>
                  <Input
                    placeholder="Enter email addresses (comma-separated)"
                    value={emails}
                    onChange={(e) => setEmails(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Example: user1@example.com, user2@example.com
                  </p>
                </div>
                <Button
                  type="submit"
                  disabled={inviteMutation.isPending}
                  className="w-full"
                >
                  {inviteMutation.isPending ? "Inviting..." : "Send Invites"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}

        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              className="h-8 w-8"
              title="Delete Meeting"
            >
              <FaTrash className="h-3 w-3" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete {isPastMeeting ? "Past " : ""}Meeting</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{el.name}"?
                {isPastMeeting
                  ? " This will remove it from your meeting history."
                  : " This action cannot be undone and will cancel the meeting for all participants."}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-row items-center gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setIsDeleteOpen(false)}
                disabled={deleteMutation.isPending}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="flex-1"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MeetingTile;