import { SearchHistoryResponse, SearchHistoryCreate } from "../types";
import apiClient from "./auth_api";

/**
 * Dohvaćanje Search History zapisa za projekt
 */
export const fetchSearchHistory = async (
  projectId: number
): Promise<SearchHistoryResponse[] | null> => {
  try {
    const response = await apiClient.get(`/api/search-history`, {
      params: { project_id: projectId },
    });
    return response.data;
  } catch (err) {
    console.error("Failed to fetch search history:", err);
    return null;
  }
};

export const updateSearchHistory = async (
  params: SearchHistoryCreate
): Promise<SearchHistoryResponse> => {
  const response = await apiClient.post("/api/update-search-history", params);
  return response.data;
};

export const deleteSearchHistory = async (
  id: string,
  project_id: number
): Promise<SearchHistoryResponse[]> => {
  const response = await apiClient.delete("/api/delete-search-history", {
    params: { id: id, project_id: project_id },
  });
  return response.data;
};
export const insertSearchHistory = async (
  scrapingParams: SearchHistoryCreate
): Promise<SearchHistoryResponse> => {
  const response = await apiClient.post(
    "/api/insert-search-history",
    scrapingParams
  );
  return response.data;
};
