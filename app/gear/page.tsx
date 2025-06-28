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

export default function GearPage() {
  const [showContactEmail, setShowContactEmail] = useState(false)
  const [showReturnsPolicy, setShowReturnsPolicy] = useState(false)
  const [showShippingPolicy, setShowShippingPolicy] = useState(false)
  
  // All gear products with categories
  const allProducts = [
    {
      id: "gear-cascade-backpack",
      name: "CASCADE BACKPACK - STANDARD",
      category: "packs",
      description: "Designed in the Pacific Northwest, made for everywhere. Built with both capacity and convenience in mind, this bag is perfect for daily use. With weather-proof construction that holds up against anything the day throws at you,",
      price: 109,
      images: [
        "/images/gear/Cascade-Backpack-PORTLAND-GEAR/BLACK.png",
        "/images/gear/Cascade-Backpack-PORTLAND-GEAR/GREEN.png",
        "/images/gear/Cascade-Backpack-PORTLAND-GEAR/BEIGE.png", 
        "/images/gear/Cascade-Backpack-PORTLAND-GEAR/2.png",
        "/images/gear/Cascade-Backpack-PORTLAND-GEAR/3.png",
        "/images/gear/Cascade-Backpack-PORTLAND-GEAR/4.png",
        "/images/gear/Cascade-Backpack-PORTLAND-GEAR/5.png"
      ],
      colors: [
        { name: "Black", hex: "#000000" },
        { name: "Green", hex: "#228B22" },
        { name: "Beige", hex: "#D2B48C" }
      ],
      sizes: ["Standard"],
      featured: true,
      rating: 5,
      specs: {
        capacity: "Daily Use",
        weight: "1.08kg (2.38 lb)",
        construction: "Weather-proof",
        design: "Pacific Northwest",
        use: "Work/School/Travel",
        sku: "PG-BAG-CASC-00390"
      }
    },
    {
      id: "gear-cascade-backpack-compact",
      name: "CASCADE BACKPACK - COMPACT",
      category: "packs",
      description: "Compact version of our popular Cascade design. Perfect for urban adventures and daily essentials. Features the same weather-proof construction in a smaller, more streamlined package.",
      price: 99,
      images: [
        "/images/gear/CASCADE-BACKPACK-COMPACT/SIZE-COMPARE.png",
        "/images/gear/CASCADE-BACKPACK-COMPACT/BLACK.png",
        "/images/gear/CASCADE-BACKPACK-COMPACT/NAVY.png",
        "/images/gear/CASCADE-BACKPACK-COMPACT/FOG.png",
        "/images/gear/CASCADE-BACKPACK-COMPACT/ROSE.png",
        "/images/gear/CASCADE-BACKPACK-COMPACT/CREAM.png",
        "/images/gear/CASCADE-BACKPACK-COMPACT/CLOUD.png",
        "/images/gear/CASCADE-BACKPACK-COMPACT/BLUSH.png"
      ],
      colors: [
        { name: "Black", hex: "#000000" },
        { name: "Navy", hex: "#1e3a8a" },
        { name: "Fog", hex: "#9ca3af" },
        { name: "Rose", hex: "#f43f5e" },
        { name: "Cream", hex: "#fef3c7" },
        { name: "Cloud", hex: "#e5e7eb" },
        { name: "Blush", hex: "#fecaca" }
      ],
      sizes: ["Standard"],
      featured: true,
      rating: 5,
      specs: {
        capacity: "13.5-liter",
        weight: "2 lbs (32 oz)",
        construction: "Weather-proof",
        design: "Pacific Northwest",
        use: "Urban/Daily",
        sku: "PG-BAG-CASC-COMPACT"
      }
    },
    {
      id: "gear-cascade-duffle-bag",
      name: "CASCADE DUFFLE BAG",
      category: "packs",
      description: "Large capacity duffle bag designed for extended adventures. Built with the same weather-proof construction and Pacific Northwest durability. Perfect for travel, gym sessions, or outdoor expeditions.",
      price: 133,
      images: [
        "/images/gear/CASCADE-DUFFLE-BAG/BLACK.png",
        "/images/gear/CASCADE-DUFFLE-BAG/NAVY.png",
        "/images/gear/CASCADE-DUFFLE-BAG/FOG.png",
        "/images/gear/CASCADE-DUFFLE-BAG/SKY.png",
        "/images/gear/CASCADE-DUFFLE-BAG/CREAM.png",
        "/images/gear/CASCADE-DUFFLE-BAG/BLUSH.png",
        "/images/gear/CASCADE-DUFFLE-BAG/7.png",
        "/images/gear/CASCADE-DUFFLE-BAG/8.png",
        "/images/gear/CASCADE-DUFFLE-BAG/9.png"
      ],
      colors: [
        { name: "Black", hex: "#000000" },
        { name: "Navy", hex: "#1e3a8a" },
        { name: "Fog", hex: "#9ca3af" },
        { name: "Sky", hex: "#87ceeb" },
        { name: "Cream", hex: "#f5f5dc" },
        { name: "Blush", hex: "#de5d83" }
      ],
      sizes: ["Standard"],
      featured: true,
      rating: 5,
      specs: {
        capacity: "35-liter",
        weight: "3.15 lbs (50.4 oz)",
        construction: "Weather-proof",
        design: "Pacific Northwest",
        use: "Travel/Gym/Outdoor",
        sku: "PG-BAG-CASC-DUFFLE"
      }
    },
    {
      id: "gear-cascade-crossbody-bag",
      name: "CASCADE CROSSBODY BAG",
      category: "packs",
      description: "Compact crossbody bag designed for urban adventures and daily essentials. Features the same weather-proof construction and Pacific Northwest durability in a convenient hands-free design. Perfect for commuting, travel, and everyday carry.",
      price: 59,
      images: [
        "/images/gear/Cascade Crossbody Bag/BLACK.png",
        "/images/gear/Cascade Crossbody Bag/NAVY.png",
        "/images/gear/Cascade Crossbody Bag/FOG.png",
        "/images/gear/Cascade Crossbody Bag/SKY.png",
        "/images/gear/Cascade Crossbody Bag/CREAM.png",
        "/images/gear/Cascade Crossbody Bag/BLUSH.png",
        "/images/gear/Cascade Crossbody Bag/7.png",
        "/images/gear/Cascade Crossbody Bag/8.png"
      ],
      colors: [
        { name: "Black", hex: "#000000" },
        { name: "Navy", hex: "#1e3a8a" },
        { name: "Fog", hex: "#9ca3af" },
        { name: "Sky", hex: "#87ceeb" },
        { name: "Cream", hex: "#f5f5dc" },
        { name: "Blush", hex: "#de5d83" }
      ],
      sizes: ["Standard"],
      featured: true,
      rating: 5,
      specs: {
        capacity: "Compact crossbody",
        weight: "1.5 lbs (24 oz)",
        construction: "Weather-proof",
        design: "Pacific Northwest",
        use: "Urban/Daily/Travel",
        sku: "PG-BAG-CASC-CROSSBODY"
      }
    },
    {
      id: "gear-2025-mens-sprint-wetsuit",
      name: "2025 MENS SPRINT WETSUIT",
      category: "diving",
      description: "Our most comfortable entry-level wetsuit with super-thin, chafe-free neck and 5mm buoyant neoprene for extra lift. Features flexible arms and precision patterning for unrestricted movement. Made in USA.",
      price: 295,
      images: [
        "/images/gear/2025-MENS-SPRINT-WETSUIT/1.png",
        "/images/gear/2025-MENS-SPRINT-WETSUIT/2.png"
      ],
      colors: [
        { name: "Standard", hex: "#1a1a1a" }
      ],
      sizes: ["XS", "SM", "SMT", "M", "MT", "ML", "L", "XL", "XXL"],
      soldOutSizes: ["M", "ML", "XL"],
      featured: true,
      rating: 5,
      specs: {
        weight: "4 lb (1.81 kg)",
        construction: "5mm buoyant neoprene",
        features: "Chafe-free neck, flexible arms",
        origin: "Made in United States",
        use: "Swimming/Triathlon",
        sku: "SPRINT-WETSUIT-2025-MENS"
      }
    },
    {
      id: "gear-2025-mens-fusion-wetsuit",
      name: "2025 MENS FUSION WETSUIT",
      category: "diving",
      description: "Mid-level wetsuit with strategically placed 5mm buoyant neoprene in legs for extra lift and streamlined positioning. Features tapered neckline for reduced restriction and premium flexible neoprene in arms. Made in USA.",
      price: 344,
      images: [
        "/images/gear/2025-MENS-FUSION-WETSUIT/6.png",
        "/images/gear/2025-MENS-FUSION-WETSUIT/5.png"
      ],
      colors: [
        { name: "Standard", hex: "#1a1a1a" }
      ],
      sizes: ["XS", "SM", "SMT", "M", "MT", "ML", "L", "XL", "XXL"],
      soldOutSizes: ["XS", "M", "XXL"],
      featured: true,
      rating: 5,
      specs: {
        weight: "4 lb (1.81 kg)",
        construction: "5mm buoyant neoprene in legs",
        features: "Tapered neckline, flexible arms",
        origin: "Made in United States",
        use: "Swimming/Triathlon",
        sku: "FUSION-WETSUIT-2025-MENS"
      }
    },
    {
      id: "gear-2025-mens-thermal-wetsuit",
      name: "2025 MENS THERMAL WETSUIT",
      category: "diving",
      description: "Cold water won't slow you down; neither should your wetsuit. The Thermal Reaction is built for athletes who demand speed, agility, and warmth in equal measure. Engineered with premium Yamamoto neoprene and a mid-weight zirconium jersey lining, the Thermal Reaction delivers fast-drying insulation, exceptional flexibility, and the thermal protection you need to push your limits in frigid conditions. Designed for total freedom in your stroke, the Thermal Reaction features our unique single-piece shoulder panel; seamless, unrestricted, and built for fluid, natural movement. Ultra-flexible neoprene in the arms eliminates resistance, ensuring pure power through every phase of your swim.",
      price: 720,
      images: [
        "/images/gear/2025-MENS-THERMAL-WETSUIT/8.png",
        "/images/gear/2025-MENS-THERMAL-WETSUIT/7.png"
      ],
      colors: [
        { name: "Standard", hex: "#1a1a1a" }
      ],
      sizes: ["XS", "SM", "SMT", "M", "MT", "ML", "L", "XL", "XXL"],
      soldOutSizes: ["XS", "ML"],
      featured: true,
      rating: 5,
      specs: {
        weight: "4 lb (1.81 kg)",
        construction: "Premium Yamamoto neoprene with zirconium jersey lining",
        features: "Single-piece shoulder panel, ultra-flexible arms",
        origin: "Made in United States",
        use: "Cold water swimming/Triathlon",
        sku: "THERMAL-WETSUIT-2025-MENS"
      }
    },
    {
      id: "gear-2025-womens-sprint-wetsuit",
      name: "2025 WOMENS SPRINT WETSUIT",
      category: "diving",
      description: "Getting into a wetsuit can feel as tough as the swim itself, but the Sprint Wetsuit makes it easier and more comfortable than ever. After years of perfecting the fit, this is our most comfortable entry-level wetsuit yet, designed to help you focus on your swim, not your gear. New this year: a super-thin, single-layer neck that's soft and chafe-free, so you can say goodbye to that \"I can't breathe\" feeling. Plus, 5mm of buoyant neoprene under your hips creates extra lift, making your swim feel smoother and more efficient. Like all our performance wetsuits, the Sprint features flexible neoprene in the arms and precision patterning to eliminate restriction; no pulling, no resistance, just pure freedom through every phase of your stroke.",
      price: 295,
      images: [
        "/images/gear/2025-WOMENS-SPRINT-WETSUIT/12.png",
        "/images/gear/2025-WOMENS-SPRINT-WETSUIT/11.png"
      ],
      colors: [
        { name: "Standard", hex: "#1a1a1a" }
      ],
      sizes: ["WML", "WL"],
      featured: true,
      rating: 5,
      specs: {
        weight: "4 lb (1.81 kg)",
        construction: "5mm buoyant neoprene under hips",
        features: "Super-thin chafe-free neck, flexible arms",
        origin: "Made in United States",
        use: "Swimming/Triathlon",
        sku: "SPRINT-WETSUIT-2025-WOMENS"
      }
    },
    {
      id: "gear-2025-womens-fusion-wetsuit",
      name: "2025 WOMENS FUSION WETSUIT",
      category: "diving",
      description: "Mid-level wetsuit with strategically placed 5mm buoyant neoprene in legs for extra lift and streamlined positioning. Features tapered neckline for reduced restriction and premium flexible neoprene in arms. Made in USA.",
      price: 344,
      images: [
        "/images/gear/2025-WOMENS-FUSION-WESUIT/4.png",
        "/images/gear/2025-WOMENS-FUSION-WESUIT/3.png"
      ],
      colors: [
        { name: "Standard", hex: "#1a1a1a" }
      ],
      sizes: ["WS", "WMS", "WM", "WMA", "WML", "WL", "WLA", "WXLA"],
      featured: true,
      rating: 5,
      specs: {
        weight: "4 lb (1.81 kg)",
        construction: "5mm buoyant neoprene in legs",
        features: "Tapered neckline, flexible arms",
        origin: "Made in United States",
        use: "Swimming/Triathlon",
        sku: "FUSION-WETSUIT-2025-WOMENS"
      }
    },
    {
      id: "gear-2025-womens-thermal-wetsuit",
      name: "2025 WOMENS THERMAL WETSUIT",
      category: "diving",
      description: "Cold water won't slow you down; neither should your wetsuit. The Thermal Reaction is built for athletes who demand speed, agility, and warmth in equal measure. Engineered with premium Yamamoto neoprene and a mid-weight zirconium jersey lining, the Thermal Reaction delivers fast-drying insulation, exceptional flexibility, and the thermal protection you need to push your limits in frigid conditions. Designed for total freedom in your stroke, the Thermal Reaction features our unique single-piece shoulder panel; seamless, unrestricted, and built for fluid, natural movement. Ultra-flexible neoprene in the arms eliminates resistance, ensuring pure power through every phase of your swim.",
      price: 720,
      images: [
        "/images/gear/2025-WOMENS-THERMAL-WETSUIT/10.png",
        "/images/gear/2025-WOMENS-THERMAL-WETSUIT/9.png"
      ],
      colors: [
        { name: "Standard", hex: "#1a1a1a" }
      ],
      sizes: ["WXS", "WS", "WMS", "WM", "WMA", "WML", "WL", "WLA", "WXLA"],
      soldOutSizes: ["WXL"],
      featured: true,
      rating: 5,
      specs: {
        weight: "4 lb (1.81 kg)",
        construction: "Premium Yamamoto neoprene with zirconium jersey lining",
        features: "Single-piece shoulder panel, ultra-flexible arms",
        origin: "Made in United States",
        use: "Cold water swimming/Triathlon",
        sku: "THERMAL-WETSUIT-2025-WOMENS"
      }
    },
    {
      id: "gear-tusa-paragon-mask-energy-orange",
      name: "TUSA PARAGON MASK - ENERGY ORANGE",
      category: "diving",
      description: "Introducing the new advanced M2001S Paragon professional divers mask. The new Paragon mask offers TUSA's NEW Reinforced TRI-MIX frame, Freedom Technology with Fit II, and the UV 420 Lens Treatment with AR and CrystalView Optical Glass which helps you dive with eye protection and ultimate clarity.",
      price: 220,
      images: [
        "/images/gear/Tusa Paragon Mask - Energy Orange/14.png",
        "/images/gear/Tusa Paragon Mask - Energy Orange/13.png"
      ],
      colors: [
        { name: "Energy Orange", hex: "#FF6B35" }
      ],
      sizes: ["One Size"],
      featured: true,
      rating: 5,
      specs: {
        frame: "NEW TRI-MIX Frame",
        technology: "Freedom Technology with Fit II",
        lens: "UV 420 Lens Treatment + Anti-Reflective + CrystalView Optical Glass",
        adjustor: "Angle Strap Adjustor with Side Hold",
        buckle: "NEW Offset Buckle",
        sku: "TUSA-PARAGON-M2001S-ORANGE"
      }
    },
    {
      id: "gear-tusa-hyflex-vesna",
      name: "TUSA HYFLEX VESNA",
      category: "diving",
      description: "The SF0101 TUSA Hyflex Vesna combines TUSA's unique fin design with the latest advanced materials and hydrodynamic innovations. TUSA Hyflex Vesna is powered by TUSA's unique APS \"Active Pivoting System\" technology, the combination of uniquely positioned holes that reduces drag while maintaining constant propulsion. Newly designed \"Comfort Foot Pocket\" enhances performance with multi-compound foot pocket that increases power transfer to the fin blade. Blade vent maximizes propulsion by reducing water resistance and turbulence. Reinforced blade rails and a flexible blade pocket moves a large volume of water. TUSA Reflective material keeps you visible in low light or at night.",
      price: 144,
      images: [
        "/images/gear/TUSA HyFlex Vesna/Untitled design (41).png"
      ],
      colors: [
        { name: "Standard", hex: "#1a1a1a" }
      ],
      sizes: ["M (7-11)"],
      featured: true,
      rating: 5,
      specs: {
        model: "SF0101",
        brand: "TUSA",
        technology: "APS Active Pivoting System",
        footPocket: "Comfort Foot Pocket - Multi-compound design",
        blade: "Reinforced blade rails with flexible blade pocket",
        ventilation: "Blade vent for reduced water resistance",
        visibility: "TUSA Reflective material for low light conditions",
        propulsion: "Uniquely positioned holes reduce drag",
        powerTransfer: "Enhanced power transfer to fin blade",
        use: "Diving/Snorkeling - Advanced Fin Technology"
      }
    },
    {
      id: "gear-havana-inflatable-sup",
      name: "THE HAVANA INFLATABLE STAND UP PADDLEBOARD PACKAGE",
      category: "paddleboards",
      description: "Available in a 10'6\" or 11'3\" board length option. The Havana iSUP is the ultimate light-weight inflatable board. This FULL PACKAGE offers single layer drop-stitch construction, 3 pc fiberglass paddle, reinforced, vented back pack travel bag, dual action Bravo Super pump with PSI gauge, 10' coil leash and repair kit. This compact, turn key, package will allow anyone to get on the water at any time. Blow up, launch board, paddle and enjoy!",
      price: 431, // Base price increased by 44%
      images: [
        "/images/gear/Havana-Inflatable-Stand-Up-Paddleboard-Package/1.png",
        "/images/gear/Havana-Inflatable-Stand-Up-Paddleboard-Package/2.png",
        "/images/gear/Havana-Inflatable-Stand-Up-Paddleboard-Package/3.png",
        "/images/gear/Havana-Inflatable-Stand-Up-Paddleboard-Package/4.png",
        "/images/gear/Havana-Inflatable-Stand-Up-Paddleboard-Package/5.png"
      ],
      colors: [
        { name: "Standard", hex: "#6b7280" }
      ],
      sizes: ["10'6\"", "11'3\""],
      prices: [431, 461], // 10'6" base price, 11'3" with 7% premium
      featured: true,
      rating: 5,
      specs: {
        weight: "34 lb (15.42 kg)",
        dimensions: "37 x 20 x 11 in (94 x 50.8 x 27.9 cm)",
        construction: "Single layer drop-stitch",
        package: "Full package included",
        use: "Inflatable Stand Up Paddleboard",
        sku: "HAVANA-ISUP-PKG"
      }
    },
    {
      id: "gear-high-pressure-sup-printed-beach-paddle-board",
      name: "HIGH PRESSURE STAND UP PRINTED BEACH PADDLE BOARD",
      category: "paddleboards",
      description: "All around inflatable stand up paddle board with an extra bigger size of 305*76*10cm which made of premium military-grade PVC and drop-stitch technology. Perfect fits for all level paddlers under most water conditions. SUP BOARD OF STABLE & EASY MANEUVERABILITY PERFORMANCE - Perfect pulling hall shape with extra width & high quality anti-slip deck material for incredible stability on flat water, lake, river and even choppy water for its all-around design. D-rings are compatible with kayak seat, cooler deck bag and other gears for fishing and etc for variety of activities. SUP board featured with two-layer premium PVC material and advanced drop stitch tech to ensure the toughness and durability during frequent usage providing a hassles-free touring experiences.",
      price: 399,
      images: [
        "/images/gear/High Pressure Stand Up Printed Beach Paddle Boad/1.png",
        "/images/gear/High Pressure Stand Up Printed Beach Paddle Boad/2.png",
        "/images/gear/High Pressure Stand Up Printed Beach Paddle Boad/3.png"
      ],
      colors: [
        { name: "Printed Design", hex: "#4a90e2" }
      ],
      sizes: ["305cm x 76cm x 10cm"],
      featured: true,
      rating: 5,
      specs: {
        weight: "15 lb (6.8 kg)",
        dimensions: "12 x 10 in (30.5 x 25.4 cm)",
        boardSize: "305*76*10cm",
        construction: "Premium military-grade PVC with drop-stitch technology",
        material: "Two-layer premium PVC material",
        stability: "Extra width for incredible stability",
        deck: "High quality anti-slip deck material",
        compatibility: "D-rings compatible with kayak seat, cooler, deck bag",
        use: "All-around SUP for all skill levels",
        waterConditions: "Flat water, lake, river, choppy water"
      }
    },
    {
      id: "gear-hyperlite-shim-wakesurf-board",
      name: "HYPERLITE SHIM WAKESURF BOARD",
      category: "paddleboards",
      description: "The SHIM is perfect for intermediate to advanced riders looking to take their skills to the next level. The SHIM has a fast rocker that allows it to carry speed anywhere on the curl, and its shorter profile makes it super maneuverable for rotational and air tricks. This new shape also features Hyperlite's DuraShell Construction which combines the buoyancy and feel of a high-end EPS board and the durability of a compression molded shape. Overall, the SHIM delivers the best of all worlds and one that a wakesurf enthusiast can't pass up. Hyperlite 5.3 Shim Wakesurf Board.",
      price: 555,
      images: [
        "/images/gear/Hyperlite Shim Wakesurf Board/1.png"
      ],
      colors: [
        { name: "Standard", hex: "#1a1a1a" }
      ],
      sizes: ["4'7\"", "5'3\""],
      featured: true,
      rating: 5,
      specs: {
        weight: "13.00 lb",
        brand: "Hyperlite",
        construction: "DuraShell Construction - EPS with compression molded durability",
        rocker: "Fast rocker for speed retention",
        use: "Wakesurfing - Intermediate to Advanced",
        partNumber: "23340222"
      }
    },
    {
      id: "gear-liquid-force-guapo-wakesurf-board",
      name: "LIQUID FORCE GUAPO WAKESURF BOARD",
      category: "paddleboards",
      description: "The Liquid Force Guapo Wakesurf Board was created with one purpose in mind: fun. This easy to ride longboard shaped wake surfboard delivers a fun and smooth ride behind the boat. The full bodies shape and beveled rails allow for smooth effortless rides and the concave hull keeps the board humming along at a nice pace. Move it forward for a looser feel or shift it back to the rear for a tighter, more driven feel. Relax and loosen your style on the Guapo, hang 5, carve a stylish bottom turn, and head dip into the curl. The Guapo features a EVA surf traction pad for a comfortable feel with plenty of control. This board also includes an adjustable 6.5 fin so you can fine-tune your riding. A hybrid-styled board, the Guapo is recommended for intermediate riders with some experience of wakesurfing.",
      price: 399,
      images: [
        "/images/gear/Liquid Force Guapo Wakesurf Board/2.png"
      ],
      colors: [
        { name: "Standard", hex: "#1a1a1a" }
      ],
      sizes: ["5'2\""],
      featured: true,
      rating: 5,
      specs: {
        length: "5' 2\"",
        width: "20.38\"",
        thickness: "1.79\"",
        rocker: "2.54\" N / 1.91\" T",
        volume: "22.82L",
        weightRange: "Up to 230 lbs",
        brand: "Liquid Force",
        construction: "DuraSurf Construction",
        rockerLine: "Longboard Rocker Line",
        hull: "Single to Double Concave Hull with Spoon Concave Nose",
        fin: "Adjustable 6.5\" Fin",
        rails: "Soft Catch Free Rails",
        pad: "EVA Surf Traction Pad",
        use: "Wakesurfing - Intermediate Hybrid Board"
      }
    },
    {
      id: "gear-obrien-valhalla-wakeboard-access-boots",
      name: "O'BRIEN VALHALLA WAKEBOARD W/ ACCESS BOOTS 2022",
      category: "paddleboards",
      description: "A reliable board for both beginners and pros, the O'Brien Valhalla Wakeboard is a classic-shaped board with value priced performance. This board is ideal for riders who rely on consistent, predictable performance to improve their riding. The Valhalla's Feather Core, tapered thickness profile, and molded fins gives it tons of control from edge to edge. Chevron shaped channels molded into the tip and tail of the board reduces drag for faster edging and a cleaner release off the wake. The Valhalla has a progressive rocker that delivers more vertical pop and predictability compared to boards with 3-stage rockers. This confidence-building machine is perfect for any rider looking to progress their wakeboarding skills. Comes conveniently packaged with a pair of Access Wakeboard Boots featuring open toe design, dual lace zones, and integrated J-bars for maximum control.",
      price: 323,
      images: [
        "/images/gear/O'Brien Valhalla Wakeboard w Access Boots 2022/3.png",
        "/images/gear/O'Brien Valhalla Wakeboard w Access Boots 2022/6.png",
        "/images/gear/O'Brien Valhalla Wakeboard w Access Boots 2022/5.png",
        "/images/gear/O'Brien Valhalla Wakeboard w Access Boots 2022/4.png"
      ],
      colors: [
        { name: "Standard", hex: "#1a1a1a" }
      ],
      sizes: ["Valhalla 138 w/Access 7-11"],
      featured: true,
      rating: 5,
      specs: {
        boardSize: "138cm",
        bootSize: "7-11",
        brand: "O'Brien",
        skillLevel: "Beginner to Intermediate",
        core: "Feather Core",
        rocker: "Progressive Rocker",
        base: "Delta Base",
        edge: "Variable Beveled Edge",
        fins: "Quad Molded In Fins",
        bootFeatures: "Open Toe, Dual Lace Zones, TPU Rear Cuff, Integrated J-bars",
        bootLiner: "Integrated Strobel Lasted Liner",
        footbed: "3D Contoured EVA Footbed",
        chassis: "NEO Canted Chassis",
        use: "Wakeboarding - Beginner to Intermediate Package"
      }
    },
    {
      id: "gear-obrien-sequence-slalom-ski-z9-rts",
      name: "O'BRIEN SEQUENCE SLALOM SKI W/ Z9 & RTS 2020",
      category: "paddleboards",
      description: "O'Brien's Sequence Slalom Ski is a wide-bodied, beginner-friendly slalom. The ski makes light work of deep water starts, helping newer skiers get up out of the water. Its transitional tunnel-to-full concave bottom design results in a ski that is stable yet exceptionally responsive to quick turns and strong pulls. This beginner to intermediate rider ski comes packaged with O'Brien's adjustable Z9 binding and RTS. The Z9 Waterski Binding features a lightweight chassis/plate combination to get your foot as close to the ski as possible. The lower cut to the binding makes for an easier release and gives great flexibility. The front lace system makes this very easy to get in to, and a cinch to snug up. With an EVA footbed, the Z9 is comfortable to wear all day long.",
      price: 0,
      images: [
        "/images/gear/O'Brien Sequence Slalom Ski w Z9 & RTS 2020/7.png",
        "/images/gear/O'Brien Sequence Slalom Ski w Z9 & RTS 2020/9.png",
        "/images/gear/O'Brien Sequence Slalom Ski w Z9 & RTS 2020/8.png"
      ],
      colors: [
        { name: "Standard", hex: "#1a1a1a" }
      ],
      sizes: ["69\" w/ Z9 Binding (Men's 7-11)"],
      featured: true,
      rating: 5,
      specs: {
        skiSize: "69\"",
        bindingSize: "Men's 7-11",
        brand: "O'Brien",
        skillLevel: "Beginner to Intermediate",
        design: "Wide-bodied for easy deep water starts",
        flex: "Sport flex with heavy rocker",
        bottom: "Transitional tunnel-to-full concave",
        bevels: "Large, sharp bevels",
        bindingType: "Z9 Adjustable Binding",
        bindingFeatures: "Lightweight chassis/plate combo, Front lace system",
        footbed: "EVA footbed",
        release: "Lower cut for easier release",
        package: "Includes Z9 binding and RTS",
        use: "Slalom Water Skiing - Beginner to Intermediate"
      }
    },
    {
      id: "gear-hogg-20qt-cooler",
      name: "20QT HOGG COOLER",
      category: "storage",
      description: "Premium 20QT cooler with superior insulation and built-in features. Holds 34 cans with ice, includes bottle opener, fish ruler, cup holders, and drain plug. Perfect for fishing, camping, and outdoor adventures.",
      price: 120,
      images: [
        "/images/gear/HOGG-20-QT-COOLER/WHITE.png",
        "/images/gear/HOGG-20-QT-COOLER/TAN.png",
        "/images/gear/HOGG-20-QT-COOLER/MINT.png",
        "/images/gear/HOGG-20-QT-COOLER/FROSTED-GREY.png",
        "/images/gear/HOGG-20-QT-COOLER/CLEAR-SKY.png",
        "/images/gear/HOGG-20-QT-COOLER/WATERCRESS.png",
        "/images/gear/HOGG-20-QT-COOLER/DESERT-FLOWER.png"
      ],
      colors: [
        { name: "White", hex: "#FFFFFF" },
        { name: "Tan", hex: "#D2B48C" },
        { name: "Mint", hex: "#98FB98" },
        { name: "Frosted Grey", hex: "#A9A9A9" },
        { name: "Clear Sky", hex: "#87CEEB" },
        { name: "Watercress", hex: "#9ACD32" },
        { name: "Desert Flower", hex: "#EDC9AF" }
      ],
      sizes: ["20QT"],
      featured: true,
      rating: 5,
      specs: {
        capacity: "20QT / 34 cans with ice",
        dimensions: "Rectangle shape for optimal storage",
        insulation: "Commercial grade polyurethane double wall",
        features: "Bottle opener, fish ruler, cup holders",
        construction: "Glacier seal rubber gasket",
        sku: "HOGG-COOLER-20QT"
      }
    },
    {
      id: "gear-hogg-35qt-wheelie-cooler",
      name: "35QT WHEELIE HOGG COOLER",
      category: "storage",
      description: "Premium 35QT wheelie cooler with wheels and telescopic handle for easy transport. Holds 39 cans with ice, includes bottle opener, fish ruler, cup holders, clear dry bin, and drain plug. Perfect for tailgates, camping, and beach days.",
      price: 180,
      images: [
        "/images/gear/HOGG-35-QT-COOLER/WHITE.png",
        "/images/gear/HOGG-35-QT-COOLER/FROSTED-GREY.png",
        "/images/gear/HOGG-35-QT-COOLER/FROSTED-TAN.png",
        "/images/gear/HOGG-35-QT-COOLER/HARVEST-RED.png",
        "/images/gear/HOGG-35-QT-COOLER/2.png",
        "/images/gear/HOGG-35-QT-COOLER/4.png",
        "/images/gear/HOGG-35-QT-COOLER/6.png",
        "/images/gear/HOGG-35-QT-COOLER/8.png"
      ],
      colors: [
        { name: "White", hex: "#FFFFFF" },
        { name: "Frosted Grey", hex: "#A9A9A9" },
        { name: "Frosted Tan", hex: "#D2B48C" },
        { name: "Harvest Red", hex: "#DC143C" }
      ],
      sizes: ["35QT"],
      featured: true,
      rating: 5,
      specs: {
        capacity: "35QT / 39 cans with ice",
        dimensions: "Rectangle shape with wheels & handle",
        insulation: "Commercial grade polyurethane double wall",
        features: "Wheels, bottle opener, fish ruler, dry bin",
        construction: "Glacier seal rubber gasket",
        sku: "HOGG-COOLER-35QT-WHEELIE"
      }
    }
  ]

  const categories = [
    { id: "all", name: "All Gear", count: allProducts.length },
    { id: "diving", name: "Diving", count: allProducts.filter(p => p.category === "diving").length },
    { id: "packs", name: "Backpacks", count: allProducts.filter(p => p.category === "packs").length },
    { id: "fishing", name: "Fishing", count: allProducts.filter(p => p.category === "fishing").length },
    { id: "navigation", name: "Navigation", count: allProducts.filter(p => p.category === "navigation").length },
    { id: "storage", name: "Storage", count: allProducts.filter(p => p.category === "storage").length },
    { id: "marine", name: "Marine", count: allProducts.filter(p => p.category === "marine").length }
  ]

  const { addToCart, setIsCartOpen, getCartItemCount } = useCart()
  const [selectedCategory, setSelectedCategory] = useState("all")
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
  const filteredProducts = selectedCategory === "all" 
    ? allProducts 
    : allProducts.filter(p => p.category === selectedCategory)

  const handleQuickAdd = (product: any) => {
    const size = selectedSize[product.id] || product.sizes[Math.floor(product.sizes.length / 2)]
    const colorIndex = selectedColor[product.id] || 0
    
    // Handle different product types
    let colorName = "Default"
    let sizeName = "Default"
    
    if (product.id === "gear-cascade-backpack-compact") {
      // If no color selected (showing SIZE-COMPARE), use first color
      if (colorIndex === 0) {
        colorName = product.colors[0].name
      } else {
        // Map image index back to color index
        const colorArrayIndex = colorIndex - 1
        colorName = product.colors[colorArrayIndex]?.name || product.colors[0].name
      }
    } else if (product.id === "gear-havana-inflatable-sup") {
      // For Havana paddleboard, colorIndex maps to size
      sizeName = product.sizes[colorIndex]?.name || product.sizes[0]
      colorName = "Standard"
    } else if (product.id === "gear-2025-mens-sprint-wetsuit" || product.id === "gear-2025-womens-fusion-wetsuit" || product.id === "gear-2025-mens-fusion-wetsuit" || product.id === "gear-2025-mens-thermal-wetsuit" || product.id === "gear-2025-womens-thermal-wetsuit") {
      // For wetsuit, use selected size or default to first available size
      sizeName = size
      colorName = product.colors[colorIndex]?.name || "Standard"
    } else {
      colorName = product.colors[colorIndex]?.name || "Default"
    }
    
    // Get the correct price for size-based pricing
    const itemPrice = (product.id === "gear-havana-inflatable-sup" && product.prices) 
      ? product.prices[colorIndex] 
      : product.price

    const cartItem = {
      id: `${product.id}-${colorName}-${sizeName}`,
      name: `${product.name} - ${colorName}${product.id === "gear-havana-inflatable-sup" ? ` - ${sizeName}` : (product.id === "gear-2025-mens-sprint-wetsuit" || product.id === "gear-2025-womens-fusion-wetsuit" || product.id === "gear-2025-mens-fusion-wetsuit" || product.id === "gear-2025-mens-thermal-wetsuit" || product.id === "gear-2025-womens-thermal-wetsuit") ? ` - Size ${sizeName}` : ''}`,
      price: `$${itemPrice}`,
      size: product.id === "gear-havana-inflatable-sup" ? sizeName : size,
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
    
    // Set initial zoom level - 150% for all enhanced products, 100% for others
    const initialZoom = (productId === "gear-cascade-backpack" || productId === "gear-cascade-backpack-compact" || productId === "gear-cascade-duffle-bag" || productId === "gear-havana-inflatable-sup" || productId === "gear-hogg-35qt-wheelie-cooler" || productId === "gear-2025-mens-sprint-wetsuit" || productId === "gear-2025-womens-fusion-wetsuit" || productId === "gear-2025-mens-fusion-wetsuit" || productId === "gear-2025-mens-thermal-wetsuit" || productId === "gear-2025-womens-thermal-wetsuit") ? 1.5 : 1
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
    
    // Maintain zoom levels - 150% for all enhanced products, 100% for others
    const maintainZoom = (expandedProductId === "gear-cascade-backpack" || expandedProductId === "gear-cascade-backpack-compact" || expandedProductId === "gear-cascade-duffle-bag" || expandedProductId === "gear-havana-inflatable-sup" || expandedProductId === "gear-hogg-35qt-wheelie-cooler" || expandedProductId === "gear-2025-mens-sprint-wetsuit" || expandedProductId === "gear-2025-womens-fusion-wetsuit" || expandedProductId === "gear-2025-mens-fusion-wetsuit" || expandedProductId === "gear-2025-mens-thermal-wetsuit" || expandedProductId === "gear-2025-womens-thermal-wetsuit") ? 1.5 : 1
    setImageZoom(maintainZoom)
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
              <Link href="/gear" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {filteredProducts.map((product) => {
              const currentColorIndex = selectedColor[product.id] || 0
              const isHovered = hoveredProduct === product.id
              const isCascadeBackpack = product.id === "gear-cascade-backpack" || product.id === "gear-cascade-backpack-compact" || product.id === "gear-cascade-duffle-bag" || product.id === "gear-havana-inflatable-sup" || product.id === "gear-hogg-35qt-wheelie-cooler" || product.id === "gear-2025-mens-sprint-wetsuit" || product.id === "gear-2025-womens-fusion-wetsuit" || product.id === "gear-2025-mens-fusion-wetsuit" || product.id === "gear-2025-mens-thermal-wetsuit" || product.id === "gear-2025-womens-thermal-wetsuit"
              
              return (
                <div
                  key={product.id}
                  className="group relative"
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  <div className={`relative bg-slate-900/50 rounded-lg overflow-hidden border border-slate-800/50 transition-all duration-300 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1 ${expandedDetails[product.id] ? 'h-auto min-h-96' : 'h-80'}`}>
                                          {/* Product Image */}
                      <div className="relative overflow-hidden bg-gradient-to-b from-slate-800/50 to-slate-900/50 h-56">
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
                          className="transition-transform duration-500 pointer-events-none object-cover group-hover:scale-110"
                          style={{ transform: 'scale(2)' }}
                        />
                      </div>
                      
                      {/* Expand icon overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
                        <div className="bg-black/50 rounded-full p-3">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </div>

                      {/* Featured Badge */}
                      {product.featured && (
                        <div className="absolute top-3 left-3 bg-cyan-500/20 backdrop-blur-sm text-cyan-400 text-xs font-medium px-3 py-1 rounded-full border border-cyan-500/30">
                          FEATURED
                        </div>
                      )}

                      {/* Navigation Arrows */}
                      {isCascadeBackpack && product.images.length > 1 && (
                        <>
                          {/* Left Arrow */}
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              const prevIndex = currentColorIndex === 0 ? product.images.length - 1 : currentColorIndex - 1
                              setSelectedColor({ ...selectedColor, [product.id]: prevIndex })
                            }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 z-20"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          
                          {/* Right Arrow */}
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              const nextIndex = (currentColorIndex + 1) % product.images.length
                              setSelectedColor({ ...selectedColor, [product.id]: nextIndex })
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 z-20"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </>
                      )}

                      {/* Image Navigation Dots */}
                      {isCascadeBackpack && product.images.length > 1 && (
                        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
                          {product.images.map((_, index) => (
                            <button
                              key={index}
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setSelectedColor({ ...selectedColor, [product.id]: index })
                              }}
                              className={`w-2 h-2 rounded-full transition-all ${
                                currentColorIndex === index 
                                  ? 'bg-white scale-125' 
                                  : 'bg-white/60 hover:bg-white/80'
                              }`}
                              title={`Image ${index + 1}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div 
                      className="absolute bottom-0 left-0 right-0 p-3 bg-slate-900/95 backdrop-blur-sm cursor-pointer hover:bg-slate-900/100 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        setExpandedDetails(prev => ({ ...prev, [product.id]: !prev[product.id] }))
                      }}
                    >
                      {!expandedDetails[product.id] && (
                        <>
                          <div className="space-y-1">
                            <h3 className="font-medium text-white text-sm line-clamp-1">{product.name}</h3>
                            <div className="flex items-start justify-between">
                              <p className="text-xs text-slate-400 line-clamp-1 flex-1">{product.description}</p>
                              <div className="ml-2 text-cyan-400 text-lg font-bold min-w-[24px] h-6 flex items-center justify-center">
                                +
                              </div>
                            </div>
                          </div>
                          
                          {/* Price and Add to Cart */}
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-sm font-semibold text-white">
                              ${product.id === "gear-havana-inflatable-sup" && product.prices ? product.prices[currentColorIndex] : product.price}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleQuickAdd(product)
                              }}
                              className="bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-medium px-3 py-1 rounded transition-colors"
                            >
                              Add to Cart
                            </button>
                          </div>
                        </>
                      )}
                      
                      {expandedDetails[product.id] && (
                        <div className="flex items-center justify-between py-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleQuickAdd(product)
                            }}
                            className="bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-medium px-3 py-1 rounded transition-colors"
                          >
                            Add to Cart
                          </button>
                          <div className="text-cyan-400 text-lg font-bold">
                            −
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Expanded Details Panel - Shows when + is clicked */}
                    {expandedDetails[product.id] && (
                      <div className="mt-4 p-3 bg-slate-800/50 border-t border-slate-700/50">
                        {/* Product Title */}
                        <div className="mb-3">
                          <h3 className="font-semibold text-white text-base">{product.name}</h3>
                          <div className="mt-1">
                            <span className="text-lg font-bold text-cyan-400">
                              ${product.id === "gear-havana-inflatable-sup" && product.prices ? product.prices[currentColorIndex] : product.price}
                            </span>
                          </div>
                        </div>
                        
                        {/* Full Product Description */}
                        <div className="mb-4">
                          <p className="text-sm text-slate-300 leading-relaxed">{product.description}</p>
                        </div>

                      {/* Product Details Dropdown for Enhanced Products */}
                      {(isCascadeBackpack || product.id === "gear-hogg-20qt-cooler") && product.specs && (
                        <div className="border-t border-slate-700 pt-3">
                          <details className="group">
                            <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-slate-300 hover:text-white transition-colors">
                              <span>Product Details</span>
                              <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </summary>
                            <div className="mt-2 space-y-1 text-xs text-slate-400">
                              <div className="flex justify-between">
                                <span>{(product.id === "gear-havana-inflatable-sup" || product.id === "gear-2025-mens-sprint-wetsuit" || product.id === "gear-2025-womens-fusion-wetsuit" || product.id === "gear-2025-mens-fusion-wetsuit" || product.id === "gear-2025-mens-thermal-wetsuit" || product.id === "gear-2025-womens-thermal-wetsuit") ? "Weight:" : "Capacity:"}</span>
                                <span className="text-slate-300">
                                  {product.id === "gear-cascade-backpack-compact" ? "13.5-Liter Volume" : 
                                   product.id === "gear-cascade-duffle-bag" ? "35-liter" : 
                                   product.id === "gear-havana-inflatable-sup" ? "34 lb (15.42 kg)" : 
                                   product.id === "gear-hogg-20qt-cooler" ? "20QT / 34 cans with ice" : 
                                   product.id === "gear-hogg-35qt-wheelie-cooler" ? "35QT / 39 cans with ice" : 
                                   (product.id === "gear-2025-mens-sprint-wetsuit" || product.id === "gear-2025-womens-fusion-wetsuit" || product.id === "gear-2025-mens-fusion-wetsuit" || product.id === "gear-2025-mens-thermal-wetsuit" || product.id === "gear-2025-womens-thermal-wetsuit") ? "4 lb (1.81 kg)" : "21-Liter Capacity"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>{product.id === "gear-havana-inflatable-sup" ? "Construction:" : (product.id === "gear-hogg-20qt-cooler" || product.id === "gear-hogg-35qt-wheelie-cooler") ? "Insulation:" : (product.id === "gear-2025-mens-sprint-wetsuit" || product.id === "gear-2025-womens-fusion-wetsuit" || product.id === "gear-2025-mens-fusion-wetsuit" || product.id === "gear-2025-mens-thermal-wetsuit" || product.id === "gear-2025-womens-thermal-wetsuit") ? "Construction:" : "Material:"}</span>
                                <span className="text-slate-300">
                                  {product.id === "gear-havana-inflatable-sup" ? "Single layer drop-stitch" : 
                                   (product.id === "gear-hogg-20qt-cooler" || product.id === "gear-hogg-35qt-wheelie-cooler") ? "Commercial grade polyurethane" : 
                                   product.id === "gear-2025-mens-sprint-wetsuit" ? "5mm buoyant neoprene" : 
                                   product.id === "gear-2025-womens-fusion-wetsuit" ? "5mm buoyant neoprene in legs" : 
                                   product.id === "gear-2025-mens-fusion-wetsuit" ? "5mm buoyant neoprene in legs" : 
                                   product.id === "gear-2025-mens-thermal-wetsuit" ? "Premium Yamamoto neoprene with zirconium jersey lining" : 
                                   product.id === "gear-2025-womens-thermal-wetsuit" ? "Premium Yamamoto neoprene with zirconium jersey lining" : "100% polyester with TPU matte coating"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>{(product.id === "gear-hogg-20qt-cooler" || product.id === "gear-hogg-35qt-wheelie-cooler" || product.id === "gear-2025-mens-sprint-wetsuit" || product.id === "gear-2025-womens-fusion-wetsuit" || product.id === "gear-2025-mens-fusion-wetsuit" || product.id === "gear-2025-mens-thermal-wetsuit" || product.id === "gear-2025-womens-thermal-wetsuit") ? "Features:" : "Dimensions:"}</span>
                                <span className="text-slate-300">
                                  {product.id === "gear-cascade-backpack-compact" ? "14\" H x 9.75\" W x 7.25\" D" : 
                                   product.id === "gear-cascade-duffle-bag" ? "20.5\" W x 11.5\" H x 11.5\" D" : 
                                   product.id === "gear-havana-inflatable-sup" ? "37 x 20 x 11 in (94 x 50.8 x 27.9 cm)" : 
                                   product.id === "gear-hogg-20qt-cooler" ? "Bottle opener, fish ruler, cup holders" : 
                                   product.id === "gear-hogg-35qt-wheelie-cooler" ? "Wheels, bottle opener, fish ruler, dry bin" : 
                                   product.id === "gear-2025-mens-sprint-wetsuit" ? "Chafe-free neck, flexible arms" : 
                                   product.id === "gear-2025-womens-fusion-wetsuit" ? "Tapered neckline, flexible arms" : 
                                   product.id === "gear-2025-mens-fusion-wetsuit" ? "Tapered neckline, flexible arms" : 
                                   product.id === "gear-2025-mens-thermal-wetsuit" ? "Single-piece shoulder panel, ultra-flexible arms" : 
                                   product.id === "gear-2025-womens-thermal-wetsuit" ? "Single-piece shoulder panel, ultra-flexible arms" : "16\" H x 11\" W x 8.5\" D"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>{product.id === "gear-havana-inflatable-sup" ? "Package:" : (product.id === "gear-hogg-20qt-cooler" || product.id === "gear-hogg-35qt-wheelie-cooler") ? "Construction:" : (product.id === "gear-2025-mens-sprint-wetsuit" || product.id === "gear-2025-womens-fusion-wetsuit" || product.id === "gear-2025-mens-fusion-wetsuit" || product.id === "gear-2025-mens-thermal-wetsuit" || product.id === "gear-2025-womens-thermal-wetsuit") ? "Origin:" : "Weight:"}</span>
                                <span className="text-slate-300">
                                  {product.id === "gear-cascade-backpack-compact" ? "2 lbs (32 oz)" : 
                                   product.id === "gear-cascade-duffle-bag" ? "3.15 lbs (50.4 oz)" : 
                                   product.id === "gear-havana-inflatable-sup" ? "Full package included" : 
                                   (product.id === "gear-hogg-20qt-cooler" || product.id === "gear-hogg-35qt-wheelie-cooler") ? "Glacier seal rubber gasket" : 
                                   (product.id === "gear-2025-mens-sprint-wetsuit" || product.id === "gear-2025-womens-fusion-wetsuit" || product.id === "gear-2025-mens-fusion-wetsuit" || product.id === "gear-2025-mens-thermal-wetsuit" || product.id === "gear-2025-womens-thermal-wetsuit") ? "Made in United States" : "2.375 lbs (38 oz)"}
                                </span>
                              </div>
                            </div>
                          </details>
                        </div>
                      )}

                                            {/* Color Selection & Add to Cart */}
                      <div className="space-y-3 pt-2">
                        {/* Color Selection Dropdown */}
                        {product.colors.length > 1 && product.id !== "gear-havana-inflatable-sup" && (
                          <div className="space-y-2">
                            <span className="text-sm font-medium text-white">Color:</span>
                            <select
                              value={currentColorIndex}
                              onChange={(e) => {
                                const selectedIndex = parseInt(e.target.value)
                                setSelectedColor({ ...selectedColor, [product.id]: selectedIndex })
                              }}
                              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none hover:border-slate-500 transition-colors"
                            >
                              {product.colors.map((color, index) => {
                                // For CASCADE-BACKPACK-COMPACT, offset by 1 to account for SIZE-COMPARE being first
                                const imageIndex = product.id === "gear-cascade-backpack-compact" ? index + 1 : index
                                return (
                                  <option key={color.name} value={imageIndex} className="bg-slate-700 text-white">
                                    {color.name}
                                  </option>
                                )
                              })}
                            </select>
                          </div>
                        )}

                                                {/* Size Selection Dropdown for Havana Paddleboard */}
                        {product.id === "gear-havana-inflatable-sup" && product.sizes && product.sizes.length > 1 && (
                          <div className="space-y-2">
                            <span className="text-sm font-medium text-white">Size:</span>
                            <select
                              value={currentColorIndex}
                              onChange={(e) => {
                                const selectedIndex = parseInt(e.target.value)
                                setSelectedColor({ ...selectedColor, [product.id]: selectedIndex })
                              }}
                              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none hover:border-slate-500 transition-colors"
                            >
                              {product.sizes.map((size, index) => (
                                <option key={size} value={index} className="bg-slate-700 text-white">
                                  {size}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {/* Size Selection Dropdown for Wetsuit */}
                        {(product.id === "gear-2025-mens-sprint-wetsuit" || product.id === "gear-2025-womens-fusion-wetsuit" || product.id === "gear-2025-mens-fusion-wetsuit" || product.id === "gear-2025-mens-thermal-wetsuit" || product.id === "gear-2025-womens-thermal-wetsuit") && product.sizes && product.sizes.length > 1 && (
                          <div className="space-y-2">
                            <span className="text-sm font-medium text-white">Size:</span>
                            <select
                              value={selectedSize[product.id] || product.sizes[0]}
                              onChange={(e) => {
                                const selectedSizeValue = e.target.value
                                setSelectedSize({ ...selectedSize, [product.id]: selectedSizeValue })
                              }}
                              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none hover:border-slate-500 transition-colors"
                            >
                              {product.sizes.map((size) => {
                                const isSoldOut = product.soldOutSizes && product.soldOutSizes.includes(size)
                                return (
                                  <option 
                                    key={size} 
                                    value={size} 
                                    disabled={isSoldOut}
                                    className={`bg-slate-700 ${isSoldOut ? 'text-slate-500' : 'text-white'}`}
                                  >
                                    {isSoldOut ? `${size} (Sold Out)` : size}
                                  </option>
                                )
                              })}
                            </select>
                          </div>
                        )}

                        {/* Add to Cart Button */}
                        <button
                          onClick={() => handleQuickAdd(product)}
                          className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 text-sm mt-3"
                        >
                          Add to Cart
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
              <p className="text-slate-400 mb-4">Join the MU community for exclusive gear releases and updates.</p>
              <NewsletterSignup 
                source="gear" 
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
          <div className="relative max-w-7xl max-h-[95vh]">
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
                className="relative overflow-hidden max-h-[95vh] flex items-center justify-center"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{ cursor: imageZoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
              >
                <Image
                  src={currentFeaturedImage || "/placeholder.svg"}
                  alt="Expanded Product"
                  width={1200}
                  height={1200}
                  className="max-h-[95vh] w-auto object-contain transition-transform duration-200"
                  style={{
                    transform: `scale(${imageZoom}) translate(${imagePosition.x / imageZoom}px, ${imagePosition.y / imageZoom}px)`,
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
                          // Maintain zoom levels - 150% for all enhanced products, 100% for others
                          const maintainZoom = (expandedProductId === "gear-cascade-backpack" || expandedProductId === "gear-cascade-backpack-compact" || expandedProductId === "gear-cascade-duffle-bag" || expandedProductId === "gear-havana-inflatable-sup" || expandedProductId === "gear-hogg-35qt-wheelie-cooler" || expandedProductId === "gear-2025-mens-sprint-wetsuit" || expandedProductId === "gear-2025-womens-fusion-wetsuit" || expandedProductId === "gear-2025-mens-fusion-wetsuit" || expandedProductId === "gear-2025-mens-thermal-wetsuit" || expandedProductId === "gear-2025-womens-thermal-wetsuit") ? 1.5 : 1
                          setImageZoom(maintainZoom)
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
