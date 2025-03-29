import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import MeetingTile from "@/components/meeting/meetingTile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useGetUserMeetings } from "@/services/meeting";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CreateMeeting from "@/components/meeting/CreateMeeting";
import { EmptyState } from "@/components/meeting/EmptyState";
import { JoinMeetingDialog } from "@/components/meeting/JoinMeeting";

const Meeting = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { data: meetings, isLoading } = useGetUserMeetings();
  console.log(meetings)

  const handleCreateDialog = () => {
    setIsCreateDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-lg font-medium">Loading meetings...</p>
      </div>
    );
  }




  const upcomingMeetings = meetings?.filter(meeting => {
    const startDateTime = new Date(meeting.start_time);
    const endDateTime = new Date(meeting.end_time);
    const currentDateTime = new Date();
    
   
    return endDateTime.getTime() >= currentDateTime.getTime();
  }) || [];

  const pastMeetings = meetings?.filter(meeting => {
    const endDateTime = new Date(meeting.end_time);
    const currentDateTime = new Date();

    return endDateTime.getTime() < currentDateTime.getTime();
  }) || [];


  const sortByDateTime = (a, b) => {
    return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
  };

  const sortedUpcomingMeetings = [...upcomingMeetings].sort(sortByDateTime);
  
  const sortedPastMeetings = [...pastMeetings].sort((a, b) => sortByDateTime(b, a));

  return (
    <div className="container mx-auto px-4 py-6">
      <section className="flex flex-col md:flex-row items-center justify-between mb-8">
        <h1 className="font-[700] text-[36px] text-primary/90 mb-4 md:mb-0">
          Meetings
        </h1>
        <div className="flex items-center gap-4">
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger>
              <Button className="bg-figmaPrimaryDark">Create meeting</Button>
            </DialogTrigger>
            <DialogContent>
              <CreateMeeting onClose={handleCreateDialog} />
            </DialogContent>
          </Dialog>

          <JoinMeetingDialog upcomingMeetings={sortedUpcomingMeetings} />
        </div>
      </section>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming ({sortedUpcomingMeetings.length})
          </TabsTrigger>
          <TabsTrigger value="past">Past ({sortedPastMeetings.length})</TabsTrigger>
        </TabsList>
        <Separator className="my-4" />

        <TabsContent value="upcoming">
          {sortedUpcomingMeetings.length > 0 ? (
            <div className="flex flex-col space-y-4">
              {sortedUpcomingMeetings.map((meeting) => (
                <MeetingTile
                  key={meeting.id}
                  el={{
                    id: meeting.id,
                    name: meeting.title,
                    start_date: meeting.start_time,
                    end_date: meeting.end_time,
                    participants: meeting.participants,
                  }}
                />
              ))}
            </div>
          ) : (
            <EmptyState message="No upcoming meetings scheduled" />
          )}
        </TabsContent>

        <TabsContent value="past">
          {sortedPastMeetings.length > 0 ? (
            <div className="flex flex-col space-y-4">
              {sortedPastMeetings.map((meeting) => (
                <MeetingTile
                  key={meeting.id}
                  el={{
                    id: meeting.id,
                    name: meeting.title,
                    start_date: meeting.start_time,
                    end_date: meeting.end_time,
                    participants: meeting.participants,
                  }}
                />
              ))}
            </div>
          ) : (
            <EmptyState message="No past meetings" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Meeting;