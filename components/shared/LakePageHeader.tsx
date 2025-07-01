'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const waterwayLinks = [
  {
    href: '/coeur-dalene',
    name: "Coeur D'Alene Lake, ID",
    icon: '/images/lake-icon.png',
    alt: 'Lakes'
  },
  {
    href: '/detroit-lake',
    name: 'Detroit Lake, OR',
    icon: '/images/waterway-outline-2.png',
    alt: 'Bays'
  },
  {
    href: '/flathead',
    name: 'Flathead Lake, MT',
    icon: '/images/stream-icon.png',
    alt: 'Streams'
  },
  {
    href: '/lake-tahoe',
    name: 'Lake Tahoe, CA/NV',
    icon: '/images/laketahoeicon.svg',
    alt: 'Lake Tahoe'
  },
  {
    href: '/lake-washington',
    name: 'Lake Washington, WA',
    icon: '/images/waterway-outline-1.png',
    alt: 'Coastlines'
  },
  {
    href: '/lindbergh',
    name: 'Lindbergh Lake, MT',
    icon: '/images/river-icon.png',
    alt: 'Rivers'
  }
]

export default function LakePageHeader({ 
  title, 
  subtitle 
}: { 
  title?: string, 
  subtitle?: string 
} = {}) {
  return (
    <>
      {(title || subtitle) && (
        <div className="mb-8">
          {title && <h1 className="text-3xl font-bold text-primary">{title}</h1>}
          {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
        </div>
      )}
      <header className="border-b border-gray-800 bg-black/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Link
                href="/"
                className="flex flex-col items-center justify-center py-1 cursor-pointer hover:opacity-80 transition-opacity focus:ring-2 focus:ring-cyan-400/50 focus:outline-none rounded"
                aria-label="MU Waterwear Home"
              >
                <p className="text-[10px] md:text-xs text-gray-400 tracking-[0.2em] font-light mb-0">
                  CA • OR • WA • ID • MT
                </p>
                <Image
                  src="/images/Mu (2).svg"
                  alt="MU Waterwear Logo"
                  width={200}
                  height={80}
                  className="h-8 md:h-10 w-auto transition-all duration-300 hover:scale-105"
                  style={{ transform: 'scale(7.0)' }}
                  priority
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav
              className="hidden lg:flex items-center space-x-8"
              role="navigation"
              aria-label="Main navigation"
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-gray-300 hover:text-cyan-400 transition-colors font-medium flex items-center gap-1 focus:ring-2 focus:ring-cyan-400/50 focus:outline-none"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    WATERWAYS <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-900 border-gray-700 text-white w-72 min-w-72">
                  {waterwayLinks.map((waterway) => (
                    <DropdownMenuItem key={waterway.href} className="hover:bg-gray-800 focus:bg-gray-800 py-4 px-6 rounded-md">
                      <Link
                        href={waterway.href}
                        className="w-full flex items-center justify-start gap-4 px-2"
                      >
                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                          <Image
                            src={waterway.icon}
                            alt={waterway.alt}
                            width={40}
                            height={40}
                            className="w-10 h-10 object-contain"
                          />
                        </div>
                        <span className="text-sm font-medium">{waterway.name}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Link
                href="/gear"
                className="text-gray-300 hover:text-cyan-400 transition-colors font-medium"
              >
                GEAR
              </Link>
              <Link
                href="/apparel"
                className="text-gray-300 hover:text-cyan-400 transition-colors font-medium"
              >
                APPAREL
              </Link>
              <Link
                href="/accessories"
                className="text-gray-300 hover:text-cyan-400 transition-colors font-medium"
              >
                ACCESSORIES
              </Link>
              <Link
                href="/about"
                className="text-gray-300 hover:text-cyan-400 transition-colors font-medium"
              >
                ABOUT
              </Link>
            </nav>
          </div>
        </div>
      </header>
    </>
  )
} 