import React, { useState } from "react";
import { ALL_CATEGORIES } from "../../types/category";

interface CategoryMultiSelectProps {
  selectedCategories: string[];
  onChange: (newSelected: string[]) => void;
}

const CategoryMultiSelect: React.FC<CategoryMultiSelectProps> = ({
  selectedCategories,
  onChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filtriranje i prikaz samo 10 rezultata
  const filteredCategories = ALL_CATEGORIES.filter((cat) =>
    cat.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 10);

  // Dodaj kategoriju ako već nije odabrana
  const handleSelectCategory = (category: string) => {
    if (!selectedCategories.includes(category)) {
      onChange([...selectedCategories, category]);
    }
    setSearchTerm(""); // brisanje search inputa (opcionalno)
  };

  const handleRemoveCategory = (category: string) => {
    onChange(selectedCategories.filter((cat) => cat !== category));
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search categories..."
        className="block w-full p-2 border rounded"
      />

      {filteredCategories.length > 0 && searchTerm.trim().length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-300 mt-1 max-h-60 overflow-y-auto w-full rounded shadow-md">
          {filteredCategories.map((category) => (
            <li
              key={category}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelectCategory(category)}
            >
              {category}
            </li>
          ))}
        </ul>
      )}

      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap mt-2">
          {selectedCategories.map((category) => (
            <div
              key={category}
              className="flex items-center bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded mr-2 mb-2"
            >
              {category}
              <button
                className="ml-2 text-red-600 hover:text-red-800 font-bold"
                onClick={() => handleRemoveCategory(category)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryMultiSelect;
