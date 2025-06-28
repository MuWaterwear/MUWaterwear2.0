import * as fs from 'fs'
import * as path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

// Extract all gear products
const gearProducts = [
  {
    id: "gear-cascade-backpack",
    name: "CASCADE BACKPACK - STANDARD",
    description: "Designed in the Pacific Northwest, made for everywhere. Built with both capacity and convenience in mind, this bag is perfect for daily use. With weather-proof construction.",
    price: 10900, // $109.00 in cents
    category: "gear-packs",
    images: ["/images/gear/Cascade-Backpack-PORTLAND-GEAR/BLACK.png"]
  },
  {
    id: "gear-cascade-backpack-compact",
    name: "CASCADE BACKPACK - COMPACT",
    description: "Compact version of our popular Cascade design. Perfect for urban adventures and daily essentials. Features the same weather-proof construction in a smaller package.",
    price: 9900, // $99.00 in cents
    category: "gear-packs",
    images: ["/images/gear/CASCADE-BACKPACK-COMPACT/BLACK.png"]
  },
  {
    id: "gear-cascade-duffle-bag",
    name: "CASCADE DUFFLE BAG",
    description: "Large capacity duffle bag designed for extended adventures. Built with the same weather-proof construction and Pacific Northwest durability.",
    price: 13300, // $133.00 in cents
    category: "gear-packs",
    images: ["/images/gear/CASCADE-DUFFLE-BAG/BLACK.png"]
  },
  {
    id: "gear-cascade-crossbody-bag",
    name: "CASCADE CROSSBODY BAG",
    description: "Compact crossbody bag designed for urban adventures and daily essentials. Features weather-proof construction in a convenient hands-free design.",
    price: 5900, // $59.00 in cents
    category: "gear-packs",
    images: ["/images/gear/Cascade Crossbody Bag/BLACK.png"]
  },
  {
    id: "gear-2025-mens-sprint-wetsuit",
    name: "2025 MENS SPRINT WETSUIT",
    description: "Most comfortable entry-level wetsuit with super-thin, chafe-free neck and 5mm buoyant neoprene for extra lift. Made in USA.",
    price: 29500, // $295.00 in cents
    category: "gear-diving",
    images: ["/images/gear/2025-MENS-SPRINT-WETSUIT/1.png"]
  },
  {
    id: "gear-2025-mens-fusion-wetsuit",
    name: "2025 MENS FUSION WETSUIT",
    description: "Mid-level wetsuit with strategically placed 5mm buoyant neoprene in legs for extra lift and streamlined positioning. Made in USA.",
    price: 34400, // $344.00 in cents
    category: "gear-diving",
    images: ["/images/gear/2025-MENS-FUSION-WETSUIT/6.png"]
  },
  {
    id: "gear-2025-mens-thermal-wetsuit",
    name: "2025 MENS THERMAL WETSUIT",
    description: "Premium cold water wetsuit built for athletes who demand speed, agility, and warmth. Engineered with premium Yamamoto neoprene and zirconium jersey lining.",
    price: 72000, // $720.00 in cents
    category: "gear-diving",
    images: ["/images/gear/2025-MENS-THERMAL-WETSUIT/8.png"]
  },
  {
    id: "gear-2025-womens-sprint-wetsuit",
    name: "2025 WOMENS SPRINT WETSUIT",
    description: "Most comfortable entry-level wetsuit with super-thin, single-layer neck that's soft and chafe-free. Features 5mm buoyant neoprene under hips. Made in USA.",
    price: 29500, // $295.00 in cents
    category: "gear-diving",
    images: ["/images/gear/2025-WOMENS-SPRINT-WETSUIT/12.png"]
  },
  {
    id: "gear-2025-womens-fusion-wetsuit",
    name: "2025 WOMENS FUSION WETSUIT",
    description: "Mid-level wetsuit with strategically placed 5mm buoyant neoprene in legs for extra lift and streamlined positioning. Made in USA.",
    price: 34400, // $344.00 in cents
    category: "gear-diving",
    images: ["/images/gear/2025-WOMENS-FUSION-WESUIT/4.png"]
  },
  {
    id: "gear-2025-womens-thermal-wetsuit",
    name: "2025 WOMENS THERMAL WETSUIT",
    description: "Premium cold water wetsuit built for athletes who demand speed, agility, and warmth. Engineered with premium Yamamoto neoprene and zirconium jersey lining.",
    price: 72000, // $720.00 in cents
    category: "gear-diving",
    images: ["/images/gear/2025-WOMENS-THERMAL-WETSUIT/10.png"]
  },
  {
    id: "gear-tusa-paragon-mask-orange",
    name: "TUSA PARAGON MASK - ENERGY ORANGE",
    description: "Advanced M2001S Paragon professional divers mask with NEW Reinforced TRI-MIX frame, Freedom Technology with Fit II, and UV 420 Lens Treatment.",
    price: 22000, // $220.00 in cents
    category: "gear-diving",
    images: ["/images/gear/Tusa Paragon Mask - Energy Orange/14.png"]
  },
  {
    id: "gear-tusa-hyflex-vesna",
    name: "TUSA HYFLEX VESNA",
    description: "Advanced fin design with TUSA's unique APS Active Pivoting System technology. Features Comfort Foot Pocket and reinforced blade rails.",
    price: 14400, // $144.00 in cents
    category: "gear-diving",
    images: ["/images/gear/TUSA HyFlex Vesna/Untitled design (41).png"]
  },
  {
    id: "gear-havana-inflatable-sup",
    name: "THE HAVANA INFLATABLE STAND UP PADDLEBOARD PACKAGE",
    description: "Ultimate light-weight inflatable board. Full package offers single layer drop-stitch construction, 3 pc fiberglass paddle, reinforced travel bag, pump, and leash.",
    price: 43100, // $431.00 in cents (base price)
    category: "gear-paddleboards",
    images: ["/images/gear/Havana-Inflatable-Stand-Up-Paddleboard-Package/1.png"]
  },
  {
    id: "gear-high-pressure-sup-printed",
    name: "HIGH PRESSURE STAND UP PRINTED BEACH PADDLE BOARD",
    description: "All around inflatable stand up paddle board with extra bigger size. Made of premium military-grade PVC and drop-stitch technology.",
    price: 39900, // $399.00 in cents
    category: "gear-paddleboards",
    images: ["/images/gear/High Pressure Stand Up Printed Beach Paddle Boad/1.png"]
  },
  {
    id: "gear-hyperlite-shim-wakesurf",
    name: "HYPERLITE SHIM WAKESURF BOARD",
    description: "Perfect for intermediate to advanced riders. Fast rocker allows speed anywhere on the curl, super maneuverable for rotational and air tricks.",
    price: 55500, // $555.00 in cents
    category: "gear-paddleboards",
    images: ["/images/gear/Hyperlite Shim Wakesurf Board/1.png"]
  },
  {
    id: "gear-liquid-force-guapo-wakesurf",
    name: "LIQUID FORCE GUAPO WAKESURF BOARD",
    description: "Created with one purpose in mind: fun. Easy to ride longboard shaped wake surfboard delivers a fun and smooth ride behind the boat.",
    price: 39900, // $399.00 in cents
    category: "gear-paddleboards",
    images: ["/images/gear/Liquid Force Guapo Wakesurf Board/2.png"]
  },
  {
    id: "gear-obrien-valhalla-wakeboard",
    name: "O'BRIEN VALHALLA WAKEBOARD W/ ACCESS BOOTS 2022",
    description: "Reliable board for both beginners and pros. Classic-shaped board with value priced performance. Comes with Access Wakeboard Boots.",
    price: 32300, // $323.00 in cents
    category: "gear-paddleboards",
    images: ["/images/gear/O'Brien Valhalla Wakeboard w Access Boots 2022/3.png"]
  },
  {
    id: "gear-obrien-sequence-slalom-ski",
    name: "O'BRIEN SEQUENCE SLALOM SKI W/ Z9 & RTS 2020",
    description: "Wide-bodied, beginner-friendly slalom ski. Makes light work of deep water starts. Comes with O'Brien's adjustable Z9 binding and RTS.",
    price: 0, // Free as specified
    category: "gear-paddleboards",
    images: ["/images/gear/O'Brien Sequence Slalom Ski w Z9 & RTS 2020/7.png"]
  },
  {
    id: "gear-hogg-20qt-cooler",
    name: "20QT HOGG COOLER",
    description: "Premium 20QT cooler with superior insulation and built-in features. Holds 34 cans with ice, includes bottle opener, fish ruler, cup holders.",
    price: 12000, // $120.00 in cents
    category: "gear-storage",
    images: ["/images/gear/HOGG-20-QT-COOLER/WHITE.png"]
  },
  {
    id: "gear-hogg-35qt-wheelie-cooler",
    name: "35QT WHEELIE HOGG COOLER",
    description: "Premium 35QT wheelie cooler with wheels and telescopic handle. Holds 39 cans with ice, includes bottle opener, fish ruler, cup holders, dry bin.",
    price: 18000, // $180.00 in cents
    category: "gear-storage",
    images: ["/images/gear/HOGG-35-QT-COOLER/WHITE.png"]
  }
]

