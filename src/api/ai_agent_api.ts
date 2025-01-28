import { PromptInput } from "../types";
import apiClient from "./auth_api";

export const fetchPromptByProjectId = async (projectId: number) => {
  const response = await apiClient.get(`/api/get-prompt/${projectId}`);
  return response.data;
};

export const upsertAiAgent = async (
  promptInput: PromptInput
): Promise<string> => {
  console.log("[upsertAiAgent] promptInput:", promptInput);
  const response = await apiClient.post("/api/upsert-prompt", promptInput);
  return response.data;
};
