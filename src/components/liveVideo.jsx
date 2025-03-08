import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { connect, createLocalVideoTrack, createLocalAudioTrack } from "twilio-video";
import { toast } from "react-toastify";
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaSignOutAlt, FaCog, FaEllipsisV } from "react-icons/fa";

export const LiveVideo = () => {
  const [searchParams] = useSearchParams();
  const roomName = searchParams.get("channelName");
  const token = searchParams.get("token");
  const participants = JSON.parse(searchParams.get("participants") || "[]");

  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [remoteParticipants, setRemoteParticipants] = useState([]);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [pinnedParticipant, setPinnedParticipant] = useState(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [availableDevices, setAvailableDevices] = useState({ video: [], audio: [] });
  const localVideoRef = useRef(null);
  const roomRef = useRef(null);

  // Join the room with Twilio Video
  const joinRoom = async (roomName, userId) => {
    try {
      const accessToken = localStorage.getItem("access_token");

      const response = await fetch("http://127.0.0.1:8000/generate_twilio_token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ room_name: roomName, user_id: userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate token.");
      }

      const data = await response.json();
      const { token } = data;

      if (roomRef.current) {
        roomRef.current.disconnect();
      }

      const room = await connect(token, {
        name: roomName,
        audio: true,
        video: true,
      });

      return room;
    } catch (error) {
      console.error("Failed to join the room:", error);
      if (error.message.includes("duplicate identity")) {
        toast.error("You are already in the meeting.");
      } else {
        toast.error("Failed to join the room. Please try again.");
      }
      return null;
    }
  };

  // Fetch available devices (microphones and cameras)
  const getAvailableDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === "videoinput");
      const audioDevices = devices.filter(device => device.kind === "audioinput");
      setAvailableDevices({ video: videoDevices, audio: audioDevices });
    } catch (error) {
      console.error("Failed to fetch devices:", error);
      toast.error("Failed to load available devices.");
    }
  };

  // Toggle settings modal
  const toggleSettingsModal = () => {
    setIsSettingsModalOpen(!isSettingsModalOpen);
  };

  // Change video and audio devices
  const changeDevice = async (deviceType, deviceId) => {
    if (deviceType === "video") {
      const videoTrack = await createLocalVideoTrack({ deviceId });
      setLocalVideoTrack(videoTrack);
      videoTrack.attach(localVideoRef.current);
    } else if (deviceType === "audio") {
      const audioTrack = await createLocalAudioTrack({ deviceId });
      setLocalAudioTrack(audioTrack);
    }
  };

  useEffect(() => {
    if (!token || !roomName) {
      toast.error("Invalid or missing token or room name.");
      return;
    }

    let localTracks = [];

    const connectToRoom = async () => {
      try {
        const videoTrack = await createLocalVideoTrack().catch((error) => {
          console.error("Failed to create local video track:", error);
          toast.error("Failed to access camera. Please check permissions.");
          throw error;
        });
        const audioTrack = await createLocalAudioTrack().catch((error) => {
          console.error("Failed to create local audio track:", error);
          toast.error("Failed to access microphone. Please check permissions.");
          throw error;
        });
        localTracks = [videoTrack, audioTrack];

        setLocalVideoTrack(videoTrack);
        setLocalAudioTrack(audioTrack);

        if (localVideoRef.current) {
          videoTrack.attach(localVideoRef.current);
        }

        const room = await joinRoom(roomName, "unique-user-id-123");
        if (!room) return;

        roomRef.current = room;

        const handleParticipantConnected = (participant) => {
          setRemoteParticipants((prevParticipants) => [...prevParticipants, participant]);

          const handleTrackSubscribed = (track) => {
            if (track.kind === "video") {
              const remoteVideoContainer = document.createElement("div");
              remoteVideoContainer.id = `remote-video-${participant.sid}`;
              remoteVideoContainer.classList.add("w-full", "h-full", "rounded-lg");
              document.getElementById("remote-videos").appendChild(remoteVideoContainer);
              track.attach(remoteVideoContainer);
            }
          };

          const handleTrackUnsubscribed = (track) => {
            if (track.kind === "video") {
              const remoteVideoContainer = document.getElementById(`remote-video-${participant.sid}`);
              if (remoteVideoContainer) {
                remoteVideoContainer.remove();
              }
            }
          };

          participant.on("trackSubscribed", handleTrackSubscribed);
          participant.on("trackUnsubscribed", handleTrackUnsubscribed);
        };

        const handleParticipantDisconnected = (participant) => {
          setRemoteParticipants((prevParticipants) =>
            prevParticipants.filter((p) => p !== participant)
          );

          const remoteVideoContainer = document.getElementById(`remote-video-${participant.sid}`);
          if (remoteVideoContainer) {
            remoteVideoContainer.remove();
          }
        };

        room.on("participantConnected", handleParticipantConnected);
        room.on("participantDisconnected", handleParticipantDisconnected);

        room.on("disconnected", (room, error) => {
          console.error("Room disconnected:", error);
          toast.error("Disconnected from the room. Please try again.");
          setTimeout(() => {
            connectToRoom();
          }, 5000);
        });

        return () => {
          room.disconnect();
          localTracks.forEach((track) => track.stop());
          room.off("participantConnected", handleParticipantConnected);
          room.off("participantDisconnected", handleParticipantDisconnected);
        };
      } catch (error) {
        console.error("Failed to connect to the room:", error);
        toast.error("Failed to connect to the room. Please check your network and try again.");
      }
    };

    connectToRoom();
    getAvailableDevices();

    return () => {
      if (roomRef.current) {
        roomRef.current.disconnect();
      }
      localTracks.forEach((track) => track.stop());
    };
  }, [roomName, token]);

  // Toggle microphone
  const toggleMic = () => {
    if (localAudioTrack) {
      localAudioTrack.isEnabled ? localAudioTrack.disable() : localAudioTrack.enable();
      setIsMicMuted(!localAudioTrack.isEnabled);
    }
  };

  // Toggle camera
  const toggleCamera = () => {
    if (localVideoTrack) {
      if (localVideoTrack.isEnabled) {
        localVideoTrack.disable();
        setIsCameraOff(true);
      } else {
        localVideoTrack.enable();
        setIsCameraOff(false);
        localVideoTrack.attach(localVideoRef.current);
      }
    }
  };

  // End meeting
  const endMeeting = () => {
    if (roomRef.current) {
      roomRef.current.disconnect();
      toast.success("Meeting ended.");
      window.location.href = "/";
    }
  };

  // Pin a participant's video
  const pinParticipant = (participant) => {
    setPinnedParticipant(participant === pinnedParticipant ? null : participant);
  };

  // Get grid layout based on number of participants
  const getGridLayout = () => {
    const totalParticipants = remoteParticipants.length + 1; // Include local participant
    if (totalParticipants === 1) return "grid-cols-1";
    if (totalParticipants === 2) return "grid-cols-2";
    if (totalParticipants <= 4) return "grid-cols-2";
    if (totalParticipants <= 6) return "grid-cols-3";
    return "grid-cols-3";
  };

  // Render video grid
  const renderVideoGrid = () => {
    const totalParticipants = remoteParticipants.length + 1;
    const participantsToShow = pinnedParticipant
      ? [pinnedParticipant]
      : remoteParticipants.slice(0, 6);

    return (
      <div className={`w-full grid ${getGridLayout()} gap-4 p-4`}>
        {/* Local Video */}
        {!pinnedParticipant && (
          <div className="bg-gray-800 p-2 rounded-xl">
            <h3 className="text-lg font-semibold text-center">You</h3>
            <div
              ref={localVideoRef}
              className="w-full h-64 rounded-lg"
            ></div>
          </div>
        )}

        {/* Remote Videos */}
        {participantsToShow.map((participant) => (
          <div key={participant.sid} className="bg-gray-800 p-2 rounded-xl relative">
            <h3 className="text-lg font-semibold text-center">{participant.identity}</h3>
            <div
              id={`remote-video-${participant.sid}`}
              className="w-full h-64 rounded-lg"
            ></div>
            <div className="absolute top-2 right-2">
              <button
                onClick={() => pinParticipant(participant)}
                className="text-white p-2 bg-black rounded-full"
              >
                <FaEllipsisV />
              </button>
              {pinnedParticipant === participant && (
                <div className="absolute bg-black text-white p-2 rounded-lg mt-4 right-0">
                  <button
                    onClick={() => pinParticipant(participant)}
                    className="block text-red-500"
                  >
                    Unpin
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#202124] text-white">
      <h1 className="text-3xl font-semibold my-4">Live Meeting: {roomName}</h1>

      <div className="w-full max-w-7xl">
        {renderVideoGrid()}
      </div>

      <div className="fixed bottom-4 left-4 z-10 flex items-center gap-8">
        <button
          onClick={toggleMic}
          className="p-4 text-white bg-blue-500 rounded-full text-3xl"
        >
          {isMicMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
        </button>
        <button
          onClick={toggleCamera}
          className="p-4 text-white bg-blue-500 rounded-full text-3xl"
        >
          {isCameraOff ? <FaVideoSlash /> : <FaVideo />}
        </button>
        <button
          onClick={endMeeting}
          className="p-4 text-white bg-red-500 rounded-full text-3xl"
        >
          <FaSignOutAlt />
        </button>
        <button
          onClick={toggleSettingsModal}
          className="p-4 text-white bg-gray-500 rounded-full text-3xl"
        >
          <FaCog />
        </button>
      </div>

      {isSettingsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white text-black p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Settings</h2>
            <h3 className="font-semibold mb-2">Video Devices</h3>
            <select
              onChange={(e) => changeDevice("video", e.target.value)}
              className="mb-4 p-2 rounded-lg w-full"
            >
              {availableDevices.video.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </option>
              ))}
            </select>
            <h3 className="font-semibold mb-2">Audio Devices</h3>
            <select
              onChange={(e) => changeDevice("audio", e.target.value)}
              className="mb-4 p-2 rounded-lg w-full"
            >
              {availableDevices.audio.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </option>
              ))}
            </select>
            <button
              onClick={toggleSettingsModal}
              className="p-2 bg-red-500 text-white rounded-lg w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};