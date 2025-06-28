// Mobile-specific utility functions

/**
 * Check if the current device is mobile based on user agent
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false
  
  const userAgent = navigator.userAgent.toLowerCase()
  const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone']
  
  return mobileKeywords.some(keyword => userAgent.includes(keyword))
}

/**
 * Check if the current device is iOS
 */
export function isIOSDevice(): boolean {
  if (typeof window === 'undefined') return false
  
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
}

/**
 * Check if the current device is Android
 */
export function isAndroidDevice(): boolean {
  if (typeof window === 'undefined') return false
  
  return /Android/.test(navigator.userAgent)
}

/**
 * Check if the device supports touch
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false
  
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

/**
 * Get the device pixel ratio
 */
export function getDevicePixelRatio(): number {
  if (typeof window === 'undefined') return 1
  
  return window.devicePixelRatio || 1
}

/**
 * Format viewport dimensions for CSS
 */
export function getViewportDimensions() {
  if (typeof window === 'undefined') return { width: 0, height: 0 }
  
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

/**
 * Set CSS custom properties for dynamic viewport units
 */
export function setViewportUnits() {
  if (typeof window === 'undefined') return
  
  const vh = window.innerHeight * 0.01
  const vw = window.innerWidth * 0.01
  
  document.documentElement.style.setProperty('--vh', `${vh}px`)
  document.documentElement.style.setProperty('--vw', `${vw}px`)
}

/**
 * Prevent document body scroll (useful for modals)
 */
export function preventBodyScroll() {
  document.body.style.overflow = 'hidden'
  document.body.style.position = 'fixed'
  document.body.style.width = '100%'
}

/**
 * Allow document body scroll
 */
export function allowBodyScroll() {
  document.body.style.overflow = ''
  document.body.style.position = ''
  document.body.style.width = ''
}

/**
 * Throttle function calls (useful for scroll/resize events)
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Debounce function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(this, args), delay)
  }
}

/**
 * Convert touch event to mouse event coordinates
 */
export function getTouchCoordinates(e: TouchEvent): { x: number; y: number } {
  const touch = e.touches[0] || e.changedTouches[0]
  return {
    x: touch.clientX,
    y: touch.clientY,
  }
}

/**
 * Calculate swipe direction and distance
 */
export function calculateSwipe(
  startPos: { x: number; y: number },
  endPos: { x: number; y: number },
  threshold: number = 50
): {
  direction: 'left' | 'right' | 'up' | 'down' | null
  distance: number
  isSwipe: boolean
} {
  const deltaX = endPos.x - startPos.x
  const deltaY = endPos.y - startPos.y
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
  
  if (distance < threshold) {
    return { direction: null, distance, isSwipe: false }
  }
  
  const absDeltaX = Math.abs(deltaX)
  const absDeltaY = Math.abs(deltaY)
  
  let direction: 'left' | 'right' | 'up' | 'down'
  
  if (absDeltaX > absDeltaY) {
    direction = deltaX > 0 ? 'right' : 'left'
  } else {
    direction = deltaY > 0 ? 'down' : 'up'
  }
  
  return { direction, distance, isSwipe: true }
}

/**
 * Trigger haptic feedback if available
 */
export function triggerHapticFeedback(
  pattern: number | number[] = 10
): void {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern)
  }
}

/**
 * Check if the device is in landscape mode
 */
export function isLandscape(): boolean {
  if (typeof window === 'undefined') return false
  
  return window.innerWidth > window.innerHeight
}

/**
 * Check if the device is in portrait mode
 */
export function isPortrait(): boolean {
  return !isLandscape()
}

/**
 * Get safe area insets for devices with notches
 */
export function getSafeAreaInsets() {
  if (typeof window === 'undefined') return { top: 0, right: 0, bottom: 0, left: 0 }
  
  const computedStyle = getComputedStyle(document.documentElement)
  
  return {
    top: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-top)')) || 0,
    right: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-right)')) || 0,
    bottom: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-bottom)')) || 0,
    left: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-left)')) || 0,
  }
} 