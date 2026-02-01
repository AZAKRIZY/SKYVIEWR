import { useState, useEffect } from "react";
import { useFlightStore } from "../stores/flightStores";

interface FiltersProps {
  onClose: () => void;
}

export const Filters = ({ onClose }: FiltersProps) => {
  const { flights, filters, setFilters } = useFlightStore();
  const [isClosing, setIsClosing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Get unique airlines from flights
  const airlines = Array.from(
    new Set(
      flights
        .map((f) => f.airline)
        .filter((airline): airline is string => Boolean(airline)),
    ),
  );

  // Get price range
  const prices = flights.map((f) => f.price);
  const minFlightPrice = Math.min(...prices);
  const maxFlightPrice = Math.max(...prices);

  const [localFilters, setLocalFilters] = useState(filters);
  
  useEffect(() => {
    setTimeout(() => setIsOpen(true), 10); 
  }, []);

  // Handle close with animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); 
  };

  // Handle stops filter
  const toggleStops = (stops: number) => {
    const currentStops = localFilters.stops || [];
    const newStops = currentStops.includes(stops)
      ? currentStops.filter((s) => s !== stops)
      : [...currentStops, stops];

    const updated = { ...localFilters, stops: newStops };
    setLocalFilters(updated);
    setFilters(updated);
  };

  // Handle price range
  const handlePriceChange = (type: "min" | "max", value: string) => {
    const numValue = parseInt(value);
    const updated = {
      ...localFilters,
      minPrice: type === "min" ? numValue : localFilters.minPrice,
      maxPrice: type === "max" ? numValue : localFilters.maxPrice,
    };
    setLocalFilters(updated);
    setFilters(updated);
  };

  // Handle airline filter
  const toggleAirline = (airline: string) => {
    const currentAirlines = localFilters.airlines || [];
    const newAirlines = currentAirlines.includes(airline)
      ? currentAirlines.filter((a) => a !== airline)
      : [...currentAirlines, airline];

    const updated = { ...localFilters, airlines: newAirlines };
    setLocalFilters(updated);
    setFilters(updated);
  };

  // Clear all filters
  const clearFilters = () => {
    setLocalFilters({});
    setFilters({});
  };

  return (
    <>
      
      <div 
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${
          isClosing ? 'opacity-0' : isOpen ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

   
      <div 
        className={`fixed right-0 top-0 bottom-0 w-full md:w-96 bg-white shadow-2xl z-50 overflow-y-auto transition-transform duration-300 ease-in-out ${
          isClosing ? 'translate-x-full' : isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Filters</h3>
          <button
            onClick={handleClose}
            className="text-gray-500 cursor-pointer hover:text-gray-700 transition"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Clear filters button */}
          {(localFilters.stops?.length ||
            localFilters.airlines?.length ||
            localFilters.minPrice ||
            localFilters.maxPrice) && (
            <button
              onClick={clearFilters}
              className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition"
            >
              Clear all filters
            </button>
          )}

          {/* Stops Filter */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Stops</h4>
            <div className="space-y-2">
              {[0, 1, 2].map((stops) => (
                <label
                  key={stops}
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition"
                >
                  <input
                    type="checkbox"
                    checked={localFilters.stops?.includes(stops) || false}
                    onChange={() => toggleStops(stops)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">
                    {stops === 0
                      ? "Direct"
                      : stops === 1
                        ? "1 Stop"
                        : "2+ Stops"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Price Range</h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">Min Price</label>
                <input
                  type="range"
                  min={minFlightPrice}
                  max={maxFlightPrice}
                  value={localFilters.minPrice || minFlightPrice}
                  onChange={(e) => handlePriceChange("min", e.target.value)}
                  className="w-full accent-blue-600"
                />
                <div className="text-sm font-medium text-gray-900">
                  ${localFilters.minPrice || minFlightPrice}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600">Max Price</label>
                <input
                  type="range"
                  min={minFlightPrice}
                  max={maxFlightPrice}
                  value={localFilters.maxPrice || maxFlightPrice}
                  onChange={(e) => handlePriceChange("max", e.target.value)}
                  className="w-full accent-blue-600"
                />
                <div className="text-sm font-medium text-gray-900">
                  ${localFilters.maxPrice || maxFlightPrice}
                </div>
              </div>
            </div>
          </div>

          {/* Airlines Filter */}
          {airlines.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Airlines</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {airlines.map((airline) => (
                  <label
                    key={airline}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition"
                  >
                    <input
                      type="checkbox"
                      checked={
                        localFilters.airlines?.includes(airline) || false
                      }
                      onChange={() => toggleAirline(airline)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{airline}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
