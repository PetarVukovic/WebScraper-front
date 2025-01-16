import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useRootStore } from "../../store/RootStoreContext";
import { SearchHistoryResponse } from "../../types";
import ErrorModal from "../modals/ErrorModal";
import { ScrapingFormModal } from "../modals/ScrapingFormModal";
import { Spinner } from "../Spinner";
import InfoModal from "../modals/InfoModal";

export const SearchHistoryTable: React.FC = observer(() => {
  const { searchHistoryStore, projectStore, uiStore } = useRootStore();
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const toggleInfoModal = () => setIsInfoModalOpen(!isInfoModalOpen);

  const handleModalClose = () => {
    searchHistoryStore.error = null;
    uiStore.isModalOpen = false;
  };

  const handleRowClick = (entry: SearchHistoryResponse) => {
    searchHistoryStore.rowClicked = entry;
  };
  const handleDeleteClick = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      const newSearchHistoryList = await searchHistoryStore.deleteSearchHistory(
        id,
        projectStore.selectedProject!.id
      );
      searchHistoryStore.searchHistoryList = newSearchHistoryList;
    } catch (err) {
      console.error("Failed to delete search history:", err);
      searchHistoryStore.error = "Failed to delete search history.";
    }
  };

  useEffect(() => {
    if (!projectStore.selectedProject) return;
    searchHistoryStore.loadSearchHistory(projectStore.selectedProject.id);
  }, [projectStore.selectedProject, projectStore.projects]);

  const renderSearchScope = (entry: SearchHistoryResponse) => {
    if (entry.locationQuery) {
      // Ako je korisnik odabrao "Location Query"
      return (
        <div className="flex flex-col">
          <span className="font-medium">Location:</span>
          <span>{entry.locationQuery}</span>
          <span className="text-sm text-gray-500">(Location query)</span>
        </div>
      );
    }

    if (entry.city && entry.countryCode) {
      // Ako je korisnik odabrao specifičan grad unutar zemlje
      return (
        <div className="flex flex-col">
          <span className="font-medium">Location:</span>
          <span>{`${entry.city}, ${entry.countryCode}`}</span>
          <span className="text-sm text-gray-500">(City and country)</span>
        </div>
      );
    }

    if (entry.countryCode) {
      // Ako je korisnik odabrao cijelu državu
      return (
        <div className="flex flex-col">
          <span className="font-medium">Location:</span>
          <span>{entry.countryCode}</span>
          <span className="text-sm text-gray-500">(Full country)</span>
        </div>
      );
    }

    // Default prikaz ako ništa nije specificirano
    return <span className="text-gray-500">No location specified</span>;
  };

  return (
    <div className="container mx-auto px-4">
      {searchHistoryStore.loading && <Spinner />}
      <ErrorModal error={searchHistoryStore.error} onClose={handleModalClose} />
      {uiStore.isModalOpen && (
        <ScrapingFormModal initialData={searchHistoryStore.rowClicked} />
      )}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Search History</h3>
        <button
          onClick={toggleInfoModal}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
        >
          More Info
        </button>
      </div>

      <InfoModal isOpen={isInfoModalOpen} onClose={toggleInfoModal} />

      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <h3 className="text-lg font-semibold mb-2">Search Options Guide</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Country-wide Search:</strong> Enter only the country name
            (e.g., "Germany") to search the entire country
          </li>
          <li>
            <strong>City-specific Search:</strong>
            <ul className="list-circle pl-5 mt-1">
              <li>Using city and country fields separately</li>
            </ul>
          </li>

          <li>
            <strong>Max Crawled Places:</strong>
            <ul className="list-circle pl-5 mt-1">
              <li>
                This is the maximum number of results you will obtain for each
                search term or URL. A higher number will take longer to scrape.
                If you want to scrape all places available, set this value to
                9999999.
              </li>
            </ul>
          </li>
        </ul>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Max Places
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location Info
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Search Keywords
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categories
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {searchHistoryStore.searchHistoryList.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  No search history found.
                </td>
              </tr>
            ) : (
              searchHistoryStore.searchHistoryList.map((entry) => (
                <tr
                  key={entry.id}
                  className={`hover:bg-gray-50 cursor-pointer ${
                    searchHistoryStore.rowClicked?.id === entry.id
                      ? "bg-blue-50"
                      : ""
                  }`}
                  onClick={() => handleRowClick(entry)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {entry.maxCrawledPlacesPerSearch}
                  </td>
                  <td className="px-6 py-4">{renderSearchScope(entry)}</td>
                  <td className="px-6 py-4">
                    {entry.searchStringsArray?.join(", ") || "No search terms"}
                  </td>
                  <td className="px-6 py-4">
                    {entry.categoryFilterWords?.join(", ") || "No categories"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(entry.createdAt).toLocaleString() ||
                      "Invalid Date"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={(e) => handleDeleteClick(e, entry.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
});
