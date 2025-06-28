import { readFileSync } from 'fs'
import { PrintifyAPI } from '../lib/printify'

// This script helps you set up your Printify integration
// Run with: npx tsx scripts/setup-printify.ts

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

async function setupPrintify() {
  if (!PRINTIFY_ACCESS_TOKEN || !PRINTIFY_SHOP_ID) {
    console.error('Please set PRINTIFY_ACCESS_TOKEN and PRINTIFY_SHOP_ID in your .env.local file')
    process.exit(1)
  }

  const printify = new PrintifyAPI(PRINTIFY_ACCESS_TOKEN, PRINTIFY_SHOP_ID)

  try {
    console.log('🔍 Fetching your Printify shops...')
    const shops = await printify.getShops()
    console.log('Available shops:', shops)

    console.log('\n📦 Fetching your existing Printify products (with pagination)...')
    const products = await printify.getAllProducts()
    console.log(`Found ${products.data?.length || 0} products in your shop`)

    if (products.data && products.data.length > 0) {
      console.log('\n📋 Your existing products:')
      products.data.forEach((product: any, index: number) => {
        console.log(`${index + 1}. ${product.title} (ID: ${product.id})`)
        if (product.variants && product.variants.length > 0) {
          console.log(`   Variants: ${product.variants.map((v: any) => `${v.id} (${v.title})`).join(', ')}`)
        }
      })

      console.log('\n📝 Product mapping template for your webhook:')
      console.log('Copy this to your stripe-webhook/route.ts file:')
      console.log('\nconst PRODUCT_MAPPING = {')
      products.data.forEach((product: any) => {
        const variantId = product.variants?.[0]?.id || 1
        console.log(`  '${product.title}': { printifyProductId: '${product.id}', variantId: ${variantId} },`)
      })
      console.log('}')
    }

    console.log('\n🛍️ Fetching catalog blueprints (product templates)...')
    const blueprints = await printify.getCatalogBlueprints()
    console.log(`Found ${blueprints.data?.length || 0} available product templates`)

    if (blueprints.data && blueprints.data.length > 0) {
      console.log('\n👕 Popular T-shirt blueprints:')
      const tshirtBlueprints = blueprints.data.filter((bp: any) => 
        bp.title.toLowerCase().includes('tee') || 
        bp.title.toLowerCase().includes('t-shirt') ||
        bp.title.toLowerCase().includes('shirt')
      ).slice(0, 10)

      tshirtBlueprints.forEach((blueprint: any) => {
        console.log(`- ${blueprint.title} (ID: ${blueprint.id}) - ${blueprint.brand} ${blueprint.model}`)
      })
    }

    console.log('\n✅ Setup complete! Next steps:')
    console.log('1. Create products in Printify dashboard or use the API')
    console.log('2. Update the PRODUCT_MAPPING in your webhook with actual product IDs')
    console.log('3. Set up your Stripe webhook endpoint')
    console.log('4. Add Printify environment variables to .env.local')

  } catch (error) {
    console.error('Error setting up Printify:', error)
  }
}

// Example function to create a product (commented out for safety)
async function createExampleProduct() {
  const printify = new PrintifyAPI(PRINTIFY_ACCESS_TOKEN, PRINTIFY_SHOP_ID)
  
  // This is an example - you'll need to customize with your designs and preferences
  const productData = {
    title: "Custom Lake Tee",
    description: "Beautiful custom lake-themed t-shirt",
    blueprint_id: 5, // Men's Cotton Crew Tee - you'll need to get this from catalog
    print_provider_id: 1, // You'll need to get this from print providers
    variants: [
      {
        id: 1,
        price: 2500, // Price in cents
        is_enabled: true
      }
    ],
    print_areas: [
      {
        variant_ids: [1],
        placeholders: [
          {
            position: "front",
            images: [
              {
                id: "your_uploaded_image_id", // You'll need to upload images first
                name: "Front Design",
                type: "image/png",
                height: 3000,
                width: 3000,
                x: 0.5,
                y: 0.5,
                scale: 1,
                angle: 0
              }
            ]
          }
        ]
      }
    ]
  }

  try {
    const result = await printify.createProduct(productData)
    console.log('Product created:', result)
  } catch (error) {
    console.error('Error creating product:', error)
  }
}

// Run the setup
setupPrintify() 