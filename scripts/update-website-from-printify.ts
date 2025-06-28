import { readFileSync, writeFileSync } from 'fs'
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

// Website pages to update
const WEBSITE_PAGES = [
  'app/coeur-dalene/page.tsx',
  'app/lindbergh/page.tsx', 
  'app/detroit-lake/page.tsx',
  'app/flathead/page.tsx',
  'app/lake-tahoe/page.tsx',
  'app/lake-washington/page.tsx',
  'app/apparel/page.tsx',
  'app/gear/page.tsx'
]

// Price mapping from Stripe (your current pricing structure)
const PRICE_MAPPING: { [key: string]: string } = {
  3300: "$33",
  3500: "$35", 
  4500: "$45",
  5000: "$50",
  5500: "$55",
  6500: "$65"
}

async function updateWebsiteFromPrintify() {
  if (!PRINTIFY_ACCESS_TOKEN || !PRINTIFY_SHOP_ID) {
    console.error('❌ Missing required environment variables')
    process.exit(1)
  }

  console.log('🔄 Updating website prices and descriptions from Printify...\n')
  
  const api = new PrintifyAPI(PRINTIFY_ACCESS_TOKEN, PRINTIFY_SHOP_ID)
  
  try {
    // Get all Printify products
    const printifyResponse = await api.getAllProducts()
    const printifyProducts = printifyResponse.data || []
    
    console.log(`📦 Found ${printifyProducts.length} products in Printify`)
    
    // Create a mapping of product names to Printify data
    const productMap = new Map()
    
    for (const product of printifyProducts) {
      // Get detailed product info including variants and pricing
      try {
        const productDetails = await api.getProduct(product.id)
        productMap.set(product.title, {
          ...product,
          details: productDetails,
          // Calculate price from variants (use the first variant's price)
          basePrice: productDetails.variants?.[0]?.price || 0
        })
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (error) {
        console.warn(`⚠️  Could not get details for ${product.title}`)
        productMap.set(product.title, product)
      }
    }
    
    console.log(`\n🔍 Processing ${WEBSITE_PAGES.length} website pages...`)
    
    // Process each website page
    for (const pagePath of WEBSITE_PAGES) {
      try {
        console.log(`\n📄 Processing: ${pagePath}`)
        
        const fileContent = readFileSync(pagePath, 'utf8')
        let updatedContent = fileContent
        let updatesCount = 0
        
        // Find all product objects in the file
        const productRegex = /{\s*name:\s*"([^"]+)",\s*description:\s*"([^"]*)",\s*price:\s*"([^"]+)",/g
        let match
        
        while ((match = productRegex.exec(fileContent)) !== null) {
          const [fullMatch, productName, currentDescription, currentPrice] = match
          
          // Check if we have this product in Printify
          if (productMap.has(productName)) {
            const printifyProduct = productMap.get(productName)
            
            // Generate new description based on Printify data
            let newDescription = currentDescription
            if (printifyProduct.description && printifyProduct.description.trim()) {
              // Use Printify description but keep it concise for website
              let desc = printifyProduct.description.substring(0, 150)
              if (printifyProduct.description.length > 150) {
                desc += "..."
              }
              
              // Clean and escape the description for JavaScript
              newDescription = desc
                .replace(/"/g, '\\"')  // Escape double quotes
                .replace(/'/g, "\\'")  // Escape single quotes
                .replace(/\n/g, ' ')   // Replace newlines with spaces
                .replace(/\r/g, ' ')   // Replace carriage returns with spaces
                .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
                .trim()
            }
            
            // Determine new price based on product type
            let newPrice = currentPrice
            if (printifyProduct.basePrice) {
              // Add markup to Printify base price
              const markup = getMarkupForProduct(productName)
              const finalPrice = Math.round(printifyProduct.basePrice * markup)
              
              // Round to nearest 100 (e.g., 3200 -> 3300)
              const roundedPrice = Math.round(finalPrice / 100) * 100
              newPrice = PRICE_MAPPING[roundedPrice] || currentPrice
            }
            
            // Create the replacement
            const newProductString = `{
      name: "${productName}",
      description: "${newDescription}",
      price: "${newPrice}",`
            
            // Only update if something changed
            if (newDescription !== currentDescription || newPrice !== currentPrice) {
              updatedContent = updatedContent.replace(fullMatch, newProductString)
              updatesCount++
              
              console.log(`  ✅ Updated: ${productName}`)
              if (newPrice !== currentPrice) {
                console.log(`    💰 Price: ${currentPrice} → ${newPrice}`)
              }
              if (newDescription !== currentDescription) {
                console.log(`    📝 Description updated`)
              }
            }
          }
        }
        
        // Write the updated file
        if (updatesCount > 0) {
          writeFileSync(pagePath, updatedContent)
          console.log(`  📝 Saved ${updatesCount} updates to ${pagePath}`)
        } else {
          console.log(`  ⏭️  No updates needed for ${pagePath}`)
        }
        
      } catch (error) {
        console.error(`❌ Error processing ${pagePath}:`, error)
      }
    }
    
    console.log('\n✅ Website update completed!')
    console.log('\n🎯 Summary:')
    console.log('- Product prices updated based on Printify costs + markup')
    console.log('- Product descriptions updated from Printify data')
    console.log('- Product images preserved (unchanged)')
    console.log('- All website pages processed')
    
  } catch (error) {
    console.error('❌ Error updating website:', error)
  }
}

// Determine markup multiplier based on product type
function getMarkupForProduct(productName: string): number {
  const name = productName.toLowerCase()
  
  // Different markup for different product types
  if (name.includes('hoodie') || name.includes('polo')) {
    return 2.5 // Higher markup for premium items
  } else if (name.includes('long sleeve')) {
    return 2.3
  } else if (name.includes('swim shorts')) {
    return 2.2
  } else {
    return 2.0 // Standard t-shirt markup
  }
}

// Run the update
updateWebsiteFromPrintify() 