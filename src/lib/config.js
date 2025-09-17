export const API_STREAM = import.meta.env.VITE_API_URL || "http://localhost:4000/stream";
export const API_BASE = API_STREAM.includes("/stream") ? API_STREAM.replace("/stream", "") : API_STREAM;
