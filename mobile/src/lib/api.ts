import { Platform } from "react-native";
import { CompareRequest, EstimateResult } from "../types";

// Android emulator can't reach localhost — use 10.0.2.2 instead
const getApiUrl = (): string => {
  const host = Platform.OS === "android" ? "10.0.2.2" : "localhost";
  return `http://${host}:8000`;
};

const API_URL = getApiUrl();

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

export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}
