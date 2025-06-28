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
    // Try multiple webcam sources - WetMet as primary
    const webcamUrls = [
      'https://api.wetmet.net/client-content/PlayerFrame.php?CAMERA=162-02-01',
      'https://vauth.command.verkada.com/embed/html/8ec1dcee-9b56-4a30-a7ef-8fe081dd7b9d/',
      'http://www.luckylablodge.com/mjpg/video.mjpg',
      'https://www.luckylablodge.com/', // Fallback to main site
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
      // Try to fetch from API to check if it's working - use WetMet as primary
      const response = await fetch('/api/webcam?source=wetmet', {
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
            src="/images/coeur-dalene-hero-bw.jpg"
            alt="Coeur d'Alene Lake placeholder view"
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
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
            aria-label="Live webcam feed from Lake Coeur d'Alene"
          />
        )}
      </div>
    </div>
  )
}

export default function CoeurDalenePage() {
  const lakeInfo = {
    name: "Lake Coeur d'Alene",
    state: "Idaho",
    heroImage: "/images/CDA-Background.svg",
    icon: "/images/lake-icon.png",
    gpsCoordinates: "47.6661° N, 116.7706° W",
    elevation: "2,100 ft",
    maxDepth: "220 ft",
    description: "A stunning natural lake known for its scenic beauty, clear waters, and vibrant lakeside city.",
    features: [
      "Over 100 miles of shoreline",
      "Popular for boating and water sports",
      "Home to the world's only floating, movable golf green",
      "Rich history and Native American heritage",
      "Surrounded by forested mountains",
    ],
    badgeText: "IDAHO GEM",
    badgeIcon: "/images/idaho-icon.png",
    heroGradient: "from-neutral-700 to-neutral-800",
  }

  const apparelProducts = [
    // CDA SWIM TEE
    {
      name: "CDA Swim Tee",
      description: "Lightweight swim tee with the \"Swim CDA\" design print Product features - Available in sizes S to 4XL to ensure a perfect fit for everyone. - Construc...",
      price: "$33",
      imageQuery: "swim tee coeur d'alene water sports",
      featuredImage: "/images/CDA-SWIM-TEE/Green.png",
      details:
        "Lightweight swim tee with quick-dry technology and CDA branding. Available in 4 color options.",
      featuresList: [
        "Quick-dry fabric technology",
        "UPF 50+ sun protection", 
        "Custom CDA branding",
        "Lightweight and breathable",
        "Chlorine and saltwater resistant",
        "Available in 4 color options",
      ],
    },

    // CDA SAIL LONG SLEEVE SHIRT
    {
      name: "CDA Sail Long Sleeve Shirt",
      description: "Long Sleeve Sailing Shirt with Sail CDA design print Product features - Durable double needle sleeve and bottom hems for long-lasting wear. - Elastic...",
      price: "$40",
      imageQuery: "long sleeve sailing shirt coeur d'alene design",
      featuredImage: "/images/CDA-SAIL-LONG-SLEEVE-SHIRT/Ivory.png",
      details:
        "High-performance long sleeve shirt designed for sailing and water sports. Features UPF sun protection, moisture-wicking fabric, and custom CDA sailing branding. Perfect for extended time on the water at Coeur d'Alene.",
      featuresList: [
        "UPF 50+ sun protection",
        "Moisture-wicking fabric technology", 
        "Custom CDA sailing branding",
        "Long sleeve design for coverage",
        "Quick-dry material",
        "Available in 4 color options",
      ],
    },

    // CDA SWIM LONG SLEEVE SHIRT
    {
      name: "CDA Swim Long Sleeve Shirt",
      description: "CDA swim Long Sleeve Shirt designed for those who swim in Lake Coeur D\' Alene Product features - Durable double needle sleeve and bottom hems for lon...",
      price: "$40",
      imageQuery: "swim long sleeve shirt coeur d'alene water sports",
      featuredImage: "/images/CDA-SWIM-LONG-SLEEVE-SHIRT/Sea-Green.png",
      details:
        "High-performance swim long sleeve shirt designed for water activities and sun protection. Features UPF 50+ protection, quick-dry technology, and custom CDA branding. Perfect for swimming, paddleboarding, or any water activity at Coeur d'Alene.",
      featuresList: [
        "UPF 50+ sun protection",
        "Quick-dry fabric technology", 
        "Custom CDA swim branding",
        "Long sleeve coverage",
        "Chlorine and saltwater resistant",
        "Available in 4 color options",
      ],
    },

    // CDA UNDER ARMOUR PERFORMANCE POLO
    {
      name: "CDA Under Armour Performance Polo",
      description: "Premium Under Armour polo with moisture-wicking technology and CDA branding. Perfect for lakeside activities.",
      price: "$65",
      imageQuery: "under armor polo shirt coeur d'alene design",
      featuredImage: "/images/CDA-UNDER-ARMOR-POLO/under-armour-mens-polo-shirt-black-front-685a34c055c76.png",
      details:
        "High-performance Under Armour polo shirt featuring custom CDA branding. Advanced moisture-wicking fabric technology keeps you cool and dry during water sports, golf, or any lakeside activity. Professional design perfect for both casual and active wear.",
      featuresList: [
        "Under Armour HeatGear® fabric",
        "Advanced moisture-wicking technology", 
        "Custom CDA lakeside branding",
        "UPF 30+ sun protection",
        "Anti-odor technology",
        "Available in 3 premium colors",
      ],
    },

    // CDA WATERSKI TEE
    {
      name: "CDA Waterski Tee",
      description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and c...",
      price: "$33",
      imageQuery: "waterski t-shirt coeur d'alene design",
      featuredImage: "/images/CDA-APPAREL/CDA-WATERSKI-TEE/Front, Peony.png",
      details:
        "Premium waterski t-shirt celebrating Coeur d'Alene's legendary water sports culture. Features exclusive front and back design views showcasing Idaho's premier waterski destination with crystal-clear lake waters. Available in 5 distinctive color combinations with both front and back views.",
      featuresList: [
        "Premium waterski design graphics",
        "Front and back view options",
        "5 unique color combinations",
        "Idaho crystal lake inspired",
        "CDA waterski tribute",
        "Premium comfort fit",
      ],
    },

    // CDA FISH TEE
    {
      name: "CDA Fish Tee",
      description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and c...",
      price: "$33",
      imageQuery: "fishing t-shirt coeur d'alene design",
      featuredImage: "/images/CDA-APPAREL/CDA-FISH-TEE/Front, Sage.png",
      details:
        "Premium fishing t-shirt celebrating Coeur d'Alene's legendary fishing culture. Features exclusive front and back design views showcasing Idaho's premier fishing destination with crystal-clear lake waters. Available in 6 distinctive color combinations with both front and back views.",
      featuresList: [
        "Premium fishing design graphics",
        "Front and back view options",
        "6 unique color combinations",
        "Idaho fishing tribute",
        "CDA lake fishing culture",
        "Premium comfort fit",
      ],
    },

    // CDA LAKE TEE
    {
      name: "CDA Lake Tee",
      description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and c...",
      price: "$33",
      imageQuery: "lake t-shirt coeur d'alene design",
      featuredImage: "/images/CDA-APPAREL/CDA-LAKE-TEE/Front, White.png",
      details:
        "Premium lake t-shirt celebrating Coeur d'Alene's pristine waters. Features exclusive front and back design views showcasing Idaho's premier lake destination with stunning natural beauty. Available in 6 distinctive color combinations with both front and back views.",
      featuresList: [
        "Premium lake design graphics",
        "Front and back view options",
        "6 unique color combinations",
        "Idaho pristine waters tribute",
        "CDA lake culture design",
        "Premium comfort fit",
      ],
    },

    // CDA SKI TEE
    {
      name: "CDA Ski Tee",
      description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and c...",
      price: "$33",
      imageQuery: "ski t-shirt coeur d'alene design",
      featuredImage: "/images/CDA-APPAREL/CDA-SKI-TEE/Back, White.png",
      details:
        "Premium ski t-shirt celebrating Coeur d'Alene's winter sports culture. Features exclusive front and back design views showcasing Idaho's premier winter destination with mountain lake backdrop. Available in 6 distinctive color combinations with both front and back views.",
      featuresList: [
        "Premium ski design graphics",
        "Front and back view options",
        "6 unique color combinations",
        "Idaho winter sports tribute",
        "CDA ski culture design",
        "Premium comfort fit",
      ],
    },

    // CDA SURF TEE
    {
      name: "CDA Surf Tee",
      description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and c...",
      price: "$33",
      imageQuery: "surf t-shirt coeur d'alene design",
      featuredImage: "/images/CDA-APPAREL/CDA-SURF-TEE/Back, Bay.png",
      details:
        "Premium surf t-shirt celebrating Coeur d'Alene's water sports culture. Features exclusive front and back design views showcasing Idaho's premier surf destination with pristine lake waters. Available in 6 distinctive color combinations with both front and back views.",
      featuresList: [
        "Premium surf design graphics",
        "Front and back view options",
        "6 unique color combinations",
        "Idaho water sports tribute",
        "CDA surf culture design",
        "Premium comfort fit",
      ],
    },

    // CDA BOARD TEE
    {
      name: "CDA Board Tee",
      description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and c...",
      price: "$33",
      imageQuery: "board t-shirt coeur d'alene design",
      featuredImage: "/images/CDA-APPAREL/CDA-BOARD-TEE/Back, Black.png",
      details:
        "Premium board t-shirt celebrating Coeur d'Alene's boarding culture. Features exclusive front and back design views showcasing Idaho's premier boarding destination with crystal-clear lake waters. Available in 6 distinctive color combinations with both front and back views.",
      featuresList: [
        "Premium board design graphics",
        "Front and back view options",
        "6 unique color combinations",
        "Idaho boarding tribute",
        "CDA board culture design",
        "Premium comfort fit",
      ],
    },

    // CDA DIVE TEE
    {
      name: "CDA Dive Tee",
      description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and c...",
      price: "$33",
      imageQuery: "dive t-shirt coeur d'alene design",
      featuredImage: "/images/CDA-APPAREL/CDA-DIVE-TEE/Back, Bay.png",
      details:
        "Premium dive t-shirt celebrating Coeur d'Alene's diving culture. Features exclusive front and back design views showcasing Idaho's premier diving destination with pristine lake waters. Available in 6 distinctive color combinations with both front and back views.",
      featuresList: [
        "Premium dive design graphics",
        "Front and back view options",
        "6 unique color combinations",
        "Idaho diving tribute",
        "CDA dive culture design",
        "Premium comfort fit",
      ],
    },
  ]

  const { addToCart, setIsCartOpen, getCartItemCount } = useCart()
  const [selectedSize, setSelectedSize] = useState<{ [key: number]: string }>({})
  const [selectedColor, setSelectedColor] = useState<{ [key: number]: string }>({ 
    0: "Green",        // CDA Swim Tee
    1: "Ivory",        // CDA Sail Long Sleeve
    2: "Sea Green",    // CDA Swim Long Sleeve
    3: "Black",        // CDA Polo
    4: "Peony",        // CDA Waterski Tee
    5: "Sage",         // CDA Fish Tee
    6: "White",        // CDA Lake Tee
    7: "White Back",   // CDA Ski Tee
    8: "Bay Back",     // CDA Surf Tee
    9: "Black Back",   // CDA Board Tee
    10: "Bay Back"     // CDA Dive Tee
  });
  const [selectedView, setSelectedView] = useState<{ [key: number]: string }>({ 3: "Front" });
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null)
  const [expandedImage, setExpandedImage] = useState(false)
  const [currentFeaturedImage, setCurrentFeaturedImage] = useState(apparelProducts[0].featuredImage)

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

  // Image navigation state for apparel cards
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: string]: number }>({
    swimhoodie: 0,
    swimsuit: 0
  })

  // CDA Swim Tee images array with color mapping
  const swimTeeColors = ["Green", "Midnight Blue", "Red", "Red Backside"];
  const swimTeeImages: { [key: string]: string } = {
    "Green": "/images/CDA-SWIM-TEE/Green.png",
    "Midnight Blue": "/images/CDA-SWIM-TEE/Midnight-Blue.png",
    "Red": "/images/CDA-SWIM-TEE/Red.png",
    "Red Backside": "/images/CDA-SWIM-TEE/Red-Backside.png"
  };
  const swimTeeImageArray = Object.values(swimTeeImages);





  // Zoom state for expanded images
  const [imageZoom, setImageZoom] = useState(1)
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  // CDA Under Armor Polo images array with color mapping - USING ACTUAL POLO IMAGES
  const poloColors = ["Black", "Navy", "Grey"];
  const poloImages: { [key: string]: string } = {
    "Black": "/images/CDA-UNDER-ARMOR-POLO/under-armour-mens-polo-shirt-black-front-685a34c055c76.png",
    "Navy": "/images/CDA-UNDER-ARMOR-POLO/under-armour-mens-polo-shirt-navy-front-685a34c055fc0.png",
    "Grey": "/images/CDA-UNDER-ARMOR-POLO/under-armour-mens-polo-shirt-grey-front-685a34c0560fb.png"
  };
  const poloImageArray = Object.values(poloImages);



  // CDA Sail Long Sleeve Shirt images array with color mapping
  const sailLongSleeveViews = ["Ivory", "Ivory Backside", "Ocean Blue", "Salmon"];
  const sailLongSleeveImages: { [key: string]: string } = {
    "Ivory": "/images/CDA-SAIL-LONG-SLEEVE-SHIRT/Ivory.png",
    "Ivory Backside": "/images/CDA-SAIL-LONG-SLEEVE-SHIRT/Ivory-Backside.png",
    "Ocean Blue": "/images/CDA-SAIL-LONG-SLEEVE-SHIRT/Ocean-Blue.png",
    "Salmon": "/images/CDA-SAIL-LONG-SLEEVE-SHIRT/Salmon.png"
  };
  const sailLongSleeveImageArray = Object.values(sailLongSleeveImages);

  // CDA Swim Long Sleeve Shirt images array with color mapping
  const swimLongSleeveColors = ["Sea Green", "Light Blue", "Dark Green", "Ocean Blue Backside"];
  const swimLongSleeveImages: { [key: string]: string } = {
    "Sea Green": "/images/CDA-SWIM-LONG-SLEEVE-SHIRT/Sea-Green.png",
    "Light Blue": "/images/CDA-SWIM-LONG-SLEEVE-SHIRT/Light-Blue.png",
    "Dark Green": "/images/CDA-SWIM-LONG-SLEEVE-SHIRT/Dark-Green.png",
    "Ocean Blue Backside": "/images/CDA-SWIM-LONG-SLEEVE-SHIRT/Ocean-Blue-Backside.png"
  };
  const swimLongSleeveImageArray = Object.values(swimLongSleeveImages);







  // CDA Waterski Tee images array with color mapping
  const cdaWaterskiTeeColors = ["Peony", "Peony Back", "Black", "Black Back", "Midnight", "Midnight Back", "Topaz Blue", "Topaz Blue Back", "Burnt Orange", "Burnt Orange Back"];
  const cdaWaterskiTeeImages: { [key: string]: string } = {
    "Peony": "/images/CDA-APPAREL/CDA-WATERSKI-TEE/Front, Peony.png",
    "Peony Back": "/images/CDA-APPAREL/CDA-WATERSKI-TEE/Back, Peony.png",
    "Black": "/images/CDA-APPAREL/CDA-WATERSKI-TEE/Front, Black.png",
    "Black Back": "/images/CDA-APPAREL/CDA-WATERSKI-TEE/Back, Black.png",
    "Midnight": "/images/CDA-APPAREL/CDA-WATERSKI-TEE/Front, Midnight.png",
    "Midnight Back": "/images/CDA-APPAREL/CDA-WATERSKI-TEE/Back, Midnight.png",
    "Topaz Blue": "/images/CDA-APPAREL/CDA-WATERSKI-TEE/Front, Topaz Blue.png",
    "Topaz Blue Back": "/images/CDA-APPAREL/CDA-WATERSKI-TEE/Back, Topaz Blue.png",
    "Burnt Orange": "/images/CDA-APPAREL/CDA-WATERSKI-TEE/Front, Burnt Orange.png",
    "Burnt Orange Back": "/images/CDA-APPAREL/CDA-WATERSKI-TEE/Back, Burnt Orange.png"
  };
  const cdaWaterskiTeeImageArray = Object.values(cdaWaterskiTeeImages);

  // CDA Fish Tee images array with color mapping
  const cdaFishTeeColors = ["Sage", "Sage Back", "Watermelon", "Black", "True Navy", "Bay", "Khaki"];
  const cdaFishTeeImages: { [key: string]: string } = {
    "Sage": "/images/CDA-APPAREL/CDA-FISH-TEE/Front, Sage.png",
    "Sage Back": "/images/CDA-APPAREL/CDA-FISH-TEE/Back, Sage.png",
    "Watermelon": "/images/CDA-APPAREL/CDA-FISH-TEE/Front, Watermelon.png",
    "Black": "/images/CDA-APPAREL/CDA-FISH-TEE/Front, Black.png",
    "True Navy": "/images/CDA-APPAREL/CDA-FISH-TEE/Front, True Navy.png",
    "Bay": "/images/CDA-APPAREL/CDA-FISH-TEE/Front, Bay.png",
    "Khaki": "/images/CDA-APPAREL/CDA-FISH-TEE/Front, Khaki.png"
  };
  const cdaFishTeeImageArray = Object.values(cdaFishTeeImages);

  // CDA Lake Tee images array with color mapping
  const cdaLakeTeeColors = ["White", "White Back", "Khaki", "Watermelon", "Black", "True Navy", "Bay"];
  const cdaLakeTeeImages: { [key: string]: string } = {
    "White": "/images/CDA-APPAREL/CDA-LAKE-TEE/Front, White.png",
    "White Back": "/images/CDA-APPAREL/CDA-LAKE-TEE/Back, White.png",
    "Khaki": "/images/CDA-APPAREL/CDA-LAKE-TEE/Front, Khaki.png",
    "Watermelon": "/images/CDA-APPAREL/CDA-LAKE-TEE/Front, Watermelon.png",
    "Black": "/images/CDA-APPAREL/CDA-LAKE-TEE/Front, Black.png",
    "True Navy": "/images/CDA-APPAREL/CDA-LAKE-TEE/Front, True Navy.png",
    "Bay": "/images/CDA-APPAREL/CDA-LAKE-TEE/Front, Bay.png"
  };
  const cdaLakeTeeImageArray = Object.values(cdaLakeTeeImages);

  // CDA Ski Tee images array with color mapping
  const cdaSkiTeeColors = ["White", "Watermelon Back", "Black Back", "True Navy Back", "Bay Back", "Khaki Back", "White Back"];
  const cdaSkiTeeImages: { [key: string]: string } = {
    "White": "/images/CDA-APPAREL/CDA-SKI-TEE/Front, White.png",
    "Watermelon Back": "/images/CDA-APPAREL/CDA-SKI-TEE/Back, Watermelon.png",
    "Black Back": "/images/CDA-APPAREL/CDA-SKI-TEE/Back, Black.png",
    "True Navy Back": "/images/CDA-APPAREL/CDA-SKI-TEE/Back, True Navy.png",
    "Bay Back": "/images/CDA-APPAREL/CDA-SKI-TEE/Back, Bay.png",
    "Khaki Back": "/images/CDA-APPAREL/CDA-SKI-TEE/Back, Khaki.png",
    "White Back": "/images/CDA-APPAREL/CDA-SKI-TEE/Back, White.png"
  };
  const cdaSkiTeeImageArray = Object.values(cdaSkiTeeImages);

  // CDA Surf Tee images array with color mapping
  const cdaSurfTeeColors = ["Bay Back", "Watermelon Back", "Black Back", "True Navy Back", "Khaki Back", "White Back"];
  const cdaSurfTeeImages: { [key: string]: string } = {
    "Bay Back": "/images/CDA-APPAREL/CDA-SURF-TEE/Back, Bay.png",
    "Watermelon Back": "/images/CDA-APPAREL/CDA-SURF-TEE/Back, Watermelon.png",
    "Black Back": "/images/CDA-APPAREL/CDA-SURF-TEE/Back, Black.png",
    "True Navy Back": "/images/CDA-APPAREL/CDA-SURF-TEE/Back, True Navy.png",
    "Khaki Back": "/images/CDA-APPAREL/CDA-SURF-TEE/Back, Khaki.png",
    "White Back": "/images/CDA-APPAREL/CDA-SURF-TEE/Back, White.png"
  };
  const cdaSurfTeeImageArray = Object.values(cdaSurfTeeImages);

  // CDA Board Tee images array with color mapping
  const cdaBoardTeeColors = ["White", "Watermelon Back", "Black Back", "True Navy Back", "Bay Back", "Khaki Back", "White Back"];
  const cdaBoardTeeImages: { [key: string]: string } = {
    "White": "/images/CDA-APPAREL/CDA-BOARD-TEE/Front, White.png",
    "Watermelon Back": "/images/CDA-APPAREL/CDA-BOARD-TEE/Back, Watermelon.png",
    "Black Back": "/images/CDA-APPAREL/CDA-BOARD-TEE/Back, Black.png",
    "True Navy Back": "/images/CDA-APPAREL/CDA-BOARD-TEE/Back, True Navy.png",
    "Bay Back": "/images/CDA-APPAREL/CDA-BOARD-TEE/Back, Bay.png",
    "Khaki Back": "/images/CDA-APPAREL/CDA-BOARD-TEE/Back, Khaki.png",
    "White Back": "/images/CDA-APPAREL/CDA-BOARD-TEE/Back, White.png"
  };
  const cdaBoardTeeImageArray = Object.values(cdaBoardTeeImages);

  // CDA Dive Tee images array with color mapping
  const cdaDiveTeeColors = ["White", "Watermelon Back", "Black Back", "True Navy Back", "Bay Back", "Khaki Back", "White Back"];
  const cdaDiveTeeImages: { [key: string]: string } = {
    "White": "/images/CDA-APPAREL/CDA-DIVE-TEE/Front, White.png",
    "Watermelon Back": "/images/CDA-APPAREL/CDA-DIVE-TEE/Back, Watermelon.png",
    "Black Back": "/images/CDA-APPAREL/CDA-DIVE-TEE/Back, Black.png",
    "True Navy Back": "/images/CDA-APPAREL/CDA-DIVE-TEE/Back, True Navy.png",
    "Bay Back": "/images/CDA-APPAREL/CDA-DIVE-TEE/Back, Bay.png",
    "Khaki Back": "/images/CDA-APPAREL/CDA-DIVE-TEE/Back, Khaki.png",
    "White Back": "/images/CDA-APPAREL/CDA-DIVE-TEE/Back, White.png"
  };
  const cdaDiveTeeImageArray = Object.values(cdaDiveTeeImages);

  const handleAddToCart = (product: any, index: number) => {
    const size = selectedSize[index]
    const color = selectedColor[index]
    
    if (!size) {
      alert("Please select a size first")
      return
    }
    
    // For featured products with multiple colors/views, require color/view selection
    if ((index === 0 || index === 1 || index === 2 || index === 3 || index === 4 || index === 5 || index === 6 || index === 7 || index === 8 || index === 9 || index === 10) && !color) {
      alert("Please select a color/view first")
      return
    }
    
    let productImage = `/placeholder.svg?height=200&width=200&query=${product.imageQuery}`;
    if (index === 0) {
      // CDA Swim Tee
      productImage = swimTeeImages[color || "Green"] || "/placeholder.svg?height=200&width=200";
    } else if (index === 1) {
      // CDA Sail Long Sleeve
      productImage = sailLongSleeveImages[color || "Ivory"] || "/placeholder.svg?height=200&width=200";
    } else if (index === 2) {
      // CDA Swim Long Sleeve
      productImage = swimLongSleeveImages[color || "Sea Green"] || "/placeholder.svg?height=200&width=200";
    } else if (index === 3) {
      // CDA Polo
      productImage = poloImages[color || "Black"] || "/placeholder.svg?height=200&width=200";
    } else if (index === 4) {
      // CDA Waterski Tee
      productImage = cdaWaterskiTeeImages[color || "Peony"] || "/placeholder.svg?height=200&width=200";
    } else if (index === 5) {
      // CDA Fish Tee
      productImage = cdaFishTeeImages[color || "Sage"] || "/placeholder.svg?height=200&width=200";
    } else if (index === 6) {
      // CDA Lake Tee
      productImage = cdaLakeTeeImages[color || "White"] || "/placeholder.svg?height=200&width=200";
    } else if (index === 7) {
      // CDA Ski Tee
      productImage = cdaSkiTeeImages[color || "White Back"] || "/placeholder.svg?height=200&width=200";
    } else if (index === 8) {
      // CDA Surf Tee
      productImage = cdaSurfTeeImages[color || "Bay Back"] || "/placeholder.svg?height=200&width=200";
    } else if (index === 9) {
      // CDA Board Tee
      productImage = cdaBoardTeeImages[color || "Black Back"] || "/placeholder.svg?height=200&width=200";
    } else if (index === 10) {
      // CDA Dive Tee
      productImage = cdaDiveTeeImages[color || "Bay Back"] || "/placeholder.svg?height=200&width=200";
    }
    
    const cartItem = {
      id: `${product.name}-${size}${color ? `-${color}` : ''}`,
      name: `${product.name}${color ? ` (${color})` : ''}`,
      price: product.price,
      size: size,
      image: productImage,
    }
    addToCart(cartItem)
    setIsCartOpen(true)
  }

  const handleImageClick = (imageSrc: string) => {
    setCurrentFeaturedImage(imageSrc)
    setExpandedImage(true)
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
    temperature: "77°",
    condition: "Mostly Sunny",
    emoji: "☀️",
    wind: "SSW 2 mph",
    humidity: "29%",
    visibility: "1.24 mi",
    lastUpdated: "--:--:--" // Initial placeholder to prevent hydration mismatch
  })
  const [isLoadingWeather, setIsLoadingWeather] = useState(false)

  // Set initial time after component mounts to prevent hydration mismatch
  useEffect(() => {
    setCurrentWeather(prev => ({
      ...prev,
      lastUpdated: new Date().toLocaleTimeString()
    }))
  }, [])

  // 3-day forecast state
  const [forecast, setForecast] = useState([
    { day: "Today", condition: "Mostly Sunny", emoji: "☀️", high: "84°", low: "58°" },
    { day: "Thursday", condition: "Mostly Sunny", emoji: "☀️", high: "80°", low: "56°" },
    { day: "Friday", condition: "Mostly Sunny", emoji: "☀️", high: "78°", low: "53°" }
  ])

  // Fetch current weather data
  const fetchCurrentWeather = async () => {
    setIsLoadingWeather(true)
    try {
      console.log("🌤️ Fetching current weather conditions from NWS for Coeur d'Alene...")
      
      // Use National Weather Service API for Coeur d'Alene, Idaho area
      // Coordinates: 47.6777° N, 116.7804° W (Coeur d'Alene city center)
      const nwsApiUrl = "https://api.weather.gov/points/47.6777,-116.7804"
      
      const pointResponse = await fetch(nwsApiUrl)
      if (!pointResponse.ok) {
        throw new Error(`NWS Point API failed: ${pointResponse.status}`)
      }
      
      const pointData = await pointResponse.json()
      const currentConditionsUrl = pointData.properties.forecastHourly
      const forecastUrl = pointData.properties.forecast
      
      // Fetch both current conditions and forecast
      const [hourlyResponse, dailyResponse] = await Promise.all([
        fetch(currentConditionsUrl),
        fetch(forecastUrl)
      ])
      
      if (!hourlyResponse.ok || !dailyResponse.ok) {
        throw new Error("Failed to fetch weather data")
      }
      
      const [hourlyData, dailyData] = await Promise.all([
        hourlyResponse.json(),
        dailyResponse.json()
      ])
      
      // Extract current conditions from hourly data
      const currentHour = hourlyData.properties.periods[0]
      const currentTemp = currentHour.temperature + "°F"
      const currentCondition = currentHour.shortForecast
      const currentWind = currentHour.windSpeed + " " + currentHour.windDirection
      
      // Try to get additional details from current conditions if available
      let humidity = "N/A"
      let visibility = "N/A"
      
      // Check if detailed weather data is available in the current hour
      if (currentHour.relativeHumidity?.value) {
        humidity = Math.round(currentHour.relativeHumidity.value) + "%"
      } else {
        // If humidity is not available, set reasonable defaults based on conditions
        const conditionLower = currentCondition.toLowerCase()
        if (conditionLower.includes('rain') || conditionLower.includes('storm')) {
          humidity = "75-85%"
        } else if (conditionLower.includes('cloud') || conditionLower.includes('overcast')) {
          humidity = "60-70%"
        } else if (conditionLower.includes('sunny') || conditionLower.includes('clear')) {
          humidity = "40-50%"
        } else {
          humidity = "55-65%"
        }
      }
      
      // If visibility is not available from hourly data, set defaults based on weather conditions  
      const conditionLower = currentCondition.toLowerCase()
      if (conditionLower.includes('fog') || conditionLower.includes('mist')) {
        visibility = "0.5-2 mi"
      } else if (conditionLower.includes('rain') || conditionLower.includes('storm')) {
        visibility = "3-6 mi"
      } else if (conditionLower.includes('cloud')) {
        visibility = "8-12 mi"
      } else {
        visibility = "10+ mi"
      }
      
      // Map weather conditions to emojis
      const getWeatherEmoji = (condition: string) => {
        const conditionLower = condition.toLowerCase()
        if (conditionLower.includes('sunny') || conditionLower.includes('clear')) return "☀️"
        if (conditionLower.includes('partly cloudy')) return "⛅"
        if (conditionLower.includes('cloudy') || conditionLower.includes('overcast')) return "☁️"
        if (conditionLower.includes('rain')) return "🌧️"
        if (conditionLower.includes('storm') || conditionLower.includes('thunder')) return "⛈️"
        if (conditionLower.includes('snow')) return "❄️"
        if (conditionLower.includes('fog') || conditionLower.includes('mist')) return "🌫️"
        return "🌤️" // Default
      }
      
      // Update current weather with NWS data
      setCurrentWeather({
        temperature: currentTemp,
        condition: currentCondition,
        emoji: getWeatherEmoji(currentCondition),
        wind: currentWind,
        humidity: humidity,
        visibility: visibility,
        lastUpdated: new Date().toLocaleTimeString()
      })
      
      // Process forecast data
      const periods = dailyData.properties.periods
      const today = periods[0]
      const tomorrow = periods[1]
      const dayAfter = periods[2]
      
      setForecast([
        {
          day: "Today",
          condition: today.shortForecast,
          emoji: getWeatherEmoji(today.shortForecast),
          high: today.temperature + "°F",
          low: periods[1]?.temperature + "°F" || "N/A"
        },
        {
          day: "Tomorrow",
          condition: tomorrow.shortForecast,
          emoji: getWeatherEmoji(tomorrow.shortForecast),
          high: tomorrow.temperature + "°F",
          low: periods[3]?.temperature + "°F" || "N/A"
        },
        {
          day: dayAfter.name.split(' ')[0], // Extract day name
          condition: dayAfter.shortForecast,
          emoji: getWeatherEmoji(dayAfter.shortForecast),
          high: dayAfter.temperature + "°F",
          low: periods[5]?.temperature + "°F" || "N/A"
        }
      ])
      
      console.log("✅ NWS Weather data updated for Coeur d'Alene:", {
        current: { temp: currentTemp, condition: currentCondition, wind: currentWind },
        forecast: [today.shortForecast, tomorrow.shortForecast, dayAfter.shortForecast]
      })
      
    } catch (error) {
      console.error("❌ Error fetching NWS weather data, using fallback data for Coeur d'Alene:", error)
      
      // Fallback to reasonable weather data for Coeur d'Alene, Idaho if NWS API fails
      console.log("🔄 Using fallback weather data for Coeur d'Alene area...")
      
      const coeurDaleneWeatherConditions = [
        { temp: "68°F", condition: "Partly Cloudy", emoji: "⛅", wind: "NW 5 mph", humidity: "45%", visibility: "10 mi" },
        { temp: "72°F", condition: "Mostly Sunny", emoji: "☀️", wind: "W 3 mph", humidity: "35%", visibility: "12 mi" },
        { temp: "65°F", condition: "Overcast", emoji: "☁️", wind: "N 7 mph", humidity: "60%", visibility: "8 mi" },
        { temp: "75°F", condition: "Sunny", emoji: "☀️", wind: "SW 2 mph", humidity: "30%", visibility: "15 mi" },
      ]
      
      const coeurDaleneForecast = [
        [
          { day: "Today", condition: "Partly Cloudy", emoji: "⛅", high: "74°F", low: "48°F" },
          { day: "Tomorrow", condition: "Mostly Sunny", emoji: "☀️", high: "78°F", low: "52°F" },
          { day: "Friday", condition: "Sunny", emoji: "☀️", high: "82°F", low: "55°F" }
        ],
        [
          { day: "Today", condition: "Overcast", emoji: "☁️", high: "68°F", low: "45°F" },
          { day: "Tomorrow", condition: "Light Rain", emoji: "🌦️", high: "62°F", low: "42°F" },
          { day: "Friday", condition: "Partly Cloudy", emoji: "⛅", high: "70°F", low: "47°F" }
        ]
      ]
      
      // Select reasonable conditions for Coeur d'Alene
      const randomCondition = coeurDaleneWeatherConditions[Math.floor(Math.random() * coeurDaleneWeatherConditions.length)]
      const randomForecast = coeurDaleneForecast[Math.floor(Math.random() * coeurDaleneForecast.length)]
      
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
      
      console.log("✅ Fallback weather and forecast data updated for Coeur d'Alene:", { current: randomCondition, forecast: randomForecast })
    } finally {
      setIsLoadingWeather(false)
    }
  }

  useEffect(() => {
    const fetchLakeConditions = async () => {
      setIsLoadingLakeConditions(true)
      setLakeConditionsError(null)
      const externalLakeUrl = "https://lakemonster.com/lake/ID/Lake-Coeur-d'-Alene-167"

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

        // Log the debug HTML to see what we're actually getting
        if (data.debugHtml) {
          console.log("🔍 Debug HTML snippet:", data.debugHtml)
        }

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
                IDAHO
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
              Premium apparel inspired by {lakeInfo.name}'s unique charm.
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
                          {(actualIndex === 0 || actualIndex === 1 || actualIndex === 2 || actualIndex === 3 || actualIndex === 4 || actualIndex === 5 || actualIndex === 6 || actualIndex === 7 || actualIndex === 8 || actualIndex === 9 || actualIndex === 10 || actualIndex === 11 || actualIndex === 12 || actualIndex === 13 || actualIndex === 14) && (
                            <Image
                              src={lakeInfo.heroImage}
                              alt="CDA Background"
                              fill
                              className="object-cover"
                            />
                          )}
                          <Image
                            src={
                              (actualIndex === 0 
                                ? swimTeeImages[selectedColor[actualIndex] || "Green"]      // CDA Swim Tee
                                : actualIndex === 1 
                                ? sailLongSleeveImages[selectedColor[actualIndex] || "Ivory"]  // CDA Sail Long Sleeve
                                : actualIndex === 2
                                ? swimLongSleeveImages[selectedColor[actualIndex] || "Sea Green"] // CDA Swim Long Sleeve
                                : actualIndex === 3
                                ? poloImages[selectedColor[actualIndex] || "Black"]           // CDA Polo
                                : actualIndex === 4
                                ? cdaWaterskiTeeImages[selectedColor[actualIndex] || "Peony"] // CDA Waterski Tee
                                : actualIndex === 5
                                ? cdaFishTeeImages[selectedColor[actualIndex] || "Sage"] // CDA Fish Tee
                                : actualIndex === 6
                                ? cdaLakeTeeImages[selectedColor[actualIndex] || "White"] // CDA Lake Tee
                                : actualIndex === 7
                                ? cdaSkiTeeImages[selectedColor[actualIndex] || "White Back"] // CDA Ski Tee
                                : actualIndex === 8
                                ? cdaSurfTeeImages[selectedColor[actualIndex] || "Bay Back"] // CDA Surf Tee
                                : actualIndex === 9
                                ? cdaBoardTeeImages[selectedColor[actualIndex] || "Black Back"] // CDA Board Tee
                                : cdaDiveTeeImages[selectedColor[actualIndex] || "Bay Back"]) || "/placeholder.svg?height=800&width=800"
                            }
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                          
                          {/* Click to expand overlay - For featured products with multiple images */}
                          {(actualIndex === 0 || actualIndex === 1 || actualIndex === 2 || actualIndex === 3 || actualIndex === 4 || actualIndex === 5 || actualIndex === 6 || actualIndex === 7 || actualIndex === 8 || actualIndex === 9 || actualIndex === 10 || actualIndex === 11 || actualIndex === 12 || actualIndex === 13 || actualIndex === 14) && (
                            <div 
                              className="absolute inset-0 cursor-pointer z-10 flex items-center justify-center"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                const imageToShow = (actualIndex === 0 
                                  ? swimTeeImages[selectedColor[actualIndex] || "Green"]      // CDA Swim Tee
                                  : actualIndex === 1
                                  ? sailLongSleeveImages[selectedColor[actualIndex] || "Ivory"]  // CDA Sail Long Sleeve
                                  : actualIndex === 2
                                  ? swimLongSleeveImages[selectedColor[actualIndex] || "Sea Green"] // CDA Swim Long Sleeve
                                  : actualIndex === 3
                                  ? poloImages[selectedColor[actualIndex] || "Black"]           // CDA Polo
                                  : actualIndex === 4
                                  ? cdaWaterskiTeeImages[selectedColor[actualIndex] || "Peony"] // CDA Waterski Tee
                                  : actualIndex === 5
                                  ? cdaFishTeeImages[selectedColor[actualIndex] || "Sage"] // CDA Fish Tee
                                  : actualIndex === 6
                                  ? cdaLakeTeeImages[selectedColor[actualIndex] || "White"] // CDA Lake Tee
                                  : actualIndex === 7
                                  ? cdaSkiTeeImages[selectedColor[actualIndex] || "White Back"] // CDA Ski Tee
                                  : actualIndex === 8
                                  ? cdaSurfTeeImages[selectedColor[actualIndex] || "Bay Back"] // CDA Surf Tee
                                  : actualIndex === 9
                                  ? cdaBoardTeeImages[selectedColor[actualIndex] || "Black Back"] // CDA Board Tee
                                  : cdaDiveTeeImages[selectedColor[actualIndex] || "Bay Back"]) || "/placeholder.svg?height=800&width=800";
                                handleImageClick(imageToShow);
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
                          {actualIndex !== 0 && actualIndex !== 1 && actualIndex !== 2 && actualIndex !== 3 && actualIndex !== 4 && actualIndex !== 5 && actualIndex !== 6 && actualIndex !== 7 && actualIndex !== 8 && actualIndex !== 9 && actualIndex !== 10 && actualIndex !== 11 && actualIndex !== 12 && actualIndex !== 13 && actualIndex !== 14 && actualIndex !== 15 && actualIndex !== 16 && actualIndex !== 17 && (
                            <div 
                              className="absolute inset-0 cursor-pointer z-10"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleImageClick(`/placeholder.svg?height=800&width=800&query=${product.imageQuery}`)
                              }}
                            />
                          )}
                          
                          {actualIndex === 0 && (
                            <div className="absolute top-4 left-4">
                              <div className="bg-blue-500/20 backdrop-blur-sm text-blue-200 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-light tracking-wide">
                                FEATURED • {swimTeeColors.indexOf(selectedColor[0] || "Green") + 1} of {swimTeeColors.length}
                              </div>
                            </div>
                          )}

                          {actualIndex === 1 && (
                            <div className="absolute top-4 left-4">
                              <div className="bg-blue-500/20 backdrop-blur-sm text-blue-200 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-light tracking-wide">
                                FEATURED • {sailLongSleeveViews.indexOf(selectedColor[1] || "Ivory") + 1} of {sailLongSleeveViews.length}
                              </div>
                            </div>
                          )}

                          {actualIndex === 2 && (
                            <div className="absolute top-4 left-4">
                              <div className="bg-blue-500/20 backdrop-blur-sm text-blue-200 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-light tracking-wide">
                                FEATURED • {swimLongSleeveColors.indexOf(selectedColor[2] || "Ocean Blue Backside") + 1} of {swimLongSleeveColors.length}
                              </div>
                            </div>
                          )}



                          {actualIndex === 4 && (
                            <div className="absolute top-4 left-4">
                              <div className="bg-blue-500/20 backdrop-blur-sm text-blue-200 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-light tracking-wide">
                                FEATURED • {swimTeeColors.indexOf(selectedColor[4] || "Green") + 1} of {swimTeeColors.length}
                              </div>
                            </div>
                          )}

                          {actualIndex === 5 && (
                            <div className="absolute top-4 left-4">
                              <div className="bg-blue-500/20 backdrop-blur-sm text-blue-200 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-light tracking-wide">
                                FEATURED • {poloColors.indexOf(selectedColor[5] || "Black") + 1} of {poloColors.length}
                              </div>
                            </div>
                          )}

                          {actualIndex === 6 && (
                            <div className="absolute top-4 left-4">
                              <div className="bg-blue-500/20 backdrop-blur-sm text-blue-200 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-light tracking-wide">
                                FEATURED • {cdaWaterskiTeeColors.indexOf(selectedColor[6] || "Peony") + 1} of {cdaWaterskiTeeColors.length}
                              </div>
                            </div>
                          )}

                          {actualIndex === 7 && (
                            <div className="absolute top-4 left-4">
                              <div className="bg-blue-500/20 backdrop-blur-sm text-blue-200 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-light tracking-wide">
                                FEATURED • {cdaFishTeeColors.indexOf(selectedColor[7] || "Sage") + 1} of {cdaFishTeeColors.length}
                              </div>
                            </div>
                          )}

                          {actualIndex === 8 && (
                            <div className="absolute top-4 left-4">
                              <div className="bg-blue-500/20 backdrop-blur-sm text-blue-200 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-light tracking-wide">
                                FEATURED • {cdaLakeTeeColors.indexOf(selectedColor[8] || "White") + 1} of {cdaLakeTeeColors.length}
                              </div>
                            </div>
                          )}

                          {actualIndex === 9 && (
                            <div className="absolute top-4 left-4">
                              <div className="bg-blue-500/20 backdrop-blur-sm text-blue-200 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-light tracking-wide">
                                FEATURED • {cdaSkiTeeColors.indexOf(selectedColor[9] || "White Back") + 1} of {cdaSkiTeeColors.length}
                              </div>
                            </div>
                          )}

                          {actualIndex === 10 && (
                            <div className="absolute top-4 left-4">
                              <div className="bg-blue-500/20 backdrop-blur-sm text-blue-200 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-light tracking-wide">
                                FEATURED • {cdaSurfTeeColors.indexOf(selectedColor[10] || "Bay Back") + 1} of {cdaSurfTeeColors.length}
                              </div>
                            </div>
                          )}

                          {actualIndex === 11 && (
                            <div className="absolute top-4 left-4">
                              <div className="bg-blue-500/20 backdrop-blur-sm text-blue-200 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-light tracking-wide">
                                FEATURED • {cdaBoardTeeColors.indexOf(selectedColor[11] || "Black Back") + 1} of {cdaBoardTeeColors.length}
                              </div>
                            </div>
                          )}

                          {actualIndex === 12 && (
                            <div className="absolute top-4 left-4">
                              <div className="bg-blue-500/20 backdrop-blur-sm text-blue-200 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-light tracking-wide">
                                FEATURED • {cdaDiveTeeColors.indexOf(selectedColor[12] || "Bay Back") + 1} of {cdaDiveTeeColors.length}
                              </div>
                            </div>
                          )}

                          {/* Quick add overlay on hover for non-featured products */}
                          {actualIndex !== 0 && actualIndex !== 1 && actualIndex !== 2 && actualIndex !== 3 && actualIndex !== 4 && actualIndex !== 5 && actualIndex !== 6 && actualIndex !== 7 && actualIndex !== 8 && actualIndex !== 9 && actualIndex !== 10 && actualIndex !== 11 && actualIndex !== 12 && actualIndex !== 13 && (
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
                              {/* Color selection for CDA Swim Tee */}
                              {actualIndex === 0 && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-2">Color:</label>
                                  <div className="flex flex-wrap gap-2">
                                    {swimTeeColors.map((color) => (
                                      <button
                                        key={color}
                                        onClick={() => {
                                          setSelectedColor(prev => ({ ...prev, [actualIndex]: color }))
                                          setCurrentFeaturedImage(swimTeeImages[color])
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

                              {/* Color selection for CDA Sail Long Sleeve */}
                              {actualIndex === 1 && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-2">Color:</label>
                                  <div className="flex flex-wrap gap-2">
                                    {sailLongSleeveViews.map((view) => (
                                      <button
                                        key={view}
                                        onClick={() => {
                                          setSelectedColor(prev => ({ ...prev, [actualIndex]: view }))
                                          setCurrentFeaturedImage(sailLongSleeveImages[view])
                                        }}
                                        className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                                          selectedColor[actualIndex] === view
                                            ? "border-blue-400 bg-blue-400/10 text-blue-400"
                                            : "border-gray-700 hover:border-gray-600 text-gray-300"
                                        }`}
                                      >
                                        {view}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Color selection for CDA Swim Long Sleeve */}
                              {actualIndex === 2 && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-2">Color:</label>
                                  <div className="flex flex-wrap gap-2">
                                    {swimLongSleeveColors.map((color) => (
                                      <button
                                        key={color}
                                        onClick={() => {
                                          setSelectedColor(prev => ({ ...prev, [actualIndex]: color }))
                                          setCurrentFeaturedImage(swimLongSleeveImages[color])
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



                              {/* Color selection for CDA Swim Tee */}
                              {actualIndex === 4 && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-2">Color:</label>
                                  <div className="flex flex-wrap gap-2">
                                    {swimTeeColors.map((color) => (
                                      <button
                                        key={color}
                                        onClick={() => {
                                          setSelectedColor(prev => ({ ...prev, [actualIndex]: color }))
                                          setCurrentFeaturedImage(swimTeeImages[color])
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



                              {/* Color selection for CDA Polo */}
                              {actualIndex === 5 && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-2">Color:</label>
                                  <div className="flex flex-wrap gap-2">
                                    {poloColors.map((color) => (
                                      <button
                                        key={color}
                                        onClick={() => {
                                          setSelectedColor(prev => ({ ...prev, [actualIndex]: color }))
                                          setCurrentFeaturedImage(poloImages[color])
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

                              {/* Color selection for CDA Waterski Tee */}
                              {actualIndex === 8 && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-2">Color & View:</label>
                                  <div className="flex flex-wrap gap-2">
                                    {cdaWaterskiTeeColors.map((color) => (
                                      <button
                                        key={color}
                                        onClick={() => {
                                          setSelectedColor(prev => ({ ...prev, [actualIndex]: color }))
                                          setCurrentFeaturedImage(cdaWaterskiTeeImages[color])
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

                              {/* Color selection for CDA Fish Tee */}
                              {actualIndex === 9 && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-2">Color & View:</label>
                                  <div className="flex flex-wrap gap-2">
                                    {cdaFishTeeColors.map((color) => (
                                      <button
                                        key={color}
                                        onClick={() => {
                                          setSelectedColor(prev => ({ ...prev, [actualIndex]: color }))
                                          setCurrentFeaturedImage(cdaFishTeeImages[color])
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

                              {/* Color selection for CDA Lake Tee */}
                              {actualIndex === 10 && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-2">Color & View:</label>
                                  <div className="flex flex-wrap gap-2">
                                    {cdaLakeTeeColors.map((color) => (
                                      <button
                                        key={color}
                                        onClick={() => {
                                          setSelectedColor(prev => ({ ...prev, [actualIndex]: color }))
                                          setCurrentFeaturedImage(cdaLakeTeeImages[color])
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

                              {/* Color selection for CDA Ski Tee */}
                              {actualIndex === 11 && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-2">Color & View:</label>
                                  <div className="flex flex-wrap gap-2">
                                    {cdaSkiTeeColors.map((color) => (
                                      <button
                                        key={color}
                                        onClick={() => {
                                          setSelectedColor(prev => ({ ...prev, [actualIndex]: color }))
                                          setCurrentFeaturedImage(cdaSkiTeeImages[color])
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

                              {/* Color selection for CDA Surf Tee */}
                              {actualIndex === 12 && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-2">Color & View:</label>
                                  <div className="flex flex-wrap gap-2">
                                    {cdaSurfTeeColors.map((color) => (
                                      <button
                                        key={color}
                                        onClick={() => {
                                          setSelectedColor(prev => ({ ...prev, [actualIndex]: color }))
                                          setCurrentFeaturedImage(cdaSurfTeeImages[color])
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

                              {/* Color selection for CDA Board Tee */}
                              {actualIndex === 13 && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-2">Color & View:</label>
                                  <div className="flex flex-wrap gap-2">
                                    {cdaBoardTeeColors.map((color) => (
                                      <button
                                        key={color}
                                        onClick={() => {
                                          setSelectedColor(prev => ({ ...prev, [actualIndex]: color }))
                                          setCurrentFeaturedImage(cdaBoardTeeImages[color])
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

                              {/* Color selection for CDA Dive Tee */}
                              {actualIndex === 14 && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-2">Color & View:</label>
                                  <div className="flex flex-wrap gap-2">
                                    {cdaDiveTeeColors.map((color) => (
                                      <button
                                        key={color}
                                        onClick={() => {
                                          setSelectedColor(prev => ({ ...prev, [actualIndex]: color }))
                                          setCurrentFeaturedImage(cdaDiveTeeImages[color])
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

                            {/* Product details */}
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

                        {/* Expand details button */}
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

      {/* Live Webcam and Weather Interface */}
      <section className="py-20 bg-gray-900 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Live Webcam Card - Now positioned on the left */}
              <div className="flex-shrink-0">
                {/* Webcam Display - Using AutoVideoPlayer component */}
                <div className="relative overflow-hidden bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm transition-transform duration-500 group-hover:scale-[1.02]" style={{ width: '700px', height: '450px' }}>
                  <AutoVideoPlayer 
                    src="https://api.wetmet.net/client-content/PlayerFrame.php?CAMERA=162-02-01"
                    title="Lake Coeur d'Alene Live Webcam"
                  />
                </div>
              </div>

              {/* Weather Data Card - Now on the right side */}
              <div className="flex-1 space-y-6">
                {/* Current Conditions Card */}
                <div className="group cursor-pointer">
                  <div className="relative h-80 overflow-hidden bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm transition-transform duration-500 group-hover:scale-[1.02] p-6 flex flex-col justify-between">
                    
                    {/* Top section */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-light text-lg tracking-wide">Current Conditions</h3>
                        {isLoadingWeather && (
                          <div className="text-gray-400 text-xs">Updating...</div>
                        )}
                      </div>
                      
                      {/* Main Temperature Display */}
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
                      
                      {/* Last Updated */}
                      <div className="text-xs text-gray-500 mb-4">
                        Last updated: {currentWeather.lastUpdated}
                      </div>
                    </div>

                    {/* Weather Metrics Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="text-gray-400 text-sm font-light">Water Temp</div>
                        <div className="text-xl font-light text-cyan-400">
                          {isLoadingLakeConditions ? '--' : (lakeRealTimeConditions.waterTemp !== 'N/A' ? lakeRealTimeConditions.waterTemp : '68°F')}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-gray-400 text-sm font-light">Wind</div>
                        <div className="text-xl font-light text-gray-200">
                          {currentWeather.wind}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-gray-400 text-sm font-light">Humidity</div>
                        <div className="text-xl font-light text-gray-200">
                          {currentWeather.humidity}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-gray-400 text-sm font-light">Visibility</div>
                        <div className="text-xl font-light text-gray-200">
                          {currentWeather.visibility}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Forecast Card - Secondary style */}
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

              {/* Navigation controls for swim tee images in expanded view */}
              {currentFeaturedImage && swimTeeImageArray.includes(currentFeaturedImage) && (
                <>
                  <button
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-4 rounded-full transition-colors shadow-lg z-40"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (currentFeaturedImage) {
                        const currentColorIndex = swimTeeImageArray.indexOf(currentFeaturedImage)
                        const prevIndex = currentColorIndex === 0 ? swimTeeColors.length - 1 : currentColorIndex - 1
                        const prevColor = swimTeeColors[prevIndex]
                        setCurrentFeaturedImage(swimTeeImages[prevColor])
                        setSelectedColor(prev => ({ ...prev, 0: prevColor }))
                        // Reset zoom when changing images
                        handleZoomReset()
                      }
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
                      if (currentFeaturedImage) {
                        const currentColorIndex = swimTeeImageArray.indexOf(currentFeaturedImage)
                        const nextIndex = (currentColorIndex + 1) % swimTeeColors.length
                        const nextColor = swimTeeColors[nextIndex]
                        setCurrentFeaturedImage(swimTeeImages[nextColor])
                        setSelectedColor(prev => ({ ...prev, 0: nextColor }))
                        // Reset zoom when changing images
                        handleZoomReset()
                      }
                    }}
                    aria-label="Next image"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  {/* Image indicators in expanded view */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3 z-40">
                    {swimTeeColors.map((color, colorIndex) => (
                      <button
                        key={colorIndex}
                        onClick={(e) => {
                          e.stopPropagation()
                          setCurrentFeaturedImage(swimTeeImages[color])
                          setSelectedColor(prev => ({ ...prev, 0: color }))
                          // Reset zoom when changing images
                          handleZoomReset()
                        }}
                        className={`w-4 h-4 rounded-full transition-colors shadow-lg ${
                          swimTeeImages[color] === currentFeaturedImage ? 'bg-blue-500' : 'bg-white/70 hover:bg-white/90'
                        }`}
                        aria-label={`View ${color} tee`}
                      />
                    ))}
                  </div>
                  
                  {/* Image counter */}
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm z-40">
                    {currentFeaturedImage ? swimTeeImageArray.indexOf(currentFeaturedImage) + 1 : 1} of {swimTeeColors.length}
                  </div>
                </>
              )}





              {/* Navigation controls for polo images in expanded view */}
              {currentFeaturedImage && poloImageArray.includes(currentFeaturedImage) && (
                <>
                  <button
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-4 rounded-full transition-colors shadow-lg z-40"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (currentFeaturedImage) {
                        const currentColorIndex = poloColors.indexOf(selectedColor[4] || "Black");
                        const prevIndex = currentColorIndex === 0 ? poloColors.length - 1 : currentColorIndex - 1;
                        const prevColor = poloColors[prevIndex];
                        setCurrentFeaturedImage(poloImages[prevColor]);
                        setSelectedColor(prev => ({ ...prev, 4: prevColor }));
                        handleZoomReset();
                      }
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
                      if (currentFeaturedImage) {
                        const currentColorIndex = poloColors.indexOf(selectedColor[4] || "Black");
                        const nextIndex = (currentColorIndex + 1) % poloColors.length;
                        const nextColor = poloColors[nextIndex];
                        setCurrentFeaturedImage(poloImages[nextColor]);
                        setSelectedColor(prev => ({ ...prev, 4: nextColor }));
                        handleZoomReset();
                      }
                    }}
                    aria-label="Next image"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3 z-40">
                    {poloColors.map((color, colorIndex) => (
                      <button
                        key={colorIndex}
                        onClick={(e) => {
                          e.stopPropagation()
                          setCurrentFeaturedImage(poloImages[color]);
                          setSelectedColor(prev => ({ ...prev, 4: color }));
                          handleZoomReset();
                        }}
                        className={`w-4 h-4 rounded-full transition-colors shadow-lg ${
                          poloImages[color] === currentFeaturedImage ? 'bg-blue-500' : 'bg-white/70 hover:bg-white/90'
                        }`}
                        aria-label={`View ${color} polo`}
                      />
                    ))}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm z-40">
                    {poloColors.indexOf(selectedColor[4] || "Black") + 1} of {poloColors.length}
                  </div>
                </>
              )}

              {/* Navigation controls for sail long sleeve images in expanded view */}
              {currentFeaturedImage && sailLongSleeveImageArray.includes(currentFeaturedImage) && (
                <>
                  <button
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-4 rounded-full transition-colors shadow-lg z-40"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (currentFeaturedImage) {
                        const currentViewIndex = sailLongSleeveViews.indexOf(selectedColor[1] || "Ivory");
                        const prevIndex = currentViewIndex === 0 ? sailLongSleeveViews.length - 1 : currentViewIndex - 1;
                        const prevView = sailLongSleeveViews[prevIndex];
                        setCurrentFeaturedImage(sailLongSleeveImages[prevView]);
                        setSelectedColor(prev => ({ ...prev, 1: prevView }));
                        handleZoomReset();
                      }
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
                      if (currentFeaturedImage) {
                        const currentViewIndex = sailLongSleeveViews.indexOf(selectedColor[1] || "Ivory");
                        const nextIndex = (currentViewIndex + 1) % sailLongSleeveViews.length;
                        const nextView = sailLongSleeveViews[nextIndex];
                        setCurrentFeaturedImage(sailLongSleeveImages[nextView]);
                        setSelectedColor(prev => ({ ...prev, 1: nextView }));
                        handleZoomReset();
                      }
                    }}
                    aria-label="Next image"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3 z-40">
                    {sailLongSleeveViews.map((view, viewIndex) => (
                      <button
                        key={viewIndex}
                        onClick={(e) => {
                          e.stopPropagation()
                          setCurrentFeaturedImage(sailLongSleeveImages[view]);
                          setSelectedColor(prev => ({ ...prev, 1: view }));
                          handleZoomReset();
                        }}
                        className={`w-4 h-4 rounded-full transition-colors shadow-lg ${
                          sailLongSleeveImages[view] === currentFeaturedImage ? 'bg-blue-500' : 'bg-white/70 hover:bg-white/90'
                        }`}
                        aria-label={`View ${view} long sleeve`}
                      />
                    ))}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm z-40">
                    {sailLongSleeveViews.indexOf(selectedColor[1] || "Ivory") + 1} of {sailLongSleeveViews.length}
                  </div>
                </>
              )}

              {/* Navigation controls for swim long sleeve images in expanded view */}
              {currentFeaturedImage && swimLongSleeveImageArray.includes(currentFeaturedImage) && (
                <>
                  <button
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-4 rounded-full transition-colors shadow-lg z-40"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (currentFeaturedImage) {
                        const currentColorIndex = swimLongSleeveColors.indexOf(selectedColor[2] || "Ocean Blue Backside");
                        const prevIndex = currentColorIndex === 0 ? swimLongSleeveColors.length - 1 : currentColorIndex - 1;
                        const prevColor = swimLongSleeveColors[prevIndex];
                        setCurrentFeaturedImage(swimLongSleeveImages[prevColor]);
                        setSelectedColor(prev => ({ ...prev, 2: prevColor }));
                        handleZoomReset();
                      }
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
                      if (currentFeaturedImage) {
                        const currentColorIndex = swimLongSleeveColors.indexOf(selectedColor[2] || "Ocean Blue Backside");
                        const nextIndex = (currentColorIndex + 1) % swimLongSleeveColors.length;
                        const nextColor = swimLongSleeveColors[nextIndex];
                        setCurrentFeaturedImage(swimLongSleeveImages[nextColor]);
                        setSelectedColor(prev => ({ ...prev, 2: nextColor }));
                        handleZoomReset();
                      }
                    }}
                    aria-label="Next image"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3 z-40">
                    {swimLongSleeveColors.map((color, colorIndex) => (
                      <button
                        key={colorIndex}
                        onClick={(e) => {
                          e.stopPropagation()
                          setCurrentFeaturedImage(swimLongSleeveImages[color]);
                          setSelectedColor(prev => ({ ...prev, 2: color }));
                          handleZoomReset();
                        }}
                        className={`w-4 h-4 rounded-full transition-colors shadow-lg ${
                          swimLongSleeveImages[color] === currentFeaturedImage ? 'bg-blue-500' : 'bg-white/70 hover:bg-white/90'
                        }`}
                        aria-label={`View ${color} swim long sleeve`}
                      />
                    ))}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm z-40">
                    {swimLongSleeveColors.indexOf(selectedColor[2] || "Ocean Blue Backside") + 1} of {swimLongSleeveColors.length}
                  </div>
                </>
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
