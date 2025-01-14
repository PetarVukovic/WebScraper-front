import apiClient from "./auth_api";
import type { Project } from "../types";

export const fetchProjects = async (): Promise<Project[]> => {
  const response = await apiClient.get("/api/get-projects");
  return response.data;
};

export const createProject = async (project: {
  project_name: string;
  description: string;
}): Promise<Project> => {
  const response = await apiClient.post("/api/new-project", project);
  return response.data;
};

export const deleteProject = async (projectId: string): Promise<void> => {
  await apiClient.delete(`/api/delete-project`, {
    params: { project_id: projectId },
  });
};
