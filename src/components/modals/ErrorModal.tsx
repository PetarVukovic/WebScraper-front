import React from "react";

type ErrorModalProps = {
  error: string | null;
  onClose: () => void;
};

const ErrorModal: React.FC<ErrorModalProps> = ({ error, onClose }) => {
  if (!error) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
        <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
        <p className="text-gray-700 mb-6">{error}</p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