// Extract all accessories products
const accessoriesProducts = [
  {
    id: "beanie-cda",
    name: "CDA Beanie",
    description: "Coeur d'Alene branded cuffed beanie in multiple colors. Classic cuffed design perfect for lake adventures.",
    price: 2800, // $28.00 in cents
    category: "accessories-headwear",
    images: ["/images/ACCESSORIES/CDA-BEANIE/cuffed-beanie-black-front-685a34884ee68.png"]
  },
  {
    id: "hat-cda-lake",
    name: "CDA Lake Hat",
    description: "Classic dad hat with Coeur d'Alene lake branding. Premium construction with adjustable fit and curved brim design.",
    price: 3200, // $32.00 in cents
    category: "accessories-headwear",
    images: ["/images/ACCESSORIES/CDA-LAKE-HAT/classic-dad-hat-navy-front-685a35bea3c57.png"]
  },
  {
    id: "beanie-detroit",
    name: "Detroit Beanie",
    description: "Detroit Lake branded cuffed beanie in multiple colors. Perfect for Oregon lake adventures.",
    price: 2800, // $28.00 in cents
    category: "accessories-headwear",
    images: ["/images/ACCESSORIES/DETROIT-BEANIE/cuffed-beanie-black-front-685a39440793c.png"]
  },
  {
    id: "hat-detroit-lake",
    name: "Detroit Lake Hat",
    description: "Classic dad hat with Detroit Lake branding. Premium construction with adjustable fit and curved brim design.",
    price: 3200, // $32.00 in cents
    category: "accessories-headwear",
    images: ["/images/ACCESSORIES/DETROIT-LAKE-HAT/classic-dad-hat-light-blue-front-685a3b475dc80.png"]
  },
  {
    id: "beanie-washington",
    name: "Washington Beanie",
    description: "Lake Washington branded cuffed beanie in multiple colors. Perfect for Pacific Northwest lake adventures.",
    price: 2800, // $28.00 in cents
    category: "accessories-headwear",
    images: ["/images/ACCESSORIES/WASHINGTON-BEANIE/cuffed-beanie-navy-front-685a3e5595863.png"]
  },
  {
    id: "hat-washington-lake",
    name: "Washington Lake Hat",
    description: "Classic dad hat with Lake Washington branding. Premium construction with adjustable fit and curved brim design.",
    price: 3200, // $32.00 in cents
    category: "accessories-headwear",
    images: ["/images/ACCESSORIES/WASHINGTON-LAKE-HAT/classic-dad-hat-light-blue-front-685a3e1a73046.png"]
  },
  {
    id: "beanie-lindbergh",
    name: "Lindbergh Beanie",
    description: "Lindbergh Lake branded cuffed beanie in multiple colors. Perfect for Montana lake adventures.",
    price: 2800, // $28.00 in cents
    category: "accessories-headwear",
    images: ["/images/ACCESSORIES/LINDBERGH-BEANIE/cuffed-beanie-black-front-685a3ddcd6ba6.png"]
  },
  {
    id: "hat-lindbergh-lake",
    name: "Lindbergh Lake Hat",
    description: "Classic dad hat with Lindbergh Lake branding. Premium construction with adjustable fit and curved brim design.",
    price: 3200, // $32.00 in cents
    category: "accessories-headwear",
    images: ["/images/ACCESSORIES/LINDBERGH-LAKE-HAT/classic-dad-hat-stone-front-685a3d7a8424d.png"]
  },
  {
    id: "beanie-tahoe",
    name: "Tahoe Beanie",
    description: "Lake Tahoe branded cuffed beanie in multiple colors. Perfect for alpine lake adventures.",
    price: 2800, // $28.00 in cents
    category: "accessories-headwear",
    images: ["/images/ACCESSORIES/TAHOE-BEANIE/cuffed-beanie-heather-grey-front-685a3b9a84126.png"]
  },
  {
    id: "hat-tahoe-lake",
    name: "Tahoe Lake Hat",
    description: "Classic dad hat with Lake Tahoe branding. Premium construction with adjustable fit and curved brim design.",
    price: 3200, // $32.00 in cents
    category: "accessories-headwear",
    images: ["/images/ACCESSORIES/TAHOE-LAKE-HAT/classic-dad-hat-khaki-front-685a3bf4c48c3.png"]
  },
  {
    id: "beanie-flathead",
    name: "Flathead Beanie",
    description: "Flathead Lake branded cuffed beanie in multiple colors. Perfect for Montana lake adventures.",
    price: 2800, // $28.00 in cents
    category: "accessories-headwear",
    images: ["/images/ACCESSORIES/FLATHEAD-BEANIE/cuffed-beanie-dark-grey-front-685a368490f14.png"]
  },
  {
    id: "hat-flathead-lake",
    name: "Flathead Lake Hat",
    description: "Classic dad hat with Flathead Lake branding. Premium construction with adjustable fit and curved brim design.",
    price: 3200, // $32.00 in cents
    category: "accessories-headwear",
    images: ["/images/ACCESSORIES/FLATHEAD-LAKE-HAT/classic-dad-hat-navy-front-685a36e98a332.png"]
  }
]

