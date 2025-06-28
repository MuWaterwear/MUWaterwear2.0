// MU Waterwear - Push All Products to Stripe
const { exec } = require('child_process');
const fs = require('fs');

// All gear products
const gearProducts = [
  {
    id: "gear-cascade-backpack",
    name: "CASCADE BACKPACK - STANDARD",
    description: "Designed in the Pacific Northwest, made for everywhere. Built with both capacity and convenience in mind, this bag is perfect for daily use. With weather-proof construction.",
    price: 10900, // $109.00 in cents
    category: "gear-packs"
  },
  {
    id: "gear-cascade-backpack-compact",
    name: "CASCADE BACKPACK - COMPACT", 
    description: "Compact version of our popular Cascade design. Perfect for urban adventures and daily essentials. Features the same weather-proof construction in a smaller package.",
    price: 9900, // $99.00 in cents
    category: "gear-packs"
  },
  {
    id: "gear-cascade-duffle-bag",
    name: "CASCADE DUFFLE BAG",
    description: "Large capacity duffle bag designed for extended adventures. Built with the same weather-proof construction and Pacific Northwest durability.",
    price: 13300, // $133.00 in cents
    category: "gear-packs"
  },
  {
    id: "gear-cascade-crossbody-bag",
    name: "CASCADE CROSSBODY BAG",
    description: "Compact crossbody bag designed for urban adventures and daily essentials. Features weather-proof construction in a convenient hands-free design.",
    price: 5900, // $59.00 in cents
    category: "gear-packs"
  },
  {
    id: "gear-2025-mens-sprint-wetsuit",
    name: "2025 MENS SPRINT WETSUIT",
    description: "Most comfortable entry-level wetsuit with super-thin, chafe-free neck and 5mm buoyant neoprene for extra lift. Made in USA.",
    price: 29500, // $295.00 in cents
    category: "gear-diving"
  },
  {
    id: "gear-2025-mens-fusion-wetsuit",
    name: "2025 MENS FUSION WETSUIT",
    description: "Mid-level wetsuit with strategically placed 5mm buoyant neoprene in legs for extra lift and streamlined positioning. Made in USA.",
    price: 34400, // $344.00 in cents
    category: "gear-diving"
  },
  {
    id: "gear-2025-mens-thermal-wetsuit",
    name: "2025 MENS THERMAL WETSUIT",
    description: "Premium cold water wetsuit built for athletes who demand speed, agility, and warmth. Engineered with premium Yamamoto neoprene and zirconium jersey lining.",
    price: 72000, // $720.00 in cents
    category: "gear-diving"
  },
  {
    id: "gear-2025-womens-sprint-wetsuit",
    name: "2025 WOMENS SPRINT WETSUIT",
    description: "Most comfortable entry-level wetsuit with super-thin, single-layer neck that's soft and chafe-free. Features 5mm buoyant neoprene under hips. Made in USA.",
    price: 29500, // $295.00 in cents
    category: "gear-diving"
  },
  {
    id: "gear-2025-womens-fusion-wetsuit",
    name: "2025 WOMENS FUSION WETSUIT",
    description: "Mid-level wetsuit with strategically placed 5mm buoyant neoprene in legs for extra lift and streamlined positioning. Made in USA.",
    price: 34400, // $344.00 in cents
    category: "gear-diving"
  },
  {
    id: "gear-2025-womens-thermal-wetsuit",
    name: "2025 WOMENS THERMAL WETSUIT",
    description: "Premium cold water wetsuit built for athletes who demand speed, agility, and warmth. Engineered with premium Yamamoto neoprene and zirconium jersey lining.",
    price: 72000, // $720.00 in cents
    category: "gear-diving"
  },
  {
    id: "gear-tusa-paragon-mask-orange",
    name: "TUSA PARAGON MASK - ENERGY ORANGE",
    description: "Advanced M2001S Paragon professional divers mask with NEW Reinforced TRI-MIX frame, Freedom Technology with Fit II, and UV 420 Lens Treatment.",
    price: 22000, // $220.00 in cents
    category: "gear-diving"
  },
  {
    id: "gear-tusa-hyflex-vesna",
    name: "TUSA HYFLEX VESNA",
    description: "Advanced fin design with TUSA's unique APS Active Pivoting System technology. Features Comfort Foot Pocket and reinforced blade rails.",
    price: 14400, // $144.00 in cents
    category: "gear-diving"
  },
  {
    id: "gear-havana-inflatable-sup",
    name: "THE HAVANA INFLATABLE STAND UP PADDLEBOARD PACKAGE",
    description: "Ultimate light-weight inflatable board. Full package offers single layer drop-stitch construction, 3 pc fiberglass paddle, reinforced travel bag, pump, and leash.",
    price: 43100, // $431.00 in cents (base price)
    category: "gear-paddleboards"
  },
  {
    id: "gear-high-pressure-sup-printed",
    name: "HIGH PRESSURE STAND UP PRINTED BEACH PADDLE BOARD",
    description: "All around inflatable stand up paddle board with extra bigger size. Made of premium military-grade PVC and drop-stitch technology.",
    price: 39900, // $399.00 in cents
    category: "gear-paddleboards"
  },
  {
    id: "gear-hyperlite-shim-wakesurf",
    name: "HYPERLITE SHIM WAKESURF BOARD",
    description: "Perfect for intermediate to advanced riders. Fast rocker allows speed anywhere on the curl, super maneuverable for rotational and air tricks.",
    price: 55500, // $555.00 in cents
    category: "gear-paddleboards"
  },
  {
    id: "gear-liquid-force-guapo-wakesurf",
    name: "LIQUID FORCE GUAPO WAKESURF BOARD",
    description: "Created with one purpose in mind: fun. Easy to ride longboard shaped wake surfboard delivers a fun and smooth ride behind the boat.",
    price: 39900, // $399.00 in cents
    category: "gear-paddleboards"
  },
  {
    id: "gear-obrien-valhalla-wakeboard",
    name: "O'BRIEN VALHALLA WAKEBOARD W/ ACCESS BOOTS 2022",
    description: "Reliable board for both beginners and pros. Classic-shaped board with value priced performance. Comes with Access Wakeboard Boots.",
    price: 32300, // $323.00 in cents
    category: "gear-paddleboards"
  },
  {
    id: "gear-obrien-sequence-slalom-ski",
    name: "O'BRIEN SEQUENCE SLALOM SKI W/ Z9 & RTS 2020",
    description: "Wide-bodied, beginner-friendly slalom ski. Makes light work of deep water starts. Comes with O'Brien's adjustable Z9 binding and RTS.",
    price: 0, // Free as specified
    category: "gear-paddleboards"
  },
  {
    id: "gear-hogg-20qt-cooler",
    name: "20QT HOGG COOLER",
    description: "Premium 20QT cooler with superior insulation and built-in features. Holds 34 cans with ice, includes bottle opener, fish ruler, cup holders.",
    price: 12000, // $120.00 in cents
    category: "gear-storage"
  },
  {
    id: "gear-hogg-35qt-wheelie-cooler",
    name: "35QT WHEELIE HOGG COOLER",
    description: "Premium 35QT wheelie cooler with wheels and telescopic handle. Holds 39 cans with ice, includes bottle opener, fish ruler, cup holders, dry bin.",
    price: 18000, // $180.00 in cents
    category: "gear-storage"
  }
];

