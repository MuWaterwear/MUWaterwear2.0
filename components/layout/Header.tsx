"use client"
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/contexts/CartContext'
import { Menu, ShoppingCart } from 'lucide-react'
import UserAccountButton from '@/components/UserAccountButton'
import { Button } from '@/components/ui/button'
import { SearchBar } from '@/components/ui/search-bar'
import { Section } from '@/components/ui/section'
import { useState } from 'react'
import MobileNavigation from '@/components/responsive/MobileNavigation'

const navItems = [
  { label: 'Apparel', href: '/apparel' },
  { label: 'Gear', href: '/gear' },
  { label: 'The Water Series', href: '/water-series' },
  { label: 'Our Story', href: '/about' },
  { label: 'Community', href: '/community' },
  { label: 'Sale', href: '/sale' },
]

export default function Header() {
  const { getCartItemCount, setIsCartOpen } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-md border-b border-gray-800/70">
      <Section>
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-300 hover:text-brand-accent"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/Mu (2).svg" alt="MU Waterwear" width={32} height={32} />
            <span className="hidden md:inline text-lg font-semibold text-white">MU Waterwear</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-300">
            {navItems.map(item => (
              <Link key={item.href} href={item.href} className="hover:text-white transition-colors">
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden md:block w-64">
              <SearchBar />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-gray-300 hover:text-brand-accent"
              onClick={() => setIsCartOpen(true)}
              aria-label="Cart"
            >
              <ShoppingCart className="h-6 w-6" />
              {getCartItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-accent text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartItemCount()}
                </span>
              )}
            </Button>
            <UserAccountButton />
          </div>
        </div>
      </Section>

      {mobileOpen && <MobileNavigation onCartOpen={() => setIsCartOpen(true)} />}
    </header>
  )
} 