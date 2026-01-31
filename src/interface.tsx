

export interface FlightSearchParams {
  originSkyId: string;
  destinationSkyId: string;
  originEntityId: string;
  destinationEntityId: string;
  date: string; // YYYY-MM-DD
  returnDate?: string;
  cabinClass?: "economy" | "premium_economy" | "business" | "first";
  adults?: string;
  sortBy?: "best" | "price_high" | "fastest";
  currency?: string;
  market?: string;
  countryCode?: string;
}

//store interface for zustand

