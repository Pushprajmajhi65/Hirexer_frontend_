import React from "react";
import { Card, CardContent } from "../ui/card";
import { NavLink } from "react-router-dom";
import { Minus, Calendar } from "lucide-react";
import { Separator } from "../ui/separator";
import { useGetUserMeetings } from "../../services/meeting";
import LoadingSkeleton from "./LoadingSkeleton";
import { format } from "date-fns";
import { formatTime, formatUserReadableDate } from "@/utils/formatDate";

const UpcomingMeetings = () => {
  const { data: meetings, isLoading } = useGetUserMeetings();

  const upcomingMeetings = meetings
    ?.filter((meeting) => {
      return new Date(meeting.start_time) > new Date();
    })
    .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

  const todayMeeting = upcomingMeetings?.find((meeting) => {
    const meetingDate = new Date(meeting.start_time);
    const today = new Date();
    return (
      meetingDate.getDate() === today.getDate() &&
      meetingDate.getMonth() === today.getMonth() &&
      meetingDate.getFullYear() === today.getFullYear()
    );
  });
/* console.log(todayMeeting) */

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div>
      <Card>
        <CardContent className="flex flex-col gap-3">
          <section className="flex items-center justify-between">
            <h2 className="font-[700] text-[16px]">
              Upcoming meetings ({upcomingMeetings?.length || 0})
            </h2>
            <NavLink
              to="/meetings"
              className="text-figmaPrimaryDark hover:underline decoration-figmaPrimaryDark underline-offset-2 font-semibold text-sm"
            >
              View all
            </NavLink>
          </section>

          {todayMeeting ? (
            <>
              <section className="md:h-[44px] bg-upcoming rounded-md p-2 flex items-center space-x-4 sm:space-x-6 flex-wrap sm:flex-nowrap">
                <span className="text-[14px] font-[600] text-figmaPrimaryDark whitespace-nowrap">
                  Today
                </span>
                <h3 className="font-[600] text-primary/90 truncate max-w-[50%] sm:max-w-full capitalize">
                  {todayMeeting.title}
                </h3>
                <span className="flex items-center text-sm text-muted-foreground whitespace-nowrap">
                  {formatTime(todayMeeting.start_time)}
                  <Minus />
                  {formatTime(todayMeeting.end_time)}
                </span>
              </section>
              <Separator />
            </>
          ) : (
            <>
              <section className="md:h-[44px] bg-upcoming/50 rounded-md p-2 flex items-center justify-center text-muted-foreground">
                No meetings scheduled for today
              </section>
              <Separator />
            </>
          )}

          <div className="w-full overflow-x-auto">
            {upcomingMeetings && upcomingMeetings.length > 0 ? (
              <div className="flex space-x-4">
                {upcomingMeetings.slice(0, 5).map((meeting) => (
                  <div
                    key={meeting.id}
                    className="min-w-[200px] p-4 bg-gray-50 rounded-lg shadow-md flex items-center gap-2"
                  >
                    <div className="text-base font-semibold text-muted-foreground flex flex-col items-center">
                      <span className="font-normal text-sm">
                        {format(new Date(meeting.start_time), "MMM")}
                      </span>
                      {format(new Date(meeting.start_time), "dd")}
                    </div>
                    <section>
                      <div className="text-base font-semibold text-primary/90 truncate capitalize">
                        {meeting.title}
                      </div>
                      <div className="text-[12px] text-gray-400">
                        {formatUserReadableDate(meeting.start_time)} -{" "}
                        {formatUserReadableDate(meeting.end_time)}
                      </div>
                    </section>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Calendar className="w-12 h-12 mb-2 opacity-50" />
                <p>No upcoming meetings scheduled</p>
                <NavLink
                  to="/meetings"
                  className="text-figmaPrimaryDark hover:underline mt-2 text-sm"
                >
                  Schedule a meeting
                </NavLink>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpcomingMeetings;
