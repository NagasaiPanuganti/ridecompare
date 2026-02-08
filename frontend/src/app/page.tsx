"use client";

import { useState } from "react";
import { LocationCoords, RideCategory } from "@/types";
import LocationInput from "@/components/LocationInput";
import CategorySelector from "@/components/CategorySelector";
import CompareButton from "@/components/CompareButton";
import ResultsList from "@/components/ResultsList";
import Disclaimer from "@/components/Disclaimer";
import ErrorMessage from "@/components/ErrorMessage";
import { useCompare } from "@/hooks/useCompare";

export default function Home() {
  const [pickup, setPickup] = useState<LocationCoords | null>(null);
  const [dropoff, setDropoff] = useState<LocationCoords | null>(null);
  const [category, setCategory] = useState<RideCategory>("Standard");
  const { results, loading, error, compare } = useCompare();

  const handleCompare = () => {
    if (!pickup || !dropoff) return;
    compare({
      pickup_lat: pickup.lat,
      pickup_lng: pickup.lng,
      drop_lat: dropoff.lat,
      drop_lng: dropoff.lng,
      category,
    });
  };

  const canCompare = pickup !== null && dropoff !== null && !loading;

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Ride<span className="text-blue-600">Compare</span>
          </h1>
          <p className="text-gray-500">
            Compare rides across providers. Choose the best price.
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
          <LocationInput
            label="Pickup Location"
            onSelect={setPickup}
            placeholder="Where are you?"
          />
          <LocationInput
            label="Drop-off Location"
            onSelect={setDropoff}
            placeholder="Where are you going?"
          />
          <CategorySelector selected={category} onChange={setCategory} />
          <CompareButton
            onClick={handleCompare}
            loading={loading}
            disabled={!canCompare}
          />
        </div>

        {/* Error */}
        <ErrorMessage message={error} />

        {/* Results */}
        <ResultsList results={results} />

        {/* Disclaimer (show when results exist) */}
        {results.length > 0 && <Disclaimer />}
      </div>
    </main>
  );
}
