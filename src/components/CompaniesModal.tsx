import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useRootStore } from "../store/RootStoreContext";
import { CompaniesOutput } from "../types";
import { PaginationControls } from "./pagination/PaginationControls";

type DetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
};

const DetailModal: React.FC<DetailModalProps> = ({
  isOpen,
  onClose,
  title,
  content,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>

        <div className="p-6 overflow-y-auto flex-grow">
          <div className="whitespace-pre-wrap">{content}</div>
        </div>

        <div className="p-6 border-t">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

interface CompaniesModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchHistoryId: string;
  exportToCSV: () => void;
}

export const CompaniesModal: React.FC<CompaniesModalProps> = observer(
  ({ isOpen, onClose, searchHistoryId, exportToCSV }) => {
    const { companiesStore } = useRootStore();
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [detailModal, setDetailModal] = useState<{
      isOpen: boolean;
      title: string;
      content: string;
    }>({
      isOpen: false,
      title: "",
      content: "",
    });

    useEffect(() => {
      if (isOpen && searchHistoryId) {
        companiesStore.fetchCompanies(searchHistoryId, 0, 5).then(() => {
          setCurrentPage(companiesStore.currentPage);
          setTotalPages(companiesStore.totalPages);
        });
      }
    }, [isOpen, searchHistoryId, companiesStore]);

    const handlePrevPage = () => {
      if (currentPage > 0) {
        companiesStore
          .fetchCompanies(searchHistoryId, currentPage - 1, 5)
          .then(() => {
            setCurrentPage(companiesStore.currentPage);
          });
      }
    };

    const handleNextPage = () => {
      if (currentPage < totalPages - 1) {
        companiesStore
          .fetchCompanies(searchHistoryId, currentPage + 1, 5)
          .then(() => {
            setCurrentPage(companiesStore.currentPage);
          });
      }
    };

    const truncateText = (text: string, maxLength: number) => {
      if (!text || text.length <= maxLength) return text;
      return text.substring(0, maxLength) + "...";
    };

    const handleShowMore = (title: string, content: string) => {
      setDetailModal({
        isOpen: true,
        title,
        content,
      });
    };

    const handleRowClick = (website: string) => {
      companiesStore.toggleSelection(website);
    };

    const handleSendSelected = async () => {
      try {
        await companiesStore.sendSelectedCompanies();
        // Optional: Add success toast/notification here
      } catch (error) {
        // Optional: Add error toast/notification here
        console.error("Failed to send companies:", error);
      }
    };

    if (!isOpen) return null;

    return (
      <>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-hidden">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col m-4">
            <div className="p-6 border-b">
              <h3 className="text-xl font-semibold">Companies</h3>
              <div className="flex justify-between items-center mt-4">
                <div className="flex gap-2">
                  <button
                    onClick={exportToCSV}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                  >
                    Export to CSV
                  </button>
                  <button
                    onClick={handleSendSelected}
                    disabled={companiesStore.selectedCompanies.size === 0}
                    className={`px-4 py-2 rounded transition-colors ${
                      companiesStore.selectedCompanies.size > 0
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Send Selected ({companiesStore.selectedCompanies.size})
                  </button>
                </div>
                <button
                  onClick={onClose}
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded transition-colors"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="flex-grow overflow-auto p-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse table-fixed">
                  <thead className="bg-gray-50">
                    <tr>
                      {/* Website column - narrow, fixed width */}
                      <th className="border px-3 py-2 text-left sticky top-0 bg-gray-50 w-[180px]">
                        Website
                      </th>
                      {/* Email column - medium width */}
                      <th className="border px-3 py-2 text-left sticky top-0 bg-gray-50 w-[200px]">
                        Email
                      </th>
                      {/* Qualified column - smallest, fixed width */}
                      <th className="border px-3 py-2 text-center sticky top-0 bg-gray-50 w-[100px]">
                        Qualified
                      </th>
                      {/* Context Data - flexible width */}
                      <th className="border px-3 py-2 text-left sticky top-0 bg-gray-50 min-w-[200px] w-1/4">
                        Context Data
                      </th>
                      {/* Generated Email - flexible width */}
                      <th className="border px-3 py-2 text-left sticky top-0 bg-gray-50 min-w-[200px] w-1/4">
                        Generated Email
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {companiesStore.companiesList.length > 0 ? (
                      companiesStore.companiesList.map(
                        (company: CompaniesOutput, index: number) => (
                          <tr
                            key={index}
                            onClick={() => handleRowClick(company.website)}
                            className={`hover:bg-gray-50 cursor-pointer ${
                              companiesStore.isSelected(company.website)
                                ? "bg-blue-50"
                                : ""
                            }`}
                          >
                            <td className="border px-3 py-2 truncate">
                              <div className="truncate max-w-[180px]">
                                {company.website || "N/A"}
                              </div>
                            </td>
                            <td className="border px-4 py-2 break-words whitespace-pre-wrap">
                              <div className="relative">
                                {(() => {
                                  if (
                                    !company.email ||
                                    company.email.length === 0
                                  )
                                    return "N/A";
                                  return (
                                    <>
                                      {company.email[0]}{" "}
                                      {/* Prikazuje prvi email */}
                                      {company.email.length > 1 && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleShowMore(
                                              "Email Addresses",
                                              company.email.join(", ") // Spajanje emailova u jedan string za prikaz u modalu
                                            );
                                          }}
                                          className="text-blue-500 hover:text-blue-700 ml-2"
                                        >
                                          Show More ▼
                                        </button>
                                      )}
                                    </>
                                  );
                                })()}
                              </div>
                            </td>
                            <td className="border px-4 py-2 text-center">
                              <span
                                className={`px-2 py-1 rounded ${
                                  company.is_qualified
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {company.is_qualified ? "Yes" : "No"}
                              </span>
                            </td>
                            <td className="border px-4 py-2 break-words whitespace-pre-wrap">
                              <div className="relative">
                                {truncateText(
                                  company.context_data || "N/A",
                                  100
                                )}
                                {company.context_data &&
                                  company.context_data.length > 100 && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleShowMore(
                                          "Context Data",
                                          company.context_data || ""
                                        );
                                      }}
                                      className="text-blue-500 hover:text-blue-700 ml-2"
                                    >
                                      Show More ▼
                                    </button>
                                  )}
                              </div>
                            </td>
                            <td className="border px-4 py-2 break-words whitespace-pre-wrap">
                              <div className="relative">
                                {truncateText(
                                  company.generated_email || "N/A",
                                  100
                                )}
                                {company.generated_email &&
                                  company.generated_email.length > 100 && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleShowMore(
                                          "Generated Email",
                                          company.generated_email || ""
                                        );
                                      }}
                                      className="text-blue-500 hover:text-blue-700 ml-2"
                                    >
                                      Show More ▼
                                    </button>
                                  )}
                              </div>
                            </td>
                          </tr>
                        )
                      )
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="border px-4 py-8 text-center text-gray-500"
                        >
                          No companies to display.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-6 border-t">
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPrev={handlePrevPage}
                onNext={handleNextPage}
              />
            </div>
          </div>
        </div>

        <DetailModal
          isOpen={detailModal.isOpen}
          onClose={() => setDetailModal({ ...detailModal, isOpen: false })}
          title={detailModal.title}
          content={detailModal.content}
        />
      </>
    );
  }
);
