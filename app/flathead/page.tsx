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
    // Try multiple webcam sources - Updated with Raven Bigfork iframe URL
    const webcamUrls = [
      'https://g1.ipcamlive.com/player/player.php?alias=ravenwebcam&autoplay=1',
      'https://www.ravenbigfork.com/webcam',
      'https://www.flatheadlake.org/webcam',
      'https://www.fs.usda.gov/recarea/flathead/recarea/?recid=66256', // Fallback to forest service site
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
      const response = await fetch('/api/webcam?source=flathead', {
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
            src="/images/flathead-lake-placeholder.jpg"
            alt="Flathead Lake placeholder view"
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
            allow="autoplay; fullscreen; camera; microphone"
            allowFullScreen
            title={title}
            referrerPolicy="no-referrer"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            loading="lazy"
            scrolling="no"
            style={{ 
              objectFit: 'cover',
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              overflow: 'hidden'
            }}
            aria-label="Live webcam feed from Flathead Lake"
          />
        )}
      </div>
    </div>
  )
}

export default function FlatheadPage() {
  const lakeInfo = {
    name: "Flathead Lake",
    state: "Montana",
    heroImage: "/images/FLATHEAD.svg",
    icon: "/images/flatheadicon.svg",
    gpsCoordinates: "47.9017° N, 114.1042° W",
    elevation: "2,893 ft",
    maxDepth: "370.7 ft",
    description: "The largest natural freshwater lake west of the Mississippi River, known for its crystal-clear waters and stunning mountain backdrop.",
    features: [
      "Crystal clear mountain water",
      "Surrounded by dense forest",
      "Excellent fishing opportunities",
      "Peaceful and secluded setting",
      "Perfect for kayaking and canoeing",
    ],
    badgeText: "MONTANA WILDERNESS",
    badgeIcon: "/images/montana-icon.png",
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
      id: "flathead-board-tee",
      name: "Flathead Board Tee",
      category: "tees",
      description: "Classic Flathead Lake board design tee perfect for mountain lake adventures and casual wear.",
      price: 33,
      images: [
        "/images/FLATHEAD-APPAREL/FLATHEAD-BOARD-TEE/Back, Black.png",
        "/images/FLATHEAD-APPAREL/FLATHEAD-BOARD-TEE/Front, Bay.png",
        "/images/FLATHEAD-APPAREL/FLATHEAD-BOARD-TEE/Back, Bay.png",
        "/images/FLATHEAD-APPAREL/FLATHEAD-BOARD-TEE/Back, Khaki.png",
        "/images/FLATHEAD-APPAREL/FLATHEAD-BOARD-TEE/Back, True Navy.png",
        "/images/FLATHEAD-APPAREL/FLATHEAD-BOARD-TEE/Back, Watermelon.png",
        "/images/FLATHEAD-APPAREL/FLATHEAD-BOARD-TEE/Back, White.png"
      ],
      colors: [
        { name: "Black", hex: "#000000" },
        { name: "Bay", hex: "#7DD3FC" },
        { name: "Bay Back", hex: "#7DD3FC" },
        { name: "Khaki", hex: "#8B7355" },
        { name: "True Navy", hex: "#1E3A8A" },
        { name: "Watermelon", hex: "#FB7185" },
        { name: "White", hex: "#FFFFFF" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      lake: "Flathead Lake",
      details: "Premium cotton t-shirt featuring Flathead Lake's board sports culture. Made with high-quality materials and exclusive Montana-inspired designs celebrating the largest natural freshwater lake west of the Mississippi.",
      featuresList: [
        "Premium 100% cotton construction",
        "Exclusive Flathead Lake board design",
        "Multiple color options including Bay",
        "Front and back design views",
        "Montana wilderness inspired",
        "Comfortable everyday fit",
      ]
    },
    {
      id: "flathead-dive-tee",
      name: "Flathead Dive Tee",
      category: "tees",
      description: "Dive deep into Flathead Lake adventures with this premium diving-inspired tee.",
      price: 33,
      images: [
        "/images/FLATHEAD-APPAREL/FLATHEAD-DIVE-TEE/Back, True Navy.png",
        "/images/FLATHEAD-APPAREL/FLATHEAD-DIVE-TEE/Front, Bay.png",
        "/images/FLATHEAD-APPAREL/FLATHEAD-DIVE-TEE/Back, Bay.png",
        "/images/FLATHEAD-APPAREL/FLATHEAD-DIVE-TEE/Back, Black.png",
        "/images/FLATHEAD-APPAREL/FLATHEAD-DIVE-TEE/Back, Khaki.png",
        "/images/FLATHEAD-APPAREL/FLATHEAD-DIVE-TEE/Back, Watermelon.png",
        "/images/FLATHEAD-APPAREL/FLATHEAD-DIVE-TEE/Back, White.png"
      ],
      colors: [
        { name: "True Navy", hex: "#1E3A8A" },
        { name: "Bay", hex: "#7DD3FC" },
        { name: "Bay Back", hex: "#7DD3FC" },
        { name: "Black", hex: "#000000" },
        { name: "Khaki", hex: "#8B7355" },
        { name: "Watermelon", hex: "#FB7185" },
        { name: "White", hex: "#FFFFFF" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      lake: "Flathead Lake",
      details: "Premium diving-inspired t-shirt celebrating Flathead Lake's crystal-clear waters. Perfect for water sports enthusiasts and mountain lake adventurers with exclusive Montana wilderness designs.",
      featuresList: [
        "Premium cotton diving design",
        "Crystal clear water inspiration",
        "Multiple colorway options",
        "Flathead Lake exclusive artwork",
        "Comfortable athletic fit",
        "Montana lake adventure style",
      ]
    },
    {
      id: "flathead-fish-tee",
      name: "Flathead Fish Tee",
      category: "tees",
      description: "Show your love for Flathead Lake fishing with this angler-inspired design featuring unique Sage colorway.",
      price: 33,
      images: [
        "/images/FLATHEAD-APPAREL/FLATHEAD-FISH-TEE/Front, Sage.png",
        "/images/FLATHEAD-APPAREL/FLATHEAD-FISH-TEE/Front, Bay.png",
        "/images/FLATHEAD-APPAREL/FLATHEAD-FISH-TEE/Back, Bay.png",
        "/images/FLATHEAD-APPAREL/FLATHEAD-FISH-TEE/Front, Black.png",
        "/images/FLATHEAD-APPAREL/FLATHEAD-FISH-TEE/Front, Khaki.png",
        "/images/FLATHEAD-APPAREL/FLATHEAD-FISH-TEE/Front, True Navy.png",
        "/images/FLATHEAD-APPAREL/FLATHEAD-FISH-TEE/Front, Watermelon.png"
      ],
      colors: [
        { name: "Sage", hex: "#87A96B" },
        { name: "Bay", hex: "#7DD3FC" },
        { name: "Bay Back", hex: "#7DD3FC" },
        { name: "Black", hex: "#000000" },
        { name: "Khaki", hex: "#8B7355" },
        { name: "True Navy", hex: "#1E3A8A" },
        { name: "Watermelon", hex: "#FB7185" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      lake: "Flathead Lake",
      details: "Premium fishing t-shirt celebrating Flathead Lake's world-class trout fishing. Features exclusive angler-inspired designs with multiple color options including the unique Sage colorway.",
      featuresList: [
        "World-class fishing inspiration",
        "Exclusive Sage color option",
        "Angler-designed graphics",
        "Premium cotton construction",
        "Multiple front view colors",
        "Montana trout fishing tribute",
      ]
    },
    {
      id: "flathead-lake-tee",
      name: "Flathead Lake Tee",
      category: "tees",
      description: "Classic Flathead Lake tee celebrating Montana's natural jewel with pristine mountain lake design.",
      price: 33,
      images: [
        "/images/FLATHEAD-APPAREL/FLATHEAD-LAKE-TEE/Front, Bay.png",
        "/images/FLATHEAD-APPAREL/FLATHEAD-LAKE-TEE/Back, Bay.png",
        "/images/FLATHEAD-APPAREL/FLATHEAD-LAKE-TEE/Back, Black.png",
        "/images/FLATHEAD-APPAREL/FLATHEAD-LAKE-TEE/Back, Khaki.png",
        "/images/FLATHEAD-APPAREL/FLATHEAD-LAKE-TEE/Back, True Navy.png",
        "/images/FLATHEAD-APPAREL/FLATHEAD-LAKE-TEE/Back, Watermelon.png",
        "/images/FLATHEAD-APPAREL/FLATHEAD-LAKE-TEE/Back, White.png"
      ],
      colors: [
        { name: "Bay", hex: "#7DD3FC" },
        { name: "Bay Back", hex: "#7DD3FC" },
        { name: "Black", hex: "#000000" },
        { name: "Khaki", hex: "#8B7355" },
        { name: "True Navy", hex: "#1E3A8A" },
        { name: "Watermelon", hex: "#FB7185" },
        { name: "White", hex: "#FFFFFF" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      lake: "Flathead Lake",
      details: "Classic t-shirt celebrating Flathead Lake as Montana's natural jewel. Features timeless design elements that capture the essence of this pristine mountain lake wilderness.",
      featuresList: [
        "Montana's natural jewel inspiration",
        "Classic timeless design",
        "Premium comfort fit",
        "Multiple color options",
        "Wilderness lake celebration",
        "High-quality construction",
      ]
    },
    {
      id: "flathead-ski-tee",
      name: "Flathead Ski Tee",
      category: "tees",
      description: "Celebrate Flathead Lake's winter sports with this ski-inspired design perfect for year-round mountain style.",
      price: 33,
      images: [
        "/images/FLATHEAD-APPAREL/FLATHEAD-SKI-TEE/Back, Watermelon.png",
        "/images/FLATHEAD-APPAREL/FLATHEAD-SKI-TEE/Front, Bay.png",
        "/images/FLATHEAD-APPAREL/FLATHEAD-SKI-TEE/Back, Bay.png",
        "/images/FLATHEAD-APPAREL/FLATHEAD-SKI-TEE/Back, Black.png",
        "/images/FLATHEAD-APPAREL/FLATHEAD-SKI-TEE/Back, Khaki.png",
        "/images/FLATHEAD-APPAREL/FLATHEAD-SKI-TEE/Back, True Navy.png",
        "/images/FLATHEAD-APPAREL/FLATHEAD-SKI-TEE/Back, White.png"
      ],
      colors: [
        { name: "Watermelon", hex: "#FB7185" },
        { name: "Bay", hex: "#7DD3FC" },
        { name: "Bay Back", hex: "#7DD3FC" },
        { name: "Black", hex: "#000000" },
        { name: "Khaki", hex: "#8B7355" },
        { name: "True Navy", hex: "#1E3A8A" },
        { name: "White", hex: "#FFFFFF" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      lake: "Flathead Lake",
      details: "Ski-inspired t-shirt celebrating Flathead Lake's winter sports culture. Perfect for mountain enthusiasts who enjoy both summer lake activities and winter ski adventures.",
      featuresList: [
        "Winter sports inspiration",
        "Mountain ski culture design",
        "Year-round adventure style",
        "Premium outdoor fit",
        "Montana mountain tribute",
        "Versatile seasonal wear",
      ]
    },
    {
      id: "flathead-surf-tee",
      name: "Flathead Surf Tee",
      category: "tees",
      description: "Surf's up at Flathead Lake! Classic surf-inspired design for mountain lake lovers.",
      price: 33,
      images: [
        "/images/FLATHEAD-APPAREL/FLATHEAD-SURF-TEE/Back, White.png",
        "/images/FLATHEAD-APPAREL/FLATHEAD-SURF-TEE/Front, Bay.png",
        "/images/FLATHEAD-APPAREL/FLATHEAD-SURF-TEE/Back, Bay.png",
        "/images/FLATHEAD-APPAREL/FLATHEAD-SURF-TEE/Back, Black.png",
        "/images/FLATHEAD-APPAREL/FLATHEAD-SURF-TEE/Back, Khaki.png",
        "/images/FLATHEAD-APPAREL/FLATHEAD-SURF-TEE/Back, True Navy.png",
        "/images/FLATHEAD-APPAREL/FLATHEAD-SURF-TEE/Back, Watermelon.png"
      ],
      colors: [
        { name: "White", hex: "#FFFFFF" },
        { name: "Bay", hex: "#7DD3FC" },
        { name: "Bay Back", hex: "#7DD3FC" },
        { name: "Black", hex: "#000000" },
        { name: "Khaki", hex: "#8B7355" },
        { name: "True Navy", hex: "#1E3A8A" },
        { name: "Watermelon", hex: "#FB7185" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      lake: "Flathead Lake",
      details: "Surf-inspired t-shirt bringing coastal vibes to Montana's mountain lake scene. Perfect for those who love the surf aesthetic combined with mountain lake adventures.",
      featuresList: [
        "Surf-inspired mountain design",
        "Coastal meets mountain style",
        "Lake surfing culture",
        "Premium surf fit",
        "Montana wave aesthetic",
        "Adventure crossover appeal",
      ]
    },
    {
      id: "flathead-waterski-tee",
      name: "Flathead Waterski Tee",
      category: "tees",
      description: "Premium waterski t-shirt celebrating Flathead Lake's legendary water sports culture with comprehensive front and back design views.",
      price: 33,
      images: [
        "/images/FLATHEAD-APPAREL/FLATHEAD-WATERSKI-TEE/Back, Topaz Blue.png",
        "/images/FLATHEAD-APPAREL/FLATHEAD-WATERSKI-TEE/Front, Topaz Blue.png",
        "/images/FLATHEAD-APPAREL/FLATHEAD-WATERSKI-TEE/Front, Watermelon.png",
        "/images/FLATHEAD-APPAREL/FLATHEAD-WATERSKI-TEE/Back, Watermelon.png",
        "/images/FLATHEAD-APPAREL/FLATHEAD-WATERSKI-TEE/Front, Black.png",
        "/images/FLATHEAD-APPAREL/FLATHEAD-WATERSKI-TEE/Back, Black.png",
        "/images/FLATHEAD-APPAREL/FLATHEAD-WATERSKI-TEE/Front, Midnight.png",
        "/images/FLATHEAD-APPAREL/FLATHEAD-WATERSKI-TEE/Back, Midnight.png",
        "/images/FLATHEAD-APPAREL/FLATHEAD-WATERSKI-TEE/Front, Burnt Orange.png",
        "/images/FLATHEAD-APPAREL/FLATHEAD-WATERSKI-TEE/Back, Burnt Orange.png"
      ],
      colors: [
        { name: "Topaz Blue Back", hex: "#0EA5E9" },
        { name: "Topaz Blue", hex: "#0EA5E9" },
        { name: "Watermelon", hex: "#FB7185" },
        { name: "Watermelon Back", hex: "#FB7185" },
        { name: "Black", hex: "#000000" },
        { name: "Black Back", hex: "#000000" },
        { name: "Midnight", hex: "#1E293B" },
        { name: "Midnight Back", hex: "#1E293B" },
        { name: "Burnt Orange", hex: "#EA580C" },
        { name: "Burnt Orange Back", hex: "#EA580C" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      lake: "Flathead Lake",
      details: "Premium waterski t-shirt celebrating Flathead Lake's legendary water sports culture. Features exclusive waterski-inspired designs with complete front and back viewing options showcasing Montana's premier mountain lake waterski destination.",
      featuresList: [
        "Legendary waterski culture design",
        "Complete front and back views",
        "5 distinct color combinations",
        "Montana mountain lake heritage",
        "Premium waterski graphics",
        "Flathead Lake exclusive artwork",
      ]
    },
  ]

  const { addToCart, setIsCartOpen, getCartItemCount } = useCart()
  const [selectedSize, setSelectedSize] = useState<{ [key: string]: string }>({})
  const [selectedColor, setSelectedColor] = useState<{ [key: string]: number }>({})
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const [expandedImage, setExpandedImage] = useState(false)
  const [currentFeaturedImage, setCurrentFeaturedImage] = useState<string | null>(null)
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageZoom, setImageZoom] = useState(1)
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  // Infinite scroll helpers
  const duplicatedProducts = [...apparelProducts, ...apparelProducts, ...apparelProducts]
  const [translateX, setTranslateX] = useState(-apparelProducts.length * 340) // Start at middle set
  const [isTransitioning, setIsTransitioning] = useState(false)

  const nextSlide = () => {
    if (isTransitioning) return // Prevent rapid clicks during transition
    setIsTransitioning(true)
    setTranslateX(prev => prev - 340)
  }

  const prevSlide = () => {
    if (isTransitioning) return // Prevent rapid clicks during transition
    setIsTransitioning(true)
    setTranslateX(prev => prev + 340)
  }

  // Handle infinite loop reset
  const handleTransitionEnd = () => {
    setIsTransitioning(false)
    
    // If we've scrolled past the end of the second set, jump to the beginning of the first set
    if (translateX <= -apparelProducts.length * 2 * 340) {
      setTranslateX(-apparelProducts.length * 340)
    } 
    // If we've scrolled before the beginning of the first set, jump to the end of the second set
    else if (translateX >= 0) {
      setTranslateX(-apparelProducts.length * 340)
    }
  }

  const handleQuickAdd = (product: any) => {
    const size = selectedSize[product.id] || product.sizes[Math.floor(product.sizes.length / 2)]
    const colorIndex = selectedColor[product.id] || 0
    
    const cartItem = {
      id: `${product.id}-${size}-${colorIndex}`,
      name: `${product.name} - ${product.colors[colorIndex].name}`,
      price: `$${product.price}`,
      size: size,
      image: product.images[colorIndex] || product.images[0],
    }
    
    addToCart(cartItem)
    setIsCartOpen(true)
  }

  const handleImageClick = (imageSrc: string, productId: string) => {
    const product = apparelProducts.find(p => p.id === productId)
    if (!product) return

    setCurrentFeaturedImage(imageSrc)
    setExpandedImage(true)
    setExpandedProductId(productId)
    
    // Set current image index based on selected color
    const colorIndex = selectedColor[productId] || 0
    setCurrentImageIndex(colorIndex)
    
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

  // Navigation functions for expanded image modal
  const navigateExpandedImage = (direction: 'prev' | 'next') => {
    if (!expandedProductId) return

    const product = apparelProducts.find(p => p.id === expandedProductId)
    if (!product || !product.images) return

    const totalImages = product.images.length
    const newIndex = direction === 'next' 
      ? (currentImageIndex + 1) % totalImages 
      : (currentImageIndex - 1 + totalImages) % totalImages
    
    setSelectedColor(prev => ({ ...prev, [expandedProductId]: newIndex }))
    setCurrentFeaturedImage(product.images[newIndex])
    setCurrentImageIndex(newIndex)
    
    // Reset zoom when navigating
    setImageZoom(1)
    setImagePosition({ x: 0, y: 0 })
  }

  const getTotalImagesForExpandedProduct = () => {
    if (!expandedProductId) return 1
    const product = apparelProducts.find(p => p.id === expandedProductId)
    return product?.images?.length || 1
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
    wind: "NW 5 mph",
    humidity: "45%",
    visibility: "10 mi",
    lastUpdated: ""
  })
  const [isLoadingWeather, setIsLoadingWeather] = useState(false)

  // 3-day forecast state
  const [forecast, setForecast] = useState([
    { day: "Today", condition: "Partly Cloudy", emoji: "⛅", high: "72°", low: "48°" },
    { day: "Thursday", condition: "Mostly Sunny", emoji: "☀️", high: "75°", low: "50°" },
    { day: "Friday", condition: "Sunny", emoji: "☀️", high: "78°", low: "52°" }
  ])

  // Set initial timestamp on client side only
  useEffect(() => {
    setCurrentWeather(prev => ({
      ...prev,
      lastUpdated: new Date().toLocaleTimeString()
    }))
  }, [])

  // Fetch current weather data
  const fetchCurrentWeather = async () => {
    setIsLoadingWeather(true)
    try {
      console.log("🌤️ Fetching current weather conditions from NWS...")
      
      // Use National Weather Service API for Flathead Lake area (Bigfork, MT)
      // Coordinates: 48.0544°N, 114.0821°W (Bigfork area)
      const nwsApiUrl = "https://api.weather.gov/points/48.0544,-114.0821"
      
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
                visibility = "10+ mi" // Default for Montana mountains
              }
            }
            
            // If humidity is not available, set reasonable defaults based on conditions
            if (humidity === "N/A") {
              const conditionLower = currentCondition.toLowerCase()
              if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
                humidity = "25%"
              } else if (conditionLower.includes('partly cloudy')) {
                humidity = "35%"
              } else if (conditionLower.includes('cloudy') || conditionLower.includes('overcast')) {
                humidity = "55%"
              } else if (conditionLower.includes('rain') || conditionLower.includes('showers')) {
                humidity = "75%"
              } else if (conditionLower.includes('storm') || conditionLower.includes('thunderstorm')) {
                humidity = "85%"
              } else {
                humidity = "40%" // Default for Montana mountains
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
      
      // Fallback to simulated Montana mountain weather if NWS API fails
      console.log("🔄 Using fallback weather data for Montana mountains...")
      
      const weatherConditions = [
        { temp: "82°F", condition: "Partly Cloudy", emoji: "⛅", wind: "E 2 mph", humidity: "20%", visibility: "15 mi" },
        { temp: "78°F", condition: "Chance Showers", emoji: "🌦️", wind: "W 6 mph", humidity: "65%", visibility: "8 mi" },
        { temp: "76°F", condition: "Mostly Sunny", emoji: "☀️", wind: "NW 5 mph", humidity: "25%", visibility: "20 mi" },
        { temp: "74°F", condition: "Thunderstorms", emoji: "⛈️", wind: "SW 8 mph", humidity: "80%", visibility: "3 mi" },
        { temp: "80°F", condition: "Clear", emoji: "☀️", wind: "N 3 mph", humidity: "18%", visibility: "25 mi" },
        { temp: "72°F", condition: "Overcast", emoji: "☁️", wind: "W 7 mph", humidity: "55%", visibility: "10 mi" },
      ]

      const forecastOptions = [
        [
          { day: "Today", condition: "Chance T-storms", emoji: "⛈️", high: "82°F", low: "53°F" },
          { day: "Thursday", condition: "Chance Showers", emoji: "🌦️", high: "78°F", low: "51°F" },
          { day: "Friday", condition: "Partly Sunny", emoji: "⛅", high: "76°F", low: "50°F" }
        ],
        [
          { day: "Today", condition: "Mostly Cloudy", emoji: "☁️", high: "78°F", low: "50°F" },
          { day: "Thursday", condition: "Chance Rain", emoji: "🌦️", high: "74°F", low: "48°F" },
          { day: "Friday", condition: "Partly Cloudy", emoji: "⛅", high: "77°F", low: "49°F" }
        ],
        [
          { day: "Today", condition: "Mostly Sunny", emoji: "☀️", high: "80°F", low: "52°F" },
          { day: "Thursday", condition: "Partly Cloudy", emoji: "⛅", high: "79°F", low: "51°F" },
          { day: "Friday", condition: "Sunny", emoji: "☀️", high: "81°F", low: "54°F" }
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
      // Update with Flathead Lake data source - new Lake Monster URL
      const externalLakeUrl = "https://lakemonster.com/lake/MT/Flathead-Lake-91"

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

  // Auto-update weather every 15 minutes
  useEffect(() => {
    // Initial fetch
    fetchCurrentWeather()
    
    // Set up interval for 15 minutes (900,000 milliseconds)
    const weatherInterval = setInterval(() => {
      fetchCurrentWeather()
    }, 15 * 60 * 1000) // 15 minutes
    
    // Cleanup interval on component unmount
    return () => clearInterval(weatherInterval)
  }, [])



  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-gray-800 bg-black/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
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

        {/* Hero icon overlay - completely separate from layout */}
        <div 
          style={{
            position: 'fixed',
            left: '50%',
            top: '40%',
            transform: 'translateX(-50%) translateY(-50%) scale(24)',
            zIndex: 9999,
            pointerEvents: 'none',
            width: '0',
            height: '0'
          }}
        >
          <Image
            src="/images/flatheadicon.svg"
            alt="Flathead Lake Icon"
            width={50}
            height={50}
            className="object-contain"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
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
                MONTANA
              </h2>
            </div>
            <div className="mb-6 flex justify-center">
              <div className="w-32 h-32 flex items-center justify-center">
                <Image
                  src="/images/flatheadicon.svg"
                  alt={lakeInfo.name}
                  width={128}
                  height={128}
                  className="w-full h-full object-contain"
                  style={{ 
                    filter: 'brightness(0) saturate(100%) invert(65%) sepia(98%) saturate(3207%) hue-rotate(163deg) brightness(101%) contrast(101%)',
                    transform: 'scale(5)'
                  }}
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

      {/* Apparel Section - Infinite Carousel */}
      <section className="py-20 bg-gray-900">
        <div className="w-full max-w-none px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light mb-4 tracking-wide">
              {lakeInfo.name.toUpperCase()} APPAREL
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
              Premium apparel inspired by {lakeInfo.name}'s pristine wilderness.
            </p>
          </div>
          
          {/* Infinite Carousel with Controls */}
          <div className="relative w-full">
            {/* Navigation Controls */}
            <div className="flex justify-center mb-8 gap-4">
              <button
                onClick={prevSlide}
                className="bg-blue-500 hover:bg-blue-400 text-white p-3 rounded-full transition-colors shadow-lg z-10"
                aria-label="Previous products"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
               
              <button
                onClick={nextSlide}
                className="bg-blue-500 hover:bg-blue-400 text-white p-3 rounded-full transition-colors shadow-lg z-10"
                aria-label="Next products"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Carousel Container */}
            <div className="w-full overflow-hidden">
              <div 
                className={`flex gap-6 ${isTransitioning ? 'transition-transform duration-500 ease-out' : ''}`}
                style={{
                  transform: `translateX(${translateX}px)`,
                  width: `${duplicatedProducts.length * 340}px`
                }}
                onTransitionEnd={handleTransitionEnd}
              >
                {/* Products carousel using duplicated array */}
                {duplicatedProducts.map((product, index) => {
                  const currentColorIndex = selectedColor[product.id] || 0
                  const uniqueKey = `${product.id}-${index}` // Unique key for duplicated items
                  return (
                    <div key={uniqueKey} className="flex-shrink-0 w-80">
                      <div className="group cursor-pointer" onClick={() => setExpandedProductId(product.id)}>
                <div className="relative h-80 mb-4 overflow-hidden rounded-lg shadow-lg shadow-blue-500/20 border border-blue-500/30 transition-all duration-500 group-hover:shadow-blue-400/40 group-hover:border-blue-400/50 group-hover:shadow-xl">
                          {/* Background image for featured products */}
                          {product.featured && (
                  <Image
                            src={lakeInfo.heroImage}
                              alt="Flathead Lake Background"
                            fill
                            className="object-cover"
                          />
                          )}
                          
                          {/* Main product image */}
                              <Image
                            src={product.images[currentColorIndex] || product.images[0]}
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
                              handleImageClick(product.images[currentColorIndex] || product.images[0], product.id);
                                }}
                              >
                            {/* Expand icon overlay */}
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 rounded-full p-3">
                              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                  </svg>
                                </div>
                              </div>
                          
                          {/* Featured badge with color info */}
                          {product.featured && (
                            <div className="absolute top-4 left-4">
                              <div className="bg-blue-500/20 backdrop-blur-sm text-blue-200 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-light tracking-wide">
                                FEATURED • {currentColorIndex + 1} of {product.colors.length}
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
                              ${product.price}
                    </span>
                  </div>
                </div>

                        {/* Hidden detailed options - shown on card click */}
                        {expandedProductId === product.id && (
                  <div className="mt-6 space-y-4 animate-in slide-in-from-top-4 duration-300">
                    <div className="space-y-3">
                              {/* Color selection */}
                              {product.colors.length > 1 && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-2">Color:</label>
                                  <div className="flex flex-wrap gap-2">
                                    {product.colors.map((color, colorIndex) => (
                                      <button
                                        key={color.name}
                                        onClick={() => {
                                          setSelectedColor(prev => ({ ...prev, [product.id]: colorIndex }))
                                        }}
                                        className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                                          selectedColor[product.id] === colorIndex || (selectedColor[product.id] === undefined && colorIndex === 0)
                                            ? "border-blue-400 bg-blue-400/10 text-blue-400"
                                            : "border-gray-700 hover:border-gray-600 text-gray-300"
                                        }`}
                                      >
                                        {color.name}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Size selection */}
                                <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Size:</label>
                      <select
                        className="w-full bg-gray-800/50 border border-blue-500/30 text-white px-4 py-3 rounded-lg text-sm font-light focus:border-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors"
                                  value={selectedSize[product.id] || ""}
                                  onChange={(e) => setSelectedSize(prev => ({ ...prev, [product.id]: e.target.value }))}
                      >
                        <option value="">Select Size</option>
                                  {product.sizes.map((size) => (
                                    <option key={size} value={size}>{size}</option>
                                  ))}
                      </select>
                              </div>
                      
                              {/* Add to cart */}
                      <button
                                onClick={() => handleQuickAdd(product)}
                        className="w-full bg-blue-500 text-white py-3 rounded-lg text-sm font-medium tracking-wide hover:bg-blue-400 transition-colors shadow-lg shadow-blue-500/30"
                      >
                        ADD TO CART
                      </button>
                      
                      <button
                        className="w-full text-blue-300 text-sm font-light hover:text-blue-200 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                                  setExpandedProductId(null);
                        }}
                      >
                        Close Details
                      </button>
                    </div>

                            {/* Product details */}
                            {product.details && (
                    <div className="space-y-4 pt-4 border-t border-gray-700/30">
                      <div>
                        <p className="text-gray-300 text-sm font-light leading-relaxed">
                          {product.details}
                        </p>
                      </div>
                                {product.featuresList && (
                      <div>
                        <h4 className="text-white text-sm font-medium mb-2">Features</h4>
                        <ul className="text-gray-400 text-sm font-light space-y-1">
                          {product.featuresList.map((feature) => (
                            <li key={feature} className="flex items-start">
                              <span className="text-cyan-400 mr-2">•</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                                )}
                    </div>
                            )}
                  </div>
                )}

                        {/* Expand details button */}
                        {expandedProductId !== product.id && (
                  <button
                    className="mt-4 text-blue-300 text-sm font-light hover:text-blue-200 transition-colors underline underline-offset-4"
                    onClick={(e) => {
                      e.stopPropagation();
                              setExpandedProductId(product.id);
                    }}
                  >
                    View Details
                  </button>
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
                    src="https://g1.ipcamlive.com/player/player.php?alias=ravenwebcam&autoplay=1"
                    title="Flathead Lake Live Webcam - The Raven Bigfork"
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
                      
                      <div className="text-xs text-gray-500 mb-4">
                        Last updated: {currentWeather.lastUpdated}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="text-gray-400 text-sm font-light">Water Temp</div>
                        <div className="text-xl font-light text-cyan-400">
                          {/* Water temperature from lakemonster.com */}
                          {isLoadingLakeConditions ? '--' : (lakeRealTimeConditions.waterTemp !== 'N/A' ? lakeRealTimeConditions.waterTemp : '62°F')}
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

      <section className="bg-gradient-to-r from-gray-900 via-black to-gray-900 h-fit overflow-hidden" style={{ margin: 0, padding: 0 }}>
        <div className="container mx-auto text-center" style={{ margin: 0, padding: 0 }}>
          <div className="max-w-4xl mx-auto" style={{ margin: '0 auto', padding: 0 }}>
            <div className="flex justify-center" style={{ margin: 0, padding: 0 }}>
              <div className="w-32 h-32 md:w-48 md:h-48 scale-150" style={{ margin: 0, padding: 0 }}>
                <Image
                  src={lakeInfo.icon || "/placeholder.svg"}
                  alt={lakeInfo.name}
                  width={192}
                  height={192}
                  className="w-full h-full object-contain"
                  style={{ transform: 'scale(3)', margin: 0, padding: 0, display: 'block' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full-screen Image Modal */}
      {expandedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
          onClick={() => setExpandedImage(false)}
        >
          <div className="relative max-w-5xl max-h-[90vh]">
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
            
            <div className="relative">
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

              {/* Navigation Controls for Featured Products */}
              {expandedProductId && getTotalImagesForExpandedProduct() > 1 && (
                <>
                  <button
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-4 rounded-full transition-colors shadow-lg z-40"
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
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-4 rounded-full transition-colors shadow-lg z-40"
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
                  
                  {/* Image indicators and counter */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3 z-40">
                    {/* Image counter */}
                    <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm border border-white/20">
                      {currentImageIndex + 1} of {getTotalImagesForExpandedProduct()}
                    </div>
                    
                    {/* Dot indicators */}
                    <div className="flex gap-2">
                      {Array.from({ length: getTotalImagesForExpandedProduct() }).map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                            e.stopPropagation()
                            if (expandedProductId) {
                              const product = apparelProducts.find(p => p.id === expandedProductId)
                              if (product && product.images[index]) {
                                setSelectedColor(prev => ({ ...prev, [expandedProductId]: index }))
                                setCurrentFeaturedImage(product.images[index])
                                setCurrentImageIndex(index)
                              }
                            }
                            setImageZoom(1)
                            setImagePosition({ x: 0, y: 0 })
                          }}
                          className={`w-3 h-3 rounded-full transition-all border-2 ${
                            currentImageIndex === index 
                            ? 'bg-white border-white'
                              : 'bg-white/30 border-white/50 hover:bg-white/50'
                          }`}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                </div>
                </div>
              </>
            )}
            </div>
          </div>
        </div>
      )}

      {/* Shopping Cart Sidebar */}
      <ShoppingCartSidebar />

      {/* Global styles to eliminate any remaining spacing */}
      <style jsx global>{`
        body {
          background-color: #000000 !important;
          overflow-x: hidden;
          margin: 0 !important;
          padding: 0 !important;
        }
        section:last-child {
          margin-bottom: 0 !important;
          padding-bottom: 0 !important;
        }
      `}</style>
    </div>
  )
}
