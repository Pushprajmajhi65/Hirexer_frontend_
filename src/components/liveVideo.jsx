import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  LocalUser,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteAudioTracks,
  useRemoteUsers,
} from "agora-rtc-react";

export const LiveVideo = () => {
  const appId = "ceb1bedabb974f439c26722f9f6d2b97";
  const { channelName } = useParams(); // Pull the channel name from the param

  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true); // For loading state
  const [showMembers, setShowMembers] = useState(false); // To toggle member count display

  const getAccessToken = async (channelName) => {
    const baseURL = "http://localhost:8081/access_token"; // Backend URL

    const queryParams = new URLSearchParams({
      channelName,
    });

    try {
      const response = await fetch(`${baseURL}?${queryParams}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      setToken(data.token); // Set the token in state
      setLoading(false); // Stop loading once token is fetched
    } catch (error) {
      console.error("Failed to fetch access token:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (channelName) {
      getAccessToken(channelName); // Fetch the token when the component mounts
    }
  }, [channelName]);

  const [activeConnection, setActiveConnection] = useState(true);
  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(true);

  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);

  const navigate = useNavigate();

  useJoin(
    {
      appid: appId,
      channel: channelName,
      token,
    },
    activeConnection && !loading, // Join the channel only when token is ready
  );

  usePublish([localMicrophoneTrack, localCameraTrack]);

  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);

  audioTracks.forEach((track) => track.play());

  const userCount = remoteUsers.length;
  console.log(userCount);

  // Limit the number of visible remote video screens to 6
  const displayedUsers = remoteUsers.slice(0, 5);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4 w-full">
      {loading ? (
        <p className="text-xl text-gray-500">Loading...</p> // Display loading state
      ) : (
        <div className="w-full flex flex-col items-center">
          {/* Video Grid - Only display up to 6 users */}
          <div className="flex w-[1464px] gap-5 flex-wrap items-center justify-center p-4">
            {displayedUsers.map((user) => (
              <div key={user.uid} className="relative w-[430px] h-[242px]">
                <RemoteUser user={user} className="rounded-xl bg-black " />
              </div>
            ))}
            <div className="relative max-w-md rounded-lg shadow-lg w-[430px] h-[242px]">
              <LocalUser
                audioTrack={localMicrophoneTrack}
                videoTrack={localCameraTrack}
                cameraOn={cameraOn}
                micOn={micOn}
                playAudio={false} // Prevent playing local audio
                playVideo={cameraOn}
                className="rounded-xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* Buttons positioned at the bottom */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-lg flex space-x-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setMic((prev) => !prev)}
        >
          Mic {micOn ? "On" : "Off"}
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setCamera((prev) => !prev)}
        >
          Camera {cameraOn ? "On" : "Off"}
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 relative"
          onClick={() => setShowMembers((prev) => !prev)} // Toggle visibility
        >
          Members
          <div className="absolute top-0 right-0 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {userCount}
          </div>
        </button>

        {/* {showMembers && userCount > 6 && (
          <div className="bg-red-500 text-white rounded-full px-3 py-1 text-sm absolute top-16 left-1/2 transform -translate-x-1/2">
            {userCount} Users
          </div>
        )} */}

        <button
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          onClick={() => {
            setActiveConnection(false);
            navigate("/meeting");
          }}
        >
          Disconnect
        </button>
      </div>
    </div>
  );
};
