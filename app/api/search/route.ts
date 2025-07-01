import { NextResponse } from 'next/server'
import { searchProducts } from '@/lib/features/product-search'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') ?? ''
  const limit = Number(searchParams.get('limit') ?? '10')

  const results = searchProducts(q, limit)

  return NextResponse.json({ results })
} 