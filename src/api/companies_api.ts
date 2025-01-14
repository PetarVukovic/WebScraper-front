import { CompaniesOutput, PaginatedResponse } from "../types";
import apiClient from "./auth_api";

export const fetchCompaniesBySearchHistory = async (
  searchHistoryId: string,
  page: number = 0,
  pageSize: number = 10
): Promise<PaginatedResponse<CompaniesOutput>> => {
  const response = await apiClient.get(
    `/api/companies?search_history_id=${searchHistoryId}&page=${page}&page_size=${pageSize}`
  );
  console.log("Ovo su companies", response.data);
  return response.data;
};
