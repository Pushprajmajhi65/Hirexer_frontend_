import React, { useState, useEffect } from 'react';
import ChatSidebar from './ChatSidebar';
import ChatMessagesArea from './ChatMessagesArea';
import { useGetChatUsers, useGetConversations, useStartConversation } from '@/services/chat';
import { useQueryClient } from '@tanstack/react-query';
import { getWebSocketStatus, disconnectWebSocket } from '@/services/chat';

const ChatContainer = () => {
  const queryClient = useQueryClient();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  
  const { data: users = [], isLoading: usersLoading } = useGetChatUsers();
  const { data: conversations = [], isLoading: convLoading } = useGetConversations();
  const startConversation = useStartConversation();

  // Update connection status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setConnectionStatus(getWebSocketStatus());
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const handleSelectUser = async (user) => {
    try {
      // Find existing conversation
      const existingConv = conversations.find(conv => 
        conv.participants.some(p => p.id === user.id)
      );
      
      if (existingConv) {
        setSelectedConversation(existingConv);
        setSelectedUser(user);
        queryClient.invalidateQueries(['chat', 'messages', existingConv.id]);
      } else {
        const newConv = await startConversation.mutateAsync(user.id);
        setSelectedConversation(newConv);
        setSelectedUser(user);
        queryClient.invalidateQueries(['chat', 'conversations']);
      }
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  };

  const handleSelectConversation = (conversation) => {
    const otherParticipant = conversation.participants.find(
      p => p.id !== conversation.currentUserParticipantId
    );
    setSelectedConversation(conversation);
    setSelectedUser(otherParticipant);
    queryClient.invalidateQueries(['chat', 'messages', conversation.id]);
  };

  const handleBack = () => {
    setSelectedUser(null);
    setSelectedConversation(null);
    disconnectWebSocket();
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-4 w-full">
        <ChatSidebar
          users={users}
          conversations={conversations}
          selectedConversation={selectedConversation}
          selectedUser={selectedUser}
          onSelectUser={handleSelectUser}
          onSelectConversation={handleSelectConversation}
          isLoading={usersLoading || convLoading}
        />
        <ChatMessagesArea
          selectedUser={selectedUser}
          conversation={selectedConversation}
          onBack={handleBack}
          connectionStatus={connectionStatus}
        />
      </div>
    </div>
  );
};

export default ChatContainer;