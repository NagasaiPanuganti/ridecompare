import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

let initialized = false;

export function initGoogleMaps(): void {
  if (!initialized) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
    if (apiKey) {
      setOptions({
        key: apiKey,
        v: "weekly",
        libraries: ["places"],
      });
      initialized = true;
    }
  }
}

export async function loadPlacesLibrary(): Promise<void> {
  initGoogleMaps();
  await importLibrary("places");
}
