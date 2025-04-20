// src/components/chat/ChatMessages.tsx
import React from 'react';
import { useGetMessages } from '@/services/chat';
import ChatMessage from './ChatMessage';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSocketMessages } from './hooks/useSocketMessages'; // or '@/hooks/useSocketMessages'

const ChatMessages = ({ conversationId, currentUserId }) => {
  const { data: messages = [], isLoading, isError } = useGetMessages(conversationId);
  const socketMessages = useSocketMessages(conversationId);

  // Combine and deduplicate messages
  const allMessages = [...messages, ...socketMessages]
    .filter((msg, index, self) => 
      index === self.findIndex(m => 
        m.id === msg.id || 
        (m.timestamp === msg.timestamp && m.content === msg.content)
      )
    )
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  if (isLoading) {
    return <div className="flex-1 flex items-center justify-center">Loading...</div>;
  }

  if (isError) {
    return <div className="flex-1 flex items-center justify-center">Error loading messages</div>;
  }

  return (
    <ScrollArea className="flex-1 p-4">
      {allMessages.map((message) => (
        <ChatMessage
          key={`${message.id}-${message.timestamp}`}
          message={message}
          isMe={message.is_from_current_user || message.sender_id === currentUserId}
        />
      ))}
    </ScrollArea>
  );
};

export default ChatMessages;