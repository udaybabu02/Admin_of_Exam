// src/config.js (or src/config.ts)

const rawBaseUrl = import.meta.env.VITE_API_URL || "https://examportal-backend-xbw5.onrender.com";

export const API_BASE_URL = rawBaseUrl.endsWith('/api') ? rawBaseUrl : `${rawBaseUrl}/api`;