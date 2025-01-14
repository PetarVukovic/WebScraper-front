import { CompaniesOutput } from "../../types";

type CompanyDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  company: CompaniesOutput | null;
};

export const CompanyDetailsModal: React.FC<CompanyDetailsModalProps> = ({
  isOpen,
  onClose,
  company,
}) => {
  if (!isOpen || !company) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative">
        <h2 className="text-xl font-semibold mb-4">Company Details</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Context Data</h3>
            <p className="whitespace-pre-wrap">
              {company.context_data || "N/A"}
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Generated Email</h3>
            <p className="whitespace-pre-wrap">
              {company.generated_email || "N/A"}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};
