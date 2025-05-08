import { useEffect, useRef } from "react";

export class SocketManager {
  constructor(url) {
    if (!url) {
      console.warn("No WebSocket URL provided");
      return;
    }

    this.url = url;
    this.socket = null;
    this.callbacks = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.pingInterval = 30000; // 30 seconds
    this.pingTimeout = null;

    this.connect();
  }

  connect() {
    this.socket = new WebSocket(this.url);
    this.socket.onopen = this.handleOpen.bind(this);
    this.socket.onmessage = this.handleMessage.bind(this);
    this.socket.onclose = this.handleClose.bind(this);
    this.socket.onerror = this.handleError.bind(this);
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