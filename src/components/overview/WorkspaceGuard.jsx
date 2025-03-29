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

  if (!workspaces || workspaces.length === 0) {
    return <Navigate to="/onboarding" />;
  }

  if (!selectedWorkspace && workspaces.length > 0) {
    return <div>Initializing workspace...</div>; 
  }

  return children;
};

export default WorkspaceGuard;