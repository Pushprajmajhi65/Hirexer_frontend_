import { useState, useEffect } from 'react';
import axios from 'axios';

const useWorkspace = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [activeWorkspace, setActiveWorkspace] = useState(null);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const response = await axios.get(`/api/get_user_workspaces/?t=${Date.now()}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'Cache-Control': 'no-cache', // Disable caching
            Pragma: 'no-cache', // For older browsers
          },
        });
        setWorkspaces(response.data);

        // Set the active workspace from localStorage or default to the first workspace
        const savedWorkspace = JSON.parse(localStorage.getItem('activeWorkspace'));
        if (savedWorkspace) {
          // If a workspace is saved in localStorage, use it
          setActiveWorkspace(savedWorkspace);
        } else if (response.data.length > 0) {
          // If no workspace is saved, set the first workspace as the default
          setActiveWorkspace(response.data[0]);
          localStorage.setItem('activeWorkspace', JSON.stringify(response.data[0]));
        }
      } catch (error) {
        console.error('Error fetching workspaces:', error);
      }
    };

    fetchWorkspaces();
  }, []);

  const switchWorkspace = (workspace) => {
    setActiveWorkspace(workspace);
    localStorage.setItem('activeWorkspace', JSON.stringify(workspace));
  };

  return { workspaces, activeWorkspace, switchWorkspace };
};

export default useWorkspace;