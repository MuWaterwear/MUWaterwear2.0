import { useState, useEffect } from 'react'

interface WaterTemperatureData {
  temperature: number | null
  unit: string
  lastUpdated: string
  source: string
  dataAvailable: boolean
  message: string | null
}

interface UseWaterTemperatureReturn {
  waterTemp: WaterTemperatureData | null
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useWaterTemperature(lakemonsterUrl: string): UseWaterTemperatureReturn {
  const [waterTemp, setWaterTemp] = useState<WaterTemperatureData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchWaterTemperature = async () => {
    if (!lakemonsterUrl) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/water-temperature?url=${encodeURIComponent(lakemonsterUrl)}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch water temperature')
      }

      const data = await response.json()
      setWaterTemp(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      console.error('Water temperature fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchWaterTemperature()
  }, [lakemonsterUrl])

  return {
    waterTemp,
    isLoading,
    error,
    refetch: fetchWaterTemperature
  }
} 