'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { ShoppingCart, Menu, Waves, Mountain, Anchor, Droplets, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useCart } from '@/contexts/CartContext'

import MobileNavigation from '@/components/responsive/MobileNavigation'
import NavigationBar from '@/components/NavigationBar'
import NewsletterSignup from '@/components/NewsletterSignup'
import UserAccountButton from '@/components/UserAccountButton'
import Head from 'next/head'
import { Responsive, MobileOnly, DesktopOnly } from '@/components/responsive/ResponsiveLayout'
import Footer from '@/components/Footer'

export default function Component() {
  const { setIsCartOpen, getCartItemCount } = useCart()
  const [showContactEmail, setShowContactEmail] = useState(false)
  const [showReturnsPolicy, setShowReturnsPolicy] = useState(false)
  const [showShippingPolicy, setShowShippingPolicy] = useState(false)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Wave animation background
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes wave {
        0% { transform: translateX(0) translateZ(0) scaleY(1) }
        50% { transform: translateX(-25%) translateZ(0) scaleY(0.8) }
        100% { transform: translateX(-50%) translateZ(0) scaleY(1) }
      }
      .wave-bg {
        background: linear-gradient(180deg, transparent 0%, rgba(6, 182, 212, 0.03) 50%, transparent 100%);
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <>
      <Head>
        <link
          rel="preload"
          href="/videos/main-page-background.mp4"
          as="video"
          type="video/mp4"
        />
      </Head>
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Subtle wave background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-20">
          <svg
            className="absolute bottom-0 w-full h-96"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path
              fill="url(#oceanGradient)"
              fillOpacity="0.1"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              style={{ animation: 'wave 20s ease-in-out infinite' }}
            />
            <defs>
              <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0891B2" />
                <stop offset="100%" stopColor="#0C4A6E" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      {/* Desktop Navigation */}
      <DesktopOnly>
        <NavigationBar onMobileMenuOpen={() => setMobileFiltersOpen(true)} />
      </DesktopOnly>

      {/* Mobile Navigation */}
      <MobileOnly>
        <MobileNavigation onCartOpen={() => setIsCartOpen(true)} />
      </MobileOnly>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden md:h-screen sm:h-[45vh] sm:min-h-[320px] sm:max-h-[420px]">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black z-10" />
        <video
          autoPlay={true}
          muted={true}
          loop={true}
          playsInline={true}
          preload="auto"
          disablePictureInPicture={true}
          disableRemotePlayback={true}
          controls={false}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            filter: 'contrast(1.1) saturate(1.2) brightness(0.8)',
            backfaceVisibility: 'hidden',
            transform: 'translateZ(0)',
            willChange: 'transform',
          }}
        >
            <source src="/videos/main-page-background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-950 to-slate-950 z-15" />
        <div className="relative z-20 max-w-6xl mx-auto px-4 flex flex-col h-full md:flex-row md:items-end md:justify-center md:pb-20 md:pt-0">
          {/* Mobile: Top section with logo and title */}
          <div className="flex flex-row items-center gap-3 justify-center pt-8 md:flex-row md:gap-8">
            <div className="flex items-center">
              <Image
                src="/images/Mu full hallow logo (3).svg"
                alt="MU Waterwear Logo"
                width={600}
                height={240}
                className="h-16 w-auto transition-all duration-300 hover:scale-105 md:h-40"
                priority
              />
            </div>
            <h2 className="text-xl font-semibold text-white tracking-tight text-center mt-0 md:text-3xl lg:text-5xl md:font-bold md:mt-0 md:text-left">
              BE UNDENIABLE.
            </h2>
          </div>
          
          {/* Mobile: Bottom third - Clean Water Initiatives Link */}
          <div className="flex-1 flex flex-col items-center justify-end pb-16 md:hidden">
            <div className="text-center">
              <Link 
                href="/about#clean-water-events"
                className="text-2xl font-bold mb-4 tracking-tight bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent hover:from-cyan-300 hover:to-blue-500 transition-all duration-300 block"
              >
                CLEAN WATER INITIATIVES
              </Link>
              <p className="text-sm text-slate-400 max-w-xs mx-auto font-light">
                Support Clean Water by Shopping Our Products or By Clicking The Link Above
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="hidden md:block py-20 bg-slate-900/50 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Link 
              href="/about#clean-water-events"
              className="text-4xl md:text-5xl font-bold mb-4 tracking-tight bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent hover:from-cyan-300 hover:to-blue-500 transition-all duration-300 block"
            >
              CLEAN WATER INITIATIVES
            </Link>
                          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">
                Support Clean Water by Shopping Our Products or By Clicking The Link Above
              </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Link href="/gear">
              <div className="bg-slate-900/50 rounded-lg overflow-hidden border border-slate-800/50 transition-all duration-300 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1 group cursor-pointer">
                <div className="relative h-80">
                  <Image
                    src="/images/gear-bag.jpg"
                    alt="Tactical Gear Bag"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <Anchor className="h-8 w-8 text-cyan-400 mb-2" />
                    <h3 className="text-2xl font-bold mb-2 text-white">GEAR</h3>
                    <p className="text-slate-400 font-light">Top Grade Equipment</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/apparel">
              <div className="bg-slate-900/50 rounded-lg overflow-hidden border border-slate-800/50 transition-all duration-300 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1 group cursor-pointer">
                <div className="relative h-80">
                  <Image
                    src="/images/apparel-tshirt.jpg"
                    alt="Water Ski Community T-Shirt"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <Mountain className="h-8 w-8 text-cyan-400 mb-2" />
                    <h3 className="text-2xl font-bold mb-2 text-white">APPAREL</h3>
                    <p className="text-slate-400 font-light">Graphic Tees and More</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/accessories">
              <div className="bg-slate-900/50 rounded-lg overflow-hidden border border-slate-800/50 transition-all duration-300 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1 group cursor-pointer">
                <div className="relative h-80">
                  <Image
                    src="/images/Untitled design (51).svg"
                    alt="MU Waterwear Accessories"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <Waves className="h-8 w-8 text-cyan-400 mb-2" />
                    <h3 className="text-2xl font-bold mb-2 text-white">ACCESSORIES</h3>
                    <p className="text-slate-400 font-light">Essential add-ons</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900/80 via-slate-950 to-slate-900/80 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              STEP INTO THE
              <span className="block text-transparent bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text">
                LIQUID
              </span>
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto font-light">
              Get exclusive access to new drops, lake reports, and gear that never hits the shelves.
            </p>
            <NewsletterSignup
              source="homepage"
              placeholder="Enter your email"
              buttonText="SIGN UP"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
    </>
  )
}
