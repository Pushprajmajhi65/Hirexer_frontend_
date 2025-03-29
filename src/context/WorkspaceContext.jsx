import React, { createContext, useContext, useState, useEffect } from "react";

const WorkspaceContext = createContext();

export function WorkspaceProvider({ children }) {
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const savedWorkspace = localStorage.getItem("selectedWorkspace");
    const username = localStorage.getItem("hirexer_username");
    if (savedWorkspace) {
      setSelectedWorkspace(JSON.parse(savedWorkspace));
    }
    if (username) {
      setUserName(username);
    }
  }, []);

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
