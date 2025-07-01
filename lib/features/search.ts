// AI-Driven Search Feature for MU Waterwear
'use client'

interface Product {
  id: string
  name: string
  description: string
  price: string
  category: string
  tags: string[]
  image: string
  inStock: boolean
  rating?: number
  reviews?: number
  waterBodies?: string[]
  activities?: string[]
}

interface SearchResult extends Product {
  relevanceScore: number
  matchType: 'exact' | 'semantic' | 'category' | 'activity' | 'location'
  highlightedText?: string
}

interface SearchSuggestion {
  query: string
  type: 'product' | 'category' | 'activity' | 'location'
  confidence: number
}

interface AISearchOptions {
  query: string
  category?: string
  priceRange?: [number, number]
  inStockOnly?: boolean
  sortBy?: 'relevance' | 'price' | 'rating' | 'popularity'
  limit?: number
}

class AISearchEngine {
  private products: Product[] = []
  private searchHistory: string[] = []
  private userPreferences: Record<string, number> = {}

  constructor() {
    this.loadProducts()
    this.loadUserPreferences()
  }

  private loadProducts(): void {
    // Enhanced product data with semantic information
    this.products = [
      {
        id: '1',
        name: 'Lake Tahoe Board Shorts',
        description: 'Premium quick-dry board shorts designed for alpine lake adventures. Perfect for surfing, swimming, and water sports in mountain lakes.',
        price: '$89.99',
        category: 'Swimwear',
        tags: ['board shorts', 'quick-dry', 'swimming', 'surfing', 'water sports'],
        image: '/images/CDA-Board-Shorts/all-over-print-recycled-swim-trunks-white-front-6851bc9690d90.png',
        inStock: true,
        rating: 4.8,
        reviews: 127,
        waterBodies: ['lake tahoe', 'alpine lakes', 'mountain lakes'],
        activities: ['surfing', 'swimming', 'wakeboarding', 'paddleboarding']
      },
      {
        id: '2',
        name: 'CDA Fish Tee',
        description: 'Coeur d\'Alene inspired fishing t-shirt made from moisture-wicking fabric. Perfect for lake fishing and outdoor adventures.',
        price: '$34.99',
        category: 'Apparel',
        tags: ['t-shirt', 'fishing', 'moisture-wicking', 'outdoor'],
        image: '/images/CDA-FISH-TEE/Navy-Backside.png',
        inStock: true,
        rating: 4.6,
        reviews: 89,
        waterBodies: ['coeur dalene', 'cda', 'idaho lakes'],
        activities: ['fishing', 'hiking', 'camping', 'outdoor recreation']
      },
      {
        id: '3',
        name: 'MU Wake Community Tee',
        description: 'Show your wake community pride with this premium cotton tee. Perfect for wakeboarding events and lake gatherings.',
        price: '$29.99',
        category: 'Apparel',
        tags: ['t-shirt', 'wakeboarding', 'community', 'cotton'],
        image: '/images/MU-WAKE-COMMUNITY-TEE/Black-Front.png',
        inStock: true,
        rating: 4.9,
        reviews: 203,
        waterBodies: ['all lakes', 'wake lakes'],
        activities: ['wakeboarding', 'wake surfing', 'boating', 'water skiing']
      },
      {
        id: '4',
        name: 'Flathead Lake Hat',
        description: 'Montana\'s largest natural freshwater lake inspired trucker hat. UV protection for all-day water adventures.',
        price: '$24.99',
        category: 'Accessories',
        tags: ['hat', 'trucker cap', 'uv protection', 'montana'],
        image: '/images/ACCESSORIES/FLATHEAD-LAKE-HAT/flathead-trucker-hat-navy-front-6856b264b7fae.png',
        inStock: false,
        rating: 4.7,
        reviews: 156,
        waterBodies: ['flathead lake', 'montana lakes'],
        activities: ['fishing', 'boating', 'hiking', 'outdoor recreation']
      },
      {
        id: '5',
        name: 'Lindbergh Swim Shorts',
        description: 'Wilderness-inspired swim shorts perfect for backcountry lake adventures. Quick-dry with secure pockets.',
        price: '$59.99',
        category: 'Swimwear',
        tags: ['swim shorts', 'quick-dry', 'backcountry', 'wilderness'],
        image: '/images/LINDBERGH-MENS-SWIMWEAR/1.svg',
        inStock: true,
        rating: 4.5,
        reviews: 78,
        waterBodies: ['mountain lakes', 'backcountry lakes', 'wilderness areas'],
        activities: ['swimming', 'hiking', 'camping', 'backpacking']
      },
      {
        id: '6',
        name: 'Detroit Lake Beanie',
        description: 'Keep warm by Oregon\'s hidden gem. Perfect for early morning and late evening water activities.',
        price: '$19.99',
        category: 'Accessories',
        tags: ['beanie', 'warm', 'oregon', 'lake'],
        image: '/images/ACCESSORIES/DETROIT-BEANIE/detroit-beanie-navy-front-6856b2358c9b4.png',
        inStock: true,
        rating: 4.4,
        reviews: 92,
        waterBodies: ['detroit lake', 'oregon lakes'],
        activities: ['fishing', 'camping', 'hiking', 'water sports']
      }
    ]
  }

