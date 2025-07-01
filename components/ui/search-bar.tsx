"use client"

import { useState, useEffect, useRef } from 'react'
import { Search as SearchIcon, Loader2 } from 'lucide-react'
import { FadeImage } from '@/components/ui/fade-image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface ResultItem {
  id: string
  title: string
  image?: string
  price: number
}

export const SearchBar = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ResultItem[]>([])
  const [loading, setLoading] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch suggestions with debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=8`)
        const data = await res.json()
        setResults(data.results)
      } catch (error) {
        console.error('Search error', error)
      } finally {
        setLoading(false)
      }
    }, 300) // 300 ms debounce
  }, [query])

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search products…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-3 pl-11 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all duration-200"
      />
      <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      {loading && (
        <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-brand-accent" />
      )}

      {/* Suggestion dropdown */}
      {results.length > 0 && (
        <div className="absolute z-50 mt-2 w-full bg-gray-900 border border-gray-800 rounded-lg shadow-lg max-h-80 overflow-y-auto animate-fadeIn">
          {results.map((item) => (
            <Link
              key={item.id}
              href={`/product/${item.id}`}
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-800 transition-colors"
              onClick={() => setQuery('')}
            >
              {item.image && (
                <FadeImage
                  src={item.image}
                  alt={item.title}
                  width={48}
                  height={48}
                  className="w-12 h-12 object-cover rounded-md"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{item.title}</p>
                <p className="text-xs text-gray-400">${item.price.toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
} 