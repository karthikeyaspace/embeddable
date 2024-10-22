const env = {
  API_URL: import.meta.env.MODE === "development" ? "http://127.0.0.1:8000" : "https://embedapi.itskv.me",
  NODE_ENV: import.meta.env.MODE as string,
  BASE_URL: import.meta.env.MODE === "development" ? "http://localhost:5173" : "https://embed.itskv.me",
};

export default env;
