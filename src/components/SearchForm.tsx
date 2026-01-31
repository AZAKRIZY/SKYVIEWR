import { useState, useRef } from 'react';
import { useFlightStore } from '../stores/flightStores';
import { searchFlights, searchAirport } from '../Api/FlightApi';
import type{ GoogleFlightAirport } from '../flight.types';

// Simple cache to avoid duplicate API calls
const cache: Record<string, GoogleFlightAirport[]> = {};

export const SearchForm = () => {
  const {
    departureDate,
    passengers,
    setDepartureDate,
    setPassengers,
    setFlights,
    setLoading,
    setError,
  } = useFlightStore();

  const [origin, setOrigin] = useState<GoogleFlightAirport | null>(null);
  const [destination, setDestination] = useState<GoogleFlightAirport | null>(null);
  
  const [originQuery, setOriginQuery] = useState('');
  const [destQuery, setDestQuery] = useState('');
  const [originResults, setOriginResults] = useState<GoogleFlightAirport[]>([]);
  const [destResults, setDestResults] = useState<GoogleFlightAirport[]>([]);
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const [searchingOrigin, setSearchingOrigin] = useState(false);
  const [searchingDest, setSearchingDest] = useState(false);

  const originTimeout = useRef<number>(0);
  const destTimeout = useRef<number>(0);

  // Search for origin airports
  const searchOrigin = async (query: string) => {
    if (query.length < 2) {
      setOriginResults([]);
      setShowOriginDropdown(false);
      return;
    }

    // Check cache first
    const cacheKey = query.toLowerCase();
    if (cache[cacheKey]) {
      setOriginResults(cache[cacheKey]);
      setShowOriginDropdown(true);
      return;
    }

    setSearchingOrigin(true);
    try {
      const response = await searchAirport(query);
      const results = response.data || [];
      
      // Cache results
      cache[cacheKey] = results;
      
      setOriginResults(results);
      setShowOriginDropdown(true);
    } catch (error: any) {
      console.error('Airport search error:', error);
      if (error.response?.status === 429) {
        setError('Too many requests. Please wait a moment.');
      }
    } finally {
      setSearchingOrigin(false);
    }
  };

  // Search for destination airports
  const searchDest = async (query: string) => {
    if (query.length < 2) {
      setDestResults([]);
      setShowDestDropdown(false);
      return;
    }

    // Check cache first
    const cacheKey = query.toLowerCase();
    if (cache[cacheKey]) {
      setDestResults(cache[cacheKey]);
      setShowDestDropdown(true);
      return;
    }

    setSearchingDest(true);
    try {
      const response = await searchAirport(query);
      const results = response.data || [];
      
      // Cache results
      cache[cacheKey] = results;
      
      setDestResults(results);
      setShowDestDropdown(true);
    } catch (error: any) {
      console.error('Airport search error:', error);
      if (error.response?.status === 429) {
        setError('Too many requests. Please wait a moment.');
      }
    } finally {
      setSearchingDest(false);
    }
  };

  // Debounced handlers
  const handleOriginChange = (value: string) => {
    setOriginQuery(value);
    clearTimeout(originTimeout.current);
    originTimeout.current = window.setTimeout(() => searchOrigin(value), 800);
  };

  const handleDestChange = (value: string) => {
    setDestQuery(value);
    clearTimeout(destTimeout.current);
    destTimeout.current = window.setTimeout(() => searchDest(value), 800);
  };

  // Handle form submission
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!origin || !destination || !departureDate) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await searchFlights({
        departure_id: origin.id,
        arrival_id: destination.id,
        outbound_date: departureDate,
        adults: passengers,
        travel_class: 'ECONOMY',
        currency: 'USD',
        language_code: 'en-US',
        country_code: 'US',
      });

      console.log('✅ Flight Search Response:', response);
      
      // Extract flights from response
      const flights = response.data?.itineraries?.topFlights || [];
      setFlights(flights);
      
      if (flights.length === 0) {
        setError('No flights found for this route');
      }
    } catch (error: any) {
      console.error('❌ Flight search error:', error);
      setError('Failed to search flights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 md:p-6 mb-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        Search Flights
      </h1>
      
      <form onSubmit={handleSearch} className="space-y-4">
        {/* Origin Input */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            From
          </label>
          <div className="relative">
            <input
              type="text"
              value={originQuery}
              onChange={(e) => handleOriginChange(e.target.value)}
              placeholder="City or airport (e.g., LAX, Los Angeles)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
            {searchingOrigin && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>
          
          {/* Origin Dropdown */}
          {showOriginDropdown && originResults.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {originResults.map((airport) => (
                <div
                  key={airport.id}
                  onClick={() => {
                    setOrigin(airport);
                    setOriginQuery(airport.title);
                    setShowOriginDropdown(false);
                  }}
                  className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition"
                >
                  <div className="font-medium text-gray-900">{airport.title}</div>
                  <div className="text-sm text-gray-500">{airport.subtitle}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Destination Input */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            To
          </label>
          <div className="relative">
            <input
              type="text"
              value={destQuery}
              onChange={(e) => handleDestChange(e.target.value)}
              placeholder="City or airport (e.g., JFK, New York)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
            {searchingDest && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>
          
          {/* Destination Dropdown */}
          {showDestDropdown && destResults.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {destResults.map((airport) => (
                <div
                  key={airport.id}
                  onClick={() => {
                    setDestination(airport);
                    setDestQuery(airport.title);
                    setShowDestDropdown(false);
                  }}
                  className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition"
                >
                  <div className="font-medium text-gray-900">{airport.title}</div>
                  <div className="text-sm text-gray-500">{airport.subtitle}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Date and Passengers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Departure Date
            </label>
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Passengers
            </label>
            <input
              type="number"
              value={passengers}
              onChange={(e) => setPassengers(parseInt(e.target.value, 10) || 1)}
              min="1"
              max="9"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Search Flights
        </button>
      </form>
    </div>
  );
};