  private loadUserPreferences(): void {
    try {
      const saved = localStorage.getItem('mu-search-preferences')
      if (saved) {
        this.userPreferences = JSON.parse(saved)
      }
    } catch (error) {
      console.error('Error loading search preferences:', error)
    }
  }

  private saveUserPreferences(): void {
    try {
      localStorage.setItem('mu-search-preferences', JSON.stringify(this.userPreferences))
    } catch (error) {
      console.error('Error saving search preferences:', error)
    }
  }

  // Main AI search function
  async search(options: AISearchOptions): Promise<SearchResult[]> {
    const { query, category, priceRange, inStockOnly, sortBy = 'relevance', limit = 10 } = options

    // Track search for learning
    this.trackSearch(query)

    // Get all potential matches
    let results: SearchResult[] = []

    // 1. Exact matches (highest priority)
    results.push(...this.findExactMatches(query))

    // 2. Semantic matches using AI-like scoring
    results.push(...this.findSemanticMatches(query))

    // 3. Category and activity matches
    results.push(...this.findCategoryMatches(query))

    // 4. Location-based matches
    results.push(...this.findLocationMatches(query))

    // Remove duplicates
    results = this.removeDuplicates(results)

    // Apply filters
    results = this.applyFilters(results, { category, priceRange, inStockOnly })

    // Sort results
    results = this.sortResults(results, sortBy)

    // Limit results
    results = results.slice(0, limit)

    // Learn from user interaction
    this.updateUserPreferences(query, results)

    return results
  }

