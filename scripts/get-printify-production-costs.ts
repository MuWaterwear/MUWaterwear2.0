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

interface ProductionCostData {
  productId: string
  productTitle: string
  blueprintId: number
  printProviderId: number
  variants: VariantCostData[]
  lastUpdated: string
}

interface VariantCostData {
  variantId: number
  title: string
  size?: string
  color?: string
  productionCost: number // in cents
  shippingCost?: number // in cents
  totalCost: number // in cents
  isAvailable: boolean
}

async function getAllProductionCosts() {
  if (!PRINTIFY_ACCESS_TOKEN || !PRINTIFY_SHOP_ID) {
    console.error('❌ Missing required environment variables: PRINTIFY_ACCESS_TOKEN and PRINTIFY_SHOP_ID')
    console.log('Please add these to your .env.local file')
    process.exit(1)
  }

  console.log('💰 Fetching production costs for all Printify products...\n')
  
  const api = new PrintifyAPI(PRINTIFY_ACCESS_TOKEN, PRINTIFY_SHOP_ID)
  const allProductCosts: ProductionCostData[] = []
  
  try {
    // Get all products from your Printify shop
    console.log('📦 Fetching all products from your Printify shop...')
    const productsResponse = await api.getAllProducts()
    const products = productsResponse.data || []
    
    console.log(`Found ${products.length} products to analyze\n`)
    
    // Process each product
    for (let i = 0; i < products.length; i++) {
      const product = products[i]
      console.log(`[${i + 1}/${products.length}] Processing: ${product.title}`)
      
      try {
        // Get detailed product information including variants
        const productDetails = await api.getProduct(product.id)
        
        const variants: VariantCostData[] = []
        
        // Extract cost information from each variant
        if (productDetails.variants && productDetails.variants.length > 0) {
          productDetails.variants.forEach((variant: any) => {
            const variantCost: VariantCostData = {
              variantId: variant.id,
              title: variant.title || `Variant ${variant.id}`,
              size: extractSize(variant.title || ''),
              color: extractColor(variant.title || ''),
              productionCost: variant.cost || 0, // Printify stores cost in cents
              shippingCost: variant.shipping_cost || 0,
              totalCost: (variant.cost || 0) + (variant.shipping_cost || 0),
              isAvailable: variant.is_enabled !== false
            }
            variants.push(variantCost)
          })
          
          console.log(`  ✅ Found ${variants.length} variants with cost data`)
        } else {
          console.log(`  ⚠️  No variants found for ${product.title}`)
        }
        
        const productCostData: ProductionCostData = {
          productId: product.id,
          productTitle: product.title,
          blueprintId: productDetails.blueprint_id,
          printProviderId: productDetails.print_provider_id,
          variants: variants,
          lastUpdated: new Date().toISOString()
        }
        
        allProductCosts.push(productCostData)
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200))
        
      } catch (error) {
        console.error(`  ❌ Error processing ${product.title}:`, error)
      }
    }
    
    // Generate reports
    console.log('\n📊 Generating cost analysis reports...')
    
    // Save detailed JSON data
    const detailedData = {
      products: allProductCosts,
      summary: generateSummary(allProductCosts),
      generatedAt: new Date().toISOString(),
      totalProducts: allProductCosts.length,
      totalVariants: allProductCosts.reduce((sum, p) => sum + p.variants.length, 0)
    }
    
    writeFileSync('printify-production-costs-detailed.json', JSON.stringify(detailedData, null, 2))
    console.log('✅ Detailed data saved to: printify-production-costs-detailed.json')
    
    // Generate CSV for easy spreadsheet import
    generateCSVReport(allProductCosts)
    
    // Generate console summary
    printSummaryReport(allProductCosts)
    
  } catch (error) {
    console.error('❌ Error fetching production costs:', error)
  }
}

function extractSize(variantTitle: string): string | undefined {
  const sizeMatch = variantTitle.match(/\b(XXS|XS|SM|S|MD|M|LG|L|XL|XXL|XXXL|2XL|3XL|4XL|5XL)\b/i)
  return sizeMatch ? sizeMatch[1].toUpperCase() : undefined
}

function extractColor(variantTitle: string): string | undefined {
  // Common color patterns
  const colorMatch = variantTitle.match(/\b(Black|White|Navy|Gray|Grey|Red|Blue|Green|Yellow|Pink|Purple|Orange|Brown|Beige|Tan)\b/i)
  return colorMatch ? colorMatch[1] : undefined
}

