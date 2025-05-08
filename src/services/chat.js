import axiosInstance from "./axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Fetch all users
export const fetchUsers = async () => {
  const response = await axiosInstance.get("chat/users/");
  return response.data;
};

// Fetch all conversations
export const fetchConversations = async () => {
  const response = await axiosInstance.get("chat/conversations/");
  return response.data;
};

// Start a new conversation
export const startConversation = async (participantId) => {
  const response = await axiosInstance.post("chat/conversations/start/", {
    participant_id: participantId,
  });
  return response.data;
};

// Fetch messages for a conversation
export const fetchMessages = async (conversationId) => {
  const response = await axiosInstance.get(
    `chat/conversations/${conversationId}/messages/`
  );
  return response.data;
};

// Send a message
export const sendMessage = async ({ conversationId, content }) => {
  const response = await axiosInstance.post(
    `chat/conversations/${conversationId}/messages/`,
    { content }
  );
  return response.data;
};

// Mark messages as read
export const markMessagesAsRead = async (conversationId) => {
  const response = await axiosInstance.patch(
    `chat/conversations/${conversationId}/mark_read/`
  );
  return response.data;
};

// React Query hooks
export const useUsers = () => {
  return useQuery({
    queryKey: ["chat-users"],
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useConversations = () => {
  return useQuery({
    queryKey: ["chat-conversations"],
    queryFn: fetchConversations,
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  });
};

export const useMessages = (conversationId) => {
  return useQuery({
    queryKey: ["chat-messages", conversationId],
    queryFn: () => fetchMessages(conversationId),
    enabled: !!conversationId,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useStartConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: startConversation,
    onSuccess: () => {
      queryClient.invalidateQueries(["chat-conversations"]);
      queryClient.invalidateQueries(["chat-users"]);
    },
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sendMessage,
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        ["chat-messages", variables.conversationId],
        (oldData) => {
          return [...(oldData || []), data];
        }
      );
      queryClient.invalidateQueries(["chat-messages", variables.conversationId]);
      queryClient.invalidateQueries(["chat-conversations"]);
    },
  });
};

export const useMarkMessagesAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markMessagesAsRead,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["chat-messages", variables.conversationId]);
      queryClient.invalidateQueries(["chat-conversations"]);
    },
  });
};

export const useChatUpdates = (conversationId) => {
  const queryClient = useQueryClient();

  const handleNewMessage = (data) => {
    if (data.conversation_id === conversationId) {
      queryClient.setQueryData(
        ["chat-messages", conversationId],
        (oldData) => {
          // Check if message already exists
          if (oldData?.some(msg => msg.id === data.id)) {
            return oldData;
          }
          return [...(oldData || []), {
            id: data.id,
            content: data.content,
            timestamp: data.timestamp,
            sender: {
              id: data.user_id,
              username: data.username,
              avatar: data.photo,
              name: data.username
            },
            read: false
          }];
        }
      );
    }
    queryClient.invalidateQueries(["chat-conversations"]);
  };

  const handleTypingIndicator = (data) => {
    // This will be used in the ChatWindow component
    return data;
  };

  return { 
    handleNewMessage, 
    handleTypingIndicator 
  };
};