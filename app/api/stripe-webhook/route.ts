import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { PrintifyAPI, type PrintifyOrder, type PrintifyLineItem, type PrintifyAddress } from '@/lib/printify'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!
const printifyAccessToken = process.env.PRINTIFY_ACCESS_TOKEN!
const printifyShopId = process.env.PRINTIFY_SHOP_ID!

// Product mapping from your website products to Printify products  
const PRODUCT_MAPPING: Record<string, { printifyProductId: string, variantId: number }> = {
  // CDA Products
  'CDA Board Tee': { printifyProductId: '685daf6951d159cd160ccb48', variantId: 1 },
  'CDA Dive Tee': { printifyProductId: '685daf5451d159cd160ccb3f', variantId: 1 },
  'CDA Fish Tee': { printifyProductId: '685daf425b04adf1d5025d0c', variantId: 1 },
  'CDA Lake Tee': { printifyProductId: '685daf2e5b04adf1d5025d03', variantId: 1 },
  'CDA Ski Tee': { printifyProductId: '685daf1c51d159cd160ccb2d', variantId: 1 },
  'CDA Surf Tee': { printifyProductId: '685daf0a51d159cd160ccb24', variantId: 1 },
  'CDA Waterski Tee': { printifyProductId: '685daef651d159cd160ccb1b', variantId: 1 },
  'CDA Swim Tee': { printifyProductId: '685da8d9f8a434bb9b0da7bd', variantId: 1 },
  'CDA Sail Long Sleeve Shirt': { printifyProductId: '685da31e25ddce167d0650b0', variantId: 1 },
  'CDA Swim Long Sleeve Shirt': { printifyProductId: '685da28a5b04adf1d5025983', variantId: 1 },
  
  // Lindbergh Products
  'Lindbergh Board Tee': { printifyProductId: '685daedf51d159cd160ccb12', variantId: 1 },
  'Lindbergh Dive Tee': { printifyProductId: '685dbebf51d159cd160cd1b2', variantId: 1 },
  'Lindbergh Fish Tee': { printifyProductId: '685dbe9af8a434bb9b0da44f', variantId: 1 },
  'Lindbergh Lake Tee': { printifyProductId: '685dbe8951d159cd160cd1a0', variantId: 1 },
  'Lindbergh Ski Tee': { printifyProductId: '685dbe6b25ddce167d064d53', variantId: 1 },
  'Lindbergh Surf Tee': { printifyProductId: '685dbe5951d159cd160cd197', variantId: 1 },
  'Lindbergh Waterski Tee': { printifyProductId: '685dbe3551d159cd160cd18e', variantId: 1 },
  'Lindbergh Swim Tee': { printifyProductId: '685da2245b04adf1d50259a5', variantId: 1 },
  'Lindbergh Swim Long Sleeve Shirt': { printifyProductId: '685da30c51d159cd160ccab3', variantId: 1 },
  
  // Detroit Products
  'Detroit Board Tee': { printifyProductId: '685dbe2951d159cd160cd185', variantId: 1 },
  'Detroit Dive Tee': { printifyProductId: '685dbe1a5b04adf1d50260c3', variantId: 1 },
  'Detroit Fish Tee': { printifyProductId: '685dbe165b04adf1d50260ba', variantId: 1 },
  'Detroit Ski Tee': { printifyProductId: '685dbdf951d159cd160cd173', variantId: 1 },
  'Detroit Surf Tee': { printifyProductId: '685dbde725ddce167d064d35', variantId: 1 },
  'Detroit Waterski Tee': { printifyProductId: '685dbdcf5b04adf1d50260a2', variantId: 1 },
  
  // Flathead Products
  'Flathead Board Tee': { printifyProductId: '685dbdc225ddce167d064d2c', variantId: 1 },
  'Flathead Dive Tee': { printifyProductId: '685dbdb051d159cd160cd15b', variantId: 1 },
  'Flathead Fish Tee': { printifyProductId: '685dbda251d159cd160cd152', variantId: 1 },
  'Flathead Lake Tee': { printifyProductId: '685dbd9451d159cd160cd149', variantId: 1 },
  'Flathead Ski Tee': { printifyProductId: '685dbd8651d159cd160cd140', variantId: 1 },
  'Flathead Surf Tee': { printifyProductId: '685dbd7851d159cd160cd137', variantId: 1 },
  'Flathead Waterski Tee': { printifyProductId: '685dbd6a5b04adf1d5026081', variantId: 1 },
  
  // Tahoe Products
  'Tahoe Board Tee': { printifyProductId: '685dbecef8a434bb9b0da457', variantId: 1 },
  'Tahoe Dive Tee': { printifyProductId: '685dbd5c25ddce167d064d14', variantId: 1 },
  'Tahoe Fish Tee': { printifyProductId: '685dbd4e51d119cd160cd11f', variantId: 1 },
  'Tahoe Lake Tee': { printifyProductId: '685dbd4051d159cd160cd116', variantId: 1 },
  'Tahoe Ski Tee': { printifyProductId: '685dbd3251d159cd160cd10d', variantId: 1 },
  'Tahoe Surf Tee': { printifyProductId: '685dbd245b04adf1d5026069', variantId: 1 },
  'Lake Tahoe Kings Beach T-Shirt': { printifyProductId: '685db98f51d159cd160cd041', variantId: 1 },
  
  // Washington Products
  'Washington Dive Tee': { printifyProductId: '685dbee95b04adf1d50260fd', variantId: 1 },
  'Washington Boat Long Sleeve': { printifyProductId: '685da3b551d159cd160ccadd', variantId: 1 },
  
  // MU Products
  'MU Wager Tee': { printifyProductId: '685db4e1ff2d81be900673ef', variantId: 1 },
  'MU ISwim Tee': { printifyProductId: '685db46951d159cd160ccf3e', variantId: 1 },
  'MU Ski Rip Tee': { printifyProductId: '685db3cb5b04adf1d5025e6f', variantId: 1 },
  'MU Wake Community Tee': { printifyProductId: '685db36f51d159cd160ccf08', variantId: 1 },
  'MU Gets Dark Tee': { printifyProductId: '685db4d051d159cd160ccf47', variantId: 1 },
  'MU Ocean Green Swim Shorts': { printifyProductId: '685db4aea2debe7e5806123d', variantId: 1 },
  'MU Red Tide Swim Shorts': { printifyProductId: '685db41651d159cd160ccf2c', variantId: 1 },
  'MU Sky Blue Swim Shorts': { printifyProductId: '685db3f651d159cd160ccf1a', variantId: 1 },
  'MU Sun Protection Fishing Hoodie': { printifyProductId: '685db34a25ddce167d064ff5', variantId: 1 },
  
  // NEW STRIPE PRODUCT MAPPINGS (update with your Printify product IDs)
  // Accessories - these likely have Printify equivalents
  'CDA Beanie': { printifyProductId: 'YOUR_PRINTIFY_PRODUCT_ID', variantId: 1 },
  'CDA Lake Hat': { printifyProductId: 'YOUR_PRINTIFY_PRODUCT_ID', variantId: 1 },
  'Detroit Beanie': { printifyProductId: 'YOUR_PRINTIFY_PRODUCT_ID', variantId: 1 },
  'Detroit Lake Hat': { printifyProductId: 'YOUR_PRINTIFY_PRODUCT_ID', variantId: 1 },
  'Washington Beanie': { printifyProductId: 'YOUR_PRINTIFY_PRODUCT_ID', variantId: 1 },
  'Washington Lake Hat': { printifyProductId: 'YOUR_PRINTIFY_PRODUCT_ID', variantId: 1 },
  'Lindbergh Beanie': { printifyProductId: 'YOUR_PRINTIFY_PRODUCT_ID', variantId: 1 },
  'Lindbergh Lake Hat': { printifyProductId: 'YOUR_PRINTIFY_PRODUCT_ID', variantId: 1 },
  'Tahoe Beanie': { printifyProductId: 'YOUR_PRINTIFY_PRODUCT_ID', variantId: 1 },
  'Tahoe Lake Hat': { printifyProductId: 'YOUR_PRINTIFY_PRODUCT_ID', variantId: 1 },
  'Flathead Beanie': { printifyProductId: 'YOUR_PRINTIFY_PRODUCT_ID', variantId: 1 },
  'Flathead Lake Hat': { printifyProductId: 'YOUR_PRINTIFY_PRODUCT_ID', variantId: 1 },
  
  // Additional MU Products
  'MU Ocean Green One-Piece Swimsuit': { printifyProductId: 'YOUR_PRINTIFY_PRODUCT_ID', variantId: 1 },
  'MU Sky Blue One-Piece Swimsuit': { printifyProductId: 'YOUR_PRINTIFY_PRODUCT_ID', variantId: 1 },
  'MU Light Blue Rash Guard': { printifyProductId: 'YOUR_PRINTIFY_PRODUCT_ID', variantId: 1 },
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  console.log('Received Stripe webhook event:', event.type)

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    try {
      // Get the session with line items
      const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
        session.id,
        { expand: ['line_items'] }
      )

      // Create Printify order
      await createPrintifyOrder(sessionWithLineItems)
      
      console.log('Successfully created Printify order for session:', session.id)
    } catch (error) {
      console.error('Error creating Printify order:', error)
      // You might want to store failed orders in a database for retry later
    }
  }

  return NextResponse.json({ received: true })
}

