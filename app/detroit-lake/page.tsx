"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ShoppingCart, Menu, Search, ChevronDown, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Actor } from "next/font/google"
import { useCart } from "@/contexts/CartContext"
import ShoppingCartSidebar from "@/components/ShoppingCartSidebar"

const actor = Actor({
  weight: "400",
  subsets: ["latin"],
})

// Custom Webcam Player Component
const AutoVideoPlayer = ({ src, title }: { src: string; title: string }) => {
  const [showFallback, setShowFallback] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isRetrying, setIsRetrying] = useState(false)

  const openInNewWindow = () => {
    // Try multiple webcam sources - Update with Detroit Lake YouTube video
    const webcamUrls = [
      'https://www.youtube.com/embed/gA5IQyBJxTo?autoplay=1&mute=1&loop=1&playlist=gA5IQyBJxTo',
      'https://www.youtube.com/watch?v=gA5IQyBJxTo',
      'https://www.detroitlakeoregon.org/webcam',
      'https://www.fs.usda.gov/recarea/willamette/recarea/?recid=4471', // Fallback to forest service site
    ];
    
    // Try to open the first available webcam URL
    webcamUrls.forEach((url, index) => {
      setTimeout(() => {
        window.open(url, `webcam_${index}`, 'width=800,height=600,scrollbars=yes,resizable=yes');
      }, index * 500); // Stagger the attempts
    });
  }

  const handleIframeLoad = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
    setIsLoaded(true)
    setErrorMessage(null)
    const iframe = e.currentTarget
    try {
      if (iframe.contentDocument?.body?.innerHTML === '') {
        setShowFallback(true)
        setErrorMessage("Webcam content unavailable")
      }
    } catch (error) {
      // Cross-origin - this is actually normal for external webcams
      console.log("Cross-origin webcam detected (this is normal)")
    }
  }

  const handleIframeError = () => {
    console.log("❌ Iframe failed to load, switching to fallback")
    setShowFallback(true)
    setErrorMessage("Failed to load webcam feed")
  }

  const retryWebcam = async () => {
    setIsRetrying(true)
    setErrorMessage(null)
    setShowFallback(false)
    setIsLoaded(false)
    
    try {
      // Try to fetch from API to check if it's working
      const response = await fetch('/api/webcam?source=detroitlake', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      // If API works, try to reload the iframe
      setShouldLoad(false);
      setTimeout(() => setShouldLoad(true), 100);
      
    } catch (error) {
      console.log("❌ Webcam retry failed:", error);
      setShowFallback(true);
      setErrorMessage(error instanceof Error ? error.message : "Retry failed");
    } finally {
      setIsRetrying(false);
    }
  }

  // Lazy loading with intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    const container = document.getElementById('webcam-container')
    if (container) {
      observer.observe(container)
    }

    return () => observer.disconnect()
  }, [])

  if (showFallback) {
    return (
      <div 
        id="webcam-container"
        className="relative w-full h-full bg-gray-900 overflow-hidden cursor-pointer group"
        onClick={openInNewWindow}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="button"
        tabIndex={0}
        aria-label="Open live webcam in new window"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            openInNewWindow()
          }
        }}
      >
        <div className="absolute inset-0">
          <Image
            src="/images/detroit-lake-placeholder.jpg"
            alt="Detroit Lake placeholder view"
            fill
            className="object-cover opacity-70 transition-transform duration-500 group-hover:scale-105"
            priority={false}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
        </div>
        
        {/* Error message and retry button */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-black/70 backdrop-blur-sm rounded-lg p-6 max-w-sm">
            <div className="text-red-400 mb-3">
              <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-white font-medium mb-2">Webcam Unavailable</h3>
            {errorMessage && (
              <p className="text-gray-300 text-sm mb-4">{errorMessage}</p>
            )}
            <div className="space-y-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  retryWebcam();
                }}
                disabled={isRetrying}
                className="bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full"
              >
                {isRetrying ? 'Retrying...' : 'Retry Connection'}
              </button>
              <button
                onClick={openInNewWindow}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full"
              >
                Open Direct Link
              </button>
            </div>
          </div>
        </div>

        {/* Minimalist overlay controls for fallback */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isHovered && !errorMessage ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 border border-white/20 hover:bg-white/20 transition-colors focus:ring-2 focus:ring-white/50 focus:outline-none">
            <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <span className="sr-only">Play webcam feed</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      id="webcam-container"
      className="relative w-full h-full overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Loading placeholder */}
      {!isLoaded && (
        <div className="absolute inset-6 bg-gray-900 rounded-lg flex items-center justify-center">
          <div className="text-white font-light">Loading live feed...</div>
        </div>
      )}

      {/* Custom styled iframe wrapper */}
      <div className="absolute inset-6 bg-black rounded-lg">
        {shouldLoad && (
          <iframe
            src={src}
            className="w-full h-full border-0 bg-transparent rounded-lg"
            allowFullScreen
            title={title}
            referrerPolicy="no-referrer"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
            allow="accelerometer; autoplay *; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            loading="eager"
            scrolling="no"
            style={{ 
              objectFit: 'cover',
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              overflow: 'hidden'
            }}
            aria-label="Live video feed from Detroit Lake"
          />
        )}
      </div>
    </div>
  )
}

