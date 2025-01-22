import React, { useState, useEffect } from "react";
import { SearchHistoryCreate, SearchHistoryResponse } from "../../types";
import { useRootStore } from "../../store/RootStoreContext";
import { observer } from "mobx-react-lite";
import { Spinner } from "../Spinner";
import KeywordInput from "./KeywordInput";
import CountrySelect from "./CountrySelect";

export const ScrapingFormModal: React.FC<{
  initialData?: SearchHistoryResponse | null;
}> = observer(({ initialData }) => {
  const { searchHistoryStore, projectStore, uiStore } = useRootStore();
  const [searchMode, setSearchMode] = useState<"country" | "city">("city");
  const [scrapingParams, setScrapingParams] = useState<SearchHistoryCreate>({
    city: initialData?.city || "",
    countryCode: initialData?.countryCode || "",
    projectId: projectStore.selectedProject?.id || 0,
    maxCrawledPlacesPerSearch: initialData?.maxCrawledPlacesPerSearch || 0,
    locationQuery: initialData?.locationQuery || "",
    searchStringsArray: initialData?.searchStringsArray || [],
  });

  useEffect(() => {
    if (initialData?.city && initialData?.countryCode) {
      setSearchMode("city");
    } else if (initialData?.countryCode && !initialData?.city) {
      setSearchMode("country");
    }
  }, [initialData]);

  const handleSearchModeChange = (newMode: "country" | "city") => {
    setSearchMode(newMode);
    // Preserve existing values when switching modes
    setScrapingParams((prev) => ({
      ...prev,
      city: newMode === "city" ? prev.city : "",
      countryCode: newMode === "city" ? "" : prev.countryCode,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const params = {
      ...scrapingParams,
      city: scrapingParams.city || undefined,
      countryCode: scrapingParams.countryCode || undefined,
      locationQuery: scrapingParams.locationQuery || undefined,
    };

    // Ensure arrays are initialized even if empty
    params.searchStringsArray = params.searchStringsArray || [];

    // Validate based on search mode
    if (searchMode === "country") {
      if (!params.countryCode) {
        alert("Country is required for country-wide search.");
        return;
      }
      params.city = "";
      params.locationQuery = "";
    } else if (searchMode === "city") {
      if (!params.city || !params.countryCode) {
        alert("Both city and country are required for city search.");
        return;
      }
      params.locationQuery = "";
    } else if (searchMode === "location") {
      if (!params.locationQuery) {
        alert("Location query is required (format: City,Country).");
        return;
      }
      params.city = "";
      params.countryCode = "";
    }

    if (
      !params.maxCrawledPlacesPerSearch ||
      params.maxCrawledPlacesPerSearch <= 0
    ) {
      alert("Please enter a valid number for Max Places Per Search.");
      return;
    }

    try {
      searchHistoryStore.loading = true;
      await searchHistoryStore.insertSearchHistory(params);
      uiStore.isModalOpen = false;
    } catch (err) {
      console.error("handleSave Error:", err);
      alert("Operation failed.");
    } finally {
      searchHistoryStore.loading = false;
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
      <div className="bg-white p-6 rounded-lg w-full max-w-lg">
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
              <label className="flex items-center">
                <input
                  type="radio"
                  value="country"
                  checked={searchMode === "country"}
                  onChange={() => handleSearchModeChange("country")}
                  className="mr-2"
                />
                Country-wide
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="city"
                  checked={searchMode === "city"}
                  onChange={() => handleSearchModeChange("city")}
                  className="mr-2"
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
              defaultValue={100}
              onBlur={(e) => {
                const value = Number(e.target.value);
                setScrapingParams({
                  ...scrapingParams,
                  maxCrawledPlacesPerSearch: value > 0 ? value : 9999999,
                });
              }}
              className="mt-1 block w-full p-2 border rounded"
              min="1"
              required
            />
          </div>

          {/* Search Parameters */}
          <>
            {searchMode === "city" && (
              <div>
                <label className="block text-sm font-medium">City</label>
                <input
                  type="text"
                  value={scrapingParams.city}
                  onChange={(e) =>
                    setScrapingParams({
                      ...scrapingParams,
                      city: e.target.value,
                    })
                  }
                  className="mt-1 block w-full p-2 border rounded"
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
                    setScrapingParams({
                      ...scrapingParams,
                      countryCode: newCountryCode,
                    })
                  }
                />
              </div>
            )}
          </>

          <div>
            <label className="block text-sm font-medium">Search Keywords</label>
            <KeywordInput
              keywords={scrapingParams.searchStringsArray || []}
              onChange={(newKeywords) => {
                setScrapingParams({
                  ...scrapingParams,
                  searchStringsArray: newKeywords,
                });
              }}
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => (uiStore.isModalOpen = false)}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});
