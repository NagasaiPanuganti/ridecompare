import React, { useCallback, useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LocationCoords } from "../types";

interface LocationInputProps {
  label: string;
  onSelect: (coords: LocationCoords) => void;
  placeholder?: string;
}

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
}

export default function LocationInput({
  label,
  onSelect,
  placeholder = "Enter a location",
}: LocationInputProps) {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchLocations = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
        {
          headers: {
            "Accept-Language": "en",
            "User-Agent": "RideCompare/1.0",
          },
        }
      );
      const data: NominatimResult[] = await response.json();
      setSuggestions(data);
      setShowDropdown(data.length > 0);
    } catch {
      setSuggestions([]);
      setShowDropdown(false);
    }
  }, []);

  const handleInputChange = (text: string) => {
    setValue(text);
    setIsSelected(false);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      searchLocations(text);
    }, 300);
  };

  const handleSelect = (result: NominatimResult) => {
    const coords: LocationCoords = {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      address: result.display_name,
    };
    setValue(result.display_name);
    setIsSelected(true);
    setSuggestions([]);
    setShowDropdown(false);
    onSelect(coords);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <Text style={styles.pinIcon}>📍</Text>
        <TextInput
          style={[styles.input, isSelected && styles.inputSelected]}
          value={value}
          onChangeText={handleInputChange}
          onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
          placeholder={placeholder}
          placeholderTextColor="#64748B"
        />
        {isSelected && <Text style={styles.checkmark}>✓</Text>}
      </View>

      {showDropdown && suggestions.length > 0 && (
        <View style={styles.dropdown}>
          <FlatList
            data={suggestions}
            keyExtractor={(item, index) => `${item.lat}-${item.lon}-${index}`}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleSelect(item)}
              >
                <Text style={styles.suggestionText} numberOfLines={2}>
                  {item.display_name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    zIndex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#94A3B8",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  pinIcon: {
    position: "absolute",
    left: 14,
    zIndex: 1,
    fontSize: 16,
  },
  input: {
    flex: 1,
    paddingLeft: 42,
    paddingRight: 40,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 12,
    fontSize: 15,
    color: "#FFFFFF",
    backgroundColor: "#0F172A",
  },
  inputSelected: {
    borderColor: "#4ADE80",
  },
  checkmark: {
    position: "absolute",
    right: 14,
    fontSize: 18,
    color: "#22C55E",
    fontWeight: "bold",
  },
  dropdown: {
    position: "absolute",
    top: 70,
    left: 0,
    right: 0,
    backgroundColor: "#1E293B",
    borderWidth: 1,
    borderColor: "#475569",
    borderRadius: 12,
    maxHeight: 200,
    zIndex: 100,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  suggestionItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
  },
  suggestionText: {
    fontSize: 14,
    color: "#CBD5E1",
    lineHeight: 20,
  },
});
