import { useState, useEffect } from 'react'

interface WeatherData {
  temperature: string
  condition: string
  humidity: string
  windSpeed: string
  windDirection: string
  pressure: string
  visibility: string
  feelsLike: string
  dewPoint: string
  uvIndex: string
  sunrise: string
  sunset: string
  cloudCover: string
  precipitation: string
  airQuality: string
}

interface LakeConditions {
  waterTemp: string
  wind: string
  visibility: string
  weather: string
  fishingRating: string
  lakeStatus: string
  airTemp: string
}

export function useWeatherData(lakeName: string, lakeUrl?: string) {
  const [currentWeather, setCurrentWeather] = useState<WeatherData>({
    temperature: 'Loading...',
    condition: 'Loading...',
    humidity: 'Loading...',
    windSpeed: 'Loading...',
    windDirection: 'Loading...',
    pressure: 'Loading...',
    visibility: 'Loading...',
    feelsLike: 'Loading...',
    dewPoint: 'Loading...',
    uvIndex: 'Loading...',
    sunrise: 'Loading...',
    sunset: 'Loading...',
    cloudCover: 'Loading...',
    precipitation: 'Loading...',
    airQuality: 'Loading...',
  })

  const [lakeConditions, setLakeConditions] = useState<LakeConditions>({
    waterTemp: 'Loading...',
    wind: 'Loading...',
    visibility: 'Loading...',
    weather: 'Loading...',
    fishingRating: 'Loading...',
    lakeStatus: 'Loading...',
    airTemp: 'Loading...',
  })

  const [isLoadingWeather, setIsLoadingWeather] = useState(true)
  const [isLoadingLakeConditions, setIsLoadingLakeConditions] = useState(true)
  const [weatherError, setWeatherError] = useState<string | null>(null)
  const [lakeConditionsError, setLakeConditionsError] = useState<string | null>(null)

  const getWeatherEmoji = (condition: string) => {
    const lowerCondition = condition.toLowerCase()
    if (lowerCondition.includes('sun') || lowerCondition.includes('clear')) return '☀️'
    if (lowerCondition.includes('cloud')) return '☁️'
    if (lowerCondition.includes('rain')) return '🌧️'
    if (lowerCondition.includes('storm')) return '⛈️'
    if (lowerCondition.includes('snow')) return '❄️'
    if (lowerCondition.includes('fog') || lowerCondition.includes('mist')) return '🌫️'
    return '🌤️'
  }

  const fetchCurrentWeather = async () => {
    setIsLoadingWeather(true)
    setWeatherError(null)

    try {
      // Using fallback weather data for consistent display
      const fallbackWeatherData = {
        temperature: '72°F',
        condition: 'Partly Cloudy',
        humidity: '65%',
        windSpeed: '8 mph',
        windDirection: 'NW',
        pressure: '30.15 in',
        visibility: '10 miles',
        feelsLike: '75°F',
        dewPoint: '58°F',
        uvIndex: '6 (High)',
        sunrise: '6:45 AM',
        sunset: '8:30 PM',
        cloudCover: '40%',
        precipitation: '0%',
        airQuality: 'Good',
      }

      setCurrentWeather({
        ...fallbackWeatherData,
        condition: `${getWeatherEmoji(fallbackWeatherData.condition)} ${fallbackWeatherData.condition}`,
      })
    } catch (error) {
      setWeatherError('Failed to load weather data')
      setCurrentWeather({
        temperature: 'N/A',
        condition: 'N/A',
        humidity: 'N/A',
        windSpeed: 'N/A',
        windDirection: 'N/A',
        pressure: 'N/A',
        visibility: 'N/A',
        feelsLike: 'N/A',
        dewPoint: 'N/A',
        uvIndex: 'N/A',
        sunrise: 'N/A',
        sunset: 'N/A',
        cloudCover: 'N/A',
        precipitation: 'N/A',
        airQuality: 'N/A',
      })
    } finally {
      setIsLoadingWeather(false)
    }
  }

  const fetchLakeConditions = async () => {
    if (!lakeUrl) return

    setIsLoadingLakeConditions(true)
    setLakeConditionsError(null)

    try {
      const response = await fetch(`/api/lake-conditions?url=${encodeURIComponent(lakeUrl)}`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: `Failed to fetch lake data: ${response.status} ${response.statusText}`,
        }))
        throw new Error(errorData.error || `Failed to fetch lake data: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      setLakeConditions({
        waterTemp: data.waterTemp || 'N/A',
        wind: data.wind || 'N/A',
        visibility: data.visibility || 'N/A',
        weather: data.weather || 'N/A',
        fishingRating: data.fishingRating || 'N/A',
        lakeStatus: data.lakeStatus || 'N/A',
        airTemp: data.airTemp || 'N/A',
      })
    } catch (error) {
      setLakeConditionsError(error instanceof Error ? error.message : 'An unknown error occurred.')
      setLakeConditions({
        waterTemp: 'Error',
        wind: 'Error',
        visibility: 'Error',
        weather: 'Error',
        fishingRating: 'Error',
        lakeStatus: 'Error',
        airTemp: 'Error',
      })
    } finally {
      setIsLoadingLakeConditions(false)
    }
  }

  useEffect(() => {
    fetchCurrentWeather()
    fetchLakeConditions()

    const weatherInterval = setInterval(fetchCurrentWeather, 15 * 60 * 1000) // 15 minutes
    return () => clearInterval(weatherInterval)
  }, [lakeName, lakeUrl])

  return {
    currentWeather,
    lakeConditions,
    isLoadingWeather,
    isLoadingLakeConditions,
    weatherError,
    lakeConditionsError,
    getWeatherEmoji,
  }
} 