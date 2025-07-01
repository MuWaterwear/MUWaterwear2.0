'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface WebcamPlayerProps {
  src: string
  title: string
  placeholderImage: string
  webcamUrls: string[]
  apiSource: string
}

export default function WebcamPlayer({ 
  src, 
  title, 
  placeholderImage, 
  webcamUrls, 
  apiSource 
}: WebcamPlayerProps) {
  const [showFallback, setShowFallback] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isRetrying, setIsRetrying] = useState(false)

  const openInNewWindow = () => {
    webcamUrls.forEach((url, index) => {
      setTimeout(() => {
        window.open(url, `webcam_${index}`, 'width=800,height=600,scrollbars=yes,resizable=yes')
      }, index * 500)
    })
  }

  const handleIframeLoad = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
    setIsLoaded(true)
    setErrorMessage(null)
    const iframe = e.currentTarget
    try {
      if (iframe.contentDocument?.body?.innerHTML === '') {
        setShowFallback(true)
        setErrorMessage('Webcam content unavailable')
      }
    } catch (error) {
      // Cross-origin webcam detected (this is normal)
    }
  }

  const handleIframeError = () => {
    setShowFallback(true)
    setErrorMessage('Failed to load webcam feed')
  }

  const retryWebcam = async () => {
    setIsRetrying(true)
    setErrorMessage(null)
    setShowFallback(false)
    setIsLoaded(false)

    try {
      const response = await fetch(`/api/webcam?source=${apiSource}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
      }

      setShouldLoad(false)
      setTimeout(() => setShouldLoad(true), 100)
    } catch (error) {
      setShowFallback(true)
      setErrorMessage(error instanceof Error ? error.message : 'Retry failed')
    } finally {
      setIsRetrying(false)
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    const container = document.getElementById('webcam-container')
    if (container) {
      observer.observe(container)
    }

    return () => observer.disconnect()
  }, [])

  if (showFallback) {
    return (
      <div
        id="webcam-container"
        className="relative w-full h-full bg-gray-900 overflow-hidden cursor-pointer group"
        onClick={openInNewWindow}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="button"
        tabIndex={0}
        aria-label="Open live webcam in new window"
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            openInNewWindow()
          }
        }}
      >
        <div className="absolute inset-0">
          <Image
            src={placeholderImage}
            alt={`${title} placeholder view`}
            fill
            className="object-cover opacity-70 transition-transform duration-500 group-hover:scale-105"
            priority={false}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 md:p-6 text-center">
          <div className="bg-black/70 backdrop-blur-sm rounded-lg p-4 md:p-6 max-w-sm w-full">
            <div className="text-red-400 mb-3">
              <svg className="w-6 h-6 md:w-8 md:h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-white font-medium text-sm md:text-base mb-2">Webcam Unavailable</h3>
            {errorMessage && <p className="text-gray-300 text-xs md:text-sm mb-4">{errorMessage}</p>}
            <div className="space-y-2">
              <button
                onClick={e => {
                  e.stopPropagation()
                  retryWebcam()
                }}
                disabled={isRetrying}
                className="bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-colors w-full"
              >
                {isRetrying ? 'Retrying...' : 'Retry Connection'}
              </button>
              <button
                onClick={openInNewWindow}
                className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-colors w-full"
              >
                Open Direct Link
              </button>
            </div>
          </div>
        </div>

        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isHovered && !errorMessage ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 md:p-4 border border-white/20 hover:bg-white/20 transition-colors focus:ring-2 focus:ring-white/50 focus:outline-none">
            <svg
              className="h-6 w-6 md:h-8 md:w-8 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
            <span className="sr-only">Play webcam feed</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      id="webcam-container"
      className="relative w-full h-full overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!isLoaded && (
        <div className="absolute inset-0 md:inset-6 bg-gray-900 rounded-lg flex items-center justify-center">
          <div className="text-white font-light text-sm md:text-base">Loading live feed...</div>
        </div>
      )}

      <div className="absolute inset-0 md:inset-6 bg-black rounded-lg">
        {shouldLoad && (
          <iframe
            src={src}
            className="w-full h-full border-0 bg-transparent rounded-lg"
            allowFullScreen
            title={title}
            referrerPolicy="no-referrer"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            loading="lazy"
            scrolling="no"
            style={{
              objectFit: 'cover',
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              overflow: 'hidden',
            }}
            aria-label={`Live webcam feed from ${title}`}
          />
        )}
      </div>
    </div>
  )
} 