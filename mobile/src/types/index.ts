export type RideCategory = "Standard" | "XL" | "Premium";

export interface CompareRequest {
  pickup_lat: number;
  pickup_lng: number;
  drop_lat: number;
  drop_lng: number;
  category: RideCategory;
}

export interface EstimateResult {
  provider: string;
  normalized_category: RideCategory;
  estimated_price: number;
  eta_minutes: number;
  redirect_url: string;
}

export interface LocationCoords {
  lat: number;
  lng: number;
  address: string;
}