function generateSummary(products: ProductionCostData[]) {
  const totalProducts = products.length
  const totalVariants = products.reduce((sum, p) => sum + p.variants.length, 0)
  
  // Calculate cost ranges
  const allCosts = products.flatMap(p => p.variants.map(v => v.productionCost))
  const minCost = Math.min(...allCosts) / 100
  const maxCost = Math.max(...allCosts) / 100
  const avgCost = (allCosts.reduce((sum, cost) => sum + cost, 0) / allCosts.length) / 100
  
  return {
    totalProducts,
    totalVariants,
    costRange: {
      min: minCost,
      max: maxCost,
      average: parseFloat(avgCost.toFixed(2))
    },
    costDistribution: getCostDistribution(allCosts)
  }
}

function getCostDistribution(costs: number[]) {
  const ranges = {
    'Under $10': 0,
    '$10-20': 0,
    '$20-30': 0,
    '$30-40': 0,
    '$40-50': 0,
    'Over $50': 0
  }
  
  costs.forEach(cost => {
    const dollarCost = cost / 100
    if (dollarCost < 10) ranges['Under $10']++
    else if (dollarCost < 20) ranges['$10-20']++
    else if (dollarCost < 30) ranges['$20-30']++
    else if (dollarCost < 40) ranges['$30-40']++
    else if (dollarCost < 50) ranges['$40-50']++
    else ranges['Over $50']++
  })
  
  return ranges
}

function generateCSVReport(products: ProductionCostData[]) {
  const csvLines = [
    'Product ID,Product Title,Variant ID,Variant Title,Size,Color,Production Cost ($),Shipping Cost ($),Total Cost ($),Available'
  ]
  
  products.forEach(product => {
    product.variants.forEach(variant => {
      csvLines.push([
        product.productId,
        `"${product.productTitle}"`,
        variant.variantId,
        `"${variant.title}"`,
        variant.size || '',
        variant.color || '',
        (variant.productionCost / 100).toFixed(2),
        (variant.shippingCost || 0 / 100).toFixed(2),
        (variant.totalCost / 100).toFixed(2),
        variant.isAvailable ? 'Yes' : 'No'
      ].join(','))
    })
  })
  
  writeFileSync('printify-production-costs.csv', csvLines.join('\n'))
  console.log('✅ CSV report saved to: printify-production-costs.csv')
}

function printSummaryReport(products: ProductionCostData[]) {
  console.log('\n' + '='.repeat(60))
  console.log('💰 PRODUCTION COST SUMMARY REPORT')
  console.log('='.repeat(60))
  
  const summary = generateSummary(products)
  
  console.log(`📦 Total Products: ${summary.totalProducts}`)
  console.log(`🏷️  Total Variants: ${summary.totalVariants}`)
  console.log(`💵 Cost Range: $${summary.costRange.min} - $${summary.costRange.max}`)
  console.log(`📊 Average Cost: $${summary.costRange.average}`)
  
  console.log('\n📈 Cost Distribution:')
  Object.entries(summary.costDistribution).forEach(([range, count]) => {
    console.log(`   ${range.padEnd(15)}: ${count} variants`)
  })
  
  console.log('\n🔝 Most Expensive Products:')
  const sortedProducts = products
    .flatMap(p => p.variants.map(v => ({ 
      product: p.productTitle, 
      variant: v.title, 
      cost: v.productionCost / 100 
    })))
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 5)
  
  sortedProducts.forEach((item, i) => {
    console.log(`   ${i + 1}. ${item.product} - ${item.variant}: $${item.cost.toFixed(2)}`)
  })
  
  console.log('\n💸 Cheapest Products:')
  const cheapestProducts = products
    .flatMap(p => p.variants.map(v => ({ 
      product: p.productTitle, 
      variant: v.title, 
      cost: v.productionCost / 100 
    })))
    .sort((a, b) => a.cost - b.cost)
    .slice(0, 5)
  
  cheapestProducts.forEach((item, i) => {
    console.log(`   ${i + 1}. ${item.product} - ${item.variant}: $${item.cost.toFixed(2)}`)
  })
  
  console.log('\n' + '='.repeat(60))
  console.log('✅ Analysis complete! Files generated:')
  console.log('   📄 printify-production-costs-detailed.json (full data)')
  console.log('   📊 printify-production-costs.csv (spreadsheet format)')
  console.log('\n💡 Next steps:')
  console.log('   • Review the cost data to set your profit margins')
  console.log('   • Update your pricing strategy based on production costs')
  console.log('   • Use this data for shipping calculations')
  console.log('='.repeat(60))
}

// Run the cost analysis
getAllProductionCosts().catch(console.error) 