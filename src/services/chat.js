import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./axios";
import { getTokens, setTokens } from "./auth";
import { WS_BASE_URL } from "./config";

// API methods
const chatAPI = {
  getUsers: async () => {
    try {
      const { data } = await axiosInstance.get("/chat/users/");
      return data || [];
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },
  
  getConversations: async () => {
    try {
      const { data } = await axiosInstance.get("/chat/conversations/");
      return data || [];
    } catch (error) {
      console.error("Error fetching conversations:", error);
      throw error;
    }
  },
  
  getMessages: async (conversationId) => {
    try {
      const { data } = await axiosInstance.get(`/chat/conversations/${conversationId}/messages/`);
      return data || [];
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  },
  
  startConversation: async (participantId) => {
    try {
      const { data } = await axiosInstance.post("/chat/conversations/start/", {
        participant_id: participantId
      });
      return data;
    } catch (error) {
      console.error("Error starting conversation:", error);
      throw error;
    }
  },
  
  sendMessage: async (conversationId, content) => {
    try {
      const { data } = await axiosInstance.post(`/chat/conversations/${conversationId}/messages/`, {
        content
      });
      return data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }
};

// React Query hooks
const useGetChatUsers = () => {
  return useQuery({
    queryKey: ['chat', 'users'],
    queryFn: chatAPI.getUsers,
    staleTime: 0,
    retry: (failureCount, error) => failureCount < 3 && error?.response?.status !== 401
  });
};

const useGetConversations = () => {
  return useQuery({
    queryKey: ['chat', 'conversations'],
    queryFn: chatAPI.getConversations,
    staleTime: 0,
    retry: (failureCount, error) => failureCount < 3 && error?.response?.status !== 401
  });
};


const useGetMessages = (conversationId) => {
  return useQuery({
    queryKey: ['chat', 'messages', conversationId],
    queryFn: () => chatAPI.getMessages(conversationId),
    enabled: !!conversationId,
    retry: (failureCount, error) => failureCount < 3 && error?.response?.status !== 401
  });
};



const useStartConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: chatAPI.startConversation,
    onSuccess: () => {
      queryClient.invalidateQueries(['chat', 'conversations']);
    }
  });
};

const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ conversationId, content }) => chatAPI.sendMessage(conversationId, content),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries(['chat', 'messages', vars.conversationId]);
    }
  });
};



// WebSocket Manager
class WebSocketManager {
  constructor() {
    this.socket = null;
    this.messageHandlers = [];
    this.errorHandlers = [];
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 3;
    this.connectionStatus = 'disconnected';
    this.currentConversationId = null;
  }

  async connect(conversationId) {
    return new Promise((resolve, reject) => {
      if (this.socket && [WebSocket.OPEN, WebSocket.CONNECTING].includes(this.socket.readyState)) {
        if (this.currentConversationId === conversationId) {
          resolve();
          return;
        }
        this.disconnect();
      }

      const tokens = getTokens();
      if (!tokens?.accessToken) {
        reject(new Error("No access token available"));
        return;
      }

      const wsUrl = `${WS_BASE_URL}ws/chat/${conversationId}/?token=${encodeURIComponent(tokens.accessToken)}`;
      
      this.socket = new WebSocket(wsUrl);
      this.currentConversationId = conversationId;
      this.connectionStatus = 'connecting';

      // Add connection timeout
      const connectionTimeout = setTimeout(() => {
        if (this.socket?.readyState !== WebSocket.OPEN) {
          this.socket?.close();
          reject(new Error("Connection timeout"));
        }
      }, 10000); // 10 second timeout

      this.socket.onopen = () => {
        clearTimeout(connectionTimeout);
        this.reconnectAttempts = 0;
        this.connectionStatus = 'connected';
        resolve();
      };

      this.socket.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          // Add socket message flag
          data.isSocketMessage = true;
          this.messageHandlers.forEach(handler => handler(data));
        } catch (err) {
          console.error("WebSocket message error:", err);
          this.errorHandlers.forEach(handler => handler(err));
        }
      };
    });
  }

  async handleTokenRefresh(conversationId) {
    try {
      const tokens = getTokens();
      if (!tokens?.refreshToken) throw new Error("No refresh token");
      
      const response = await axiosInstance.post('auth/refresh/', {
        refresh: tokens.refreshToken
      });
      
      setTokens({
        accessToken: response.data.access,
        refreshToken: tokens.refreshToken
      });
      
      // Reconnect with new token
      await this.connect(conversationId);
    } catch (error) {
      this.errorHandlers.forEach(handler => handler({
        error: "Token refresh failed",
        detail: error.message
      }));
      throw error; // Re-throw to allow calling code to handle
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close(1000, "Normal closure");
      this.socket = null;
    }
    this.currentConversationId = null;
    this.connectionStatus = 'disconnected';
  }

  sendMessage(content) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      try {
        const user = getCurrentUser();
        const message = {
          type: 'chat_message',
          message: content,
          username: user.username,
          user_id: user.id,
          timestamp: new Date().toISOString()
        };
        this.socket.send(JSON.stringify(message));
        return true;
      } catch (error) {
        console.error("Error sending WebSocket message:", error);
        this.errorHandlers.forEach(handler => handler(error));
        return false;
      }
    }
    return false;
  }


  getStatus() {
    return this.connectionStatus;
  }

  addMessageHandler(handler) {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }

  addErrorHandler(handler) {
    this.errorHandlers.push(handler);
    return () => {
      this.errorHandlers = this.errorHandlers.filter(h => h !== handler);
    };
  }
}

const wsManager = new WebSocketManager();

const connectWebSocket = (conversationId, onMessage, onError) => {
  const removeMessageHandler = wsManager.addMessageHandler(onMessage);
  const removeErrorHandler = wsManager.addErrorHandler(onError);
  
  const connectionPromise = wsManager.connect(conversationId);
  
  return {
    promise: connectionPromise,
    cleanup: () => {
      removeMessageHandler();
      removeErrorHandler();
    }
  };
};

const disconnectWebSocket = () => {
  wsManager.disconnect();
};

const sendWebSocketMessage = (content) => {
  return wsManager.sendMessage(content);
};

const getWebSocketStatus = () => {
  return wsManager.getStatus();
};

// Export all hooks and functions
export {
  chatAPI,
  useGetChatUsers,
  useGetConversations,
  useGetMessages,
  useStartConversation,
  useSendMessage,
  connectWebSocket,
  disconnectWebSocket,
  sendWebSocketMessage,
  getWebSocketStatus
};