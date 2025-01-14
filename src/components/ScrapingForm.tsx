import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { FaPlus } from "react-icons/fa";
import { SearchHistoryTable } from "./tables/SearchHistoryTable";
import { CompaniesModal } from "./CompaniesModal";
import { useRootStore } from "../store/RootStoreContext";
import { Spinner } from "./Spinner";
import { ScrapingFormModal } from "./modals/ScrapingFormModal";
import { saveAs } from "file-saver";
import ErrorModal from "./modals/ErrorModal";
import SuccessModal from "./modals/SuccessModal";
import LongTaskInfoModal from "./modals/LongTaskInfoModal";

export const ScrapingForm: React.FC = observer(() => {
  const { googleMapsStore, searchHistoryStore, companiesStore, uiStore } =
    useRootStore();
  const [isScraping, setIsScraping] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const startScraping = async () => {
    if (!searchHistoryStore.rowClicked) {
      setError("Please select a row to start scraping.");
      return;
    }
    setIsScraping(true);
    try {
      await googleMapsStore.runGoogleMapsScraping(
        searchHistoryStore.rowClicked
      );
      if (googleMapsStore.successMessage) {
        setSuccessMessage(googleMapsStore.successMessage);
      }
    } catch (err) {
      console.error("Error starting scraping:", err);
      setError("Scraping failed. Please check your network or input data.");
    } finally {
      setIsScraping(false);
    }
  };

  const exportToCSV = () => {
    try {
      const headers = [
        "Website",
        "Keywords",
        "Qualified",
        "Context Data",
        "Generated Email",
      ];

      const csvRows = companiesStore.companiesList.map((company) => [
        company.website || "N/A",
        company.keywords_found?.join(", ") || "None",
        company.is_qualified ? "Yes" : "No",
        company.context_data || "N/A",
        company.generated_email || "N/A",
      ]);

      const csvContent = [headers, ...csvRows]
        .map((row) => row.map((value) => `"${value}"`).join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, "companies_data.csv");
    } catch (err) {
      console.error("Failed to export CSV:", err);
      setError("Failed to export CSV. Please try again.");
    }
  };

  const handleCloseModal = () => {
    console.log(
      "Closing modal, companies before reset:",
      companiesStore.companiesList
    );
    setModalOpen(false);
    //companiesStore.reset(); // This might be clearing data too aggressively
  };

  return (
    <div className="p-6 bg-white border rounded shadow mt-6 relative">
      <SearchHistoryTable />

      <div className="flex flex-wrap gap-4 mt-4 items-center">
        <button
          onClick={() => setIsInfoModalOpen(true)} // Otvori LongTaskInfoModal
          className="px-4 py-2 bg-gray-500 text-white font-semibold rounded hover:bg-gray-600 transition-colors"
        >
          How Long Tasks Work
        </button>
        <button
          onClick={() => {
            uiStore.modalMode = "add";
            uiStore.isModalOpen = true;
          }}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 flex items-center gap-2 transition-colors"
        >
          <FaPlus /> Add New
        </button>
        <button
          className={`px-4 py-2 ${
            isScraping ? "bg-yellow-400" : "bg-yellow-500 hover:bg-yellow-600"
          } text-white font-semibold rounded transition-colors`}
          onClick={startScraping}
          disabled={isScraping}
        >
          {isScraping ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              Scraping...
            </span>
          ) : (
            "Start Google Maps Scraping"
          )}
        </button>
        <button
          onClick={() => {
            console.log("Button clicked", {
              rowClicked: searchHistoryStore.rowClicked,
              id: searchHistoryStore.rowClicked?.id,
            });
            setModalOpen(true);
            if (searchHistoryStore.rowClicked) {
              companiesStore.fetchCompanies(
                searchHistoryStore.rowClicked.id,
                0,
                5
              );
            }
          }}
          disabled={!searchHistoryStore.rowClicked}
          className="px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-blue-600 flex items-center gap-2 transition-colors"
        >
          Show Companies
        </button>
      </div>

      {googleMapsStore.loading && <Spinner />}
      <SuccessModal
        message={successMessage}
        onClose={() => setSuccessMessage(null)}
      />
      <ErrorModal error={error} onClose={() => setError(null)} />
      <CompaniesModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        searchHistoryId={searchHistoryStore.rowClicked?.id || ""}
        exportToCSV={exportToCSV}
      />

      {uiStore.isModalOpen && <ScrapingFormModal />}
      <LongTaskInfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />
    </div>
  );
});
