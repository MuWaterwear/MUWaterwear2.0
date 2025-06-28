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

export default function ApparelPage() {
  const [showContactEmail, setShowContactEmail] = useState(false)
  const [showReturnsPolicy, setShowReturnsPolicy] = useState(false)
  const [showShippingPolicy, setShowShippingPolicy] = useState(false)
  const [expandedDetails, setExpandedDetails] = useState<string | null>(null)
  
  // Product data with categories - All products from lake pages imported
  const allProducts = [
    // HOODIES CATEGORY - REMOVED LINDBERGH SKI HOODIE



    // T-SHIRTS CATEGORY
    {
      id: "tee-lindbergh-swim",
      name: "Lindbergh Swim Tee",
      category: "tees",
      description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and classic crew neckline for easy layering—ideal in bot...",
      price: 33,
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
      featured: true,
      lake: "Lindbergh"
    },

    {
      id: "tee-cda-swim",
      name: "CDA Swim Tee",
      category: "tees",
      description: "Lightweight swim tee with the \"Swim CDA\" design print Product features - Available in sizes S to 4XL to ensure a perfect fit for everyone. - Constructed with durable double-needle stitching for enha...",
      price: 33,
      images: [
        "/images/CDA-SWIM-TEE/Green.png",
        "/images/CDA-SWIM-TEE/Midnight-Blue.png",
        "/images/CDA-SWIM-TEE/Red.png",
        "/images/CDA-SWIM-TEE/Red-Backside.png"
      ],
      colors: [
        { name: "Green", hex: "#059669" },
        { name: "Midnight Blue", hex: "#1E3A8A" },
        { name: "Red", hex: "#DC2626" },
        { name: "Red Backside", hex: "#DC2626" }
      ],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: true,
      lake: "Coeur d'Alene"
    },


    {
      id: "tee-lindbergh-pocket",
      name: "Lindbergh - Charles Pocket Tee",
      category: "tees",
      description: "Classic pocket t-shirt featuring Charles Lindbergh aviation design. Celebrates the spirit of adventure and pioneering aviation history at Lindbergh Lake. Premium cotton construction with vintage-inspi...",
      price: 33,
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
      featured: true,
      lake: "Lindbergh"
    },
    {
      id: "tee-lake-tahoe-kings-beach",
      name: "Lake Tahoe Kings Beach T-Shirt",
      category: "tees",
      description: "Introducing our versatile Unisex Garment-Dyed T-shirt, a wardrobe essential designed for style and comfort. This T-shirt offers a relaxed fit that keeps you feeling great whether you\'re out with frie...'s iconic Kings Beach destination",
      price: 33,
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
        { name: "Island Green Back", hex: "#059669" },
        { name: "Island Reef", hex: "#0891B2" },
        { name: "Island Reef Back", hex: "#0891B2" },
        { name: "Butter", hex: "#FCD34D" },
        { name: "Butter Back", hex: "#FCD34D" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      lake: "Lake Tahoe"
    },
    // MU BRAND APPAREL - ORGANIZED BY CATEGORY
    
    // 1. MU TEES
    {
      id: "tee-mu-gets-dark",
      name: "MU Gets Dark Tee",
      category: "tees",
      description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and classic crew neckline for easy layering—ideal in bot...",
      price: 35,
      images: [
        "/images/MU-GETS-DARK-TEE/Back, Black .png",
        "/images/MU-GETS-DARK-TEE/Front, Black.png"
      ],
      colors: [
        { name: "Black Back", hex: "#000000" },
        { name: "Black", hex: "#000000" }
      ],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: true,
      lake: "MU Brand"
    },
    {
      id: "tee-mu-iswim",
      name: "MU ISwim Tee",
      category: "tees",
      description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and classic crew neckline for easy layering—ideal in bot...",
      price: 35,
      images: [
        "/images/MU-ISWIM-TEE/Back, Black.png",
        "/images/MU-ISWIM-TEE/Front, Black.png"
      ],
      colors: [
        { name: "Black Back", hex: "#000000" },
        { name: "Black", hex: "#000000" }
      ],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: true,
      lake: "MU Brand"
    },
    {
      id: "tee-mu-wager",
      name: "MU Wager Tee",
      category: "tees",
      description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and classic crew neckline for easy layering—ideal in bot...",
      price: 35,
      images: [
        "/images/MU-WAGER-TEE/Back, Black.png",
        "/images/MU-WAGER-TEE/Front, Black.png"
      ],
      colors: [
        { name: "Black Back", hex: "#000000" },
        { name: "Black", hex: "#000000" }
      ],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: true,
      lake: "MU Brand"
    },
    {
      id: "tee-mu-ski-rip",
      name: "MU Ski Rip Tee",
      category: "tees",
      description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and classic crew neckline for easy layering—ideal in bot...",
      price: 35,
      images: [
        "/images/MU-SKI-RIP-TEE/Back, Black.png",
        "/images/MU-SKI-RIP-TEE/Front, Black.png",
        "/images/MU-SKI-RIP-TEE/Back, Lagoon Blue.png",
        "/images/MU-SKI-RIP-TEE/Back, Seafoam.png",
        "/images/MU-SKI-RIP-TEE/Back, Island Reef.png",
        "/images/MU-SKI-RIP-TEE/Back, Bay.png",
        "/images/MU-SKI-RIP-TEE/Back, Ivory.png",
        "/images/MU-SKI-RIP-TEE/Back, Boysenberry.png"
      ],
      colors: [
        { name: "Black Back", hex: "#000000" },
        { name: "Black", hex: "#000000" },
        { name: "Lagoon Blue", hex: "#0891B2" },
        { name: "Seafoam", hex: "#34D399" },
        { name: "Island Reef", hex: "#0EA5E9" },
        { name: "Bay", hex: "#7DD3FC" },
        { name: "Ivory", hex: "#FEF7CD" },
        { name: "Boysenberry", hex: "#7C3AED" }
      ],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: true,
      lake: "MU Brand"
    },
    {
      id: "tee-mu-wake-community",
      name: "MU Wake Community Tee",
      category: "tees",
      description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and classic crew neckline for easy layering—ideal in bot...",
      price: 35,
      images: [
        "/images/MU-WAKE-COMMUNITY-TEE/Back, Topaz Blue.png",
        "/images/MU-WAKE-COMMUNITY-TEE/Front, Topaz Blue.png",
        "/images/MU-WAKE-COMMUNITY-TEE/Front, Peony.png",
        "/images/MU-WAKE-COMMUNITY-TEE/Back, Peony.png",
        "/images/MU-WAKE-COMMUNITY-TEE/Front, Black.png",
        "/images/MU-WAKE-COMMUNITY-TEE/Back, Black.png",
        "/images/MU-WAKE-COMMUNITY-TEE/Front, Midnight.png",
        "/images/MU-WAKE-COMMUNITY-TEE/Back, Midnight.png",
        "/images/MU-WAKE-COMMUNITY-TEE/Front, Lagoon Blue.png",
        "/images/MU-WAKE-COMMUNITY-TEE/Back, Lagoon Blue.png",
        "/images/MU-WAKE-COMMUNITY-TEE/Front, Khaki.png",
        "/images/MU-WAKE-COMMUNITY-TEE/Back, Khaki.png"
      ],
      colors: [
        { name: "Topaz Blue Back", hex: "#0EA5E9" },
        { name: "Topaz Blue", hex: "#0EA5E9" },
        { name: "Peony", hex: "#FB7185" },
        { name: "Peony Back", hex: "#FB7185" },
        { name: "Black", hex: "#000000" },
        { name: "Black Back", hex: "#000000" },
        { name: "Midnight", hex: "#1E3A8A" },
        { name: "Midnight Back", hex: "#1E3A8A" },
        { name: "Lagoon Blue", hex: "#0891B2" },
        { name: "Lagoon Blue Back", hex: "#0891B2" },
        { name: "Khaki", hex: "#8B7355" },
        { name: "Khaki Back", hex: "#8B7355" }
      ],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: true,
      lake: "MU Brand"
    },
    
    // 2. MU SWIMWEAR - REORDERED
    {
      id: "swim-mu-ocean-green-one-piece",
      name: "MU Ocean Green One-Piece Swimsuit",
      category: "swim",
      description: "Premium all-over print one-piece swimsuit from MU Waterwear. Built for performance and style with ocean green-inspired design.",
      price: 31,
      images: [
        "/images/MU-OCEAN-GREEN-ONE-PIECE-SWIMSUIT/second.png",
        "/images/MU-OCEAN-GREEN-ONE-PIECE-SWIMSUIT/first.png",
        "/images/MU-OCEAN-GREEN-ONE-PIECE-SWIMSUIT/all-over-print-one-piece-swimsuit-white-front-685af42d8dfb2.png",
        "/images/MU-OCEAN-GREEN-ONE-PIECE-SWIMSUIT/all-over-print-one-piece-swimsuit-white-back-685af42d8e1b4.png",
        "/images/MU-OCEAN-GREEN-ONE-PIECE-SWIMSUIT/all-over-print-one-piece-swimsuit-white-left-685af42d8e12a.png",
        "/images/MU-OCEAN-GREEN-ONE-PIECE-SWIMSUIT/all-over-print-one-piece-swimsuit-white-right-685af42d8e089.png",
        "/images/MU-OCEAN-GREEN-ONE-PIECE-SWIMSUIT/all-over-print-one-piece-swimsuit-white-left-back-685af42d8e2dd.png",
        "/images/MU-OCEAN-GREEN-ONE-PIECE-SWIMSUIT/all-over-print-one-piece-swimsuit-white-right-back-685af42d8e370.png"
      ],
      colors: [
        { name: "Featured Alt", hex: "#4ADE80" },
        { name: "Featured View", hex: "#4ADE80" },
        { name: "Front View", hex: "#4ADE80" },
        { name: "Back View", hex: "#4ADE80" },
        { name: "Left Side", hex: "#4ADE80" },
        { name: "Right Side", hex: "#4ADE80" },
        { name: "Left Back", hex: "#4ADE80" },
        { name: "Right Back", hex: "#4ADE80" }
      ],
      sizes: ["XS", "S", "M", "L", "XL"],
      featured: true,
      lake: "MU Brand"
    },
    {
      id: "swim-mu-ocean-green-shorts",
      name: "MU Ocean Green Swim Shorts",
      category: "swim",
      description: "Premium MU Ocean Green Swim Shorts",
      price: 30,
      images: [
        "/images/MU-OCEAN-GREEN-SWIM-SHORTS/18.svg",
        "/images/MU-OCEAN-GREEN-SWIM-SHORTS/19.svg"
      ],
      colors: [
        { name: "Style 1", hex: "#4ADE80" },
        { name: "Style 2", hex: "#4ADE80" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      lake: "MU Brand"
    },
    {
      id: "swim-mu-red-tide-onepiece",
      name: "MU Red Tide One-Piece Swimsuit",
      category: "swim",
      description: "Premium one-piece swimsuit from MU Waterwear. Designed for performance and style in the water.",
      price: 31,
      images: [
        "/images/MU-RED-TIDE-ONE-PIECE-SWIMSUIT/FRONT(2) .png",
        "/images/MU-RED-TIDE-ONE-PIECE-SWIMSUIT/FRONT.png",
        "/images/MU-RED-TIDE-ONE-PIECE-SWIMSUIT/BACK.png",
        "/images/MU-RED-TIDE-ONE-PIECE-SWIMSUIT/SIDE.png",
        "/images/MU-RED-TIDE-ONE-PIECE-SWIMSUIT/BACK (2).png",
        "/images/MU-RED-TIDE-ONE-PIECE-SWIMSUIT/BACK(2) .png"
      ],
      colors: [
        { name: "Front (2)", hex: "#DC2626" },
        { name: "Front", hex: "#DC2626" },
        { name: "Back", hex: "#DC2626" },
        { name: "Side", hex: "#DC2626" },
        { name: "Back View 2", hex: "#DC2626" },
        { name: "Back View 3", hex: "#DC2626" }
      ],
      sizes: ["XS", "S", "M", "L", "XL"],
      featured: true,
      lake: "MU Brand"
    },
    {
      id: "swim-mu-red-tide",
      name: "MU Red Tide Swim Shorts",
      category: "swim",
      description: "Premium MU Red Tide Swim Shorts Product features - 100% polyester for durability and strength - Quick-drying fabric ensures comfort all summer - Adjustable drawstring waist for a perfect fit - Conveni...",
      price: 30,
      images: [
        "/images/MU-RED-TIDE-SWIM-SHORTS/Front.png"
      ],
      colors: [
        { name: "Red Tide", hex: "#DC2626" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      lake: "MU Brand"
    },
    {
      id: "swim-mu-sky-blue-one-piece",
      name: "MU Sky Blue One-Piece Swimsuit",
      category: "swim",
      description: "Premium all-over print one-piece swimsuit from MU Waterwear. Built for performance and style with sky blue-inspired design.",
      price: 31,
      images: [
        "/images/MU-SKY-BLUE-ONEPIECE-SWIMSUIT/FIRST FEATURED IMAGE.png",
        "/images/MU-SKY-BLUE-ONEPIECE-SWIMSUIT/SECOND FEATURED IMAGE.png",
        "/images/MU-SKY-BLUE-ONEPIECE-SWIMSUIT/all-over-print-one-piece-swimsuit-white-front-6859d4903b767.png",
        "/images/MU-SKY-BLUE-ONEPIECE-SWIMSUIT/all-over-print-one-piece-swimsuit-white-back-6859d4903b92c.png",
        "/images/MU-SKY-BLUE-ONEPIECE-SWIMSUIT/all-over-print-one-piece-swimsuit-white-left-6859d4903b8a0.png",
        "/images/MU-SKY-BLUE-ONEPIECE-SWIMSUIT/all-over-print-one-piece-swimsuit-white-right-6859d4903b7fd.png",
        "/images/MU-SKY-BLUE-ONEPIECE-SWIMSUIT/all-over-print-one-piece-swimsuit-white-left-back-6859d4903ba37.png",
        "/images/MU-SKY-BLUE-ONEPIECE-SWIMSUIT/all-over-print-one-piece-swimsuit-white-right-back-6859d4903babb.png"
      ],
      colors: [
        { name: "Featured View", hex: "#87CEEB" },
        { name: "Featured Alt", hex: "#87CEEB" },
        { name: "Front View", hex: "#87CEEB" },
        { name: "Back View", hex: "#87CEEB" },
        { name: "Left Side", hex: "#87CEEB" },
        { name: "Right Side", hex: "#87CEEB" },
        { name: "Left Back", hex: "#87CEEB" },
        { name: "Right Back", hex: "#87CEEB" }
      ],
      sizes: ["XS", "S", "M", "L", "XL"],
      featured: true,
      lake: "MU Brand"
    },
    {
      id: "swim-mu-sky-blue-shorts",
      name: "MU Sky Blue Swim Shorts",
      category: "swim",
      description: "Premium MU Sky Blue Swim Shorts Product features - Premium Material: Made of 95% polyester and 5% spandex for a soft, lightweight touch. - Adjustable Fit: Features an elastic waistband with drawstring...",
      price: 30,
      images: [
        "/images/MU-SKY-BLUE-SWIM-SHORTS/15.svg",
        "/images/MU-SKY-BLUE-SWIM-SHORTS/16.svg"
      ],
      colors: [
        { name: "Style 1", hex: "#87CEEB" },
        { name: "Style 2", hex: "#87CEEB" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      lake: "MU Brand"
    },
    
    // 3. MU RASH GUARDS
    {
      id: "swim-mu-light-blue-rash-guard",
      name: "MU Light Blue Rash Guard",
      category: "swim",
      description: "Premium all-over print men's rash guard from MU Waterwear. UV protection with light blue-inspired design for water sports and sun protection.",
      price: 40,
      images: [
        "/images/MU-LIGHT-BLUE-RASH-GAURD/SECOND-FEATURED-IMAGE (2).png",
        "/images/MU-LIGHT-BLUE-RASH-GAURD/SECOND-FEATURED-IMAGE (1).png",
        "/images/MU-LIGHT-BLUE-RASH-GAURD/all-over-print-mens-rash-guard-white-front-6859da5647695.png"
      ],
      colors: [
        { name: "Featured Alt", hex: "#ADD8E6" },
        { name: "Featured View", hex: "#ADD8E6" },
        { name: "Front View", hex: "#ADD8E6" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      lake: "MU Brand"
    },
    
    // 4. MU SUN-PROTECTION HOODIE
    {
      id: "uv-mu-sun-protection-fishing",
      name: "MU Sun Protection Fishing Hoodie",
      category: "uv-protection",
      description: "Crafted from an ultra-lightweight, moisture-wicking fabric, this hoodie is designed to keep you cool and comfortable while you\'re on the water. Product features - 100% durable polyester maintains sha...",
      price: 42,
      images: [
        "/images/MU-SUN-PROTECTION-FISHING-HOODIE/Back.png",
        "/images/MU-SUN-PROTECTION-FISHING-HOODIE/Front.png"
      ],
      colors: [
        { name: "Back", hex: "#2D3748" },
        { name: "Front", hex: "#2D3748" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      lake: "MU Brand"
    },

    // FLATHEAD LAKE T-SHIRTS
    {
      id: "tee-flathead-board",
      name: "Flathead Board Tee",
      category: "tees",
      description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and classic crew neckline for easy layering—ideal in bot...",
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
      lake: "Flathead Lake"
    },
    {
      id: "tee-flathead-dive",
      name: "Flathead Dive Tee",
      category: "tees",
      description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and classic crew neckline for easy layering—ideal in bot...",
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
      lake: "Flathead Lake"
    },
    {
      id: "tee-flathead-fish",
      name: "Flathead Fish Tee",
      category: "tees",
      description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and classic crew neckline for easy layering—ideal in bot...",
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
      lake: "Flathead Lake"
    },
    {
      id: "tee-flathead-lake",
      name: "Flathead Lake Tee",
      category: "tees",
      description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and classic crew neckline for easy layering—ideal in bot...'s natural jewel.",
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
      lake: "Flathead Lake"
    },
    {
      id: "tee-flathead-ski",
      name: "Flathead Ski Tee",
      category: "tees",
      description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and classic crew neckline for easy layering—ideal in bot...'s winter sports with this ski-inspired design.",
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
      lake: "Flathead Lake"
    },
    {
      id: "tee-flathead-surf",
      name: "Flathead Surf Tee",
      category: "tees",
      description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and classic crew neckline for easy layering—ideal in bot...'s up at Flathead Lake! Classic surf-inspired design for mountain lake lovers.",
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
      lake: "Flathead Lake"
    },

    // LAKE TAHOE T-SHIRTS
    {
      id: "tee-tahoe-surf",
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
        { name: "Black Back", hex: "#000000" },
        { name: "Black", hex: "#000000" },
        { name: "Khaki", hex: "#92400E" },
        { name: "Khaki Back", hex: "#92400E" },
        { name: "White", hex: "#FFFFFF" },
        { name: "White Back", hex: "#FFFFFF" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      lake: "Lake Tahoe"
    },
    {
      id: "tee-tahoe-board",
      name: "Tahoe Board Tee",
      category: "tees",
      description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and classic crew neckline for easy layering—ideal in bot...",
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
        { name: "Bay", hex: "#7DD3FC" },
        { name: "Black", hex: "#000000" },
        { name: "Khaki Back", hex: "#8B7355" },
        { name: "Watermelon", hex: "#FB7185" },
        { name: "White", hex: "#FFFFFF" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      lake: "Lake Tahoe"
    },
    {
      id: "tee-tahoe-dive",
      name: "Tahoe Dive Tee",
      category: "tees",
      description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and classic crew neckline for easy layering—ideal in bot...'s crystal-clear alpine waters with this premium tee.",
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
        { name: "Black", hex: "#000000" },
        { name: "Khaki Back", hex: "#8B7355" },
        { name: "True Navy", hex: "#1E3A8A" },
        { name: "Watermelon", hex: "#FB7185" },
        { name: "White", hex: "#FFFFFF" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      lake: "Lake Tahoe"
    },
    {
      id: "tee-tahoe-fish",
      name: "Tahoe Fish Tee",
      category: "tees",
      description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and classic crew neckline for easy layering—ideal in bot...",
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
        { name: "Khaki Back", hex: "#8B7355" },
        { name: "Black", hex: "#000000" },
        { name: "Khaki", hex: "#8B7355" },
        { name: "True Navy", hex: "#1E3A8A" },
        { name: "Watermelon", hex: "#FB7185" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      lake: "Lake Tahoe"
    },
    {
      id: "tee-tahoe-lake",
      name: "Tahoe Lake Tee",
      category: "tees",
      description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and classic crew neckline for easy layering—ideal in bot...'s alpine jewel.",
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
        { name: "Khaki Back", hex: "#8B7355" },
        { name: "Black", hex: "#000000" },
        { name: "Khaki", hex: "#8B7355" },
        { name: "True Navy", hex: "#1E3A8A" },
        { name: "Watermelon", hex: "#FB7185" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      lake: "Lake Tahoe"
    },
    {
      id: "tee-tahoe-ski",
      name: "Tahoe Ski Tee",
      category: "tees",
      description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and classic crew neckline for easy layering—ideal in bot...'s legendary ski culture with this alpine-inspired design.",
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
        { name: "Bay", hex: "#7DD3FC" },
        { name: "Black", hex: "#000000" },
        { name: "Khaki Back", hex: "#8B7355" },
        { name: "True Navy", hex: "#1E3A8A" },
        { name: "White", hex: "#FFFFFF" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      lake: "Lake Tahoe"
    },

    // DETROIT LAKE T-SHIRTS
    {
      id: "tee-detroit-board",
      name: "Detroit Board Tee",
      category: "tees",
      description: "<p>Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd&sup2; or 206.8 g/m&sup2;). Designed with a relaxed fit and classic crew neckline for easy layering...",
      price: 33,
      images: [
        "/images/DETROIT-APPAREL/DETROIT-BOARD-TEE/Back, Black.png",
        "/images/DETROIT-APPAREL/DETROIT-BOARD-TEE/Front, Watermelon.png",
        "/images/DETROIT-APPAREL/DETROIT-BOARD-TEE/Back, Watermelon.png",
        "/images/DETROIT-APPAREL/DETROIT-BOARD-TEE/Back, Khaki.png",
        "/images/DETROIT-APPAREL/DETROIT-BOARD-TEE/Back, True Navy.png",
        "/images/DETROIT-APPAREL/DETROIT-BOARD-TEE/Back, White.png"
      ],
      colors: [
        { name: "Black", hex: "#000000" },
        { name: "Watermelon", hex: "#FB7185" },
        { name: "Watermelon Back", hex: "#FB7185" },
        { name: "Khaki", hex: "#8B7355" },
        { name: "True Navy", hex: "#1E3A8A" },
        { name: "White", hex: "#FFFFFF" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      lake: "Detroit Lake"
    },
    {
      id: "tee-detroit-dive",
      name: "Detroit Dive Tee",
      category: "tees",
      description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and classic crew neckline for easy layering—ideal in bot...",
      price: 33,
      images: [
        "/images/DETROIT-APPAREL/DETROIT-DIVE-TEE/Back, True Navy.png",
        "/images/DETROIT-APPAREL/DETROIT-DIVE-TEE/Front, Watermelon.png",
        "/images/DETROIT-APPAREL/DETROIT-DIVE-TEE/Back, Watermelon.png",
        "/images/DETROIT-APPAREL/DETROIT-DIVE-TEE/Back, Black.png",
        "/images/DETROIT-APPAREL/DETROIT-DIVE-TEE/Back, Khaki.png",
        "/images/DETROIT-APPAREL/DETROIT-DIVE-TEE/Back, White.png"
      ],
      colors: [
        { name: "True Navy", hex: "#1E3A8A" },
        { name: "Watermelon", hex: "#FB7185" },
        { name: "Watermelon Back", hex: "#FB7185" },
        { name: "Black", hex: "#000000" },
        { name: "Khaki", hex: "#8B7355" },
        { name: "White", hex: "#FFFFFF" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      lake: "Detroit Lake"
    },
    {
      id: "tee-detroit-fish",
      name: "Detroit Fish Tee",
      category: "tees",
      description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and classic crew neckline for easy layering—ideal in bot...",
      price: 33,
      images: [
        "/images/DETROIT-APPAREL/DETROIT-FISH-TEE/Front, Sage.png",
        "/images/DETROIT-APPAREL/DETROIT-FISH-TEE/Front, Watermelon.png",
        "/images/DETROIT-APPAREL/DETROIT-FISH-TEE/Back, Watermelon.png",
        "/images/DETROIT-APPAREL/DETROIT-FISH-TEE/Front, Black.png",
        "/images/DETROIT-APPAREL/DETROIT-FISH-TEE/Front, Khaki.png",
        "/images/DETROIT-APPAREL/DETROIT-FISH-TEE/Front, True Navy.png"
      ],
      colors: [
        { name: "Sage", hex: "#87A96B" },
        { name: "Watermelon", hex: "#FB7185" },
        { name: "Watermelon Back", hex: "#FB7185" },
        { name: "Black", hex: "#000000" },
        { name: "Khaki", hex: "#8B7355" },
        { name: "True Navy", hex: "#1E3A8A" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      lake: "Detroit Lake"
    },
    {
      id: "tee-detroit-ski",
      name: "Detroit Ski Tee",
      category: "tees",
      description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and classic crew neckline for easy layering—ideal in bot...'s winter sports with this ski-inspired design.",
      price: 33,
      images: [
        "/images/DETROIT-APPAREL/DETROIT-SKI-TEE/Back, Khaki.png",
        "/images/DETROIT-APPAREL/DETROIT-SKI-TEE/Front, Watermelon.png",
        "/images/DETROIT-APPAREL/DETROIT-SKI-TEE/Back, Watermelon.png",
        "/images/DETROIT-APPAREL/DETROIT-SKI-TEE/Back, Black.png",
        "/images/DETROIT-APPAREL/DETROIT-SKI-TEE/Back, True Navy.png",
        "/images/DETROIT-APPAREL/DETROIT-SKI-TEE/Back, White.png"
      ],
      colors: [
        { name: "Khaki", hex: "#8B7355" },
        { name: "Watermelon", hex: "#FB7185" },
        { name: "Watermelon Back", hex: "#FB7185" },
        { name: "Black", hex: "#000000" },
        { name: "True Navy", hex: "#1E3A8A" },
        { name: "White", hex: "#FFFFFF" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      lake: "Detroit Lake"
    },
    {
      id: "tee-detroit-surf",
      name: "Detroit Surf Tee",
      category: "tees",
      description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and classic crew neckline for easy layering—ideal in bot...'s up at Detroit Lake! Classic surf-inspired design for lake lovers.",
      price: 33,
      images: [
        "/images/DETROIT-APPAREL/DETROIT-SURF-TEE/Back, White.png",
        "/images/DETROIT-APPAREL/DETROIT-SURF-TEE/Front, Watermelon.png",
        "/images/DETROIT-APPAREL/DETROIT-SURF-TEE/Back, Watermelon.png",
        "/images/DETROIT-APPAREL/DETROIT-SURF-TEE/Back, Black.png",
        "/images/DETROIT-APPAREL/DETROIT-SURF-TEE/Back, Khaki.png",
        "/images/DETROIT-APPAREL/DETROIT-SURF-TEE/Back, True Navy.png"
      ],
      colors: [
        { name: "White", hex: "#FFFFFF" },
        { name: "Watermelon", hex: "#FB7185" },
        { name: "Watermelon Back", hex: "#FB7185" },
        { name: "Black", hex: "#000000" },
        { name: "Khaki", hex: "#8B7355" },
        { name: "True Navy", hex: "#1E3A8A" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      lake: "Detroit Lake"
    },
    {
      id: "tee-detroit-traditional-logo",
      name: "Detroit Traditional Logo Tee",
      category: "tees",
      description: "Classic Detroit Lake logo tee. Timeless design for true lake enthusiasts.",
      price: 33,
      images: [
        "/images/DETROIT-APPAREL/DETROIT-TRADITIONAL-LOGO-TEE/Front, Watermelon.png",
        "/images/DETROIT-APPAREL/DETROIT-TRADITIONAL-LOGO-TEE/Back, Watermelon.png",
        "/images/DETROIT-APPAREL/DETROIT-TRADITIONAL-LOGO-TEE/Front, Black.png",
        "/images/DETROIT-APPAREL/DETROIT-TRADITIONAL-LOGO-TEE/Front, Khaki.png",
        "/images/DETROIT-APPAREL/DETROIT-TRADITIONAL-LOGO-TEE/Front, True Navy.png",
        "/images/DETROIT-APPAREL/DETROIT-TRADITIONAL-LOGO-TEE/Front, White.png"
      ],
      colors: [
        { name: "Watermelon", hex: "#FB7185" },
        { name: "Watermelon Back", hex: "#FB7185" },
        { name: "Black", hex: "#000000" },
        { name: "Khaki", hex: "#8B7355" },
        { name: "True Navy", hex: "#1E3A8A" },
        { name: "White", hex: "#FFFFFF" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      lake: "Detroit Lake"
    },
    {
      id: "tee-detroit-waterski",
      name: "Detroit Waterski Tee",
      category: "tees",
      description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and classic crew neckline for easy layering—ideal in bot...",
      price: 33,
      images: [
        "/images/DETROIT-APPAREL/DETROIT-WATERSKI-TEE/Front, Peony.png",
        "/images/DETROIT-APPAREL/DETROIT-WATERSKI-TEE/Back, Peony.png",
        "/images/DETROIT-APPAREL/DETROIT-WATERSKI-TEE/Front, Black.png",
        "/images/DETROIT-APPAREL/DETROIT-WATERSKI-TEE/Back, Black.png",
        "/images/DETROIT-APPAREL/DETROIT-WATERSKI-TEE/Front, Burnt Orange.png",
        "/images/DETROIT-APPAREL/DETROIT-WATERSKI-TEE/Back, Burnt Orange.png",
        "/images/DETROIT-APPAREL/DETROIT-WATERSKI-TEE/Front, Midnight.png",
        "/images/DETROIT-APPAREL/DETROIT-WATERSKI-TEE/Back, Midnight.png",
        "/images/DETROIT-APPAREL/DETROIT-WATERSKI-TEE/Front, Topaz Blue.png",
        "/images/DETROIT-APPAREL/DETROIT-WATERSKI-TEE/Back, Topaz Blue.png"
      ],
      colors: [
        { name: "Peony", hex: "#DB2777" },
        { name: "Peony Back", hex: "#DB2777" },
        { name: "Black", hex: "#000000" },
        { name: "Black Back", hex: "#000000" },
        { name: "Burnt Orange", hex: "#EA580C" },
        { name: "Burnt Orange Back", hex: "#EA580C" },
        { name: "Midnight", hex: "#1E293B" },
        { name: "Midnight Back", hex: "#1E293B" },
        { name: "Topaz Blue", hex: "#0EA5E9" },
        { name: "Topaz Blue Back", hex: "#0EA5E9" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      lake: "Detroit Lake"
    },

    // LINDBERGH LAKE T-SHIRTS (NEW APPAREL COLLECTION)
    {
      id: "tee-lindbergh-board",
      name: "Lindbergh Board Tee",
      category: "tees",
      description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and classic crew neckline for easy layering—ideal in bot...",
      price: 33,
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
      lake: "Lindbergh Lake"
    },
    {
      id: "tee-lindbergh-dive",
      name: "Lindbergh Dive Tee",
      category: "tees",
      description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and classic crew neckline for easy layering—ideal in bot...",
      price: 33,
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
      lake: "Lindbergh Lake"
    },
    {
      id: "tee-lindbergh-fish-apparel",
      name: "Lindbergh Fish Tee",
      category: "tees",
      description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and classic crew neckline for easy layering—ideal in bot...",
      price: 33,
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
      lake: "Lindbergh Lake"
    },
    {
      id: "tee-lindbergh-lake-apparel",
      name: "Lindbergh Lake Tee",
      category: "tees",
      description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and classic crew neckline for easy layering—ideal in bot...'s pristine mountain waters.",
      price: 33,
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
      lake: "Lindbergh Lake"
    },
    {
      id: "tee-lindbergh-ski-apparel",
      name: "Lindbergh Ski Tee",
      category: "tees",
      description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and classic crew neckline for easy layering—ideal in bot...'s winter sports with this ski-inspired design.",
      price: 33,
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
      lake: "Lindbergh Lake"
    },
    {
      id: "tee-lindbergh-surf-apparel",
      name: "Lindbergh Surf Tee",
      category: "tees",
      description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and classic crew neckline for easy layering—ideal in bot...'s up at Lindbergh Lake! Classic surf-inspired design for mountain lake lovers.",
      price: 33,
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
      lake: "Lindbergh Lake"
    },

    // LAKE WASHINGTON T-SHIRTS
    {
      id: "tee-washington-board",
      name: "Washington Board Tee",
      category: "tees",
      description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and classic crew neckline for easy layering—ideal in bot...",
      price: 33,
      images: [
        "/images/LAKE-WA-APPAREL/WASHINGTON-BOARD-TEE/Back, Black.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-BOARD-TEE/Back, Bay.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-BOARD-TEE/Back, Khaki.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-BOARD-TEE/Back, True Navy.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-BOARD-TEE/Back, Watermelon.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-BOARD-TEE/Back, White.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-BOARD-TEE/Front, True Navy.png"
      ],
      colors: [
        { name: "Black", hex: "#000000" },
        { name: "Bay", hex: "#7DD3FC" },
        { name: "Khaki", hex: "#8B7355" },
        { name: "True Navy", hex: "#1E3A8A" },
        { name: "Watermelon", hex: "#FB7185" },
        { name: "White", hex: "#FFFFFF" },
        { name: "True Navy Front", hex: "#1E3A8A" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      lake: "Lake Washington"
    },
    {
      id: "tee-washington-dive",
      name: "Washington Dive Tee",
      category: "tees",
      description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and classic crew neckline for easy layering—ideal in bot...",
      price: 33,
      images: [
        "/images/LAKE-WA-APPAREL/WASHINGTON-DIVE-TEE/Back, Khaki.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-DIVE-TEE/Back, Bay.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-DIVE-TEE/Back, Black.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-DIVE-TEE/Back, True Navy.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-DIVE-TEE/Back, Watermelon.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-DIVE-TEE/Back, White.png"
      ],
      colors: [
        { name: "Khaki", hex: "#8B7355" },
        { name: "Bay", hex: "#7DD3FC" },
        { name: "Black", hex: "#000000" },
        { name: "True Navy", hex: "#1E3A8A" },
        { name: "Watermelon", hex: "#FB7185" },
        { name: "White", hex: "#FFFFFF" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      lake: "Lake Washington"
    },
    {
      id: "tee-washington-fish",
      name: "Washington Fish Tee",
      category: "tees",
      description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and classic crew neckline for easy layering—ideal in bot...",
      price: 33,
      images: [
        "/images/LAKE-WA-APPAREL/WASHINGTON-FISH-TEE/Front, Watermelon.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-FISH-TEE/Front, Bay.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-FISH-TEE/Front, Black.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-FISH-TEE/Front, Khaki.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-FISH-TEE/Front, Sage.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-FISH-TEE/Front, True Navy.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-FISH-TEE/Back, True Navy.png"
      ],
      colors: [
        { name: "Watermelon", hex: "#FB7185" },
        { name: "Bay", hex: "#7DD3FC" },
        { name: "Black", hex: "#000000" },
        { name: "Khaki", hex: "#8B7355" },
        { name: "Sage", hex: "#87A96B" },
        { name: "True Navy", hex: "#1E3A8A" },
        { name: "True Navy Back", hex: "#1E3A8A" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      lake: "Lake Washington"
    },
    {
      id: "tee-washington-lake",
      name: "Washington Lake Tee",
      category: "tees",
      description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and classic crew neckline for easy layering—ideal in bot...'s natural beauty.",
      price: 33,
      images: [
        "/images/LAKE-WA-APPAREL/WASHINGTON-LAKE-TEE/Front, White.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-LAKE-TEE/Front, Bay.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-LAKE-TEE/Front, Black.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-LAKE-TEE/Front, Khaki.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-LAKE-TEE/Front, True Navy.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-LAKE-TEE/Front, Watermelon.png"
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
      lake: "Lake Washington"
    },
    {
      id: "tee-washington-ski",
      name: "Washington Ski Tee",
      category: "tees",
      description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and classic crew neckline for easy layering—ideal in bot...'s winter sports with this ski-inspired design.",
      price: 33,
      images: [
        "/images/LAKE-WA-APPAREL/WASHINGTON-SKI-TEE/Back, Bay.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-SKI-TEE/Back, Black.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-SKI-TEE/Back, Khaki.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-SKI-TEE/Back, True Navy.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-SKI-TEE/Back, Watermelon.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-SKI-TEE/Back, White.png"
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
      lake: "Lake Washington"
    },
    {
      id: "tee-washington-surf",
      name: "Washington Surf Tee",
      category: "tees",
      description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and classic crew neckline for easy layering—ideal in bot...'s up at Lake Washington! Classic surf-inspired design for Pacific Northwest lake lovers.",
      price: 33,
      images: [
        "/images/LAKE-WA-APPAREL/WASHINGTON-SURF-TEE/Back, True Navy.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-SURF-TEE/Back, Bay.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-SURF-TEE/Back, Black.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-SURF-TEE/Back, Khaki.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-SURF-TEE/Back, Watermelon.png",
        "/images/LAKE-WA-APPAREL/WASHINGTON-SURF-TEE/Back, White.png"
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
      lake: "Lake Washington"
    },

    // LONG SLEEVE CATEGORY
    {
      id: "longsleeve-washington-boat",
      name: "Washington Boat Long Sleeve",
      category: "long-sleeve",
      description: "Made with 100% ring-spun cotton, these personalized long-sleeve shirts come packed with softness and style. Each tee features garment-dyed fabric and comes with a relaxed fit for total comfort in any ...'s boating culture.",
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
      lake: "Lake Washington"
    },
    {
      id: "longsleeve-lindbergh-swim",
      name: "Lindbergh Swim Long Sleeve Shirt",
      category: "long-sleeve",
      description: "Garment-dyed for a lived-in look and designed with a relaxed, classic fit for total comfort in any casual setting. 100% ring-spun cotton Medium-weight fabric (6.1 oz/yd² or 206.8 g/m²) Classic relaxed...",
      price: 40,
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
      featured: true,
      lake: "Lindbergh"
    },
    {
      id: "longsleeve-cda-sail",
      name: "CDA Sail Long Sleeve Shirt",
      category: "long-sleeve",
      description: "Long Sleeve Sailing Shirt with Sail CDA design print Product features - Durable double needle sleeve and bottom hems for long-lasting wear. - Elastic ribbed-knit cuffs retain their shape perfectly. - ...",
      price: 40,
      images: [
        "/images/CDA-SAIL-LONG-SLEEVE-SHIRT/Ivory.png",
        "/images/CDA-SAIL-LONG-SLEEVE-SHIRT/Ivory-Backside.png",
        "/images/CDA-SAIL-LONG-SLEEVE-SHIRT/Ocean-Blue.png",
        "/images/CDA-SAIL-LONG-SLEEVE-SHIRT/Salmon.png"
      ],
      colors: [
        { name: "Ivory", hex: "#F5F5DC" },
        { name: "Ivory Backside", hex: "#F5F5DC" },
        { name: "Ocean Blue", hex: "#0891B2" },
        { name: "Salmon", hex: "#FA8072" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      lake: "Coeur d'Alene"
    },
    {
      id: "longsleeve-cda-swim",
      name: "CDA Swim Long Sleeve Shirt",
      category: "long-sleeve",
      description: "CDA swim Long Sleeve Shirt designed for those who swim in Lake Coeur D\' Alene Product features - Durable double needle sleeve and bottom hems for longevity. - Ribbed-knit cuffs that retain shape and ...",
      price: 40,
      images: [
        "/images/CDA-SWIM-LONG-SLEEVE-SHIRT/Sea-Green.png",
        "/images/CDA-SWIM-LONG-SLEEVE-SHIRT/Light-Blue.png",
        "/images/CDA-SWIM-LONG-SLEEVE-SHIRT/Dark-Green.png",
        "/images/CDA-SWIM-LONG-SLEEVE-SHIRT/Ocean-Blue-Backside.png"
      ],
      colors: [
        { name: "Sea Green", hex: "#20B2AA" },
        { name: "Light Blue", hex: "#87CEEB" },
        { name: "Dark Green", hex: "#006400" },
        { name: "Ocean Blue Backside", hex: "#0891B2" }
      ],
        sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      lake: "Coeur d'Alene"
    },


    // POLOS CATEGORY
    {
      id: "polo-lindbergh-adidas",
      name: "Lindbergh Adidas Polo",
      category: "polos",
      description: "Premium Adidas polo featuring Lindbergh Lake branding. Made with moisture-wicking technology and classic fit design perfect for both casual wear and active pursuits. Available in multiple front view o...",
      price: 58,
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
      featured: true,
      lake: "Lindbergh"
    },
    {
      id: "polo-cda-performance",
      name: "CDA Under Armour Performance Polo",
      category: "polos",
      description: "Premium Under Armour polo with moisture-wicking technology",
      price: 65,
      images: [
        "/images/CDA-UNDER-ARMOR-POLO/under-armour-mens-polo-shirt-black-front-685a34c055c76.png",
        "/images/CDA-UNDER-ARMOR-POLO/under-armour-mens-polo-shirt-navy-front-685a34c055fc0.png",
        "/images/CDA-UNDER-ARMOR-POLO/under-armour-mens-polo-shirt-grey-front-685a34c0560fb.png"
      ],
      colors: [
        { name: "Black", hex: "#000000" },
        { name: "Navy", hex: "#1E3A8A" },
        { name: "Grey", hex: "#6B7280" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      lake: "Coeur d'Alene"
    },
    {
      id: "polo-detroit-performance",
      name: "Detroit Under Armour Performance Polo",
      category: "polos",
      description: "Premium Under Armour polo with moisture-wicking technology for Detroit Lake adventures",
      price: 65,
      images: [
        "/images/DETROIT-UNDER-ARMOR-POLO/under-armour-mens-polo-shirt-navy-front-685a419a516b9.png",
        "/images/DETROIT-UNDER-ARMOR-POLO/under-armour-mens-polo-shirt-black-front-685a419a5105b.png",
        "/images/DETROIT-UNDER-ARMOR-POLO/under-armour-mens-polo-shirt-grey-front-685a419a517e7.png"
      ],
      colors: [
        { name: "Navy", hex: "#1E3A8A" },
        { name: "Black", hex: "#000000" },
        { name: "Grey", hex: "#6B7280" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      lake: "Detroit Lake"
    },
    {
      id: "polo-flathead-performance",
      name: "Flathead Under Armour Performance Polo",
      category: "polos",
      description: "Premium Under Armour polo with moisture-wicking technology for Flathead Lake adventures",
      price: 65,
      images: [
        "/images/FLATHEAD-UNDER-ARMOR-POLO/under-armour-mens-polo-shirt-grey-front-685a36acf1215.png",
        "/images/FLATHEAD-UNDER-ARMOR-POLO/under-armour-mens-polo-shirt-navy-front-685a36acf10e7.png",
        "/images/FLATHEAD-UNDER-ARMOR-POLO/under-armour-mens-polo-shirt-black-front-685a36acf0e18.png"
      ],
      colors: [
        { name: "Grey", hex: "#6B7280" },
        { name: "Navy", hex: "#1E3A8A" },
        { name: "Black", hex: "#000000" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      lake: "Flathead Lake"
    },
    {
      id: "polo-lindbergh-performance",
      name: "Lindbergh Under Armour Performance Polo",
      category: "polos",
      description: "Premium Under Armour polo with moisture-wicking technology for Lindbergh Lake adventures",
      price: 65,
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
      featured: true,
      lake: "Lindbergh Lake"
    },
    {
      id: "polo-tahoe-performance",
      name: "Tahoe Under Armour Performance Polo",
      category: "polos",
      description: "Premium Under Armour polo with moisture-wicking technology for Lake Tahoe adventures",
      price: 65,
      images: [
        "/images/TAHOE-UNDER-ARMOR-POLO/under-armour-mens-polo-shirt-navy-front-685a41b58bd50.png",
        "/images/TAHOE-UNDER-ARMOR-POLO/under-armour-mens-polo-shirt-black-front-685a41b58b5bc.png",
        "/images/TAHOE-UNDER-ARMOR-POLO/under-armour-mens-polo-shirt-grey-front-685a41b58bf71.png"
      ],
      colors: [
        { name: "Navy", hex: "#1E3A8A" },
        { name: "Black", hex: "#000000" },
        { name: "Grey", hex: "#6B7280" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      lake: "Lake Tahoe"
    },
    {
      id: "polo-washington-performance",
      name: "Washington Under Armour Performance Polo",
      category: "polos",
      description: "Premium Under Armour polo with moisture-wicking technology for Lake Washington adventures",
      price: 65,
      images: [
        "/images/WASHINGTON-UNDER-ARMOR-POLO/under-armour-mens-polo-shirt-navy-front-685a41fd72841.png",
        "/images/WASHINGTON-UNDER-ARMOR-POLO/under-armour-mens-polo-shirt-grey-front-685a41fd72988.png",
        "/images/WASHINGTON-UNDER-ARMOR-POLO/under-armour-mens-polo-shirt-black-front-685a41fd72504.png"
      ],
      colors: [
        { name: "Navy", hex: "#1E3A8A" },
        { name: "Grey", hex: "#6B7280" },
        { name: "Black", hex: "#000000" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: true,
      lake: "Lake Washington"
    },

    // SWIMWEAR CATEGORY











    // FLATHEAD T-SHIRTS - WATERSKI TEE
         {
       id: "tee-flathead-waterski",
       name: "Flathead Waterski Tee",
       category: "tees",
       description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and classic crew neckline for easy layering—ideal in bot...'s legendary water sports culture with front and back design views.",
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
      details: "Premium waterski t-shirt celebrating Flathead Lake's legendary water sports culture. Features exclusive front and back design views showcasing Montana's premier waterski destination with stunning mountain lake backdrop.",
      featuresList: [
        "Premium waterski design graphics",
        "Front and back view options",
        "5 unique color combinations",
        "Montana mountain lake inspired",
        "Flathead waterski tribute",
                 "Premium comfort fit"
       ]
     },

     // CDA T-SHIRTS - WATERSKI TEE
     {
       id: "tee-cda-waterski",
       name: "CDA Waterski Tee",
       category: "tees",
       description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and classic crew neckline for easy layering—ideal in bot...'Alene's legendary water sports culture with front and back design views.",
       price: 33,
       images: [
         "/images/CDA-APPAREL/CDA-WATERSKI-TEE/Front, Peony.png",
         "/images/CDA-APPAREL/CDA-WATERSKI-TEE/Back, Peony.png",
         "/images/CDA-APPAREL/CDA-WATERSKI-TEE/Front, Black.png",
         "/images/CDA-APPAREL/CDA-WATERSKI-TEE/Back, Black.png",
         "/images/CDA-APPAREL/CDA-WATERSKI-TEE/Front, Midnight.png",
         "/images/CDA-APPAREL/CDA-WATERSKI-TEE/Back, Midnight.png",
         "/images/CDA-APPAREL/CDA-WATERSKI-TEE/Front, Topaz Blue.png",
         "/images/CDA-APPAREL/CDA-WATERSKI-TEE/Back, Topaz Blue.png",
         "/images/CDA-APPAREL/CDA-WATERSKI-TEE/Front, Burnt Orange.png",
         "/images/CDA-APPAREL/CDA-WATERSKI-TEE/Back, Burnt Orange.png"
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
       lake: "Coeur d'Alene",
       details: "Premium waterski t-shirt celebrating Coeur d'Alene's legendary water sports culture. Features exclusive front and back design views showcasing Idaho's premier waterski destination with crystal-clear lake waters.",
       featuresList: [
         "Premium waterski design graphics",
         "Front and back view options",
         "5 unique color combinations",
         "Idaho crystal lake inspired",
         "CDA waterski tribute",
         "Premium comfort fit"
       ]
     },

     // WASHINGTON T-SHIRTS - WATERSKI TEE
     {
       id: "tee-washington-waterski",
       name: "Washington Waterski Tee",
       category: "tees",
       description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and classic crew neckline for easy layering—ideal in bot...'s legendary water sports culture with front and back design views.",
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
       lake: "Lake Washington",
       details: "Premium waterski t-shirt celebrating Lake Washington's legendary water sports culture. Features exclusive front and back design views showcasing Washington's premier waterski destination with Pacific Northwest lake waters.",
       featuresList: [
         "Premium waterski design graphics",
         "Front and back view options",
         "5 unique color combinations",
         "Pacific Northwest lake inspired",
         "Washington waterski tribute",
         "Premium comfort fit"
       ]
     },

     // LINDBERGH T-SHIRTS - WATERSKI TEE
     {
       id: "tee-lindbergh-waterski",
       name: "Lindbergh Waterski Tee",
       category: "tees",
       description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and classic crew neckline for easy layering—ideal in bot...'s legendary water sports culture with front and back design views.",
       price: 33,
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
       lake: "Lindbergh Lake",
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

     // TAHOE T-SHIRTS - WATERSKI TEE
     {
       id: "tee-tahoe-waterski",
       name: "Tahoe Waterski Tee",
       category: "tees",
       description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and classic crew neckline for easy layering—ideal in bot...'s legendary water sports culture with front and back design views.",
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
       details: "Premium waterski t-shirt celebrating Lake Tahoe's legendary water sports culture. Features exclusive front and back design views showcasing California's premier alpine lake destination with crystal-clear waters.",
       featuresList: [
         "Premium waterski design graphics",
         "Front and back view options",
         "5 unique color combinations",
         "Alpine lake inspired design",
         "Lake Tahoe waterski tribute",
         "Premium comfort fit"
       ]
     },

     // CDA T-SHIRTS - FISH TEE
     {
       id: "tee-cda-fish",
       name: "CDA Fish Tee",
       category: "tees",
       description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and classic crew neckline for easy layering—ideal in bot...'Alene's legendary fishing culture with front and back design views.",
       price: 33,
       images: [
         "/images/CDA-APPAREL/CDA-FISH-TEE/Front, Sage.png",
         "/images/CDA-APPAREL/CDA-FISH-TEE/Back, Sage.png",
         "/images/CDA-APPAREL/CDA-FISH-TEE/Front, Watermelon.png",
         "/images/CDA-APPAREL/CDA-FISH-TEE/Front, Black.png",
         "/images/CDA-APPAREL/CDA-FISH-TEE/Front, True Navy.png",
         "/images/CDA-APPAREL/CDA-FISH-TEE/Front, Bay.png",
         "/images/CDA-APPAREL/CDA-FISH-TEE/Front, Khaki.png"
       ],
       colors: [
         { name: "Sage", hex: "#9CAF88" },
         { name: "Sage Back", hex: "#9CAF88" },
         { name: "Watermelon", hex: "#FF6B6B" },
         { name: "Black", hex: "#000000" },
         { name: "True Navy", hex: "#1F2937" },
         { name: "Bay", hex: "#0891B2" },
         { name: "Khaki", hex: "#D4B896" }
       ],
       sizes: ["XS", "S", "M", "L", "XL", "XXL"],
       featured: true,
       lake: "Coeur d'Alene",
       details: "Premium fishing t-shirt celebrating Coeur d'Alene's legendary fishing culture. Features exclusive front and back design views showcasing Idaho's premier fishing destination with crystal-clear lake waters.",
       featuresList: [
         "Premium fishing design graphics",
         "Front and back view options",
         "6 unique color combinations",
         "Idaho fishing tribute",
         "CDA lake fishing culture",
         "Premium comfort fit"
       ]
     },

     // CDA T-SHIRTS - LAKE TEE
     {
       id: "tee-cda-lake",
       name: "CDA Lake Tee",
       category: "tees",
       description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and classic crew neckline for easy layering—ideal in bot...'Alene's pristine waters with front and back design views.",
       price: 33,
       images: [
         "/images/CDA-APPAREL/CDA-LAKE-TEE/Front, White.png",
         "/images/CDA-APPAREL/CDA-LAKE-TEE/Back, White.png",
         "/images/CDA-APPAREL/CDA-LAKE-TEE/Front, Khaki.png",
         "/images/CDA-APPAREL/CDA-LAKE-TEE/Front, Watermelon.png",
         "/images/CDA-APPAREL/CDA-LAKE-TEE/Front, Black.png",
         "/images/CDA-APPAREL/CDA-LAKE-TEE/Front, True Navy.png",
         "/images/CDA-APPAREL/CDA-LAKE-TEE/Front, Bay.png"
       ],
       colors: [
         { name: "White", hex: "#FFFFFF" },
         { name: "White Back", hex: "#FFFFFF" },
         { name: "Khaki", hex: "#D4B896" },
         { name: "Watermelon", hex: "#FF6B6B" },
         { name: "Black", hex: "#000000" },
         { name: "True Navy", hex: "#1F2937" },
         { name: "Bay", hex: "#0891B2" }
       ],
       sizes: ["XS", "S", "M", "L", "XL", "XXL"],
       featured: true,
       lake: "Coeur d'Alene",
       details: "Premium lake t-shirt celebrating Coeur d'Alene's pristine waters. Features exclusive front and back design views showcasing Idaho's premier lake destination with stunning natural beauty.",
       featuresList: [
         "Premium lake design graphics",
         "Front and back view options",
         "6 unique color combinations",
         "Idaho pristine waters tribute",
         "CDA lake culture design",
         "Premium comfort fit"
       ]
     },

     // CDA T-SHIRTS - SKI TEE
     {
       id: "tee-cda-ski",
       name: "CDA Ski Tee",
       category: "tees",
       description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and classic crew neckline for easy layering—ideal in bot...'Alene's winter sports culture with front and back design views.",
       price: 33,
       images: [
         "/images/CDA-APPAREL/CDA-SKI-TEE/Back, White.png",
         "/images/CDA-APPAREL/CDA-SKI-TEE/Back, Watermelon.png",
         "/images/CDA-APPAREL/CDA-SKI-TEE/Back, Black.png",
         "/images/CDA-APPAREL/CDA-SKI-TEE/Back, True Navy.png",
         "/images/CDA-APPAREL/CDA-SKI-TEE/Back, Bay.png",
         "/images/CDA-APPAREL/CDA-SKI-TEE/Back, Khaki.png",
         "/images/CDA-APPAREL/CDA-SKI-TEE/Back, White.png"
       ],
       colors: [
         { name: "White", hex: "#FFFFFF" },
         { name: "Watermelon Back", hex: "#FF6B6B" },
         { name: "Black Back", hex: "#000000" },
         { name: "True Navy Back", hex: "#1F2937" },
         { name: "Bay Back", hex: "#0891B2" },
         { name: "Khaki Back", hex: "#D4B896" },
         { name: "White Back", hex: "#FFFFFF" }
       ],
       sizes: ["XS", "S", "M", "L", "XL", "XXL"],
       featured: true,
       lake: "Coeur d'Alene",
       details: "Premium ski t-shirt celebrating Coeur d'Alene's winter sports culture. Features exclusive front and back design views showcasing Idaho's premier winter destination with mountain lake backdrop.",
       featuresList: [
         "Premium ski design graphics",
         "Front and back view options",
         "6 unique color combinations",
         "Idaho winter sports tribute",
         "CDA ski culture design",
         "Premium comfort fit"
       ]
     },

     // CDA T-SHIRTS - SURF TEE
     {
       id: "tee-cda-surf",
       name: "CDA Surf Tee",
       category: "tees",
       description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and classic crew neckline for easy layering—ideal in bot...'Alene's water sports culture with front and back design views.",
       price: 33,
       images: [
         "/images/CDA-APPAREL/CDA-SURF-TEE/Back, Bay.png",
         "/images/CDA-APPAREL/CDA-SURF-TEE/Back, Watermelon.png",
         "/images/CDA-APPAREL/CDA-SURF-TEE/Back, Black.png",
         "/images/CDA-APPAREL/CDA-SURF-TEE/Back, True Navy.png",
         "/images/CDA-APPAREL/CDA-SURF-TEE/Back, Khaki.png",
         "/images/CDA-APPAREL/CDA-SURF-TEE/Back, White.png"
       ],
       colors: [
         { name: "Bay Back", hex: "#0891B2" },
         { name: "Watermelon Back", hex: "#FF6B6B" },
         { name: "Black Back", hex: "#000000" },
         { name: "True Navy Back", hex: "#1F2937" },
         { name: "Khaki Back", hex: "#D4B896" },
         { name: "White Back", hex: "#FFFFFF" }
       ],
       sizes: ["XS", "S", "M", "L", "XL", "XXL"],
       featured: true,
       lake: "Coeur d'Alene",
       details: "Premium surf t-shirt celebrating Coeur d'Alene's water sports culture. Features exclusive front and back design views showcasing Idaho's premier surf destination with pristine lake waters.",
       featuresList: [
         "Premium surf design graphics",
         "Front and back view options",
         "6 unique color combinations",
         "Idaho water sports tribute",
         "CDA surf culture design",
         "Premium comfort fit"
       ]
     },

     // CDA T-SHIRTS - BOARD TEE
     {
       id: "tee-cda-board",
       name: "CDA Board Tee",
       category: "tees",
       description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and classic crew neckline for easy layering—ideal in bot...'Alene's boarding culture with front and back design views.",
       price: 33,
       images: [
         "/images/CDA-APPAREL/CDA-BOARD-TEE/Back, Black.png",
         "/images/CDA-APPAREL/CDA-BOARD-TEE/Back, Watermelon.png",
         "/images/CDA-APPAREL/CDA-BOARD-TEE/Back, Black.png",
         "/images/CDA-APPAREL/CDA-BOARD-TEE/Back, True Navy.png",
         "/images/CDA-APPAREL/CDA-BOARD-TEE/Back, Bay.png",
         "/images/CDA-APPAREL/CDA-BOARD-TEE/Back, Khaki.png",
         "/images/CDA-APPAREL/CDA-BOARD-TEE/Back, White.png"
       ],
       colors: [
         { name: "White", hex: "#FFFFFF" },
         { name: "Watermelon Back", hex: "#FF6B6B" },
         { name: "Black Back", hex: "#000000" },
         { name: "True Navy Back", hex: "#1F2937" },
         { name: "Bay Back", hex: "#0891B2" },
         { name: "Khaki Back", hex: "#D4B896" },
         { name: "White Back", hex: "#FFFFFF" }
       ],
       sizes: ["XS", "S", "M", "L", "XL", "XXL"],
       featured: true,
       lake: "Coeur d'Alene",
       details: "Premium board t-shirt celebrating Coeur d'Alene's boarding culture. Features exclusive front and back design views showcasing Idaho's premier boarding destination with crystal-clear lake waters.",
       featuresList: [
         "Premium board design graphics",
         "Front and back view options",
         "6 unique color combinations",
         "Idaho boarding tribute",
         "CDA board culture design",
         "Premium comfort fit"
       ]
     },

     // CDA T-SHIRTS - DIVE TEE
     {
       id: "tee-cda-dive",
       name: "CDA Dive Tee",
       category: "tees",
       description: "Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and classic crew neckline for easy layering—ideal in bot...'Alene's diving culture with front and back design views.",
       price: 33,
       images: [
         "/images/CDA-APPAREL/CDA-DIVE-TEE/Back, Bay.png",
         "/images/CDA-APPAREL/CDA-DIVE-TEE/Back, Watermelon.png",
         "/images/CDA-APPAREL/CDA-DIVE-TEE/Back, Black.png",
         "/images/CDA-APPAREL/CDA-DIVE-TEE/Back, True Navy.png",
         "/images/CDA-APPAREL/CDA-DIVE-TEE/Back, Bay.png",
         "/images/CDA-APPAREL/CDA-DIVE-TEE/Back, Khaki.png",
         "/images/CDA-APPAREL/CDA-DIVE-TEE/Back, White.png"
       ],
       colors: [
         { name: "White", hex: "#FFFFFF" },
         { name: "Watermelon Back", hex: "#FF6B6B" },
         { name: "Black Back", hex: "#000000" },
         { name: "True Navy Back", hex: "#1F2937" },
         { name: "Bay Back", hex: "#0891B2" },
         { name: "Khaki Back", hex: "#D4B896" },
         { name: "White Back", hex: "#FFFFFF" }
       ],
       sizes: ["XS", "S", "M", "L", "XL", "XXL"],
       featured: true,
       lake: "Coeur d'Alene",
       details: "Premium dive t-shirt celebrating Coeur d'Alene's diving culture. Features exclusive front and back design views showcasing Idaho's premier diving destination with pristine lake waters.",
       featuresList: [
         "Premium dive design graphics",
         "Front and back view options",
         "6 unique color combinations",
         "Idaho diving tribute",
         "CDA dive culture design",
         "Premium comfort fit"
       ]
     }
  ]

  const categories = [
    { id: "all", name: "All Products", count: allProducts.length },
    { id: "hoodies", name: "Hoodies", count: allProducts.filter(p => p.category === "hoodies").length },
    { id: "tees", name: "T-Shirts", count: allProducts.filter(p => p.category === "tees").length },
    { id: "long-sleeve", name: "Long Sleeve", count: allProducts.filter(p => p.category === "long-sleeve").length },
    { id: "polos", name: "Polos", count: allProducts.filter(p => p.category === "polos").length },
    { id: "swim", name: "Swimwear", count: allProducts.filter(p => p.category === "swim").length },
    { id: "uv-protection", name: "Sun Protection", count: allProducts.filter(p => p.category === "uv-protection").length }
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

  // Filter and sort products based on selected category
  const filteredProducts = (selectedCategory === "all" 
    ? allProducts 
    : allProducts.filter(p => p.category === selectedCategory))
    .sort((a, b) => {
      // MU products first, in specified order
      const aStartsWithMU = a.name.startsWith("MU")
      const bStartsWithMU = b.name.startsWith("MU")
      
      if (aStartsWithMU && !bStartsWithMU) return -1
      if (!aStartsWithMU && bStartsWithMU) return 1
      
      // For MU products, preserve the array order (don't sort alphabetically)
      if (aStartsWithMU && bStartsWithMU) {
        const aIndex = allProducts.findIndex(p => p.id === a.id)
        const bIndex = allProducts.findIndex(p => p.id === b.id)
        return aIndex - bIndex
      }
      
      // For non-MU products, sort alphabetically
      return a.name.localeCompare(b.name)
    })

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

  const toggleDetails = (productId: string) => {
    setExpandedDetails(expandedDetails === productId ? null : productId)
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
          <source src="/videos/Apparel.mp4" type="video/mp4" />
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
                    product.id === 'uv-mu-paddleboard' 
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
                            product.id === 'uv-mu-paddleboard' 
                              ? 'object-cover scale-150 group-hover:scale-[1.7]' 
                              : product.id === 'swim-mu-ocean-green-shorts'
                              ? 'object-cover scale-[1.6] group-hover:scale-[1.8]'
                              : product.id === 'swim-mu-sky-blue-shorts'
                              ? 'object-cover scale-100 group-hover:scale-[1.2]'
                              : 'object-cover group-hover:scale-110'
                          }`}
                        />
                      </div>
                      
                      {/* Expand icon overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
                        <div className={`bg-black/50 rounded-full p-3 ${
                          product.id === 'uv-mu-paddleboard' 
                            ? 'transform group-hover:scale-110 transition-transform duration-300' 
                            : ''
                        }`}>
                          <svg className={`text-white fill-none stroke-current ${
                            product.id === 'uv-mu-paddleboard' ? 'w-10 h-10' : 'w-8 h-8'
                          }`} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </div>

                      {/* Featured Badge */}
                      {product.featured && (
                        <div className={`absolute top-3 left-3 backdrop-blur-sm text-xs font-medium px-3 py-1 rounded-full border transition-all duration-300 ${
                          product.id === 'uv-mu-paddleboard' 
                            ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/30 text-cyan-300 border-cyan-400/50 group-hover:from-cyan-500/50 group-hover:to-blue-500/50 group-hover:text-cyan-200 group-hover:border-cyan-300/70 animate-pulse' 
                            : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                        }`}>
                          {product.id === 'uv-mu-paddleboard' ? '✨ PREMIUM' : 'FEATURED'}
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

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleQuickAdd(product)}
                            className="flex-1 py-2 bg-slate-800 hover:bg-cyan-500 text-white hover:text-slate-950 rounded text-sm font-medium transition-all duration-200"
                          >
                            Add to Cart
                          </button>
                          <button
                            onClick={() => toggleDetails(product.id)}
                            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm font-medium transition-all duration-200"
                          >
                            {expandedDetails === product.id ? '↑' : '↓'}
                          </button>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {expandedDetails === product.id && (
                        <div className="px-4 pb-4 border-t border-slate-700/50 mt-3 pt-3 space-y-3">
                          <div>
                            <h4 className="text-sm font-medium text-cyan-400 mb-2">Details</h4>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {product.description || "Premium quality apparel designed for water sports enthusiasts. Made with performance materials for comfort and durability."}
                            </p>
                          </div>
                          
                          {(product as any).featuresList && (
                            <div>
                              <h4 className="text-sm font-medium text-cyan-400 mb-2">Features</h4>
                              <ul className="text-xs text-slate-300 space-y-1">
                                {(product as any).featuresList.map((feature: string, index: number) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-cyan-400 mt-0.5">•</span>
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
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
                source="apparel" 
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
            expandedProductId === 'uv-mu-paddleboard' 
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
                    expandedProductId === 'uv-mu-paddleboard' 
                      ? 'max-h-[98vh] min-h-[80vh]' 
                      : 'max-h-[90vh]'
                  }`}
                  style={{
                    transform: `scale(${expandedProductId === 'uv-mu-paddleboard' ? imageZoom * 1.5 : imageZoom}) translate(${imagePosition.x / imageZoom}px, ${imagePosition.y / imageZoom}px)`,
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
