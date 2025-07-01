import { useState, useEffect, useCallback } from 'react';
import { WeatherData } from '@/lib/types/weather';

export function useWeather(location: string = 'auto:ip', updateInterval: number = 300000) { // Default 5 minutes
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/weather?q=${encodeURIComponent(location)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data: WeatherData = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [location]);

  useEffect(() => {
    // Initial fetch
    fetchWeather();

    // Set up periodic updates
    const intervalId = setInterval(fetchWeather, updateInterval);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [fetchWeather, updateInterval]);

  return { weatherData, isLoading, error, refetch: fetchWeather };
} 