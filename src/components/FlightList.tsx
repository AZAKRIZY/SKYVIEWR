import { useState } from 'react';
import { useFlightStore } from '../stores/flightStores';
import { FlightCard } from './FlightCard';
import { Filters } from './Filters';

export const FlightList = () => {
  const { filteredFlights, loading } = useFlightStore();
  const [showFilters, setShowFilters] = useState(false);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow md:w-[90%] mx-auto p-8 text-center md:mt-5">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Searching for the best flights...</p>
      </div>
    );
  }

  if (filteredFlights.length === 0) {
    return null;
  }

  return (
    <>
      <div className="md:w-[90%] mx-auto md:mt-6 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-main-900">
            Available Flights: {filteredFlights.length}
          </h2>

          <button 
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-50 font-medium px-4 py-2  border-gray-300 rounded-lg hover:bg-main-700 cursor-pointer transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter
          </button>
        </div>

        <div className="space-y-3">
          {filteredFlights.map((flight, index) => (
            <FlightCard key={index} flight={flight} />
          ))}
        </div>
      </div>

     
      {showFilters && <Filters onClose={() => setShowFilters(false)} />}
    </>
  );
};