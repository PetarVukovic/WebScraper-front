import React, { useState, useEffect, useCallback, useRef } from "react";
import { EUROPEAN_COUNTRIES } from "../../types/countries";

interface CountrySelectProps {
  value: string | undefined;
  onChange: (val: string) => void;
}

const CountrySelect: React.FC<CountrySelectProps> = ({ value, onChange }) => {
  const [searchTerm, setSearchTerm] = useState(value || ""); // ✅ Koristi `value` iz parenta
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // ✅ Ref za detekciju klika izvan dropdowna

  // ✅ Memorisana funkcija koja filtrira države
  const filteredCountries = EUROPEAN_COUNTRIES.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 10);

  // ✅ Memorisana funkcija za selekciju države
  const handleSelectCountry = useCallback(
    (name: string) => {
      setSearchTerm(name); // Prikazujemo ime države u inputu
      onChange(name); // Šaljemo promenu parent komponenti
      setShowDropdown(false);
    },
    [onChange]
  );

  // ✅ Memorisana funkcija za unos teksta
  const handleChangeInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setSearchTerm(val);
      setShowDropdown(true); // Otvaramo dropdown
      onChange(""); // Parentu šaljemo prazan string dok korisnik ne odabere državu
    },
    [onChange]
  );

  // ✅ Zatvori dropdown ako korisnik klikne izvan
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Ako `value` iz parent komponente promeni vrednost, ažuriraj `searchTerm`
  useEffect(() => {
    if (value !== searchTerm) {
      setSearchTerm(value || "");
    }
  }, [value]);

  return (
    <div className="relative" ref={dropdownRef}>
      <input
        type="text"
        className="border border-gray-300 p-2 rounded w-full"
        placeholder="Type a country..."
        value={searchTerm}
        onChange={handleChangeInput}
        onFocus={() => setShowDropdown(true)} // ✅ Prikazuje dropdown na fokus
      />

      {showDropdown && filteredCountries.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-300 mt-1 w-full rounded shadow max-h-48 overflow-y-auto">
          {filteredCountries.map((country) => (
            <li
              key={country.code}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelectCountry(country.name)}
            >
              {country.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CountrySelect;
