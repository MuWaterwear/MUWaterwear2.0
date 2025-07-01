'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Search, X, TrendingUp, Clock, Filter, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface SearchResult {
  id: string
  title: string
  description: string
  price: string
  image: string
  category: string
  tags: string[]
  url: string
  inStock: boolean
}

interface SearchFunctionalityProps {
  isOpen: boolean
  onClose: () => void
}

// Enhanced mock product data with predictive search capabilities
const mockProducts: SearchResult[] = [
  {
    id: '1',
    title: 'Lake Tahoe Board Shorts',
    description: 'Premium board shorts perfect for Tahoe adventures',
    price: '$89.99',
    image:
      '/images/CDA-Board-Shorts/all-over-print-recycled-swim-trunks-white-front-6851bc9690d90.png',
    category: 'Swimwear',
    tags: ['board shorts', 'tahoe', 'swimming', 'surfing', 'premium', 'lake'],
    url: '/lake-tahoe',
    inStock: true,
  },
  {
    id: '2',
    title: 'CDA Fish Tee',
    description: "Coeur d'Alene inspired fishing t-shirt",
    price: '$34.99',
    image: '/images/CDA-FISH-TEE/Navy-Backside.png',
    category: 'Apparel',
    tags: ['t-shirt', 'fishing', 'coeur dalene', 'cda', 'navy', 'cotton'],
    url: '/coeur-dalene',
    inStock: true,
  },
  {
    id: '3',
    title: 'MU Wake Community Tee',
    description: 'Show your wake community pride',
    price: '$29.99',
    image: '/images/MU-WAKE-COMMUNITY-TEE/Black-Front.png',
    category: 'Apparel',
    tags: ['t-shirt', 'wake', 'community', 'wakeboard', 'black', 'pride'],
    url: '/apparel',
    inStock: true,
  },
  {
    id: '4',
    title: 'Flathead Lake Hat',
    description: "Montana's gem on your head",
    price: '$24.99',
    image:
      '/images/ACCESSORIES/FLATHEAD-LAKE-HAT/flathead-trucker-hat-navy-front-6856b264b7fae.png',
    category: 'Accessories',
    tags: ['hat', 'flathead', 'montana', 'trucker cap', 'navy', 'cap'],
    url: '/flathead',
    inStock: false,
  },
  {
    id: '5',
    title: 'Lindbergh Swim Shorts',
    description: 'Wilderness-inspired swim shorts',
    price: '$59.99',
    image: '/images/LINDBERGH-MENS-SWIMWEAR/1.svg',
    category: 'Swimwear',
    tags: ['swim shorts', 'lindbergh', 'wilderness', 'swimming', 'mens', 'shorts'],
    url: '/lindbergh',
    inStock: true,
  },
  {
    id: '6',
    title: 'Detroit Lake Beanie',
    description: "Keep warm by Oregon's hidden gem",
    price: '$19.99',
    image: '/images/ACCESSORIES/DETROIT-BEANIE/detroit-beanie-navy-front-6856b2358c9b4.png',
    category: 'Accessories',
    tags: ['beanie', 'detroit', 'oregon', 'warm', 'winter', 'navy'],
    url: '/detroit-lake',
    inStock: true,
  },
]

const popularSearches = [
  'Board shorts',
  'Lake Tahoe',
  'CDA gear',
  'Wake community',
  'Flathead',
  'Swim tees',
  'Beanies',
  'Hats',
]

const categories = ['All', 'Apparel', 'Swimwear', 'Accessories', 'Gear']

