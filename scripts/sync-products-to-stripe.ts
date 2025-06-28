import { readFileSync } from 'fs'
import { PrintifyAPI } from '../lib/printify'

// Manually load environment variables from .env.local
function loadEnvFile() {
  try {
    const envFile = readFileSync('.env.local', 'utf8')
    const lines = envFile.split('\n')
    
    for (const line of lines) {
      if (line.trim() && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=')
        const value = valueParts.join('=').trim()
        if (key && value) {
          process.env[key.trim()] = value
        }
      }
    }
  } catch (error) {
    console.error('Error reading .env.local file:', error)
  }
}

// Load environment variables
loadEnvFile()

const PRINTIFY_ACCESS_TOKEN = process.env.PRINTIFY_ACCESS_TOKEN!
const PRINTIFY_SHOP_ID = process.env.PRINTIFY_SHOP_ID!

// Website product names that should match Printify (62 products)
const WEBSITE_PRODUCTS = [
  // CDA Products
  "CDA Swim Tee",
  "CDA Sail Long Sleeve Shirt", 
  "CDA Swim Long Sleeve Shirt",
  "CDA Waterski Tee",
  "CDA Fish Tee",
  "CDA Lake Tee",
  "CDA Ski Tee",
  "CDA Surf Tee",
  "CDA Board Tee",
  "CDA Dive Tee",
  
  // Detroit Products
  "Detroit Waterski Tee",
  "Detroit Fish Tee",
  "Detroit Lake Tee",
  "Detroit Ski Tee",
  "Detroit Surf Tee",
  "Detroit Board Tee",
  "Detroit Dive Tee",
  
  // Flathead Products
  "Flathead Waterski Tee",
  "Flathead Fish Tee",
  "Flathead Lake Tee",
  "Flathead Ski Tee",
  "Flathead Surf Tee",
  "Flathead Board Tee",
  "Flathead Dive Tee",
  
  // Lindbergh Products
  "Lindbergh Waterski Tee",
  "Lindbergh Fish Tee",
  "Lindbergh Lake Tee",
  "Lindbergh Ski Tee",
  "Lindbergh Surf Tee",
  "Lindbergh Board Tee",
  "Lindbergh Dive Tee",
  "Lindbergh Swim Tee",
  "Lindbergh Swim Long Sleeve Shirt",
  "Lindbergh Adidas Polo",
  "Lindbergh - Charles Pocket Tee",
  
  // Tahoe Products
  "Tahoe Waterski Tee",
  "Tahoe Fish Tee",
  "Tahoe Lake Tee",
  "Tahoe Ski Tee",
  "Tahoe Surf Tee",
  "Tahoe Board Tee",
  "Tahoe Dive Tee",
  
  // Washington Products
  "Washington Waterski Tee",
  "Washington Fish Tee",
  "Washington Lake Tee",
  "Washington Ski Tee",
  "Washington Surf Tee",
  "Washington Board Tee",
  "Washington Dive Tee",
  "Washington Boat Long Sleeve",
  
  // MU Products
  "MU Wager Tee",
  "MU Ocean Green Swim Shorts",
  "MU ISwim Tee",
  "MU Red Tide Swim Shorts",
  "MU Sky Blue Swim Shorts",
  "MU Sun Protection Fishing Hoodie",
  "MU Ski Rip Tee",
  "MU Wake Community Tee",
  "MU Gets Dark Tee",
  
  // Other Products
  "Lake Tahoe Kings Beach T-Shirt",
  "Unisex Cotton Crew Tee - Vintage Style Graphic T-Shirt for Outdoor Lovers, Casual Fashion, Gift for Nature Enthusiasts, Summer Wear, [...]",
  "RETRO Water Ski Community T-Shirt"
]

// Product pricing based on your website
const PRODUCT_PRICING = {
  // Standard T-Shirts - $33
  "CDA Swim Tee": 3300,
  "CDA Waterski Tee": 3300,
  "CDA Fish Tee": 3300,
  "CDA Lake Tee": 3300,
  "CDA Ski Tee": 3300,
  "CDA Surf Tee": 3300,
  "CDA Board Tee": 3300,
  "CDA Dive Tee": 3300,
  "Detroit Waterski Tee": 3300,
  "Detroit Fish Tee": 3300,
  "Detroit Lake Tee": 3300,
  "Detroit Ski Tee": 3300,
  "Detroit Surf Tee": 3300,
  "Detroit Board Tee": 3300,
  "Detroit Dive Tee": 3300,
  "Flathead Waterski Tee": 3300,
  "Flathead Fish Tee": 3300,
  "Flathead Lake Tee": 3300,
  "Flathead Ski Tee": 3300,
  "Flathead Surf Tee": 3300,
  "Flathead Board Tee": 3300,
  "Flathead Dive Tee": 3300,
  "Lindbergh Waterski Tee": 3300,
  "Lindbergh Fish Tee": 3300,
  "Lindbergh Lake Tee": 3300,
  "Lindbergh Ski Tee": 3300,
  "Lindbergh Surf Tee": 3300,
  "Lindbergh Board Tee": 3300,
  "Lindbergh Dive Tee": 3300,
  "Lindbergh Swim Tee": 3300,
  "Tahoe Waterski Tee": 3300,
  "Tahoe Fish Tee": 3300,
  "Tahoe Lake Tee": 3300,
  "Tahoe Ski Tee": 3300,
  "Tahoe Surf Tee": 3300,
  "Tahoe Board Tee": 3300,
  "Tahoe Dive Tee": 3300,
  "Washington Waterski Tee": 3300,
  "Washington Fish Tee": 3300,
  "Washington Lake Tee": 3300,
  "Washington Ski Tee": 3300,
  "Washington Surf Tee": 3300,
  "Washington Board Tee": 3300,
  "Washington Dive Tee": 3300,
  "MU Wager Tee": 3300,
  "MU ISwim Tee": 3300,
  "MU Ski Rip Tee": 3300,
  "MU Wake Community Tee": 3300,
  "MU Gets Dark Tee": 3300,
  "Lake Tahoe Kings Beach T-Shirt": 3300,
  "Unisex Cotton Crew Tee - Vintage Style Graphic T-Shirt for Outdoor Lovers, Casual Fashion, Gift for Nature Enthusiasts, Summer Wear, [...]": 3300,
  "RETRO Water Ski Community T-Shirt": 3300,
  
  // Long Sleeve Shirts - $50-55
  "CDA Sail Long Sleeve Shirt": 5500,
  "CDA Swim Long Sleeve Shirt": 5000,
  "Lindbergh Swim Long Sleeve Shirt": 5000,
  "Washington Boat Long Sleeve": 5000,
  
  // Swim Shorts - $45-50
  "MU Ocean Green Swim Shorts": 4500,
  "MU Red Tide Swim Shorts": 4500,
  "MU Sky Blue Swim Shorts": 4500,
  
  // Hoodies - $65
  "MU Sun Protection Fishing Hoodie": 6500,
  
  // Polos - $65
  "Lindbergh Adidas Polo": 6500,
  
  // Pocket Tees - $35
  "Lindbergh - Charles Pocket Tee": 3500
}