// Extract key apparel products (sample of the most important ones)
const apparelProducts = [
  // MU Brand Core Products
  {
    id: "tee-mu-gets-dark",
    name: "MU Gets Dark Tee",
    description: "Premium 100% ring-spun US cotton t-shirt with MU Waterwear Gets Dark design. Medium-weight fabric with relaxed fit and classic crew neckline.",
    price: 3500, // $35.00 in cents
    category: "apparel-tees",
    images: ["/images/MU-GETS-DARK-TEE/Front, Black.png"]
  },
  {
    id: "tee-mu-iswim",
    name: "MU ISwim Tee",
    description: "Premium 100% ring-spun US cotton t-shirt with MU Waterwear ISwim design. Medium-weight fabric with relaxed fit and classic crew neckline.",
    price: 3500, // $35.00 in cents
    category: "apparel-tees",
    images: ["/images/MU-ISWIM-TEE/Front, Black.png"]
  },
  {
    id: "tee-mu-wager",
    name: "MU Wager Tee",
    description: "Premium 100% ring-spun US cotton t-shirt with MU Waterwear Wager design. Medium-weight fabric with relaxed fit and classic crew neckline.",
    price: 3500, // $35.00 in cents
    category: "apparel-tees",
    images: ["/images/MU-WAGER-TEE/Front, Black.png"]
  },
  {
    id: "tee-mu-ski-rip",
    name: "MU Ski Rip Tee",
    description: "Premium 100% ring-spun US cotton t-shirt with MU Waterwear Ski Rip design. Available in multiple colors with relaxed fit.",
    price: 3500, // $35.00 in cents
    category: "apparel-tees",
    images: ["/images/MU-SKI-RIP-TEE/Front, Black.png"]
  },
  {
    id: "tee-mu-wake-community",
    name: "MU Wake Community Tee",
    description: "Premium 100% ring-spun US cotton t-shirt with MU Waterwear Wake Community design. Available in multiple colors with relaxed fit.",
    price: 3500, // $35.00 in cents
    category: "apparel-tees",
    images: ["/images/MU-WAKE-COMMUNITY-TEE/Front, Topaz Blue.png"]
  },
  
  // MU Swimwear
  {
    id: "swim-mu-ocean-green-one-piece",
    name: "MU Ocean Green One-Piece Swimsuit",
    description: "Premium all-over print one-piece swimsuit from MU Waterwear. Built for performance and style with ocean green-inspired design.",
    price: 3100, // $31.00 in cents
    category: "apparel-swim",
    images: ["/images/MU-OCEAN-GREEN-ONE-PIECE-SWIMSUIT/first.png"]
  },
  {
    id: "swim-mu-ocean-green-shorts",
    name: "MU Ocean Green Swim Shorts",
    description: "Premium MU Ocean Green Swim Shorts. Built for performance and style in the water.",
    price: 3000, // $30.00 in cents
    category: "apparel-swim",
    images: ["/images/MU-OCEAN-GREEN-SWIM-SHORTS/18.svg"]
  },
  {
    id: "swim-mu-red-tide-shorts",
    name: "MU Red Tide Swim Shorts",
    description: "Premium MU Red Tide Swim Shorts. 100% polyester, quick-drying fabric with adjustable drawstring waist.",
    price: 3000, // $30.00 in cents
    category: "apparel-swim",
    images: ["/images/MU-RED-TIDE-SWIM-SHORTS/Front.png"]
  },
  {
    id: "swim-mu-sky-blue-one-piece",
    name: "MU Sky Blue One-Piece Swimsuit",
    description: "Premium all-over print one-piece swimsuit from MU Waterwear. Built for performance and style with sky blue-inspired design.",
    price: 3100, // $31.00 in cents
    category: "apparel-swim",
    images: ["/images/MU-SKY-BLUE-ONEPIECE-SWIMSUIT/FIRST FEATURED IMAGE.png"]
  },
  {
    id: "swim-mu-sky-blue-shorts",
    name: "MU Sky Blue Swim Shorts",
    description: "Premium MU Sky Blue Swim Shorts. Made of 95% polyester and 5% spandex with elastic waistband and drawstring.",
    price: 3000, // $30.00 in cents
    category: "apparel-swim",
    images: ["/images/MU-SKY-BLUE-SWIM-SHORTS/15.svg"]
  },
  
  // Lake-specific products
  {
    id: "tee-lindbergh-swim",
    name: "Lindbergh Swim Tee",
    description: "Premium 100% ring-spun US cotton t-shirt featuring Lindbergh Lake swim design. Medium-weight fabric with relaxed fit.",
    price: 3300, // $33.00 in cents
    category: "apparel-tees",
    images: ["/images/LINDBERGH-SWIM-TEE/Cumin.png"]
  },
  {
    id: "tee-cda-swim",
    name: "CDA Swim Tee",
    description: "Lightweight swim tee with Swim CDA design. Durable double-needle stitching, available in sizes S to 4XL.",
    price: 3300, // $33.00 in cents
    category: "apparel-tees",
    images: ["/images/CDA-SWIM-TEE/Green.png"]
  },
  {
    id: "tee-lake-tahoe-kings-beach",
    name: "Lake Tahoe Kings Beach T-Shirt",
    description: "Unisex Garment-Dyed T-shirt featuring Lake Tahoe's iconic Kings Beach destination. Relaxed fit design for style and comfort.",
    price: 3300, // $33.00 in cents
    category: "apparel-tees",
    images: ["/images/LAKE-TAHOE-KINGS-BEACH/ISLAND-GREEN-FRONT.png"]
  },
  {
    id: "tee-lindbergh-pocket",
    name: "Lindbergh - Charles Pocket Tee",
    description: "Classic pocket t-shirt featuring Charles Lindbergh aviation design. Celebrates pioneering aviation history at Lindbergh Lake.",
    price: 3300, // $33.00 in cents
    category: "apparel-tees",
    images: ["/images/LINDBERGH-CHARLES-LINDBERGH-POCKET-TEE/Black.png"]
  },
  
  // UV Protection
  {
    id: "uv-mu-sun-protection-fishing",
    name: "MU Sun Protection Fishing Hoodie",
    description: "Ultra-lightweight, moisture-wicking hoodie designed to keep you cool and comfortable on the water. 100% durable polyester.",
    price: 4200, // $42.00 in cents
    category: "apparel-uv-protection",
    images: ["/images/MU-SUN-PROTECTION-FISHING-HOODIE/Front.png"]
  },
  {
    id: "swim-mu-light-blue-rash-guard",
    name: "MU Light Blue Rash Guard",
    description: "Premium all-over print men's rash guard from MU Waterwear. UV protection with light blue design for water sports.",
    price: 4000, // $40.00 in cents
    category: "apparel-uv-protection",
    images: ["/images/MU-LIGHT-BLUE-RASH-GAURD/SECOND-FEATURED-IMAGE (2).png"]
  }
]

