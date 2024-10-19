const env = {
  API_URL: import.meta.env.VITE_API_URL as string,
  NODE_ENV: import.meta.env.MODE as string,
  BASE_URL: import.meta.env.VITE_BASE_URL || "http://localhost:5173",
};

export default env;
