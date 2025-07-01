// Import the auto-generated catalogue (70 items from public/images/APPAREL)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore – JSON import handled via tsconfig "resolveJsonModule"
import generatedData from '../../../data/apparel-products.json'

export interface Product {
    id: string
    name: string
    category: string
    description: string
    price: number
    images: string[]
    colors: { name: string; hex: string }[]
    sizes: string[]
    featured: boolean
    lake: string
    details?: string
    featuresList?: string[]
  }
  
  // Manually-curated products remain inline for easy editing
  const manualProducts: Product[] = [
    // T-SHIRTS CATEGORY
    
    {
      id: "cda-board-tee",
      name: "CDA Board Tee",
      category: "tees",
      description: "Premium CDA Board Tee for water lovers.",
      price: 33,
      images: [
        "/images/APPAREL/CDA-APPAREL/CDA-BOARD-TEE/Back, Bay.png",
        "/images/APPAREL/CDA-APPAREL/CDA-BOARD-TEE/Back, Black.png",
        "/images/APPAREL/CDA-APPAREL/CDA-BOARD-TEE/Back, Khaki.png",
        "/images/APPAREL/CDA-APPAREL/CDA-BOARD-TEE/Back, True Navy.png",
        "/images/APPAREL/CDA-APPAREL/CDA-BOARD-TEE/Back, Watermelon.png",
        "/images/APPAREL/CDA-APPAREL/CDA-BOARD-TEE/Back, White.png",
        "/images/APPAREL/CDA-APPAREL/CDA-BOARD-TEE/Front, White.png"
      ],
      colors: [
        { name: "Bay", hex: "#7DD3FC" },
        { name: "Black", hex: "#000000" },
        { name: "Khaki", hex: "#8B7355" },
        { name: "True Navy", hex: "#1E3A8A" },
        { name: "Watermelon", hex: "#FB7185" },
        { name: "White", hex: "#FFFFFF" }
      ],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
      lake: "CDA"
    },
    {
      id: "cda-dive-tee",
      name: "CDA Dive Tee",
      category: "tees",
      description: "Premium CDA Dive Tee for water lovers.",
      price: 33,
      images: [
        "/images/APPAREL/CDA-APPAREL/CDA-DIVE-TEE/Back, Bay.png",
        "/images/APPAREL/CDA-APPAREL/CDA-DIVE-TEE/Back, Black.png",
        "/images/APPAREL/CDA-APPAREL/CDA-DIVE-TEE/Back, Khaki.png",
        "/images/APPAREL/CDA-APPAREL/CDA-DIVE-TEE/Back, True Navy.png",
        "/images/APPAREL/CDA-APPAREL/CDA-DIVE-TEE/Back, Watermelon.png",
        "/images/APPAREL/CDA-APPAREL/CDA-DIVE-TEE/Back, White.png",
        "/images/APPAREL/CDA-APPAREL/CDA-DIVE-TEE/Front, White.png"
      ],
      colors: [
        { name: "Bay", hex: "#7DD3FC" },
        { name: "Black", hex: "#000000" },
        { name: "Khaki", hex: "#8B7355" },
        { name: "True Navy", hex: "#1E3A8A" },
        { name: "Watermelon", hex: "#FB7185" },
        { name: "White", hex: "#FFFFFF" }
      ],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
      lake: "CDA"
    },
    {
      id: "cda-fish-tee",
      name: "CDA Fish Tee",
      category: "tees",
      description: "Premium CDA Fish Tee for water lovers.",
      price: 33,
      images: [
        "/images/APPAREL/CDA-APPAREL/CDA-FISH-TEE/Back, Sage.png",
        "/images/APPAREL/CDA-APPAREL/CDA-FISH-TEE/Front, Bay.png",
        "/images/APPAREL/CDA-APPAREL/CDA-FISH-TEE/Front, Black.png",
        "/images/APPAREL/CDA-APPAREL/CDA-FISH-TEE/Front, Khaki.png",
        "/images/APPAREL/CDA-APPAREL/CDA-FISH-TEE/Front, Sage.png",
        "/images/APPAREL/CDA-APPAREL/CDA-FISH-TEE/Front, True Navy.png",
        "/images/APPAREL/CDA-APPAREL/CDA-FISH-TEE/Front, Watermelon.png"
      ],
      colors: [
        { name: "Sage", hex: "#A3A380" },
        { name: "Bay", hex: "#7DD3FC" },
        { name: "Black", hex: "#000000" },
        { name: "Khaki", hex: "#8B7355" },
        { name: "True Navy", hex: "#1E3A8A" },
        { name: "Watermelon", hex: "#FB7185" }
      ],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
      lake: "CDA"
    },
    {
      id: "cda-lake-tee",
      name: "CDA Lake Tee",
      category: "tees",
      description: "Premium CDA Lake Tee celebrating Coeur d'Alene's iconic waters.",
      price: 33,
      images: [
        "/images/APPAREL/CDA-APPAREL/CDA-LAKE-TEE/Front, Khaki.png",
        "/images/APPAREL/CDA-APPAREL/CDA-LAKE-TEE/Front, Watermelon.png",
        "/images/APPAREL/CDA-APPAREL/CDA-LAKE-TEE/Front, Black.png",
        "/images/APPAREL/CDA-APPAREL/CDA-LAKE-TEE/Front, True Navy.png",
        "/images/APPAREL/CDA-APPAREL/CDA-LAKE-TEE/Front, Bay.png",
        "/images/APPAREL/CDA-APPAREL/CDA-LAKE-TEE/Front, White.png",
        "/images/APPAREL/CDA-APPAREL/CDA-LAKE-TEE/Back, White.png"
      ],
      colors: [
        { name: "Khaki", hex: "#8B7355" },
        { name: "Watermelon", hex: "#FB7185" },
        { name: "Black", hex: "#000000" },
        { name: "True Navy", hex: "#1E3A8A" },
        { name: "Bay", hex: "#7DD3FC" },
        { name: "White", hex: "#FFFFFF" },
        { name: "White Back", hex: "#FFFFFF" }
      ],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
      lake: "CDA"
    },
    {
      id: "cda-ski-tee",
      name: "CDA Ski Tee",
      category: "tees",
      description: "Premium CDA Ski Tee inspired by snowy runs into crystal-blue water.",
      price: 33,
      images: [
        "/images/APPAREL/CDA-APPAREL/CDA-SKI-TEE/Back, Watermelon.png",
        "/images/APPAREL/CDA-APPAREL/CDA-SKI-TEE/Back, Black.png",
        "/images/APPAREL/CDA-APPAREL/CDA-SKI-TEE/Back, True Navy.png",
        "/images/APPAREL/CDA-APPAREL/CDA-SKI-TEE/Back, Bay.png",
        "/images/APPAREL/CDA-APPAREL/CDA-SKI-TEE/Back, Khaki.png",
        "/images/APPAREL/CDA-APPAREL/CDA-SKI-TEE/Back, White.png",
        "/images/APPAREL/CDA-APPAREL/CDA-SKI-TEE/Front, White.png"
      ],
      colors: [
        { name: "Watermelon", hex: "#FB7185" },
        { name: "Black", hex: "#000000" },
        { name: "True Navy", hex: "#1E3A8A" },
        { name: "Bay", hex: "#7DD3FC" },
        { name: "Khaki", hex: "#8B7355" },
        { name: "White", hex: "#FFFFFF" }
      ],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
      lake: "CDA"
    },
    {
      id: "cda-surf-tee",
      name: "CDA Surf Tee",
      category: "tees",
      description: "Ride the gentle lake swell in our CDA Surf Tee.",
      price: 33,
      images: [
        "/images/APPAREL/CDA-APPAREL/CDA-SURF-TEE/Back, Watermelon.png",
        "/images/APPAREL/CDA-APPAREL/CDA-SURF-TEE/Back, Black.png",
        "/images/APPAREL/CDA-APPAREL/CDA-SURF-TEE/Back, True Navy.png",
        "/images/APPAREL/CDA-APPAREL/CDA-SURF-TEE/Back, Bay.png",
        "/images/APPAREL/CDA-APPAREL/CDA-SURF-TEE/Back, Khaki.png",
        "/images/APPAREL/CDA-APPAREL/CDA-SURF-TEE/Back, White.png"
      ],
      colors: [
        { name: "Watermelon", hex: "#FB7185" },
        { name: "Black", hex: "#000000" },
        { name: "True Navy", hex: "#1E3A8A" },
        { name: "Bay", hex: "#7DD3FC" },
        { name: "Khaki", hex: "#8B7355" },
        { name: "White", hex: "#FFFFFF" }
      ],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
      lake: "CDA"
    },
    {
      id: "cda-waterski-tee",
      name: "CDA Waterski Tee",
      category: "tees",
      description: "CDA Waterski Tee celebrating smooth slalom mornings.",
      price: 35,
      images: [
        "/images/APPAREL/CDA-APPAREL/CDA-WATERSKI-TEE/Back, Peony.png",
        "/images/APPAREL/CDA-APPAREL/CDA-WATERSKI-TEE/Back, Black.png",
        "/images/APPAREL/CDA-APPAREL/CDA-WATERSKI-TEE/Back, Midnight.png",
        "/images/APPAREL/CDA-APPAREL/CDA-WATERSKI-TEE/Back, Topaz Blue.png",
        "/images/APPAREL/CDA-APPAREL/CDA-WATERSKI-TEE/Back, Burnt Orange.png",
        "/images/APPAREL/CDA-APPAREL/CDA-WATERSKI-TEE/Front, Peony.png",
        "/images/APPAREL/CDA-APPAREL/CDA-WATERSKI-TEE/Front, Black.png",
        "/images/APPAREL/CDA-APPAREL/CDA-WATERSKI-TEE/Front, Midnight.png",
        "/images/APPAREL/CDA-APPAREL/CDA-WATERSKI-TEE/Front, Topaz Blue.png",
        "/images/APPAREL/CDA-APPAREL/CDA-WATERSKI-TEE/Front, Burnt Orange.png"
      ],
      colors: [
        { name: "Peony", hex: "#F9A8D4" },
        { name: "Black", hex: "#000000" },
        { name: "Midnight", hex: "#0F172A" },
        { name: "Topaz Blue", hex: "#38BDF8" },
        { name: "Burnt Orange", hex: "#EA580C" }
      ],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
      lake: "CDA"
    },
    {
      id: "cda-swim-tee",
      name: "CDA Swim Tee",
      category: "tees",
      description: "Lightweight CDA Swim Tee for endless laps and dock jumps.",
      price: 30,
      images: [
        "/images/APPAREL/CDA-APPAREL/CDA-SWIM-TEE/Red-Backside.png",
        "/images/APPAREL/CDA-APPAREL/CDA-SWIM-TEE/Red.png",
        "/images/APPAREL/CDA-APPAREL/CDA-SWIM-TEE/Midnight-Blue.png",
        "/images/APPAREL/CDA-APPAREL/CDA-SWIM-TEE/Green.png"
      ],
      colors: [
        { name: "Red", hex: "#EF4444" },
        { name: "Midnight Blue", hex: "#1E40AF" },
        { name: "Green", hex: "#16A34A" }
      ],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
      lake: "CDA"
    },
    {
      id: "cda-swim-long-sleeve",
      name: "CDA Swim Long Sleeve Shirt",
      category: "long-sleeve",
      description: "UPF-rated long sleeve for those dawn-to-dusk swim sessions.",
      price: 45,
      images: [
        "/images/APPAREL/CDA-APPAREL/CDA-SWIM-LONG-SLEEVE-SHIRT/Ocean-Blue-Backside.png",
        "/images/APPAREL/CDA-APPAREL/CDA-SWIM-LONG-SLEEVE-SHIRT/Sea-Green.png",
        "/images/APPAREL/CDA-APPAREL/CDA-SWIM-LONG-SLEEVE-SHIRT/Light-Blue.png",
        "/images/APPAREL/CDA-APPAREL/CDA-SWIM-LONG-SLEEVE-SHIRT/Dark-Green.png"
      ],
      colors: [
        { name: "Ocean Blue", hex: "#0EA5E9" },
        { name: "Sea Green", hex: "#2DD4BF" },
        { name: "Light Blue", hex: "#7DD3FC" },
        { name: "Dark Green", hex: "#065F46" }
      ],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
      lake: "CDA"
    },
    {
      id: "cda-sail-long-sleeve",
      name: "CDA Sail Long Sleeve Shirt",
      category: "long-sleeve",
      description: "Breezy CDA Sail shirt perfect for evenings on deck.",
      price: 45,
      images: [
        "/images/APPAREL/CDA-APPAREL/CDA-SAIL-LONG-SLEEVE-SHIRT/Ivory-Backside.png",
        "/images/APPAREL/CDA-APPAREL/CDA-SAIL-LONG-SLEEVE-SHIRT/Ivory.png",
        "/images/APPAREL/CDA-APPAREL/CDA-SAIL-LONG-SLEEVE-SHIRT/Ocean-Blue.png",
        "/images/APPAREL/CDA-APPAREL/CDA-SAIL-LONG-SLEEVE-SHIRT/Salmon.png"
      ],
      colors: [
        { name: "Ivory", hex: "#F3F4F6" },
        { name: "Ocean Blue", hex: "#0EA5E9" },
        { name: "Salmon", hex: "#F87171" }
      ],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
      lake: "CDA"
    },
    {
      id: "cda-under-armor-polo",
      name: "CDA Under Armour Polo",
      category: "polos",
      description: "Performance Under Armour polo with subtle CDA embroidery.",
      price: 55,
      images: [
        "/images/APPAREL/CDA-APPAREL/CDA-UNDER-ARMOR-POLO/under-armour-mens-polo-shirt-black-front-685a34c055c76.png",
        "/images/APPAREL/CDA-APPAREL/CDA-UNDER-ARMOR-POLO/under-armour-mens-polo-shirt-grey-front-685a34c0560fb.png",
        "/images/APPAREL/CDA-APPAREL/CDA-UNDER-ARMOR-POLO/under-armour-mens-polo-shirt-navy-front-685a34c055fc0.png"
      ],
      colors: [
        { name: "Black", hex: "#000000" },
        { name: "Grey", hex: "#9CA3AF" },
        { name: "Navy", hex: "#1E3A8A" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
      featured: false,
      lake: "CDA"
    },
  ]
  
  const generatedProducts: Product[] = generatedData as unknown as Product[]
  const manualIds = new Set(manualProducts.map(p => p.id))

  // Merge lists while removing duplicates
  const merged: Product[] = [
    ...manualProducts,
    ...generatedProducts.filter(p => !manualIds.has(p.id)),
  ]

  // Helper to format names
  const formatName = (name: string): string => {
    return name
      .split(/\s+/)
      .map(word => {
        const lower = word.toLowerCase()
        if (lower === 'mu') return 'MU'
        if (lower === 'cda') return 'CDA'
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      })
      .join(' ')
  }

  // 1. Ensure MU T-shirts have a Back image as the first item in their images array
  merged.forEach(p => {
    // Format name uniformly while preserving MU/CDA uppercase
    p.name = formatName(p.name)

    if (p.name.startsWith('MU') && p.category === 'tees') {
      const backIdx = p.images.findIndex(img => /back/i.test(img))
      if (backIdx > 0) {
        const [backImg] = p.images.splice(backIdx, 1)
        p.images.unshift(backImg)
      }
    }

    // Specific rules for certain MU items
    switch (p.id) {
      case 'mu-ski-rip-tee': {
        const idx = p.images.findIndex(img => /back.*black/i.test(img) || /black.*back/i.test(img))
        if (idx > 0) {
          const [img] = p.images.splice(idx, 1)
          p.images.unshift(img)
        }
        break
      }
      case 'mu-light-blue-rash-gaurd': {
        if (p.images.length > 1) {
          const [second] = p.images.splice(1, 1)
          p.images.unshift(second)
        }
        break
      }
      case 'mu-ocean-green-one-piece-swimsuit': {
        if (p.images.length > 1) {
          const [second] = p.images.splice(1, 1)
          p.images.unshift(second)
        }
        break
      }
      default: {
        // For all one-piece swimsuit items ensure 'first' image is featured
        if (/one[- ]?piece/i.test(p.id)) {
          const idx = p.images.findIndex(img => /first\.png$/i.test(img) || /front/i.test(img))
          if (idx > 0) {
            const [img] = p.images.splice(idx, 1)
            p.images.unshift(img)
          }
        }
      }
    }
  })

  // 2. Sort: MU Tees first, then other MU products, then rest alphabetically
  function sortGroup(product: Product) {
    if (product.name.startsWith('MU')) {
      return product.category === 'tees' ? 0 : 1
    }
    return 2
  }

  merged.sort((a, b) => {
    const gA = sortGroup(a)
    const gB = sortGroup(b)
    if (gA !== gB) return gA - gB
    return a.name.localeCompare(b.name)
  })

  export const allProducts: Product[] = merged
  
  export const categories = [
    { id: "all", name: "All Products", count: allProducts.length },
    { id: "hoodies", name: "Hoodies", count: allProducts.filter(p => p.category === "hoodies").length },
    { id: "tees", name: "T-Shirts", count: allProducts.filter(p => p.category === "tees").length },
    { id: "long-sleeve", name: "Long Sleeve", count: allProducts.filter(p => p.category === "long-sleeve").length },
    { id: "polos", name: "Polos", count: allProducts.filter(p => p.category === "polos").length },
    { id: "swim", name: "Swimwear", count: allProducts.filter(p => p.category === "swim").length },
    { id: "uv-protection", name: "Sun Protection", count: allProducts.filter(p => p.category === "uv-protection").length }
  ]