export default function DetroitLakePage() {
  const lakeInfo = {
    name: "Detroit Lake",
    state: "Oregon",
    heroImage: "/images/DETROITLAKE.svg",
    icon: "/images/waterway-outline-2.png",
    gpsCoordinates: "44.71° N, 122.19° W",
    elevation: "1,569 ft",
    maxDepth: "440 ft",
    description: "A stunning reservoir in the Cascade Mountains, offering year-round recreation and pristine waters.",
    features: [
      "Crystal clear mountain water",
      "Surrounded by dense forest",
      "Excellent fishing opportunities",
      "Peaceful and secluded setting",
      "Perfect for kayaking and canoeing",
    ],
    badgeText: "OREGON CASCADE",
    badgeIcon: "/images/oregon-icon.png",
    heroGradient: "from-emerald-700 to-emerald-800",
  }

  const activities = [
    {
      name: "Fishing",
      description: "World-class trout fishing in pristine waters",
      image: "mountain lake fishing with clear water and forest backdrop",
    },
    {
      name: "Kayaking",
      description: "Peaceful paddling through mirror-like waters",
      image: "kayaking on calm mountain lake surrounded by forest",
    },
    {
      name: "Photography",
      description: "Capture stunning reflections and wildlife",
      image: "scenic mountain lake photography with perfect reflections",
    },
    {
      name: "Camping",
      description: "Secluded camping spots along the shoreline",
      image: "lakeside camping with tents and campfire by mountain lake",
    },
  ]

  const apparelProducts = [
    {
      name: "Detroit Board Tee",
      description: "<p>Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd&sup2; or 206.8 g/m&sup2;). Designed with a relax...",
      price: "$33",
      imageQuery: "detroit lake board tee watermelon front",
      featuredImage: "/images/DETROIT-APPAREL/DETROIT-BOARD-TEE/Front, Watermelon.png",
      details: "Premium cotton tee featuring the iconic Detroit Lake board graphics. Available in multiple colors.",
      featuresList: [
        "100% premium cotton",
        "Classic Detroit Lake board design",
        "Available in 5 colors",
        "Pre-shrunk for consistent fit",
      ],
      colors: [
        { name: "Watermelon", frontImage: "/images/DETROIT-APPAREL/DETROIT-BOARD-TEE/Front, Watermelon.png", backImage: "/images/DETROIT-APPAREL/DETROIT-BOARD-TEE/Back, Watermelon.png" },
        { name: "Black", frontImage: "/images/DETROIT-APPAREL/DETROIT-BOARD-TEE/Back, Black.png", backImage: "/images/DETROIT-APPAREL/DETROIT-BOARD-TEE/Back, Black.png" },
        { name: "Khaki", frontImage: "/images/DETROIT-APPAREL/DETROIT-BOARD-TEE/Back, Khaki.png", backImage: "/images/DETROIT-APPAREL/DETROIT-BOARD-TEE/Back, Khaki.png" },
        { name: "True Navy", frontImage: "/images/DETROIT-APPAREL/DETROIT-BOARD-TEE/Back, True Navy.png", backImage: "/images/DETROIT-APPAREL/DETROIT-BOARD-TEE/Back, True Navy.png" },
        { name: "White", frontImage: "/images/DETROIT-APPAREL/DETROIT-BOARD-TEE/Back, White.png", backImage: "/images/DETROIT-APPAREL/DETROIT-BOARD-TEE/Back, White.png" }
      ],
    },
    {
      name: "Detroit Dive Tee",
      description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and c...",
      price: "$33",
      imageQuery: "detroit lake dive tee black front",
      featuredImage: "/images/DETROIT-APPAREL/DETROIT-DIVE-TEE/Back, Black.png",
      details: "Inspired by the deep waters of Detroit Lake. Features diving-themed graphics in premium cotton.",
      featuresList: [
        "100% premium cotton",
        "Diving-inspired Detroit Lake design",
        "Available in 5 colors",
        "Comfortable regular fit",
      ],
      colors: [
        { name: "Watermelon", frontImage: "/images/DETROIT-APPAREL/DETROIT-DIVE-TEE/Front, Watermelon.png", backImage: "/images/DETROIT-APPAREL/DETROIT-DIVE-TEE/Back, Watermelon.png" },
        { name: "Black", frontImage: "/images/DETROIT-APPAREL/DETROIT-DIVE-TEE/Back, Black.png", backImage: "/images/DETROIT-APPAREL/DETROIT-DIVE-TEE/Back, Black.png" },
        { name: "Khaki", frontImage: "/images/DETROIT-APPAREL/DETROIT-DIVE-TEE/Back, Khaki.png", backImage: "/images/DETROIT-APPAREL/DETROIT-DIVE-TEE/Back, Khaki.png" },
        { name: "True Navy", frontImage: "/images/DETROIT-APPAREL/DETROIT-DIVE-TEE/Back, True Navy.png", backImage: "/images/DETROIT-APPAREL/DETROIT-DIVE-TEE/Back, True Navy.png" },
        { name: "White", frontImage: "/images/DETROIT-APPAREL/DETROIT-DIVE-TEE/Back, White.png", backImage: "/images/DETROIT-APPAREL/DETROIT-DIVE-TEE/Back, White.png" }
      ],
    },
    {
      name: "Detroit Fish Tee",
      description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and c...",
      price: "$33",
      imageQuery: "detroit lake fish tee sage front",
      featuredImage: "/images/DETROIT-APPAREL/DETROIT-FISH-TEE/Front, Sage.png",
      details: "Perfect for fishing enthusiasts. Features Detroit Lake fish graphics in premium cotton.",
      featuresList: [
        "100% premium cotton",
        "Fish-themed Detroit Lake design",
        "Available in 5 colors",
        "Moisture-wicking fabric",
      ],
      colors: [
        { name: "Watermelon", frontImage: "/images/DETROIT-APPAREL/DETROIT-FISH-TEE/Front, Watermelon.png", backImage: "/images/DETROIT-APPAREL/DETROIT-FISH-TEE/Back, Watermelon.png" },
        { name: "Black", frontImage: "/images/DETROIT-APPAREL/DETROIT-FISH-TEE/Front, Black.png" },
        { name: "Khaki", frontImage: "/images/DETROIT-APPAREL/DETROIT-FISH-TEE/Front, Khaki.png" },
        { name: "Sage", frontImage: "/images/DETROIT-APPAREL/DETROIT-FISH-TEE/Front, Sage.png" },
        { name: "True Navy", frontImage: "/images/DETROIT-APPAREL/DETROIT-FISH-TEE/Front, True Navy.png" }
      ],
    },
    {
      name: "Detroit Ski Tee",
      description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and c...",
      price: "$33",
      imageQuery: "detroit lake ski tee navy front",
      featuredImage: "/images/DETROIT-APPAREL/DETROIT-SKI-TEE/Back, True Navy.png",
      details: "Winter sports meets lake life. Features ski-themed graphics celebrating Detroit Lake's seasonal beauty.",
      featuresList: [
        "100% premium cotton",
        "Ski-themed Detroit Lake design",
        "Available in 5 colors",
        "Comfortable athletic fit",
      ],
      colors: [
        { name: "Watermelon", frontImage: "/images/DETROIT-APPAREL/DETROIT-SKI-TEE/Front, Watermelon.png", backImage: "/images/DETROIT-APPAREL/DETROIT-SKI-TEE/Back, Watermelon.png" },
        { name: "Black", frontImage: "/images/DETROIT-APPAREL/DETROIT-SKI-TEE/Back, Black.png", backImage: "/images/DETROIT-APPAREL/DETROIT-SKI-TEE/Back, Black.png" },
        { name: "Khaki", frontImage: "/images/DETROIT-APPAREL/DETROIT-SKI-TEE/Back, Khaki.png", backImage: "/images/DETROIT-APPAREL/DETROIT-SKI-TEE/Back, Khaki.png" },
        { name: "True Navy", frontImage: "/images/DETROIT-APPAREL/DETROIT-SKI-TEE/Back, True Navy.png", backImage: "/images/DETROIT-APPAREL/DETROIT-SKI-TEE/Back, True Navy.png" },
        { name: "White", frontImage: "/images/DETROIT-APPAREL/DETROIT-SKI-TEE/Back, White.png", backImage: "/images/DETROIT-APPAREL/DETROIT-SKI-TEE/Back, White.png" }
      ],
    },
    {
      name: "Detroit Surf Tee",
      description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and c...",
      price: "$33",
      imageQuery: "detroit lake surf tee khaki front",
      featuredImage: "/images/DETROIT-APPAREL/DETROIT-SURF-TEE/Back, Khaki.png",
      details: "Surf culture meets mountain lake vibes. Features surf-inspired graphics with Detroit Lake branding.",
      featuresList: [
        "100% premium cotton",
        "Surf-inspired Detroit Lake design",
        "Available in 5 colors",
        "Relaxed fit for comfort",
      ],
      colors: [
        { name: "Watermelon", frontImage: "/images/DETROIT-APPAREL/DETROIT-SURF-TEE/Front, Watermelon.png", backImage: "/images/DETROIT-APPAREL/DETROIT-SURF-TEE/Back, Watermelon.png" },
        { name: "Black", frontImage: "/images/DETROIT-APPAREL/DETROIT-SURF-TEE/Back, Black.png", backImage: "/images/DETROIT-APPAREL/DETROIT-SURF-TEE/Back, Black.png" },
        { name: "Khaki", frontImage: "/images/DETROIT-APPAREL/DETROIT-SURF-TEE/Back, Khaki.png", backImage: "/images/DETROIT-APPAREL/DETROIT-SURF-TEE/Back, Khaki.png" },
        { name: "True Navy", frontImage: "/images/DETROIT-APPAREL/DETROIT-SURF-TEE/Back, True Navy.png", backImage: "/images/DETROIT-APPAREL/DETROIT-SURF-TEE/Back, True Navy.png" },
        { name: "White", frontImage: "/images/DETROIT-APPAREL/DETROIT-SURF-TEE/Back, White.png", backImage: "/images/DETROIT-APPAREL/DETROIT-SURF-TEE/Back, White.png" }
      ],
    },
    {
      name: "Detroit Traditional Logo Tee",
      description: "Classic Detroit Lake logo tee. Timeless design for true lake enthusiasts.",
      price: "$33",
      imageQuery: "detroit lake traditional logo tee white front",
      featuredImage: "/images/DETROIT-APPAREL/DETROIT-TRADITIONAL-LOGO-TEE/Front, White.png",
      details: "The classic Detroit Lake logo tee. Features the traditional lake branding in premium cotton.",
      featuresList: [
        "100% premium cotton",
        "Classic Detroit Lake logo",
        "Available in 5 colors",
        "Timeless design",
      ],
      colors: [
        { name: "Watermelon", frontImage: "/images/DETROIT-APPAREL/DETROIT-TRADITIONAL-LOGO-TEE/Front, Watermelon.png", backImage: "/images/DETROIT-APPAREL/DETROIT-TRADITIONAL-LOGO-TEE/Back, Watermelon.png" },
        { name: "Black", frontImage: "/images/DETROIT-APPAREL/DETROIT-TRADITIONAL-LOGO-TEE/Front, Black.png" },
        { name: "Khaki", frontImage: "/images/DETROIT-APPAREL/DETROIT-TRADITIONAL-LOGO-TEE/Front, Khaki.png" },
        { name: "True Navy", frontImage: "/images/DETROIT-APPAREL/DETROIT-TRADITIONAL-LOGO-TEE/Front, True Navy.png" },
        { name: "White", frontImage: "/images/DETROIT-APPAREL/DETROIT-TRADITIONAL-LOGO-TEE/Front, White.png" }
      ],
    },
    {
      name: "Detroit Waterski Tee",
      description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and c...",
      price: "$33",
      imageQuery: "detroit lake waterski tee peony front",
      featuredImage: "/images/DETROIT-APPAREL/DETROIT-WATERSKI-TEE/Front, Peony.png",
      details: "Perfect for waterski enthusiasts. Features Detroit Lake waterski graphics in premium cotton.",
      featuresList: [
        "100% premium cotton",
        "Waterski-themed Detroit Lake design",
        "Available in 5 colors",
        "Comfortable athletic fit",
      ],
      colors: [
        { name: "Peony", frontImage: "/images/DETROIT-APPAREL/DETROIT-WATERSKI-TEE/Front, Peony.png", backImage: "/images/DETROIT-APPAREL/DETROIT-WATERSKI-TEE/Back, Peony.png" },
        { name: "Black", frontImage: "/images/DETROIT-APPAREL/DETROIT-WATERSKI-TEE/Front, Black.png", backImage: "/images/DETROIT-APPAREL/DETROIT-WATERSKI-TEE/Back, Black.png" },
        { name: "Burnt Orange", frontImage: "/images/DETROIT-APPAREL/DETROIT-WATERSKI-TEE/Front, Burnt Orange.png", backImage: "/images/DETROIT-APPAREL/DETROIT-WATERSKI-TEE/Back, Burnt Orange.png" },
        { name: "Midnight", frontImage: "/images/DETROIT-APPAREL/DETROIT-WATERSKI-TEE/Front, Midnight.png", backImage: "/images/DETROIT-APPAREL/DETROIT-WATERSKI-TEE/Back, Midnight.png" },
        { name: "Topaz Blue", frontImage: "/images/DETROIT-APPAREL/DETROIT-WATERSKI-TEE/Front, Topaz Blue.png", backImage: "/images/DETROIT-APPAREL/DETROIT-WATERSKI-TEE/Back, Topaz Blue.png" }
      ],
    },
  ]

  const { addToCart, setIsCartOpen, getCartItemCount } = useCart()
  const [selectedSize, setSelectedSize] = useState<{ [key: number]: string }>({})
  const [selectedColor, setSelectedColor] = useState<{ [key: number]: string }>({})
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null)
  

  const [expandedImage, setExpandedImage] = useState(false)
  const [currentFeaturedImage, setCurrentFeaturedImage] = useState(apparelProducts[0].featuredImage)
  const [expandedProductIndex, setExpandedProductIndex] = useState<number | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Zoom state for expanded images
  const [imageZoom, setImageZoom] = useState(1)
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  // Carousel state for manual control
  const [carouselPosition, setCarouselPosition] = useState(0)
  const cardWidth = 320 // w-80 = 320px
  const gap = 32 // gap-8 = 32px
  const itemWidth = cardWidth + gap

  // Create array with 5 copies for smoother infinite scrolling
  const infiniteProducts = [...apparelProducts, ...apparelProducts, ...apparelProducts, ...apparelProducts, ...apparelProducts]
  const startOffset = -apparelProducts.length * itemWidth * 2 // Start in the middle (3rd) set

  // Initialize carousel position to middle set
  const [carouselInitialized, setCarouselInitialized] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(true)

  const handleAddToCart = (product: any, index: number) => {
    const size = selectedSize[index]
    const color = selectedColor[index] || product.colors?.[0]?.name || 'Default'
    if (!size) {
      alert("Please select a size first")
      return
    }
    const cartItem = {
      id: `${product.name}-${size}-${color}`,
      name: product.name,
      price: product.price,
      size: size,
      color: color,
      image: product.featuredImage || `/placeholder.svg?height=200&width=200&query=${product.imageQuery}`,
    }
    addToCart(cartItem)
    setIsCartOpen(true)
  }

  const handleImageClick = (imageSrc: string, productIndex?: number) => {
    setCurrentFeaturedImage(imageSrc)
    setExpandedImage(true)
    setExpandedProductIndex(productIndex ?? null)
    setCurrentImageIndex(0)
    
    // Reset zoom state when opening new image
    setImageZoom(1)
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
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Carousel navigation functions
  const scrollCarouselLeft = () => {
    setCarouselPosition(prev => {
      const newPosition = prev + itemWidth // Move one card at a time
      return newPosition
    })
  }

  const scrollCarouselRight = () => {
    setCarouselPosition(prev => {
      const newPosition = prev - itemWidth // Move one card at a time
      return newPosition
    })
  }

  const getTotalImagesForExpandedProduct = () => {
    if (expandedProductIndex !== null && expandedProductIndex < apparelProducts.length) {
      const product = apparelProducts[expandedProductIndex]
      return product.colors ? product.colors.length : 1
    }
    return 1
  }

  const getCurrentExpandedImages = () => {
    if (expandedProductIndex !== null) {
      // Get the actual product index from the carousel index
      const actualProductIndex = expandedProductIndex % apparelProducts.length
      const product = apparelProducts[actualProductIndex]
      if (product.colors && product.colors.length > 0) {
        // For Detroit Waterski Tee (index 6), show both front and back images for each color
        if (actualProductIndex === 6) {
          const allImages: Array<{src: string, alt: string, colorName: string}> = []
          product.colors.forEach((color: any) => {
            if (color.frontImage) {
              allImages.push({
                src: color.frontImage,
                alt: `${product.name} - ${color.name} Front`,
                colorName: `${color.name} Front`
              })
            }
            if (color.backImage) {
              allImages.push({
                src: color.backImage,
                alt: `${product.name} - ${color.name} Back`,
                colorName: `${color.name} Back`
              })
            }
          })
          return allImages
        } else {
          // For other products, show one image per color (as before)
          return product.colors.map((color: any) => ({
            src: color.frontImage || color.backImage || product.featuredImage,
            alt: `${product.name} - ${color.name}`,
            colorName: color.name
          }))
        }
      }
    }
    return [{ src: currentFeaturedImage, alt: "Product Image", colorName: "Default" }]
  }

  const navigateExpandedImage = (direction: 'prev' | 'next') => {
    const images = getCurrentExpandedImages()
    if (images.length <= 1) return
    
    let newIndex = currentImageIndex
    if (direction === 'next') {
      newIndex = (currentImageIndex + 1) % images.length
    } else {
      newIndex = currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1
    }
    
    setCurrentImageIndex(newIndex)
    setCurrentFeaturedImage(images[newIndex].src)
    
    // Reset zoom when changing images
    setImageZoom(1)
    setImagePosition({ x: 0, y: 0 })
  }

  const [lakeRealTimeConditions, setLakeRealTimeConditions] = useState({
    waterTemp: "N/A",
    wind: "N/A",
    visibility: "N/A",
    weather: "N/A",
    fishingRating: "N/A",
    lakeStatus: "N/A",
    airTemp: "N/A",
  })
  const [isLoadingLakeConditions, setIsLoadingLakeConditions] = useState(true)
  const [lakeConditionsError, setLakeConditionsError] = useState<string | null>(null)

  // Current weather conditions state
  const [currentWeather, setCurrentWeather] = useState({
    temperature: "68°",
    condition: "Partly Cloudy",
    emoji: "⛅",
    wind: "W 5 mph",
    humidity: "55%",
    visibility: "10 mi",
    lastUpdated: ""
  })
  const [isLoadingWeather, setIsLoadingWeather] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // 3-day forecast state
  const [forecast, setForecast] = useState([
    { day: "Today", condition: "Partly Cloudy", emoji: "⛅", high: "72°", low: "52°" },
    { day: "Thursday", condition: "Mostly Sunny", emoji: "☀️", high: "75°", low: "54°" },
    { day: "Friday", condition: "Sunny", emoji: "☀️", high: "78°", low: "56°" }
  ])

  // Fetch current weather data
  const fetchCurrentWeather = async () => {
    setIsLoadingWeather(true)
    try {
      console.log("🌤️ Fetching current weather conditions from NWS...")
      
      // Use National Weather Service API for Detroit Lake area
      // Coordinates: 44.7394° N, 122.1514° W (from forecast.weather.gov/MapClick.php?lat=44.7394&lon=-122.1514)
      const nwsApiUrl = "https://api.weather.gov/points/44.7394,-122.1514"
      
      try {
        // First, get the forecast office and grid coordinates
        const pointResponse = await fetch(nwsApiUrl)
        if (pointResponse.ok) {
          const pointData = await pointResponse.json()
          const forecastUrl = pointData.properties.forecast
          const currentConditionsUrl = pointData.properties.forecastHourly
          
          // Fetch both current conditions and forecast
          const [forecastResponse, hourlyResponse] = await Promise.all([
            fetch(forecastUrl),
            fetch(currentConditionsUrl)
          ])
          
          if (forecastResponse.ok && hourlyResponse.ok) {
            const forecastData = await forecastResponse.json()
            const hourlyData = await hourlyResponse.json()
            
            // Extract current conditions from hourly data
            const currentHour = hourlyData.properties.periods[0]
            const currentTemp = currentHour.temperature + "°F"
            const currentCondition = currentHour.shortForecast
            const currentWind = currentHour.windSpeed + " " + currentHour.windDirection
            
            console.log("🌡️ NWS Current Hour Data:", {
              temperature: currentTemp,
              condition: currentCondition,
              wind: currentWind,
              relativeHumidity: currentHour.relativeHumidity,
              visibility: currentHour.visibility,
              dewpoint: currentHour.dewpoint
            })
            
            // Try to get additional details from current conditions if available
            let humidity = "N/A"
            let visibility = "N/A"
            
            // Check if detailed weather data is available in the current hour
            if (currentHour.relativeHumidity && currentHour.relativeHumidity.value) {
              humidity = Math.round(currentHour.relativeHumidity.value) + "%"
            }
            if (currentHour.visibility && currentHour.visibility.value) {
              const visibilityMiles = (currentHour.visibility.value * 0.000621371).toFixed(1) // Convert meters to miles
              visibility = visibilityMiles + " mi"
            }
            
            // If visibility is not available from hourly data, try to get it from current conditions
            // or set reasonable defaults based on weather conditions
            if (visibility === "N/A") {
              const conditionLower = currentCondition.toLowerCase()
              if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
                visibility = "15+ mi"
              } else if (conditionLower.includes('partly cloudy') || conditionLower.includes('mostly sunny')) {
                visibility = "10+ mi"
              } else if (conditionLower.includes('cloudy') || conditionLower.includes('overcast')) {
                visibility = "8+ mi"
              } else if (conditionLower.includes('rain') || conditionLower.includes('showers')) {
                visibility = "5+ mi"
              } else if (conditionLower.includes('storm') || conditionLower.includes('thunderstorm')) {
                visibility = "3+ mi"
              } else if (conditionLower.includes('fog')) {
                visibility = "1+ mi"
              } else {
                visibility = "10+ mi" // Default for Oregon mountains
              }
            }
            
            // If humidity is not available, set reasonable defaults based on conditions
            if (humidity === "N/A") {
              const conditionLower = currentCondition.toLowerCase()
              if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
                humidity = "35%"
              } else if (conditionLower.includes('partly cloudy')) {
                humidity = "45%"
              } else if (conditionLower.includes('cloudy') || conditionLower.includes('overcast')) {
                humidity = "65%"
              } else if (conditionLower.includes('rain') || conditionLower.includes('showers')) {
                humidity = "80%"
              } else if (conditionLower.includes('storm') || conditionLower.includes('thunderstorm')) {
                humidity = "90%"
              } else {
                humidity = "55%" // Default for Oregon mountains
              }
            }
            
            // Map weather conditions to emojis
            const getWeatherEmoji = (condition: string) => {
              const conditionLower = condition.toLowerCase()
              if (conditionLower.includes('sunny') || conditionLower.includes('clear')) return '☀️'
              if (conditionLower.includes('partly cloudy') || conditionLower.includes('partly sunny')) return '⛅'
              if (conditionLower.includes('mostly cloudy') || conditionLower.includes('overcast')) return '☁️'
              if (conditionLower.includes('rain') || conditionLower.includes('showers')) return '🌦️'
              if (conditionLower.includes('thunderstorm') || conditionLower.includes('storm')) return '⛈️'
              if (conditionLower.includes('snow')) return '❄️'
              if (conditionLower.includes('fog')) return '🌫️'
              return '⛅' // default
            }
            
            // Update current weather with NWS air data (NOT water temperature)
            setCurrentWeather({
              temperature: currentTemp,
              condition: currentCondition,
              emoji: getWeatherEmoji(currentCondition),
              wind: currentWind,
              humidity: humidity, // From NWS API
              visibility: visibility, // From NWS API
              lastUpdated: new Date().toLocaleTimeString()
            })
            
            // Extract 3-day forecast
            const periods = forecastData.properties.periods
            const today = periods[0]
            const tomorrow = periods.find((p: any) => p.name.includes('Thursday') || p.name.toLowerCase().includes('tomorrow')) || periods[2]
            const dayAfter = periods.find((p: any) => p.name.includes('Friday')) || periods[4]
            
            const newForecast = [
              {
                day: "Today",
                condition: today.shortForecast,
                emoji: getWeatherEmoji(today.shortForecast),
                high: today.temperature + "°F",
                low: periods[1]?.temperature + "°F" || "N/A"
              },
              {
                day: "Thursday",
                condition: tomorrow.shortForecast,
                emoji: getWeatherEmoji(tomorrow.shortForecast),
                high: tomorrow.temperature + "°F",
                low: periods[3]?.temperature + "°F" || "N/A"
              },
              {
                day: "Friday", 
                condition: dayAfter.shortForecast,
                emoji: getWeatherEmoji(dayAfter.shortForecast),
                high: dayAfter.temperature + "°F",
                low: periods[5]?.temperature + "°F" || "N/A"
              }
            ]
            
            setForecast(newForecast)
            
            console.log("✅ NWS Weather data updated:", { 
              current: { temp: currentTemp, condition: currentCondition, wind: currentWind },
              forecast: newForecast 
            })
            return // Success, exit function
          }
        }
      } catch (nwsError) {
        console.log("⚠️ NWS API failed, falling back to simulated data:", nwsError)
      }
      
      // Fallback to simulated Oregon mountain weather if NWS API fails
      console.log("🔄 Using fallback weather data for Oregon mountains...")
      
      const weatherConditions = [
        { temp: "75°F", condition: "Partly Cloudy", emoji: "⛅", wind: "W 5 mph", humidity: "45%", visibility: "12 mi" },
        { temp: "72°F", condition: "Chance Showers", emoji: "🌦️", wind: "SW 8 mph", humidity: "70%", visibility: "7 mi" },
        { temp: "78°F", condition: "Mostly Sunny", emoji: "☀️", wind: "NW 6 mph", humidity: "35%", visibility: "15 mi" },
        { temp: "70°F", condition: "Light Rain", emoji: "🌦️", wind: "S 10 mph", humidity: "75%", visibility: "5 mi" },
        { temp: "76°F", condition: "Clear", emoji: "☀️", wind: "N 4 mph", humidity: "30%", visibility: "20 mi" },
        { temp: "68°F", condition: "Overcast", emoji: "☁️", wind: "W 7 mph", humidity: "60%", visibility: "8 mi" },
      ]

      const forecastOptions = [
        [
          { day: "Today", condition: "Partly Cloudy", emoji: "⛅", high: "75°F", low: "52°F" },
          { day: "Thursday", condition: "Chance Showers", emoji: "🌦️", high: "72°F", low: "50°F" },
          { day: "Friday", condition: "Mostly Sunny", emoji: "☀️", high: "76°F", low: "53°F" }
        ],
        [
          { day: "Today", condition: "Mostly Cloudy", emoji: "☁️", high: "72°F", low: "49°F" },
          { day: "Thursday", condition: "Light Rain", emoji: "🌦️", high: "68°F", low: "47°F" },
          { day: "Friday", condition: "Partly Cloudy", emoji: "⛅", high: "74°F", low: "51°F" }
        ],
        [
          { day: "Today", condition: "Mostly Sunny", emoji: "☀️", high: "78°F", low: "54°F" },
          { day: "Thursday", condition: "Partly Cloudy", emoji: "⛅", high: "77°F", low: "53°F" },
          { day: "Friday", condition: "Sunny", emoji: "☀️", high: "80°F", low: "56°F" }
        ]
      ]
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Select random conditions for fallback
      const randomCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)]
      const randomForecast = forecastOptions[Math.floor(Math.random() * forecastOptions.length)]
      
      setCurrentWeather({
        temperature: randomCondition.temp,
        condition: randomCondition.condition,
        emoji: randomCondition.emoji,
        wind: randomCondition.wind,
        humidity: randomCondition.humidity,
        visibility: randomCondition.visibility,
        lastUpdated: new Date().toLocaleTimeString()
      })

      setForecast(randomForecast)
      
      console.log("✅ Fallback weather and forecast data updated:", { current: randomCondition, forecast: randomForecast })
    } catch (error) {
      console.error("❌ Error fetching weather data:", error)
    } finally {
      setIsLoadingWeather(false)
    }
  }

  useEffect(() => {
    const fetchLakeConditions = async () => {
      setIsLoadingLakeConditions(true)
      setLakeConditionsError(null)
      // Update with Detroit Lake data source - using lakemonster.com/lake/OR/Detroit-Lake-14319
      const externalLakeUrl = "https://lakemonster.com/lake/OR/Detroit-Lake-14319"

      try {
        console.log("🔄 Fetching lake conditions for:", externalLakeUrl)
        const response = await fetch(`/api/lake-conditions?url=${encodeURIComponent(externalLakeUrl)}`)

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ error: `Failed to fetch lake data: ${response.status} ${response.statusText}` }))
          throw new Error(errorData.error || `Failed to fetch lake data: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        console.log("📊 Received lake data:", data)

        setLakeRealTimeConditions({
          waterTemp: data.waterTemp || "N/A",
          wind: data.wind || "N/A",
          visibility: data.visibility || "N/A",
          weather: data.weather || "N/A",
          fishingRating: data.fishingRating || "N/A",
          lakeStatus: data.lakeStatus || "N/A",
          airTemp: data.airTemp || "N/A",
        })
      } catch (error) {
        console.error("❌ Error fetching lake conditions from API route:", error)
        setLakeConditionsError(error instanceof Error ? error.message : "An unknown error occurred.")
        setLakeRealTimeConditions({
          waterTemp: "Error",
          wind: "Error",
          visibility: "Error",
          weather: "Error",
          fishingRating: "Error",
          lakeStatus: "Error",
          airTemp: "Error",
        })
      } finally {
        setIsLoadingLakeConditions(false)
      }
    }

    fetchLakeConditions()
  }, [])

  // Set mounted state and initial timestamp (client-only)
  useEffect(() => {
    setIsMounted(true)
    setCurrentWeather(prev => ({
      ...prev,
      lastUpdated: new Date().toLocaleTimeString()
    }))
  }, [])

  // Auto-update weather every 15 minutes
  useEffect(() => {
    if (!isMounted) return
    
    // Initial fetch
    fetchCurrentWeather()
    
    // Set up interval for 15 minutes (900,000 milliseconds)
    const weatherInterval = setInterval(() => {
      fetchCurrentWeather()
    }, 15 * 60 * 1000) // 15 minutes
    
    // Cleanup interval on component unmount
    return () => clearInterval(weatherInterval)
  }, [isMounted])

  // Keyboard navigation for expanded image modal
  useEffect(() => {
    if (!expandedImage) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          setExpandedImage(false)
          break
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault()
          // Navigate to previous image
          setCurrentImageIndex(prevIndex => {
            if (expandedProductIndex !== null && expandedProductIndex < apparelProducts.length) {
              const product = apparelProducts[expandedProductIndex]
              if (product.colors && product.colors.length > 1) {
                const images = product.colors.map((color: any) => ({
                  src: color.frontImage || color.backImage || product.featuredImage,
                  alt: `${product.name} - ${color.name}`,
                  colorName: color.name
                }))
                const newIndex = prevIndex === 0 ? images.length - 1 : prevIndex - 1
                setCurrentFeaturedImage(images[newIndex].src)
                setImageZoom(1)
                setImagePosition({ x: 0, y: 0 })
                return newIndex
              }
            }
            return prevIndex
          })
          break
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault()
          // Navigate to next image
          setCurrentImageIndex(prevIndex => {
            if (expandedProductIndex !== null && expandedProductIndex < apparelProducts.length) {
              const product = apparelProducts[expandedProductIndex]
              if (product.colors && product.colors.length > 1) {
                const images = product.colors.map((color: any) => ({
                  src: color.frontImage || color.backImage || product.featuredImage,
                  alt: `${product.name} - ${color.name}`,
                  colorName: color.name
                }))
                const newIndex = (prevIndex + 1) % images.length
                setCurrentFeaturedImage(images[newIndex].src)
                setImageZoom(1)
                setImagePosition({ x: 0, y: 0 })
                return newIndex
              }
            }
            return prevIndex
          })
          break
        case '+':
        case '=':
          e.preventDefault()
          setImageZoom(prev => Math.min(prev + 0.5, 3)) // Max zoom 3x
          break
        case '-':
        case '_':
          e.preventDefault()
          setImageZoom(prev => {
            const newZoom = Math.max(prev - 0.5, 1) // Min zoom 1x
            if (newZoom === 1) {
              setImagePosition({ x: 0, y: 0 }) // Reset position when fully zoomed out
            }
            return newZoom
          })
          break
        case '0':
          e.preventDefault()
          setImageZoom(1)
          setImagePosition({ x: 0, y: 0 })
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [expandedImage, expandedProductIndex, apparelProducts])

  // Initialize carousel position
  useEffect(() => {
    if (!carouselInitialized) {
      setCarouselPosition(startOffset)
      setCarouselInitialized(true)
    }
  }, [startOffset, carouselInitialized])

  // Monitor carousel position for seamless infinite scrolling
  useEffect(() => {
    // Only run after initialization
    if (!carouselInitialized) return
    
    // Check if we need to reposition for seamless infinite scroll
    const currentPos = carouselPosition
    const setLength = apparelProducts.length * itemWidth
    
    // Define the boundaries for when to jump (with buffer for smooth transition)
    // Jump when we've scrolled a full set away from center
    const rightBoundary = startOffset + setLength * 1.5
    const leftBoundary = startOffset - setLength * 1.5
    
    // If we've scrolled beyond the boundaries, reposition
    if (currentPos > rightBoundary || currentPos < leftBoundary) {
      // Disable transition for seamless jump
      setIsTransitioning(false)
      
      // Use setTimeout to ensure the CSS change is applied
      setTimeout(() => {
        if (currentPos > rightBoundary) {
          // Jump back by one full set length
          setCarouselPosition(currentPos - setLength)
        } else if (currentPos < leftBoundary) {
          // Jump forward by one full set length
          setCarouselPosition(currentPos + setLength)
        }
        
        // Re-enable transition after the position update
        setTimeout(() => {
          setIsTransitioning(true)
        }, 50)
      }, 10)
    }
  }, [carouselPosition, startOffset, apparelProducts.length, itemWidth, carouselInitialized])

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-gray-800 bg-black/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link
                href="/"
                className="flex flex-col items-center justify-center py-1 cursor-pointer hover:opacity-80 transition-opacity focus:ring-2 focus:ring-cyan-400/50 focus:outline-none rounded"
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
            <nav className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Main navigation">
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
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={lakeInfo.heroImage || "/placeholder.svg"}
            alt={`${lakeInfo.name} Aerial View`}
            fill
            className="object-fill"
            priority
            style={{ 
              transform: 'scaleX(2.2) scaleY(1.5)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        </div>
        <div className="relative z-20 max-w-6xl mx-auto px-4">
          <div className="text-left">
            <div className="mb-6">
              <h1 className="text-5xl md:text-7xl font-light tracking-[0.3em] text-white">
                {lakeInfo.name.toUpperCase()}
              </h1>
          </div>
            <div className="mb-6 text-center">
              <h2 className="text-2xl md:text-3xl font-light tracking-[0.3em] text-white">
                OREGON
              </h2>
            </div>
            <div className="mb-6 flex justify-center">
              <div className="w-32 h-32 flex items-center justify-center">
                <Image
                  src={lakeInfo.icon || "/placeholder.svg"}
                  alt={lakeInfo.name}
                  width={128}
                  height={128}
                  className="w-full h-full object-contain brightness-0 saturate-100 invert-0 sepia-0 hue-rotate-180 contrast-200"
                  style={{ filter: 'brightness(0) saturate(100%) invert(65%) sepia(98%) saturate(3207%) hue-rotate(163deg) brightness(101%) contrast(101%)' }}
                />
              </div>
            </div>
            <div className="mb-4 text-center">
              <p className="text-sm text-gray-300 tracking-wide">
                Elevation: {lakeInfo.elevation} • GPS: {lakeInfo.gpsCoordinates} • Max Depth: {lakeInfo.maxDepth}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-900 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light mb-4 tracking-wide">
              {lakeInfo.name.toUpperCase()} APPAREL
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
              Premium apparel inspired by {lakeInfo.name}'s pristine wilderness.
            </p>
          </div>
          
          {/* Manual Carousel with Controls */}
          <div className="relative">
            {/* Navigation Controls */}
            <div className="flex justify-center mb-8 gap-4">
              <button
                onClick={scrollCarouselLeft}
                className="bg-blue-500 hover:bg-blue-400 text-white p-3 rounded-full transition-colors shadow-lg"
                aria-label="Scroll left"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={scrollCarouselRight}
                className="bg-blue-500 hover:bg-blue-400 text-white p-3 rounded-full transition-colors shadow-lg"
                aria-label="Scroll right"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Carousel Container */}
            <div className="overflow-hidden">
              <div 
                className={`flex gap-8 ${isTransitioning ? 'transition-transform duration-300 ease-out' : ''}`}
                style={{
                  transform: `translateX(${carouselPosition}px)`,
                  width: `${infiniteProducts.length * itemWidth}px`
                }}
              >
                {/* Infinite set of products */}
                {infiniteProducts.map((product, index) => {
                  // Calculate the actual product index for state management
                  const actualIndex = index % apparelProducts.length
                  return (
                                         <div key={index} className="flex-shrink-0 w-80">
                      <div className="group cursor-pointer" onClick={() => setExpandedProduct(actualIndex)}>
                <div className="relative h-80 mb-4 overflow-hidden rounded-lg shadow-lg shadow-blue-500/20 border border-blue-500/30 transition-all duration-500 group-hover:shadow-blue-400/40 group-hover:border-blue-400/50 group-hover:shadow-xl">
                          {/* Background image for featured products */}
                  <Image
                            src={lakeInfo.heroImage}
                            alt="Detroit Lake Background"
                            fill
                            className="object-cover"
                          />
                          
                          {/* Main product image */}
                          <Image
                            src={
                              actualIndex === 0 
                                ? (selectedColor[actualIndex] === "Black" ? "/images/DETROIT-APPAREL/DETROIT-BOARD-TEE/Back, Black.png"
                                  : selectedColor[actualIndex] === "Khaki" ? "/images/DETROIT-APPAREL/DETROIT-BOARD-TEE/Back, Khaki.png"
                                  : selectedColor[actualIndex] === "True Navy" ? "/images/DETROIT-APPAREL/DETROIT-BOARD-TEE/Back, True Navy.png"
                                  : selectedColor[actualIndex] === "White" ? "/images/DETROIT-APPAREL/DETROIT-BOARD-TEE/Back, White.png"
                                  : "/images/DETROIT-APPAREL/DETROIT-BOARD-TEE/Front, Watermelon.png") // Default Watermelon
                                : actualIndex === 1
                                ? (selectedColor[actualIndex] === "Black" ? "/images/DETROIT-APPAREL/DETROIT-DIVE-TEE/Back, Black.png"
                                  : selectedColor[actualIndex] === "Khaki" ? "/images/DETROIT-APPAREL/DETROIT-DIVE-TEE/Back, Khaki.png"
                                  : selectedColor[actualIndex] === "True Navy" ? "/images/DETROIT-APPAREL/DETROIT-DIVE-TEE/Back, True Navy.png"
                                  : selectedColor[actualIndex] === "White" ? "/images/DETROIT-APPAREL/DETROIT-DIVE-TEE/Back, White.png"
                                  : "/images/DETROIT-APPAREL/DETROIT-DIVE-TEE/Back, Black.png") // Default Black
                                : actualIndex === 2
                                ? (selectedColor[actualIndex] === "Black" ? "/images/DETROIT-APPAREL/DETROIT-FISH-TEE/Front, Black.png"
                                  : selectedColor[actualIndex] === "Khaki" ? "/images/DETROIT-APPAREL/DETROIT-FISH-TEE/Front, Khaki.png"
                                  : selectedColor[actualIndex] === "True Navy" ? "/images/DETROIT-APPAREL/DETROIT-FISH-TEE/Front, True Navy.png"
                                  : selectedColor[actualIndex] === "Watermelon" ? "/images/DETROIT-APPAREL/DETROIT-FISH-TEE/Front, Watermelon.png"
                                  : "/images/DETROIT-APPAREL/DETROIT-FISH-TEE/Front, Sage.png") // Default Sage
                                : actualIndex === 3
                                ? (selectedColor[actualIndex] === "Black" ? "/images/DETROIT-APPAREL/DETROIT-SKI-TEE/Back, Black.png"
                                  : selectedColor[actualIndex] === "Khaki" ? "/images/DETROIT-APPAREL/DETROIT-SKI-TEE/Back, Khaki.png"
                                  : selectedColor[actualIndex] === "White" ? "/images/DETROIT-APPAREL/DETROIT-SKI-TEE/Back, White.png"
                                  : selectedColor[actualIndex] === "Watermelon" ? "/images/DETROIT-APPAREL/DETROIT-SKI-TEE/Front, Watermelon.png"
                                  : "/images/DETROIT-APPAREL/DETROIT-SKI-TEE/Back, True Navy.png") // Default True Navy
                                : actualIndex === 4
                                ? (selectedColor[actualIndex] === "Black" ? "/images/DETROIT-APPAREL/DETROIT-SURF-TEE/Back, Black.png"
                                  : selectedColor[actualIndex] === "True Navy" ? "/images/DETROIT-APPAREL/DETROIT-SURF-TEE/Back, True Navy.png"
                                  : selectedColor[actualIndex] === "White" ? "/images/DETROIT-APPAREL/DETROIT-SURF-TEE/Back, White.png"
                                  : selectedColor[actualIndex] === "Watermelon" ? "/images/DETROIT-APPAREL/DETROIT-SURF-TEE/Front, Watermelon.png"
                                  : "/images/DETROIT-APPAREL/DETROIT-SURF-TEE/Back, Khaki.png") // Default Khaki
                                : actualIndex === 5
                                ? (selectedColor[actualIndex] === "Black" ? "/images/DETROIT-APPAREL/DETROIT-TRADITIONAL-LOGO-TEE/Front, Black.png"
                                  : selectedColor[actualIndex] === "Khaki" ? "/images/DETROIT-APPAREL/DETROIT-TRADITIONAL-LOGO-TEE/Front, Khaki.png"
                                  : selectedColor[actualIndex] === "True Navy" ? "/images/DETROIT-APPAREL/DETROIT-TRADITIONAL-LOGO-TEE/Front, True Navy.png"
                                  : selectedColor[actualIndex] === "Watermelon" ? "/images/DETROIT-APPAREL/DETROIT-TRADITIONAL-LOGO-TEE/Front, Watermelon.png"
                                  : "/images/DETROIT-APPAREL/DETROIT-TRADITIONAL-LOGO-TEE/Front, White.png") // Default White
                                : actualIndex === 6
                                ? (selectedColor[actualIndex] === "Black" ? "/images/DETROIT-APPAREL/DETROIT-WATERSKI-TEE/Front, Black.png"
                                  : selectedColor[actualIndex] === "Burnt Orange" ? "/images/DETROIT-APPAREL/DETROIT-WATERSKI-TEE/Front, Burnt Orange.png"
                                  : selectedColor[actualIndex] === "Midnight" ? "/images/DETROIT-APPAREL/DETROIT-WATERSKI-TEE/Front, Midnight.png"
                                  : selectedColor[actualIndex] === "Topaz Blue" ? "/images/DETROIT-APPAREL/DETROIT-WATERSKI-TEE/Front, Topaz Blue.png"
                                  : "/images/DETROIT-APPAREL/DETROIT-WATERSKI-TEE/Front, Peony.png") // Default Peony
                                : product.featuredImage
                            }
                    alt={product.name}
                    fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                  
                          {/* Click to expand overlay */}
                          <div 
                            className="absolute inset-0 cursor-pointer z-10 flex items-center justify-center"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              const imageToShow = actualIndex === 0 
                                ? (selectedColor[actualIndex] === "Black" ? "/images/DETROIT-APPAREL/DETROIT-BOARD-TEE/Back, Black.png"
                                  : selectedColor[actualIndex] === "Khaki" ? "/images/DETROIT-APPAREL/DETROIT-BOARD-TEE/Back, Khaki.png"
                                  : selectedColor[actualIndex] === "True Navy" ? "/images/DETROIT-APPAREL/DETROIT-BOARD-TEE/Back, True Navy.png"
                                  : selectedColor[actualIndex] === "White" ? "/images/DETROIT-APPAREL/DETROIT-BOARD-TEE/Back, White.png"
                                  : "/images/DETROIT-APPAREL/DETROIT-BOARD-TEE/Front, Watermelon.png")
                                : actualIndex === 1
                                ? (selectedColor[actualIndex] === "Black" ? "/images/DETROIT-APPAREL/DETROIT-DIVE-TEE/Back, Black.png"
                                  : selectedColor[actualIndex] === "Khaki" ? "/images/DETROIT-APPAREL/DETROIT-DIVE-TEE/Back, Khaki.png"
                                  : selectedColor[actualIndex] === "True Navy" ? "/images/DETROIT-APPAREL/DETROIT-DIVE-TEE/Back, True Navy.png"
                                  : selectedColor[actualIndex] === "White" ? "/images/DETROIT-APPAREL/DETROIT-DIVE-TEE/Back, White.png"
                                  : "/images/DETROIT-APPAREL/DETROIT-DIVE-TEE/Back, Black.png")
                                : actualIndex === 2
                                ? (selectedColor[actualIndex] === "Black" ? "/images/DETROIT-APPAREL/DETROIT-FISH-TEE/Front, Black.png"
                                  : selectedColor[actualIndex] === "Khaki" ? "/images/DETROIT-APPAREL/DETROIT-FISH-TEE/Front, Khaki.png"
                                  : selectedColor[actualIndex] === "True Navy" ? "/images/DETROIT-APPAREL/DETROIT-FISH-TEE/Front, True Navy.png"
                                  : selectedColor[actualIndex] === "Watermelon" ? "/images/DETROIT-APPAREL/DETROIT-FISH-TEE/Front, Watermelon.png"
                                  : "/images/DETROIT-APPAREL/DETROIT-FISH-TEE/Front, Sage.png")
                                : actualIndex === 3
                                ? (selectedColor[actualIndex] === "Black" ? "/images/DETROIT-APPAREL/DETROIT-SKI-TEE/Back, Black.png"
                                  : selectedColor[actualIndex] === "Khaki" ? "/images/DETROIT-APPAREL/DETROIT-SKI-TEE/Back, Khaki.png"
                                  : selectedColor[actualIndex] === "White" ? "/images/DETROIT-APPAREL/DETROIT-SKI-TEE/Back, White.png"
                                  : selectedColor[actualIndex] === "Watermelon" ? "/images/DETROIT-APPAREL/DETROIT-SKI-TEE/Front, Watermelon.png"
                                  : "/images/DETROIT-APPAREL/DETROIT-SKI-TEE/Back, True Navy.png")
                                : actualIndex === 4
                                ? (selectedColor[actualIndex] === "Black" ? "/images/DETROIT-APPAREL/DETROIT-SURF-TEE/Back, Black.png"
                                  : selectedColor[actualIndex] === "True Navy" ? "/images/DETROIT-APPAREL/DETROIT-SURF-TEE/Back, True Navy.png"
                                  : selectedColor[actualIndex] === "White" ? "/images/DETROIT-APPAREL/DETROIT-SURF-TEE/Back, White.png"
                                  : selectedColor[actualIndex] === "Watermelon" ? "/images/DETROIT-APPAREL/DETROIT-SURF-TEE/Front, Watermelon.png"
                                  : "/images/DETROIT-APPAREL/DETROIT-SURF-TEE/Back, Khaki.png")
                                : actualIndex === 5
                                ? (selectedColor[actualIndex] === "Black" ? "/images/DETROIT-APPAREL/DETROIT-TRADITIONAL-LOGO-TEE/Front, Black.png"
                                  : selectedColor[actualIndex] === "Khaki" ? "/images/DETROIT-APPAREL/DETROIT-TRADITIONAL-LOGO-TEE/Front, Khaki.png"
                                  : selectedColor[actualIndex] === "True Navy" ? "/images/DETROIT-APPAREL/DETROIT-TRADITIONAL-LOGO-TEE/Front, True Navy.png"
                                  : selectedColor[actualIndex] === "Watermelon" ? "/images/DETROIT-APPAREL/DETROIT-TRADITIONAL-LOGO-TEE/Front, Watermelon.png"
                                  : "/images/DETROIT-APPAREL/DETROIT-TRADITIONAL-LOGO-TEE/Front, White.png")
                                : actualIndex === 6
                                ? (selectedColor[actualIndex] === "Black" ? "/images/DETROIT-APPAREL/DETROIT-WATERSKI-TEE/Front, Black.png"
                                  : selectedColor[actualIndex] === "Burnt Orange" ? "/images/DETROIT-APPAREL/DETROIT-WATERSKI-TEE/Front, Burnt Orange.png"
                                  : selectedColor[actualIndex] === "Midnight" ? "/images/DETROIT-APPAREL/DETROIT-WATERSKI-TEE/Front, Midnight.png"
                                  : selectedColor[actualIndex] === "Topaz Blue" ? "/images/DETROIT-APPAREL/DETROIT-WATERSKI-TEE/Front, Topaz Blue.png"
                                  : "/images/DETROIT-APPAREL/DETROIT-WATERSKI-TEE/Front, Peony.png")
                                : product.featuredImage;
                              handleImageClick(imageToShow, actualIndex);
                            }}
                          >
                            {/* Expand icon overlay */}
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 rounded-full p-3">
                              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                              </svg>
                            </div>
                          </div>
                          
                          {actualIndex === 0 && (
                    <div className="absolute top-4 left-4">
                      <div className="bg-blue-500/20 backdrop-blur-sm text-blue-200 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-light tracking-wide">
                        FEATURED
                    </div>
                    </div>
                  )}
                  </div>

                        {/* Minimal product info */}
                  <div className="space-y-2">
                  <h3 className="text-white font-light text-lg tracking-wide">
                    {product.name}
                  </h3>
                  <p className="text-gray-400 text-sm font-light leading-relaxed line-clamp-1">
                    {product.description}
                  </p>
                  <div className="pt-1">
                    <span className="text-white text-xl font-light tracking-wide">
                      {product.price}
                    </span>
                  </div>
                </div>

                        {/* Hidden detailed options - shown on card click */}
                        {expandedProduct === actualIndex && (
                  <div className="mt-6 space-y-4 animate-in slide-in-from-top-4 duration-300">
                    <div className="space-y-3">
                              {/* Color selection for Detroit Board Tee */}
                              {actualIndex === 0 && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-2">Color:</label>
                                  <div className="flex flex-wrap gap-2">
                                    {["Watermelon", "Black", "Khaki", "True Navy", "White"].map((color) => (
                                      <button
                                        key={color}
                                        onClick={() => {
                                          setSelectedColor(prev => ({ ...prev, [actualIndex]: color }))
                                        }}
                                        className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                                          selectedColor[actualIndex] === color
                                            ? "border-blue-400 bg-blue-400/10 text-blue-400"
                                            : "border-gray-700 hover:border-gray-600 text-gray-300"
                                        }`}
                                      >
                                        {color}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Color selection for Detroit Dive Tee */}
                              {actualIndex === 1 && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-2">Color:</label>
                                  <div className="flex flex-wrap gap-2">
                                    {["Black", "Khaki", "True Navy", "White", "Watermelon"].map((color) => (
                      <button
                                        key={color}
                                        onClick={() => {
                                          setSelectedColor(prev => ({ ...prev, [actualIndex]: color }))
                                        }}
                                        className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                                          selectedColor[actualIndex] === color
                                            ? "border-blue-400 bg-blue-400/10 text-blue-400"
                                            : "border-gray-700 hover:border-gray-600 text-gray-300"
                                        }`}
                                      >
                                        {color}
                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Color selection for Detroit Fish Tee */}
                              {actualIndex === 2 && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-2">Color:</label>
                                  <div className="flex flex-wrap gap-2">
                                    {["Sage", "Black", "Khaki", "True Navy", "Watermelon"].map((color) => (
                      <button
                                        key={color}
                                        onClick={() => {
                                          setSelectedColor(prev => ({ ...prev, [actualIndex]: color }))
                                        }}
                                        className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                                          selectedColor[actualIndex] === color
                                            ? "border-blue-400 bg-blue-400/10 text-blue-400"
                                            : "border-gray-700 hover:border-gray-600 text-gray-300"
                                        }`}
                      >
                                        {color}
                      </button>
                                    ))}
                  </div>
                                </div>
                              )}

                              {/* Color selection for Detroit Ski Tee */}
                              {actualIndex === 3 && (
                        <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-2">Color:</label>
                                  <div className="flex flex-wrap gap-2">
                                    {["True Navy", "Black", "Khaki", "White", "Watermelon"].map((color) => (
                                      <button
                                        key={color}
                                        onClick={() => {
                                          setSelectedColor(prev => ({ ...prev, [actualIndex]: color }))
                                        }}
                                        className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                                          selectedColor[actualIndex] === color
                                            ? "border-blue-400 bg-blue-400/10 text-blue-400"
                                            : "border-gray-700 hover:border-gray-600 text-gray-300"
                                        }`}
                                      >
                                        {color}
                                      </button>
                                    ))}
                        </div>
                                </div>
                              )}

                              {/* Color selection for Detroit Surf Tee */}
                              {actualIndex === 4 && (
                        <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-2">Color:</label>
                                  <div className="flex flex-wrap gap-2">
                                    {["Khaki", "Black", "True Navy", "White", "Watermelon"].map((color) => (
                                      <button
                                        key={color}
                                        onClick={() => {
                                          setSelectedColor(prev => ({ ...prev, [actualIndex]: color }))
                                        }}
                                        className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                                          selectedColor[actualIndex] === color
                                            ? "border-blue-400 bg-blue-400/10 text-blue-400"
                                            : "border-gray-700 hover:border-gray-600 text-gray-300"
                                        }`}
                                      >
                                        {color}
                                      </button>
                                    ))}
                      </div>
                    </div>
                  )}

                              {/* Color selection for Detroit Traditional Logo Tee */}
                              {actualIndex === 5 && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-2">Color:</label>
                                  <div className="flex flex-wrap gap-2">
                                    {["White", "Black", "Khaki", "True Navy", "Watermelon"].map((color) => (
                  <button
                                        key={color}
                                        onClick={() => {
                                          setSelectedColor(prev => ({ ...prev, [actualIndex]: color }))
                                        }}
                                        className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                                          selectedColor[actualIndex] === color
                                            ? "border-blue-400 bg-blue-400/10 text-blue-400"
                                            : "border-gray-700 hover:border-gray-600 text-gray-300"
                                        }`}
                  >
                                        {color}
                  </button>
                                    ))}
                                  </div>
                                </div>
                        )}

                              {/* Color selection for Detroit Waterski Tee */}
                              {actualIndex === 6 && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-2">Color:</label>
                                  <div className="flex flex-wrap gap-2">
                                    {["Peony", "Black", "Burnt Orange", "Midnight", "Topaz Blue"].map((color) => (
                                      <button
                                        key={color}
                                        onClick={() => {
                                          setSelectedColor(prev => ({ ...prev, [actualIndex]: color }))
                                        }}
                                        className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                                          selectedColor[actualIndex] === color
                                            ? "border-blue-400 bg-blue-400/10 text-blue-400"
                                            : "border-gray-700 hover:border-gray-600 text-gray-300"
                                        }`}
                                      >
                                        {color}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Size selection */}
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Size:</label>
                                <div className="flex flex-wrap gap-2">
                                  {["S", "M", "L", "XL", "XXL"].map((size) => (
                          <button
                                      key={size}
                                      onClick={() => setSelectedSize(prev => ({ ...prev, [actualIndex]: size }))}
                                      className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                                        selectedSize[actualIndex] === size
                                          ? "border-blue-400 bg-blue-400/10 text-blue-400"
                                          : "border-gray-700 hover:border-gray-600 text-gray-300"
                                      }`}
                                    >
                                      {size}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Add to cart */}
                              <button
                                onClick={() => handleAddToCart(product, actualIndex)}
                                className="w-full bg-blue-500 text-white py-3 rounded-lg text-sm font-medium tracking-wide hover:bg-blue-400 transition-colors shadow-lg shadow-blue-500/30"
                              >
                                ADD TO CART
                              </button>
                              
                              <button
                                className="w-full text-blue-300 text-sm font-light hover:text-blue-200 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                                  setExpandedProduct(null);
                    }}
                  >
                                Close Details
                  </button>
                            </div>
                          </div>
                )}
              </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-900 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="flex-shrink-0">
                <div className="relative overflow-hidden bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm transition-transform duration-500 group-hover:scale-[1.02]" style={{ width: '700px', height: '450px' }}>
                  <AutoVideoPlayer 
                    src="https://www.youtube.com/embed/gA5IQyBJxTo?autoplay=1&mute=1&loop=1&playlist=gA5IQyBJxTo&controls=1&rel=0&modestbranding=1"
                    title="Detroit Lake Live Video - YouTube Stream"
                  />
                </div>
                        </div>

              <div className="flex-1 space-y-6">
                <div className="group cursor-pointer">
                  <div className="relative h-80 overflow-hidden bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm transition-transform duration-500 group-hover:scale-[1.02] p-6 flex flex-col justify-between">
                    
                      <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-light text-lg tracking-wide">Current Conditions</h3>
                        {isLoadingWeather && (
                          <div className="text-gray-400 text-xs">Updating...</div>
                        )}
                        </div>
                      
                      <div className="flex items-start gap-6 mb-6">
                      <div>
                          <div className="text-5xl font-light text-white leading-none">
                            {isLoadingWeather ? '--' : currentWeather.temperature}
                        </div>
                          <div className="text-gray-300 font-light mt-1">
                            {currentWeather.condition}
                      </div>
                        </div>
                        <div className="text-3xl mt-2">
                          {currentWeather.emoji}
                      </div>
                    </div>
                      
                      {isMounted && currentWeather.lastUpdated && (
                      <div className="text-xs text-gray-500 mb-4">
                        Last updated: {currentWeather.lastUpdated}
                      </div>
                      )}
                      </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="text-gray-400 text-sm font-light">Water Temp</div>
                        <div className="text-xl font-light text-cyan-400">
                          {/* Water temperature from lakemonster.com */}
                          {isLoadingLakeConditions ? '--' : (lakeRealTimeConditions.waterTemp !== 'N/A' ? lakeRealTimeConditions.waterTemp : '60°F')}
                      </div>
                    </div>
                      <div className="space-y-1">
                        <div className="text-gray-400 text-sm font-light">Wind</div>
                        <div className="text-xl font-light text-gray-200">
                          {/* Wind from National Weather Service */}
                          {currentWeather.wind}
                  </div>
                        </div>
                      <div className="space-y-1">
                        <div className="text-gray-400 text-sm font-light">Humidity</div>
                        <div className="text-xl font-light text-gray-200">
                          {/* Humidity from National Weather Service */}
                          {currentWeather.humidity}
                      </div>
                        </div>
                      <div className="space-y-1">
                        <div className="text-gray-400 text-sm font-light">Visibility</div>
                        <div className="text-xl font-light text-gray-200">
                          {/* Visibility from National Weather Service */}
                          {currentWeather.visibility}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Forecast Card - Secondary style matching Coeur d'Alene */}
                <div className="group cursor-pointer mt-8">
                  <div className="relative overflow-hidden bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm transition-transform duration-500 group-hover:scale-[1.02] p-6">
                    <h4 className="text-white font-light text-lg tracking-wide mb-4">3-Day Forecast</h4>
                    <div className="space-y-4">
                      {forecast.map((day, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{day.emoji}</span>
                            <div>
                              <div className="font-light text-white">{day.day}</div>
                              <div className="text-sm text-gray-400 font-light">{day.condition}</div>
              </div>
                  </div>
                          <div className="text-right">
                            <div className="font-light text-white">{day.high}</div>
                            <div className="text-sm text-gray-400 font-light">{day.low}</div>
                    </div>
                      </div>
                      ))}
                        </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center">
              <div className="w-32 h-32 md:w-48 md:h-48 scale-150">
                <Image
                  src={lakeInfo.icon || "/placeholder.svg"}
                  alt={lakeInfo.name}
                  width={192}
                  height={192}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {expandedImage && (
        <div
          className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4"
          onClick={() => setExpandedImage(false)}
        >
          <div className="relative max-w-5xl max-h-[90vh]">
            {/* Close Button */}
            <button
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-50"
              onClick={(e) => {
                e.stopPropagation()
                setExpandedImage(false)
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="sr-only">Close</span>
            </button>

            {/* Product Info */}
            {expandedProductIndex !== null && (
              <div className="absolute -top-12 left-0 text-white z-50">
                <h3 className="text-lg font-light">{apparelProducts[expandedProductIndex % apparelProducts.length]?.name}</h3>
                <p className="text-sm text-gray-300">
                  {getCurrentExpandedImages()[currentImageIndex]?.colorName || 'Default'} • 
                  Image {currentImageIndex + 1} of {getCurrentExpandedImages().length}
                </p>
              </div>
            )}

            {/* Navigation Arrows */}
            {getCurrentExpandedImages().length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-colors shadow-lg z-50"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigateExpandedImage('prev')
                  }}
                  aria-label="Previous image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-colors shadow-lg z-50"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigateExpandedImage('next')
                  }}
                  aria-label="Next image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <div 
                className="relative overflow-hidden max-h-[90vh] flex items-center justify-center"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{ cursor: imageZoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
              >
              <Image
                src={currentFeaturedImage || "/placeholder.svg"}
                alt="Expanded Product"
                width={800}
                height={800}
                  className="max-h-[90vh] w-auto object-contain transition-transform duration-200"
                  style={{
                    transform: `scale(${imageZoom}) translate(${imagePosition.x / imageZoom}px, ${imagePosition.y / imageZoom}px)`,
                    transformOrigin: 'center center'
                  }}
                  draggable={false}
              />
            </div>

              {/* Zoom Controls */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 z-50">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleZoomIn()
                  }}
                  className="bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-colors shadow-lg"
                  aria-label="Zoom in"
                  disabled={imageZoom >= 3}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleZoomOut()
                  }}
                  className="bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-colors shadow-lg"
                  aria-label="Zoom out"
                  disabled={imageZoom <= 1}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
                  </svg>
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleZoomReset()
                  }}
                  className="bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-colors shadow-lg"
                  aria-label="Reset zoom"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>

              {/* Zoom Level Indicator */}
              {imageZoom > 1 && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm z-50">
                  {Math.round(imageZoom * 100)}%
                </div>
              )}

              {/* Color Thumbnails */}
              {getCurrentExpandedImages().length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-50">
                  {getCurrentExpandedImages().map((img, index) => (
                    <button
                      key={index}
                      className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex 
                          ? 'border-blue-400 ring-2 ring-blue-400/50' 
                          : 'border-white/30 hover:border-white/60'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation()
                        setCurrentImageIndex(index)
                        setCurrentFeaturedImage(img.src)
                        setImageZoom(1)
                        setImagePosition({ x: 0, y: 0 })
                      }}
                      aria-label={`View ${img.colorName} variant`}
                    >
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs px-1 py-0.5 text-center truncate">
                        {img.colorName}
            </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Shopping Cart Sidebar */}
      <ShoppingCartSidebar />
    </div>
  )
}

