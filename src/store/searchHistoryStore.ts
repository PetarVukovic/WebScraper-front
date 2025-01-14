import { makeAutoObservable, runInAction } from "mobx";
import type { SearchHistoryCreate, SearchHistoryResponse } from "../types";
import {
  deleteSearchHistory,
  fetchSearchHistory,
  updateSearchHistory,
  insertSearchHistory,
} from "../api/search_history_api";

class SearchHistoryStore {
  searchHistoryList: SearchHistoryResponse[] = [];
  rowClicked: SearchHistoryResponse | null = null;
  searchHistoryCreate: SearchHistoryResponse | null = null;
  loading = false;
  error: string | null = null;
  modalMode: "add" | "edit" = "add";

  constructor() {
    makeAutoObservable(this);
  }

  async loadSearchHistory(
    projectId: number
  ): Promise<SearchHistoryResponse[] | null> {
    this.loading = true;
    this.error = null;
    console.log(
      "[loadSearchHistory] Fetching search history for projectId:",
      projectId
    );
    try {
      const data = await fetchSearchHistory(projectId);

      runInAction(() => {
        this.searchHistoryList = data ? (data as SearchHistoryResponse[]) : [];
      });

      return data as SearchHistoryResponse[];
    } catch (err) {
      runInAction(() => {
        this.error = "Failed to load search history.";
      });
      console.error("[loadSearchHistory] Error:", err);
      return null;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async updateSearchHistory(params: SearchHistoryCreate): Promise<void> {
    this.loading = true;
    this.error = null;
    try {
      const response = await updateSearchHistory(params);
      console.log("[updateSearchHistory] Response data:", response);
      this.searchHistoryList = this.searchHistoryList.map((item) =>
        item.id === response.id ? { ...item, ...response } : item
      );
    } catch (err) {
      runInAction(() => {
        this.error = "Failed to update search history.";
      });
      console.error("[updateSearchHistory] Error:", err);
      throw err;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async deleteSearchHistory(
    id: string,
    project_id: number
  ): Promise<SearchHistoryResponse[]> {
    this.loading = true;
    this.error = null;
    console.log("[deleteSearchHistory] Deleting search history with id:", id);
    try {
      const response = await deleteSearchHistory(id, project_id);
      console.log("[deleteSearchHistory] Response data:", response);
      this.searchHistoryList = response;
    } catch (err) {
      runInAction(() => {
        this.error = "Failed to delete search history.";
      });
      console.error("[deleteSearchHistory] Error:", err);
      throw err;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
      return this.searchHistoryList;
    }
  }

  async insertSearchHistory(
    scrapingParams: SearchHistoryCreate
  ): Promise<void> {
    this.loading = true;
    this.error = null;
    console.log(
      "[insertSearchHistory] Starting new search with params:",
      scrapingParams
    );
    try {
      const response = await insertSearchHistory(scrapingParams);
      console.log("[insertSearchHistory] Response data:", response);
      runInAction(() => {
        this.searchHistoryList.push(response);
      });
    } catch (err) {
      runInAction(() => {
        this.error = "Failed to insert search history.";
      });
      console.error("[insertSearchHistory] Error:", err);
      throw err;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  getSearchHistoryById(id: number): SearchHistoryResponse | null {
    console.log("[getSearchHistoryById] Searching for id:", id);

    return (
      this.searchHistoryList.find((history) => history.projectId === id) || null
    );
  }
}

export default SearchHistoryStore;