// All accessories products
const accessoriesProducts = [
  {
    id: "beanie-cda",
    name: "CDA Beanie",
    description: "Coeur d'Alene branded cuffed beanie in multiple colors. Classic cuffed design perfect for lake adventures.",
    price: 2800, // $28.00 in cents
    category: "accessories-headwear"
  },
  {
    id: "hat-cda-lake",
    name: "CDA Lake Hat",
    description: "Classic dad hat with Coeur d'Alene lake branding. Premium construction with adjustable fit and curved brim design.",
    price: 3200, // $32.00 in cents
    category: "accessories-headwear"
  },
  {
    id: "beanie-detroit",
    name: "Detroit Beanie",
    description: "Detroit Lake branded cuffed beanie in multiple colors. Perfect for Oregon lake adventures.",
    price: 2800, // $28.00 in cents
    category: "accessories-headwear"
  },
  {
    id: "hat-detroit-lake",
    name: "Detroit Lake Hat",
    description: "Classic dad hat with Detroit Lake branding. Premium construction with adjustable fit and curved brim design.",
    price: 3200, // $32.00 in cents
    category: "accessories-headwear"
  },
  {
    id: "beanie-washington",
    name: "Washington Beanie",
    description: "Lake Washington branded cuffed beanie in multiple colors. Perfect for Pacific Northwest lake adventures.",
    price: 2800, // $28.00 in cents
    category: "accessories-headwear"
  },
  {
    id: "hat-washington-lake",
    name: "Washington Lake Hat",
    description: "Classic dad hat with Lake Washington branding. Premium construction with adjustable fit and curved brim design.",
    price: 3200, // $32.00 in cents
    category: "accessories-headwear"
  },
  {
    id: "beanie-lindbergh",
    name: "Lindbergh Beanie",
    description: "Lindbergh Lake branded cuffed beanie in multiple colors. Perfect for Montana lake adventures.",
    price: 2800, // $28.00 in cents
    category: "accessories-headwear"
  },
  {
    id: "hat-lindbergh-lake",
    name: "Lindbergh Lake Hat",
    description: "Classic dad hat with Lindbergh Lake branding. Premium construction with adjustable fit and curved brim design.",
    price: 3200, // $32.00 in cents
    category: "accessories-headwear"
  },
  {
    id: "beanie-tahoe",
    name: "Tahoe Beanie",
    description: "Lake Tahoe branded cuffed beanie in multiple colors. Perfect for alpine lake adventures.",
    price: 2800, // $28.00 in cents
    category: "accessories-headwear"
  },
  {
    id: "hat-tahoe-lake",
    name: "Tahoe Lake Hat",
    description: "Classic dad hat with Lake Tahoe branding. Premium construction with adjustable fit and curved brim design.",
    price: 3200, // $32.00 in cents
    category: "accessories-headwear"
  },
  {
    id: "beanie-flathead",
    name: "Flathead Beanie",
    description: "Flathead Lake branded cuffed beanie in multiple colors. Perfect for Montana lake adventures.",
    price: 2800, // $28.00 in cents
    category: "accessories-headwear"
  },
  {
    id: "hat-flathead-lake",
    name: "Flathead Lake Hat",
    description: "Classic dad hat with Flathead Lake branding. Premium construction with adjustable fit and curved brim design.",
    price: 3200, // $32.00 in cents
    category: "accessories-headwear"
  }
];

