"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ShoppingCart, Menu, ChevronDown } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/contexts/CartContext"

interface NavigationBarProps {
  onMobileMenuOpen?: () => void
}

export default function NavigationBar({ onMobileMenuOpen }: NavigationBarProps) {
  const { setIsCartOpen, getCartItemCount } = useCart()

  return (
    <header className="border-b border-gray-800 bg-black/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link
              href="/"
              className="flex flex-col items-center justify-center py-1 cursor-pointer hover:opacity-80 transition-opacity focus:ring-2 focus:ring-cyan-400/50 focus:outline-none rounded w-fit"
              aria-label="MU Waterwear Home"
            >
              <p className="text-xs text-gray-400 tracking-[0.2em] font-light mb-0">CA • OR • WA • ID • MT</p>
              <Image
                src="/images/Mu (2).svg"
                alt="MU Waterwear Logo"
                width={200}
                height={80}
                className="h-10 w-auto transition-all duration-300 hover:scale-105"
                style={{ transform: 'scale(9.0)' }}
                priority
              />
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8 ml-8">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-gray-300 hover:text-cyan-400 transition-colors font-medium flex items-center gap-1 relative"
                >
                  WATERWAYS
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="bg-gray-900 border-gray-700 text-white w-72 min-w-72 z-[9999]"
                sideOffset={10}
                align="start"
                side="bottom"
                forceMount
              >
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
              className="text-gray-300 hover:text-cyan-400 relative z-[9999] cursor-pointer"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setIsCartOpen(true)
              }}
              aria-label="Open shopping cart"
            >
              <ShoppingCart className="h-5 w-5 pointer-events-none" />
              {getCartItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-cyan-400 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center pointer-events-none">
                  {getCartItemCount()}
                </span>
              )}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={onMobileMenuOpen}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}