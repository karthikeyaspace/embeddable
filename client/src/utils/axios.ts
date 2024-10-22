import axios from "axios";
import env from "./env";

const API_URL = env.API_URL;

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

export default api;
