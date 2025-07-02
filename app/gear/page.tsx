'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ShoppingCart, Menu, ChevronDown, Filter, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import NavigationBar from '@/components/NavigationBar'
import MobileNavigation from '@/components/responsive/MobileNavigation'
import NewsletterSignup from '@/components/NewsletterSignup'
import { DesktopOnly, MobileOnly } from '@/components/responsive/ResponsiveLayout'
import Footer from '@/components/Footer'
import dynamic from 'next/dynamic'
import { wetsuits, paddleBoards, bags, coolers, wakeboards } from '@/data/gear-products'

// Dynamically load the expanded image modal only when needed (client-side only)
const ExpandedImageModal = dynamic(() => import('@/components/pages/apparel/ExpandedImageModal'), {
  ssr: false,
  loading: () => null,
})

export default function GearPage() {
  const [showContactEmail, setShowContactEmail] = useState(false)
  const [showReturnsPolicy, setShowReturnsPolicy] = useState(false)
  const [showShippingPolicy, setShowShippingPolicy] = useState(false)

  const categories = [
    { id: 'all', name: 'All Gear', count: wetsuits.length + paddleBoards.length + bags.length + coolers.length + wakeboards.length },
    {
      id: 'diving',
      name: 'Diving',
      count: wetsuits.length,
    },
    {
      id: 'packs',
      name: 'Backpacks',
      count: bags.length,
    },
    {
      id: 'fishing',
      name: 'Fishing',
      count: 0, // No fishing products in the data
    },
    {
      id: 'navigation',
      name: 'Navigation',
      count: 0, // No navigation products in the data
    },
    {
      id: 'storage',
      name: 'Storage',
      count: coolers.length,
    },
    {
      id: 'marine',
      name: 'Marine',
      count: 0, // No marine products in the data
    },
  ]

  const { addToCart, setIsCartOpen, getCartItemCount } = useCart()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedSize, setSelectedSize] = useState<{ [key: string]: string }>({})
  const [selectedColor, setSelectedColor] = useState<{ [key: string]: number }>({})
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [expandedDetails, setExpandedDetails] = useState<{ [key: string]: boolean }>({})

  // Expanded image modal state
  const [expandedImage, setExpandedImage] = useState(false)
  const [currentFeaturedImage, setCurrentFeaturedImage] = useState<string | null>(null)
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Zoom state for expanded images
  const [imageZoom, setImageZoom] = useState(1)
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  // Filter products based on selected category
  const filteredProducts =
    selectedCategory === 'all'
      ? [...bags, ...wetsuits, ...paddleBoards, ...coolers, ...wakeboards]
      : [...bags, ...wetsuits, ...paddleBoards, ...coolers, ...wakeboards].filter(p => p.category === selectedCategory)

  const handleQuickAdd = (product: any) => {
    const size = selectedSize[product.id] || product.sizes[Math.floor(product.sizes.length / 2)]
    const colorIndex = selectedColor[product.id] || 0

    // Handle different product types
    let colorName = 'Default'
    let sizeName = 'Default'

    if (product.id === 'gear-cascade-backpack-compact') {
      // If no color selected (showing SIZE-COMPARE), use first color
      if (colorIndex === 0) {
        colorName = product.colors[0].name
      } else {
        // Map image index back to color index
        const colorArrayIndex = colorIndex - 1
        colorName = product.colors[colorArrayIndex]?.name || product.colors[0].name
      }
    } else if (product.id === 'gear-havana-inflatable-sup') {
      // For Havana paddleboard, colorIndex maps to size
      sizeName = product.sizes[colorIndex]?.name || product.sizes[0]
      colorName = 'Standard'
    } else if (
      product.id === 'gear-2025-mens-sprint-wetsuit' ||
      product.id === 'gear-2025-womens-fusion-wetsuit' ||
      product.id === 'gear-2025-mens-fusion-wetsuit' ||
      product.id === 'gear-2025-mens-thermal-wetsuit' ||
      product.id === 'gear-2025-womens-thermal-wetsuit'
    ) {
      // For wetsuit, use selected size or default to first available size
      sizeName = size
      colorName = product.colors[colorIndex]?.name || 'Standard'
    } else {
      colorName = product.colors[colorIndex]?.name || 'Default'
    }

    // Get the correct price for size-based pricing
    const itemPrice =
      product.id === 'gear-havana-inflatable-sup' && product.prices
        ? product.prices[colorIndex]
        : product.price

    const cartItem = {
      id: `${product.id}-${colorName}-${sizeName}`,
      name: `${product.name} - ${colorName}${product.id === 'gear-havana-inflatable-sup' ? ` - ${sizeName}` : product.id === 'gear-2025-mens-sprint-wetsuit' || product.id === 'gear-2025-womens-fusion-wetsuit' || product.id === 'gear-2025-mens-fusion-wetsuit' || product.id === 'gear-2025-mens-thermal-wetsuit' || product.id === 'gear-2025-womens-thermal-wetsuit' ? ` - Size ${sizeName}` : ''}`,
      price: `$${itemPrice}`,
      size: product.id === 'gear-havana-inflatable-sup' ? sizeName : size,
      image: product.images[colorIndex] || product.images[0],
    }

    addToCart(cartItem)
    setIsCartOpen(true)
  }

  // Handle image click to open expanded view (prevent on swipe)
  const handleImageClick = (imageSrc: string, productId: string) => {
    const product = [...bags, ...wetsuits, ...paddleBoards, ...coolers, ...wakeboards].find(p => p.id === productId)
    if (!product) return

    setCurrentFeaturedImage(imageSrc)
    setExpandedImage(true)
    setExpandedProductId(productId)

    // Set current image index based on selected color
    const colorIndex = selectedColor[productId] || 0
    setCurrentImageIndex(colorIndex)

    // Set initial zoom level - 150% for all enhanced products, 100% for others
    const initialZoom =
      productId === 'gear-cascade-backpack' ||
      productId === 'gear-cascade-backpack-compact' ||
      productId === 'gear-cascade-duffle-bag' ||
      productId === 'gear-havana-inflatable-sup' ||
      productId === 'gear-hogg-35qt-wheelie-cooler' ||
      productId === 'gear-2025-mens-sprint-wetsuit' ||
      productId === 'gear-2025-womens-fusion-wetsuit' ||
      productId === 'gear-2025-mens-fusion-wetsuit' ||
      productId === 'gear-2025-mens-thermal-wetsuit' ||
      productId === 'gear-2025-womens-thermal-wetsuit'
        ? 1.5
        : 1
    setImageZoom(initialZoom)
    setImagePosition({ x: 0, y: 0 })
    setIsDragging(false)
  }

  // Zoom utility functions
  const handleZoomIn = () => {
    setImageZoom(prev => Math.min(prev + 0.5, 3)) // Max zoom 3x
  }

  const handleZoomOut = () => {
    setImageZoom(prev => {
      const newZoom = Math.max(prev - 0.5, 1) // Min zoom 1x
      if (newZoom === 1) {
        setImagePosition({ x: 0, y: 0 }) // Reset position when fully zoomed out
      }
      return newZoom
    })
  }

  const handleZoomReset = () => {
    setImageZoom(1)
    setImagePosition({ x: 0, y: 0 })
  }

  // Mouse drag handlers for panning zoomed images
  const handleMouseDown = (e: React.MouseEvent) => {
    if (imageZoom > 1) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - imagePosition.x, y: e.clientY - imagePosition.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && imageZoom > 1) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Navigation functions for expanded image modal
  const navigateExpandedImage = (direction: 'prev' | 'next') => {
    if (!expandedProductId) return

    const product = [...bags, ...wetsuits, ...paddleBoards, ...coolers, ...wakeboards].find(p => p.id === expandedProductId)
    if (!product || !product.images) return

    const totalImages = product.images.length
    const newIndex =
      direction === 'next'
        ? (currentImageIndex + 1) % totalImages
        : (currentImageIndex - 1 + totalImages) % totalImages

    setSelectedColor(prev => ({ ...prev, [expandedProductId]: newIndex }))
    setCurrentFeaturedImage(product.images[newIndex])
    setCurrentImageIndex(newIndex)

    // Maintain zoom levels - 150% for all enhanced products, 100% for others
    const maintainZoom =
      expandedProductId === 'gear-cascade-backpack' ||
      expandedProductId === 'gear-cascade-backpack-compact' ||
      expandedProductId === 'gear-cascade-duffle-bag' ||
      expandedProductId === 'gear-havana-inflatable-sup' ||
      expandedProductId === 'gear-hogg-35qt-wheelie-cooler' ||
      expandedProductId === 'gear-2025-mens-sprint-wetsuit' ||
      expandedProductId === 'gear-2025-womens-fusion-wetsuit' ||
      expandedProductId === 'gear-2025-mens-fusion-wetsuit' ||
      expandedProductId === 'gear-2025-mens-thermal-wetsuit' ||
      expandedProductId === 'gear-2025-womens-thermal-wetsuit'
        ? 1.5
        : 1
    setImageZoom(maintainZoom)
    setImagePosition({ x: 0, y: 0 })
  }

  const getTotalImagesForExpandedProduct = () => {
    if (!expandedProductId) return 1
    const product = [...bags, ...wetsuits, ...paddleBoards, ...coolers, ...wakeboards].find(p => p.id === expandedProductId)
    return product?.images?.length || 1
  }

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
      <section className="relative py-16 bg-gradient-to-b from-slate-900 to-slate-950 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black z-10" />
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
            filter: 'contrast(1.1) saturate(1.2) brightness(0.8)',
            backfaceVisibility: 'hidden',
            transform: 'translateZ(0)',
            willChange: 'transform',
          }}
        >
          <source src="/videos/Gear-background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-950 to-slate-950" />
        <div className="container mx-auto px-4 relative z-20">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
              GEAR
            </h1>
            <p className="text-lg text-slate-400 font-light leading-relaxed">
              Top-grade equipment built for the most demanding water conditions.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filters - Desktop */}
      <section className="sticky top-[73px] z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-1">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category.id
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {category.name}
                  <span className="ml-2 text-xs opacity-60">({category.count})</span>
                </button>
              ))}
            </div>
            <div className="text-sm text-slate-400">{filteredProducts.length} Products</div>
          </div>
        </div>
      </section>

      {/* Mobile Filters Sidebar */}
      <div
        className={`fixed inset-0 z-50 md:hidden ${mobileFiltersOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      >
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity ${mobileFiltersOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMobileFiltersOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 h-full w-80 bg-slate-900 transform transition-transform ${mobileFiltersOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Filters</h3>
            <Button variant="ghost" size="icon" onClick={() => setMobileFiltersOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="p-4 space-y-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id)
                  setMobileFiltersOpen(false)
                }}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {category.name}
                <span className="float-right text-xs opacity-60">({category.count})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products - Unified Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-fr max-sm:auto-rows-auto">
            {filteredProducts.map(product => {
              const currentColorIndex = selectedColor[product.id] || 0
              const isHovered = hoveredProduct === product.id
              const hasMultipleImages = product.images.length > 1

              return (
                <div
                  key={product.id}
                  className="group relative"
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  <div className="relative bg-slate-900/50 rounded-lg border border-slate-800/50 transition-all duration-300 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10 flex flex-col h-full sm:overflow-hidden">
                    {/* Product Image */}
                    <div className="relative aspect-square bg-gradient-to-b from-slate-800/50 to-slate-900/50 overflow-hidden sm:aspect-square">
                      <div
                        className="w-full h-full cursor-pointer flex items-center justify-center"
                        onClick={() => handleImageClick(
                            product.images[currentColorIndex] || product.images[0],
                            product.id
                        )}
                      >
                        <Image
                          src={product.images[currentColorIndex] || product.images[0]}
                          alt={product.name}
                          fill
                          className="object-contain p-2 sm:p-4 transition-transform duration-500 scale-[3.5] group-hover:scale-[3.6] sm:scale-[2.5] sm:group-hover:scale-[2.7]"
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          priority={false}
                        />
                      </div>

                      {/* Featured Badge */}
                      {product.featured && (
                        <div className="absolute top-3 left-3 bg-cyan-500/20 backdrop-blur-sm text-cyan-400 text-xs font-medium px-3 py-1 rounded-full border border-cyan-500/30 z-10">
                          FEATURED
                        </div>
                      )}

                      {/* Image Navigation for Multiple Images - Desktop Only */}
                      {hasMultipleImages && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              const prevIndex = currentColorIndex === 0 ? product.images.length - 1 : currentColorIndex - 1
                              setSelectedColor({ ...selectedColor, [product.id]: prevIndex })
                            }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 z-20 hidden sm:block"
                            aria-label="Previous image"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              const nextIndex = (currentColorIndex + 1) % product.images.length
                              setSelectedColor({ ...selectedColor, [product.id]: nextIndex })
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 z-20 hidden sm:block"
                            aria-label="Next image"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>

                          {/* Image Dots - Desktop Only */}
                          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-20 hidden sm:flex">
                            {product.images.map((_, index) => (
                              <button
                                key={index}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedColor({ ...selectedColor, [product.id]: index })
                                }}
                                className={`w-1.5 h-1.5 rounded-full transition-all ${
                                  currentColorIndex === index ? 'bg-white w-3' : 'bg-white/60'
                                }`}
                                aria-label={`View image ${index + 1}`}
                              />
                            ))}
                          </div>
                        </>
                      )}

                      {/* Mobile Image Counter - Show current image indicator */}
                      {hasMultipleImages && (
                        <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full sm:hidden">
                          {currentColorIndex + 1}/{product.images.length}
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4 space-y-3 flex-1 flex flex-col max-sm:space-y-2">
                      {/* Name and Price */}
                      <div className="space-y-1 flex-1">
                        <h3 className="font-semibold text-white text-sm md:text-base line-clamp-2 max-sm:line-clamp-none">
                          {product.name}
                        </h3>
                        <p className="text-xs md:text-sm text-slate-400 line-clamp-2 max-sm:line-clamp-3">
                          {product.description}
                        </p>
                        <div className="text-cyan-400 font-bold text-lg md:text-xl">
                          ${product.price}
                        </div>
                      </div>

                      {/* Colors */}
                      {product.colors && product.colors.length > 1 && (
                        <div className="space-y-2">
                          <p className="text-xs text-slate-400 font-medium">Color:</p>
                          <div className="flex flex-wrap gap-2">
                            {product.colors.map((color, index) => (
                              <button
                                key={color.name}
                                onClick={() => setSelectedColor({ ...selectedColor, [product.id]: index })}
                                className={`relative group/color transition-all touch-manipulation ${
                                  selectedColor[product.id] === index ? 'scale-110' : ''
                                }`}
                                title={color.name}
                                aria-label={`Select ${color.name} color`}
                                aria-pressed={selectedColor[product.id] === index}
                              >
                                <div
                                  className={`w-10 h-10 sm:w-8 sm:h-8 rounded-full border-2 transition-all ${
                                    selectedColor[product.id] === index
                                      ? 'border-cyan-400 shadow-lg shadow-cyan-400/25'
                                      : 'border-slate-600 hover:border-slate-400'
                                  }`}
                                  style={{ backgroundColor: color.hex }}
                                />
                                {selectedColor[product.id] === index && (
                                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-cyan-400 whitespace-nowrap font-medium">
                                    {color.name}
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Sizes */}
                      {product.sizes && product.sizes.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs text-slate-400 font-medium">Size:</p>
                          <div className="flex flex-wrap gap-2">
                            {product.sizes.map((size: any, sizeIndex: number) => {
                              // Handle both string sizes and object sizes with name/price
                              const isObjectSize = typeof size === 'object' && size !== null
                              const sizeName = isObjectSize ? size.name : size
                              const sizePrice = isObjectSize ? size.price : null
                              
                              return (
                                <button
                                  key={sizeName}
                                  onClick={() => setSelectedSize({ ...selectedSize, [product.id]: sizeName })}
                                  className={`px-3 py-1.5 text-xs rounded-md transition-all ${
                                    selectedSize[product.id] === sizeName
                                      ? 'bg-cyan-500 text-slate-950 font-medium'
                                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                  }`}
                                >
                                  {sizeName}
                                  {sizePrice && ` - $${sizePrice}`}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {/* Add to Cart Button - Always at bottom */}
                      <button
                        onClick={() => handleQuickAdd(product)}
                        className="w-full py-2.5 md:py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 text-sm md:text-base flex items-center justify-center gap-2 mt-auto"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {!selectedSize[product.id] && product.sizes && product.sizes.length > 0 
                          ? 'Select Size' 
                          : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Expanded Image Modal */}
      <ExpandedImageModal
        isOpen={expandedImage}
        onClose={() => setExpandedImage(false)}
        currentImage={currentFeaturedImage}
        product={expandedProductId ? (() => {
          const gearProduct = [...bags, ...wetsuits, ...paddleBoards, ...coolers, ...wakeboards].find(p => p.id === expandedProductId)
          if (!gearProduct) return null
          
          return {
            ...gearProduct,
            sizes: gearProduct.sizes.map((size: any) => 
              typeof size === 'object' ? size.name : size
            ),
            lake: '', // Add dummy lake property for type compatibility
            category: gearProduct.category || ''
          }
        })() : null}
        currentImageIndex={currentImageIndex}
        onNavigate={navigateExpandedImage}
      />
    </div>
  )
}