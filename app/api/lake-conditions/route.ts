import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lakeUrl = searchParams.get('url')

  if (!lakeUrl) {
    return NextResponse.json({ error: 'Missing lake URL parameter' }, { status: 400 })
  }

  try {
    console.log(`🔄 Fetching lake data from: ${lakeUrl}`)

    const response = await fetch(lakeUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
    })

    if (!response.ok) {
      console.error(`❌ HTTP Error: ${response.status} ${response.statusText}`)
      return NextResponse.json(
        {
          error: `Failed to fetch lake data: ${response.status} ${response.statusText}`,
          url: lakeUrl,
          status: response.status,
        },
        { status: response.status }
      )
    }

    const htmlText = await response.text()
    console.log(`📄 Received HTML length: ${htmlText.length} characters`)

    // Log a snippet of the HTML for debugging
    console.log(`📝 HTML snippet (first 500 chars): ${htmlText.substring(0, 500)}`)

    // Since we can't use cheerio in the edge runtime, let's use regex patterns
    // to extract data from the HTML

    // Enhanced patterns for lakemonster.com
    const lakemonsterPatterns = {
      // Look for temperature in various formats
      waterTemp: [
        /water\s*temperature[^>]*>([^<]*\d+[^<]*°?F?[^<]*)/i,
        /temp[^>]*>([^<]*\d+[^<]*°?F?[^<]*)/i,
        /(\d+)°F/g,
        /<td[^>]*>([^<]*\d+[^<]*°F[^<]*)<\/td>/i,
      ],
      // Wind patterns
      wind: [
        /wind[^>]*>([^<]*mph[^<]*)/i,
        /<td[^>]*>([^<]*\d+[^<]*mph[^<]*)<\/td>/i,
        /wind[^:]*:\s*([^<\n]*mph[^<\n]*)/i,
      ],
      // Weather condition patterns
      weather: [
        /condition[^>]*>([^<]*)/i,
        /(sunny|cloudy|clear|rain|storm|overcast|partly\s*cloudy|mostly\s*sunny)/i,
        /<td[^>]*>([^<]*(sunny|cloudy|clear|rain|storm|overcast)[^<]*)<\/td>/i,
      ],
    }

    // Extract temperature data with enhanced patterns
    let waterTemp = 'Data not found'
    for (const pattern of lakemonsterPatterns.waterTemp) {
      const matches = htmlText.match(pattern)
      if (matches) {
        if (pattern.global) {
          const tempMatches = [...htmlText.matchAll(pattern)]
          waterTemp = tempMatches[0]?.[0] || tempMatches[1]?.[0] || waterTemp
        } else {
          waterTemp = matches[1]?.trim() || matches[0]?.trim() || waterTemp
        }
        if (waterTemp !== 'Data not found') break
      }
    }

    // Extract wind data with enhanced patterns
    let wind = 'Data not found'
    for (const pattern of lakemonsterPatterns.wind) {
      const match = htmlText.match(pattern)
      if (match) {
        wind = match[1]?.trim() || match[0]?.trim() || wind
        if (wind !== 'Data not found') break
      }
    }

    // Extract weather condition with enhanced patterns
    let weather = 'Data not found'
    for (const pattern of lakemonsterPatterns.weather) {
      const match = htmlText.match(pattern)
      if (match) {
        weather = match[1]?.trim() || match[0]?.trim() || weather
        if (weather !== 'Data not found') break
      }
    }

    // Extract temperature data (legacy patterns for compatibility)
    const tempRegex = /(\d+)°F/g
    const tempMatches = [...htmlText.matchAll(tempRegex)]
    console.log(
      `🌡️ Found temperature matches:`,
      tempMatches.map(m => m[0])
    )

    // Extract wind data (legacy)
    const windRegex = /wind[^>]*>([^<]*mph[^<]*)/i
    const windMatch = htmlText.match(windRegex)
    console.log(`💨 Wind match:`, windMatch?.[1])

    // Extract visibility
    const visibilityRegex = /visibility[^>]*>([^<]*mi[^<]*)/i
    const visibilityMatch = htmlText.match(visibilityRegex)
    console.log(`👁️ Visibility match:`, visibilityMatch?.[1])

    // Extract weather condition (legacy)
    const weatherRegex = /(sunny|cloudy|clear|rain|storm|overcast|partly)/i
    const weatherMatch = htmlText.match(weatherRegex)
    console.log(`🌤️ Weather match:`, weatherMatch?.[1])

    // Extract fishing rating
    const fishingRegex = /(\d+)\/5|(\d+)\s*out\s*of\s*5/i
    const fishingMatch = htmlText.match(fishingRegex)
    console.log(`🎣 Fishing match:`, fishingMatch)

    // Extract humidity
    const humidityRegex = /humidity[^>]*>([^<]*%[^<]*)/i
    const humidityMatch = htmlText.match(humidityRegex)
    console.log(`💧 Humidity match:`, humidityMatch?.[1])

    console.log(`🔍 Enhanced extraction results:`, { waterTemp, wind, weather })

    const data = {
      waterTemp:
        waterTemp !== 'Data not found'
          ? waterTemp
          : tempMatches[1]?.[0] || tempMatches[0]?.[0] || 'Data not found',
      wind: wind !== 'Data not found' ? wind : windMatch?.[1]?.trim() || 'Data not found',
      visibility: visibilityMatch?.[1]?.trim() || 'Data not found',
      weather: weather !== 'Data not found' ? weather : weatherMatch?.[1] || 'Data not found',
      fishingRating: fishingMatch?.[1] || fishingMatch?.[2] || 'Data not found',
      lakeStatus: 'Open', // Default status
      humidity: humidityMatch?.[1]?.trim() || 'Data not found',
      cloudCover: 'Data not found',
      pressure: 'Data not found',
      currentTemp:
        waterTemp !== 'Data not found' ? waterTemp : tempMatches[0]?.[0] || 'Data not found',
      lastUpdated: new Date().toISOString(),
      sourceUrl: lakeUrl,
      // Include raw HTML snippet for debugging (first 1000 chars)
      debugHtml: htmlText.substring(0, 1000),
    }

    console.log(`✅ Extracted data:`, data)

    return NextResponse.json(data)
  } catch (error) {
    console.error('❌ Error in /api/lake-conditions:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'

    return NextResponse.json(
      {
        error: `Server-side fetch error: ${errorMessage}`,
        url: lakeUrl,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
