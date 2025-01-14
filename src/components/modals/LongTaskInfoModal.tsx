import React from "react";

type LongTaskInfoModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const LongTaskInfoModal: React.FC<LongTaskInfoModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
        <h2 className="text-2xl font-semibold mb-4">
          How Long Tasks Are Handled
        </h2>
        <p className="text-gray-700 mb-4">
          Currently, the application processes tasks synchronously. This means
          that while one task is running, no other actions can be performed.
        </p>
        <p className="text-gray-700 mb-4">
          For example, while scraping data, you won’t be able to navigate to
          other components or perform other operations until the task is
          completed.
        </p>
        <p className="text-gray-700 mb-4">
          This approach ensures that each task is executed fully without
          interruptions. Tasks may take several minutes, so please be patient.
        </p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default LongTaskInfoModal;
