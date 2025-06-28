"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/contexts/CartContext"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ShoppingCart, Menu, ChevronDown, Filter, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import ShoppingCartSidebar from "@/components/ShoppingCartSidebar"
import NewsletterSignup from "@/components/NewsletterSignup"

export default function AccessoriesPage() {
  const [showContactEmail, setShowContactEmail] = useState(false)
  const [showReturnsPolicy, setShowReturnsPolicy] = useState(false)
  const [showShippingPolicy, setShowShippingPolicy] = useState(false)
  
  // Product data with categories
  const allProducts = [
    {
      id: "beanie-cda",
      name: "CDA Beanie",
      category: "accessories",
      description: "Coeur d'Alene branded cuffed beanie in multiple colors",
      price: 28,
      images: [
        "/images/ACCESSORIES/CDA-BEANIE/cuffed-beanie-black-front-685a34884ee68.png",
        "/images/ACCESSORIES/CDA-BEANIE/cuffed-beanie-heather-grey-front-685a34884f4c1.png",
        "/images/ACCESSORIES/CDA-BEANIE/cuffed-beanie-navy-front-685a34884f413.png",
        "/images/ACCESSORIES/CDA-BEANIE/cuffed-beanie-dark-grey-front-685a34884f473.png",
        "/images/ACCESSORIES/CDA-BEANIE/cuffed-beanie-baby-pink-front-685a34884f50b.png"
      ],
      colors: [
        { name: "Black", hex: "#000000" },
        { name: "Heather Grey", hex: "#9CA3AF" },
        { name: "Navy", hex: "#1E3A8A" },
        { name: "Dark Grey", hex: "#4B5563" },
        { name: "Baby Pink", hex: "#F9A8D4" }
      ],
      sizes: ["One Size"],
      featured: true,
      details: "Coeur d'Alene lake branded beanie with classic cuffed design. Available in 5 stylish colors for every season."
    },
    {
      id: "hat-cda-lake",
      name: "CDA Lake Hat",
      category: "accessories",
      description: "Classic dad hat with Coeur d'Alene lake branding",
      price: 32,
      images: [
        "/images/ACCESSORIES/CDA-LAKE-HAT/classic-dad-hat-navy-front-685a35bea3c57.png",
        "/images/ACCESSORIES/CDA-LAKE-HAT/classic-dad-hat-black-front-685a35bea21a8.png",
        "/images/ACCESSORIES/CDA-LAKE-HAT/classic-dad-hat-dark-grey-front-685a35bea4ecc.png",
        "/images/ACCESSORIES/CDA-LAKE-HAT/classic-dad-hat-khaki-front-685a35bea6e3a.png",
        "/images/ACCESSORIES/CDA-LAKE-HAT/classic-dad-hat-stone-front-685a35bea97f6.png",
        "/images/ACCESSORIES/CDA-LAKE-HAT/classic-dad-hat-pink-front-685a35beac4d7.png",
        "/images/ACCESSORIES/CDA-LAKE-HAT/classic-dad-hat-light-blue-front-685a35beae716.png"
      ],
      colors: [
        { name: "Navy", hex: "#1E3A8A" },
        { name: "Black", hex: "#000000" },
        { name: "Dark Grey", hex: "#4B5563" },
        { name: "Khaki", hex: "#8B7355" },
        { name: "Stone", hex: "#A8A29E" },
        { name: "Pink", hex: "#EC4899" },
        { name: "Light Blue", hex: "#7DD3FC" }
      ],
      sizes: ["One Size"],
      featured: true,
      details: "Premium classic dad hat featuring Coeur d'Alene lake branding. Adjustable fit with curved brim design in 7 versatile colors."
    },
    {
      id: "beanie-detroit",
      name: "Detroit Beanie",
      category: "accessories",
      description: "Detroit Lake branded cuffed beanie in multiple colors",
      price: 28,
      images: [
        "/images/ACCESSORIES/DETROIT-BEANIE/cuffed-beanie-black-front-685a39440793c.png",
        "/images/ACCESSORIES/DETROIT-BEANIE/cuffed-beanie-heather-grey-front-685a394407f81.png",
        "/images/ACCESSORIES/DETROIT-BEANIE/cuffed-beanie-navy-front-685a394407ec3.png",
        "/images/ACCESSORIES/DETROIT-BEANIE/cuffed-beanie-dark-grey-front-685a394407f22.png",
        "/images/ACCESSORIES/DETROIT-BEANIE/cuffed-beanie-baby-pink-front-685a394407fcc.png"
      ],
      colors: [
        { name: "Black", hex: "#000000" },
        { name: "Heather Grey", hex: "#9CA3AF" },
        { name: "Navy", hex: "#1E3A8A" },
        { name: "Dark Grey", hex: "#4B5563" },
        { name: "Baby Pink", hex: "#F9A8D4" }
      ],
      sizes: ["One Size"],
      featured: true,
      details: "Detroit Lake branded beanie with classic cuffed design. Perfect for Oregon lake adventures in 5 stylish colors."
    },
    {
      id: "hat-detroit-lake",
      name: "Detroit Lake Hat",
      category: "accessories",
      description: "Classic dad hat with Detroit Lake branding",
      price: 32,
      images: [
        "/images/ACCESSORIES/DETROIT-LAKE-HAT/classic-dad-hat-light-blue-front-685a3b475dc80.png",
        "/images/ACCESSORIES/DETROIT-LAKE-HAT/classic-dad-hat-black-front-685a3b475b645.png",
        "/images/ACCESSORIES/DETROIT-LAKE-HAT/classic-dad-hat-navy-front-685a3b475c0b7.png",
        "/images/ACCESSORIES/DETROIT-LAKE-HAT/classic-dad-hat-khaki-front-685a3b475c651.png",
        "/images/ACCESSORIES/DETROIT-LAKE-HAT/classic-dad-hat-stone-front-685a3b475ccc1.png",
        "/images/ACCESSORIES/DETROIT-LAKE-HAT/classic-dad-hat-pink-front-685a3b475d423.png"
      ],
      colors: [
        { name: "Light Blue", hex: "#7DD3FC" },
        { name: "Black", hex: "#000000" },
        { name: "Navy", hex: "#1E3A8A" },
        { name: "Khaki", hex: "#8B7355" },
        { name: "Stone", hex: "#A8A29E" },
        { name: "Pink", hex: "#EC4899" }
      ],
      sizes: ["One Size"],
      featured: true,
      details: "Premium classic dad hat featuring Detroit Lake branding. Adjustable fit with curved brim design in 6 versatile colors."
    },
    {
      id: "beanie-washington",
      name: "Washington Beanie",
      category: "accessories",
      description: "Lake Washington branded cuffed beanie in multiple colors",
      price: 28,
      images: [
        "/images/ACCESSORIES/WASHINGTON-BEANIE/cuffed-beanie-navy-front-685a3e5595863.png",
        "/images/ACCESSORIES/WASHINGTON-BEANIE/cuffed-beanie-black-front-685a3e559551c.png",
        "/images/ACCESSORIES/WASHINGTON-BEANIE/cuffed-beanie-heather-grey-front-685a3e559591e.png",
        "/images/ACCESSORIES/WASHINGTON-BEANIE/cuffed-beanie-dark-grey-front-685a3e55958bf.png",
        "/images/ACCESSORIES/WASHINGTON-BEANIE/cuffed-beanie-baby-pink-front-685a3e559597c.png"
      ],
      colors: [
        { name: "Navy", hex: "#1E3A8A" },
        { name: "Black", hex: "#000000" },
        { name: "Heather Grey", hex: "#9CA3AF" },
        { name: "Dark Grey", hex: "#4B5563" },
        { name: "Baby Pink", hex: "#F9A8D4" }
      ],
      sizes: ["One Size"],
      featured: true,
      details: "Lake Washington branded beanie with classic cuffed design. Perfect for Pacific Northwest lake adventures in 5 stylish colors."
    },
    {
      id: "hat-washington-lake",
      name: "Washington Lake Hat",
      category: "accessories",
      description: "Classic dad hat with Lake Washington branding",
      price: 32,
      images: [
        "/images/ACCESSORIES/WASHINGTON-LAKE-HAT/classic-dad-hat-light-blue-front-685a3e1a73046.png",
        "/images/ACCESSORIES/WASHINGTON-LAKE-HAT/classic-dad-hat-pink-front-685a3e1a726fd.png",
        "/images/ACCESSORIES/WASHINGTON-LAKE-HAT/classic-dad-hat-black-front-685a3e1a708a5.png",
        "/images/ACCESSORIES/WASHINGTON-LAKE-HAT/classic-dad-hat-navy-front-685a3e1a71126.png",
        "/images/ACCESSORIES/WASHINGTON-LAKE-HAT/classic-dad-hat-khaki-front-685a3e1a7173d.png",
        "/images/ACCESSORIES/WASHINGTON-LAKE-HAT/classic-dad-hat-stone-front-685a3e1a71e51.png"
      ],
      colors: [
        { name: "Light Blue", hex: "#7DD3FC" },
        { name: "Pink", hex: "#EC4899" },
        { name: "Black", hex: "#000000" },
        { name: "Navy", hex: "#1E3A8A" },
        { name: "Khaki", hex: "#8B7355" },
        { name: "Stone", hex: "#A8A29E" }
      ],
      sizes: ["One Size"],
      featured: true,
      details: "Premium classic dad hat featuring Lake Washington branding. Adjustable fit with curved brim design in 6 versatile colors."
    },
    {
      id: "beanie-lindbergh",
      name: "Lindbergh Beanie",
      category: "accessories",
      description: "Lindbergh Lake branded cuffed beanie in multiple colors",
      price: 28,
      images: [
        "/images/ACCESSORIES/LINDBERGH-BEANIE/cuffed-beanie-black-front-685a3ddcd6ba6.png",
        "/images/ACCESSORIES/LINDBERGH-BEANIE/cuffed-beanie-baby-pink-front-685a3ddcd6f49.png",
        "/images/ACCESSORIES/LINDBERGH-BEANIE/cuffed-beanie-heather-grey-front-685a3ddcd6f02.png",
        "/images/ACCESSORIES/LINDBERGH-BEANIE/cuffed-beanie-navy-front-685a3ddcd6e64.png",
        "/images/ACCESSORIES/LINDBERGH-BEANIE/cuffed-beanie-dark-grey-front-685a3ddcd6eb6.png"
      ],
      colors: [
        { name: "Black", hex: "#000000" },
        { name: "Baby Pink", hex: "#F9A8D4" },
        { name: "Heather Grey", hex: "#9CA3AF" },
        { name: "Navy", hex: "#1E3A8A" },
        { name: "Dark Grey", hex: "#4B5563" }
      ],
      sizes: ["One Size"],
      featured: true,
      details: "Lindbergh Lake branded beanie with classic cuffed design. Perfect for Montana lake adventures in 5 stylish colors."
    },
    {
      id: "hat-lindbergh-lake",
      name: "Lindbergh Lake Hat",
      category: "accessories",
      description: "Classic dad hat with Lindbergh Lake branding",
      price: 32,
      images: [
        "/images/ACCESSORIES/LINDBERGH-LAKE-HAT/classic-dad-hat-stone-front-685a3d7a8424d.png",
        "/images/ACCESSORIES/LINDBERGH-LAKE-HAT/classic-dad-hat-black-front-685a3d7a8255b.png",
        "/images/ACCESSORIES/LINDBERGH-LAKE-HAT/classic-dad-hat-navy-front-685a3d7a832ac.png",
        "/images/ACCESSORIES/LINDBERGH-LAKE-HAT/classic-dad-hat-khaki-front-685a3d7a83a3d.png",
        "/images/ACCESSORIES/LINDBERGH-LAKE-HAT/classic-dad-hat-pink-front-685a3d7a84acd.png",
        "/images/ACCESSORIES/LINDBERGH-LAKE-HAT/classic-dad-hat-light-blue-front-685a3d7a85537.png"
      ],
      colors: [
        { name: "Stone", hex: "#A8A29E" },
        { name: "Black", hex: "#000000" },
        { name: "Navy", hex: "#1E3A8A" },
        { name: "Khaki", hex: "#8B7355" },
        { name: "Pink", hex: "#EC4899" },
        { name: "Light Blue", hex: "#7DD3FC" }
      ],
      sizes: ["One Size"],
      featured: true,
      details: "Premium classic dad hat featuring Lindbergh Lake branding. Adjustable fit with curved brim design in 6 versatile colors."
    },
    {
      id: "beanie-tahoe",
      name: "Tahoe Beanie",
      category: "accessories",
      description: "Lake Tahoe branded cuffed beanie in multiple colors",
      price: 28,
      images: [
        "/images/ACCESSORIES/TAHOE-BEANIE/cuffed-beanie-heather-grey-front-685a3b9a84126.png",
        "/images/ACCESSORIES/TAHOE-BEANIE/cuffed-beanie-black-front-685a3b9a832a2.png",
        "/images/ACCESSORIES/TAHOE-BEANIE/cuffed-beanie-dark-grey-front-685a3b9a84098.png",
        "/images/ACCESSORIES/TAHOE-BEANIE/cuffed-beanie-navy-front-685a3b9a83fd6.png",
        "/images/ACCESSORIES/TAHOE-BEANIE/cuffed-beanie-baby-pink-front-685a3b9a841a9.png"
      ],
      colors: [
        { name: "Heather Grey", hex: "#9CA3AF" },
        { name: "Black", hex: "#000000" },
        { name: "Dark Grey", hex: "#4B5563" },
        { name: "Navy", hex: "#1E3A8A" },
        { name: "Baby Pink", hex: "#F9A8D4" }
      ],
      sizes: ["One Size"],
      featured: true,
      details: "Lake Tahoe branded beanie with classic cuffed design. Perfect for alpine lake adventures in 5 stylish colors."
    },
    {
      id: "hat-tahoe-lake",
      name: "Tahoe Lake Hat",
      category: "accessories",
      description: "Classic dad hat with Lake Tahoe branding",
      price: 32,
      images: [
        "/images/ACCESSORIES/TAHOE-LAKE-HAT/classic-dad-hat-khaki-front-685a3bf4c48c3.png",
        "/images/ACCESSORIES/TAHOE-LAKE-HAT/classic-dad-hat-black-front-685a3bf4c3933.png",
        "/images/ACCESSORIES/TAHOE-LAKE-HAT/classic-dad-hat-navy-front-685a3bf4c4325.png",
        "/images/ACCESSORIES/TAHOE-LAKE-HAT/classic-dad-hat-stone-front-685a3bf4c4f57.png",
        "/images/ACCESSORIES/TAHOE-LAKE-HAT/classic-dad-hat-pink-front-685a3bf4c56bd.png",
        "/images/ACCESSORIES/TAHOE-LAKE-HAT/classic-dad-hat-light-blue-front-685a3bf4c5f47.png"
      ],
      colors: [
        { name: "Khaki", hex: "#8B7355" },
        { name: "Black", hex: "#000000" },
        { name: "Navy", hex: "#1E3A8A" },
        { name: "Stone", hex: "#A8A29E" },
        { name: "Pink", hex: "#EC4899" },
        { name: "Light Blue", hex: "#7DD3FC" }
      ],
      sizes: ["One Size"],
      featured: true,
      details: "Premium classic dad hat featuring Lake Tahoe branding. Adjustable fit with curved brim design in 6 versatile colors."
    },
    {
      id: "beanie-flathead",
      name: "Flathead Beanie",
      category: "accessories",
      description: "Flathead Lake branded cuffed beanie in multiple colors",
      price: 28,
      images: [
        "/images/ACCESSORIES/FLATHEAD-BEANIE/cuffed-beanie-dark-grey-front-685a368490f14.png",
        "/images/ACCESSORIES/FLATHEAD-BEANIE/cuffed-beanie-black-front-685a368490bda.png",
        "/images/ACCESSORIES/FLATHEAD-BEANIE/cuffed-beanie-heather-grey-front-685a368490f5e.png",
        "/images/ACCESSORIES/FLATHEAD-BEANIE/cuffed-beanie-navy-front-685a368490ebe.png",
        "/images/ACCESSORIES/FLATHEAD-BEANIE/cuffed-beanie-baby-pink-front-685a368490fa5.png"
      ],
      colors: [
        { name: "Dark Grey", hex: "#4B5563" },
        { name: "Black", hex: "#000000" },
        { name: "Heather Grey", hex: "#9CA3AF" },
        { name: "Navy", hex: "#1E3A8A" },
        { name: "Baby Pink", hex: "#F9A8D4" }
      ],
      sizes: ["One Size"],
      featured: true,
      details: "Flathead Lake branded beanie with classic cuffed design. Perfect for Montana lake adventures in 5 stylish colors."
    },
    {
      id: "hat-flathead-lake",
      name: "Flathead Lake Hat",
      category: "accessories",
      description: "Classic dad hat with Flathead Lake branding",
      price: 32,
      images: [
        "/images/ACCESSORIES/FLATHEAD-LAKE-HAT/classic-dad-hat-navy-front-685a36e98a332.png",
        "/images/ACCESSORIES/FLATHEAD-LAKE-HAT/classic-dad-hat-black-front-685a36e989977.png",
        "/images/ACCESSORIES/FLATHEAD-LAKE-HAT/classic-dad-hat-khaki-front-685a36e98abf2.png",
        "/images/ACCESSORIES/FLATHEAD-LAKE-HAT/classic-dad-hat-stone-front-685a36e98b6c8.png",
        "/images/ACCESSORIES/FLATHEAD-LAKE-HAT/classic-dad-hat-pink-front-685a36e98c32d.png",
        "/images/ACCESSORIES/FLATHEAD-LAKE-HAT/classic-dad-hat-light-blue-front-685a36e98cc39.png"
      ],
      colors: [
        { name: "Navy", hex: "#1E3A8A" },
        { name: "Black", hex: "#000000" },
        { name: "Khaki", hex: "#8B7355" },
        { name: "Stone", hex: "#A8A29E" },
        { name: "Pink", hex: "#EC4899" },
        { name: "Light Blue", hex: "#7DD3FC" }
      ],
      sizes: ["One Size"],
      featured: true,
      details: "Premium classic dad hat featuring Flathead Lake branding. Adjustable fit with curved brim design in 6 versatile colors."
    }
  ]

  const categories = [
    { id: "all", name: "All Accessories", count: allProducts.length },
    { id: "headwear", name: "Headwear", count: allProducts.filter(p => p.name.toLowerCase().includes('hat') || p.name.toLowerCase().includes('beanie')).length }
  ]

  const { addToCart, setIsCartOpen, getCartItemCount } = useCart()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedSize, setSelectedSize] = useState<{ [key: string]: string }>({})
  const [selectedColor, setSelectedColor] = useState<{ [key: string]: number }>({})
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

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
  const filteredProducts = selectedCategory === "all" 
    ? allProducts 
    : selectedCategory === "headwear"
    ? allProducts.filter(p => p.name.toLowerCase().includes('hat') || p.name.toLowerCase().includes('beanie'))
    : allProducts.filter(p => p.category === selectedCategory)

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

  // Handle image click to open expanded view
  const handleImageClick = (imageSrc: string, productId: string) => {
    const product = allProducts.find(p => p.id === productId)
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

    const product = allProducts.find(p => p.id === expandedProductId)
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
    const product = allProducts.find(p => p.id === expandedProductId)
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
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

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
          <source src="/videos/gear.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-950 to-slate-950" />
        <div className="container mx-auto px-4 relative z-20">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              <span className="block text-transparent bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text">
                ACCESSORIES
              </span>
            </h1>
            <p className="text-lg text-slate-400 font-light leading-relaxed">
              Styled add-ons
            </p>
          </div>
        </div>
      </section>

      {/* Category Filters - Desktop */}
      <section className="sticky top-[73px] z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-1 flex-wrap">
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
            <div className="text-sm text-slate-400">
              {filteredProducts.length} Products
            </div>
          </div>
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
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => {
              const currentColorIndex = selectedColor[product.id] || 0
              const isHovered = hoveredProduct === product.id
              
              return (
                <div
                  key={product.id}
                  className="group relative"
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  <div className={`relative bg-slate-900/50 rounded-lg overflow-hidden border border-slate-800/50 transition-all duration-300 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10 ${
                    product.id === 'supplement-magnesium-zinc' 
                      ? 'hover:-translate-y-2 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/20' 
                      : 'hover:-translate-y-1'
                  }`}>
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden bg-gradient-to-b from-slate-800/50 to-slate-900/50">
                      {/* Hero Background SVG behind product image */}
                      <div className="absolute inset-0 opacity-15 pointer-events-none z-0">
                        <Image
                          src="/Untitled design (68).svg"
                          alt="Background"
                          fill
                          className="object-cover"
                          style={{ transform: 'scale(4)' }}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      <div 
                        className="absolute inset-0 cursor-pointer z-10"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleImageClick(product.images[currentColorIndex] || product.images[0], product.id);
                        }}
                      >
                        <Image
                          src={product.images[currentColorIndex] || product.images[0]}
                          alt={product.name}
                          fill
                          className={`transition-transform duration-500 pointer-events-none ${
                            product.category === 'supplements' 
                              ? 'object-cover scale-[0.7] group-hover:scale-[0.85]' 
                              : 'object-contain scale-[0.7] group-hover:scale-[0.85]'
                          }`}
                        />
                      </div>
                      
                      {/* Expand icon overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
                        <div className={`bg-black/50 rounded-full p-3 ${
                          product.category === 'supplements' 
                            ? 'transform group-hover:scale-110 transition-transform duration-300' 
                            : ''
                        }`}>
                          <svg className={`text-white fill-none stroke-current ${
                            product.category === 'supplements' ? 'w-10 h-10' : 'w-8 h-8'
                          }`} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </div>

                      {/* Featured Badge */}
                      {product.featured && (
                        <div className={`absolute top-3 left-3 backdrop-blur-sm text-xs font-medium px-3 py-1 rounded-full border transition-all duration-300 ${
                          product.category === 'supplements' 
                            ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/30 text-cyan-300 border-cyan-400/50 group-hover:from-cyan-500/50 group-hover:to-blue-500/50 group-hover:text-cyan-200 group-hover:border-cyan-300/70 animate-pulse' 
                            : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                        }`}>
                          {product.category === 'supplements' ? '✨ RECOVERY' : 'FEATURED'}
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4 space-y-3">
                      <div className="space-y-1">
                        <h3 className="font-medium text-white line-clamp-1">{product.name}</h3>
                        <p className="text-sm text-slate-400 line-clamp-1">{product.description}</p>
                      </div>
                      
                      {/* Price and Colors */}
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-white">${product.price}</span>
                        
                        {/* Color Swatches */}
                        {product.colors.length > 1 && (
                          <div className="flex gap-1">
                            {product.colors.map((color, index) => (
                              <button
                                key={color.name}
                                onClick={() => setSelectedColor({ ...selectedColor, [product.id]: index })}
                                className={`w-4 h-4 rounded-full border-2 transition-all ${
                                  currentColorIndex === index 
                                    ? 'border-cyan-400 scale-110' 
                                    : 'border-transparent hover:border-slate-600'
                                }`}
                                style={{ backgroundColor: color.hex }}
                                title={color.name}
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Minimal Size Selection & Add to Cart */}
                      <div className="space-y-2 pt-1">
                        {/* Size Selection */}
                        <div className="flex flex-wrap gap-1">
                          {product.sizes.map((size) => (
                            <button
                              key={size}
                              onClick={() => setSelectedSize({ ...selectedSize, [product.id]: size })}
                              className={`px-2 py-1 text-xs rounded transition-all ${
                                selectedSize[product.id] === size
                                  ? 'bg-cyan-500 text-slate-950 font-medium'
                                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>

                        {/* Add to Cart Button */}
                        <button
                          onClick={() => handleQuickAdd(product)}
                          className="w-full py-2 bg-slate-800 hover:bg-cyan-500 text-white hover:text-slate-950 rounded text-sm font-medium transition-all duration-200"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-16 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold mb-4 text-cyan-400">SHOP</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/gear" className="hover:text-white transition-colors">Gear</Link></li>
                <li><Link href="/apparel" className="hover:text-white transition-colors">Apparel</Link></li>
                <li><Link href="/accessories" className="hover:text-white transition-colors">Accessories</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-cyan-400">SUPPORT</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/size guide.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Size Guide</Link></li>
                <li>
                  {showShippingPolicy ? (
                    <span className="text-slate-300">
                      We charge standard shipping rate but free shipping on all apparel and accessories
                    </span>
                  ) : (
                    <button 
                      onClick={() => setShowShippingPolicy(true)}
                      className="hover:text-white transition-colors text-left"
                    >
                      Shipping
                    </button>
                  )}
                </li>
                <li>
                  {showReturnsPolicy ? (
                    <span className="text-slate-300">
                      14 day return policy across all items, upon delivery
                    </span>
                  ) : (
                    <button 
                      onClick={() => setShowReturnsPolicy(true)}
                      className="hover:text-white transition-colors text-left"
                    >
                      Returns
                    </button>
                  )}
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-cyan-400">COMPANY</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li>
                  {showContactEmail ? (
                    <span className="text-slate-300">
                      info@muwaterwear.com
                    </span>
                  ) : (
                    <button 
                      onClick={() => setShowContactEmail(true)}
                      className="hover:text-white transition-colors text-left"
                    >
                      Contact
                    </button>
                  )}
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-cyan-400">NEWSLETTER</h4>
              <p className="text-slate-400 mb-4">Join the MU community for exclusive drops and updates.</p>
              <NewsletterSignup 
                source="accessories" 
                placeholder="Enter email"
                buttonText="JOIN"
                className="w-full"
              />
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-500">
            <p>&copy; 2024 MU Waterwear. Engineered for water. Built for performance.</p>
            <div className="mt-4">
              <Link href="/privacy-policy" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Expanded Image Modal */}
      {expandedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
          onClick={() => setExpandedImage(false)}
        >
          <div className={`relative ${
            expandedProductId === 'supplement-magnesium-zinc' 
              ? 'max-w-7xl max-h-[98vh]' 
              : 'max-w-5xl max-h-[90vh]'
          }`}>
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
                  className={`w-auto object-contain transition-transform duration-200 ${
                    expandedProductId === 'supplement-magnesium-zinc' 
                      ? 'max-h-[98vh] min-h-[80vh]' 
                      : 'max-h-[90vh]'
                  }`}
                  style={{
                    transform: `scale(${expandedProductId === 'supplement-magnesium-zinc' ? imageZoom * 1.5 : imageZoom}) translate(${imagePosition.x / imageZoom}px, ${imagePosition.y / imageZoom}px)`,
                    transformOrigin: 'center center'
                  }}
                  draggable={false}
                />
              </div>

              {/* Navigation Controls for Products with Multiple Images */}
              {getTotalImagesForExpandedProduct() > 1 && (
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

              {/* Image Counter and Dots */}
              {getTotalImagesForExpandedProduct() > 1 && (
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
                          if (expandedProductId) {
                            const product = allProducts.find(p => p.id === expandedProductId)
                            if (product && product.images) {
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
