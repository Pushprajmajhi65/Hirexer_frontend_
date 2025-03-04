import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom"; // For React Router v6
import AgoraRTC, {
  AgoraRTCProvider,
  useRTCClient,
  useConnectionState,
  useJoin,
  useRemoteUsers,
  RemoteUser,
} from "agora-rtc-react";

export const LiveVideo = () => {
  const [searchParams] = useSearchParams(); // Extract query parameters
  const channelName = searchParams.get("channelName");
  const token = searchParams.get("token");
  const participants = JSON.parse(searchParams.get("participants") || []);

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [localTracks, setLocalTracks] = useState({ audioTrack: null, videoTrack: null });
  const videoRef = useRef(null);

  // Initialize Agora Client
  const agoraClient = useRTCClient(
    AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })
  );

  const connectionState = useConnectionState(agoraClient);
  const remoteUsers = useRemoteUsers();

  // Join the channel
  useJoin({
    client: agoraClient,
    appid: "50f8fd81c911474e9707a7ea5118a7ca", // Replace with your Agora App ID
    channel: channelName, // Ensure this is a valid string
    token: token || null, // Optional: If you need a token
  });

  // Setup local tracks (Microphone + Camera)
  useEffect(() => {
    const setupLocalTracks = async () => {
      try {
        const [microphoneTrack, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
        setLocalTracks({ audioTrack: microphoneTrack, videoTrack: cameraTrack });

        // Publish to Agora
        await agoraClient.publish([microphoneTrack, cameraTrack]);

        // Attach video track to the video element
        if (videoRef.current) {
          cameraTrack.play(videoRef.current);
        }
      } catch (error) {
        console.error("Error setting up local tracks:", error);
      }
    };

    setupLocalTracks();

    return () => {
      localTracks.audioTrack?.stop();
      localTracks.videoTrack?.stop();
      localTracks.audioTrack?.close();
      localTracks.videoTrack?.close();
    };
  }, []);

  return (
    <AgoraRTCProvider client={agoraClient}>
      <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4 w-full">
        <div className="w-full flex flex-col items-center">
          {/* Video Grid - Display remote and local users */}
          <div className="flex w-[1464px] gap-5 flex-wrap items-center justify-center p-4">
            {/* Remote Users */}
            {remoteUsers.map((user) => (
              <div key={user.uid} className="relative w-[430px] h-[242px] bg-black rounded-xl">
                <RemoteUser user={user} className="w-full h-full" />
              </div>
            ))}

            {/* Local User */}
            {localTracks.videoTrack && (
              <div className="relative max-w-md rounded-lg shadow-lg w-[430px] h-[242px] bg-black">
                <video ref={videoRef} className="w-full h-full rounded-xl" autoPlay playsInline />
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-lg flex space-x-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={() => {
              if (localTracks.audioTrack) {
                micOn ? localTracks.audioTrack.setEnabled(false) : localTracks.audioTrack.setEnabled(true);
                setMicOn(!micOn);
              }
            }}
          >
            {micOn ? "Mute Mic" : "Unmute Mic"}
          </button>

          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={() => {
              if (localTracks.videoTrack) {
                cameraOn ? localTracks.videoTrack.setEnabled(false) : localTracks.videoTrack.setEnabled(true);
                setCameraOn(!cameraOn);
              }
            }}
          >
            {cameraOn ? "Turn Off Camera" : "Turn On Camera"}
          </button>

          <button className="px-4 py-2 bg-green-500 text-white rounded-md">
            Members ({participants.length})
          </button>

          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            onClick={() => agoraClient.leave()}
          >
            Disconnect
          </button>
        </div>
      </div>
    </AgoraRTCProvider>
  );
};