import { useFlightStore } from '../stores/flightStores';
import { FlightCard } from './FlightCard';

export const FlightList = () => {
  const { filteredFlights, loading } = useFlightStore();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Searching for the best flights...</p>
      </div>
    );
  }

  if (filteredFlights.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
          Available Flights ({filteredFlights.length})
        </h2>
        
        {/* Sort options - we'll implement this later */}
        <div className="text-sm text-gray-500">
          Showing best matches
        </div>
      </div>

      <div className="space-y-3">
        {filteredFlights.map((flight, index) => (
          <FlightCard key={index} flight={flight} />
        ))}
      </div>
    </div>
  );
};