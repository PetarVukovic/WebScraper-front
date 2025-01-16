import React from "react";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl overflow-y-auto max-h-screen">
        <h2 className="text-xl font-semibold mb-4">Input Parameters Guide</h2>
        <div className="mb-4">
          <h3 className="text-lg font-medium">Search Terms</h3>
          <p className="text-gray-700 mt-2">
            Each search term is scraped separately for the whole area. Thus 10
            search terms will take 10 times as long as a single search term. Use
            only a smaller count of non-overlapping search terms to optimize the
            scraping process. A big list of very similar search terms will
            increase the runtime without providing much additional data.
            Description:{" "}
            <strong>
              Type what you want to search for as you would write it into the
              Google Maps search bar, e.g. restaurant or pet shelter.
            </strong>
            <b>
              {" "}
              The search terms should be unique because each requires the same
              processing time. Using similar terms is less efficient because of
              overlap but can slightly increase the capture rate (e.g. bar vs
              restaurant vs cafe). Putting location directly into search terms,
              e.g. restaurant Pittsburgh, is not recommended because you will
              only get max 120 results per search (Google's scrolling limit on a
              single search) but it can be done for speed.
            </b>{" "}
            You can also use direct place IDs here in the format
            place_id:ChIJ8_JBApXMDUcRDzXcYUPTGUY.
          </p>
          <ul className="list-disc pl-5 mt-2 text-gray-700">
            <li>
              <strong>Good Example:</strong> [restaurant, hotel, grocery,
              pharmacy]
            </li>
            <li>
              <strong>Bad Example:</strong> [restaurant, restaurants, chinese
              restaurant, cafe, coffee, coffee shop, takeout]
            </li>
          </ul>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-medium">Categories</h3>
          <p className="text-gray-700 mt-2">
            Categories can narrow down results but may cause false negatives,
            excluding places you want. Use categories carefully and include all
            synonyms.
          </p>
          <ul className="list-disc pl-5 mt-2 text-gray-700">
            <li>
              <strong>Example:</strong> Divorce lawyer, Divorce service, Divorce
              attorney
            </li>
          </ul>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-medium">Pricing 💸</h3>
          <p className="text-gray-700 mt-2">
            This scraper uses the Pay-per-result pricing model. It costs $9 to
            scrape 1,000 search results ($0.009 per item). Apify provides $5
            free usage credits monthly, allowing you to scrape over 500 emails
            for free.
          </p>
          <p className="text-gray-700 mt-2">
            If you scrape regularly, consider the $49/month Starter plan for
            over 5,400 emails monthly.
          </p>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
