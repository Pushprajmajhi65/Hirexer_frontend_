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
  });

  // State for selected workspace
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);

  // Automatically set the first workspace as default after fetching
  useEffect(() => {
    if (workspaces?.length && !selectedWorkspace) {
      setSelectedWorkspace(workspaces[0]);
      toast.info(`Default workspace set to ${workspaces[0].name}`);
    }
  }, [workspaces, selectedWorkspace]);

  // Fetch posts based on the selected workspace
  const {
    data: currentUserPosts,
    isLoading: postsLoading,
    error: postsError,
    refetch: refetchPosts,
  } = useQuery({
    queryKey: ["workspacePosts", selectedWorkspace?.id],
    queryFn: async () => {
      if (!selectedWorkspace) {
        throw new Error("No workspace selected.");
      }
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      const response = await api.get(`/workspaces/${selectedWorkspace.id}/posts/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    },
    enabled: !!selectedWorkspace, 
  });

  // Handle workspace change
  const handleWorkspaceChange = (workspace) => {
    setSelectedWorkspace(workspace);
    toast.success(`Workspace changed to ${workspace.name}`);
    refetchPosts(); // Refetch posts when the workspace changes
  };

  // Handle errors
  useEffect(() => {
    if (workspacesError) {
      toast.error("Failed to fetch workspaces. Please try again.");
    }
    if (postsError) {
      toast.error("Failed to fetch posts. Please try again.");
    }
  }, [workspacesError, postsError]);

  return (
    <WorkspaceContext.Provider
      value={{
        // Workspace-related values
        workspaces,
        selectedWorkspace,
        workspacesLoading,
        handleWorkspaceChange,

        // Current user posts
        currentUserPosts,
        postsLoading,
        postsError,
        refetchPosts,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => useContext(WorkspaceContext);