// Key apparel products
const apparelProducts = [
  // MU Brand Core Products
  {
    id: "tee-mu-gets-dark",
    name: "MU Gets Dark Tee",
    description: "Premium 100% ring-spun US cotton t-shirt with MU Waterwear Gets Dark design. Medium-weight fabric with relaxed fit and classic crew neckline.",
    price: 3500, // $35.00 in cents
    category: "apparel-tees"
  },
  {
    id: "tee-mu-iswim",
    name: "MU ISwim Tee",
    description: "Premium 100% ring-spun US cotton t-shirt with MU Waterwear ISwim design. Medium-weight fabric with relaxed fit and classic crew neckline.",
    price: 3500, // $35.00 in cents
    category: "apparel-tees"
  },
  {
    id: "tee-mu-wager",
    name: "MU Wager Tee",
    description: "Premium 100% ring-spun US cotton t-shirt with MU Waterwear Wager design. Medium-weight fabric with relaxed fit and classic crew neckline.",
    price: 3500, // $35.00 in cents
    category: "apparel-tees"
  },
  {
    id: "tee-mu-ski-rip",
    name: "MU Ski Rip Tee",
    description: "Premium 100% ring-spun US cotton t-shirt with MU Waterwear Ski Rip design. Available in multiple colors with relaxed fit.",
    price: 3500, // $35.00 in cents
    category: "apparel-tees"
  },
  {
    id: "tee-mu-wake-community",
    name: "MU Wake Community Tee",
    description: "Premium 100% ring-spun US cotton t-shirt with MU Waterwear Wake Community design. Available in multiple colors with relaxed fit.",
    price: 3500, // $35.00 in cents
    category: "apparel-tees"
  },
  
  // MU Swimwear
  {
    id: "swim-mu-ocean-green-one-piece",
    name: "MU Ocean Green One-Piece Swimsuit",
    description: "Premium all-over print one-piece swimsuit from MU Waterwear. Built for performance and style with ocean green-inspired design.",
    price: 3100, // $31.00 in cents
    category: "apparel-swim"
  },
  {
    id: "swim-mu-ocean-green-shorts",
    name: "MU Ocean Green Swim Shorts",
    description: "Premium MU Ocean Green Swim Shorts. Built for performance and style in the water.",
    price: 3000, // $30.00 in cents
    category: "apparel-swim"
  },
  {
    id: "swim-mu-red-tide-shorts",
    name: "MU Red Tide Swim Shorts",
    description: "Premium MU Red Tide Swim Shorts. 100% polyester, quick-drying fabric with adjustable drawstring waist.",
    price: 3000, // $30.00 in cents
    category: "apparel-swim"
  },
  {
    id: "swim-mu-sky-blue-one-piece",
    name: "MU Sky Blue One-Piece Swimsuit",
    description: "Premium all-over print one-piece swimsuit from MU Waterwear. Built for performance and style with sky blue-inspired design.",
    price: 3100, // $31.00 in cents
    category: "apparel-swim"
  },
  {
    id: "swim-mu-sky-blue-shorts",
    name: "MU Sky Blue Swim Shorts",
    description: "Premium MU Sky Blue Swim Shorts. Made of 95% polyester and 5% spandex with elastic waistband and drawstring.",
    price: 3000, // $30.00 in cents
    category: "apparel-swim"
  },
  
  // Lake-specific products
  {
    id: "tee-lindbergh-swim",
    name: "Lindbergh Swim Tee",
    description: "Premium 100% ring-spun US cotton t-shirt featuring Lindbergh Lake swim design. Medium-weight fabric with relaxed fit.",
    price: 3300, // $33.00 in cents
    category: "apparel-tees"
  },
  {
    id: "tee-cda-swim",
    name: "CDA Swim Tee",
    description: "Lightweight swim tee with Swim CDA design. Durable double-needle stitching, available in sizes S to 4XL.",
    price: 3300, // $33.00 in cents
    category: "apparel-tees"
  },
  {
    id: "tee-lake-tahoe-kings-beach",
    name: "Lake Tahoe Kings Beach T-Shirt",
    description: "Unisex Garment-Dyed T-shirt featuring Lake Tahoe's iconic Kings Beach destination. Relaxed fit design for style and comfort.",
    price: 3300, // $33.00 in cents
    category: "apparel-tees"
  },
  {
    id: "tee-lindbergh-pocket",
    name: "Lindbergh - Charles Pocket Tee",
    description: "Classic pocket t-shirt featuring Charles Lindbergh aviation design. Celebrates pioneering aviation history at Lindbergh Lake.",
    price: 3300, // $33.00 in cents
    category: "apparel-tees"
  },
  
  // UV Protection
  {
    id: "uv-mu-sun-protection-fishing",
    name: "MU Sun Protection Fishing Hoodie",
    description: "Ultra-lightweight, moisture-wicking hoodie designed to keep you cool and comfortable on the water. 100% durable polyester.",
    price: 4200, // $42.00 in cents
    category: "apparel-uv-protection"
  },
  {
    id: "swim-mu-light-blue-rash-guard",
    name: "MU Light Blue Rash Guard",
    description: "Premium all-over print men's rash guard from MU Waterwear. UV protection with light blue design for water sports.",
    price: 4000, // $40.00 in cents
    category: "apparel-uv-protection"
  }
];

