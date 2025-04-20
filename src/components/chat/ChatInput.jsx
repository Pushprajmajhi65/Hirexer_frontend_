import React, { useState, useRef, useEffect } from 'react';
import { useSendMessage, sendWebSocketMessage } from '@/services/chat';
import { useQueryClient } from '@tanstack/react-query';
import { Send } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const ChatInput = ({ conversationId, disabled }) => {
  const [message, setMessage] = useState('');
  const { mutate: sendHttpMessage, isPending } = useSendMessage();
  const queryClient = useQueryClient();
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!disabled && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [disabled, conversationId]);

  const handleSend = () => {
    if (!message.trim() || !conversationId || disabled) return;

    const tempId = Date.now();
    const tempMessage = {
      id: tempId,
      content: message,
      timestamp: new Date().toISOString(),
      is_from_current_user: true,
      sender: {
        username: 'You',
        photo: ''
      },
      status: 'sending'
    };

    // Optimistic update
    queryClient.setQueryData(
      ['chat', 'messages', conversationId],
      (old) => [...(old || []), tempMessage]
    );

    // Try WebSocket first
    const wsSuccess = sendWebSocketMessage(message);
    
    if (wsSuccess) {
      // Update status to sent
      queryClient.setQueryData(
        ['chat', 'messages', conversationId],
        (old) => old.map(m => 
          m.id === tempId ? { ...m, status: 'sent' } : m
        )
      );
      setMessage('');
    } else {
      // Fallback to HTTP
      sendHttpMessage(
        { conversationId, content: message },
        {
          onSuccess: (data) => {
            // Replace temp message with real one
            queryClient.setQueryData(
              ['chat', 'messages', conversationId],
              (old) => [
                ...(old?.filter(m => m.id !== tempId) || []),
                { ...data, is_from_current_user: true }
              ]
            );
          },
          onError: (error) => {
            // Mark as failed
            queryClient.setQueryData(
              ['chat', 'messages', conversationId],
              (old) => old.map(m => 
                m.id === tempId ? { ...m, status: 'failed' } : m
              )
            );
            toast.error('Failed to send message', {
              description: error.response?.data?.error || 'An error occurred'
            });
          },
          onSettled: () => {
            setMessage('');
            textareaRef.current?.focus();
          }
        }
      );
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-border p-4 bg-card">
      <div className="flex items-end gap-2">
        <Textarea
          ref={textareaRef}
          className={`flex-1 min-h-[40px] max-h-[120px] resize-none ${
            disabled ? 'bg-muted/50 cursor-not-allowed' : 'bg-background'
          }`}
          value={message}
          onChange={(e) => !disabled && setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            disabled ? 'Select a conversation to chat' : 'Type your message...'
          }
          disabled={disabled || isPending}
        />
        <Button
          onClick={handleSend}
          disabled={disabled || !message.trim() || isPending}
          size="icon"
          className="h-10 w-10"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;