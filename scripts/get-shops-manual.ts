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

async function getShops() {
  // Load environment variables
  loadEnvFile()
  
  const PRINTIFY_ACCESS_TOKEN = process.env.PRINTIFY_ACCESS_TOKEN

  if (!PRINTIFY_ACCESS_TOKEN) {
    console.error('PRINTIFY_ACCESS_TOKEN not found in .env.local file')
    console.log('Please make sure your .env.local file contains:')
    console.log('PRINTIFY_ACCESS_TOKEN=your_token_here')
    process.exit(1)
  }

  console.log('✅ Found access token in .env.local')

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
      console.log('Go to: https://printify.com/app/stores and create an API store')
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