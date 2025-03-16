import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { toast } from "react-hot-toast";
import { connect } from "twilio-video";
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash } from "react-icons/fa";
import Lottie from "react-lottie";
import NODATA from "../assets/meeting.json"; // Import your Lottie JSON file
import notificationSound from "../assets/notification.mp3"; // Import the sound file

export const LiveVideo = () => {
  const [room, setRoom] = useState(null);
  const [localMedia, setLocalMedia] = useState(null);
  const [remoteParticipants, setRemoteParticipants] = useState([]);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [showLeaveConfirmation, setShowLeaveConfirmation] = useState(false);
  const localVideoRef = useRef(null);
  const audioRef = useRef(new Audio(notificationSound)); // Reference to the audio file

  // Lottie animation options
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: NODATA, // Your Lottie JSON file
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  // Parse URL parameters
  const location = useLocation();
  const { channelName, token, participants: participantsString } = queryString.parse(location.search);

  // Parse participants string into a JavaScript array
  let participants;
  try {
    participants = JSON.parse(participantsString || "[]");
    console.log("Parsed participants:", participants);
  } catch (error) {
    console.error("Failed to parse participants data:", error);
    participants = [];
  }

  // Join the room
  useEffect(() => {
    const joinRoom = async () => {
      try {
        console.log("Attempting to join room with channelName:", channelName, "and token:", token);

        // Validate required parameters
        if (!channelName || !token) {
          throw new Error("Missing channel name or token.");
        }

        console.log("Connecting to Twilio room:", channelName);

        // Connect to the Twilio room
        const room = await connect(token, {
          name: channelName,
          audio: true,
          video: true,
        });

        console.log("Successfully connected to room:", room);

        setRoom(room);

        // Attach local video track
        const localTrack = Array.from(room.localParticipant.videoTracks.values())[0]?.track;
        console.log("Local track found:", localTrack);

        if (localTrack && localVideoRef.current) {
          const localMediaElement = localTrack.attach();
          localVideoRef.current.appendChild(localMediaElement);
          setLocalMedia(localMediaElement);
          console.log("Attached local video track.");
        } else {
          console.error("No local video track found.");
        }

        // Handle remote participants
        room.participants.forEach(participantConnected);
        room.on("participantConnected", participantConnected);
        room.on("participantDisconnected", participantDisconnected);
      } catch (error) {
        console.error("Error joining room:", error);
        toast.error("Failed to join the meeting. Please check your connection and try again.");
      }
    };

    if (channelName && token) {
      console.log("Attempting to join room...");
      joinRoom();
    } else {
      console.error("Channel name or token is missing.");
    }

    // Cleanup on unmount
    return () => {
      if (room) {
        console.log("Disconnecting from the room...");
        room.disconnect();
      }
    };
  }, [channelName, token]);

  // Handle participant connection
  const participantConnected = (participant) => {
    console.log("Participant connected:", participant.identity);

    // Play the notification sound for 3 seconds
    audioRef.current.play();
    setTimeout(() => {
      audioRef.current.pause(); // Stop the sound after 3 seconds
      audioRef.current.currentTime = 0; // Reset the sound to the beginning
    }, 2000);

    // Add the participant to the remoteParticipants state
    setRemoteParticipants((prev) => [
      ...prev,
      { participant, isMicMuted: false, isCameraOff: false },
    ]);

    // Handle existing tracks
    participant.tracks.forEach((publication) => {
      if (publication.isSubscribed) {
        trackSubscribed(publication.track, participant.sid);
      }
    });

    // Handle new tracks
    participant.on("trackSubscribed", (track) => {
      console.log("Track subscribed dynamically:", track);
      trackSubscribed(track, participant.sid);
    });

    participant.on("trackUnsubscribed", (track) => {
      console.log("Track unsubscribed:", track);
      trackUnsubscribed(track, participant.sid);
    });

    // Listen for audio track updates
    participant.on("trackEnabled", (track) => {
      if (track.kind === "audio") {
        setRemoteParticipants((prev) =>
          prev.map((p) =>
            p.participant.sid === participant.sid ? { ...p, isMicMuted: false } : p
          )
        );
      }
    });

    participant.on("trackDisabled", (track) => {
      if (track.kind === "audio") {
        setRemoteParticipants((prev) =>
          prev.map((p) =>
            p.participant.sid === participant.sid ? { ...p, isMicMuted: true } : p
          )
        );
      }
    });

    // Listen for video track updates
    participant.on("trackEnabled", (track) => {
      if (track.kind === "video") {
        setRemoteParticipants((prev) =>
          prev.map((p) =>
            p.participant.sid === participant.sid ? { ...p, isCameraOff: false } : p
          )
        );
      }
    });

    participant.on("trackDisabled", (track) => {
      if (track.kind === "video") {
        setRemoteParticipants((prev) =>
          prev.map((p) =>
            p.participant.sid === participant.sid ? { ...p, isCameraOff: true } : p
          )
        );
      }
    });
  };

  // Handle participant disconnection
  const participantDisconnected = (participant) => {
    console.log("Participant disconnected:", participant.identity);

    // Remove all tracks for this participant
    participant.tracks.forEach((publication) => {
      if (publication.track) {
        trackUnsubscribed(publication.track, participant.sid);
      }
    });

    // Remove the participant from the remoteParticipants state
    setRemoteParticipants((prev) => prev.filter((p) => p.participant.sid !== participant.sid));
  };

  // Handle track subscription
  const trackSubscribed = (track, participantSid) => {
    if (!track || typeof track.attach !== "function") {
      console.error("Invalid track:", track);
      return;
    }

    console.log("Attaching track:", track);

    // Attach the track to the DOM
    const containerId = `remote-track-${participantSid}-${track.kind}`;
    const container = document.getElementById(containerId);

    if (container) {
      const trackElement = track.attach();
      container.appendChild(trackElement);
    } else {
      console.error("Container not found for track:", containerId);
    }
  };

  // Handle track unsubscription
  const trackUnsubscribed = (track, participantSid) => {
    console.log("Track unsubscribed:", track);

    // Detach and remove the track element
    track.detach().forEach((element) => element.remove());

    // Remove the container for the track
    const containerId = `remote-track-${participantSid}-${track.kind}`;
    const container = document.getElementById(containerId);
    if (container) {
      container.remove();
    }
  };

  // Toggle microphone mute/unmute
  const toggleMic = () => {
    if (room) {
      const localAudioTrack = Array.from(room.localParticipant.audioTracks.values())[0]?.track;
      if (localAudioTrack) {
        localAudioTrack.isEnabled ? localAudioTrack.disable() : localAudioTrack.enable();
        setIsMicMuted(!localAudioTrack.isEnabled);
      }
    }
  };

  // Toggle camera on/off
  const toggleCamera = () => {
    if (room) {
      const localVideoTrack = Array.from(room.localParticipant.videoTracks.values())[0]?.track;
      if (localVideoTrack) {
        localVideoTrack.isEnabled ? localVideoTrack.disable() : localVideoTrack.enable();
        setIsCameraOff(!localVideoTrack.isEnabled);
      }
    }
  };

  // Handle leave meeting
  const handleLeaveMeeting = () => {
    if (room) {
      room.disconnect();
    }
    window.close(); // Close the current window/tab
  };

  return (
    <div className="flex flex-col h-screen bg-[#F0F4F8] text-gray-800">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-[#1ED0C2]">
        <h1 className="text-2xl font-bold text-white">Live Meeting</h1>
      </div>

      {/* Video Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 overflow-y-auto">
        {/* Local Video */}
        <div className="bg-white rounded-lg overflow-hidden aspect-video shadow-lg">
          {isCameraOff ? (
            <div className="flex items-center justify-center h-full bg-gray-100">
              <Lottie options={defaultOptions} height={200} width={200} />
            </div>
          ) : (
            <div ref={localVideoRef} className="w-full h-full"></div>
          )}
        </div>

        {/* Remote Participants */}
        {remoteParticipants.map(({ participant, isMicMuted, isCameraOff }) => (
          <div key={participant.sid} className="bg-white rounded-lg overflow-hidden relative aspect-video shadow-lg">
            {/* Microphone Status Icon */}
            <div className="absolute top-2 right-2 bg-black bg-opacity-50 p-1 rounded-full">
              {isMicMuted ? (
                <FaMicrophoneSlash className="text-red-500" />
              ) : (
                <FaMicrophone className="text-[#1ED0C2]" />
              )}
            </div>

            {/* Camera Status Icon */}
            <div className="absolute top-2 left-2 bg-black bg-opacity-50 p-1 rounded-full">
              {isCameraOff ? (
                <FaVideoSlash className="text-red-500" />
              ) : (
                <FaVideo className="text-[#1ED0C2]" />
              )}
            </div>

            {/* Video and Audio Tracks */}
            {isCameraOff ? (
              <div className="flex items-center justify-center h-full bg-gray-100">
                <Lottie options={defaultOptions} height={200} width={200} />
              </div>
            ) : (
              <div id={`remote-track-${participant.sid}-video`} className="w-full h-full"></div>
            )}
            <div id={`remote-track-${participant.sid}-audio`} className="w-full h-full"></div>
          </div>
        ))}
      </div>

      {/* Footer with Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#1ED0C2] p-4 flex justify-center gap-4">
        {/* Mute/Unmute Button */}
        <button
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            isMicMuted ? "bg-red-600" : "bg-white text-[#1ED0C2]"
          }`}
          onClick={toggleMic}
        >
          {isMicMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
          {isMicMuted ? "Unmute Mic" : "Mute Mic"}
        </button>

        {/* Camera On/Off Button */}
        <button
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            isCameraOff ? "bg-red-600" : "bg-white text-[#1ED0C2]"
          }`}
          onClick={toggleCamera}
        >
          {isCameraOff ? <FaVideoSlash /> : <FaVideo />}
          {isCameraOff ? "Turn On Camera" : "Turn Off Camera"}
        </button>

        {/* Leave Meeting Button */}
        <button
          className="bg-white text-[#1ED0C2] px-4 py-2 rounded-lg"
          onClick={() => setShowLeaveConfirmation(true)} // Show confirmation pop-up
        >
          Leave Meeting
        </button>
      </div>

      {/* Confirmation Pop-up */}
      {showLeaveConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg text-center shadow-lg">
            <h2 className="text-xl font-bold mb-4">Are you sure you want to leave the meeting?</h2>
            <div className="flex justify-center gap-4">
              <button
                className="bg-[#1ED0C2] text-white px-4 py-2 rounded-lg"
                onClick={handleLeaveMeeting} // Confirm leave
              >
                Confirm
              </button>
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
                onClick={() => setShowLeaveConfirmation(false)} // Cancel leave
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};