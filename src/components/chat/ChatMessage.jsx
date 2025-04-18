import React from 'react';
import { useGetMessages } from '@/services/chat';
import ChatMessage from './ChatMessage';

const ChatMessages = ({ conversationId, currentUserId }) => {
  const { data: messages = [], isLoading, isError } = useGetMessages(conversationId);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p>Loading messages...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p>Error loading messages</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {messages.map((message) => (
        <ChatMessage
          key={`${message.id}-${message.timestamp}`}
          message={message}
          isMe={message.sender_id === currentUserId}
        />
      ))}
    </div>
  );
};

export default ChatMessages;