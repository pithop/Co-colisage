import { useState, useRef, useEffect, useId } from "react";
import { MapPin, Plane, Check } from "lucide-react";
import { searchWorldCities, type WorldCity } from "../../data/worldCities";

interface CityAutocompleteProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  id?: string;
  className?: string;
  maxLength?: number;
  autoFocus?: boolean;
  onSelectCity?: (city: WorldCity) => void;
}

export function CityAutocomplete({
  name,
  value,
  onChange,
  placeholder = "Rechercher une ville...",
  required = false,
  id,
  className = "",
  maxLength = 80,
  autoFocus = false,
  onSelectCity,
}: CityAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  const suggestions = searchWorldCities(value, 8);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (city: WorldCity) => {
    onChange(city.name);
    if (onSelectCity) {
      onSelectCity(city);
    }
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      setIsOpen(true);
      return;
    }

    if (!isOpen) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0,
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1,
      );
    } else if (event.key === "Enter") {
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        event.preventDefault();
        handleSelect(suggestions[highlightedIndex]);
      } else {
        setIsOpen(false);
      }
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={`city-autocomplete-container ${className}`}>
      <div className="city-input-wrap">
        <input
          ref={inputRef}
          type="text"
          id={id}
          name={name}
          value={value}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          autoFocus={autoFocus}
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-haspopup="listbox"
          className="city-autocomplete-input"
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(-1);
          }}
          onFocus={() => {
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
        />
        <MapPin size={15} className="city-input-icon" aria-hidden="true" />
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul
          id={listboxId}
          role="listbox"
          className="city-autocomplete-dropdown"
          aria-label="Villes suggérées"
        >
          {suggestions.map((city, index) => {
            const isSelected = city.name.toLowerCase() === value.toLowerCase();
            const isHighlighted = highlightedIndex === index;
            return (
              <li
                key={`${city.name}-${city.countryCode}-${index}`}
                role="option"
                id={`${listboxId}-option-${index}`}
                aria-selected={isSelected}
                className={`city-autocomplete-item ${isHighlighted ? "highlighted" : ""} ${isSelected ? "selected" : ""}`}
                onMouseDown={(e) => {
                  e.preventDefault(); // prevents blur before click
                  handleSelect(city);
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <div className="city-item-main">
                  <span className="city-item-name">{city.name}</span>
                  <span className="city-item-country">{city.country}</span>
                </div>
                <div className="city-item-meta">
                  {city.code && (
                    <span className="city-item-code">
                      <Plane size={11} aria-hidden="true" />
                      {city.code}
                    </span>
                  )}
                  {isSelected && (
                    <Check size={14} className="city-item-check" aria-hidden="true" />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
