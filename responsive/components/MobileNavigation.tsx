"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, ShoppingCart, ChevronRight, Home, Package, Shirt, Crown, Info, Waves } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/contexts/CartContext"

interface MobileNavigationProps {
  onCartOpen: () => void
}

export default function MobileNavigation({ onCartOpen }: MobileNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isWaterwaysOpen, setIsWaterwaysOpen] = useState(false)
  const { getCartItemCount } = useCart()

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  const waterways = [
    { name: "Coeur D'Alene Lake, ID", href: "/coeur-dalene", icon: "/images/lake-icon.png" },
    { name: "Detroit Lake, OR", href: "/detroit-lake", icon: "/images/waterway-outline-2.png" },
    { name: "Flathead Lake, MT", href: "/flathead", icon: "/images/stream-icon.png" },
    { name: "Lake Tahoe, CA/NV", href: "/lake-tahoe", icon: "/images/laketahoeicon.svg" },
    { name: "Lake Washington, WA", href: "/lake-washington", icon: "/images/waterway-outline-1.png" },
    { name: "Lindbergh Lake, MT", href: "/lindbergh", icon: "/images/river-icon.png" },
  ]

  const mainNavItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Gear", href: "/gear", icon: Package },
    { name: "Apparel", href: "/apparel", icon: Shirt },
    { name: "Accessories", href: "/accessories", icon: Crown },
    { name: "About", href: "/about", icon: Info },
  ]

  const closeMenu = () => {
    setIsMenuOpen(false)
    setIsWaterwaysOpen(false)
  }

  return (
    <>
      {/* Mobile Header */}
      <header className="md:hidden border-b border-gray-800 bg-black/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex flex-col min-h-[77px] justify-center">
          {/* Main Navigation Row with Title Centered */}
          <div className="flex items-center justify-between px-4 py-2">
            {/* Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(true)}
              className="text-gray-300 hover:text-cyan-400 touch-manipulation p-2"
              aria-label="Open menu"
            >
              <Menu className="h-10 w-10" />
            </Button>

            {/* Right Actions */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-300 hover:text-cyan-400 relative touch-manipulation p-2"
                onClick={onCartOpen}
                aria-label="Shopping cart"
              >
                <ShoppingCart className="h-8 w-8" />
                {getCartItemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-cyan-400 text-black text-sm font-bold rounded-full h-8 w-8 flex items-center justify-center min-w-[32px]">
                    {getCartItemCount()}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* State Abbreviations at Bottom */}
          <div className="flex items-center justify-center pb-1">
            <p className="text-sm text-gray-400 tracking-[0.3em] font-light">CA • OR • WA • ID • MT</p>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeMenu}
          />

          {/* Menu Panel */}
          <div className="absolute left-0 top-0 h-full w-[85%] max-w-sm bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-out">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <div className="flex items-center gap-3">
                  <Image
                    src="/images/Mu (2).svg"
                    alt="MU Waterwear"
                    width={32}
                    height={32}
                    className="h-8 w-8"
                  />
                  <h2 className="text-xl font-bold text-white">Menu</h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeMenu}
                  className="text-gray-400 hover:text-white touch-manipulation"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-2">
                  {/* Main Navigation */}
                  {mainNavItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={closeMenu}
                      className="flex items-center gap-4 p-4 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors touch-manipulation group"
                    >
                      <item.icon className="h-5 w-5 text-cyan-400" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  ))}

                  {/* Waterways Section */}
                  <div className="pt-4 border-t border-gray-800 mt-6">
                    <button
                      onClick={() => setIsWaterwaysOpen(!isWaterwaysOpen)}
                      className="w-full flex items-center gap-4 p-4 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors touch-manipulation"
                      aria-expanded={isWaterwaysOpen}
                    >
                      <Waves className="h-5 w-5 text-cyan-400" />
                      <span className="font-medium flex-1 text-left">Waterways</span>
                      <ChevronRight
                        className={`h-4 w-4 transition-transform duration-200 ${
                          isWaterwaysOpen ? "rotate-90" : ""
                        }`}
                      />
                    </button>

                    {/* Waterways Submenu */}
                    {isWaterwaysOpen && (
                      <div className="mt-2 ml-6 space-y-1 animate-in slide-in-from-top-2 duration-200">
                        {waterways.map((waterway) => (
                          <Link
                            key={waterway.name}
                            href={waterway.href}
                            onClick={closeMenu}
                            className="flex items-center gap-3 p-3 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors touch-manipulation"
                          >
                            <Image
                              src={waterway.icon}
                              alt=""
                              width={20}
                              height={20}
                              className="w-5 h-5 object-contain opacity-70"
                            />
                            <span>{waterway.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </nav>

              {/* Footer */}
              <div className="p-6 border-t border-gray-800">
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-2">
                    Built for water. Forged for legends.
                  </p>
                  <p className="text-xs text-gray-600 mb-2">
                    © 2024 MU Waterwear
                  </p>
                  <Link
                    href="/privacy-policy"
                    onClick={closeMenu}
                    className="text-xs text-gray-500 hover:text-cyan-400 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 