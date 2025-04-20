import React, { useEffect, useState } from 'react';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { connectWebSocket, disconnectWebSocket } from '@/services/chat';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const ChatMessagesArea = ({ selectedUser, conversation, onBack, connectionStatus }) => {
  const queryClient = useQueryClient();
  const [localConnectionStatus, setLocalConnectionStatus] = useState('disconnected');

  useEffect(() => {
    if (!conversation?.id) {
      setLocalConnectionStatus('disconnected');
      return;
    }

    const handleNewMessage = (message) => {
      if (message.type === 'chat_message') {
        queryClient.setQueryData(
          ['chat', 'messages', conversation.id],
          (oldMessages = []) => {
            const exists = oldMessages.some(m => 
              m.id === message.id || 
              (m.timestamp === message.timestamp && m.content === message.content)
            );
            
            if (exists) return oldMessages;
            
            return [...oldMessages, {
              ...message,
              id: message.id || Date.now(),
              sender_id: message.sender_id || selectedUser?.id,
              is_from_current_user: message.sender_id !== selectedUser?.id,
              isSocketMessage: true // Add this flag
            }];
          }
        );
      }
    };

    const handleError = (error) => {
      if (error.code === 1000) return; // Normal closure
      console.error('WebSocket error:', error);
      setLocalConnectionStatus('error');
      
      if (error.code === 4001) { // Auth error
        toast.error('Authentication expired', {
          description: 'Please refresh the page to reconnect'
        });
      } else {
        toast.error('Connection error', {
          description: error.detail || 'Failed to connect to chat'
        });
      }
    };

    setLocalConnectionStatus('connecting');
    
    const { promise, cleanup } = connectWebSocket(
      conversation.id, 
      handleNewMessage, 
      handleError
    );

    promise
      .then(() => setLocalConnectionStatus('connected'))
      .catch((error) => {
        console.error('WebSocket connection failed:', error);
        setLocalConnectionStatus('error');
      });

    return () => {
      cleanup();
      disconnectWebSocket();
    };
  }, [conversation?.id, queryClient, selectedUser?.id]);

  const displayStatus = connectionStatus === 'connected' ? localConnectionStatus : connectionStatus;

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
        connectionStatus={displayStatus}
      />
      <div className="flex-1 overflow-y-auto">
        <ChatMessages 
          conversationId={conversation.id} 
          currentUserId={selectedUser.id}
        />
      </div>
      <ChatInput 
        conversationId={conversation.id}
        disabled={displayStatus !== 'connected'}
      />
    </div>
  );
};

export default ChatMessagesArea;