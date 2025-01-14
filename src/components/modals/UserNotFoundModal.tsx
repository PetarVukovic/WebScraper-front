import React from "react";

type UserNotFoundModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onRegister: () => void;
};

const UserNotFoundModal: React.FC<UserNotFoundModalProps> = ({
  isOpen,
  onClose,
  onRegister,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold mb-4 text-red-600">
          User Not Found
        </h2>
        <p className="text-gray-700 mb-6">
          The user does not exist in our system. Please register to continue.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onRegister}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Register Now
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserNotFoundModal;
