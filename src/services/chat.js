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
  }

  async connect(conversationId) {
    return new Promise((resolve, reject) => {
      if (this.socket) this.disconnect();

      const tokens = getTokens();
      if (!tokens?.accessToken) {
        reject(new Error("No access token available"));
        return;
      }

      const wsUrl = `${WS_BASE_URL}/ws/chat/${conversationId}/`;
      
      // Create WebSocket with Authorization header
      this.socket = new WebSocket(wsUrl, [], {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`
        }
      });
      
      this.connectionStatus = 'connecting';

      this.socket.onopen = () => {
        this.reconnectAttempts = 0;
        this.connectionStatus = 'connected';
        resolve();
      };

      this.socket.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);ChatConsume
          this.messageHandlers.forEach(handler => handler(data));
        } catch (err) {
          this.errorHandlers.forEach(handler => handler(err));
        }
      };

      this.socket.onclose = (e) => {
        this.connectionStatus = 'disconnected';
        if (e.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
          setTimeout(() => {
            this.reconnectAttempts++;
            this.connect(conversationId).then(resolve).catch(reject);
          }, 1000 * Math.pow(2, this.reconnectAttempts));
        } else {
          this.errorHandlers.forEach(handler => handler({
            error: "WebSocket closed",
            detail: e.reason || "Connection closed",
            code: e.code
          }));
        }
      };

      this.socket.onerror = (error) => {
        this.connectionStatus = 'error';
        this.errorHandlers.forEach(handler => handler(error));
        reject(error);
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
      
      await this.connect(conversationId);
    } catch (error) {
      this.errorHandlers.forEach(handler => handler({
        error: "Token refresh failed",
        detail: error.message
      }));
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close(1000, "Normal closure");
      this.socket = null;
    }
    this.connectionStatus = 'disconnected';
    this.messageHandlers = [];
    this.errorHandlers = [];
  }

  sendMessage(content) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      try {
        this.socket.send(JSON.stringify({
          type: 'chat_message',
          content: content,
          timestamp: new Date().toISOString()
        }));
        return true;
      } catch (error) {
        console.error("Error sending WebSocket message:", error);
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