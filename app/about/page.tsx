'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { ShoppingCart, Menu, Waves, Mountain, Anchor, Droplets, ChevronDown, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/contexts/CartContext'
import NewsletterSignup from '@/components/NewsletterSignup'
import Head from 'next/head'
import NavigationBar from '@/components/NavigationBar'
import MobileNavigation from '@/components/responsive/MobileNavigation'
import ResponsiveLayout from '@/components/responsive/MobileShoppingCart'
import { DesktopOnly, MobileOnly } from '@/components/responsive/ResponsiveLayout'
import Footer from '@/components/Footer'


export default function AboutPage() {
  const { setIsCartOpen, getCartItemCount } = useCart()
  const heroRef = useRef<HTMLDivElement>(null)
  const iconsRef = useRef<HTMLDivElement>(null)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  useEffect(() => {
    // Parallax effect for hero section
    const handleScroll = () => {
      if (heroRef.current) {
        const scrolled = window.scrollY
        heroRef.current.style.transform = `translateY(${scrolled * 0.5}px)`
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <ResponsiveLayout>
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      <Head>
        <title>About | MU Waterwear</title>
        <meta name="description" content="Discover the story behind MU Waterwear, a brand built for the deep end—designed for those who never sit still on the water." />
        <meta name="keywords" content="MU Waterwear, waterwear, boating, fishing, paddleboarding, wakeboarding, diving, lake, river, ocean, adventure" />
        <meta name="author" content="MU Waterwear" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href="https://muwaterwear.com/about" />
        <meta property="og:title" content="About | MU Waterwear" />
        <meta property="og:description" content="Discover the story behind MU Waterwear, a brand built for the deep end—designed for those who never sit still on the water." />
        <meta property="og:url" content="https://muwaterwear.com/about" />
        <meta property="og:image" content="https://muwaterwear.com/images/og-image.jpg" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MU Waterwear" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About | MU Waterwear" />
        <meta name="twitter:description" content="Discover the story behind MU Waterwear, a brand built for the deep end—designed for those who never sit still on the water." />
        <meta name="twitter:image" content="https://muwaterwear.com/images/og-image.jpg" />
      </Head>

      {/* Desktop Navigation */}
      <DesktopOnly>
        <NavigationBar onMobileMenuOpen={() => setMobileFiltersOpen(true)} />
      </DesktopOnly>

      {/* Mobile Navigation */}
      <MobileOnly>
        <MobileNavigation onCartOpen={() => setIsCartOpen(true)} />
      </MobileOnly>

      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            webkit-playsinline="true"
            x5-playsinline="true"
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              filter: 'contrast(1.1) saturate(1.2) brightness(0.6)',
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)',
              willChange: 'transform',
            }}
          >
            <source src="/videos/about-page-back-ground-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-950/50 to-slate-950 z-10" />

        <div className="relative z-20 text-center max-w-4xl mx-auto px-6">
          <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tight leading-normal py-2 animate-fade-up bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
            Born at waters edge
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 animate-fade-up animation-delay-200 font-light leading-relaxed">
            MU Waterwear is a brand built for the deep end—designed for those who never sit still on
            the water.
          </p>
        </div>

        {/* Animated water ripple effect */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse z-20"></div>
      </section>

      {/* Clean Water Events */}
      <section id="clean-water-events" className="py-16 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-2xl font-bold text-center mb-8 text-cyan-400">Clean Water Events</h3>

          <div className="flex flex-wrap justify-center gap-12 mb-8">
            {/* Coeur d'Alene */}
            <a
              href="https://allevents.in/coeur-d-alene/lake-cda-clean-up-day/200028222341838"
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-32 h-40 hover:scale-105 transition-transform duration-300 group cursor-pointer"
            >
              <div
                className="w-full h-full bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: "url('/images/Untitled%20design%20(52).png')",
                }}
              >
                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                  <div className="text-center p-1">
                    <div className="text-4xl font-bold text-white">Coeur d'Alene</div>
                  </div>
                </div>
              </div>
            </a>

            {/* Lindbergh Lake */}
            <a
              href="https://www.eventbrite.com/e/lindbergh-lake-waters-clean-up-tickets-1450904437229?aff=oddtdtcreator"
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-32 h-40 hover:scale-105 transition-transform duration-300 group cursor-pointer"
            >
              <div
                className="w-full h-full bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: "url('/images/Untitled%20design%20(52).png')",
                }}
              >
                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                  <div className="text-center p-1">
                    <div className="text-4xl font-bold text-white">Lindbergh</div>
                  </div>
                </div>
              </div>
            </a>

            {/* Flathead Lake */}
            <a
              href="https://flugelhorn-fuchsia-srhc.squarespace.com/upcoming-events/2025-flathead-waters-cleanup"
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-32 h-40 hover:scale-105 transition-transform duration-300 group cursor-pointer"
            >
              <div
                className="w-full h-full bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: "url('/images/Untitled%20design%20(52).png')",
                }}
              >
                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                  <div className="text-center p-1">
                    <div className="text-4xl font-bold text-white">Flathead</div>
                  </div>
                </div>
              </div>
            </a>

            {/* Lake Washington */}
            <a
              href="https://pugetsoundkeeper.org/volunteer/marine-debris-cleanups/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-32 h-40 hover:scale-105 transition-transform duration-300 group cursor-pointer"
            >
              <div
                className="w-full h-full bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: "url('/images/Untitled%20design%20(52).png')",
                }}
              >
                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                  <div className="text-center p-1">
                    <div className="text-4xl font-bold text-white">Washington</div>
                  </div>
                </div>
              </div>
            </a>

            {/* Lake Tahoe */}
            <a
              href="https://www.keeptahoeblue.org/join-us/cleanups/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-32 h-40 hover:scale-105 transition-transform duration-300 group cursor-pointer"
            >
              <div
                className="w-full h-full bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: "url('/images/Untitled%20design%20(52).png')",
                }}
              >
                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                  <div className="text-center p-1">
                    <div className="text-4xl font-bold text-white">Tahoe</div>
                  </div>
                </div>
              </div>
            </a>

            {/* Detroit Lake */}
            <a
              href="https://northsantiam.org/detroit-lake-shoreline-riverside-clean-up/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-32 h-40 hover:scale-105 transition-transform duration-300 group cursor-pointer"
            >
              <div
                className="w-full h-full bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: "url('/images/Untitled%20design%20(52).png')",
                }}
              >
                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                  <div className="text-center p-1">
                    <div className="text-4xl font-bold text-white">Detroit</div>
                  </div>
                </div>
              </div>
            </a>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-300 mb-2">
              Join us in protecting the waters that inspire everything we do.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Our Story</h2>
          </div>

          <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-800/30 rounded-2xl p-8 md:p-12 space-y-6">
            <p className="text-lg text-gray-300 leading-relaxed">
              MU Waterwear was founded in a garage in 2024, born from a simple yet lasting idea: to
              build a brand inspired by water. What began with custom local graphic tees has
              steadily grown and expanded its product line. MU creates apparel that illustrates a
              jump into water—designed for those who live in the deep end. Our gear offers a
              different kind of protection from the elements—because when you're made from water,
              the elements only make you stronger.
            </p>

            <p className="text-lg text-gray-300 leading-relaxed">
              Water is the essence of life—undeniable, fearless, and ever-flowing. It holds still
              and lets the world move around it.
            </p>

            <p className="text-lg text-gray-300 leading-relaxed">
              That's why it hurts to see our waterways polluted. We remember a time when the local
              pond, the lake, and the river's edge were clean and untouched. As part of our mission,
              we pledge to donate a portion of our profits to clean water initiatives—and as we
              grow, to lead cleanup efforts ourselves. We do this because we can. We are the
              stewards of this planet now. Just because we didn't start the problem doesn't mean we
              can't help solve it.
            </p>

            <div className="pt-6 text-center">
              <p className="text-xl text-cyan-400 font-medium italic">God bless.</p>
              <p className="text-lg text-gray-400 font-medium">—MU Waterwear</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Quote */}
      <section className="py-16 text-center bg-slate-900/50">
        <div className="max-w-4xl mx-auto px-6">
          <blockquote className="text-2xl md:text-3xl font-light text-gray-300 italic leading-relaxed">
            "At MU, we wanted to design a brand around the depth of water, something that
            communicates the power and magic of the stuff of life."
          </blockquote>
        </div>
      </section>

      {/* Email Signup */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">Stay Connected</h3>
          <p className="text-lg text-gray-300 mb-8">
            Sign up for updates on new products, cleanup events, and exclusive discounts
          </p>

          <NewsletterSignup
            source="about"
            placeholder="Enter your email address"
            buttonText="Sign Up"
            className="max-w-md mx-auto"
          />

          <p className="text-sm text-gray-400 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
    </ResponsiveLayout>
  )
}

