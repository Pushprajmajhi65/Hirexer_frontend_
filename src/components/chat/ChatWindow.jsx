import React, { useState, useEffect, useRef, useCallback } from "react";
import { useMessages, useSendMessage, useChatUpdates } from "../../services/chat";
import { useWebSocket } from "../../services/socketManager";
import { useAuth } from "../../context/AuthContext";
import { format } from "date-fns";

const ChatWindow = ({ conversationId }) => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const lastTypingSentRef = useRef(0);

  const { data: messages, isLoading } = useMessages(conversationId);
  const { mutate: sendMessage } = useSendMessage();
  const { user } = useAuth();
  const { handleNewMessage, handleTypingIndicator } = useChatUpdates(conversationId);

  const { send } = useWebSocket(
    conversationId ? `ws://${window.location.host}/ws/chat/${conversationId}/` : null,
    {
      chat_message: handleNewMessage,
      typing_indicator: (data) => {
        if (data.user_id !== user?.userprofile?.id) {
          const typingData = handleTypingIndicator(data);
          setTypingUser(typingData.username);
          setIsTyping(true);
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            setTypingUser(null);
          }, 3000);
        }
      },
    }
  );

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !conversationId) return;

    const messageData = {
      conversationId,
      content: message,
    };
    sendMessage(messageData);
    setMessage("");
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setMessage(value);

    const now = Date.now();
    if (conversationId && now - lastTypingSentRef.current > 2000) {
      send({
        type: "typing_indicator",
        conversation_id: conversationId,
        user_id: user?.userprofile?.id,
        username: user?.username,
      });
      lastTypingSentRef.current = now;
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col p-4">
        <div className="flex-1 space-y-4 overflow-y-auto">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!conversationId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">
            Select a conversation
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Choose an existing conversation or start a new one
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages?.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender?.id === user?.userprofile?.id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.sender?.id === user?.userprofile?.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <div className="flex items-center mb-1">
                  <img
                    src={msg.sender?.avatar || "/default-avatar.png"}
                    alt={msg.sender?.username || "Unknown"}
                    className="w-6 h-6 rounded-full mr-2"
                  />
                  <span className="font-medium">
                    {msg.sender?.id === user?.userprofile?.id
                      ? "You"
                      : msg.sender?.name || "Unknown"}
                  </span>
                </div>
                <p>{msg.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {format(new Date(msg.timestamp), "HH:mm")}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-gray-200 text-gray-800">
                <p className="italic text-gray-500">
                  {typingUser || "Someone"} is typing...
                </p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-full px-4 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={!message.trim()}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;