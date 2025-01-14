import { makeAutoObservable, runInAction } from "mobx";
import { runGoogleMapsScraper } from "../api/google_maps_api";
import { SearchHistoryResponse } from "../types";

class GoogleMapsStore {
  loading = false;
  error: string | null = null;
  successMessage: string | null = null; // Dodan success handler
  emptyResponse: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  async runGoogleMapsScraping(params: SearchHistoryResponse) {
    this.loading = true;
    this.error = null;
    this.successMessage = null;

    try {
      console.log(
        "[runGoogleMapsScraping] Starting Google Maps scraping...",
        params
      );
      const response = await runGoogleMapsScraper(params);
      runInAction(() => {
        this.loading = false;
        if (response.status === "success") {
          this.successMessage = response.message;
        } else {
          this.error = response.message || "An unknown error occurred.";
        }
      });
    } catch (err) {
      runInAction(() => {
        this.loading = false;
        this.error = (err as string) || "Scraping failed. Please try again.";
      });
    }
  }
}
export default GoogleMapsStore;