// Combine all products
const allProducts = [
  ...gearProducts.map(p => ({ ...p, category_type: 'gear' })),
  ...accessoriesProducts.map(p => ({ ...p, category_type: 'accessories' })),
  ...apparelProducts.map(p => ({ ...p, category_type: 'apparel' }))
]

interface StripeProduct {
  id: string
  name: string
  description: string
  price: number
  category: string
  category_type: string
  images: string[]
  stripe_product_id?: string
  stripe_price_id?: string
}

async function createStripeProduct(product: StripeProduct) {
  try {
    console.log(`\n🔄 Creating Stripe product: ${product.name}`)
    
    // Create product
    const productCommand = `stripe products create --name="${product.name}" --description="${product.description}"`
    const productResult = await execAsync(productCommand)
    const productOutput = productResult.stdout.trim()
    
    // Extract product ID
    const productIdMatch = productOutput.match(/id\s+(\w+)/)
    if (!productIdMatch) {
      throw new Error(`Could not extract product ID from: ${productOutput}`)
    }
    const productId = productIdMatch[1]
    
    // Create price (skip if price is 0)
    let priceId = null
    if (product.price > 0) {
      const priceCommand = `stripe prices create --unit-amount=${product.price} --currency=usd --product=${productId}`
      const priceResult = await execAsync(priceCommand)
      const priceOutput = priceResult.stdout.trim()
      
      // Extract price ID
      const priceIdMatch = priceOutput.match(/id\s+(\w+)/)
      if (!priceIdMatch) {
        throw new Error(`Could not extract price ID from: ${priceOutput}`)
      }
      priceId = priceIdMatch[1]
    }
    
    console.log(`✅ Created: ${product.name}`)
    console.log(`   Product ID: ${productId}`)
    if (priceId) {
      console.log(`   Price ID: ${priceId}`)
    } else {
      console.log(`   Price: FREE (no price ID created)`)
    }
    
    return {
      ...product,
      stripe_product_id: productId,
      stripe_price_id: priceId || undefined
    }
  } catch (error) {
    console.error(`❌ Error creating ${product.name}:`, error)
    return null
  }
}

