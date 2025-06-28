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
import { Responsive, MobileOnly, DesktopOnly } from "@/responsive/components/ResponsiveLayout"
import MobileProductGrid from "@/responsive/components/MobileProductGrid"
import MobileNavigation from "@/responsive/components/MobileNavigation"
import MobileShoppingCart from "@/responsive/components/MobileShoppingCart"
import { useMobile } from "@/responsive/hooks/useMobile"

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
    // Try multiple webcam sources - Update with Lindbergh sources
    const webcamUrls = [
      src,
      'http://www.luckylablodge.com/mjpg/video.mjpg',
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
      const response = await fetch('/api/webcam?source=lindbergh', {
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
            src="/images/lindbergh-lake-aerial.jpg"
            alt="Lindbergh Lake placeholder view"
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
            aria-label="Live webcam feed from Lindbergh Lake"
          />
        )}
      </div>
    </div>
  )
}

export default function LindberghPage() {
  const { isMobile } = useMobile()
  
  const lakeInfo = {
    name: "Lindbergh Lake",
    state: "Montana",
    elevation: "4,318 ft",
    gpsCoordinates: "47.4167° N, 113.7167° W",
    maxDepth: "Unknown",
    heroImage: "/images/Lindbergh-Lake-Background.svg",
    icon: "/images/river-icon.png",
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
    // LINDBERGH SWIM TEE
    {
      id: "tee-lindbergh-swim",
      name: "Lindbergh Swim Tee",
      description: "Premium swim t-shirt designed for Lindbergh Lake adventures",
      price: "$33",
      images: [
        "/images/LINDBERGH-SWIM-TEE/Cumin.png",
        "/images/LINDBERGH-SWIM-TEE/True-Navy.png",
        "/images/LINDBERGH-SWIM-TEE/Khaki.png",
        "/images/LINDBERGH-SWIM-TEE/Khaki-Backside.png"
      ],
      colors: [
        { name: "Cumin", hex: "#D97706" },
        { name: "True Navy", hex: "#1E3A8A" },
        { name: "Khaki", hex: "#8B7355" },
        { name: "Khaki Backside", hex: "#8B7355" }
      ],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      details:
        "Premium swim t-shirt designed for Lindbergh Lake adventures. Made with quick-dry technology and UV protection for water activities. Available in cumin, true navy, and khaki colors with front and back designs.",
      featuresList: [
        "Quick-dry performance fabric",
        "UV protection technology",
        "Lindbergh Lake branding",
        "Perfect for swim activities",
        "Available in 4 color options",
        "Comfortable athletic fit",
      ],
    },

    // LINDBERGH CHARLES POCKET TEE
    {
      id: "tee-lindbergh-pocket",
      name: "Lindbergh - Charles Pocket Tee",
      description: "Premium pocket t-shirt honoring the legendary aviator. Available in 4 colors.",
      price: "$33",
      images: [
        "/images/LINDBERGH-CHARLES-LINDBERGH-POCKET-TEE/Black.png",
        "/images/LINDBERGH-CHARLES-LINDBERGH-POCKET-TEE/Black-Front.png",
        "/images/LINDBERGH-CHARLES-LINDBERGH-POCKET-TEE/Maroon.png",
        "/images/LINDBERGH-CHARLES-LINDBERGH-POCKET-TEE/Navy.png"
      ],
      colors: [
        { name: "Black", hex: "#1F2937" },
        { name: "Black Front", hex: "#1F2937" },
        { name: "Maroon", hex: "#7F1D1D" },
        { name: "Navy", hex: "#1E3A8A" }
      ],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      details:
        "Classic pocket t-shirt featuring Charles Lindbergh aviation design. Celebrates the spirit of adventure and pioneering aviation history at Lindbergh Lake. Premium cotton construction with vintage-inspired graphics.",
      featuresList: [
        "Premium cotton blend fabric",
        "Front chest pocket",
        "Charles Lindbergh aviation graphics",
        "Vintage-inspired design",
        "Available in multiple views",
        "Classic fit styling",
      ],
    },

    // LINDBERGH SWIM LONG SLEEVE SHIRT
    {
      id: "longsleeve-lindbergh-swim",
      name: "Lindbergh Swim Long Sleeve Shirt",
      description: "Premium swim long sleeve shirt designed for Lindbergh Lake water activities. Available in 4 colors.",
      price: "$40",
      images: [
        "/images/LINDBERGH-SWIM-LONG-SLEEVE-SHIRT/SEA-FOAM.png",
        "/images/LINDBERGH-SWIM-LONG-SLEEVE-SHIRT/MUSTARD.png",
        "/images/LINDBERGH-SWIM-LONG-SLEEVE-SHIRT/RED.png",
        "/images/LINDBERGH-SWIM-LONG-SLEEVE-SHIRT/RED-FRONTSIDE.png"
      ],
      colors: [
        { name: "Sea Foam", hex: "#6EE7B7" },
        { name: "Mustard", hex: "#F59E0B" },
        { name: "Red", hex: "#DC2626" },
        { name: "Red Frontside", hex: "#DC2626" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      details:
        "Premium swim long sleeve shirt featuring Lindbergh Lake branding. Made with UPF protection and quick-dry technology for extended water activities. Available in sea foam, mustard, red, and red frontside colors.",
      featuresList: [
        "UPF sun protection technology",
        "Quick-dry performance fabric",
        "Lindbergh Lake branding",
        "Perfect for water activities",
        "Available in 4 color options",
        "Comfortable swim fit",
      ],
    },

    // LINDBERGH ADIDAS POLO
    {
      id: "polo-lindbergh-adidas",
      name: "Lindbergh Adidas Polo",
      description: "Premium Adidas polo designed for Lindbergh Lake adventures",
      price: "$58",
      images: [
        "/images/LINDBERGH-ADIDAS-POLO/Front.png",
        "/images/LINDBERGH-ADIDAS-POLO/Front (1).png",
        "/images/LINDBERGH-ADIDAS-POLO/Front (2).png"
      ],
      colors: [
        { name: "Front View", hex: "#1F2937" },
        { name: "Front Alt 1", hex: "#1F2937" },
        { name: "Front Alt 2", hex: "#1F2937" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      details:
        "Premium Adidas polo featuring Lindbergh Lake branding. Made with moisture-wicking technology and classic fit design perfect for both casual wear and active pursuits. Available in multiple front view options showcasing the detailed design.",
      featuresList: [
        "Premium Adidas quality",
        "Moisture-wicking technology",
        "Lindbergh Lake branding",
        "Classic polo fit",
        "Available in 3 views",
        "Perfect for casual and active wear",
      ],
    },

    // LINDBERGH UNDER ARMOUR PERFORMANCE POLO
    {
      id: "polo-lindbergh-performance",
      name: "Lindbergh Under Armour Performance Polo",
      description: "Premium Under Armour polo with moisture-wicking technology for Lindbergh Lake adventures",
      price: "$65",
      images: [
        "/images/LINDBERGH-UNDER-ARMOR-POLO/under-armour-mens-polo-shirt-navy-front-685a41d2b797f.png",
        "/images/LINDBERGH-UNDER-ARMOR-POLO/under-armour-mens-polo-shirt-grey-front-685a41d2b7ab3.png",
        "/images/LINDBERGH-UNDER-ARMOR-POLO/under-armour-mens-polo-shirt-black-front-685a41d2b759d.png"
      ],
      colors: [
        { name: "Navy", hex: "#1E3A8A" },
        { name: "Grey", hex: "#6B7280" },
        { name: "Black", hex: "#000000" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      details:
        "Premium Under Armour polo with moisture-wicking technology for Lindbergh Lake adventures. Advanced fabric technology keeps you cool and dry during water sports, golf, or any lakeside activity. Professional design perfect for both casual and active wear.",
      featuresList: [
        "Under Armour HeatGear® fabric",
        "Advanced moisture-wicking technology",
        "Custom Lindbergh Lake branding",
        "UPF 30+ sun protection",
        "Anti-odor technology",
        "Available in 3 premium colors",
      ],
    },

    // LINDBERGH BOARD TEE
    {
      id: "tee-lindbergh-board",
      name: "Lindbergh Board Tee",
      category: "tees",
      description: "Classic Lindbergh Lake board design tee perfect for mountain lake adventures.",
      price: "$33",
      images: [
        "/images/LINDBERGH-APPAREL/LINDBERGH-BOARD-TEE/Back, Black.png",
        "/images/LINDBERGH-APPAREL/LINDBERGH-BOARD-TEE/Front, Black.png",
        "/images/LINDBERGH-APPAREL/LINDBERGH-BOARD-TEE/Back, Bay.png",
        "/images/LINDBERGH-APPAREL/LINDBERGH-BOARD-TEE/Back, Khaki.png",
        "/images/LINDBERGH-APPAREL/LINDBERGH-BOARD-TEE/Back, True Navy.png",
        "/images/LINDBERGH-APPAREL/LINDBERGH-BOARD-TEE/Back, Watermelon.png",
        "/images/LINDBERGH-APPAREL/LINDBERGH-BOARD-TEE/Back, White.png"
      ],
      colors: [
        { name: "Black", hex: "#000000" },
        { name: "Black Front", hex: "#000000" },
        { name: "Bay", hex: "#7DD3FC" },
        { name: "Khaki", hex: "#8B7355" },
        { name: "True Navy", hex: "#1E3A8A" },
        { name: "Watermelon", hex: "#FB7185" },
        { name: "White", hex: "#FFFFFF" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      details: "Classic Lindbergh Lake board design tee perfect for mountain lake adventures. Made with premium materials and featuring authentic Lindbergh Lake boarding graphics.",
      featuresList: [
        "Premium board design graphics",
        "Montana mountain lake inspired",
        "Classic comfort fit",
        "7 color options available",
        "Lindbergh Lake boarding tribute"
      ]
    },

    // LINDBERGH DIVE TEE
    {
      id: "tee-lindbergh-dive",
      name: "Lindbergh Dive Tee",
      category: "tees",
      description: "Dive deep into Lindbergh Lake adventures with this premium diving-inspired tee.",
      price: "$33",
      images: [
        "/images/LINDBERGH-APPAREL/LINDBERGH-DIVE-TEE/Back, True Navy.png",
        "/images/LINDBERGH-APPAREL/LINDBERGH-DIVE-TEE/Back, Bay.png",
        "/images/LINDBERGH-APPAREL/LINDBERGH-DIVE-TEE/Back, Black.png",
        "/images/LINDBERGH-APPAREL/LINDBERGH-DIVE-TEE/Back, Khaki.png",
        "/images/LINDBERGH-APPAREL/LINDBERGH-DIVE-TEE/Back, Watermelon.png",
        "/images/LINDBERGH-APPAREL/LINDBERGH-DIVE-TEE/Back, White.png"
      ],
      colors: [
        { name: "True Navy", hex: "#1E3A8A" },
        { name: "Bay", hex: "#7DD3FC" },
        { name: "Black", hex: "#000000" },
        { name: "Khaki", hex: "#8B7355" },
        { name: "Watermelon", hex: "#FB7185" },
        { name: "White", hex: "#FFFFFF" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      details: "Dive deep into Lindbergh Lake adventures with this premium diving-inspired tee. Features authentic diving graphics celebrating Montana's pristine underwater world.",
      featuresList: [
        "Premium diving design graphics",
        "Montana diving inspired",
        "Premium comfort fit",
        "6 color options available",
        "Lindbergh Lake diving tribute"
      ]
    },

    // LINDBERGH FISH TEE
    {
      id: "tee-lindbergh-fish-apparel",
      name: "Lindbergh Fish Tee",
      category: "tees",
      description: "Show your love for Lindbergh Lake fishing with this angler-inspired design.",
      price: "$33",
      images: [
        "/images/LINDBERGH-APPAREL/LINDBERGH-FISH-TEE/Front, Sage.png",
        "/images/LINDBERGH-APPAREL/LINDBERGH-FISH-TEE/Front, Bay.png",
        "/images/LINDBERGH-APPAREL/LINDBERGH-FISH-TEE/Front, Black.png",
        "/images/LINDBERGH-APPAREL/LINDBERGH-FISH-TEE/Front, Khaki.png",
        "/images/LINDBERGH-APPAREL/LINDBERGH-FISH-TEE/Front, True Navy.png",
        "/images/LINDBERGH-APPAREL/LINDBERGH-FISH-TEE/Front, Watermelon.png",
        "/images/LINDBERGH-APPAREL/LINDBERGH-FISH-TEE/Back, Black.png"
      ],
      colors: [
        { name: "Sage", hex: "#87A96B" },
        { name: "Bay", hex: "#7DD3FC" },
        { name: "Black", hex: "#000000" },
        { name: "Khaki", hex: "#8B7355" },
        { name: "True Navy", hex: "#1E3A8A" },
        { name: "Watermelon", hex: "#FB7185" },
        { name: "Black Back", hex: "#000000" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      details: "Show your love for Lindbergh Lake fishing with this angler-inspired design. Perfect for fishing enthusiasts who appreciate Montana's pristine mountain waters.",
      featuresList: [
        "Premium fishing design graphics",
        "Montana angler inspired",
        "Premium comfort fit",
        "7 color options available",
        "Lindbergh Lake fishing tribute"
      ]
    },

    // LINDBERGH LAKE TEE
    {
      id: "tee-lindbergh-lake-apparel",
      name: "Lindbergh Lake Tee",
      category: "tees",
      description: "Classic Lindbergh Lake tee celebrating Montana's pristine mountain waters.",
      price: "$33",
      images: [
        "/images/LINDBERGH-APPAREL/LINDBERGH-LAKE-TEE/Front, Bay.png",
        "/images/LINDBERGH-APPAREL/LINDBERGH-LAKE-TEE/Front, Black.png",
        "/images/LINDBERGH-APPAREL/LINDBERGH-LAKE-TEE/Front, Khaki.png",
        "/images/LINDBERGH-APPAREL/LINDBERGH-LAKE-TEE/Front, True Navy.png",
        "/images/LINDBERGH-APPAREL/LINDBERGH-LAKE-TEE/Front, Watermelon.png",
        "/images/LINDBERGH-APPAREL/LINDBERGH-LAKE-TEE/Front, White.png"
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
      details: "Classic Lindbergh Lake tee celebrating Montana's pristine mountain waters. The perfect way to show your love for this beautiful Montana destination.",
      featuresList: [
        "Classic lake design graphics", 
        "Montana mountain waters tribute",
        "Premium comfort fit",
        "6 color options available",
        "Lindbergh Lake celebration"
      ]
    },

    // LINDBERGH SKI TEE
    {
      id: "tee-lindbergh-ski-apparel",
      name: "Lindbergh Ski Tee",
      category: "tees",
      description: "Celebrate Lindbergh Lake's winter sports with this ski-inspired design.",
      price: "$33",
      images: [
        "/images/LINDBERGH-APPAREL/LINDBERGH-SKI-TEE/Back, Watermelon.png",
        "/images/LINDBERGH-APPAREL/LINDBERGH-SKI-TEE/Back, Bay.png",
        "/images/LINDBERGH-APPAREL/LINDBERGH-SKI-TEE/Back, Black.png",
        "/images/LINDBERGH-APPAREL/LINDBERGH-SKI-TEE/Back, Khaki.png",
        "/images/LINDBERGH-APPAREL/LINDBERGH-SKI-TEE/Back, True Navy.png",
        "/images/LINDBERGH-APPAREL/LINDBERGH-SKI-TEE/Back, White.png"
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
      details: "Celebrate Lindbergh Lake's winter sports with this ski-inspired design. Perfect for ski enthusiasts who love Montana's pristine mountain waters.",
      featuresList: [
        "Premium ski design graphics",
        "Montana winter sports tribute",
        "Premium comfort fit", 
        "6 color options available",
        "Lindbergh Lake ski celebration"
      ]
    },

    // LINDBERGH SURF TEE
    {
      id: "tee-lindbergh-surf-apparel",
      name: "Lindbergh Surf Tee",
      category: "tees",
      description: "Surf's up at Lindbergh Lake! Classic surf-inspired design for mountain lake lovers.",
      price: "$33",
      images: [
        "/images/LINDBERGH-APPAREL/LINDBERGH-SURF-TEE/Back, White.png",
        "/images/LINDBERGH-APPAREL/LINDBERGH-SURF-TEE/Back, Bay.png",
        "/images/LINDBERGH-APPAREL/LINDBERGH-SURF-TEE/Back, Black.png",
        "/images/LINDBERGH-APPAREL/LINDBERGH-SURF-TEE/Back, Khaki.png",
        "/images/LINDBERGH-APPAREL/LINDBERGH-SURF-TEE/Back, True Navy.png",
        "/images/LINDBERGH-APPAREL/LINDBERGH-SURF-TEE/Back, Watermelon.png"
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
      details: "Surf's up at Lindbergh Lake! Classic surf-inspired design for mountain lake lovers. Perfect for those who bring the surf vibe to Montana's mountains.",
      featuresList: [
        "Premium surf design graphics",
        "Mountain lake surf inspired",
        "Premium comfort fit",
        "6 color options available", 
        "Lindbergh Lake surf tribute"
      ]
    },

    // LINDBERGH WATERSKI TEE
    {
      id: "tee-lindbergh-waterski",
      name: "Lindbergh Waterski Tee",
      category: "tees",
      description: "Premium waterski t-shirt celebrating Lindbergh Lake's legendary water sports culture with front and back design views.",
      price: "$33",
      images: [
        "/images/LINDBERGH-APPAREL/LINDBERGH-WATERSKI-TEE/Back, Midnight.png",
        "/images/LINDBERGH-APPAREL/LINDBERGH-WATERSKI-TEE/Front, Midnight.png",
        "/images/LINDBERGH-APPAREL/LINDBERGH-WATERSKI-TEE/Front, Peony.png",
        "/images/LINDBERGH-APPAREL/LINDBERGH-WATERSKI-TEE/Back, Peony.png",
        "/images/LINDBERGH-APPAREL/LINDBERGH-WATERSKI-TEE/Front, Black.png",
        "/images/LINDBERGH-APPAREL/LINDBERGH-WATERSKI-TEE/Back, Black.png",
        "/images/LINDBERGH-APPAREL/LINDBERGH-WATERSKI-TEE/Front, Topaz Blue.png",
        "/images/LINDBERGH-APPAREL/LINDBERGH-WATERSKI-TEE/Back, Topaz Blue.png",
        "/images/LINDBERGH-APPAREL/LINDBERGH-WATERSKI-TEE/Front, Burnt Orange.png",
        "/images/LINDBERGH-APPAREL/LINDBERGH-WATERSKI-TEE/Back, Burnt Orange.png"
      ],
      colors: [
        { name: "Midnight Back", hex: "#1E293B" },
        { name: "Midnight", hex: "#1E293B" },
        { name: "Peony", hex: "#FB7185" },
        { name: "Peony Back", hex: "#FB7185" },
        { name: "Black", hex: "#000000" },
        { name: "Black Back", hex: "#000000" },
        { name: "Topaz Blue", hex: "#0EA5E9" },
        { name: "Topaz Blue Back", hex: "#0EA5E9" },
        { name: "Burnt Orange", hex: "#EA580C" },
        { name: "Burnt Orange Back", hex: "#EA580C" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      details: "Premium waterski t-shirt celebrating Lindbergh Lake's legendary water sports culture. Features exclusive front and back design views showcasing Montana's premier waterski destination with pristine mountain lake waters.",
      featuresList: [
        "Premium waterski design graphics",
        "Front and back view options",  
        "5 unique color combinations",
        "Montana mountain lake inspired",
        "Lindbergh waterski tribute",
        "Premium comfort fit"
      ]
    },
  ]

  const { addToCart, setIsCartOpen, getCartItemCount } = useCart()
  const [selectedSize, setSelectedSize] = useState<{ [key: number]: string }>({})
  const [selectedColor, setSelectedColor] = useState<{ [key: number]: string }>({ 
    0: "Cumin",        // Lindbergh Swim Tee
    1: "Black",        // Lindbergh Charles Pocket Tee
    2: "Sea Foam",     // Lindbergh Swim Long Sleeve
    3: "Front View",   // Lindbergh Adidas Polo
    4: "Navy",         // Lindbergh Under Armour Polo
    5: "Black",        // Lindbergh Board Tee
    6: "True Navy",    // Lindbergh Dive Tee
    7: "Sage",         // Lindbergh Fish Tee
    8: "Bay",          // Lindbergh Lake Tee
    9: "Watermelon",   // Lindbergh Ski Tee
    10: "White",       // Lindbergh Surf Tee
    11: "Midnight Back" // Lindbergh Waterski Tee
  })
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null)
  const [expandedImage, setExpandedImage] = useState(false)
  const [currentFeaturedImage, setCurrentFeaturedImage] = useState(apparelProducts[0].images[0])

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

  // Image navigation state
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: string]: number }>({})





  // Zoom state for expanded images
  const [imageZoom, setImageZoom] = useState(1)
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const handleAddToCart = (product: any, index: number) => {
    const size = selectedSize[index]
    const color = selectedColor[index]
    
    if (!size) {
      alert("Please select a size first")
      return
    }
    
    // For all products, require color selection
    if (!color) {
      alert("Please select a color first")
      return
    }
    
    // Get the product image based on selected color
    const colorIndex = product.colors.findIndex((c: any) => c.name === color)
    const productImage = product.images[colorIndex >= 0 ? colorIndex : 0] || product.images[0]
    
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

  // Fetch current weather data
  const fetchCurrentWeather = async () => {
    setIsLoadingWeather(true)
    try {
      console.log("🌤️ Fetching current weather conditions from NWS...")
      
      // Use National Weather Service API for Lindbergh Lake area
      // Coordinates: 47.39289°N, -113.73034°W (near Condon Work Center)
      const nwsApiUrl = "https://api.weather.gov/points/47.39289,-113.73034"
      
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
            
            // Get current conditions from the first hourly period
            const currentHour = hourlyData.properties.periods[0]
            const currentTemp = currentHour.temperature
            const currentWind = `${currentHour.windDirection} ${currentHour.windSpeed}`
            const currentConditionText = currentHour.shortForecast
            
            // Function to get appropriate emoji based on weather condition
            const getWeatherEmoji = (condition: string) => {
              const lowerCondition = condition.toLowerCase()
              if (lowerCondition.includes('sunny') || lowerCondition.includes('clear')) return '☀️'
              if (lowerCondition.includes('partly')) return '⛅'
              if (lowerCondition.includes('cloudy') || lowerCondition.includes('overcast')) return '☁️'
              if (lowerCondition.includes('rain') || lowerCondition.includes('shower')) return '🌧️'
              if (lowerCondition.includes('storm')) return '⛈️'
              if (lowerCondition.includes('snow')) return '❄️'
              if (lowerCondition.includes('fog')) return '🌫️'
              return '⛅' // Default
            }
            
            setCurrentWeather({
              temperature: `${currentTemp}°`,
              condition: currentConditionText,
              emoji: getWeatherEmoji(currentConditionText),
              wind: currentWind,
              humidity: `${currentHour.relativeHumidity?.value || 45}%`,
              visibility: "10 mi",
              lastUpdated: new Date().toLocaleTimeString()
            })
            
            // Process forecast data (next 3 days)
            const dailyPeriods = forecastData.properties.periods.filter((p: any) => p.isDaytime).slice(0, 3)
            const nightPeriods = forecastData.properties.periods.filter((p: any) => !p.isDaytime).slice(0, 3)
            
            const newForecast = dailyPeriods.map((day: any, index: number) => ({
              day: index === 0 ? "Today" : day.name,
              condition: day.shortForecast,
              emoji: getWeatherEmoji(day.shortForecast),
              high: `${day.temperature}°`,
              low: nightPeriods[index] ? `${nightPeriods[index].temperature}°` : "--°"
            }))
            
            setForecast(newForecast)
            console.log("✅ Weather data from NWS:", { current: currentWeather, forecast: newForecast })
          }
        }
      } catch (nwsError) {
        console.log("⚠️ NWS API failed, using fallback data")
        // Keep the existing simulated data as fallback
      }
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
      const externalLakeUrl = "https://lakemonster.com/lake/MT/Lindbergh-Lake-2471"

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

  // Set initial time after component mounts to prevent hydration mismatch
  useEffect(() => {
    setCurrentWeather(prev => ({
      ...prev,
      lastUpdated: new Date().toLocaleTimeString()
    }))
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
      {/* Mobile Navigation */}
      <MobileOnly>
        <MobileNavigation onCartOpen={() => setIsCartOpen(true)} />
      </MobileOnly>
      
      <DesktopOnly>
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
              </div>
            </div>
          </div>
        </header>
      </DesktopOnly>

      {/* Mobile Hero */}
      <MobileOnly>
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src={lakeInfo.heroImage || "/placeholder.svg"}
              alt={`${lakeInfo.name} Aerial View`}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
          </div>
          <div className="relative z-20 text-center px-4">
            <h1 className="text-3xl font-light tracking-[0.2em] text-white mb-2">
              {lakeInfo.name.toUpperCase()}
            </h1>
            <h2 className="text-xl font-light tracking-[0.2em] text-white mb-4">
              MONTANA
            </h2>
            <div className="w-20 h-20 mx-auto mb-4">
              <Image
                src={lakeInfo.icon || "/placeholder.svg"}
                alt={lakeInfo.name}
                width={80}
                height={80}
                className="w-full h-full object-contain brightness-0 saturate-100 invert-0 sepia-0 hue-rotate-180 contrast-200"
                style={{ filter: 'brightness(0) saturate(100%) invert(65%) sepia(98%) saturate(3207%) hue-rotate(163deg) brightness(101%) contrast(101%)' }}
              />
            </div>
            <p className="text-xs text-gray-300 tracking-wide px-2">
              Elevation: {lakeInfo.elevation}<br />
              GPS: {lakeInfo.gpsCoordinates}<br />
              Max Depth: {lakeInfo.maxDepth}
            </p>
          </div>
        </section>
      </MobileOnly>

      {/* Desktop Hero */}
      <DesktopOnly>
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src={lakeInfo.heroImage || "/placeholder.svg"}
              alt={`${lakeInfo.name} Aerial View`}
              fill
              className="object-cover"
              priority
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
                  MONTANA
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
      </DesktopOnly>

      <Responsive
        mobile={
          <section className="py-12 bg-gray-900">
            <div className="text-center mb-8 px-4">
              <h2 className="text-2xl font-light mb-2 tracking-wide">
                {lakeInfo.name.toUpperCase()}<br />APPAREL
              </h2>
              <p className="text-sm text-gray-400 font-light">
                Premium apparel inspired by {lakeInfo.name}'s pristine wilderness.
              </p>
            </div>
            <MobileProductGrid 
              products={apparelProducts} 
              onImageClick={handleImageClick}
            />
          </section>
        }
        desktop={
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
                          {/* Background image for all apparel products */}
                          {(actualIndex >= 0 && actualIndex <= 14) && (
                          <Image
                            src={lakeInfo.heroImage}
                            alt="Lindbergh Background"
                            fill
                            className="object-cover"
                          />
                          )}
                          <Image
                            src={product.images[selectedColor[actualIndex] ? product.colors.findIndex(c => c.name === selectedColor[actualIndex]) : 0] || product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                          
                          {/* Click to expand overlay for featured products (swim hoodie, swim tee, swim long sleeve, water ski tee, charles lindbergh pocket tee, ski community long sleeve, mens swimwear, and montana kiss swimsuit) */}
                          {(actualIndex === 0 || actualIndex === 1 || actualIndex === 2 || actualIndex === 3 || actualIndex === 4 || actualIndex === 5 || actualIndex === 6 || actualIndex === 7 || actualIndex === 8) && (
                            <div 
                              className="absolute inset-0 cursor-pointer z-10 flex items-center justify-center"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                const imageToShow = product.images[selectedColor[actualIndex] ? product.colors.findIndex(c => c.name === selectedColor[actualIndex]) : 0] || product.images[0];
                                handleImageClick(imageToShow)
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
                          {actualIndex > 5 && (
                            <div 
                              className="absolute inset-0 cursor-pointer z-10"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleImageClick(product.images[0])
                              }}
                            />
                          )}
                          
                          <div className="absolute top-4 left-4">
                            <div className="bg-blue-500/20 backdrop-blur-sm text-blue-200 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-light tracking-wide">
                              FEATURED • {(product.colors.findIndex(c => c.name === selectedColor[actualIndex]) + 1) || 1} of {product.colors.length}
                            </div>
                          </div>

                          {/* Quick add overlay on hover for non-featured products */}
                          {actualIndex !== 0 && actualIndex !== 1 && actualIndex !== 2 && actualIndex !== 3 && actualIndex !== 4 && actualIndex !== 5 && actualIndex !== 6 && actualIndex !== 7 && actualIndex !== 8 && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                              <button 
                                className="bg-blue-500/90 backdrop-blur-sm text-white px-6 py-2 rounded-full text-sm font-medium tracking-wide hover:bg-blue-400 transition-colors shadow-lg shadow-blue-500/30"
                                onClick={(e) => {
                                  e.stopPropagation()
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

                        {expandedProduct === actualIndex && (
                          <div className="mt-6 space-y-4 animate-in slide-in-from-top-4 duration-300">
                            <div className="space-y-3">
                              {/* Color/View selection for all products */}
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Color:</label>
                                <div className="flex flex-wrap gap-2">
                                  {product.colors.map((color: any) => (
                                    <button
                                      key={color.name}
                                      onClick={() => {
                                        setSelectedColor(prev => ({ ...prev, [actualIndex]: color.name }))
                                        const colorIndex = product.colors.findIndex((c: any) => c.name === color.name)
                                        setCurrentFeaturedImage(product.images[colorIndex >= 0 ? colorIndex : 0] || product.images[0])
                                      }}
                                      className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                                        selectedColor[actualIndex] === color.name
                                          ? "border-blue-400 bg-blue-400/10 text-blue-400"
                                          : "border-gray-700 hover:border-gray-600 text-gray-300"
                                      }`}
                                    >
                                      {color.name}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              
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
        }
      />

      <section className="py-20 bg-gray-900 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="flex-shrink-0">
                <div className="relative overflow-hidden bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm transition-transform duration-500 group-hover:scale-[1.02]" style={{ width: '700px', height: '450px' }}>
                  <AutoVideoPlayer 
                    src="http://www.luckylablodge.com/mjpg/video.mjpg"
                    title="Lindbergh Lake Live Webcam"
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
                          {isLoadingLakeConditions ? '--' : (lakeRealTimeConditions.waterTemp !== 'N/A' ? lakeRealTimeConditions.waterTemp : '58°F')}
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
              
              {/* Image navigation removed - now using simplified modal */}
            </div>
          </div>
        </div>
      )}
      
      {/* Shopping Cart - Responsive */}
      <DesktopOnly>
        <ShoppingCartSidebar />
      </DesktopOnly>
      <MobileOnly>
        <MobileShoppingCart />
      </MobileOnly>
    </div>
  )
} 