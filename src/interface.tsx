import type { Airport, FlightFilters, FlightItinerary } from "./flight.types";

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
export interface FlightStore {
  // Search params
  origin: Airport | null;
  destination: Airport | null;
  departureDate: string;
  returnDate: string;
  passengers: number;
  
  // Results
  flights: FlightItinerary[];
  filteredFlights: FlightItinerary[];
  loading: boolean;
  error: string | null;
  
  // Filters
  filters: FlightFilters;
  
  // Actions
  setOrigin: (airport: Airport | null) => void;
  setDestination: (airport: Airport | null) => void;
  setDepartureDate: (date: string) => void;
  setReturnDate: (date: string) => void;
  setPassengers: (count: number) => void;
  setFlights: (flights: FlightItinerary[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<FlightFilters>) => void;
  applyFilters: () => void;
}
