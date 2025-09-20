// src/lib/config.js
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export const API_BASE = API_URL; // For REST: /farms, /latest, /push
export const API_STREAM = `${API_URL}/stream`; // For SSE
