import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Handle image requests with URL-encoded file names
  if (request.nextUrl.pathname.startsWith('/images/')) {
    const url = request.nextUrl.clone()
    
    // Decode the pathname to handle spaces and special characters
    const decodedPathname = decodeURIComponent(url.pathname)
    
    // If the decoded path is different from the original, rewrite to the decoded version
    if (decodedPathname !== url.pathname) {
      url.pathname = decodedPathname
      return NextResponse.rewrite(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/images/:path*'
} 