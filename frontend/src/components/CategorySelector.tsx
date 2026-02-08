"use client";

import { RideCategory } from "@/types";

interface CategorySelectorProps {
  selected: RideCategory;
  onChange: (category: RideCategory) => void;
}

const CATEGORIES: { value: RideCategory; label: string; icon: string }[] = [
  { value: "Standard", label: "Standard", icon: "🚗" },
  { value: "XL", label: "XL", icon: "🚙" },
  { value: "Premium", label: "Premium", icon: "✨" },
];

export default function CategorySelector({
  selected,
  onChange,
}: CategorySelectorProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Ride Category
      </label>
      <div className="flex gap-2">
        {CATEGORIES.map(({ value, label, icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 font-medium transition-all ${
              selected === value
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <span>{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
