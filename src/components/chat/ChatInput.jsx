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

    // Optimistic UI update for WebSocket
    const tempMessage = {
      id: Date.now(), // Temporary ID
      content: message,
      timestamp: new Date().toISOString(),
      is_from_current_user: true,
      sender: {
        username: 'You',
        photo: ''
      }
    };

    // Add to local state immediately
    queryClient.setQueryData(
      ['chat', 'messages', conversationId],
      (old) => [...(old || []), tempMessage]
    );

    // Try WebSocket first
    const wsSuccess = sendWebSocketMessage(message);
    
    if (wsSuccess) {
      setMessage('');
      textareaRef.current?.focus();
    } else {
      // Fallback to HTTP if WebSocket fails
      sendHttpMessage(
        { conversationId, content: message },
        {
          onError: (error) => {
            toast.error('Failed to send message', {
              description: error.response?.data?.error || 'An error occurred'
            });
            // Remove optimistic update if HTTP fails
            queryClient.setQueryData(
              ['chat', 'messages', conversationId],
              (old) => old?.filter(m => m.id !== tempMessage.id) || []
            );
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
          {isPending ? (
            <span className="animate-spin">↻</span>
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;