async function createPrintifyOrder(session: Stripe.Checkout.Session) {
  if (!session.line_items?.data || !session.customer_details) {
    throw new Error('Missing required session data')
  }

  const printify = new PrintifyAPI(printifyAccessToken, printifyShopId)

  // Convert Stripe line items to Printify line items
  const printifyLineItems: PrintifyLineItem[] = []
  
  for (const lineItem of session.line_items.data) {
    const productName = lineItem.description || lineItem.price?.nickname || 'Unknown Product'
    const mapping = PRODUCT_MAPPING[productName]
    
    if (!mapping) {
      console.warn(`No Printify mapping found for product: ${productName}`)
      continue
    }

    printifyLineItems.push({
      product_id: mapping.printifyProductId,
      variant_id: mapping.variantId,
      quantity: lineItem.quantity || 1,
    })
  }

  if (printifyLineItems.length === 0) {
    throw new Error('No valid products found for Printify order')
  }

  // Convert Stripe customer details to Printify address
  const address: PrintifyAddress = {
    first_name: session.customer_details.name?.split(' ')[0] || 'Customer',
    last_name: session.customer_details.name?.split(' ').slice(1).join(' ') || '',
    email: session.customer_details.email || '',
    phone: session.customer_details.phone || '',
    country: session.customer_details.address?.country || 'US',
    region: session.customer_details.address?.state || '',
    address1: session.customer_details.address?.line1 || '',
    address2: session.customer_details.address?.line2 || undefined,
    city: session.customer_details.address?.city || '',
    zip: session.customer_details.address?.postal_code || '',
  }

  // Create the Printify order
  const printifyOrder: PrintifyOrder = {
    external_id: session.id, // Use Stripe session ID as external reference
    line_items: printifyLineItems,
    shipping_method: 1, // You'll need to determine the appropriate shipping method
    address_to: address,
  }

  // Submit the order to Printify
  const result = await printify.createOrder(printifyOrder)
  console.log('Printify order created:', result)
  
  return result
} 