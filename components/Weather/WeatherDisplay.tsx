'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useWeather } from '@/hooks/useWeather';
import { useWaterTemperature } from '@/hooks/useWaterTemperature';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThermometerIcon } from 'lucide-react';

interface WeatherDisplayProps {
  location: string;
  lakemonsterUrl?: string;
  className?: string;
  onDataLoaded?: (weatherData: any) => void;
}

export function WeatherDisplay({ 
  location, 
  lakemonsterUrl = '',
  className = '',
  onDataLoaded
}: WeatherDisplayProps) {
  const [currentLocation, setCurrentLocation] = useState(location);
  const { weatherData, isLoading, error } = useWeather(currentLocation);
  const { waterTemp, isLoading: waterTempLoading, error: waterTempError, refetch: refetchWaterTemp } = useWaterTemperature(lakemonsterUrl);

  // Trigger onDataLoaded when weather data is available
  useEffect(() => {
    if (weatherData && onDataLoaded) {
      onDataLoaded(weatherData);
    }
  }, [weatherData, onDataLoaded]);

  const handleRefresh = () => {
    setCurrentLocation(location); // Force re-fetch
    refetchWaterTemp(); // Also refresh water temperature
  };

  if (isLoading) {
    return (
      <Card className={`p-6 bg-gray-50 ${className}`}>
        <div className="flex items-center justify-center space-x-4 animate-pulse">
          <div className="w-full text-center">
            <div className="h-6 bg-gray-200 rounded mb-4 mx-auto w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2 mx-auto w-1/2"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`p-6 bg-red-50 text-red-800 ${className}`}>
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Weather Data Unavailable</h3>
          <p className="mb-4">{error}</p>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleRefresh}
          >
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  if (!weatherData) {
    return (
      <Card className={`p-6 bg-gray-50 ${className}`}>
        <div className="text-center text-gray-500">
          No weather data available
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-6 bg-white shadow-md ${className}`}>
      <div className="flex flex-col space-y-4">
        {/* Location and Condition */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-primary">
              {weatherData.location.name}, {weatherData.location.region}
            </h3>
            <p className="text-sm text-muted-foreground">
              {weatherData.current.condition.text}
            </p>
          </div>
          {weatherData.current.condition.icon && (
            <Image 
              src={`https:${weatherData.current.condition.icon}`} 
              alt={weatherData.current.condition.text}
              width={64} 
              height={64} 
              className="w-16 h-16"
            />
          )}
        </div>
        
        {/* Temperature and Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-4xl font-bold text-primary">
              {weatherData.current.temp_f}°F
            </p>
            <p className="text-sm text-muted-foreground">
              Feels like {weatherData.current.feels_like_f}°F
            </p>
          </div>
          
          <div className="text-sm space-y-1">
            <p>
              <span className="font-semibold">Humidity:</span> {weatherData.current.humidity}%
            </p>
            <p>
              <span className="font-semibold">Wind:</span> {weatherData.current.wind_mph} mph {weatherData.current.wind_direction}
            </p>
            <p>
              <span className="font-semibold">Pressure:</span> {weatherData.current.pressure_in} in
            </p>
          </div>
        </div>

        {/* Water Temperature */}
        <div className="bg-blue-900/30 p-6 rounded-lg flex items-center justify-between border border-blue-700/50">
          <div className="flex items-center space-x-4">
            <ThermometerIcon className="w-8 h-8 text-blue-400" />
            <div>
              <h4 className="text-lg font-semibold text-blue-300">Lake Water Temperature</h4>
              <p className="text-xs text-blue-200/70">
                {waterTempLoading && 'Loading water temperature...'}
                {waterTempError && 'Temperature data unavailable'}
                {waterTemp?.dataAvailable === false && 'Water temp not available from source'}
                {waterTemp?.dataAvailable === true && 'Live data'}
              </p>
            </div>
          </div>
          <div className="text-right">
            {waterTempLoading ? (
              <div className="w-16 h-12 bg-blue-800/50 animate-pulse rounded"></div>
            ) : (
              <>
                <p className="text-4xl font-bold text-blue-300">
                  {waterTemp?.temperature && waterTemp?.dataAvailable ? 
                    `${waterTemp.temperature}°${waterTemp.unit}` : 
                    'N/A'}
                </p>
                {waterTemp?.message && (
                  <p className="text-xs text-blue-200/60 mt-1 max-w-24 text-center">
                    {waterTemp.message}
                  </p>
                )}
              </>
            )}
            {waterTemp?.lastUpdated && (
              <p className="text-xs text-blue-200/50 mt-1">
                Updated: {new Date(waterTemp.lastUpdated).toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex justify-between items-center border-t pt-2 mt-2">
          <p className="text-xs text-muted-foreground">
            Last updated: {weatherData.current.last_updated}
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
          >
            Refresh
          </Button>
        </div>
      </div>
    </Card>
  );
} 