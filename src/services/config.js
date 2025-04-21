// export const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;
export const BACKEND_URL = "http://127.0.0.1:8000/";
export const WEATHER_API_KEY=import.meta.env.VITE_WEATHER_API_KEY
export const WS_BASE_URL = (() => {
    // Use explicit WS URL if provided
    if (import.meta.env.VITE_WS_BASE_URL) {
      return import.meta.env.VITE_WS_BASE_URL.replace(/\/+$/, ''); // Remove trailing slashes
    }
    
    // Convert HTTP to WebSocket properly
    if (BACKEND_URL) {
      return BACKEND_URL
        .replace(/^https?/, (match) => match === 'https' ? 'wss' : 'ws')
        .replace(/\/+$/, ''); // Remove trailing slashes
    }
    
    // Fallback to current host
    return window.location.origin
      .replace(/^https?/, (match) => match === 'https' ? 'wss' : 'ws')
      .replace(/\/+$/, '');
  })();