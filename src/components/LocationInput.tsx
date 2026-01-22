// src/components/LocationInput.tsx
import { useState, useEffect, useRef } from 'react';
import { searchPlaces, formatPlaceName, type PhotonFeature } from '../services/geocoder';

interface LocationInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onLocationSelect: (location: { name: string; coordinates: [number, number] }) => void;
  placeholder?: string;
}

export function LocationInput({
  label,
  value,
  onChange,
  onLocationSelect,
  placeholder = 'Digite um endereço...',
}: LocationInputProps) {
  const [suggestions, setSuggestions] = useState<PhotonFeature[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);



  // Buscar sugestões quando o usuário digita
  useEffect(() => {

    if (isSelected) {
      return;
    }

    const timeoutId = setTimeout(async () => {
      if (value.length >= 2) {
        setIsLoading(true);
        const results = await searchPlaces(value);
        setSuggestions(results);
        setShowSuggestions(true);
        setIsLoading(false);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timeoutId);
  }, [value]);

  // Fechar sugestões ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (feature: PhotonFeature) => {
    const formattedName = formatPlaceName(feature);
    onChange(formattedName);
    onLocationSelect({
      name: formattedName,
      coordinates: feature.geometry.coordinates,
    });
    setShowSuggestions(false);
    setIsSelected(true);
  };

  const handleChange = (newValue: string) => {
    onChange(newValue);
    if (isSelected) {
      setIsSelected(false);
    }
  };

  const handleFocus = () => {
    if (!isSelected && value.length >= 2 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className="relative">
      <label htmlFor={label.toLowerCase()} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          id={label.toLowerCase()}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={handleFocus}
          placeholder={placeholder}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {suggestions.map((feature, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(feature)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
            >
              <div className="font-medium">{formatPlaceName(feature)}</div>
              {feature.properties.country && (
                <div className="text-sm text-gray-500">{feature.properties.country}</div>
              )}
            </button>
          ))}
        </div>
      )}

      {showSuggestions && suggestions.length === 0 && value.length >= 2 && !isLoading && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-4 text-center text-gray-500">
          Nenhum lugar encontrado
        </div>
      )}
    </div>
  );
}
