import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { connect } from 'twilio-video';
import { toast } from 'react-hot-toast';
import {
  FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash,
  FaUserFriends, FaPhoneSlash, FaCog
} from 'react-icons/fa';

const RTC = () => {
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [deviceSettings, setDeviceSettings] = useState({
    audioInput: '',
    videoInput: '',
  });
  const [availableDevices, setAvailableDevices] = useState({
    audioInput: [],
    videoInput: [],
  });

  const localVideoRef = useRef(null);
  const participantRefs = useRef({});
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const channelName = params.get('channelName');
  const token = params.get('token');

  useEffect(() => {
    getAvailableDevices();
    connectToRoom();
    return () => {
      if (room) {
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
      setupExistingParticipants(roomInstance);
      toast.success('Connected to meeting');
    } catch (error) {
      toast.error('Failed to connect to meeting');
    }
  };

  const setupLocalVideo = (roomInstance) => {
    if (localVideoRef.current) {
      const localParticipant = roomInstance.localParticipant;
      localParticipant.videoTracks.forEach(publication => {
        if (publication.track) {
          const element = publication.track.attach();
          element.className = 'w-full h-full object-cover';
          localVideoRef.current.innerHTML = '';
          localVideoRef.current.appendChild(element);
        }
      });
    }
  };

  const setupParticipantHandlers = (roomInstance) => {
    const handleParticipantConnected = (participant) => {
      setParticipants(prevParticipants => [...prevParticipants, participant]);
      handleParticipantTracks(participant);
      toast.success(`${participant.identity} joined`);
    };

    const handleParticipantDisconnected = (participant) => {
      setParticipants(prevParticipants => 
        prevParticipants.filter(p => p !== participant)
      );
      if (participantRefs.current[participant.sid]) {
        participantRefs.current[participant.sid].innerHTML = '';
        delete participantRefs.current[participant.sid];
      }
      toast.info(`${participant.identity} left`);
    };

    roomInstance.on('participantConnected', handleParticipantConnected);
    roomInstance.on('participantDisconnected', handleParticipantDisconnected);
  };

  const handleParticipantTracks = (participant) => {
    const trackSubscribed = (track) => {
      if (participantRefs.current[participant.sid]) {
        const element = track.attach();
        if (track.kind === 'video') {
          element.className = 'w-full h-full object-cover';
        }
        participantRefs.current[participant.sid].appendChild(element);
      }
    };

    const trackUnsubscribed = (track) => {
      track.detach().forEach(element => element.remove());
    };

    participant.on('trackSubscribed', trackSubscribed);
    participant.on('trackUnsubscribed', trackUnsubscribed);

    participant.tracks.forEach(publication => {
      if (publication.isSubscribed) {
        trackSubscribed(publication.track);
      }
    });
  };

  const setupExistingParticipants = (roomInstance) => {
    roomInstance.participants.forEach(participant => {
      setParticipants(prevParticipants => [...prevParticipants, participant]);
      handleParticipantTracks(participant);
    });
  };

  const getGridColumns = () => {
    const totalParticipants = participants.length + 1;
    if (totalParticipants === 1) {
      return "grid-cols-1";
    } else if (totalParticipants === 2) {
      return "grid-cols-1 md:grid-cols-2";
    } else if (totalParticipants <= 4) {
      return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2";
    } else if (totalParticipants <= 6) {
      return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    } else {
      return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
    }
  };

  const getParticipantSize = () => {
    const totalParticipants = participants.length + 1;
    if (totalParticipants === 1) {
      return "h-[600px]";
    } else if (totalParticipants === 2) {
      return "h-[400px]";
    } else if (totalParticipants <= 4) {
      return "h-[300px]";
    } else {
      return "h-[250px]";
    }
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
        <h1 className="text-white text-xl font-bold">Hirexer Meet</h1>
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

      <div className="flex flex-col md:flex-row h-[calc(100vh-140px)]">
        <div
          className={`flex-1 grid ${getGridColumns()} gap-4 p-4 auto-rows-fr`}
        >
          {/* Local Participant */}
          <div
            className={`relative bg-gray-800 rounded-xl overflow-hidden shadow-lg ${getParticipantSize()}`}
          >
            <div ref={localVideoRef} className="w-full h-full" />
            <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full">
              You (Host)
            </div>
          </div>

          {/* Remote Participants */}
          {participants.map((participant) => (
            <div
              key={participant.sid}
              className={`relative bg-gray-800 rounded-xl overflow-hidden shadow-lg ${getParticipantSize()}`}
            >
              <div
                ref={(el) => (participantRefs.current[participant.sid] = el)}
                className="w-full h-full"
              />
              <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full">
                {participant.identity}
              </div>
            </div>
          ))}
        </div>

        {showSettings && (
          <div className="w-full md:w-80 bg-gray-800 bg-opacity-90 p-6 border-l border-gray-700">
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

      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 bg-opacity-90 p-4 md:p-6 border-t border-gray-700">
        <div className="flex justify-center items-center space-x-4 md:space-x-6">
          <button
            onClick={toggleAudio}
            className={`p-3 md:p-4 rounded-full transition-all transform hover:scale-110 ${
              audioEnabled ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-red-500 text-white hover:bg-red-600'
            }`}
          >
            {audioEnabled ? <FaMicrophone size={20} /> : <FaMicrophoneSlash size={20} />}
          </button>

          <button
            onClick={toggleVideo}
            className={`p-3 md:p-4 rounded-full transition-all transform hover:scale-110 ${
              videoEnabled ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-red-500 text-white hover:bg-red-600'
            }`}
          >
            {videoEnabled ? <FaVideo size={20} /> : <FaVideoSlash size={20} />}
          </button>

          <button
            onClick={() => setIsLeaving(true)}
            className="p-3 md:p-4 rounded-full bg-red-500 text-white transition-all transform hover:scale-110 hover:bg-red-600"
          >
            <FaPhoneSlash size={20} />
          </button>
        </div>
      </div>

      {isLeaving && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 p-6 md:p-8 rounded-xl shadow-xl max-w-md w-full">
            <h2 className="text-white text-xl md:text-2xl font-bold mb-4">Leave Meeting?</h2>
            <p className="text-gray-300 mb-6">Are you sure you want to leave the meeting?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsLeaving(false)}
                className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLeaveMeeting}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
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