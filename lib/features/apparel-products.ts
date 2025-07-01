// Centralized apparel products loader
// This ensures all components use the same source of truth

import apparelProductsJson from '@/data/apparel-products.json'

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

// Helper to format names consistently
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

// Manual products that override or supplement the JSON data
const manualProductOverrides: Product[] = [
  // Add any manual product overrides here if needed
]

// Load and process all products
export function loadApparelProducts(): Product[] {
  const jsonProducts = apparelProductsJson as Product[]
  const manualIds = new Set(manualProductOverrides.map(p => p.id))
  
  // Merge JSON products with manual overrides
  const merged: Product[] = [
    ...manualProductOverrides,
    ...jsonProducts.filter(p => !manualIds.has(p.id))
  ]
  
  // Process and format all products
  merged.forEach(p => {
    // Format name
    p.name = formatName(p.name)
    
    // REMOVED: Automatic image reordering
    // Now the image order is controlled entirely by the JSON file
  })
  
  // REMOVED: Automatic sorting
  // Now the product order is controlled entirely by the JSON file order
  
  return merged
}

// Get all products
export const allProducts = loadApparelProducts()

// Get products by lake
export function getProductsByLake(lake: string): Product[] {
  return allProducts.filter(p => 
    p.lake === lake || 
    p.name.toLowerCase().includes(lake.toLowerCase())
  )
}

// Get products by category
export function getProductsByCategory(category: string): Product[] {
  if (category === 'all') return allProducts
  return allProducts.filter(p => p.category === category)
}

// Categories with counts
export const categories = [
  { id: "all", name: "All Products", count: allProducts.length },
  { id: "hoodies", name: "Hoodies", count: allProducts.filter(p => p.category === "hoodies").length },
  { id: "tees", name: "T-Shirts", count: allProducts.filter(p => p.category === "tees").length },
  { id: "long-sleeve", name: "Long Sleeve", count: allProducts.filter(p => p.category === "long-sleeve").length },
  { id: "polos", name: "Polos", count: allProducts.filter(p => p.category === "polos").length },
  { id: "swim", name: "Swimwear", count: allProducts.filter(p => p.category === "swim").length },
  { id: "uv-protection", name: "Sun Protection", count: allProducts.filter(p => p.category === "uv-protection").length }
] 