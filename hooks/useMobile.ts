'use client'

import { useState, useEffect } from 'react'

interface MobileInfo {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  screenWidth: number
  screenHeight: number
  orientation: 'portrait' | 'landscape'
  isIOS: boolean
  isAndroid: boolean
  isTouchDevice: boolean
  devicePixelRatio: number
}

export function useMobile(): MobileInfo {
  const [mobileInfo, setMobileInfo] = useState<MobileInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenWidth: 1024,
    screenHeight: 768,
    orientation: 'landscape',
    isIOS: false,
    isAndroid: false,
    isTouchDevice: false,
    devicePixelRatio: 1,
  })

  useEffect(() => {
    const updateMobileInfo = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const userAgent = navigator.userAgent.toLowerCase()

      const isMobile = width < 768
      const isTablet = width >= 768 && width < 1024
      const isDesktop = width >= 1024
      const orientation = width > height ? 'landscape' : 'portrait'
      const isIOS = /iphone|ipad|ipod/.test(userAgent)
      const isAndroid = /android/.test(userAgent)
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const devicePixelRatio = window.devicePixelRatio || 1

      setMobileInfo({
        isMobile,
        isTablet,
        isDesktop,
        screenWidth: width,
        screenHeight: height,
        orientation,
        isIOS,
        isAndroid,
        isTouchDevice,
        devicePixelRatio,
      })
    }

    // Initial update
    updateMobileInfo()

    // Listen for resize events
    window.addEventListener('resize', updateMobileInfo)
    window.addEventListener('orientationchange', updateMobileInfo)

    // Cleanup event listeners
    return () => {
      window.removeEventListener('resize', updateMobileInfo)
      window.removeEventListener('orientationchange', updateMobileInfo)
    }
  }, [])

  return mobileInfo
}

// Hook for detecting swipe gestures
export function useSwipeGesture(
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  onSwipeUp?: () => void,
  onSwipeDown?: () => void,
  threshold: number = 50
) {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    })
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    })
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const deltaX = touchStart.x - touchEnd.x
    const deltaY = touchStart.y - touchEnd.y
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    // Determine if it's a horizontal or vertical swipe
    if (absDeltaX > absDeltaY) {
      // Horizontal swipe
      if (absDeltaX > threshold) {
        if (deltaX > 0) {
          onSwipeLeft?.()
        } else {
          onSwipeRight?.()
        }
      }
    } else {
      // Vertical swipe
      if (absDeltaY > threshold) {
        if (deltaY > 0) {
          onSwipeUp?.()
        } else {
          onSwipeDown?.()
        }
      }
    }
  }

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  }
}

// Hook for managing mobile viewport height
export function useMobileViewport() {
  const [viewportHeight, setViewportHeight] = useState(0)

  useEffect(() => {
    const updateViewportHeight = () => {
      // Use visual viewport API if available, otherwise fall back to window height
      const height = window.visualViewport?.height || window.innerHeight
      setViewportHeight(height)

      // Set CSS custom property for dynamic viewport height
      document.documentElement.style.setProperty('--vh', `${height * 0.01}px`)
    }

    updateViewportHeight()

    // Listen for viewport changes (useful for mobile keyboards)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateViewportHeight)
    }

    window.addEventListener('resize', updateViewportHeight)
    window.addEventListener('orientationchange', updateViewportHeight)

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateViewportHeight)
      }
      window.removeEventListener('resize', updateViewportHeight)
      window.removeEventListener('orientationchange', updateViewportHeight)
    }
  }, [])

  return viewportHeight
}

// Hook for detecting if keyboard is open on mobile
export function useMobileKeyboard() {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false)

  useEffect(() => {
    const initialHeight = window.innerHeight

    const handleResize = () => {
      const currentHeight = window.innerHeight
      const heightDifference = initialHeight - currentHeight

      // If height decreased by more than 150px, assume keyboard is open
      setIsKeyboardOpen(heightDifference > 150)
    }

    window.addEventListener('resize', handleResize)

    // For iOS Safari, also listen to visual viewport changes
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize)
    }

    return () => {
      window.removeEventListener('resize', handleResize)
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize)
      }
    }
  }, [])

  return isKeyboardOpen
}

// Hook for haptic feedback (if available)
export function useHapticFeedback() {
  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'selection' = 'light') => {
    if ('vibrate' in navigator) {
      switch (type) {
        case 'light':
          navigator.vibrate(10)
          break
        case 'medium':
          navigator.vibrate(20)
          break
        case 'heavy':
          navigator.vibrate(40)
          break
        case 'selection':
          navigator.vibrate(5)
          break
      }
    }
  }

  return { triggerHaptic }
}
