// Updated useSocketMessages.ts
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export const useSocketMessages = (conversationId) => {
  const queryClient = useQueryClient();
  const [socketMessages, setSocketMessages] = useState([]);

  useEffect(() => {
    if (!conversationId) return;

    const updateMessages = () => {
      const messages = queryClient.getQueryData(['chat', 'messages', conversationId]) || [];
      // Track all messages with a socket flag or just new ones
      setSocketMessages(messages.filter(m => m.isSocketMessage)); 
    };

    const unsubscribe = queryClient.getQueryCache().subscribe(updateMessages);
    updateMessages();

    return unsubscribe;
  }, [conversationId, queryClient]);

  return socketMessages;
};