import { useFlightStore } from "../stores/flightStores";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const PriceGraph = () => {
  const { priceGraphData, loading } = useFlightStore();

  if (loading) {
    return (
      <div className="bg-white rounded-lg md:w-[90%] mx-auto shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (priceGraphData.length === 0) {
    return null;
  }

  // Format data for Recharts
const chartData = priceGraphData.map(point => ({
  date: new Date(point.departure).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  }),
  price: Number(point.price) || 0, // Ensure it's a number
  fullDate: point.departure
}));

// Find min and max prices for context
const prices = priceGraphData.map(p => Number(p.price)).filter(p => !isNaN(p) && p > 0);
const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
const avgPrice = prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;

  return (
    <div className="bg-white rounded-lg md:w-[90%] mt-5 mx-auto shadow p-4 md:p-6 mb-6">
      <div className="mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
          Price Trend
        </h2>
        <div className="flex flex-wrap gap-4 text-sm">
          <div>
            <span className="text-gray-500">Lowest: </span>
            <span className="font-semibold text-green-600">${minPrice}</span>
          </div>
          <div>
            <span className="text-gray-500">Average: </span>
            <span className="font-semibold text-gray-700">${avgPrice}</span>
          </div>
          <div>
            <span className="text-gray-500">Highest: </span>
            <span className="font-semibold text-red-600">${maxPrice}</span>
          </div>
        </div>
      </div>

      <div className="w-[75%] " style={{ height: "300px" }}>
        {/* Use inline style for height */}
        <ResponsiveContainer width="75%" height={320}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
            <YAxis
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "8px 12px",
              }}
              formatter={(value: number | undefined) =>
                value ? [`$${value}`, "Price"] : ["N/A", "Price"]
              }
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ fill: "#2563eb", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-gray-500 mt-4 text-center">
        Price trends for the next 30 days
      </p>
    </div>
  );
};
