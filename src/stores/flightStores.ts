import { create } from 'zustand';
import type{ Flight, FlightFilters, GoogleFlightAirport, PriceGraphPoint } from '../flight.types';

interface FlightStore {
  // Search params
  origin: GoogleFlightAirport | null;
  destination: GoogleFlightAirport | null;
  departureDate: string;
  returnDate: string;
  passengers: number;
  
  // Results
  flights: Flight[];
  filteredFlights: Flight[];
  loading: boolean;
  error: string | null;
  
  // Filters
  filters: FlightFilters;
  
  // Price graph data
 priceGraphData: PriceGraphPoint[];
  
  // Actions
  setOrigin: (airport: GoogleFlightAirport | null) => void;
  setDestination: (airport: GoogleFlightAirport | null) => void;
  setDepartureDate: (date: string) => void;
  setReturnDate: (date: string) => void;
  setPassengers: (count: number) => void;
  setFlights: (flights: Flight[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<FlightFilters>) => void;
  setPriceGraphData: (data: Array<{ departure: string; price: number }>) => void;
  applyFilters: () => void;
  clearFilters: () => void;
}

export const useFlightStore = create<FlightStore>((set, get) => ({
  // Initial state
  origin: null,
  destination: null,
  departureDate: '',
  returnDate: '',
  passengers: 1,
  flights: [],
  filteredFlights: [],
  loading: false,
  error: null,
  filters: {},
  priceGraphData: [],
  
  // Actions
  setOrigin: (airport) => set({ origin: airport }),
  setDestination: (airport) => set({ destination: airport }),
  setDepartureDate: (date) => set({ departureDate: date }),
  setReturnDate: (date) => set({ returnDate: date }),
  setPassengers: (count) => set({ passengers: count }),
  
  setFlights: (flights) => {
    set({ flights, filteredFlights: flights });
    get().applyFilters();
  },
  
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  setPriceGraphData: (data) => set({ priceGraphData: data }),
  
  setFilters: (newFilters) => {
    set({ filters: { ...get().filters, ...newFilters } });
    get().applyFilters();
  },
  
  clearFilters: () => {
    set({ filters: {} });
    get().applyFilters();
  },
  
  applyFilters: () => {
    const { flights, filters } = get();
    let filtered = [...flights];
    
    // Apply price filter
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(flight => flight.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(flight => flight.price <= filters.maxPrice!);
    }
    
    // Apply stops filter
    if (filters.stops && filters.stops.length > 0) {
      filtered = filtered.filter(flight => 
        filters.stops!.includes(flight.stops)
      );
    }
    
    // Apply max duration filter
    if (filters.maxDuration !== undefined) {
      filtered = filtered.filter(flight => 
        flight.duration.raw <= filters.maxDuration!
      );
    }
    
    // Apply airline filter
    if (filters.airlines && filters.airlines.length > 0) {
      filtered = filtered.filter(flight =>
        flight.airline && filters.airlines!.includes(flight.airline)
      );
    }
    
    set({ filteredFlights: filtered });
  },
}));