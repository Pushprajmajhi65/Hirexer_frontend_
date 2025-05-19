import React from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { useGetUserWorkspace } from '@/services/workspace';
import { Navigate } from 'react-router-dom';
import Loader from '../shared/Loader';

const WorkspaceGuard = ({ children }) => {
  const { selectedWorkspace, setSelectedWorkspace, setWorkspaces } = useWorkspace();
  const { data: workspaces, isLoading, isError } = useGetUserWorkspace();

  React.useEffect(() => {
    if (workspaces) {
      setWorkspaces(workspaces);
      if (!selectedWorkspace && workspaces.length > 0) {
        setSelectedWorkspace(workspaces[0]);
      }
    }
  }, [workspaces, setWorkspaces, selectedWorkspace, setSelectedWorkspace]);

  if (isLoading) {
    return <Loader/>; 
  }

  if (isError) {
    return <Navigate to="/login" />;
  }

  // Check if workspaces is defined and empty
  if (workspaces && workspaces.length === 0) {
    return <Navigate to="/onboarding" />;
  }

  // If workspaces exists but selectedWorkspace isn't set yet (but workspaces exist)
  if (workspaces && workspaces.length > 0 && !selectedWorkspace) {
    return <Loader/>; // Or some other loading state
  }

  // If workspaces is still undefined (should be caught by isLoading, but just in case)
  if (!workspaces) {
    return <Loader/>;
  }

  return children;
};

export default WorkspaceGuard;