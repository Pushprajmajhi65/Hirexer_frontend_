import React, { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Separator } from './ui/separator';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showChat, setShowChat] = useState(true); // Set to true by default

  useEffect(() => {
    // Simulate fetching messages
    const fetchMessages = async () => {
      // Fetch messages from your API or any other source
      const data = [
        { id: 1, user: 'Alice', content: 'Hello!' },
        { id: 2, user: 'Bob', content: 'Hi there!' },
      ];
      setMessages(data);
    };
    fetchMessages();
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = { id: Date.now(), user: 'You', content: newMessage };
      setMessages((prevMessages) => [...prevMessages, message]);
      setNewMessage('');
    }
  };

  return (
    <>
      {/* Chat toggle button (visible when chat is closed) */}
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          className="fixed right-0 bottom-0 bg-blue-500 text-white px-4 py-2 rounded-tl-md rounded-bl-md"
        >
          Open Chat
        </button>
      )}

      {/* Chat UI (visible when chat is open) */}
      <div
        className={`fixed right-0 bottom-0 w-80 h-[400px] bg-white border-t-4 border-blue-500 rounded-l-2xl p-4 ${
          showChat ? 'block' : 'hidden'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg">Chat</h2>
            <button onClick={() => setShowChat(false)} className="text-red-500">
              Close
            </button>
          </div>
          <div className="flex flex-col overflow-y-auto flex-grow">
            {messages.map((message) => (
              <div key={message.id} className="p-2 mb-2 bg-gray-200 rounded-md">
                <p className="font-semibold">{message.user}</p>
                <p>{message.content}</p>
              </div>
            ))}
          </div>
          <div className="flex mt-2">
            <input
              type="text"
              className="flex-grow p-2 border rounded-l-md"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded-r-md"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;