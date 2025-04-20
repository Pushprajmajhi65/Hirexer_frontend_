// export const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;
export const BACKEND_URL = "http://127.0.0.1:8000/";
export const WEATHER_API_KEY=import.meta.env.VITE_WEATHER_API_KEY
export const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || BACKEND_URL.replace(/^http/, 'ws');