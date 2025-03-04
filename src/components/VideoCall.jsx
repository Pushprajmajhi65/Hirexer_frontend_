import React, { useEffect, useRef } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useLocation } from "react-router-dom";

const VideoCall = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const token = query.get("token");
  const channel = query.get("channel");
  const localVideoRef = useRef(null);

  useEffect(() => {
    const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

    client.on("user-published", async (user, mediaType) => {
      await client.subscribe(user, mediaType);
      if (mediaType === "video") {
        const remoteVideoTrack = user.videoTrack;
        remoteVideoTrack.play(`remote-video-${user.uid}`);
      }
    });

    const joinChannel = async () => {
      await client.join(token, channel, null, null);
      const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      const localVideoTrack = await AgoraRTC.createCameraVideoTrack();
      await client.publish([localAudioTrack, localVideoTrack]);
      localVideoTrack.play(localVideoRef.current);
    };

    joinChannel();

    return () => {
      client.leave();
    };
  }, [token, channel]);

  return (
    <div>
      <div ref={localVideoRef} style={{ width: "320px", height: "240px" }}></div>
      <div id="remote-video-container"></div>
    </div>
  );
};

export default VideoCall;