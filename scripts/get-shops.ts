import { PrintifyAPI } from '../lib/printify'

// Simple script to get your shop ID
const PRINTIFY_ACCESS_TOKEN = process.env.PRINTIFY_ACCESS_TOKEN!

async function getShops() {
  if (!PRINTIFY_ACCESS_TOKEN) {
    console.error('Please set PRINTIFY_ACCESS_TOKEN in your .env.local file')
    process.exit(1)
  }

  // We'll use a temporary shop ID just to create the API instance
  const printify = new PrintifyAPI(PRINTIFY_ACCESS_TOKEN, 'temp')

  try {
    console.log('🔍 Fetching your Printify shops...')
    const shops = await printify.getShops()
    
    console.log('\n📋 Your available shops:')
    if (shops && shops.length > 0) {
      shops.forEach((shop: any, index: number) => {
        console.log(`${index + 1}. ${shop.title} (ID: ${shop.id}) - ${shop.sales_channel}`)
      })
      
      console.log('\n📝 Next steps:')
      console.log('1. Copy one of the Shop IDs above')
      console.log('2. Add it to your .env.local file as: PRINTIFY_SHOP_ID=your_shop_id_here')
      console.log('3. Then run: npx tsx scripts/setup-printify.ts')
    } else {
      console.log('No shops found. Please create a shop in your Printify dashboard first.')
      console.log('Go to: https://printify.com/app/stores')
    }

  } catch (error) {
    console.error('Error fetching shops:', error)
    console.log('\nTroubleshooting:')
    console.log('- Check that your PRINTIFY_ACCESS_TOKEN is correct')
    console.log('- Verify you have the "shops.read" scope enabled')
    console.log('- Make sure you\'re using a Personal Access Token, not OAuth')
  }
}

getShops() 