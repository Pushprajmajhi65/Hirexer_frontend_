import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { connect } from 'twilio-video';
import { toast } from 'react-hot-toast';
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaUserFriends,
  FaPhoneSlash,
  FaCog,
  FaDesktop,
  FaComments,
} from 'react-icons/fa';

const RTC = () => {
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [deviceSettings, setDeviceSettings] = useState({
    audioInput: '',
    videoInput: '',
    audioOutput: '',
  });
  const [availableDevices, setAvailableDevices] = useState({
    audioInput: [],
    videoInput: [],
    audioOutput: [],
  });

  const localVideoRef = useRef(null);
  const screenTrackRef = useRef(null);
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const channelName = params.get('channelName');
  const token = params.get('token');

  useEffect(() => {
    getAvailableDevices();
    connectToRoom();

    return () => {
      if (room) {
        stopScreenSharing();
        room.disconnect();
      }
    };
  }, []);

  const getAvailableDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      setAvailableDevices({
        audioInput: devices.filter(device => device.kind === 'audioinput'),
        videoInput: devices.filter(device => device.kind === 'videoinput'),
        audioOutput: devices.filter(device => device.kind === 'audiooutput'),
      });
    } catch (error) {
      toast.error('Failed to get available devices');
    }
  };

  const connectToRoom = async () => {
    try {
      if (!channelName || !token) throw new Error('Missing connection parameters');

      const roomInstance = await connect(token, {
        name: channelName,
        audio: true,
        video: { width: 1280, height: 720 },
        dominantSpeaker: true,
      });

      setRoom(roomInstance);
      setupLocalVideo(roomInstance);
      setupParticipantHandlers(roomInstance);
      toast.success('Connected to meeting');
    } catch (error) {
      toast.error('Failed to connect to meeting');
    }
  };

  const setupLocalVideo = (roomInstance) => {
    const videoTrack = Array.from(roomInstance.localParticipant.videoTracks.values())[0]?.track;
    if (videoTrack && localVideoRef.current) {
      const element = videoTrack.attach();
      localVideoRef.current.innerHTML = '';
      localVideoRef.current.appendChild(element);
    }
  };

  const setupParticipantHandlers = (roomInstance) => {
    roomInstance.on('participantConnected', participant => {
      setParticipants(prev => [...prev, participant]);
      toast.success(`${participant.identity} joined`);
    });

    roomInstance.on('participantDisconnected', participant => {
      setParticipants(prev => prev.filter(p => p !== participant));
      toast.info(`${participant.identity} left`);
    });

    roomInstance.participants.forEach(participant => {
      setParticipants(prev => [...prev, participant]);
    });
  };

  const toggleAudio = () => {
    if (room) {
      room.localParticipant.audioTracks.forEach(publication => {
        audioEnabled ? publication.track.disable() : publication.track.enable();
      });
      setAudioEnabled(!audioEnabled);
      toast.success(audioEnabled ? 'Microphone muted' : 'Microphone unmuted');
    }
  };

  const toggleVideo = () => {
    if (room) {
      room.localParticipant.videoTracks.forEach(publication => {
        videoEnabled ? publication.track.disable() : publication.track.enable();
      });
      setVideoEnabled(!videoEnabled);
      toast.success(videoEnabled ? 'Camera off' : 'Camera on');
    }
  };

  const startScreenSharing = async () => {
    try {
      const screenTrack = await navigator.mediaDevices.getDisplayMedia();
      const videoTrack = screenTrack.getVideoTracks()[0];
      screenTrackRef.current = videoTrack;
      room.localParticipant.publishTrack(videoTrack);
      setIsScreenSharing(true);
      toast.success('Screen sharing started');
      videoTrack.onended = stopScreenSharing;
    } catch (error) {
      toast.error('Failed to share screen');
    }
  };

  const stopScreenSharing = () => {
    if (screenTrackRef.current) {
      room.localParticipant.unpublishTrack(screenTrackRef.current);
      screenTrackRef.current.stop();
      screenTrackRef.current = null;
      setIsScreenSharing(false);
      toast.success('Screen sharing stopped');
    }
  };

  const handleDeviceChange = async (type, deviceId) => {
    try {
      const constraints = { [type]: { deviceId: { exact: deviceId } } };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const track = type === 'audio' ? stream.getAudioTracks()[0] : stream.getVideoTracks()[0];

      if (room) {
        const publications = Array.from(room.localParticipant[`${type}Tracks`].values());
        const publication = publications[0];
        if (publication) {
          await publication.track.stop();
          await room.localParticipant.unpublishTrack(publication.track);
          await room.localParticipant.publishTrack(track);
        }
      }

      setDeviceSettings(prev => ({
        ...prev,
        [type === 'audio' ? 'audioInput' : 'videoInput']: deviceId
      }));

      toast.success(`${type === 'audio' ? 'Microphone' : 'Camera'} changed`);
    } catch (error) {
      toast.error(`Failed to change ${type === 'audio' ? 'microphone' : 'camera'}`);
    }
  };

  const handleLeaveMeeting = () => {
    if (room) {
      room.disconnect();
      toast.success('Left the meeting');
      window.close();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="bg-gray-800 bg-opacity-90 p-4 flex justify-between items-center border-b border-gray-700">
        <h1 className="text-white text-xl font-bold">Hirexer</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-gray-700 px-3 py-1 rounded-full">
            <FaUserFriends className="text-green-400" />
            <span className="text-white">{participants.length + 1}</span>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-full transition-all ${
              showSettings ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <FaCog size={20} />
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-140px)]">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          <div className="relative bg-gray-800 rounded-xl overflow-hidden aspect-video shadow-lg">
            <div ref={localVideoRef} className="w-full h-full" />
            <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full">
              You (Host)
            </div>
          </div>

          {participants.map((participant) => (
            <div key={participant.sid} className="relative bg-gray-800 rounded-xl overflow-hidden aspect-video shadow-lg">
              <div id={`participant-${participant.sid}`} className="w-full h-full" />
              <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full">
                {participant.identity}
              </div>
            </div>
          ))}
        </div>

        {showSettings && (
          <div className="w-80 bg-gray-800 bg-opacity-90 p-6 border-l border-gray-700">
            <h2 className="text-white text-lg font-bold mb-6">Device Settings</h2>
            
            <div className="space-y-6">
              <div>
                <label className="text-gray-300 text-sm block mb-2">Microphone</label>
                <select
                  className="w-full bg-gray-700 text-white p-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  value={deviceSettings.audioInput}
                  onChange={(e) => handleDeviceChange('audio', e.target.value)}
                >
                  {availableDevices.audioInput.map(device => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label || `Microphone ${device.deviceId.slice(0, 5)}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-300 text-sm block mb-2">Camera</label>
                <select
                  className="w-full bg-gray-700 text-white p-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  value={deviceSettings.videoInput}
                  onChange={(e) => handleDeviceChange('video', e.target.value)}
                >
                  {availableDevices.videoInput.map(device => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label || `Camera ${device.deviceId.slice(0, 5)}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 bg-opacity-90 p-6 border-t border-gray-700">
        <div className="flex justify-center items-center space-x-6">
          <button
            onClick={toggleAudio}
            className={`p-4 rounded-full transition-all transform hover:scale-110 ${
              audioEnabled
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-red-500 text-white hover:bg-red-600'
            }`}
          >
            {audioEnabled ? <FaMicrophone size={20} /> : <FaMicrophoneSlash size={20} />}
          </button>

          <button
            onClick={toggleVideo}
            className={`p-4 rounded-full transition-all transform hover:scale-110 ${
              videoEnabled
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-red-500 text-white hover:bg-red-600'
            }`}
          >
            {videoEnabled ? <FaVideo size={20} /> : <FaVideoSlash size={20} />}
          </button>

          {/* <button
            onClick={isScreenSharing ? stopScreenSharing : startScreenSharing}
            className={`p-4 rounded-full transition-all transform hover:scale-110 ${
              isScreenSharing
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            <FaDesktop size={20} />
          </button> */}

        {/*   <button
            onClick={() => setShowChat(!showChat)}
            className={`p-4 rounded-full transition-all transform hover:scale-110 ${
              showChat
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            <FaComments size={20} />
          </button> */}

          <button
            onClick={() => setIsLeaving(true)}
            className="p-4 rounded-full bg-red-500 text-white transition-all transform hover:scale-110 hover:bg-red-600"
          >
            <FaPhoneSlash size={20} />
          </button>
        </div>
      </div>

      {isLeaving && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-xl shadow-xl max-w-md w-full mx-4">
            <h2 className="text-white text-2xl font-bold mb-4">Leave Meeting?</h2>
            <p className="text-gray-300 mb-6">Are you sure you want to leave the meeting?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsLeaving(false)}
                className="px-6 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLeaveMeeting}
                className="px-6 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RTC;