async function syncProductsToStripe() {
  if (!PRINTIFY_ACCESS_TOKEN || !PRINTIFY_SHOP_ID) {
    console.error('❌ Missing required environment variables')
    process.exit(1)
  }

  console.log('🔄 Syncing 62 products from Printify to Stripe...\n')
  
  const api = new PrintifyAPI(PRINTIFY_ACCESS_TOKEN, PRINTIFY_SHOP_ID)
  
  try {
    // Get all Printify products
    const printifyResponse = await api.getAllProducts()
    const printifyProducts = printifyResponse.data || []
    
    // Filter to only the 62 matching products
    const matchingProducts = printifyProducts.filter((product: any) => 
      WEBSITE_PRODUCTS.includes(product.title)
    )
    
    console.log(`📦 Found ${matchingProducts.length} matching products to sync`)
    
    if (matchingProducts.length !== 62) {
      console.warn(`⚠️  Expected 62 products, found ${matchingProducts.length}`)
    }
    
    // Generate Stripe CLI commands
    console.log('\n🔧 Stripe CLI Commands to Create Products:')
    console.log('=' .repeat(60))
    console.log('# Copy and paste these commands to create products in Stripe\n')
    
    const stripeCLI = './stripe-cli/stripe.exe'
    
    matchingProducts.forEach((product: any, index: number) => {
      const price = PRODUCT_PRICING[product.title as keyof typeof PRODUCT_PRICING] || 3300
      const priceInDollars = (price / 100).toFixed(2)
      
      console.log(`# ${index + 1}. ${product.title} - $${priceInDollars}`)
      console.log(`${stripeCLI} products create --name="${product.title}" --description="Premium lake-themed apparel from MU Waterwear"`)
      console.log(`# Note: After creating product, create price with: stripe prices create --unit-amount=${price} --currency=usd --product=<PRODUCT_ID>`)
      console.log('')
    })
    
    // Generate JSON file for batch processing
    const stripeProducts = matchingProducts.map((product: any) => ({
      name: product.title,
      description: "Premium lake-themed apparel from MU Waterwear",
      price: PRODUCT_PRICING[product.title as keyof typeof PRODUCT_PRICING] || 3300,
      currency: "usd",
      printify_id: product.id
    }))
    
    // Write to JSON file
    const fs = require('fs')
    fs.writeFileSync('stripe-products-sync.json', JSON.stringify(stripeProducts, null, 2))
    
    console.log('\n📄 Generated Files:')
    console.log('=' .repeat(60))
    console.log('✅ stripe-products-sync.json - JSON file with all 62 products')
    console.log('✅ CLI commands printed above for manual execution')
    
    console.log('\n🎯 Next Steps:')
    console.log('=' .repeat(60))
    console.log('1. Run the Stripe CLI commands above to create products')
    console.log('2. Or use the JSON file with a batch script')
    console.log('3. Update your webhook with the new Stripe product IDs')
    
    console.log('\n📊 Product Summary:')
    console.log('=' .repeat(60))
    console.log(`Total products: ${matchingProducts.length}`)
    console.log(`T-shirts ($33): ${Object.values(PRODUCT_PRICING).filter(p => p === 3300).length}`)
    console.log(`Long sleeves ($50-55): ${Object.values(PRODUCT_PRICING).filter(p => p >= 5000 && p <= 5500).length}`)
    console.log(`Swim shorts ($45): ${Object.values(PRODUCT_PRICING).filter(p => p === 4500).length}`)
    console.log(`Hoodies/Polos ($65): ${Object.values(PRODUCT_PRICING).filter(p => p === 6500).length}`)
    
  } catch (error) {
    console.error('❌ Error syncing products:', error)
  }
}

// Run the sync
syncProductsToStripe() 