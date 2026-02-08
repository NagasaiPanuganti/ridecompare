"use client";

import { useEffect, useRef, useState } from "react";
import { LocationCoords } from "@/types";
import { loadPlacesLibrary } from "@/lib/google-maps";

interface LocationInputProps {
  label: string;
  onSelect: (coords: LocationCoords) => void;
  placeholder?: string;
}

export default function LocationInput({
  label,
  onSelect,
  placeholder = "Enter a location",
}: LocationInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || !inputRef.current) return;

    loadPlacesLibrary().then(() => {
      if (!inputRef.current || autocompleteRef.current) return;

      const autocomplete = new google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ["geocode", "establishment"],
          fields: ["geometry", "formatted_address", "name"],
        }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry?.location) {
          const coords: LocationCoords = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            address: place.formatted_address || place.name || "",
          };
          setValue(coords.address);
          onSelect(coords);
        }
      });

      autocompleteRef.current = autocomplete;
    });
  }, [onSelect]);

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 bg-white"
        />
      </div>
    </div>
  );
}
