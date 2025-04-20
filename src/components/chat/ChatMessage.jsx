import React from 'react';
import { format } from 'date-fns';

const ChatMessage = ({ message, isOwnMessage }) => {
  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        isOwnMessage ? 'bg-primary text-primary-foreground' : 'bg-muted'
      }`}>
        {!isOwnMessage && (
          <div className="font-semibold text-sm">{message.sender?.username}</div>
        )}
        <div className="text-sm">{message.content}</div>
        <div className="text-xs opacity-80 mt-1 text-right">
          {format(new Date(message.timestamp), 'h:mm a')}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;