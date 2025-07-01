import { type NextRequest, NextResponse } from 'next/server'

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  })
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const source = searchParams.get('source') || 'wetmet'

  // Multiple webcam sources to try - WetMet as primary
  const webcamSources = {
    wetmet: 'https://api.wetmet.net/client-content/PlayerFrame.php?CAMERA=162-02-01',
    verkada: 'https://vauth.command.verkada.com/embed/html/8ec1dcee-9b56-4a30-a7ef-8fe081dd7b9d/',
    luckylablodge: 'http://www.luckylablodge.com/mjpg/video.mjpg',
    // Legacy default for backwards compatibility
    default: 'https://api.wetmet.net/client-content/PlayerFrame.php?CAMERA=162-02-01',
  }

  try {
    console.log(`🔄 Attempting to stream from webcam source: ${source}`)

    const webcamUrl = webcamSources[source as keyof typeof webcamSources] || webcamSources.wetmet

    const response = await fetch(webcamUrl, {
      method: 'GET',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'iframe',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'cross-site',
      },
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })

    if (!response.ok) {
      // Handle specific permission errors
      if (response.status === 403) {
        throw new Error('Access forbidden - insufficient permissions')
      } else if (response.status === 401) {
        throw new Error('Authentication required')
      } else if (response.status === 404) {
        throw new Error('Webcam feed not found')
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    }

    console.log('✅ Successfully connected to webcam stream')

    // Return the stream with proper CORS headers
    return new NextResponse(response.body, {
      status: 200,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'text/html',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'X-Frame-Options': 'SAMEORIGIN',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error) {
    console.log(
      `❌ Webcam stream error: ${error instanceof Error ? error.message : 'Unknown error'}`
    )

    // Determine error type and provide appropriate response
    let errorMessage = 'Unable to connect to live webcam feed'
    let statusCode = 503

    if (error instanceof Error) {
      if (error.message.includes('permissions') || error.message.includes('forbidden')) {
        errorMessage = 'Insufficient permissions to access webcam feed'
        statusCode = 403
      } else if (error.message.includes('Authentication')) {
        errorMessage = 'Authentication required for webcam access'
        statusCode = 401
      } else if (error.message.includes('not found')) {
        errorMessage = 'Webcam feed not available'
        statusCode = 404
      } else if (error.name === 'TimeoutError') {
        errorMessage = 'Webcam feed timed out'
        statusCode = 408
      }
    }

    return new NextResponse(
      JSON.stringify({
        error: 'Webcam stream unavailable',
        message: errorMessage,
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        availableSources: Object.keys(webcamSources),
        suggestions: [
          'Try refreshing the page',
          'Try a different webcam source',
          'Check if the webcam is online',
          'Use the direct webcam link in a new tab',
        ],
      }),
      {
        status: statusCode,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    )
  }
}
