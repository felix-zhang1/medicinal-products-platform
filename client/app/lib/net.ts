import axios from "axios";
import { auth } from "./auth";

export const api = axios.create({
  baseURL: "/api",
  timeout: 15000,
  withCredentials: false,
});

// add a request interceptor to attach token
api.interceptors.request.use((cfg) => {
  const t = auth.getToken();
  if (t) {
    cfg.headers = cfg.headers || {}; // make sure the headers exist
    cfg.headers["Authorization"] = `Bearer ${t}`;
  }
  return cfg;
});
