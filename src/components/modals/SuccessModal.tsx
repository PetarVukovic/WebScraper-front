import React from "react";

interface SuccessModalProps {
  message: string | null;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-sm">
        <h2 className="text-green-600 font-bold mb-2">Success</h2>
        <p>{message}</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
