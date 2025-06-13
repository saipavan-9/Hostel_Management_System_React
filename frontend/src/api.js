import axios from "axios";

const api = axios.create({
  baseURL: "/api", // <-- no hostname, just relative path
  //baseURL:"http://localhost:5000/api"
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true
});

export default api;
