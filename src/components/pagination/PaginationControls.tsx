import React from "react";

export const PaginationControls: React.FC<{
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}> = ({ currentPage, totalPages, onPrev, onNext }) => (
  <div className="flex gap-4 mt-4 items-center justify-center">
    <button
      className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
      onClick={onPrev}
      disabled={currentPage === 0}
    >
      Previous
    </button>
    <span>
      Page {currentPage + 1} of {totalPages}
    </span>
    <button
      className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
      onClick={onNext}
      disabled={currentPage >= totalPages - 1}
    >
      Next
    </button>
  </div>
);
