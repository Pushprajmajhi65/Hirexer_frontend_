import React, { createContext, useContext, useState } from "react";

const WorkspaceContext = createContext();

export function WorkspaceProvider({ children }) {
  const [selectedWorkspace, setSelectedWorkspace] = useState(() => {
    const saved = localStorage.getItem("selectedWorkspace");
    return saved ? JSON.parse(saved) : null;
  });
  const [workspaces, setWorkspaces] = useState([]);
  const [userName, setUserName] = useState(
    () => localStorage.getItem("hirexer_username") || "",
  );
  const [userRole, setUserRole] = useState(() => {
    const workspace = JSON.parse(localStorage.getItem("selectedWorkspace"));
    return workspace?.user_role || null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectWorkspace = (workspace) => {
    setSelectedWorkspace(workspace);
    setUserRole(workspace.user_role);
    localStorage.setItem("selectedWorkspace", JSON.stringify(workspace));
  };

  return (
    <WorkspaceContext.Provider
      value={{
        selectedWorkspace,
        setSelectedWorkspace: handleSelectWorkspace,
        workspaces,
        setWorkspaces,
        userName,
        setUserName,
        userRole,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}