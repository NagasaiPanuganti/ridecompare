"use client";

import { EstimateResult } from "@/types";

interface ResultsCardProps {
  estimate: EstimateResult;
  rank: number;
}

const PROVIDER_COLORS: Record<string, string> = {
  Uber: "bg-black text-white",
  Lyft: "bg-pink-600 text-white",
};

export default function ResultsCard({ estimate, rank }: ResultsCardProps) {
  const providerColor =
    PROVIDER_COLORS[estimate.provider] || "bg-gray-700 text-white";
  const isBestPrice = rank === 1;

  const handleBookClick = () => {
    if (estimate.redirect_url) {
      window.open(estimate.redirect_url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      className={`relative border rounded-xl p-5 transition-all hover:shadow-md ${
        isBestPrice ? "border-green-400 bg-green-50/50" : "border-gray-200 bg-white"
      }`}
    >
      {isBestPrice && (
        <span className="absolute -top-3 left-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          Best Price
        </span>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center justify-center w-10 h-10 rounded-lg font-bold text-sm ${providerColor}`}
          >
            {estimate.provider.charAt(0)}
          </span>
          <div>
            <h3 className="font-semibold text-gray-900">
              {estimate.provider}
            </h3>
            <p className="text-sm text-gray-500">
              {estimate.normalized_category}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">
            ${estimate.estimated_price.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500">
            {estimate.eta_minutes} min away
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleBookClick}
        className={`w-full mt-4 py-2.5 px-4 rounded-lg font-medium transition-all ${
          estimate.provider === "Uber"
            ? "bg-black text-white hover:bg-gray-800"
            : "bg-pink-600 text-white hover:bg-pink-700"
        }`}
      >
        Book with {estimate.provider} &rarr;
      </button>
    </div>
  );
}