async function main() {
  console.log('🚀 Starting Stripe Product Creation for MU Waterwear')
  console.log(`📊 Total products to create: ${allProducts.length}`)
  console.log(`   - Gear: ${gearProducts.length} products`)
  console.log(`   - Accessories: ${accessoriesProducts.length} products`)
  console.log(`   - Apparel: ${apparelProducts.length} products`)
  
  const createdProducts: StripeProduct[] = []
  const failedProducts: StripeProduct[] = []
  
  // Create products with delay to avoid rate limiting
  for (let i = 0; i < allProducts.length; i++) {
    const product = allProducts[i]
    console.log(`\n[${i + 1}/${allProducts.length}] Processing: ${product.name}`)
    
    const result = await createStripeProduct(product as StripeProduct)
    
    if (result) {
      createdProducts.push(result)
    } else {
      failedProducts.push(product as StripeProduct)
    }
    
    // Add delay between requests to avoid rate limiting
    if (i < allProducts.length - 1) {
      console.log('⏱️  Waiting 2 seconds to avoid rate limiting...')
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }
  
  // Save results
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  
  // Save successful creations
  const successFile = `stripe-products-created-${timestamp}.json`
  fs.writeFileSync(successFile, JSON.stringify(createdProducts, null, 2))
  
  // Save failed creations
  if (failedProducts.length > 0) {
    const failedFile = `stripe-products-failed-${timestamp}.json`
    fs.writeFileSync(failedFile, JSON.stringify(failedProducts, null, 2))
  }
  
  // Generate summary
  console.log('\n' + '='.repeat(60))
  console.log('📋 STRIPE PRODUCT CREATION SUMMARY')
  console.log('='.repeat(60))
  console.log(`✅ Successfully created: ${createdProducts.length} products`)
  console.log(`❌ Failed to create: ${failedProducts.length} products`)
  console.log(`💰 Total value: $${(createdProducts.reduce((sum, p) => sum + p.price, 0) / 100).toFixed(2)}`)
  
  console.log('\n📁 Files created:')
  console.log(`   - ${successFile} - Successfully created products`)
  if (failedProducts.length > 0) {
    console.log(`   - stripe-products-failed-${timestamp}.json - Failed products`)
  }
  
  // Generate categories breakdown
  console.log('\n📊 Categories breakdown:')
  const categoryCounts = createdProducts.reduce((acc, product) => {
    acc[product.category_type] = (acc[product.category_type] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  Object.entries(categoryCounts).forEach(([category, count]) => {
    console.log(`   - ${category}: ${count} products`)
  })
  
  console.log('\n🔗 Next steps:')
  console.log('1. Review the created products in your Stripe dashboard')
  console.log('2. Update your webhook mapping with the new product IDs')
  console.log('3. Test the checkout flow with the new products')
  console.log('\n🌐 View products: https://dashboard.stripe.com/test/products')
  
  if (failedProducts.length > 0) {
    console.log('\n⚠️  Some products failed to create. Check the failed products file and retry manually.')
  }
}

// Run the script
main().catch(console.error) 