  // Generate intelligent search suggestions
  generateSuggestions(query: string): SearchSuggestion[] {
    const suggestions: SearchSuggestion[] = []
    const queryLower = query.toLowerCase()

    // Product name suggestions
    this.products.forEach(product => {
      if (product.name.toLowerCase().includes(queryLower)) {
        suggestions.push({
          query: product.name,
          type: 'product',
          confidence: this.calculateSimilarity(query, product.name)
        })
      }
    })

    // Category suggestions
    const categories = ['Swimwear', 'Apparel', 'Accessories', 'Gear']
    categories.forEach(category => {
      if (category.toLowerCase().includes(queryLower)) {
        suggestions.push({
          query: category,
          type: 'category',
          confidence: this.calculateSimilarity(query, category)
        })
      }
    })

    // Activity suggestions
    const activities = ['swimming', 'fishing', 'wakeboarding', 'surfing', 'boating', 'hiking']
    activities.forEach(activity => {
      if (activity.includes(queryLower) || queryLower.includes(activity)) {
        suggestions.push({
          query: activity,
          type: 'activity',
          confidence: this.calculateSimilarity(query, activity)
        })
      }
    })

    // Location suggestions
    const locations = ['Lake Tahoe', 'Coeur d\'Alene', 'Flathead Lake', 'Detroit Lake']
    locations.forEach(location => {
      if (location.toLowerCase().includes(queryLower)) {
        suggestions.push({
          query: location,
          type: 'location',
          confidence: this.calculateSimilarity(query, location)
        })
      }
    })

    // Sort by confidence and return top suggestions
    return suggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5)
  }

  // Get personalized recommendations
  getPersonalizedRecommendations(limit: number = 6): Product[] {
    const recommendations: Array<Product & { score: number }> = []

    this.products.forEach(product => {
      let score = 0

      // Base score from rating
      score += (product.rating || 0) * 0.3

      // Boost based on user preferences
      product.tags.forEach(tag => {
        score += (this.userPreferences[tag] || 0) * 0.4
      })

      // Boost in-stock items
      if (product.inStock) {
        score += 0.2
      }

      // Boost popular items
      score += Math.log10((product.reviews || 1) + 1) * 0.1

      recommendations.push({ ...product, score })
    })

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ score, ...product }) => product)
  }

  // Find exact text matches
  private findExactMatches(query: string): SearchResult[] {
    const queryLower = query.toLowerCase()
    const results: SearchResult[] = []

    this.products.forEach(product => {
      if (product.name.toLowerCase().includes(queryLower)) {
        results.push({
          ...product,
          relevanceScore: 1.0,
          matchType: 'exact',
          highlightedText: this.highlightText(product.name, query)
        })
      } else if (product.description.toLowerCase().includes(queryLower)) {
        results.push({
          ...product,
          relevanceScore: 0.8,
          matchType: 'exact',
          highlightedText: this.highlightText(product.description, query)
        })
      }
    })

    return results
  }

  // Find semantic matches using similarity scoring
  private findSemanticMatches(query: string): SearchResult[] {
    const results: SearchResult[] = []
    const queryWords = query.toLowerCase().split(' ')

    this.products.forEach(product => {
      let semanticScore = 0
      const productText = `${product.name} ${product.description} ${product.tags.join(' ')}`.toLowerCase()

      // Calculate semantic similarity
      queryWords.forEach(word => {
        if (productText.includes(word)) {
          semanticScore += 0.3
        }

        // Check for related terms
        const relatedTerms = this.getRelatedTerms(word)
        relatedTerms.forEach(term => {
          if (productText.includes(term)) {
            semanticScore += 0.1
          }
        })
      })

      if (semanticScore > 0.2) {
        results.push({
          ...product,
          relevanceScore: Math.min(semanticScore, 0.9),
          matchType: 'semantic'
        })
      }
    })

    return results
  }

  // Find category-based matches
  private findCategoryMatches(query: string): SearchResult[] {
    const results: SearchResult[] = []
    const queryLower = query.toLowerCase()

    this.products.forEach(product => {
      if (product.category.toLowerCase().includes(queryLower)) {
        results.push({
          ...product,
          relevanceScore: 0.7,
          matchType: 'category'
        })
      }

      // Check activities
      if (product.activities?.some(activity => 
        activity.toLowerCase().includes(queryLower) || 
        queryLower.includes(activity.toLowerCase())
      )) {
        results.push({
          ...product,
          relevanceScore: 0.6,
          matchType: 'activity'
        })
      }
    })

    return results
  }

  // Find location-based matches
  private findLocationMatches(query: string): SearchResult[] {
    const results: SearchResult[] = []
    const queryLower = query.toLowerCase()

    this.products.forEach(product => {
      if (product.waterBodies?.some(location => 
        location.toLowerCase().includes(queryLower) || 
        queryLower.includes(location.toLowerCase())
      )) {
        results.push({
          ...product,
          relevanceScore: 0.5,
          matchType: 'location'
        })
      }
    })

    return results
  }

  // Get related terms for semantic search
  private getRelatedTerms(word: string): string[] {
    const relatedTerms: Record<string, string[]> = {
      'swim': ['swimming', 'water', 'lake', 'pool'],
      'fish': ['fishing', 'angling', 'catch', 'bass'],
      'wake': ['wakeboard', 'surfing', 'boating', 'water ski'],
      'board': ['surfboard', 'wakeboard', 'paddle', 'water'],
      'hat': ['cap', 'beanie', 'headwear', 'sun protection'],
      'tee': ['shirt', 't-shirt', 'top', 'apparel'],
      'shorts': ['swimwear', 'trunks', 'bottoms'],
      'lake': ['water', 'reservoir', 'pond', 'river'],
      'mountain': ['alpine', 'peak', 'high altitude', 'outdoor'],
      'outdoor': ['nature', 'adventure', 'recreation', 'activity']
    }

    return relatedTerms[word.toLowerCase()] || []
  }

  // Calculate text similarity (simple implementation)
  private calculateSimilarity(text1: string, text2: string): number {
    const words1 = text1.toLowerCase().split(' ')
    const words2 = text2.toLowerCase().split(' ')
    
    let matches = 0
    words1.forEach(word => {
      if (words2.some(w => w.includes(word) || word.includes(w))) {
        matches++
      }
    })

    return matches / Math.max(words1.length, words2.length)
  }

  // Highlight matching text
  private highlightText(text: string, query: string): string {
    const queryWords = query.split(' ')
    let highlighted = text

    queryWords.forEach(word => {
      const regex = new RegExp(`(${word})`, 'gi')
      highlighted = highlighted.replace(regex, '<mark>$1</mark>')
    })

    return highlighted
  }

  // Remove duplicate results
  private removeDuplicates(results: SearchResult[]): SearchResult[] {
    const seen = new Set()
    return results.filter(result => {
      if (seen.has(result.id)) {
        return false
      }
      seen.add(result.id)
      return true
    })
  }

  // Apply filters to results
  private applyFilters(
    results: SearchResult[], 
    filters: { category?: string; priceRange?: [number, number]; inStockOnly?: boolean }
  ): SearchResult[] {
    let filtered = results

    if (filters.category && filters.category !== 'All') {
      filtered = filtered.filter(result => result.category === filters.category)
    }

    if (filters.priceRange) {
      filtered = filtered.filter(result => {
        const price = parseFloat(result.price.replace('$', ''))
        return price >= filters.priceRange![0] && price <= filters.priceRange![1]
      })
    }

    if (filters.inStockOnly) {
      filtered = filtered.filter(result => result.inStock)
    }

    return filtered
  }

  // Sort results by different criteria
  private sortResults(results: SearchResult[], sortBy: string): SearchResult[] {
    return results.sort((a, b) => {
      switch (sortBy) {
        case 'relevance':
          return b.relevanceScore - a.relevanceScore
        case 'price':
          return parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', ''))
        case 'rating':
          return (b.rating || 0) - (a.rating || 0)
        case 'popularity':
          return (b.reviews || 0) - (a.reviews || 0)
        default:
          return b.relevanceScore - a.relevanceScore
      }
    })
  }

  // Track search for learning
  private trackSearch(query: string): void {
    this.searchHistory.unshift(query)
    this.searchHistory = this.searchHistory.slice(0, 100) // Keep last 100 searches
    
    try {
      localStorage.setItem('mu-search-history', JSON.stringify(this.searchHistory))
    } catch (error) {
      console.error('Error saving search history:', error)
    }
  }

  // Update user preferences based on interactions
  private updateUserPreferences(query: string, results: SearchResult[]): void {
    const queryWords = query.toLowerCase().split(' ')
    
    queryWords.forEach(word => {
      this.userPreferences[word] = (this.userPreferences[word] || 0) + 0.1
    })

    // Boost preferences for returned product tags
    results.forEach(result => {
      result.tags.forEach(tag => {
        this.userPreferences[tag] = (this.userPreferences[tag] || 0) + 0.05
      })
    })

    this.saveUserPreferences()
  }

  // Get search analytics
  getSearchAnalytics(): {
    topQueries: string[]
    topCategories: string[]
    conversionRate: number
  } {
    const queryCount: Record<string, number> = {}
    
    this.searchHistory.forEach(query => {
      queryCount[query] = (queryCount[query] || 0) + 1
    })

    const topQueries = Object.entries(queryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([query]) => query)

    return {
      topQueries,
      topCategories: ['Swimwear', 'Apparel', 'Accessories'],
      conversionRate: 0.23 // Example metric
    }
  }
}

// Export singleton instance
export const aiSearchEngine = new AISearchEngine()

// Utility functions
export async function performAISearch(query: string, options: Partial<AISearchOptions> = {}): Promise<SearchResult[]> {
  return await aiSearchEngine.search({ query, ...options })
}

export function getSearchSuggestions(query: string): SearchSuggestion[] {
  return aiSearchEngine.generateSuggestions(query)
}

export function getPersonalizedRecommendations(limit?: number): Product[] {
  return aiSearchEngine.getPersonalizedRecommendations(limit)
} 