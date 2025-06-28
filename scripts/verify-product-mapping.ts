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

// Website product names (extracted from your pages)
// Note: CDA Under Armour Performance Polo is in Printiful store, not Printify
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
  
  // Detroit Products (estimated based on pattern)
  "Detroit Waterski Tee",
  "Detroit Fish Tee",
  "Detroit Lake Tee",
  "Detroit Ski Tee",
  "Detroit Surf Tee",
  "Detroit Board Tee",
  "Detroit Dive Tee",
  
  // Flathead Products (estimated based on pattern)
  "Flathead Waterski Tee",
  "Flathead Fish Tee",
  "Flathead Lake Tee",
  "Flathead Ski Tee",
  "Flathead Surf Tee",
  "Flathead Board Tee",
  "Flathead Dive Tee",
  
  // Lindbergh Products (estimated based on pattern)
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
  
  // Tahoe Products (estimated based on pattern)
  "Tahoe Waterski Tee",
  "Tahoe Fish Tee",
  "Tahoe Lake Tee",
  "Tahoe Ski Tee",
  "Tahoe Surf Tee",
  "Tahoe Board Tee",
  "Tahoe Dive Tee",
  
  // Washington Products (estimated based on pattern)
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
  "Kings Beach Garment-Dyed T-Shirt, Beach Lover Tee, Casual Summer Shirt, Lake Tahoe Clothing, Gift for Outdoor Enthusiasts",
  "Unisex Cotton Crew Tee - Vintage Style Graphic T-Shirt for Outdoor Lovers, Casual Fashion, Gift for Nature Enthusiasts, Summer Wear, [...]",
  "RETRO Water Ski Community T-Shirt",
  "Unisex Garment-dyed Long Sleeve T-Shirt"
]

async function verifyProductMapping() {
  if (!PRINTIFY_ACCESS_TOKEN || !PRINTIFY_SHOP_ID) {
    console.error('❌ Missing required environment variables:')
    console.error('   PRINTIFY_ACCESS_TOKEN:', !!PRINTIFY_ACCESS_TOKEN ? '✓' : '❌')
    console.error('   PRINTIFY_SHOP_ID:', !!PRINTIFY_SHOP_ID ? '✓' : '❌')
    process.exit(1)
  }

  console.log('🔍 Verifying product mapping between website and Printify...\n')
  
  const api = new PrintifyAPI(PRINTIFY_ACCESS_TOKEN, PRINTIFY_SHOP_ID)
  
  try {
    // Get all Printify products
    const printifyResponse = await api.getAllProducts()
    const printifyProducts = printifyResponse.data || []
    
    console.log(`📦 Found ${printifyProducts.length} products in Printify`)
    console.log(`🌐 Expected ${WEBSITE_PRODUCTS.length} products from website\n`)
    
    // Extract Printify product names
    const printifyNames = printifyProducts.map((p: any) => p.title)
    
    console.log('✅ MATCHING PRODUCTS:')
    console.log('=' .repeat(50))
    
    const matchedProducts: string[] = []
    const unmatchedWebsite: string[] = []
    const unmatchedPrintify: string[] = []
    
    // Check which website products have matches in Printify
    WEBSITE_PRODUCTS.forEach(websiteProduct => {
      const printifyMatch = printifyNames.find((printifyName: string) => 
        printifyName.toLowerCase().trim() === websiteProduct.toLowerCase().trim()
      )
      
      if (printifyMatch) {
        matchedProducts.push(websiteProduct)
        console.log(`✓ ${websiteProduct}`)
      } else {
        unmatchedWebsite.push(websiteProduct)
      }
    })
    
    // Check which Printify products don't have website matches
    printifyNames.forEach((printifyName: string) => {
      const websiteMatch = WEBSITE_PRODUCTS.find(websiteProduct => 
        websiteProduct.toLowerCase().trim() === printifyName.toLowerCase().trim()
      )
      
      if (!websiteMatch) {
        unmatchedPrintify.push(printifyName)
      }
    })
    
    console.log(`\n📊 SUMMARY:`)
    console.log('=' .repeat(50))
    console.log(`✅ Matched products: ${matchedProducts.length}`)
    console.log(`❌ Website products not in Printify: ${unmatchedWebsite.length}`)
    console.log(`⚠️  Printify products not on website: ${unmatchedPrintify.length}`)
    
    if (unmatchedWebsite.length > 0) {
      console.log(`\n❌ WEBSITE PRODUCTS NOT FOUND IN PRINTIFY:`)
      console.log('=' .repeat(50))
      unmatchedWebsite.forEach(product => {
        console.log(`❌ ${product}`)
      })
    }
    
    if (unmatchedPrintify.length > 0) {
      console.log(`\n⚠️  PRINTIFY PRODUCTS NOT ON WEBSITE:`)
      console.log('=' .repeat(50))
      unmatchedPrintify.forEach(product => {
        console.log(`⚠️  ${product}`)
      })
    }
    
    console.log(`\n🎯 RECOMMENDATIONS:`)
    console.log('=' .repeat(50))
    
    if (unmatchedWebsite.length > 0) {
      console.log(`1. Create ${unmatchedWebsite.length} missing products in Printify`)
      console.log(`2. Or update website product names to match Printify exactly`)
    }
    
    if (unmatchedPrintify.length > 0) {
      console.log(`3. Consider adding ${unmatchedPrintify.length} Printify products to your website`)
      console.log(`4. Or remove unused products from Printify`)
    }
    
    if (matchedProducts.length === WEBSITE_PRODUCTS.length && unmatchedPrintify.length === 0) {
      console.log(`🎉 Perfect match! All products are correctly mapped.`)
    }
    
  } catch (error) {
    console.error('❌ Error verifying product mapping:', error)
  }
}

// Run the verification
verifyProductMapping() 