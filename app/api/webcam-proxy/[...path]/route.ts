import { NextRequest } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  // Reconstruct the target URL using the path segments after /api/webcam-proxy/
  const targetPath = params.path.join('/')
  const targetUrl = `http://www.luckylablodge.com/${targetPath}`

  // Proxy the request to the target over HTTP
  const upstreamResponse = await fetch(targetUrl)

  // Pass through status and headers that make sense for MJPEG / images
  const headers = new Headers()
  headers.set('Content-Type', upstreamResponse.headers.get('Content-Type') || 'image/jpeg')
  headers.set('Cache-Control', 'no-store')

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers,
  })
} 