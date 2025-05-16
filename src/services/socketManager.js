import { useEffect, useRef } from "react";

export class SocketManager {
  constructor(url) {
    this.url = url;
    this.socket = null;
    this.callbacks = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = Infinity; // Keep trying to reconnect
    this.reconnectDelay = 1000;
    this.pingInterval = 25000; // 25 seconds
    this.pingTimeout = null;
    this.messageQueue = [];
    this.isConnected = false;

    this.connect();
  }

  connect() {
    this.socket = new WebSocket(this.url);
    
    this.socket.onopen = () => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.flushMessageQueue();
      this.startPing();
      console.log("WebSocket connected");
    };
    
    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const callback = this.callbacks.get(data.type);
        if (callback) {
          callback(data);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };
    
    this.socket.onclose = (event) => {
      this.isConnected = false;
      this.stopPing();
      console.log("WebSocket disconnected:", event.code, event.reason);
      this.attemptReconnect();
    };
    
    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      this.stopPing();
    };
  }

  flushMessageQueue() {
    while (this.messageQueue.length > 0 && this.isConnected) {
      const message = this.messageQueue.shift();
      this.send(message);
    }
  }

  handleOpen() {
    console.log("WebSocket connected");
    this.reconnectAttempts = 0;
    this.startPing();
  }

  handleMessage(event) {
    try {
      const data = JSON.parse(event.data);
      const callback = this.callbacks.get(data.type);
      if (callback) {
        callback(data);
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  }

  handleClose(event) {
    console.log("WebSocket disconnected:", event.code, event.reason);
    this.stopPing();
    this.attemptReconnect();
  }

  handleError(error) {
    console.error("WebSocket error:", error);
    this.stopPing();
  }

  startPing() {
    this.pingTimeout = setInterval(() => {
      if (this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ type: 'ping' }));
      }
    }, this.pingInterval);
  }

  stopPing() {
    if (this.pingTimeout) {
      clearInterval(this.pingTimeout);
      this.pingTimeout = null;
    }
  }

  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay);
    } else {
      console.log("Max reconnection attempts reached");
    }
  }

  on(eventType, callback) {
    this.callbacks.set(eventType, callback);
    return () => this.off(eventType);
  }

  off(eventType) {
    this.callbacks.delete(eventType);
  }

  send(data) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    } else {
      console.error("WebSocket is not open");
      // Optionally queue messages when socket is not ready
    }
  }

  close() {
    if (this.socket) {
      this.stopPing();
      this.socket.close();
    }
  }
}

export const useWebSocket = (url, callbacks) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!url) return;

    socketRef.current = new SocketManager(url);

    // Set up callbacks
    const cleanupCallbacks = Object.entries(callbacks).map(([eventType, callback]) => {
      return socketRef.current?.on(eventType, callback);
    });

    return () => {
      // Clean up callbacks
      cleanupCallbacks.forEach(cleanup => cleanup?.());
      
      // Close connection
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [url, callbacks]);

  const send = (data) => {
    if (socketRef.current) {
      socketRef.current.send(data);
    }
  };

  return { send };
};