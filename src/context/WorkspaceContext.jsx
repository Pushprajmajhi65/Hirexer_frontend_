import React, { createContext, useContext, useState, useEffect } from "react";

const WorkspaceContext = createContext();

export function WorkspaceProvider({ children }) {
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem("hirexer_username") || "";
  });
  useEffect(() => {
    const savedWorkspace = localStorage.getItem("selectedWorkspace");
    if (savedWorkspace) {
      setSelectedWorkspace(JSON.parse(savedWorkspace));
    }
  }, []);

  const handleSelectWorkspace = (workspace) => {
    setSelectedWorkspace(workspace);
    localStorage.setItem("selectedWorkspace", JSON.stringify(workspace));
  };

  useEffect(() => {
     if (userName) {
       localStorage.setItem("hirexer_username", userName);
     }
   }, [userName]);
  
  
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
