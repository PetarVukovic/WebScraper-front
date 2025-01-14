import React, { useState, useEffect } from "react";
import { SearchHistoryCreate, SearchHistoryResponse } from "../../types";
import { useRootStore } from "../../store/RootStoreContext";
import { observer } from "mobx-react-lite";
import { Spinner } from "../Spinner";

export const ScrapingFormModal: React.FC<{
  initialData?: SearchHistoryResponse | null;
}> = observer(({ initialData }) => {
  const { searchHistoryStore, projectStore, uiStore } = useRootStore();
  const [searchMode, setSearchMode] = useState<"country" | "city" | "location">(
    "city"
  );
  const [scrapingParams, setScrapingParams] = useState<SearchHistoryCreate>({
    city: initialData?.city || "",
    countryCode: initialData?.countryCode || "",
    projectId: projectStore.selectedProject?.id || 0,
    maxCrawledPlacesPerSearch: initialData?.maxCrawledPlacesPerSearch || 0,
    locationQuery: initialData?.locationQuery || "",
    categoryFilterWords: initialData?.categoryFilterWords || [],
    searchStringsArray: initialData?.searchStringsArray || [],
  });

  useEffect(() => {
    if (initialData?.locationQuery) {
      setSearchMode("location");
    } else if (initialData?.city && initialData?.countryCode) {
      setSearchMode("city");
    } else if (initialData?.countryCode && !initialData?.city) {
      setSearchMode("country");
    }
  }, [initialData]);
  const handleInputChange = (e, fieldName: string) => {
    const inputValue = e.target.value;

    setScrapingParams({
      ...scrapingParams,
      [fieldName]: inputValue.split(","), // Razdvajanje prema zarezima
    });
  };
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const params = {
      ...scrapingParams,
      city: scrapingParams.city || undefined,
      countryCode: scrapingParams.countryCode || undefined,
      locationQuery: scrapingParams.locationQuery || undefined,
    };
    console.log(params);

    // Ensure arrays are initialized even if empty
    params.searchStringsArray = params.searchStringsArray || [];
    params.categoryFilterWords = params.categoryFilterWords || [];

    // Validate based on search mode
    if (searchMode === "country") {
      if (!params.countryCode) {
        alert("Country is required for country-wide search.");
        return;
      }
      params.city = ""; // Clear city for country-wide search
      params.locationQuery = ""; // Clear location query
    } else if (searchMode === "location") {
      if (!params.locationQuery) {
        alert("Location query is required (format: City,Country).");
        return;
      }
      // Clear city and country when using location query
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
                  onChange={(e) => setSearchMode("country")}
                  className="mr-2"
                />
                Country-wide
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
              defaultValue={9999999} // Postavlja defaultnu vrijednost
              onBlur={(e) => {
                const value = Number(e.target.value);
                setScrapingParams({
                  ...scrapingParams,
                  maxCrawledPlacesPerSearch: value > 0 ? value : 9999999, // Osigurava valjanost broja
                });
              }}
              className="mt-1 block w-full p-2 border rounded"
              min="1" // Ograničava minimalni unos
              required
            />
          </div>

          {/* Location Inputs based on mode */}
          {searchMode === "location" ? (
            <div>
              <label className="block text-sm font-medium">
                Location Query
              </label>
              <input
                type="text"
                value={scrapingParams.locationQuery}
                onChange={(e) =>
                  setScrapingParams({
                    ...scrapingParams,
                    locationQuery: e.target.value,
                  })
                }
                className="mt-1 block w-full p-2 border rounded"
                placeholder="e.g., Berlin,Germany"
                required
              />
              <p className="text-sm text-gray-500 mt-1">Format: City,Country</p>
            </div>
          ) : (
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
                    required={searchMode === "city"}
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium">Country</label>
                <input
                  type="text"
                  value={scrapingParams.countryCode}
                  onChange={(e) =>
                    setScrapingParams({
                      ...scrapingParams,
                      countryCode: e.target.value,
                    })
                  }
                  className="mt-1 block w-full p-2 border rounded"
                  placeholder="e.g., Germany"
                  required
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium">Search Keywords</label>
            <input
              type="text"
              value={scrapingParams.searchStringsArray?.join(", ")}
              onChange={(e) => handleInputChange(e, "searchStringsArray")}
              className="mt-1 block w-full p-2 border rounded"
              placeholder="e.g., restaurant, hotel"
            />
            <p className="text-sm text-gray-500 mt-1">
              Separate multiple keywords with commas
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium">
              Category Filter Words
            </label>
            <select
              multiple
              value={scrapingParams.categoryFilterWords}
              onChange={(e) => {
                const selectedOptions = Array.from(
                  e.target.selectedOptions
                ).map((option) => option.value);
                setScrapingParams({
                  ...scrapingParams,
                  categoryFilterWords: selectedOptions,
                });
              }}
              className="mt-1 block w-full p-2 border rounded"
            >
              <option value="software company">Software Company</option>
              <option value="marketing agency">Marketing Agency</option>
              <option value="e commerce agency">eCommerce Agency</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">
              Hold <code>Ctrl</code> (or <code>Cmd</code> on Mac) to select
              multiple options.
            </p>

            {/* Prikaz odabranih kategorija */}
            {scrapingParams.categoryFilterWords!.length > 0 && (
              <div className="flex flex-wrap mt-2">
                {scrapingParams.categoryFilterWords?.map((category, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded mr-2 mb-2"
                  >
                    {category}
                  </span>
                ))}
              </div>
            )}
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
