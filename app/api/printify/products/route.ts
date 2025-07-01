import { NextResponse } from 'next/server'
import { PrintifyAPI } from '@/lib/integrations/printify'

export async function GET() {
  try {
    const accessToken = process.env.PRINTIFY_ACCESS_TOKEN
    const shopId = process.env.PRINTIFY_SHOP_ID

    if (!accessToken || !shopId) {
      return NextResponse.json({ error: 'Printify credentials not configured' }, { status: 500 })
    }

    const printify = new PrintifyAPI(accessToken, shopId)
    const products = await printify.getProducts()

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching Printify products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
