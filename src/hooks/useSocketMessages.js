import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export const useSocketMessages = (conversationId) => {
  const queryClient = useQueryClient();
  const [socketMessages, setSocketMessages] = useState([]);

  useEffect(() => {
    if (!conversationId) return;

    const updateMessages = () => {
        const messages = queryClient.getQueryData(['chat', 'messages', conversationId]) || [];
        const filteredMessages = messages.filter(m => m.isSocketMessage || m.is_from_current_user);
      
        setSocketMessages((prev) => {
          const prevJSON = JSON.stringify(prev);
          const nextJSON = JSON.stringify(filteredMessages);
          return prevJSON === nextJSON ? prev : filteredMessages;
        });
      };
    const unsubscribe = queryClient.getQueryCache().subscribe(updateMessages);
    updateMessages();

    return () => {
      unsubscribe();
      setSocketMessages([]); // Cleanup on unmount
    };
  }, [conversationId, queryClient]);

  return socketMessages;
};