// Combine all products
const allProducts = [
  ...gearProducts.map(p => ({ ...p, category_type: 'gear' })),
  ...accessoriesProducts.map(p => ({ ...p, category_type: 'accessories' })),
  ...apparelProducts.map(p => ({ ...p, category_type: 'apparel' }))
];

function createStripeProduct(product) {
  return new Promise((resolve, reject) => {
    console.log(`\n🔄 Creating Stripe product: ${product.name}`);
    
    // Create product
    const productCommand = `.\\stripe-cli\\stripe.exe products create --name="${product.name}" --description="${product.description}"`;
    exec(productCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error creating product ${product.name}:`, error);
        reject(error);
        return;
      }
      
             // Extract product ID from JSON response
       try {
         const productData = JSON.parse(stdout);
         const productId = productData.id;
         if (!productId) {
           throw new Error('No product ID found in response');
         }
       
         // Create price (skip if price is 0)
         if (product.price > 0) {
           const priceCommand = `.\\stripe-cli\\stripe.exe prices create --unit-amount=${product.price} --currency=usd --product=${productId}`;
           exec(priceCommand, (priceError, priceStdout, priceStderr) => {
             if (priceError) {
               console.error(`❌ Error creating price for ${product.name}:`, priceError);
               reject(priceError);
               return;
             }
             
                           // Extract price ID from JSON response
              try {
                const priceData = JSON.parse(priceStdout);
                const priceId = priceData.id;
                if (!priceId) {
                  throw new Error('No price ID found in response');
                }
                
                console.log(`✅ Created: ${product.name}`);
                console.log(`   Product ID: ${productId}`);
                console.log(`   Price ID: ${priceId}`);
                
                resolve({
                  ...product,
                  stripe_product_id: productId,
                  stripe_price_id: priceId
                });
              } catch (parseError) {
                console.error(`❌ Error parsing price response for ${product.name}:`, parseError);
                reject(parseError);
              }
           });
         } else {
           console.log(`✅ Created: ${product.name}`);
           console.log(`   Product ID: ${productId}`);
           console.log(`   Price: FREE (no price ID created)`);
           
           resolve({
             ...product,
             stripe_product_id: productId,
             stripe_price_id: null
           });
         }
       } catch (parseError) {
         console.error(`❌ Error parsing product response for ${product.name}:`, parseError);
         reject(parseError);
       }
    });
  });
}

async function main() {
  console.log('🚀 Starting Stripe Product Creation for MU Waterwear');
  console.log(`📊 Total products to create: ${allProducts.length}`);
  console.log(`   - Gear: ${gearProducts.length} products`);
  console.log(`   - Accessories: ${accessoriesProducts.length} products`);
  console.log(`   - Apparel: ${apparelProducts.length} products`);
  
  const createdProducts = [];
  const failedProducts = [];
  
  // Create products with delay to avoid rate limiting
  for (let i = 0; i < allProducts.length; i++) {
    const product = allProducts[i];
    console.log(`\n[${i + 1}/${allProducts.length}] Processing: ${product.name}`);
    
    try {
      const result = await createStripeProduct(product);
      createdProducts.push(result);
    } catch (error) {
      failedProducts.push(product);
    }
    
    // Add delay between requests to avoid rate limiting
    if (i < allProducts.length - 1) {
      console.log('⏱️  Waiting 2 seconds to avoid rate limiting...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  // Save results
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  // Save successful creations
  const successFile = `stripe-products-created-${timestamp}.json`;
  fs.writeFileSync(successFile, JSON.stringify(createdProducts, null, 2));
  
  // Save failed creations
  if (failedProducts.length > 0) {
    const failedFile = `stripe-products-failed-${timestamp}.json`;
    fs.writeFileSync(failedFile, JSON.stringify(failedProducts, null, 2));
  }
  
  // Generate summary
  console.log('\n' + '='.repeat(60));
  console.log('📋 STRIPE PRODUCT CREATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successfully created: ${createdProducts.length} products`);
  console.log(`❌ Failed to create: ${failedProducts.length} products`);
  console.log(`💰 Total value: $${(createdProducts.reduce((sum, p) => sum + p.price, 0) / 100).toFixed(2)}`);
  
  console.log('\n📁 Files created:');
  console.log(`   - ${successFile} - Successfully created products`);
  if (failedProducts.length > 0) {
    console.log(`   - stripe-products-failed-${timestamp}.json - Failed products`);
  }
  
  // Generate categories breakdown
  console.log('\n📊 Categories breakdown:');
  const categoryCounts = createdProducts.reduce((acc, product) => {
    acc[product.category_type] = (acc[product.category_type] || 0) + 1;
    return acc;
  }, {});
  
  Object.entries(categoryCounts).forEach(([category, count]) => {
    console.log(`   - ${category}: ${count} products`);
  });
  
  console.log('\n🔗 Next steps:');
  console.log('1. Review the created products in your Stripe dashboard');
  console.log('2. Update your webhook mapping with the new product IDs');
  console.log('3. Test the checkout flow with the new products');
  console.log('\n🌐 View products: https://dashboard.stripe.com/test/products');
  
  if (failedProducts.length > 0) {
    console.log('\n⚠️  Some products failed to create. Check the failed products file and retry manually.');
  }
}

// Run the script
main().catch(console.error);
