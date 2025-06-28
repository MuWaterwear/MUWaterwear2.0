"use client"

import { ReactNode } from 'react'
import { useMobile } from '../hooks/useMobile'
import MobileNavigation from './MobileNavigation'
import MobileShoppingCart from './MobileShoppingCart'
import { useCart } from '@/contexts/CartContext'

interface ResponsiveLayoutProps {
  children: ReactNode
  mobileNavigation?: boolean
  mobileCart?: boolean
  className?: string
}

export default function ResponsiveLayout({ 
  children, 
  mobileNavigation = true, 
  mobileCart = true,
  className = "" 
}: ResponsiveLayoutProps) {
  const { isMobile } = useMobile()
  const { setIsCartOpen } = useCart()

  return (
    <div className={`min-h-screen bg-black text-white ${className}`}>
      {/* Mobile Navigation */}
      {isMobile && mobileNavigation && (
        <MobileNavigation onCartOpen={() => setIsCartOpen(true)} />
      )}
      
      {/* Main Content */}
      <main className={isMobile ? 'mobile-content' : 'desktop-content'}>
        {children}
      </main>
      
      {/* Mobile Shopping Cart */}
      {isMobile && mobileCart && <MobileShoppingCart />}
    </div>
  )
}

// Helper component for conditional rendering based on screen size
interface ResponsiveProps {
  mobile?: ReactNode
  desktop?: ReactNode
  tablet?: ReactNode
}

export function Responsive({ mobile, desktop, tablet }: ResponsiveProps) {
  const { isMobile, isTablet, isDesktop } = useMobile()

  if (isMobile && mobile) {
    return <>{mobile}</>
  }
  
  if (isTablet && tablet) {
    return <>{tablet}</>
  }
  
  if (isDesktop && desktop) {
    return <>{desktop}</>
  }

  // Fallback to desktop if no mobile/tablet variant provided
  return <>{desktop}</>
}

// Higher-order component for mobile-only rendering
export function MobileOnly({ children }: { children: ReactNode }) {
  const { isMobile } = useMobile()
  return isMobile ? <>{children}</> : null
}

// Higher-order component for desktop/tablet-only rendering
export function DesktopOnly({ children }: { children: ReactNode }) {
  const { isDesktop, isTablet } = useMobile()
  return (isDesktop || isTablet) ? <>{children}</> : null
}

// Component for mobile-optimized hero sections
interface MobileHeroProps {
  backgroundImage?: string
  backgroundVideo?: string
  title: string
  subtitle?: string
  ctaText?: string
  onCtaClick?: () => void
  overlay?: ReactNode
  className?: string
}

export function MobileHero({
  backgroundImage,
  backgroundVideo,
  title,
  subtitle,
  ctaText,
  onCtaClick,
  overlay,
  className = ""
}: MobileHeroProps) {
  const { isMobile } = useMobile()

  if (!isMobile) return null

  return (
    <section className={`relative mobile-viewport-height flex flex-col items-center justify-center overflow-hidden ${className}`}>
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {backgroundVideo ? (
          <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={backgroundVideo} type="video/mp4" />
          </video>
        ) : backgroundImage ? (
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
      </div>

      {/* Content */}
      <div className="relative z-20 text-center px-6 max-w-lg mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl text-gray-300 mb-8 font-light leading-relaxed">
            {subtitle}
          </p>
        )}
        {ctaText && onCtaClick && (
          <button
            onClick={onCtaClick}
            className="bg-cyan-400 hover:bg-cyan-500 text-black font-bold px-8 py-4 rounded-full text-lg shadow-lg shadow-cyan-400/20 transition-all hover:shadow-cyan-400/30 touch-manipulation"
          >
            {ctaText}
          </button>
        )}
      </div>

      {/* Custom Overlay */}
      {overlay && (
        <div className="absolute inset-0 z-30">
          {overlay}
        </div>
      )}
    </section>
  )
}

// Component for mobile-optimized sections
interface MobileSectionProps {
  children: ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  background?: 'transparent' | 'gray' | 'dark'
}

export function MobileSection({ 
  children, 
  className = "", 
  padding = 'md',
  background = 'transparent' 
}: MobileSectionProps) {
  const { isMobile } = useMobile()

  if (!isMobile) return <>{children}</>

  const paddingClasses = {
    none: '',
    sm: 'py-8 px-4',
    md: 'py-12 px-4',
    lg: 'py-20 px-6'
  }

  const backgroundClasses = {
    transparent: '',
    gray: 'bg-gray-900/50',
    dark: 'bg-gray-900'
  }

  return (
    <section className={`${paddingClasses[padding]} ${backgroundClasses[background]} ${className}`}>
      {children}
    </section>
  )
} 