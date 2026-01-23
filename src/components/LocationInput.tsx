import { useState, useEffect, useRef } from 'react';
import { searchPlaces, formatPlaceName, type PhotonFeature } from '../services/geocoder';
import { Loader2 } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface LocationInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onLocationSelect: (location: { name: string; coordinates: [number, number] } | null) => void;
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
  }, [value, isSelected]);

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
    // Se o input foi limpo, limpar também a localização selecionada
    if (newValue.trim() === '') {
      onLocationSelect(null);
    }
  };

  const handleFocus = () => {
    if (!isSelected && value.length >= 2 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className="relative w-full">
      <label htmlFor={label.toLowerCase()} className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          id={label.toLowerCase()}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={handleFocus}
          placeholder={placeholder}
          className="w-full pr-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-sky-400"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <Loader2 className="h-4 w-4 animate-spin text-sky-400" />
          </div>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {suggestions.map((feature, index) => (
            <Button
              key={index}
              type="button"
              variant="ghost"
              onClick={() => handleSelect(feature)}
              className="w-full justify-start text-left h-auto py-2 px-4 rounded-none hover:bg-gray-700 text-white"
            >
            <div className="flex flex-col items-start w-full">
              <span className="font-medium text-white">{formatPlaceName(feature)}</span>
                {feature.properties.country && (
                <span className="text-xs text-gray-400">{feature.properties.country}</span>
                )}
              </div>
            </Button>
          ))}
        </div>
      )}

      {showSuggestions && suggestions.length === 0 && value.length >= 2 && !isLoading && (
        <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg p-4 text-center text-gray-400">
          Nenhum lugar encontrado
        </div>
      )}
    </div>
  );
}
