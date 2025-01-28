import axios from "axios";
import { authStore } from "../store/authStore";
import { Project } from "../types";

const baseURL = "http://127.0.0.1:8000";
console.log(baseURL);
const apiClient = axios.create({
  baseURL,
});

apiClient.interceptors.request.use((config) => {
  const token = authStore.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (user: { email: string; password: string }) => {
  const response = await apiClient.post("/auth/login", user);
  return response.data;
};

export const register = async (user: { email: string; password: string }) => {
  const response = await apiClient.post("/auth/register", user);
  return response.data;
};

export const fetchProjects = async (): Promise<Project[]> => {
  const response = await apiClient.get("/api/get-projects");
  console.log(response.data);
  return response.data;
};

export const createProject = async (project: {
  project_name: string;
  description: string;
}) => {
  const response = await apiClient.post("/api/new-project", project);
  return response.data;
};

export default apiClient;
