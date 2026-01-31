import type{ Flight } from '../flight.types';

interface FlightCardProps {
  flight: Flight;
}

export const FlightCard = ({ flight }: FlightCardProps) => {
  // Parse times
  const parseTime = (timeStr: string) => {
    // "05-04-2025 07:50 AM" -> "07:50 AM"
    return timeStr.split(' ').slice(1).join(' ');
  };

  const departureTime = parseTime(flight.departure_time);
  const arrivalTime = parseTime(flight.arrival_time);

  // Determine stops text
  const getStopsText = (stops: number) => {
    if (stops === 0) return 'Direct';
    if (stops === 1) return '1 stop';
    return `${stops} stops`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
      {/* Flight times and route */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <div className="text-2xl font-bold text-gray-900">{departureTime}</div>
          <div className="text-sm text-gray-500">Departure</div>
        </div>

        <div className="flex-1 px-4">
          <div className="relative">
            {/* Timeline */}
            <div className="flex items-center justify-center">
              <div className="h-px bg-gray-300 flex-1"></div>
              <div className="px-2 text-xs text-gray-500">{flight.duration.text}</div>
              <div className="h-px bg-gray-300 flex-1"></div>
            </div>
            {/* Stops indicator */}
            <div className="text-center mt-1">
              <span className={`text-xs px-2 py-1 rounded ${
                flight.stops === 0 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {getStopsText(flight.stops)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 text-right">
          <div className="text-2xl font-bold text-gray-900">{arrivalTime}</div>
          <div className="text-sm text-gray-500">Arrival</div>
        </div>
      </div>

      {/* Bottom row - airline and price */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div>
          {flight.airline && (
            <div className="text-sm text-gray-600">{flight.airline}</div>
          )}
          {flight.flight_number && (
            <div className="text-xs text-gray-400">{flight.flight_number}</div>
          )}
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">
            ${flight.price}
          </div>
          <div className="text-xs text-gray-500">per person</div>
        </div>
      </div>
    </div>
  );
};