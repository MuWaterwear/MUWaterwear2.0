// MobileNavigation.tsx
'use client'

import { useState } from 'react'
import { Home, ShoppingBag, Map, Store, Package, Shirt, Box } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import Image from 'next/image'

interface MobileNavigationProps {
  onCartOpen: () => void
}

export default function MobileNavigation({ onCartOpen }: MobileNavigationProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { getCartItemCount } = useCart()
  const cartCount = getCartItemCount()
  const [showWaterways, setShowWaterways] = useState(false)
  const [showShop, setShowShop] = useState(false)
  const [activeTab, setActiveTab] = useState('Home')

  const waterways = [
    { label: "Coeur d'Alene", path: '/coeur-dalene', img: '/images/lake-icon.png' },
    { label: 'Detroit Lake', path: '/detroit-lake', img: '/images/waterway-outline-2.png' },
    { label: 'Flathead', path: '/flathead', img: '/images/stream-icon.png' },
    { label: 'Lake Tahoe', path: '/lake-tahoe', img: '/images/laketahoeicon.svg' },
    { label: 'Lake Washington', path: '/lake-washington', img: '/images/waterway-outline-1.png' },
    { label: 'Lindbergh', path: '/lindbergh', img: '/images/river-icon.png' },
  ]

  const shopItems = [
    { label: 'Gear', path: '/gear', icon: Package },
    { label: 'Apparel', path: '/apparel', icon: Shirt },
    { label: 'Accessories', path: '/accessories', icon: Box },
  ]

  const navItems = [
    { icon: Home, label: 'Home', path: '/', onClick: () => {router.push('/'); setActiveTab('Home'); setShowWaterways(false); setShowShop(false);} },
    { icon: Map, label: 'Waterways', path: '/waterways', onClick: () => {setShowWaterways(!showWaterways); setActiveTab('Waterways'); setShowShop(false);} },
    { icon: Store, label: 'Shop', path: '/apparel', onClick: () => {setShowShop(!showShop); setActiveTab('Shop'); setShowWaterways(false);} },
    { 
      icon: ShoppingBag, 
      label: 'Cart', 
      path: '/cart',
      onClick: onCartOpen,
      badge: cartCount > 0 ? cartCount : undefined 
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Waterways Dropdown */}
      {showWaterways && (
        <div className="absolute bottom-full left-0 right-0 mb-2 px-4">
          <div className="bg-gray-950/90 backdrop-blur-md border border-gray-800 rounded-2xl p-4 shadow-xl" style={{backgroundImage:'url(/Untitled%20design%20(68).svg)', backgroundSize:'cover'}}>
            <div className="grid grid-cols-3 gap-4">
              {waterways.map(w => (
                <button key={w.label} onClick={()=>{router.push(w.path);setShowWaterways(false);}} className="flex flex-col items-center text-white font-[quicksand] touch-manipulation">
                  <div className="relative w-14 h-14 mb-1">
                    <Image src={w.img} alt={w.label} fill className="object-contain" />
                  </div>
                  <span className="text-xs">{w.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Shop Dropdown */}
      {showShop && (
        <div className="absolute bottom-full left-0 right-0 mb-2 px-4">
          <div className="bg-gray-950/90 backdrop-blur-md border border-gray-800 rounded-2xl p-4 shadow-xl" style={{backgroundImage:'url(/Untitled%20design%20(68).svg)', backgroundSize:'cover'}}>
            <div className="grid grid-cols-3 gap-4">
              {shopItems.map(s => {
                const Icon = s.icon;
                return (
                <button key={s.label} onClick={()=>{router.push(s.path); setShowShop(false);}} className="flex flex-col items-center text-white font-[quicksand] touch-manipulation">
                  <Icon className="h-6 w-6 mb-1 text-white" />
                  <span className="text-xs">{s.label}</span>
                </button>
              )})}
            </div>
          </div>
        </div>
      )}
      {/* Bottom Navigation Bar */}
      <div className="bg-gray-950 border-t border-gray-800">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.path
            
            return (
              <button
                key={item.label}
                onClick={item.onClick}
                className="flex flex-col items-center justify-center p-2 min-w-[64px] touch-manipulation relative"
              >
                <div className="relative">
                  <Icon 
                    className={`h-6 w-6 ${
                      activeTab===item.label ? 'text-cyan-400' : 'text-gray-400'
                    } transition-colors`}
                  />
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 bg-cyan-400 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className={`text-xs mt-1 ${
                  activeTab===item.label ? 'text-cyan-400' : 'text-gray-500'
                }`}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
        
        {/* Home indicator bar */}
        <div className="pb-1 flex justify-center">
          <div className="w-32 h-1 bg-gray-800 rounded-full" />
        </div>
      </div>
    </nav>
  )
}