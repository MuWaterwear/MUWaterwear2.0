import Fuse from 'fuse.js'
import productsJson from '@/data/printify-products.json'

export interface ProductItem {
  id: string
  title: string
  tags: string[]
  price: number
  image?: string
}

// Convert raw data to ProductItem[]
const rawList: any[] = (productsJson as any).products ?? []

const products: ProductItem[] = rawList.map((p) => ({
  id: p.id ?? p.handle ?? p.title,
  title: p.title,
  tags: p.tags ?? [],
  price: Number(p.price ?? 0),
  image: p.image || p.images?.[0] || undefined,
}))

const fuse = new Fuse(products, {
  keys: ['title', 'tags'],
  includeScore: true,
  threshold: 0.35,
})

export const searchProducts = (query: string, limit = 10): ProductItem[] => {
  if (!query.trim()) return []
  return fuse.search(query).slice(0, limit).map((result: any) => result.item)
} 