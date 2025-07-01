import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  // Support both 'q' and 'location' parameters for backwards compatibility
  const location = searchParams.get('q') || searchParams.get('location');
  const apiKey = process.env.WEATHERAPI_KEY;

  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Weather API Key (first 10 chars):', apiKey?.substring(0, 10) || 'undefined');
  }

  if (!location) {
    return NextResponse.json({ error: 'Location is required' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no`,
      { next: { revalidate: 300 } } // Cache for 5 minutes
    );

    if (!response.ok) {
      const errorData = await response.text();
      if (process.env.NODE_ENV === 'development') {
        console.error('Weather API Error Response:', errorData);
      }
      return NextResponse.json(
        { error: 'Failed to fetch weather data', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Map location names to USGS sites for water temperature
    const locationToUsgsSite: Record<string, string> = {
      'Detroit Lake, OR': '14180500',
      'Flathead Lake, MT': '12371550',
      'Coeur d\'Alene, ID': '12415500',
      'Lake Washington, WA': '12110000',
      'Lindbergh Lake, MT': '12372000',
      'Lake Tahoe, CA': '10336660',
    };

    // Also keep zip code mapping for backwards compatibility
    const zipToUsgsSite: Record<string, string> = {
      '97342': '14180500', // Detroit Lake
      '59911': '12371550', // Flathead Lake
      '83814': '12415500', // Coeur d'Alene Lake
      '98115': '12110000', // Lake Washington
      '59863': '12372000', // Lindbergh Lake
      '96161': '10336660', // Lake Tahoe
    };

    // Try to find USGS site ID
    let siteId = locationToUsgsSite[location] || zipToUsgsSite[location];

    if (siteId) {
      try {
        const usgsResp = await fetch(
          `https://waterservices.usgs.gov/nwis/iv/?sites=${siteId}&parameterCd=00010&format=json&siteStatus=all`
        )

        if (usgsResp.ok) {
          const usgsJson = await usgsResp.json()
          const tempCStr =
            usgsJson?.value?.timeSeries?.[0]?.values?.[0]?.value?.[0]?.value || null

          const tempC = tempCStr ? parseFloat(tempCStr) : NaN

          if (!isNaN(tempC)) {
            const tempF = tempC * 9/5 + 32
            data.current.water_temp_f = Math.round(tempF)
          }
        }
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Failed to fetch USGS water temp', err)
        }
      }
    }

    if (!data.current.water_temp_f) {
      // fallback placeholder if live temp unavailable
      data.current.water_temp_f = 65
    }

    return NextResponse.json(data);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Unexpected Weather API Error:', error);
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 