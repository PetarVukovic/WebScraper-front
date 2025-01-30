import React, { useState, useCallback } from "react";
import { observer } from "mobx-react-lite";
import { runInAction } from "mobx";
import { SearchHistoryCreate, SearchHistoryResponse } from "../../types";
import { useRootStore } from "../../store/RootStoreContext";
import { Spinner } from "../Spinner";
import KeywordInput from "./KeywordInput";
import CountrySelect from "./CountrySelect";

export const ScrapingFormModal: React.FC<{
  initialData?: SearchHistoryResponse | null;
}> = observer(({ initialData }) => {
  const { searchHistoryStore, projectStore, uiStore } = useRootStore();
  const [searchMode, setSearchMode] = useState<"country" | "city">(
    initialData?.city && initialData?.countryCode ? "city" : "country"
  );

  const [scrapingParams, setScrapingParams] = useState<SearchHistoryCreate>({
    city: initialData?.city || "",
    countryCode: initialData?.countryCode || "",
    projectId: projectStore.selectedProject?.id || 0,
    maxCrawledPlacesPerSearch: initialData?.maxCrawledPlacesPerSearch || 100,
    locationQuery: initialData?.locationQuery || "",
    searchStringsArray: initialData?.searchStringsArray || [],
  });

  const handleSearchModeChange = useCallback((newMode: "country" | "city") => {
    setSearchMode(newMode);
    setScrapingParams((prev) => ({
      ...prev,
      city: newMode === "city" ? prev.city : "",
      countryCode: newMode === "city" ? "" : prev.countryCode,
    }));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const params = {
      ...scrapingParams,
      city: scrapingParams.city || undefined,
      countryCode: scrapingParams.countryCode || undefined,
      locationQuery: scrapingParams.locationQuery || undefined,
      searchStringsArray: scrapingParams.searchStringsArray || [],
    };

    if (searchMode === "country" && !params.countryCode) {
      alert("Country is required for country-wide search.");
      return;
    }

    if (searchMode === "city" && (!params.city || !params.countryCode)) {
      alert("Both city and country are required for city search.");
      return;
    }

    if (
      !params.maxCrawledPlacesPerSearch ||
      params.maxCrawledPlacesPerSearch <= 0
    ) {
      alert("Please enter a valid number for Max Places Per Search.");
      return;
    }

    try {
      runInAction(() => {
        searchHistoryStore.loading = true;
      });

      await searchHistoryStore.insertSearchHistory(params);

      runInAction(() => {
        uiStore.isModalOpen = false;
      });
    } catch (err) {
      console.error("handleSave Error:", err);
      alert("Operation failed.");
    } finally {
      runInAction(() => {
        searchHistoryStore.loading = false;
      });
    }
  };

  if (!uiStore.isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {searchHistoryStore.loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-25">
          <Spinner />
        </div>
      )}
      <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg transition-transform transform scale-100">
        <h2 className="text-lg font-semibold mb-4">
          {uiStore.modalMode === "add" ? "Add New" : "Edit"} Scraping Parameters
        </h2>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Search Mode Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Search Mode
            </label>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="country"
                  checked={searchMode === "country"}
                  onChange={() => handleSearchModeChange("country")}
                  className="mr-2 accent-blue-500"
                />
                Country-wide
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="city"
                  checked={searchMode === "city"}
                  onChange={() => handleSearchModeChange("city")}
                  className="mr-2 accent-blue-500"
                />
                City
              </label>
            </div>
          </div>

          {/* Max Places Input */}
          <div>
            <label className="block text-sm font-medium">
              Max Places Per Search
            </label>
            <input
              type="number"
              value={scrapingParams.maxCrawledPlacesPerSearch || ""} // ✅ Ako nema vrednosti, prikaži prazan string
              onChange={(e) => {
                const val = e.target.value;

                // ✅ Omogućava da polje bude potpuno prazno
                if (val === "") {
                  setScrapingParams((prev) => ({
                    ...prev,
                    maxCrawledPlacesPerSearch: 0, // Ili null, zavisno od backend-a
                  }));
                  return;
                }

                // ✅ Dozvoljava bilo koji broj bez trenutne validacije
                setScrapingParams((prev) => ({
                  ...prev,
                  maxCrawledPlacesPerSearch: Number(val),
                }));
              }}
              onBlur={(e) => {
                const value = Number(e.target.value);

                // ✅ Ako je polje prazno, ostavi prazno, ne postavljaj na 0 ili 1
                setScrapingParams((prev) => ({
                  ...prev,
                  maxCrawledPlacesPerSearch:
                    isNaN(value) || value <= 0 ? 0 : value,
                }));
              }}
              className="mt-1 block w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              placeholder="Enter max places..."
              min="1"
            />
          </div>

          {/* Search Parameters */}
          {searchMode === "city" && (
            <div>
              <label className="block text-sm font-medium">City</label>
              <input
                type="text"
                value={scrapingParams.city}
                onChange={(e) =>
                  setScrapingParams((prev) => ({
                    ...prev,
                    city: e.target.value,
                  }))
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Berlin"
                required
              />
            </div>
          )}
          {(searchMode === "city" || searchMode === "country") && (
            <div>
              <label className="block text-sm font-medium">Country</label>
              <CountrySelect
                value={scrapingParams.countryCode}
                onChange={(newCountryCode) =>
                  setScrapingParams((prev) => ({
                    ...prev,
                    countryCode: newCountryCode,
                  }))
                }
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium">Search Keywords</label>
            <KeywordInput
              keywords={scrapingParams.searchStringsArray!}
              onChange={(newKeywords) =>
                setScrapingParams((prev) => ({
                  ...prev,
                  searchStringsArray: newKeywords,
                }))
              }
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => runInAction(() => (uiStore.isModalOpen = false))}
              className="px-4 py-2 border rounded hover:bg-gray-100 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition-all"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});
