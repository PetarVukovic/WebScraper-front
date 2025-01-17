// CountrySelect.tsx
import React, { useState, useEffect } from "react";
import { EUROPEAN_COUNTRIES } from "../../types/countries";

interface CountrySelectProps {
  // Vrijednost (ISO kod ili čak ime države) koja se drži u parent komponenti.
  value: string | undefined;
  // Funkcija kojom "javljaš" parent komponenti da se kod/ime promijenio.
  onChange: (val: string) => void;
}

const CountrySelect: React.FC<CountrySelectProps> = ({ value, onChange }) => {
  // Tekst koji korisnik upisuje u polje
  const [searchTerm, setSearchTerm] = useState("");
  // Pomaže za prikaz/skrivanje dropdowna
  const [showDropdown, setShowDropdown] = useState(false);

  // Filtriramo države prema nazivu (ograničavamo prikaz na 10 rezultata)
  const filteredCountries = EUROPEAN_COUNTRIES.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 10);

  // Kad korisnik klikne na državu iz liste
  const handleSelectCountry = (name: string) => {
    // Želiš li u samom inputu prikazivati baš ime države ili ne
    setSearchTerm(name);

    // Ako na backend šalješ ISO kod, onda:
    onChange(name);

    // Ako ti ipak treba *naziv* za backend, onda upišeš `onChange(name)`.
    // (ili čuvaš oba parametra u parent komponenti)

    // Skrivamo dropdown da nestane
    setShowDropdown(false);
  };

  // Ako kreneš tipkati nešto novo, dropdown treba opet biti vidljiv
  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    setShowDropdown(true); // otvaramo dropdown
    // Dok ne odaberemo novu državu, javljamo parentu prazan string ili sl.
    onChange("");
  };

  // Na blur (ili klik izvan) možeš odlučiti hoćeš li skrivati dropdown
  // Ako želiš da nestane čim klikneš izvan, trebaš "onBlur" + small delay
  // ili "onClickOutside". Ovo je minimalni primjer pa to preskačemo.

  useEffect(() => {
    // Ako očistiš polje ili upišeš samo space, dropdown gubi smisao
    if (!searchTerm.trim()) {
      setShowDropdown(false);
    }
  }, [searchTerm]);

  return (
    <div className="relative">
      <input
        type="text"
        className="border border-gray-300 p-2 rounded w-full"
        placeholder="Type a country..."
        value={searchTerm}
        onChange={handleChangeInput}
        // onFocus -- ako želiš odmah prikazati dropdown pri fokusu, dodaš:
        // onFocus={() => setShowDropdown(true)}
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
