import { useFlightStore } from "../stores/flightStores";
import { FlightCard } from "./FlightCard";
import { forwardRef } from "react";

export const FlightList = forwardRef<HTMLDivElement, {}>((_, ref) => {
  const { filteredFlights, loading } = useFlightStore();

  if (loading) {
    return (
      <div className="bg-white rounded-lg md:w-[90%] mx-auto shadow p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-main-700 mb-4"></div>
        <p className="text-main-900">Searching for the best flights...</p>
      </div>
    );
  }

  if (filteredFlights.length === 0) {
    return null;
  }

  return (
    <div
      ref={ref}
      className="space-y-4 md:w-[90%] mx-auto md:mt-3 scroll-mt-24"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-main-900">
          Available Flights : {filteredFlights.length}
        </h2>

        

        <div className="text-sm text-gray-500">filter</div>
      </div>

      <div className="space-y-3">
        {filteredFlights.map((flight, index) => (
          <FlightCard key={index} flight={flight} />
        ))}
      </div>
    </div>
  );
});

FlightList.displayName = "FlightList";