// Water Activities SVG Component
function WaterActivitiesSVG() {
  return (
    <svg viewBox="0 0 1200 800" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <g stroke="#007bbf" strokeWidth="1" fill="none" opacity="0.3">
        {/* Boat */}
        <path d="M600 300 L700 320 L720 340 L700 360 L600 360 L580 340 L600 300 Z" />
        <path d="M640 300 L640 280 M660 300 L660 280" />

        {/* Paddleboarder */}
        <circle cx="300" cy="400" r="10" />
        <path d="M300 410 L300 440 M290 420 L310 420 M300 440 L290 460 M300 440 L310 460" />
        <rect x="280" y="460" width="40" height="8" rx="4" />
        <path d="M300 420 L320 380" />

        {/* Wakeboarder */}
        <circle cx="900" cy="400" r="10" />
        <path d="M900 410 L900 435 M885 420 L915 420" />
        <path d="M880 435 L920 435 L925 440 L875 440 Z" />
        <path d="M900 420 Q850 380 800 360" />

        {/* Diver */}
        <circle cx="500" cy="500" r="10" />
        <path d="M500 510 Q480 520 490 540 Q500 550 510 540 Q520 520 500 510" />
        <path d="M490 515 L485 525 M510 515 L515 525" />
        <circle cx="490" cy="545" r="2" />
        <circle cx="495" cy="550" r="2" />
        <circle cx="505" cy="550" r="2" />
        <circle cx="510" cy="545" r="2" />

        {/* Water lines */}
        <path d="M0 380 Q150 370 300 380 T600 380 T900 380 T1200 380" className="animate-pulse" />
        <path
          d="M0 400 Q150 390 300 400 T600 400 T900 400 T1200 400"
          className="animate-pulse"
          style={{ animationDelay: '0.5s' }}
        />
        <path
          d="M0 420 Q150 410 300 420 T600 420 T900 420 T1200 420"
          className="animate-pulse"
          style={{ animationDelay: '1s' }}
        />
      </g>
    </svg>
  )
}

