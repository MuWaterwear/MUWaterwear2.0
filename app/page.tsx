"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { ShoppingCart, Menu, Waves, Mountain, Anchor, Droplets, ChevronDown } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import ShoppingCartSidebar from "@/components/ShoppingCartSidebar"
import { useCart } from "@/contexts/CartContext"
import { MobileOnly, DesktopOnly } from "@/responsive/components/ResponsiveLayout"
import MobileNavigation from "@/responsive/components/MobileNavigation"
import MobileShoppingCart from "@/responsive/components/MobileShoppingCart"
import NewsletterSignup from "@/components/NewsletterSignup"

export default function Component() {
  const { setIsCartOpen, getCartItemCount } = useCart()
  const [showContactEmail, setShowContactEmail] = useState(false)
  const [showReturnsPolicy, setShowReturnsPolicy] = useState(false)
  const [showShippingPolicy, setShowShippingPolicy] = useState(false)

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
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Subtle wave background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-20">
          <svg className="absolute bottom-0 w-full h-96" viewBox="0 0 1440 320" preserveAspectRatio="none">
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
      {/* Mobile Navigation */}
      <MobileOnly>
        <MobileNavigation onCartOpen={() => setIsCartOpen(true)} />
      </MobileOnly>

      {/* Desktop Header */}
      <DesktopOnly>
        <header className="border-b border-gray-800 bg-black/95 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Link
                  href="/"
                  className="relative flex items-center justify-center py-1 cursor-pointer hover:opacity-80 transition-opacity focus:ring-2 focus:ring-cyan-400/50 focus:outline-none rounded"
                  aria-label="MU Waterwear Home"
                >
                  <p className="text-xs text-gray-400 tracking-[0.2em] font-light">CA • OR • WA • ID • MT</p>
                  <Image
                    src="/images/Untitled design (52).png"
                    alt="MU Waterwear Logo"
                    width={200}
                    height={80}
                    className="absolute top-full right-0 h-10 w-auto transition-all duration-300 hover:scale-105"
                    style={{ transform: 'scale(3.0) translateX(1rem) translateY(0.4rem)' }}
                    priority
                  />
                </Link>
              </div>

              <nav className="hidden md:flex items-center space-x-8">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-gray-300 hover:text-cyan-400 transition-colors font-medium flex items-center gap-1"
                    >
                      WATERWAYS
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-900 border-gray-700 text-white w-72 min-w-72">
                    <DropdownMenuItem className="hover:bg-gray-800 focus:bg-gray-800 py-4 px-6 rounded-md">
                      <Link href="/coeur-dalene" className="w-full flex items-center justify-start gap-4 px-2">
                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                          <Image
                            src="/images/lake-icon.png"
                            alt="Lakes"
                            width={40}
                            height={40}
                            className="w-10 h-10 object-contain"
                          />
                        </div>
                        <span className="text-sm font-medium">Coeur D' Alene Lake, ID </span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-gray-800 focus:bg-gray-800 py-4 px-6 rounded-md">
                      <Link href="/detroit-lake" className="w-full flex items-center justify-start gap-4 px-2">
                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                          <Image
                            src="/images/waterway-outline-2.png"
                            alt="Bays"
                            width={40}
                            height={40}
                            className="w-10 h-10 object-contain"
                          />
                        </div>
                        <span className="text-sm font-medium">Detroit Lake, OR </span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-gray-800 focus:bg-gray-800 py-4 px-6 rounded-md">
                      <Link href="/flathead" className="w-full flex items-center justify-start gap-4 px-2">
                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                          <Image
                            src="/images/stream-icon.png"
                            alt="Streams"
                            width={40}
                            height={40}
                            className="w-10 h-10 object-contain"
                          />
                        </div>
                        <span className="text-sm font-medium">Flathead Lake, MT </span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-gray-800 focus:bg-gray-800 py-4 px-6 rounded-md">
                      <Link href="/lake-tahoe" className="w-full flex items-center justify-start gap-4 px-2">
                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                          <Image
                            src="/images/laketahoeicon.svg"
                            alt="Lake Tahoe"
                            width={40}
                            height={40}
                            className="w-10 h-10 object-contain"
                          />
                        </div>
                        <span className="text-sm font-medium">Lake Tahoe, CA/NV</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-gray-800 focus:bg-gray-800 py-4 px-6 rounded-md">
                      <Link href="/lake-washington" className="w-full flex items-center justify-start gap-4 px-2">
                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                          <Image
                            src="/images/waterway-outline-1.png"
                            alt="Coastlines"
                            width={40}
                            height={40}
                            className="w-10 h-10 object-contain"
                          />
                        </div>
                        <span className="text-sm font-medium">Lake Washington, WA </span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-gray-800 focus:bg-gray-800 py-4 px-6 rounded-md">
                      <Link href="/lindbergh" className="w-full flex items-center justify-start gap-4 px-2">
                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                          <Image
                            src="/images/river-icon.png"
                            alt="Rivers"
                            width={40}
                            height={40}
                            className="w-10 h-10 object-contain"
                          />
                        </div>
                        <span className="text-sm font-medium">Lindbergh Lake, MT</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Link href="/gear" className="text-gray-300 hover:text-cyan-400 transition-colors font-medium">
                  GEAR
                </Link>
                <Link href="/apparel" className="text-gray-300 hover:text-cyan-400 transition-colors font-medium">
                  APPAREL
                </Link>
                <Link href="/accessories" className="text-gray-300 hover:text-cyan-400 transition-colors font-medium">
                  ACCESSORIES
                </Link>
                <Link href="/about" className="text-gray-300 hover:text-cyan-400 transition-colors font-medium">
                  ABOUT
                </Link>
              </nav>

                          <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-300 hover:text-cyan-400 relative"
                onClick={() => setIsCartOpen(true)}
              >
                  <ShoppingCart className="h-5 w-5" />
                  {getCartItemCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-cyan-400 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {getCartItemCount()}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </header>
      </DesktopOnly>

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
            willChange: 'transform'
          }}
        >
          <source src="/videos/Untitled design.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-950 to-slate-950 z-15" />
        <div className="relative z-20 max-w-6xl mx-auto px-4 flex flex-col items-center justify-start pt-8 h-full md:flex-row md:items-end md:justify-center md:pb-20 md:pt-0">
          <div className="flex flex-row items-center gap-3 md:flex-row md:gap-8">
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
        </div>
      </section>

      {/* Featured Categories */}
      <section className="hidden md:block py-20 bg-slate-900/50 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
              FORGED IN WATER
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">
              Every piece engineered for the relentless pursuit of living a life near water
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Link href="/gear">
              <div className="bg-slate-900/50 rounded-lg overflow-hidden border border-slate-800/50 transition-all duration-300 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1 group cursor-pointer">
                <div className="relative h-80">
                  <Image
                    src="/images/gear-bag.png"
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
                    src="/images/apparel-tshirt.png"
                    alt="Water Ski Community T-Shirt"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <Mountain className="h-8 w-8 text-cyan-400 mb-2" />
                    <h3 className="text-2xl font-bold mb-2 text-white">APPAREL</h3>
                    <p className="text-slate-400 font-light">Performance waterweaer</p>
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
      <footer className="bg-slate-900 border-t border-slate-800 py-16 mt-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image
                  src="/images/Mu (2).svg"
                  alt="MU Waterwear Logo"
                  width={60}
                  height={24}
                  className="h-5 w-auto"
                  style={{ transform: 'scale(5.0)' }}
                />
                <span className="text-xl font-bold">WATERWEAR</span>
              </div>
              <p className="text-slate-400 mb-4 font-light">Crafting legends on the waters of the West since day one.</p>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-cyan-400">SHOP</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="/gear" className="hover:text-white transition-colors font-light">
                    Gear
                  </Link>
                </li>
                <li>
                  <Link href="/apparel" className="hover:text-white transition-colors font-light">
                    Apparel
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors font-light">
                    Accessories
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-cyan-400">SUPPORT</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="/size guide.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors font-light">
                    Size Guide
                  </Link>
                </li>
                <li>
                  {showReturnsPolicy ? (
                    <span className="text-slate-300 font-light">
                      14 day return policy across all items, upon delivery
                    </span>
                  ) : (
                    <button 
                      onClick={() => setShowReturnsPolicy(true)}
                      className="hover:text-white transition-colors font-light text-left"
                    >
                      Returns
                    </button>
                  )}
                </li>
                <li>
                  {showShippingPolicy ? (
                    <span className="text-slate-300 font-light">
                      We charge standard shipping rate but free shipping on all apparel and accessories
                    </span>
                  ) : (
                    <button 
                      onClick={() => setShowShippingPolicy(true)}
                      className="hover:text-white transition-colors font-light text-left"
                    >
                      Shipping
                    </button>
                  )}
                </li>
                <li>
                  {showContactEmail ? (
                    <span className="text-slate-300 font-light">
                      info@muwaterwear.com
                    </span>
                  ) : (
                    <button 
                      onClick={() => setShowContactEmail(true)}
                      className="hover:text-white transition-colors font-light text-left"
                    >
                      Contact
                    </button>
                  )}
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-cyan-400">CONNECT</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors font-light">
                    Instagram
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors font-light">
                    Facebook
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors font-light">
                    YouTube
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors font-light">
                    Newsletter
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-500">
            <p className="font-light">&copy; 2024 MU Waterwear. Engineered for water. Built for performance.</p>
            <div className="mt-4">
              <Link href="/privacy-policy" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Shopping Cart - Responsive */}
      <DesktopOnly>
        <ShoppingCartSidebar />
      </DesktopOnly>
      <MobileOnly>
        <MobileShoppingCart />
      </MobileOnly>
    </div>
  )
}