export default function SearchFunctionality({ isOpen, onClose }: SearchFunctionalityProps) {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showFilters, setShowFilters] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('mu-recent-searches')
      if (saved) {
        setRecentSearches(JSON.parse(saved))
      }
    } catch (error) {
      console.error('Error loading recent searches:', error)
    }
  }, [])

  // Generate predictive suggestions
  const suggestions = useMemo(() => {
    if (!query.trim() || query.length < 2) return []

    const searchTerm = query.toLowerCase()
    const productSuggestions = new Set<string>()

    // Add exact matches from product titles
    mockProducts.forEach(product => {
      if (product.title.toLowerCase().includes(searchTerm)) {
        productSuggestions.add(product.title)
      }
      // Add tag matches
      product.tags.forEach(tag => {
        if (tag.toLowerCase().includes(searchTerm)) {
          productSuggestions.add(tag)
        }
      })
    })

    // Add category matches
    categories.forEach(category => {
      if (category.toLowerCase().includes(searchTerm) && category !== 'All') {
        productSuggestions.add(category)
      }
    })

    return Array.from(productSuggestions).slice(0, 5)
  }, [query])

  // Filter products based on search query and category
  const filteredResults = useMemo(() => {
    if (!query.trim()) return []

    const searchTerm = query.toLowerCase()
    return mockProducts.filter(product => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
      const matchesSearch =
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        product.category.toLowerCase().includes(searchTerm)

      return matchesCategory && matchesSearch
    })
  }, [query, selectedCategory])

  // Save search to recent searches
  const saveSearch = useCallback(
    (searchTerm: string) => {
      if (!searchTerm.trim()) return

      try {
        const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5)
        setRecentSearches(updated)
        localStorage.setItem('mu-recent-searches', JSON.stringify(updated))
      } catch (error) {
        console.error('Error saving search:', error)
      }
    },
    [recentSearches]
  )

  // Handle search submission
  const handleSearch = useCallback(
    (searchTerm: string) => {
      if (!searchTerm.trim()) return

      saveSearch(searchTerm)
      setQuery(searchTerm)
      setShowSuggestions(false)
      setIsLoading(true)

      // Simulate search delay
      setTimeout(() => setIsLoading(false), 300)
    },
    [saveSearch]
  )

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowSuggestions(false)
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedSuggestionIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedSuggestionIndex(prev => (prev > -1 ? prev - 1 : -1))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (selectedSuggestionIndex >= 0 && suggestions[selectedSuggestionIndex]) {
          handleSearch(suggestions[selectedSuggestionIndex])
        } else {
          handleSearch(query)
        }
      }
    },
    [suggestions, selectedSuggestionIndex, query, handleSearch, onClose]
  )

  // Handle input change with predictive suggestions
  const handleInputChange = useCallback((value: string) => {
    setQuery(value)
    setSelectedSuggestionIndex(-1)
    setShowSuggestions(value.length >= 2)
  }, [])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose}>
      <div
        className="bg-slate-900 border-b border-slate-800 p-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={e => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowSuggestions(query.length >= 2)}
                placeholder="Search for products, lakes, gear..."
                className="w-full pl-10 pr-12 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                aria-label="Search products"
                autoComplete="off"
              />

              {/* Predictive Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-10"
                >
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSearch(suggestion)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-700 transition-colors ${
                        index === selectedSuggestionIndex ? 'bg-slate-700' : ''
                      } ${index === 0 ? 'rounded-t-lg' : ''} ${
                        index === suggestions.length - 1 ? 'rounded-b-lg' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Search className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-300">{suggestion}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {query && (
                <button
                  onClick={() => {
                    setQuery('')
                    setShowSuggestions(false)
                    searchInputRef.current?.focus()
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  aria-label="Clear search"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-gray-300 hover:text-white hover:border-slate-600 transition-colors"
              aria-label="Toggle filters"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>

            <button
              onClick={onClose}
              className="p-3 text-gray-400 hover:text-white transition-colors"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="flex flex-wrap gap-2 mb-4 p-4 bg-slate-800 rounded-lg">
              <span className="text-sm text-gray-400 mr-2">Categories:</span>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedCategory === category
                      ? 'bg-cyan-400 text-black'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Search Results */}
      <div className="bg-slate-900 max-h-[60vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="max-w-4xl mx-auto p-4">
          {/* No query state */}
          {!query.trim() && (
            <div className="space-y-6">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 text-white font-medium mb-3">
                    <Clock className="w-4 h-4" />
                    Recent Searches
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(search)}
                        className="px-3 py-1 bg-slate-800 text-gray-300 rounded-lg hover:bg-slate-700 transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              <div>
                <h3 className="flex items-center gap-2 text-white font-medium mb-3">
                  <TrendingUp className="w-4 h-4" />
                  Popular Searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(search)}
                      className="px-3 py-1 bg-slate-800 text-gray-300 rounded-lg hover:bg-slate-700 transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && query.trim() && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-4"></div>
              <p className="text-gray-400">Searching...</p>
            </div>
          )}

          {/* Search Results */}
          {!isLoading && query.trim() && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-400">
                  {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''} for "
                  {query}"
                </p>
                {filteredResults.length > 0 && (
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}&category=${selectedCategory}`}
                    onClick={onClose}
                    className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
                  >
                    View all results
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>

              {filteredResults.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-2">No results found</p>
                  <p className="text-gray-500 text-sm">
                    Try different keywords or browse our categories
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredResults.slice(0, 6).map(product => (
                    <Link
                      key={product.id}
                      href={product.url}
                      onClick={onClose}
                      className="group bg-slate-800 rounded-lg p-4 hover:bg-slate-700 transition-colors"
                    >
                      <div className="relative mb-3">
                        <Image
                          src={product.image}
                          alt={product.title}
                          width={200}
                          height={150}
                          className="w-full h-32 object-cover rounded-lg"
                          onError={e => {
                            const target = e.target as HTMLImageElement
                            target.src = '/images/placeholder.png'
                          }}
                        />
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xs bg-red-500 px-2 py-1 rounded">
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </div>

                      <h4 className="text-white font-medium group-hover:text-cyan-400 transition-colors">
                        {product.title}
                      </h4>
                      <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-cyan-400 font-bold">{product.price}</span>
                        <span className="text-xs text-gray-500 bg-slate-700 px-2 py-1 rounded">
                          {product.category}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
