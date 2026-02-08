"use client";

import { EstimateResult } from "@/types";
import ResultsCard from "./ResultsCard";

interface ResultsListProps {
  results: EstimateResult[];
}

export default function ResultsList({ results }: ResultsListProps) {
  if (results.length === 0) return null;

  return (
    <div className="w-full space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">
        {results.length} {results.length === 1 ? "option" : "options"} found
      </h2>
      <div className="space-y-3">
        {results.map((estimate, index) => (
          <ResultsCard
            key={`${estimate.provider}-${estimate.normalized_category}`}
            estimate={estimate}
            rank={index + 1}
          />
        ))}
      </div>
    </div>
  );
}
