import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: [
      'api.wetmet.net',
      'vauth.command.verkada.com',
      'www.luckylablodge.com',
      'luckylablodge.com',
    ],
  },
  async headers() {
    return [
      {
        // Apply these headers to all API routes
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
          {
            key: 'Access-Control-Max-Age',
            value: '86400',
          },
        ],
      },
      {
        // Apply security headers for webcam embedding
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=*, microphone=*, display-capture=*, fullscreen=*, geolocation=*',
          },
        ],
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/webcam-proxy/wetmet/:path*',
        destination: 'https://api.wetmet.net/:path*',
      },
      {
        source: '/webcam-proxy/luckylablodge/:path*',
        destination: 'http://www.luckylablodge.com/:path*',
      },
      // Route image requests through API for proper URL decoding
      {
        source: '/images/:path*',
        destination: '/api/images/:path*',
      },
    ]
  },
  serverExternalPackages: [],
}

export default nextConfig
