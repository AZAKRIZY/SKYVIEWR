// ============================================
// GOOGLE FLIGHTS API TYPES
// ============================================

// Airport search response
export interface GoogleFlightAirport {
  id: string; // IATA code like "LAX"
  type: string; // "airport", "city", "other"
  title: string;
  subtitle: string;
  city: string;
}

export interface AirportSearchResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: GoogleFlightAirport[];
}

// Flight itinerary
export interface FlightDuration {
  raw: number; // minutes
  text: string; // "2 hr 20 min"
}

export interface Flight {
  departure_time: string; // "05-04-2025 07:50 AM"
  arrival_time: string; // "05-04-2025 10:10 AM"
  duration: FlightDuration;
  price: number;
  stops: number;
  airline?: string;
  flight_number?: string;
  [key: string]: any; // For other properties we haven't mapped
}

export interface FlightSearchData {
  itineraries: {
    topFlights: Flight[];
    [key: string]: any;
  };
  [key: string]: any;
}

export interface FlightSearchResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: FlightSearchData;
}

// Price graph
export interface PriceGraphPoint {
  departure?: string; // "2025-04-01"
  price: number;
  date?: string; // Optional date field for charting
}

export interface PriceGraphResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: PriceGraphPoint[];
}

// Calendar picker (alternative price view)
export interface CalendarPricePoint {
  departure: string; // "2025-01-06"
  price: number;
}

export interface CalendarPickerResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: CalendarPricePoint[];
}

// Search parameters
export interface FlightSearchParams {
  departure_id: string;
  arrival_id: string;
  outbound_date: string;
  return_date?: string;
  adults?: number;
  children?: number;
  infant_in_seat?: number;
  infant_on_lap?: number;
  travel_class?: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
  currency?: string;
  language_code?: string;
  country_code?: string;
}

export interface PriceGraphParams {
  departure_id: string;
  arrival_id: string;
  outbound_date: string;
  return_date?: string;
  start_date?: string;
  end_date?: string;
  adults?: number;
  children?: number;
  infant_in_seat?: number;
  infant_on_lap?: number;
  travel_class?: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
  currency?: string;
  country_code?: string;
}

// Filters for client-side filtering
export interface FlightFilters {
  maxPrice?: number;
  minPrice?: number;
  stops?: number[]; // [0] = direct, [1] = 1 stop, etc.
  airlines?: string[];
  maxDuration?: number; // in minutes
  departureTimeRange?: [number, number]; // hours [0-23]
  arrivalTimeRange?: [number, number]; // hours [0-23]
}