// Activity Icon Component
function ActivityIcon({ type }: { type: string }) {
  const icons: { [key: string]: React.ReactElement } = {
    wakeboard: (
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="20" r="5" stroke="#007bbf" strokeWidth="2" />
        <path d="M40 25 L40 40 M32 30 L48 30" stroke="#007bbf" strokeWidth="2" />
        <path d="M25 40 L55 40 L58 43 L22 43 Z" stroke="#007bbf" strokeWidth="2" />
        <path d="M40 30 Q20 20 10 40" stroke="#007bbf" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    dive: (
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="25" r="5" stroke="#007bbf" strokeWidth="2" />
        <path d="M40 30 Q30 35 35 45 Q40 50 45 45 Q50 35 40 30" stroke="#007bbf" strokeWidth="2" />
        <path d="M35 32 L32 38 M45 32 L48 38" stroke="#007bbf" strokeWidth="2" />
        <circle cx="35" cy="52" r="1.5" fill="#007bbf" />
        <circle cx="40" cy="55" r="1.5" fill="#007bbf" />
        <circle cx="45" cy="52" r="1.5" fill="#007bbf" />
      </svg>
    ),
    paddleboard: (
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="25" r="5" stroke="#007bbf" strokeWidth="2" />
        <path
          d="M40 30 L40 45 M34 35 L46 35 M40 45 L35 55 M40 45 L45 55"
          stroke="#007bbf"
          strokeWidth="2"
        />
        <rect x="30" y="55" width="20" height="4" rx="2" stroke="#007bbf" strokeWidth="2" />
        <path d="M40 35 L50 20" stroke="#007bbf" strokeWidth="2" />
      </svg>
    ),
    fishing: (
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <circle cx="35" cy="25" r="5" stroke="#007bbf" strokeWidth="2" />
        <path d="M35 30 L35 45 M28 35 L42 35" stroke="#007bbf" strokeWidth="2" />
        <path d="M35 35 L55 20 Q58 18 60 20 L58 25" stroke="#007bbf" strokeWidth="2" />
        <path d="M58 25 Q58 35 55 40" stroke="#007bbf" strokeWidth="2" strokeDasharray="2 2" />
        <path
          d="M52 40 Q55 42 58 40 Q56 45 52 43 Q50 40 52 40 Z"
          stroke="#007bbf"
          strokeWidth="2"
          fill="#007bbf"
          fillOpacity="0.2"
        />
      </svg>
    ),
    dock: (
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="30" r="5" stroke="#007bbf" strokeWidth="2" />
        <path d="M40 35 L40 45 M35 45 L45 45" stroke="#007bbf" strokeWidth="2" />
        <rect x="25" y="50" width="30" height="3" stroke="#007bbf" strokeWidth="2" />
        <path d="M25 53 L25 58 M55 53 L55 58" stroke="#007bbf" strokeWidth="2" />
        <path d="M20 60 Q40 58 60 60" stroke="#007bbf" strokeWidth="2" />
      </svg>
    ),
  }

  return (
    <div className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity duration-300">
      {icons[type] || icons.wakeboard}
    </div>
  )
}
