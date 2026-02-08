import { CompareRequest, EstimateResult } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchComparison(
  request: CompareRequest
): Promise<EstimateResult[]> {
  const response = await fetch(`${API_URL}/compare`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Failed to fetch comparison (${response.status}): ${errorBody}`
    );
  }

  return response.json();
}
