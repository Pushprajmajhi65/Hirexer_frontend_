import React, { useEffect, useState } from 'react';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { connectWebSocket, disconnectWebSocket, chatAPI } from '@/services/chat';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const ChatMessagesArea = ({ selectedUser, conversation, onBack }) => {
  const queryClient = useQueryClient();
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  useEffect(() => {
    if (!conversation?.id) {
      setConnectionStatus('disconnected');
      return;
    }

    const handleNewMessage = (message) => {
      if (message.type === 'chat_message') {
        // Update the query cache with the new message
        queryClient.setQueryData(
          ['chat', 'messages', conversation.id],
          (oldMessages = []) => {
            // Check if message already exists to prevent duplicates
            const exists = oldMessages.some(m => 
              m.timestamp === message.timestamp && 
              m.content === message.content
            );
            return exists ? oldMessages : [...oldMessages, {
              ...message,
              id: message.id || Date.now(),
              sender_id: message.sender_id || selectedUser?.id,
              is_from_current_user: message.sender_id === selectedUser?.id
            }];
          }
        );
      }
    };

    const handleError = (error) => {
      if (error.code === 1000) return;
      console.error('WebSocket error:', error);
      setConnectionStatus('error');
      toast.error('Connection error', {
        description: error.detail || 'Failed to connect to chat'
      });
    };

    setConnectionStatus('connecting');
    
    const { promise, cleanup } = connectWebSocket(
      conversation.id, 
      handleNewMessage, 
      handleError
    );

    promise
      .then(() => setConnectionStatus('connected'))
      .catch((error) => {
        console.error('WebSocket connection failed:', error);
        setConnectionStatus('error');
      });

    return () => {
      cleanup();
      disconnectWebSocket();
      setConnectionStatus('disconnected');
    };
  }, [conversation?.id, queryClient, selectedUser?.id]);

  if (!conversation || !selectedUser) {
    return (
      <div className="lg:col-span-3 flex flex-col border-l border-border h-full">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <h3 className="text-lg font-medium text-muted-foreground">
              Select a conversation
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              Choose from your existing conversations or start a new one
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-3 flex flex-col border-l border-border h-full">
      <ChatHeader 
        user={selectedUser} 
        onBack={onBack}
        connectionStatus={connectionStatus}
      />
      <div className="flex-1 overflow-y-auto">
        <ChatMessages 
          conversationId={conversation.id} 
          currentUserId={selectedUser.id}
        />
      </div>
      <div className="sticky bottom-0 bg-card border-t border-border">
        <ChatInput 
          conversationId={conversation.id}
          disabled={connectionStatus !== 'connected'}
          currentUserId={selectedUser.id}
        />
      </div>
    </div>
  );
};

export default ChatMessagesArea;