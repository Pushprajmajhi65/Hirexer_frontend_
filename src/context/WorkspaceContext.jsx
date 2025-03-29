import React, { createContext, useContext, useState, useEffect } from "react";

const WorkspaceContext = createContext();

export function WorkspaceProvider({ children }) {
  const [selectedWorkspace, setSelectedWorkspace] = useState(() => {
    const saved = localStorage.getItem("selectedWorkspace");
    return saved ? JSON.parse(saved) : null;
  });
  const [workspaces, setWorkspaces] = useState([]);
  const [userName, setUserName] = useState(() => 
    localStorage.getItem("hirexer_username") || ""
  );

  const handleSelectWorkspace = (workspace) => {
    setSelectedWorkspace(workspace);
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
