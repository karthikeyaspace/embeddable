import axios from "axios";
import env from "./env";

const API_URL = env.API_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

export default api;
