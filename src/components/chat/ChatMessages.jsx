import React, { useEffect, useRef } from 'react';
import { useGetMessages } from '@/services/chat';
import ChatMessage from './ChatMessage';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQueryClient } from '@tanstack/react-query';

const ChatMessages = ({ conversationId, currentUserId }) => {
  const { data: initialMessages = [], isLoading, isError } = useGetMessages(conversationId);
  const queryClient = useQueryClient();
  const scrollRef = useRef(null);

  // Watch for message updates
  const messages = queryClient.getQueryData(['chat', 'messages', conversationId]) || initialMessages;

  // Scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (isLoading) {
    return <div className="p-4 text-muted-foreground">Loading messages...</div>;
  }

  if (isError) {
    return <div className="p-4 text-destructive">Failed to load messages.</div>;
  }

  return (
    <ScrollArea className="h-full">
      <div ref={scrollRef} className="flex flex-col gap-2 p-4">
      {messages.map((msg) => (
  <ChatMessage
    key={msg.id}
    message={{
      id: msg.id,
      content: msg.content || msg.message, // Handle both formats
      timestamp: msg.timestamp,
      sender: msg.sender || { 
        username: msg.username || 'Unknown',
        photo: ''
      },
      status: msg.status || 'sent'
    }}
    isOwnMessage={msg.is_from_current_user}
  />
))}
      </div>
    </ScrollArea>
  );
};

export default ChatMessages;