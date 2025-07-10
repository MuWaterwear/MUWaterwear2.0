"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import NavigationBar from "@/components/NavigationBar"
import Footer from "@/components/Footer"
import ApparelGrid from "@/components/pages/apparel/ApparelGrid"
import dynamic from 'next/dynamic'
import { allProducts, categories, getProductsByCategory } from "@/lib/features/apparel-products"
import { useOptimizedImageZoom } from "@/hooks/useOptimizedImageZoom"
import { useModalImagePreloader } from "@/components/shared/ModalImagePreloader"

const OptimizedExpandedImageModal = dynamic(() => import('@/components/pages/apparel/OptimizedExpandedImageModal'), {
  ssr: false,
  loading: () => null,
})

export default function ApparelPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedColor, setSelectedColor] = useState<{ [key: string]: number }>({})
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Optimized image zoom hook
  const {
    expandedImage,
    currentFeaturedImage,
    handleImageClick: handleOptimizedImageClick,
    closeModal,
    preloadImages,
    isPreloading
  } = useOptimizedImageZoom({
    preloadOnMount: true,
    debounceMs: 30,
    maxZoom: 3,
    zoomStep: 0.5
  })

  // Filter products based on selected category - order preserved from JSON file
  const filteredProducts = getProductsByCategory(selectedCategory)

  // Get all product images for preloading
  const allProductImages = filteredProducts.flatMap(product => product.images).slice(0, 20) // Limit to first 20 images

  // Initialize image preloader for performance
  useModalImagePreloader(allProductImages, {
    trigger: 'mount',
    delay: 500,
    sizes: ['medium', 'large']
  })

  // Preload images when category changes
  useEffect(() => {
    if (allProductImages.length > 0) {
      // Preload first batch of images with a small delay
      const timeoutId = setTimeout(() => {
        preloadImages(allProductImages.slice(0, 12))
      }, 1000)
      
      return () => clearTimeout(timeoutId)
    }
  }, [selectedCategory, allProductImages, preloadImages])

  // Enhanced image click handler that also sets product context
  const handleImageClick = (imageSrc: string, productId: string) => {
    const product = allProducts.find(p => p.id === productId)
    if (!product) return

    setExpandedProductId(productId)
    const colorIndex = selectedColor[productId] || 0
    setCurrentImageIndex(colorIndex)
    
    // Use optimized image click handler
    handleOptimizedImageClick(imageSrc)
  }

  // Enhanced navigation that updates color selection
  const navigateExpandedImage = (direction: 'prev' | 'next') => {
    if (!expandedProductId) return

    const product = allProducts.find(p => p.id === expandedProductId)
    if (!product || !product.images) return

    const totalImages = product.images.length
    const newIndex = direction === 'next' 
        ? (currentImageIndex + 1) % totalImages
        : (currentImageIndex - 1 + totalImages) % totalImages

    setSelectedColor(prev => ({ ...prev, [expandedProductId]: newIndex }))
    setCurrentImageIndex(newIndex)
    
    // Update the optimized modal with the new image
    handleOptimizedImageClick(product.images[newIndex])
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

        {/* Navigation Bar */}
        <NavigationBar onMobileMenuOpen={() => setMobileFiltersOpen(true)} />

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
              willChange: 'transform'
          }}
        >
          <source src="/videos/appparel-background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-950 to-slate-950" />
        <div className="container mx-auto px-4 relative z-20">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
              APPAREL
            </h1>
            <p className="text-lg text-slate-400 font-light leading-relaxed">
              Thoughtfully designed apparel for those who live for the water.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filters - Desktop */}
      <section className="sticky top-[73px] z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-1">
                {categories.map((category) => (
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
              <div className="flex items-center gap-3 text-sm text-slate-400">
                {filteredProducts.length} Products
                {isPreloading && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-cyan-400">Optimizing</span>
                  </div>
                )}
              </div>
          </div>
        </div>
      </section>

      {/* Mobile Filter Bar */}
      <section className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 md:hidden">
        <div className="flex items-center justify-between py-3 px-4">
          <div className="text-sm text-slate-400">
            {filteredProducts.length} Products
          </div>
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-slate-800/50 text-slate-300 hover:bg-slate-700"
          >
            Filter
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </button>
        </div>
      </section>

      {/* Mobile Filters Sidebar */}
        <div className={`fixed inset-0 z-50 md:hidden ${mobileFiltersOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity ${mobileFiltersOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMobileFiltersOpen(false)}
        />
          <div className={`absolute right-0 top-0 h-full w-80 bg-slate-900 transform transition-transform ${mobileFiltersOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Filters</h3>
            <Button variant="ghost" size="icon" onClick={() => setMobileFiltersOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="p-4 space-y-2">
              {categories.map((category) => (
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

      {/* Products Grid */}
        <ApparelGrid 
          products={filteredProducts} 
          onImageClick={handleImageClick}
          selectedColor={selectedColor}
          onColorChange={(productId, index) => setSelectedColor(prev => ({ ...prev, [productId]: index }))}
        />

      {/* Footer */}
        <Footer />

      {/* Optimized Expanded Image Modal */}
        <OptimizedExpandedImageModal
          isOpen={expandedImage}
          onClose={closeModal}
          currentImage={currentFeaturedImage}
          product={expandedProductId ? allProducts.find(p => p.id === expandedProductId) || null : null}
          currentImageIndex={currentImageIndex}
          onNavigate={navigateExpandedImage}
        />
    </div>
  )
}