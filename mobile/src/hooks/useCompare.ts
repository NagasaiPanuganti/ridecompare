import { useState } from "react";
import { CompareRequest, EstimateResult } from "../types";
import { fetchComparison } from "../lib/api";

interface UseCompareReturn {
  results: EstimateResult[];
  loading: boolean;
  error: string | null;
  compare: (request: CompareRequest) => Promise<void>;
  clearResults: () => void;
}

export function useCompare(): UseCompareReturn {
  const [results, setResults] = useState<EstimateResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const compare = async (request: CompareRequest) => {
    setLoading(true);
    setError(null);
    setResults([]);
    try {
      const data = await fetchComparison(request);
      setResults(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
    setError(null);
  };

  return { results, loading, error, compare, clearResults };
}
