import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['api.wetmet.net', 'vauth.command.verkada.com', 'www.luckylablodge.com', 'luckylablodge.com'],
    unoptimized: true,
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
    ];
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
    ];
  },
  serverExternalPackages: [],
};

export default nextConfig;
