import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { NavBar } from "./UserOverview";
import Lottie from "react-lottie";
import NODATA from "../assets/meeting.json"; // Import your Lottie JSON file
import { CreateMeetingForm } from "./meeting";
import { useWorkspace } from "./WorkspaceContext";
import { useQuery } from "@tanstack/react-query";
import api from "@/api";
import { format } from "date-fns"; // Replace with date-fns for date formatting
import { toast } from "react-toastify";

export const Applications = () => {
  const [selectedPost, setSelectedPost] = useState(null);

  // Use the useWorkspace hook to access workspace and posts
  const { selectedWorkspace, currentUserPosts, postsLoading, postsError } = useWorkspace();

  return (
    <div className="flex w-screen h-screen gap-8 bg-backgroundGray max-sm:px-0 px-[40px] pb-[80px] items-center xl:p-0">
      <NavBar />
      {selectedPost ? (
        <ManageApplicationsCard postId={selectedPost} onBack={() => setSelectedPost(null)} />
      ) : (
        <PostsList posts={currentUserPosts} onSelectPost={setSelectedPost} isLoading={postsLoading} error={postsError} />
      )}
    </div>
  );
};

const PostsList = ({ posts, onSelectPost, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="w-full max-w-[1100px] h-[755px] bg-white rounded-2xl px-6 py-6 flex flex-col gap-6">
        <div className="w-full flex justify-center items-center">
          <Lottie options={{ animationData: NODATA, loop: true, autoplay: true }} height={150} width={150} />
        </div>
        <div className="text-center text-lg mt-4">Your posts are being loaded...</div>
      </div>
    );
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="w-full max-w-[1100px] h-[755px] bg-white rounded-2xl px-6 py-6 flex flex-col gap-6">
      <div className="w-full h-[70px] border-b px-6 flex items-center">
        <div>
          <h1 className="font-semibold text-textBlack text-[20px]">Posts</h1>
          <p className="text-[14px] text-textSecondary font-normal">Select a post to view applications.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto no-scrollbar">
        {posts?.map((post) => (
          <div
            key={post.id}
            className="flex flex-col p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onSelectPost(post.id)}
          >
            <h2 className="font-semibold text-textBlack text-[18px] mb-2">{post.title}</h2>
            <p className="text-textSecondary text-[14px] flex-grow">{post.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-textBlack text-[12px]">Post ID: {post.id}</span>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPost(post.id);
                }}
              >
                View Applications
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};








const ManageApplicationsCard = ({ postId, onBack }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMeetingFormOpen, setIsMeetingFormOpen] = useState(false);

  // Fetch applications for the selected post
  const {
    data: applications,
    isLoading: applicationsLoading,
    error: applicationsError,
    refetch: refetchApplications,
  } = useQuery({
    queryKey: ["applications", postId],
    queryFn: async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      const response = await api.get(`/posts/${postId}/applications/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    },
    enabled: !!postId, // Only fetch if postId is available
  });

  // Function to update application status
  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error("No authentication token found.");
      }

      const response = await api.post(
        `/applications/${applicationId}/status/`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refetch applications to get the latest status
      await refetchApplications();

      // If the new status is "schedule_meeting", open the meeting form
      if (newStatus === "schedule_meeting") {
        setSelectedApplication(applications.find((app) => app.id === applicationId));
        setIsMeetingFormOpen(true);
      }

      toast.success("Status updated successfully!");
    } catch (error) {
      console.error("Failed to update application status:", error);
      toast.error("Failed to update status.");
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (selectedApplication) {
      await updateApplicationStatus(selectedApplication.id, newStatus);
      setIsDialogOpen(false);
    }
  };

  const filteredApplications = applications?.filter(
    (app) =>
      app.user?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "in_review":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "submitted":
        return "bg-blue-100 text-blue-800";
      case "pending_decision":
        return "bg-purple-100 text-purple-800";
      case "schedule_meeting":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusButtons = (status) => {
    const isApprovedOrRejected = status === "approved" || status === "rejected";

    switch (status) {
      case "submitted":
        return (
          <>
            <button
              className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
              onClick={() => handleStatusChange("in_review")}
              disabled={isApprovedOrRejected}
            >
              In Review
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              onClick={() => handleStatusChange("rejected")}
              disabled={isApprovedOrRejected}
            >
              Rejected
            </button>
          </>
        );
      case "in_review":
        return (
          <>
            <button
              className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
              onClick={() => handleStatusChange("schedule_meeting")}
              disabled={isApprovedOrRejected}
            >
              Schedule Meeting
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              onClick={() => handleStatusChange("rejected")}
              disabled={isApprovedOrRejected}
            >
              Rejected
            </button>
          </>
        );
      case "schedule_meeting":
        return (
          <>
            <button
              className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
              onClick={() => handleStatusChange("pending_decision")}
              disabled={isApprovedOrRejected}
            >
              Pending Decision
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              onClick={() => handleStatusChange("rejected")}
              disabled={isApprovedOrRejected}
            >
              Rejected
            </button>
          </>
        );
      case "pending_decision":
        return (
          <>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              onClick={() => handleStatusChange("approved")}
              disabled={isApprovedOrRejected}
            >
              Approved
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              onClick={() => handleStatusChange("rejected")}
              disabled={isApprovedOrRejected}
            >
              Rejected
            </button>
          </>
        );
      default:
        return null;
    }
  };

  if (applicationsLoading) {
    return <p>Loading applications...</p>;
  }

  if (applicationsError) {
    return <p>Error: {applicationsError.message}</p>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          className="mb-6 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          onClick={onBack}
        >
          Back to Posts
        </button>

        {/* Search Bar */}
        <input
          className="w-full max-w-md mb-6 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search by name or email"
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-7 gap-4 p-4 bg-gray-100 font-medium text-gray-700">
            <div>#</div>
            <div>Name</div>
            <div>Email</div>
            <div>Experience</div>
            <div>Applied At</div>
            <div>Status</div>
            <div>CV</div>
          </div>
          {filteredApplications?.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No applications found.</div>
          ) : (
            filteredApplications?.map((application, index) => (
              <div
                key={application.id}
                className="grid grid-cols-7 gap-4 p-4 items-center hover:bg-gray-50 transition-colors border-b border-gray-200"
              >
                <div>{index + 1}</div>
                <div className="truncate">{application.user?.full_name || "N/A"}</div>
                <div className="truncate">{application.email || "N/A"}</div>
                <div>{application.experience_level || "N/A"}</div>
                <div>{application.applied_at || "N/A"}</div>
                <div>
                  <Dialog open={isDialogOpen && selectedApplication?.id === application.id} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger
                      onClick={() => {
                        setSelectedApplication(application);
                        setIsDialogOpen(true);
                      }}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        application.application_status
                      )}`}
                    >
                      {application.application_status || "N/A"}
                    </DialogTrigger>
                    <DialogContent className="rounded-lg p-6"> {/* Added padding here */}
                      <DialogHeader>
                        <DialogTitle>Change Application Status</DialogTitle>
                        <DialogDescription>
                          Select a new status for {application.user?.full_name || "this user"}'s application.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="mt-4">{getStatusButtons(application.application_status)}</div>
                    </DialogContent>
                  </Dialog>
                </div>
                <div>
                  {application.cv ? (
                    <a
                      href={application.cv}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      View CV
                    </a>
                  ) : (
                    <span className="text-gray-500">No CV</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Meeting Form Dialog */}
      <Dialog open={isMeetingFormOpen} onOpenChange={setIsMeetingFormOpen}>
        <DialogContent className="rounded-lg">
          <DialogHeader>
            <DialogTitle>Schedule a Meeting</DialogTitle>
            <DialogDescription>
              Schedule a meeting with {selectedApplication?.user?.full_name || "this user"}.
            </DialogDescription>
          </DialogHeader>
          <CreateMeetingForm
            connectToVideo={(channelName) => {
              console.log("Connecting to video channel:", channelName);
            }}
            defaultEmail={selectedApplication?.email}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};





















export default Applications;
