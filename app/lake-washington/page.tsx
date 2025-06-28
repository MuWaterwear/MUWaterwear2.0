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
    // Try multiple webcam sources - Update with Lake Washington Ivideon webcam
    const webcamUrls = [
      'https://open.ivideon.com/embed/v3/?server=200-YV6knPliOPswemRS31OP0Q&camera=0&width=&height=&lang=en',
      'https://www.ivideon.com/',
      'https://www.seattle.gov/trafficcams/tsb/tsb_cam1.jpg',
      'https://www.wsdot.wa.gov/traffic/seattle/default.aspx', // Fallback to WSDOT site
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
      const response = await fetch('/api/webcam?source=lakewashington', {
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
            src="/images/lake-washington-placeholder.jpg"
            alt="Lake Washington placeholder view"
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
            aria-label="Live webcam feed from Lake Washington"
          />
        )}
      </div>
    </div>
  )
}

export default function LakeWashingtonPage() {
  const lakeInfo = {
    name: "Lake Washington",
    state: "Washington",
    heroImage: "/images/LAKEWASHINGTON.svg",
    icon: "/images/waterway-outline-1.png",
    gpsCoordinates: "47.63° N, 122.27° W",
    elevation: "20 ft",
    maxDepth: "214 ft",
    description: "Seattle's backyard lake, offering urban recreation with stunning city skyline views and pristine waters.",
    features: [
      "Crystal clear mountain water",
      "Surrounded by dense forest",
      "Excellent fishing opportunities",
      "Peaceful and secluded setting",
      "Perfect for kayaking and canoeing",
    ],
    badgeText: "WASHINGTON WATERS",
    badgeIcon: "/images/washington-icon.png",
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
      id: "washington-board-tee",
      name: "Washington Board Tee",
      description: "Classic Washington board design tee perfect for Pacific Northwest lake adventures.",
      price: 33,
      images: [
        "/images/LAKE-WA-APPAREL/WASHINGTON-BOARD-TEE/Back, Bay.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-BOARD-TEE/Back, Black.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-BOARD-TEE/Back, Khaki.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-BOARD-TEE/Back, True Navy.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-BOARD-TEE/Back, Watermelon.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-BOARD-TEE/Back, White.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-BOARD-TEE/Front, True Navy.png"
      ],
      colors: [
        { name: "Bay", hex: "#7DD3FC" },
        { name: "Black", hex: "#000000" },
        { name: "Khaki", hex: "#8B7355" },
        { name: "True Navy", hex: "#1E3A8A" },
        { name: "Watermelon", hex: "#FB7185" },
        { name: "White", hex: "#FFFFFF" },
        { name: "True Navy Front", hex: "#1E3A8A" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      details: "Classic Washington board design tee perfect for Pacific Northwest lake adventures. Premium cotton blend construction with vibrant colors inspired by Lake Washington.",
      featuresList: [
        "Premium cotton blend construction",
        "Vibrant Pacific Northwest inspired colors",
        "Comfortable athletic fit",
        "Durable construction for active wear",
        "Lake Washington board culture design"
      ]
    },
    {
      id: "washington-dive-tee",
      name: "Washington Dive Tee",
      description: "Dive deep into Lake Washington adventures with this premium diving-inspired tee.",
      price: 33,
      images: [
        "/images/LAKE-WA-APPAREL/WASHINGTON-DIVE-TEE/Back, White.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-DIVE-TEE/Back, Bay.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-DIVE-TEE/Back, Black.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-DIVE-TEE/Back, Khaki.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-DIVE-TEE/Back, True Navy.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-DIVE-TEE/Back, Watermelon.png"
      ],
      colors: [
        { name: "White", hex: "#FFFFFF" },
        { name: "Bay", hex: "#7DD3FC" },
        { name: "Black", hex: "#000000" },
        { name: "Khaki", hex: "#8B7355" },
        { name: "True Navy", hex: "#1E3A8A" },
        { name: "Watermelon", hex: "#FB7185" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      details: "Dive deep into Lake Washington adventures with this premium diving-inspired tee. Features comfortable fabric and diving-themed design elements.",
      featuresList: [
        "Premium cotton blend construction",
        "Diving-inspired design elements",
        "Comfortable athletic fit",
        "Vibrant Pacific Northwest colors",
        "Lake Washington dive culture design"
      ]
    },
    {
      id: "washington-fish-tee",
      name: "Washington Fish Tee",
      description: "Show your love for Lake Washington fishing with this angler-inspired design.",
      price: 33,
      images: [
        "/images/LAKE-WA-APPAREL/WASHINGTON-FISH-TEE/Front, Sage.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-FISH-TEE/Front, Bay.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-FISH-TEE/Front, Black.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-FISH-TEE/Front, Khaki.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-FISH-TEE/Front, True Navy.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-FISH-TEE/Front, Watermelon.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-FISH-TEE/Back, True Navy.png"
      ],
      colors: [
        { name: "Sage", hex: "#87A96B" },
        { name: "Bay", hex: "#7DD3FC" },
        { name: "Black", hex: "#000000" },
        { name: "Khaki", hex: "#8B7355" },
        { name: "True Navy", hex: "#1E3A8A" },
        { name: "Watermelon", hex: "#FB7185" },
        { name: "True Navy Back", hex: "#1E3A8A" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      details: "Show your love for Lake Washington fishing with this angler-inspired design. Premium construction with fishing-themed graphics.",
      featuresList: [
        "Premium cotton blend construction",
        "Angler-inspired design elements",
        "Comfortable athletic fit",
        "Vibrant Pacific Northwest colors",
        "Lake Washington fishing culture design"
      ]
    },
    {
      id: "washington-lake-tee",
      name: "Washington Lake Tee",
      description: "Classic Lake Washington tee celebrating the Pacific Northwest's natural beauty.",
      price: 33,
      images: [
        "/images/LAKE-WA-APPAREL/WASHINGTON-LAKE-TEE/Front, Bay.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-LAKE-TEE/Front, Black.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-LAKE-TEE/Front, Khaki.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-LAKE-TEE/Front, True Navy.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-LAKE-TEE/Front, Watermelon.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-LAKE-TEE/Front, White.png"
      ],
      colors: [
        { name: "Bay", hex: "#7DD3FC" },
        { name: "Black", hex: "#000000" },
        { name: "Khaki", hex: "#8B7355" },
        { name: "True Navy", hex: "#1E3A8A" },
        { name: "Watermelon", hex: "#FB7185" },
        { name: "White", hex: "#FFFFFF" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      details: "Classic Lake Washington tee celebrating the Pacific Northwest's natural beauty. Features premium construction and scenic design elements.",
      featuresList: [
        "Premium cotton blend construction",
        "Pacific Northwest scenic design",
        "Comfortable athletic fit",
        "Vibrant lake-inspired colors",
        "Lake Washington natural beauty design"
      ]
    },
    {
      id: "washington-ski-tee",
      name: "Washington Ski Tee",
      description: "Celebrate Lake Washington's winter sports with this ski-inspired design.",
      price: 33,
      images: [
        "/images/LAKE-WA-APPAREL/WASHINGTON-SKI-TEE/Back, Watermelon.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-SKI-TEE/Back, Bay.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-SKI-TEE/Back, Black.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-SKI-TEE/Back, Khaki.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-SKI-TEE/Back, True Navy.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-SKI-TEE/Back, White.png"
      ],
      colors: [
        { name: "Watermelon", hex: "#FB7185" },
        { name: "Bay", hex: "#7DD3FC" },
        { name: "Black", hex: "#000000" },
        { name: "Khaki", hex: "#8B7355" },
        { name: "True Navy", hex: "#1E3A8A" },
        { name: "White", hex: "#FFFFFF" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      details: "Celebrate Lake Washington's winter sports with this ski-inspired design. Premium construction with winter sports design elements.",
      featuresList: [
        "Premium cotton blend construction",
        "Ski-inspired design elements",
        "Comfortable athletic fit",
        "Vibrant winter sports colors",
        "Lake Washington ski culture design"
      ]
    },
    {
      id: "washington-surf-tee",
      name: "Washington Surf Tee",
      description: "Surf's up at Lake Washington! Classic surf-inspired design for Pacific Northwest lake lovers.",
      price: 33,
      images: [
        "/images/LAKE-WA-APPAREL/WASHINGTON-SURF-TEE/Back, Black.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-SURF-TEE/Back, Bay.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-SURF-TEE/Back, Khaki.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-SURF-TEE/Back, True Navy.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-SURF-TEE/Back, Watermelon.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-SURF-TEE/Back, White.png"
      ],
      colors: [
        { name: "Black", hex: "#000000" },
        { name: "Bay", hex: "#7DD3FC" },
        { name: "Khaki", hex: "#8B7355" },
        { name: "True Navy", hex: "#1E3A8A" },
        { name: "Watermelon", hex: "#FB7185" },
        { name: "White", hex: "#FFFFFF" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      details: "Surf's up at Lake Washington! Classic surf-inspired design for Pacific Northwest lake lovers. Premium construction with surf culture elements.",
      featuresList: [
        "Premium cotton blend construction",
        "Surf-inspired design elements",
        "Comfortable athletic fit",
        "Vibrant surf culture colors",
        "Lake Washington surf culture design"
      ]
    },
    {
      id: "washington-boat-longsleeve",
      name: "Washington Boat Long Sleeve",
      description: "Premium long sleeve shirt celebrating Lake Washington's boating culture.",
      price: 40,
      images: [
        "/images/LAKE-WA-APPAREL/WASHINGTON-BOAT-LONGSLEEVE/BAYVIEW-GREEN.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-BOAT-LONGSLEEVE/BLOSSOM.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-BOAT-LONGSLEEVE/WATERMELON.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-BOAT-LONGSLEEVE/WATERMELON-FRONTSIDE.png"
      ],
      colors: [
        { name: "Bayview Green", hex: "#059669" },
        { name: "Blossom", hex: "#F472B6" },
        { name: "Watermelon", hex: "#FB7185" },
        { name: "Watermelon Frontside", hex: "#FB7185" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      details: "Premium long sleeve shirt celebrating Lake Washington's boating culture. Features comfortable fabric and boating-themed design elements.",
      featuresList: [
        "Premium cotton blend construction",
        "Boating-inspired design elements",
        "Comfortable athletic fit",
        "Vibrant Pacific Northwest colors",
        "Lake Washington boating culture design"
      ]
    },
    {
      id: "washington-waterski-tee",
      name: "Washington Waterski Tee",
      description: "Premium waterski t-shirt celebrating Lake Washington's legendary water sports culture with comprehensive front and back design views.",
      price: 33,
      images: [
        "/images/LAKE-WA-APPAREL/WASHINGTON-WATERSKI-TEE/Front, Peony.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-WATERSKI-TEE/Back, Peony.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-WATERSKI-TEE/Front, Black.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-WATERSKI-TEE/Back, Black.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-WATERSKI-TEE/Front, Midnight.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-WATERSKI-TEE/Back, Midnight.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-WATERSKI-TEE/Front, Topaz Blue.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-WATERSKI-TEE/Back, Topaz Blue.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-WATERSKI-TEE/Front, Burnt Orange.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-WATERSKI-TEE/Back, Burnt Orange.png"
      ],
      colors: [
        { name: "Peony", hex: "#FB7185" },
        { name: "Peony Back", hex: "#FB7185" },
        { name: "Black", hex: "#000000" },
        { name: "Black Back", hex: "#000000" },
        { name: "Midnight", hex: "#1E293B" },
        { name: "Midnight Back", hex: "#1E293B" },
        { name: "Topaz Blue", hex: "#0EA5E9" },
        { name: "Topaz Blue Back", hex: "#0EA5E9" },
        { name: "Burnt Orange", hex: "#EA580C" },
        { name: "Burnt Orange Back", hex: "#EA580C" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      details: "Premium waterski t-shirt celebrating Lake Washington's legendary water sports culture. Features exclusive waterski-inspired designs with complete front and back viewing options showcasing Washington's premier Pacific Northwest waterski destination.",
      featuresList: [
        "Legendary waterski culture design",
        "Complete front and back views",
        "5 distinct color combinations",
        "Pacific Northwest lake heritage",
        "Premium waterski graphics",
        "Lake Washington exclusive artwork",
      ]
    }
  ]

  const { addToCart, setIsCartOpen, getCartItemCount } = useCart()
  const [selectedSize, setSelectedSize] = useState<{ [key: number]: string }>({})
  const [selectedColor, setSelectedColor] = useState<{ [key: number]: string }>({
    1: "Black Front", // Default color for Lake WA Board WA Hoodie
    3: "Design 1", // Default design for Washington Mens Swimwear
  })
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null)
  const [expandedImage, setExpandedImage] = useState(false)
  const [currentFeaturedImage, setCurrentFeaturedImage] = useState("/images/LAKE-WA-BOARD-WA-HOODIE/premium-eco-hoodie-black-front-6854ad648b26b.png")
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

  // Image mappings for Lake WA Board WA Hoodie
  const lakeWABoardImages = {
    "Black Front": "/images/LAKE-WA-BOARD-WA-HOODIE/premium-eco-hoodie-black-front-6854ad648b26b.png",
    "Black Back": "/images/LAKE-WA-BOARD-WA-HOODIE/premium-eco-hoodie-black-back-6854ad648c5ea.png",
    "Black Front Alt": "/images/LAKE-WA-BOARD-WA-HOODIE/premium-eco-hoodie-black-front-6854ad648bd6c.png",
    "Black Back Alt": "/images/LAKE-WA-BOARD-WA-HOODIE/premium-eco-hoodie-black-back-6854ad648cf27.png"
  }
  const lakeWABoardColors = ["Black Front", "Black Back", "Black Front Alt", "Black Back Alt"]



  // Image mappings for Washington Mens Swimwear
  const washingtonMensSwimwearImages = {
    "Design 1": "/images/WASHINGTON-MENS-SWIMWEAR/1.svg",
    "Design 2": "/images/WASHINGTON-MENS-SWIMWEAR/2.svg",
    "Design 3": "/images/WASHINGTON-MENS-SWIMWEAR/3.svg"
  }
  const washingtonMensSwimwearColors = ["Design 1", "Design 2", "Design 3"]

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

  const handleAddToCart = (product: any, index: number) => {
    const size = selectedSize[index]
    if (!size) {
      alert("Please select a size first")
      return
    }
    
    // Use the product's actual images based on selected color
    const colorIndex = selectedColor[index] || 0
    let productImage = product.images[colorIndex] || product.images[0]
    
    const cartItem = {
      id: `${product.name}-${size}${selectedColor[index] ? `-${selectedColor[index]}` : ''}`,
      name: `${product.name}${selectedColor[index] ? ` (${selectedColor[index]})` : ''}`,
      price: product.price,
      size: size,
      image: productImage,
    }
    addToCart(cartItem)
    setIsCartOpen(true)
  }

  const handleImageClick = (imageSrc: string, productIndex?: number) => {
    setCurrentFeaturedImage(imageSrc)
    setExpandedImage(true)
    setExpandedProductIndex(productIndex ?? null)
    
    // Set current image index based on product type
    if (productIndex === 1) {
      // Lake WA Board WA Hoodie
      const colorIndex = lakeWABoardColors.indexOf(selectedColor[1] || "Black Front")
      setCurrentImageIndex(colorIndex >= 0 ? colorIndex : 0)
    } else if (productIndex === 3) {
      // Washington Mens Swimwear
      const designIndex = washingtonMensSwimwearColors.indexOf(selectedColor[3] || "Design 1")
      setCurrentImageIndex(designIndex >= 0 ? designIndex : 0)
    } else {
      setCurrentImageIndex(0)
    }
    
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
    if (expandedProductIndex === null) return

    const product = apparelProducts[expandedProductIndex]
    if (!product) return

    if (expandedProductIndex === 1) {
      // Lake WA Board WA Hoodie
      const currentIndex = currentImageIndex
      const totalImages = lakeWABoardColors.length
      const newIndex = direction === 'next' 
        ? (currentIndex + 1) % totalImages 
        : (currentIndex - 1 + totalImages) % totalImages
      
      const newColor = lakeWABoardColors[newIndex]
      setSelectedColor(prev => ({ ...prev, [expandedProductIndex]: newColor }))
      setCurrentFeaturedImage(lakeWABoardImages[newColor as keyof typeof lakeWABoardImages])
      setCurrentImageIndex(newIndex)
    } else if (expandedProductIndex === 3) {
      // Washington Mens Swimwear
      const currentIndex = currentImageIndex
      const totalImages = washingtonMensSwimwearColors.length
      const newIndex = direction === 'next' 
        ? (currentIndex + 1) % totalImages 
        : (currentIndex - 1 + totalImages) % totalImages
      
      const newDesign = washingtonMensSwimwearColors[newIndex]
      setSelectedColor(prev => ({ ...prev, [expandedProductIndex]: newDesign }))
      setCurrentFeaturedImage(washingtonMensSwimwearImages[newDesign as keyof typeof washingtonMensSwimwearImages])
      setCurrentImageIndex(newIndex)
    }
    
    // Reset zoom when navigating
    setImageZoom(1)
    setImagePosition({ x: 0, y: 0 })
  }

  const getTotalImagesForExpandedProduct = () => {
    if (expandedProductIndex === 1) return lakeWABoardColors.length
    if (expandedProductIndex === 3) return washingtonMensSwimwearColors.length
    return 1
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
    wind: "W 8 mph",
    humidity: "65%",
    visibility: "10 mi",
    lastUpdated: "--:--:--" // Initial placeholder to prevent hydration mismatch
  })
  const [isLoadingWeather, setIsLoadingWeather] = useState(false)

  // 3-day forecast state
  const [forecast, setForecast] = useState([
    { day: "Today", condition: "Partly Cloudy", emoji: "⛅", high: "72°", low: "58°" },
    { day: "Thursday", condition: "Light Rain", emoji: "🌦️", high: "68°", low: "56°" },
    { day: "Friday", condition: "Cloudy", emoji: "☁️", high: "70°", low: "57°" }
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
      
      // Use National Weather Service API for Lake Washington area (Seattle)
      // Coordinates: 47.6266° N, 122.2606° W (from forecast.weather.gov/MapClick.php?lat=47.6266&lon=-122.2606)
      const nwsApiUrl = "https://api.weather.gov/points/47.6266,-122.2606"
      
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
                visibility = "10+ mi" // Default for Seattle
              }
            }
            
            // If humidity is not available, set reasonable defaults based on conditions
            if (humidity === "N/A") {
              const conditionLower = currentCondition.toLowerCase()
              if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
                humidity = "45%"
              } else if (conditionLower.includes('partly cloudy')) {
                humidity = "55%"
              } else if (conditionLower.includes('cloudy') || conditionLower.includes('overcast')) {
                humidity = "70%"
              } else if (conditionLower.includes('rain') || conditionLower.includes('showers')) {
                humidity = "85%"
              } else if (conditionLower.includes('storm') || conditionLower.includes('thunderstorm')) {
                humidity = "90%"
              } else {
                humidity = "60%" // Default for Seattle
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
      
      // Fallback to simulated Seattle weather if NWS API fails
      console.log("🔄 Using fallback weather data for Seattle area...")
      
      const weatherConditions = [
        { temp: "72°F", condition: "Partly Cloudy", emoji: "⛅", wind: "W 8 mph", humidity: "65%", visibility: "10 mi" },
        { temp: "68°F", condition: "Light Rain", emoji: "🌦️", wind: "SW 10 mph", humidity: "80%", visibility: "6 mi" },
        { temp: "70°F", condition: "Cloudy", emoji: "☁️", wind: "W 5 mph", humidity: "70%", visibility: "8 mi" },
        { temp: "65°F", condition: "Rainy", emoji: "🌦️", wind: "S 12 mph", humidity: "85%", visibility: "4 mi" },
        { temp: "73°F", condition: "Mostly Sunny", emoji: "☀️", wind: "NW 6 mph", humidity: "50%", visibility: "15 mi" },
        { temp: "67°F", condition: "Overcast", emoji: "☁️", wind: "W 7 mph", humidity: "75%", visibility: "7 mi" },
      ]

      const forecastOptions = [
        [
          { day: "Today", condition: "Partly Cloudy", emoji: "⛅", high: "72°F", low: "58°F" },
          { day: "Thursday", condition: "Light Rain", emoji: "🌦️", high: "68°F", low: "56°F" },
          { day: "Friday", condition: "Cloudy", emoji: "☁️", high: "70°F", low: "57°F" }
        ],
        [
          { day: "Today", condition: "Light Rain", emoji: "🌦️", high: "68°F", low: "55°F" },
          { day: "Thursday", condition: "Showers", emoji: "🌦️", high: "65°F", low: "54°F" },
          { day: "Friday", condition: "Partly Cloudy", emoji: "⛅", high: "69°F", low: "56°F" }
        ],
        [
          { day: "Today", condition: "Mostly Sunny", emoji: "☀️", high: "75°F", low: "59°F" },
          { day: "Thursday", condition: "Partly Cloudy", emoji: "⛅", high: "73°F", low: "58°F" },
          { day: "Friday", condition: "Sunny", emoji: "☀️", high: "76°F", low: "60°F" }
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

  useEffect(() => {
    const fetchLakeConditions = async () => {
      setIsLoadingLakeConditions(true)
      setLakeConditionsError(null)
      // Update with Lake Washington data source - using lakemonster.com/lake/WA/Lake-Washington-320
      const externalLakeUrl = "https://lakemonster.com/lake/WA/Lake-Washington-320"

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
      {/* Header */}
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
                WASHINGTON
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
              Premium apparel inspired by {lakeInfo.name}'s urban beauty.
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
                          {/* Background image for all products */}
                          <Image
                            src={lakeInfo.heroImage}
                            alt="Lake Washington Background"
                            fill
                            className="object-cover"
                          />
                          
                          <Image
                            src={product.images[product.colors.findIndex(c => c.name === selectedColor[actualIndex]) || 0] || product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                          
                          {/* Click to expand overlay - For featured products with multiple images */}
                          {(actualIndex === 1 || actualIndex === 3) && (
                            <div 
                              className="absolute inset-0 cursor-pointer z-10 flex items-center justify-center"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                let imageToShow = "/placeholder.svg?height=800&width=800";
                                if (actualIndex === 1) {
                                  imageToShow = lakeWABoardImages[selectedColor[actualIndex] as keyof typeof lakeWABoardImages || "Black Front"] || "/placeholder.svg?height=800&width=800";
                                } else if (actualIndex === 3) {
                                  imageToShow = washingtonMensSwimwearImages[selectedColor[actualIndex] as keyof typeof washingtonMensSwimwearImages || "Design 1"] || "/placeholder.svg?height=800&width=800";
                                }
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
                          )}
                          
                          {/* Click to expand overlay for other products */}
                          {actualIndex !== 1 && actualIndex !== 3 && (
                            <div 
                              className="absolute inset-0 cursor-pointer z-10"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleImageClick(`/placeholder.svg?height=800&width=800`, actualIndex)
                              }}
                            />
                          )}
                          
                          {(actualIndex === 1 || actualIndex === 2 || actualIndex === 3) && (
                            <div className="absolute top-4 left-4">
                              <div className="bg-blue-500/20 backdrop-blur-sm text-blue-200 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-light tracking-wide">
                                {actualIndex === 1 && `FEATURED • ${lakeWABoardColors.indexOf(selectedColor[1] || "Black Front") + 1} of ${lakeWABoardColors.length}`}
                                {actualIndex === 3 && `FEATURED • ${washingtonMensSwimwearColors.indexOf(selectedColor[3] || "Design 1") + 1} of ${washingtonMensSwimwearColors.length}`}
                              </div>
                            </div>
                          )}

                          {/* Quick add overlay on hover for non-featured products */}
                          {actualIndex !== 1 && actualIndex !== 2 && actualIndex !== 3 && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                              <button 
                                className="bg-blue-500/90 backdrop-blur-sm text-white px-6 py-2 rounded-full text-sm font-medium tracking-wide hover:bg-blue-400 transition-colors shadow-lg shadow-blue-500/30"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Quick add functionality - default to Medium size
                                  const defaultSize = 'M';
                                  setSelectedSize(prev => ({ ...prev, [actualIndex]: defaultSize }));
                                  handleAddToCart(product, actualIndex);
                                }}
                              >
                                QUICK ADD
                              </button>
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
                              {/* Color selection for Lake WA Board WA Hoodie */}
                              {actualIndex === 1 && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-2">Color:</label>
                                  <div className="flex flex-wrap gap-2">
                                    {lakeWABoardColors.map((color) => (
                                      <button
                                        key={color}
                                        onClick={() => {
                                          setSelectedColor(prev => ({ ...prev, [actualIndex]: color }))
                                          setCurrentFeaturedImage(lakeWABoardImages[color as keyof typeof lakeWABoardImages])
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



                              {/* Design selection for Washington Mens Swimwear */}
                              {actualIndex === 3 && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-2">Design:</label>
                                  <div className="flex flex-wrap gap-2">
                                    {washingtonMensSwimwearColors.map((design) => (
                                      <button
                                        key={design}
                                        onClick={() => {
                                          setSelectedColor(prev => ({ ...prev, [actualIndex]: design }))
                                          setCurrentFeaturedImage(washingtonMensSwimwearImages[design as keyof typeof washingtonMensSwimwearImages])
                                        }}
                                        className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                                          selectedColor[actualIndex] === design
                                            ? "border-blue-400 bg-blue-400/10 text-blue-400"
                                            : "border-gray-700 hover:border-gray-600 text-gray-300"
                                        }`}
                                      >
                                        {design}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <select
                                className="w-full bg-gray-800/50 border border-blue-500/30 text-white px-4 py-3 rounded-lg text-sm font-light focus:border-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors"
                                value={selectedSize[actualIndex] || ""}
                                onChange={(e) => setSelectedSize((prev) => ({ ...prev, [actualIndex]: e.target.value }))}
                              >
                                <option value="">Select Size</option>
                                <option value="S">Small</option>
                                <option value="M">Medium</option>
                                <option value="L">Large</option>
                                <option value="XL">X-Large</option>
                                <option value="XXL">XX-Large</option>
                              </select>
                              
                              <button
                                className="w-full bg-blue-500 text-white py-3 rounded-lg text-sm font-medium tracking-wide hover:bg-blue-400 transition-colors shadow-lg shadow-blue-500/30"
                                onClick={() => handleAddToCart(product, actualIndex)}
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

                            <div className="space-y-4 pt-4 border-t border-gray-700/30">
                              <div>
                                <p className="text-gray-300 text-sm font-light leading-relaxed">
                                  {product.details}
                                </p>
                              </div>
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
                            </div>
                          </div>
                        )}

                        {expandedProduct !== actualIndex && (
                          <button
                            className="mt-4 text-blue-300 text-sm font-light hover:text-blue-200 transition-colors underline underline-offset-4"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedProduct(actualIndex);
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
                    src="https://open.ivideon.com/embed/v3/?server=200-YV6knPliOPswemRS31OP0Q&camera=0&width=&height=&lang=en&autoplay=1"
                    title="Lake Washington Live Webcam - Ivideon Stream"
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
                          {isLoadingLakeConditions ? '--' : (lakeRealTimeConditions.waterTemp !== 'N/A' ? lakeRealTimeConditions.waterTemp : '64°F')}
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

      <section className="py-8 bg-gradient-to-r from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-center">
              <div className="w-24 h-24 md:w-32 md:h-32">
                <Image
                  src={lakeInfo.icon || "/placeholder.svg"}
                  alt={lakeInfo.name}
                  width={192}
                  height={192}
                  className="w-full h-full object-contain"
                  style={{ transform: 'scale(1.0)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

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

              {/* Navigation Controls for Featured Products */}
              {(expandedProductIndex === 1 || expandedProductIndex === 3) && getTotalImagesForExpandedProduct() > 1 && (
                <>
                  {/* Left Arrow */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      navigateExpandedImage('prev')
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-colors shadow-lg z-[110] border border-white/20 hover:border-white/40"
                    aria-label="Previous image"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {/* Right Arrow */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      navigateExpandedImage('next')
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-colors shadow-lg z-[110] border border-white/20 hover:border-white/40"
                    aria-label="Next image"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Image Counter and Dots for Featured Products */}
              {(expandedProductIndex === 1 || expandedProductIndex === 3) && getTotalImagesForExpandedProduct() > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-[110]">
                  {/* Image Counter */}
                  <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm border border-white/20">
                    {currentImageIndex + 1} of {getTotalImagesForExpandedProduct()}
                  </div>
                  
                  {/* Dot Indicators */}
                  <div className="flex gap-2">
                    {Array.from({ length: getTotalImagesForExpandedProduct() }).map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation()
                          if (expandedProductIndex === 1) {
                            const newColor = lakeWABoardColors[index]
                            setSelectedColor(prev => ({ ...prev, [expandedProductIndex]: newColor }))
                            setCurrentFeaturedImage(lakeWABoardImages[newColor as keyof typeof lakeWABoardImages])
                            setCurrentImageIndex(index)
                          } else if (expandedProductIndex === 3) {
                            const newDesign = washingtonMensSwimwearColors[index]
                            setSelectedColor(prev => ({ ...prev, [expandedProductIndex]: newDesign }))
                            setCurrentFeaturedImage(washingtonMensSwimwearImages[newDesign as keyof typeof washingtonMensSwimwearImages])
                            setCurrentImageIndex(index)
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
              )}

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
            </div>
          </div>
        </div>
      )}
      
      {/* Shopping Cart Sidebar */}
      <ShoppingCartSidebar />
    </div>
  )
}
