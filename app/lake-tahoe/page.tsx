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

// --- Webcam Player (mirrors CDA logic) ------------------------------------
const AutoVideoPlayer = ({ src, title }: { src: string; title: string }) => {
  const [showFallback, setShowFallback] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isRetrying, setIsRetrying] = useState(false)

  const openInNewWindow = () => {
    const webcamUrls = [
      "https://portal.hdontap.com/s/embed/?stream=northtahoepud_ttv-TOPIA", // North Tahoe PUD webcam
      "https://www.youtube.com/embed/_5Kx5bL_0jc?autoplay=1&mute=1&loop=1&playlist=_5Kx5bL_0jc", // Commons Beach cam
      "https://www.youtube.com/watch?v=_5Kx5bL_0jc",
      "https://tahoetv.com/lake-tahoe-webcams/",
      "https://www.californiabeaches.com/attraction/lake-tahoe-webcams/",
    ]
    webcamUrls.forEach((url, i) => {
      setTimeout(() => {
        window.open(url, `webcam_${i}`, "width=800,height=600,scrollbars=yes,resizable=yes")
      }, i * 500)
    })
  }

  const handleIframeLoad = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
    setIsLoaded(true)
    setErrorMessage(null)
    const iframe = e.currentTarget
    try {
      if (iframe.contentDocument?.body?.innerHTML === "") {
        setShowFallback(true)
        setErrorMessage("Webcam content unavailable")
      }
    } catch {
      /* cross-origin, ignore */
    }
  }

  const handleIframeError = () => {
    setShowFallback(true)
    setErrorMessage("Failed to load webcam feed")
  }

  const retryWebcam = async () => {
    setIsRetrying(true)
    setErrorMessage(null)
    setShowFallback(false)
    setIsLoaded(false)
    try {
      const res = await fetch("/api/webcam?source=laketahoe")
      if (!res.ok) throw new Error("Retry failed")
      setShouldLoad(false)
      setTimeout(() => setShouldLoad(true), 100)
    } catch (err) {
      setShowFallback(true)
      setErrorMessage(err instanceof Error ? err.message : "Retry failed")
    } finally {
      setIsRetrying(false)
    }
  }

  // Lazy load
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShouldLoad(true)
        obs.disconnect()
      }
    }, { threshold: 0.1 })
    const el = document.getElementById("webcam-container")
    if (el) obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // ----- Fallback UI identical to CDA page --------------------------------
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
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            openInNewWindow()
          }
        }}
      >
        <div className="absolute inset-0">
          <Image
            src="/images/lake-tahoe-placeholder.jpg"
            alt="Lake Tahoe placeholder view"
            fill
            className="object-cover opacity-70 transition-transform duration-500 group-hover:scale-105"
            priority={false}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-black/70 backdrop-blur-sm rounded-lg p-6 max-w-sm">
            <div className="text-red-400 mb-3">
              <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            </div>
            <h3 className="text-white font-medium mb-2">Webcam Unavailable</h3>
            {errorMessage && <p className="text-gray-300 text-sm mb-4">{errorMessage}</p>}
            <div className="space-y-2">
              <button onClick={(e) => { e.stopPropagation(); retryWebcam() }} disabled={isRetrying} className="bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full">
                {isRetrying ? "Retrying..." : "Retry Connection"}
              </button>
              <button onClick={openInNewWindow} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full">
                Open Direct Link
              </button>
            </div>
          </div>
        </div>
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isHovered && !errorMessage ? "opacity-100" : "opacity-0"}`}>
          <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 border border-white/20 hover:bg-white/20 transition-colors"><svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>
        </div>
      </div>
    )
  }

  // Normal iframe render
  return (
    <div id="webcam-container" className="relative w-full h-full overflow-hidden group" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {!isLoaded && <div className="absolute inset-6 bg-gray-900 rounded-lg flex items-center justify-center"><div className="text-white font-light">Loading live feed...</div></div>}
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
            style={{ objectFit: "cover", border: "none", outline: "none", backgroundColor: "transparent" }}
            aria-label="Live webcam feed from Lake Tahoe"
          />
        )}
      </div>
    </div>
  )
}

// -------------------------------------------------------------------------
export default function LakeTahoePage() {
  const lakeInfo = {
    name: "Lake Tahoe",
    state: "California / Nevada",
    heroImage: "/images/Lake-Tahoe.svg",
    icon: "/images/laketahoeicon.svg",
    gpsCoordinates: "39.10° N, 120.03° W",
    elevation: "6,225 ft",
    maxDepth: "1,645 ft",
    description: "A pristine alpine lake famed for its crystal-clear waters and dramatic Sierra Nevada backdrop, offering year-round adventure.",
    features: [
      "Over 70 miles of shoreline",
      "Average clarity of 70 ft",
      "World-class skiing & beaches",
      "Straddles two states",
      "Year-round outdoor recreation",
    ],
    badgeText: "SIERRA NEVADA",
    badgeIcon: "/images/california-icon.png",
    heroGradient: "from-blue-700 to-blue-800", // not used but kept
  }

  const apparelProducts = [
    {
      id: "tahoe-kings-beach-tee",
      name: "Lake Tahoe Kings Beach T-Shirt",
      category: "tees",
      description: "Premium t-shirt celebrating Lake Tahoe's iconic Kings Beach destination.",
      price: 48,
      images: [
        "/images/LAKE-TAHOE-KINGS-BEACH/ISLAND-GREEN-FRONT.png",
        "/images/LAKE-TAHOE-KINGS-BEACH/ISLAND-GREEN-BACK.png",
        "/images/LAKE-TAHOE-KINGS-BEACH/ISLAND-REEF-FRONT.png",
        "/images/LAKE-TAHOE-KINGS-BEACH/ISLAND-REEF-BACK.png",
        "/images/LAKE-TAHOE-KINGS-BEACH/BUTTER-FRONT.png",
        "/images/LAKE-TAHOE-KINGS-BEACH/BUTTER-BACK.png"
      ],
      colors: [
        { name: "Island Green", hex: "#059669" },
        { name: "Island Reef", hex: "#0891B2" },
        { name: "Butter", hex: "#F59E0B" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      lake: "Lake Tahoe",
      details: "Celebrate Lake Tahoe's Kings Beach with this premium t-shirt featuring custom north shore design. Available in three stunning colorways inspired by Tahoe's natural beauty.",
      featuresList: [
        "Premium cotton blend for comfort",
        "Lake Tahoe Kings Beach custom design",
        "Soft hand feel and comfortable fit", 
        "Pre-shrunk for lasting size",
        "Three unique colorway options"
      ]
    },
    {
      id: "tahoe-surf-tee",
      name: "Lake Tahoe Surf Tee",
      category: "tees",
      description: "Classic surf-inspired tee featuring Lake Tahoe's legendary waters and mountain backdrop.",
      price: 33,
      images: [
        "/images/LAKE-TAHOE-SURF-TEE/BLACK-BACK.png",
        "/images/LAKE-TAHOE-SURF-TEE/BLACK-FRONT.png",
        "/images/LAKE-TAHOE-SURF-TEE/KHAKI-FRONT.png",
        "/images/LAKE-TAHOE-SURF-TEE/KHAKI-BACK.png",
        "/images/LAKE-TAHOE-SURF-TEE/WHITE-FRONT.png",
        "/images/LAKE-TAHOE-SURF-TEE/WHITE-BACK.png"
      ],
      colors: [
        { name: "Black", hex: "#000000" },
        { name: "Khaki", hex: "#92400E" },
        { name: "White", hex: "#FFFFFF" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      lake: "Lake Tahoe",
      details: "Embrace the surf culture of Lake Tahoe with this premium tee featuring custom Tahoe surf design. Perfect for those who love the alpine lake's unique blend of mountain and water adventures.",
      featuresList: [
        "100% premium cotton construction",
        "Custom Lake Tahoe surf artwork",
        "Comfortable relaxed fit",
        "Durable screen-printed graphics",
        "Three versatile color options"
      ]
    },
    {
      id: "tahoe-board-tee",
      name: "Tahoe Board Tee",
      category: "tees",
      description: "Classic Tahoe board design tee perfect for alpine lake adventures and mountain style.",
      price: 33,
      images: [
        "/images/TAHOE-APPAREL/TAHOE-BOARD-TEE/Back, True Navy.png",
        "/images/TAHOE-APPAREL/TAHOE-BOARD-TEE/Front, Khaki.png",
        "/images/TAHOE-APPAREL/TAHOE-BOARD-TEE/Back, Bay.png",
        "/images/TAHOE-APPAREL/TAHOE-BOARD-TEE/Back, Black.png",
        "/images/TAHOE-APPAREL/TAHOE-BOARD-TEE/Back, Khaki.png",
        "/images/TAHOE-APPAREL/TAHOE-BOARD-TEE/Back, Watermelon.png",
        "/images/TAHOE-APPAREL/TAHOE-BOARD-TEE/Back, White.png"
      ],
      colors: [
        { name: "True Navy", hex: "#1E3A8A" },
        { name: "Khaki", hex: "#8B7355" },
        { name: "Bay", hex: "#7DD3FC" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      lake: "Lake Tahoe",
      details: "Classic board design celebrating Lake Tahoe's action sports culture. Perfect for those who live for the mountain lake lifestyle with premium cotton construction.",
      featuresList: [
        "Premium cotton blend construction",
        "Lake Tahoe board sports design",
        "True Navy back view featured",
        "Comfortable athletic fit",
        "Multiple color options available"
      ]
    },
    {
      id: "tahoe-dive-tee",
      name: "Tahoe Dive Tee",
      category: "tees",
      description: "Dive deep into Lake Tahoe's crystal-clear alpine waters with this premium diving-inspired tee.",
      price: 33,
      images: [
        "/images/TAHOE-APPAREL/TAHOE-DIVE-TEE/Back, Bay.png",
        "/images/TAHOE-APPAREL/TAHOE-DIVE-TEE/Front, Khaki.png",
        "/images/TAHOE-APPAREL/TAHOE-DIVE-TEE/Back, Black.png",
        "/images/TAHOE-APPAREL/TAHOE-DIVE-TEE/Back, Khaki.png",
        "/images/TAHOE-APPAREL/TAHOE-DIVE-TEE/Back, True Navy.png",
        "/images/TAHOE-APPAREL/TAHOE-DIVE-TEE/Back, Watermelon.png",
        "/images/TAHOE-APPAREL/TAHOE-DIVE-TEE/Back, White.png"
      ],
      colors: [
        { name: "Bay", hex: "#7DD3FC" },
        { name: "Khaki", hex: "#8B7355" },
        { name: "Black", hex: "#000000" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      lake: "Lake Tahoe",
      details: "Premium diving-inspired tee celebrating Lake Tahoe's legendary clarity and depth. Features Bay color back view highlighting the alpine diving culture.",
      featuresList: [
        "Diving-inspired alpine design",
        "Crystal-clear water celebration",
        "Bay color back view featured",
        "Premium cotton construction",
        "Mountain lake diving tribute"
      ]
    },
    {
      id: "tahoe-fish-tee",
      name: "Tahoe Fish Tee",
      category: "tees",
      description: "Show your love for Lake Tahoe fishing with this angler-inspired alpine design featuring unique Sage colorway.",
      price: 33,
      images: [
        "/images/TAHOE-APPAREL/TAHOE-FISH-TEE/Front, Sage.png",
        "/images/TAHOE-APPAREL/TAHOE-FISH-TEE/Front, Bay.png",
        "/images/TAHOE-APPAREL/TAHOE-FISH-TEE/Back, Khaki.png",
        "/images/TAHOE-APPAREL/TAHOE-FISH-TEE/Front, Black.png",
        "/images/TAHOE-APPAREL/TAHOE-FISH-TEE/Front, Khaki.png",
        "/images/TAHOE-APPAREL/TAHOE-FISH-TEE/Front, True Navy.png",
        "/images/TAHOE-APPAREL/TAHOE-FISH-TEE/Front, Watermelon.png"
      ],
      colors: [
        { name: "Sage", hex: "#87A96B" },
        { name: "Bay", hex: "#7DD3FC" },
        { name: "Black", hex: "#000000" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      lake: "Lake Tahoe",
      details: "Premium fishing tee celebrating Lake Tahoe's world-class trout fishing. Features exclusive Sage colorway front view perfect for alpine angling adventures.",
      featuresList: [
        "Alpine fishing inspiration",
        "Exclusive Sage color option",
        "Front view angler graphics",
        "Premium cotton construction",
        "Lake Tahoe trout fishing tribute"
      ]
    },
    {
      id: "tahoe-lake-tee",
      name: "Tahoe Lake Tee",
      category: "tees",
      description: "Classic Lake Tahoe tee celebrating the Sierra Nevada's alpine jewel with pristine mountain lake design.",
      price: 33,
      images: [
        "/images/TAHOE-APPAREL/TAHOE-LAKE-TEE/Front, White.png",
        "/images/TAHOE-APPAREL/TAHOE-LAKE-TEE/Front, Bay.png",
        "/images/TAHOE-APPAREL/TAHOE-LAKE-TEE/Back, Khaki.png",
        "/images/TAHOE-APPAREL/TAHOE-LAKE-TEE/Front, Black.png",
        "/images/TAHOE-APPAREL/TAHOE-LAKE-TEE/Front, Khaki.png",
        "/images/TAHOE-APPAREL/TAHOE-LAKE-TEE/Front, True Navy.png",
        "/images/TAHOE-APPAREL/TAHOE-LAKE-TEE/Front, Watermelon.png"
      ],
      colors: [
        { name: "White", hex: "#FFFFFF" },
        { name: "Bay", hex: "#7DD3FC" },
        { name: "Black", hex: "#000000" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      lake: "Lake Tahoe",
      details: "Classic Lake Tahoe celebration tee featuring clean White front view design. Perfect for representing the Sierra Nevada's alpine jewel in style.",
      featuresList: [
        "Sierra Nevada alpine inspiration",
        "Classic Lake Tahoe design",
        "Clean White front view featured",
        "Premium comfort fit",
        "Mountain lake celebration"
      ]
    },
    {
      id: "tahoe-ski-tee",
      name: "Tahoe Ski Tee",
      category: "tees",
      description: "Celebrate Lake Tahoe's legendary ski culture with this alpine-inspired design perfect for year-round mountain style.",
      price: 33,
      images: [
        "/images/TAHOE-APPAREL/TAHOE-SKI-TEE/Back, Watermelon.png",
        "/images/TAHOE-APPAREL/TAHOE-SKI-TEE/Front, Khaki.png",
        "/images/TAHOE-APPAREL/TAHOE-SKI-TEE/Back, Bay.png",
        "/images/TAHOE-APPAREL/TAHOE-SKI-TEE/Back, Black.png",
        "/images/TAHOE-APPAREL/TAHOE-SKI-TEE/Back, Khaki.png",
        "/images/TAHOE-APPAREL/TAHOE-SKI-TEE/Back, True Navy.png",
        "/images/TAHOE-APPAREL/TAHOE-SKI-TEE/Back, White.png"
      ],
      colors: [
        { name: "Watermelon", hex: "#FB7185" },
        { name: "Khaki", hex: "#8B7355" },
        { name: "Bay", hex: "#7DD3FC" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      lake: "Lake Tahoe",
      details: "Premium ski-inspired tee celebrating Lake Tahoe's world-renowned winter sports culture. Features Watermelon back view for standout alpine style.",
      featuresList: [
        "Legendary ski culture inspiration",
        "Alpine winter sports design",
        "Watermelon back view featured",
        "Year-round mountain style",
        "Premium outdoor construction"
      ]
    },
    {
      id: "tahoe-waterski-tee",
      name: "Tahoe Waterski Tee",
      category: "tees",
      description: "Premium waterski t-shirt celebrating Lake Tahoe's legendary water sports culture with comprehensive front and back design views.",
      price: 33,
      images: [
        "/images/TAHOE-APPAREL/TAHOE-WATERSKI-TEE/Back, Black.png",
        "/images/TAHOE-APPAREL/TAHOE-WATERSKI-TEE/Front, Black.png",
        "/images/TAHOE-APPAREL/TAHOE-WATERSKI-TEE/Front, Peony.png",
        "/images/TAHOE-APPAREL/TAHOE-WATERSKI-TEE/Back, Peony.png",
        "/images/TAHOE-APPAREL/TAHOE-WATERSKI-TEE/Front, Midnight.png",
        "/images/TAHOE-APPAREL/TAHOE-WATERSKI-TEE/Back, Midnight.png",
        "/images/TAHOE-APPAREL/TAHOE-WATERSKI-TEE/Front, Topaz Blue.png",
        "/images/TAHOE-APPAREL/TAHOE-WATERSKI-TEE/Back, Topaz Blue.png",
        "/images/TAHOE-APPAREL/TAHOE-WATERSKI-TEE/Front, Burnt Orange.png",
        "/images/TAHOE-APPAREL/TAHOE-WATERSKI-TEE/Back, Burnt Orange.png"
      ],
      colors: [
        { name: "Black Back", hex: "#000000" },
        { name: "Black", hex: "#000000" },
        { name: "Peony", hex: "#FB7185" },
        { name: "Peony Back", hex: "#FB7185" },
        { name: "Midnight", hex: "#1E293B" },
        { name: "Midnight Back", hex: "#1E293B" },
        { name: "Topaz Blue", hex: "#0EA5E9" },
        { name: "Topaz Blue Back", hex: "#0EA5E9" },
        { name: "Burnt Orange", hex: "#EA580C" },
        { name: "Burnt Orange Back", hex: "#EA580C" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      lake: "Lake Tahoe",
      details: "Premium waterski t-shirt celebrating Lake Tahoe's legendary water sports culture. Features exclusive front and back design views showcasing California's premier alpine lake destination with crystal-clear waters and Sierra Nevada backdrop.",
      featuresList: [
        "Premium waterski design graphics",
        "Front and back view options",
        "5 unique color combinations",
        "Alpine lake inspired design",
        "Lake Tahoe waterski tribute",
        "Black back view featured"
      ]
    }
  ]

  // -------------------- Cart & UI state ------------------
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
  const [isTransitioning, setIsTransitioning] = useState(true)

  const nextSlide = () => {
    if (!isTransitioning) return
    setTranslateX(prev => prev - 340)
  }

  const prevSlide = () => {
    if (!isTransitioning) return
    setTranslateX(prev => prev + 340)
  }

  // Handle infinite loop reset
  const handleTransitionEnd = () => {
    if (translateX <= -apparelProducts.length * 2 * 340) {
      setIsTransitioning(false)
      setTranslateX(-apparelProducts.length * 340)
      setTimeout(() => setIsTransitioning(true), 50)
    } else if (translateX >= 0) {
      setIsTransitioning(false)
      setTranslateX(-apparelProducts.length * 340)
      setTimeout(() => setIsTransitioning(true), 50)
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

  // ---------------- Weather & Lake data logic (mirrors CDA random/scrape) --
  const [lakeRealTimeConditions, setLakeRealTimeConditions] = useState({ waterTemp: "N/A", wind: "N/A", visibility: "N/A", weather: "N/A", fishingRating: "N/A", lakeStatus: "N/A", airTemp: "N/A" })
  const [isLoadingLakeConditions, setIsLoadingLakeConditions] = useState(true)
  const [lakeConditionsError, setLakeConditionsError] = useState<string | null>(null)

  const [currentWeather, setCurrentWeather] = useState({ temperature: "71°", condition: "Sunny", emoji: "☀️", wind: "SSW 10 mph", humidity: "22%", visibility: "15 mi", lastUpdated: "" })
  const [isLoadingWeather, setIsLoadingWeather] = useState(false)

  const [forecast, setForecast] = useState([ 
    { day: "Today", condition: "Sunny", emoji: "☀️", high: "75°", low: "48°" }, 
    { day: "Friday", condition: "Sunny", emoji: "☀️", high: "71°", low: "50°" }, 
    { day: "Saturday", condition: "Mostly Sunny", emoji: "🌤️", high: "75°", low: "51°" } 
  ])

  // Simulated weather (identical logic as CDA)
  const fetchCurrentWeather = async () => {
    setIsLoadingWeather(true)
    try {
      const weatherOptions = [
        { temperature: "71°", condition: "Sunny", emoji: "☀️", wind: "SSW 10 mph", humidity: "22%", visibility: "15 mi" },
        { temperature: "68°", condition: "Partly Cloudy", emoji: "⛅", wind: "SW 8 mph", humidity: "28%", visibility: "12 mi" },
        { temperature: "73°", condition: "Clear", emoji: "☀️", wind: "W 6 mph", humidity: "20%", visibility: "18 mi" },
        { temperature: "66°", condition: "Mostly Sunny", emoji: "🌤️", wind: "SSW 12 mph", humidity: "25%", visibility: "14 mi" },
      ]
      const forecastChoices = [
        [ 
          { day: "Today", condition: "Sunny", emoji: "☀️", high: "75°", low: "48°" }, 
          { day: "Friday", condition: "Sunny", emoji: "☀️", high: "71°", low: "50°" }, 
          { day: "Saturday", condition: "Mostly Sunny", emoji: "🌤️", high: "75°", low: "51°" } 
        ],
        [ 
          { day: "Today", condition: "Partly Cloudy", emoji: "⛅", high: "73°", low: "46°" }, 
          { day: "Friday", condition: "Mostly Cloudy", emoji: "☁️", high: "68°", low: "48°" }, 
          { day: "Saturday", condition: "Sunny", emoji: "☀️", high: "72°", low: "49°" } 
        ],
      ]
      await new Promise((r) => setTimeout(r, 1000))
      const randCond = weatherOptions[Math.floor(Math.random() * weatherOptions.length)]
      const randForecast = forecastChoices[Math.floor(Math.random() * forecastChoices.length)]
      setCurrentWeather({ ...randCond, lastUpdated: new Date().toLocaleTimeString() })
      setForecast(randForecast)
    } catch {
      /* ignore */
    } finally { setIsLoadingWeather(false) }
  }

  useEffect(() => {
    const fetchLakeConditions = async () => {
      setIsLoadingLakeConditions(true)
      setLakeConditionsError(null)
      
      // Try multiple data sources for Lake Tahoe conditions
      const dataSources = [
        "https://seatemperature.info/lake-tahoe-water-temperature.html",
        "https://lakemonster.com/lake/CA/Lake-Tahoe-460"
      ]
      
      try {
        // First try the seatemperature.info source for water temp
        const seaTempRes = await fetch(`/api/lake-conditions?url=${encodeURIComponent(dataSources[0])}`)
        let waterTemp = "N/A"
        
        if (seaTempRes.ok) {
          const seaTempData = await seaTempRes.json()
          waterTemp = seaTempData.waterTemp || seaTempData.temperature || "N/A"
        }
        
        // Fallback to lakemonster for other conditions
        const lakeRes = await fetch(`/api/lake-conditions?url=${encodeURIComponent(dataSources[1])}`)
        let lakeData: any = {}
        
        if (lakeRes.ok) {
          lakeData = await lakeRes.json()
        }
        
        // Clean water temperature to show only numerical value
        let cleanWaterTemp = "62°F"
        if (waterTemp !== "N/A") {
          // Extract temperature - look for 1-3 digits optionally followed by decimal and 1 digit
          const tempMatch = waterTemp.match(/\b(\d{1,3}(?:\.\d)?)\s*[°]?[FfCc]?\b/)
          if (tempMatch) {
            let temp = parseFloat(tempMatch[1])
            // Convert to Fahrenheit if it seems like Celsius (typically 0-40°C range)
            if (temp <= 40) {
              temp = (temp * 9/5) + 32
            }
            // Round to nearest whole number and ensure reasonable range (40-80°F for Lake Tahoe)
            temp = Math.round(temp)
            if (temp >= 40 && temp <= 80) {
              cleanWaterTemp = temp + "°F"
            }
          }
        }
        
        setLakeRealTimeConditions({
          waterTemp: cleanWaterTemp,
          wind: lakeData.wind || "SSW 10 mph",
          visibility: lakeData.visibility || "15 mi", 
          weather: lakeData.weather || "Sunny",
          fishingRating: lakeData.fishingRating || "Good",
          lakeStatus: lakeData.lakeStatus || "Open",
          airTemp: lakeData.airTemp || "71°F"
        })
      } catch (err) {
        setLakeConditionsError(err instanceof Error ? err.message : "Unable to fetch lake conditions")
        // Set fallback realistic values for Lake Tahoe
        setLakeRealTimeConditions({
          waterTemp: "62°F", // Typical summer water temp for Lake Tahoe
          wind: "SSW 10 mph",
          visibility: "15 mi",
          weather: "Sunny",
          fishingRating: "Good",
          lakeStatus: "Open",
          airTemp: "71°F",
        })
      } finally {
        setIsLoadingLakeConditions(false)
      }
    }
    fetchLakeConditions()
  }, [])

  useEffect(() => {
    fetchCurrentWeather()
    const interval = setInterval(fetchCurrentWeather, 15 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Set lastUpdated on client to avoid hydration mismatch
    setCurrentWeather((prev) => ({ ...prev, lastUpdated: new Date().toLocaleTimeString() }))
  }, [])

  // ---------------------------- JSX (identical layout) ---------------------
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex flex-col items-center justify-center py-1 hover:opacity-80 transition-opacity focus:ring-2 focus:ring-cyan-400/50 focus:outline-none rounded">
                <p className="text-xs text-gray-400 tracking-[0.2em] font-light mb-0">CA • OR • WA • ID • MT</p>
                <Image src="/images/Mu (2).svg" alt="MU Waterwear Logo" width={200} height={80} className="h-10 w-auto transition-all duration-300 hover:scale-105" priority style={{ transform: "scale(9.0)" }} />
              </Link>
            </div>
            {/* Navigation (kept minimal) */}
            <nav className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Main navigation">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-gray-300 hover:text-cyan-400 transition-colors font-medium flex items-center gap-1 focus:ring-2 focus:ring-cyan-400/50 focus:outline-none">
                    WATERWAYS <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                {/* Dropdown items identical to home (Lake Tahoe entry could be highlighted) */}
                <DropdownMenuContent className="bg-gray-900 border-gray-700 text-white w-72 min-w-72">
                  {/* Repeat items, ensure Tahoe present */}
                  <DropdownMenuItem className="hover:bg-gray-800 focus:bg-gray-800 py-4 px-6 rounded-md">
                    <Link href="/coeur-dalene" className="w-full flex items-center justify-start gap-4 px-2">
                      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                        <Image src="/images/lake-icon.png" alt="Lakes" width={40} height={40} className="w-10 h-10 object-contain" />
                      </div>
                      <span className="text-sm font-medium">Coeur D' Alene Lake, ID </span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-800 focus:bg-gray-800 py-4 px-6 rounded-md">
                    <Link href="/detroit-lake" className="w-full flex items-center justify-start gap-4 px-2">
                      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                        <Image src="/images/waterway-outline-2.png" alt="Bays" width={40} height={40} className="w-10 h-10 object-contain" />
                      </div>
                      <span className="text-sm font-medium">Detroit Lake, OR </span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-800 focus:bg-gray-800 py-4 px-6 rounded-md">
                    <Link href="/flathead" className="w-full flex items-center justify-start gap-4 px-2">
                      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                        <Image src="/images/stream-icon.png" alt="Streams" width={40} height={40} className="w-10 h-10 object-contain" />
                      </div>
                      <span className="text-sm font-medium">Flathead Lake, MT </span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-800 focus:bg-gray-800 py-4 px-6 rounded-md">
                    <Link href="/lake-tahoe" className="w-full flex items-center justify-start gap-4 px-2">
                      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                        <Image src="/images/laketahoeicon.svg" alt="Lake Tahoe" width={40} height={40} className="w-10 h-10 object-contain" />
                      </div>
                      <span className="text-sm font-medium">Lake Tahoe, CA/NV</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-800 focus:bg-gray-800 py-4 px-6 rounded-md">
                    <Link href="/lake-washington" className="w-full flex items-center justify-start gap-4 px-2">
                      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                        <Image src="/images/waterway-outline-1.png" alt="Coastlines" width={40} height={40} className="w-10 h-10 object-contain" />
                      </div>
                      <span className="text-sm font-medium">Lake Washington, WA </span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-800 focus:bg-gray-800 py-4 px-6 rounded-md">
                    <Link href="/lindbergh" className="w-full flex items-center justify-start gap-4 px-2">
                      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                        <Image src="/images/river-icon.png" alt="Rivers" width={40} height={40} className="w-10 h-10 object-contain" />
                      </div>
                      <span className="text-sm font-medium">Lindbergh Lake, MT</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Link href="/gear" className="text-gray-300 hover:text-cyan-400 transition-colors font-medium">GEAR</Link>
              <Link href="/apparel" className="text-gray-300 hover:text-cyan-400 transition-colors font-medium">APPAREL</Link>
              <Link href="/accessories" className="text-gray-300 hover:text-cyan-400 transition-colors font-medium">ACCESSORIES</Link>
                              <Link href="/about" className="text-gray-300 hover:text-cyan-400 transition-colors font-medium">ABOUT</Link>
            </nav>
            {/* Icons */}
            <div className="flex items-center space-x-4">

              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-cyan-400 relative" onClick={() => setIsCartOpen(true)}>
                <ShoppingCart className="h-5 w-5" />
                {getCartItemCount() > 0 && <span className="absolute -top-1 -right-1 bg-cyan-400 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{getCartItemCount()}</span>}
              </Button>
              <Button variant="ghost" size="icon" className="md:hidden"><Menu className="h-5 w-5" /></Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section 
        className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
        style={{
          width: '100vw',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)'
        }}
      >
        <div className="absolute inset-0 z-0">
          <Image 
            src={lakeInfo.heroImage || "/placeholder.svg"} 
            alt={`${lakeInfo.name} Aerial View`} 
            fill 
            className="object-cover" 
            priority 
            sizes="100vw"
            style={{ 
              transform: 'scale(1.2)'
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
                CALIFORNIA • NEVADA
              </h2>
            </div>
            <div className="mb-6 flex justify-center">
              <div className="w-32 h-32 flex items-center justify-center">
                <Image 
                  src={lakeInfo.icon || "/placeholder.svg"} 
                  alt={lakeInfo.name} 
                  width={128} 
                  height={128} 
                  className="w-full h-full object-contain brightness-0 saturate-100 invert-0" 
                  style={{ filter: "brightness(0) saturate(100%) invert(65%) sepia(98%) saturate(3207%) hue-rotate(163deg) brightness(101%) contrast(101%)" }} 
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
              Premium apparel inspired by {lakeInfo.name}'s alpine spirit.
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
                              alt="Lake Tahoe Background"
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

      {/* Live Webcam & Weather Section (mirrors CDA) */}
      <section className="py-20 bg-gray-900 relative z-10">
        <div className="container mx-auto px-4"><div className="max-w-6xl mx-auto"><div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-shrink-0"><div className="relative overflow-hidden bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm" style={{ width: "700px", height: "450px" }}><AutoVideoPlayer src="https://portal.hdontap.com/s/embed/?stream=northtahoepud_ttv-TOPIA" title="Lake Tahoe Live Webcam - North Tahoe PUD" /></div></div>
          <div className="flex-1 space-y-6">
            <div className="group cursor-pointer"><div className="relative h-80 overflow-hidden bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-6 flex flex-col justify-between">
              <div><div className="flex items-center justify-between mb-4"><h3 className="text-white font-light text-lg">Current Conditions</h3>{isLoadingWeather && <div className="text-gray-400 text-xs">Updating...</div>}</div><div className="flex items-start gap-6 mb-6"><div><div className="text-5xl font-light text-white">{isLoadingWeather ? "--" : currentWeather.temperature}</div><div className="text-gray-300">{currentWeather.condition}</div></div><div className="text-3xl mt-2">{currentWeather.emoji}</div></div><div className="text-xs text-gray-500">Last updated: {currentWeather.lastUpdated}</div></div>
              <div className="grid grid-cols-2 gap-4 pt-6"><div className="space-y-1"><div className="text-gray-400 text-sm">Water Temp</div><div className="text-xl font-light text-cyan-400">{isLoadingLakeConditions ? "--" : (lakeRealTimeConditions.waterTemp !== "N/A" ? lakeRealTimeConditions.waterTemp : "48°F")}</div></div><div className="space-y-1"><div className="text-gray-400 text-sm">Wind</div><div className="text-xl text-gray-200">{currentWeather.wind}</div></div><div className="space-y-1"><div className="text-gray-400 text-sm">Humidity</div><div className="text-xl text-gray-200">{currentWeather.humidity}</div></div><div className="space-y-1"><div className="text-gray-400 text-sm">Visibility</div><div className="text-xl text-gray-200">{currentWeather.visibility}</div></div></div></div></div>
            <div className="group cursor-pointer mt-8"><div className="relative overflow-hidden bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm p-6"><h4 className="text-white font-light text-lg mb-4">3-Day Forecast</h4><div className="space-y-4">{forecast.map((d, i) => (<div key={i} className="flex items-center justify-between"><div className="flex items-center gap-3"><span className="text-2xl">{d.emoji}</span><div><div className="text-white">{d.day}</div><div className="text-sm text-gray-400">{d.condition}</div></div></div><div className="text-right"><div className="text-white">{d.high}</div><div className="text-sm text-gray-400">{d.low}</div></div></div>))}</div></div></div>
          </div></div></div></div>
      </section>

      {/* Center Icon section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 via-black to-gray-900"><div className="container mx-auto px-4 text-center"><div className="max-w-4xl mx-auto"><div className="flex justify-center"><div className="w-32 h-32 md:w-48 md:h-48 scale-150"><Image src={lakeInfo.icon} alt={lakeInfo.name} width={192} height={192} className="w-full h-full object-contain" /></div></div></div></div></section>

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
    </div>
  )
} 