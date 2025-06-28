"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ExternalLink, RefreshCw } from "lucide-react"

export default function WebcamViewer() {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="aspect-video bg-gray-900 relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image src="/images/lindbergh-lake-aerial.jpg" alt="Lindbergh Lake" fill className="object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60" />
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-gray-800/80 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </div>

        <h3 className="text-2xl font-bold text-white mb-3">Live Webcam</h3>

        <div className="bg-blue-900/60 border border-blue-600/50 rounded-lg p-4 mb-6 max-w-md backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-blue-200 font-medium text-sm uppercase tracking-wide">Security Notice</span>
          </div>
          <p className="text-blue-100 text-sm leading-relaxed">
            The webcam feed requires HTTP access, but this site uses secure HTTPS. For security reasons, browsers block
            mixed content.
          </p>
        </div>

        <div className="space-y-4">
          <a
            href="http://www.luckylablodge.com/mjpg/video.mjpg"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-black px-4 py-2 rounded text-sm font-medium transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Open Webcam in New Tab
          </a>

          <div className="bg-gray-800/60 rounded-lg p-4 backdrop-blur-sm">
            <h4 className="text-white font-medium mb-2">Current Lake Conditions</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-cyan-400 font-bold">55°F</div>
                <div className="text-gray-300">Water Temp</div>
              </div>
              <div className="text-center">
                <div className="text-cyan-400 font-bold">8 mph</div>
                <div className="text-gray-300">Wind</div>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-400 max-w-sm">
            <p>
              To view the live webcam feed directly, click the button above. The webcam uses HTTP which must be opened
              in a separate tab.
            </p>
          </div>
        </div>
      </div>

      {/* Status indicator */}
      <div className="absolute top-4 right-4">
        <div className="bg-black/70 text-white text-xs px-3 py-1 rounded-full flex items-center gap-2">
          <RefreshCw className="w-3 h-3 animate-spin" />
          <span>Live data available</span>
        </div>
      </div>

      {/* Timestamp */}
      <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded">
        Current time: {currentTime}
      </div>
    </div>
  )
}
