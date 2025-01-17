import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";

const KeywordInput = ({
  keywords = [],
  onChange,
}: {
  keywords: string[];
  onChange: (keywords: string[]) => void;
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      const newKeyword = inputValue.trim();
      if (!keywords.includes(newKeyword)) {
        onChange([...keywords, newKeyword]);
      }
      setInputValue("");
    } else if (e.key === "Backspace" && !inputValue && keywords.length > 0) {
      // Remove last keyword when backspace is pressed on empty input
      onChange(keywords.slice(0, -1));
    }
  };

  const removeKeyword = (indexToRemove: number) => {
    onChange(keywords.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 p-2 border rounded min-h-[42px] bg-white">
        {keywords.map((keyword, index) => (
          <div
            key={index}
            className="flex items-center gap-1 px-2 py-1 bg-blue-100 rounded-md"
          >
            <span className="text-sm">{keyword}</span>
            <button
              type="button"
              onClick={() => removeKeyword(index)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-[120px] outline-none"
          placeholder={
            keywords.length === 0 ? "Type keywords and press Enter..." : ""
          }
        />
      </div>
      <p className="text-sm text-gray-500 mt-1">
        <strong>Press Enter to add keywords.</strong> Use Backspace to remove
        the last keyword.
      </p>
    </div>
  );
};

export default KeywordInput;
