import axios from 'axios';
import type{
  FlightSearchParams,
  PriceGraphParams,
  FlightSearchResponse,
  PriceGraphResponse,
  AirportSearchResponse,
  CalendarPickerResponse
} from '../flight.types';

const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const BASE_URL = 'https://google-flights2.p.rapidapi.com/api/v1';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'x-rapidapi-key': RAPIDAPI_KEY,
    'x-rapidapi-host': 'google-flights2.p.rapidapi.com'
  }
});

// Search flights
export const searchFlights = async (params: FlightSearchParams): Promise<FlightSearchResponse> => {
  try {
    const response = await apiClient.get('/searchFlights', {
      params: {
        ...params,
        currency: params.currency || 'USD',
        language_code: params.language_code || 'en-US',
        country_code: params.country_code || 'US'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Flight search error:', error);
    throw error;
  }
};

// Search airport (for autocomplete)
export const searchAirport = async (query: string): Promise<AirportSearchResponse> => {
  try {
    const response = await apiClient.get('/searchAirport', {
      params: { 
        query,
        language_code: 'en-US',
        country_code: 'US'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Airport search error:', error);
    throw error;
  }
};

// Get price graph
// Get price graph
export const getPriceGraph = async (params: PriceGraphParams): Promise<PriceGraphResponse> => {
  try {
    const response = await apiClient.get('/getPriceGraph', {
      params: {
        departure_id: params.departure_id,
        arrival_id: params.arrival_id,
        outbound_date: params.outbound_date, // This was missing!
        return_date: params.return_date,
        start_date: params.start_date,
        end_date: params.end_date,
        adults: params.adults,
        children: params.children,
        infant_in_seat: params.infant_in_seat,
        infant_on_lap: params.infant_on_lap,
        travel_class: params.travel_class,
        currency: params.currency || 'USD',
        country_code: params.country_code || 'US'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Price graph error:', error);
    throw error;
  }
};

// Get calendar picker
export const getCalendarPicker = async (params: Omit<PriceGraphParams, 'return_date'>): Promise<CalendarPickerResponse> => {
  try {
    const response = await apiClient.get('/getCalendarPicker', {
      params: {
        ...params,
        currency: params.currency || 'USD',
        country_code: params.country_code || 'US'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Calendar picker error:', error);
    throw error;
  }
};
