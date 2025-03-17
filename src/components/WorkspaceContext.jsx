import { createContext, useState, useContext, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const WorkspaceContext = createContext();

export const WorkspaceProvider = ({ children }) => {
  const queryClient = useQueryClient();

  // Fetch workspaces
  const {
    data: workspaces,
    isLoading: workspacesLoading,
    error: workspacesError,
  } = useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const response = await api.get("/api/workspaces/");
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // Cache workspaces for 5 minutes
  });

  // State for selected workspace
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);

  // State for applications
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Fetch applications for the selected workspace
  const {
    data: fetchedApplications,
    isLoading: applicationsLoading,
    error: applicationsError,
    refetch: refetchApplications,
  } = useQuery({
    queryKey: ["applications", selectedWorkspace?.id],
    queryFn: async () => {
      if (!selectedWorkspace) return [];
      const response = await api.get(`/workspaces/${selectedWorkspace.id}/applications/`);
      return response.data;
    },
    enabled: !!selectedWorkspace, // Only fetch if a workspace is selected
    staleTime: 1000 * 60 * 5, // Cache applications for 5 minutes
  });

  // Update applications state when fetchedApplications changes
  useEffect(() => {
    if (fetchedApplications) {
      setApplications(fetchedApplications);
    }
  }, [fetchedApplications]);

  // Handle workspace change
  const handleWorkspaceChange = (workspace) => {
    setSelectedWorkspace(workspace);
    toast.success(`Workspace changed to ${workspace.name}`);
  };

  // Handle application status update
  const updateApplicationStatus = useMutation({
    mutationFn: async ({ applicationId, newStatus }) => {
      const response = await api.post(`/applications/${applicationId}/status/`, {
        status: newStatus,
      });
      return response.data;
    },
    onSuccess: (data) => {
      // Update the local applications state
      setApplications((prevApplications) =>
        prevApplications.map((app) =>
          app.id === data.id ? { ...app, application_status: data.application_status } : app
        )
      );
      toast.success("Application status updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update application status.");
    },
  });

  // Handle errors
  useEffect(() => {
    if (workspacesError) {
      toast.error("Failed to fetch workspaces. Please try again.");
    }
    if (applicationsError) {
      toast.error("Failed to fetch applications. Please try again.");
    }
  }, [workspacesError, applicationsError]);

  return (
    <WorkspaceContext.Provider
      value={{
        // Workspace-related values
        workspaces,
        selectedWorkspace,
        workspacesLoading,
        handleWorkspaceChange,

        // Application-related values
        applications,
        selectedApplication,
        applicationsLoading,
        setSelectedApplication,
        updateApplicationStatus,
        refetchApplications,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => useContext(WorkspaceContext); // Export the hook