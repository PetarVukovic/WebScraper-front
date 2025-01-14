import { toJS } from "mobx";
import { SearchHistoryResponse } from "../types";
import apiClient from "./auth_api";

export const runGoogleMapsScraper = async (
  row: SearchHistoryResponse
): Promise<{ status: string; message: string }> => {
  const payload = {
    categoryFilterWords: toJS(row.categoryFilterWords || []), // Lista stringova
    locationQuery: row.locationQuery?.trim() || undefined, // Trimanje praznih stringova, šalje undefined ako je prazno
    maxCrawledPlacesPerSearch: row.maxCrawledPlacesPerSearch || 0, // Broj
    searchStringsArray: toJS(row.searchStringsArray || []), // Lista stringova
    search_history_id: row.id.toString(), // String
    city: row.city || undefined, // Opcionalno
    country: row.countryCode || undefined, // Opcionalno
  };
  console.log(
    "[runGoogleMapsScraper] Sending payload:",
    JSON.stringify(payload, null, 2)
  );
  const response = await apiClient.post("/api/run-scraping", payload);
  return response.data;
};
