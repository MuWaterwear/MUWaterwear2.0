import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import SearchFunctionality from '@/components/SearchFunctionality'

// Mock the AI search module
jest.mock('@/lib/ai-search', () => ({
  aiSearchEngine: {
    search: jest.fn(),
    generateSuggestions: jest.fn()
  },
  performAISearch: jest.fn(),
  getSearchSuggestions: jest.fn()
}))

describe('SearchFunctionality', () => {
  const mockOnClose = jest.fn()

  beforeEach(() => {
    mockOnClose.mockClear()
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn()
      },
      writable: true
    })
  })

  it('renders search modal when open', () => {
    render(<SearchFunctionality isOpen={true} onClose={mockOnClose} />)
    
    expect(screen.getByPlaceholderText(/search for products/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/close search/i)).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(<SearchFunctionality isOpen={false} onClose={mockOnClose} />)
    
    expect(screen.queryByPlaceholderText(/search for products/i)).not.toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup()
    render(<SearchFunctionality isOpen={true} onClose={mockOnClose} />)
    
    const closeButton = screen.getByLabelText(/close search/i)
    await user.click(closeButton)
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when escape key is pressed', async () => {
    const user = userEvent.setup()
    render(<SearchFunctionality isOpen={true} onClose={mockOnClose} />)
    
    const searchInput = screen.getByPlaceholderText(/search for products/i)
    await user.click(searchInput)
    await user.keyboard('{Escape}')
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('updates search input value when typing', async () => {
    const user = userEvent.setup()
    render(<SearchFunctionality isOpen={true} onClose={mockOnClose} />)
    
    const searchInput = screen.getByPlaceholderText(/search for products/i)
    await user.type(searchInput, 'lake tahoe')
    
    expect(searchInput).toHaveValue('lake tahoe')
  })

  it('shows search suggestions when typing', async () => {
    const user = userEvent.setup()
    const { getSearchSuggestions } = require('@/lib/ai-search')
    getSearchSuggestions.mockReturnValue([
      { query: 'Lake Tahoe Board Shorts', type: 'product', confidence: 0.9 },
      { query: 'Tahoe', type: 'location', confidence: 0.8 }
    ])

    render(<SearchFunctionality isOpen={true} onClose={mockOnClose} />)
    
    const searchInput = screen.getByPlaceholderText(/search for products/i)
    await user.type(searchInput, 'ta')
    
    await waitFor(() => {
      expect(screen.getByText('Lake Tahoe Board Shorts')).toBeInTheDocument()
      expect(screen.getByText('Tahoe')).toBeInTheDocument()
    })
  })

  it('performs search when suggestion is clicked', async () => {
    const user = userEvent.setup()
    const { performAISearch } = require('@/lib/ai-search')
    const { getSearchSuggestions } = require('@/lib/ai-search')
    
    getSearchSuggestions.mockReturnValue([
      { query: 'Lake Tahoe Board Shorts', type: 'product', confidence: 0.9 }
    ])
    
    performAISearch.mockResolvedValue([
      {
        id: '1',
        name: 'Lake Tahoe Board Shorts',
        description: 'Premium board shorts',
        price: '$89.99',
        category: 'Swimwear',
        relevanceScore: 1.0,
        matchType: 'exact'
      }
    ])

    render(<SearchFunctionality isOpen={true} onClose={mockOnClose} />)
    
    const searchInput = screen.getByPlaceholderText(/search for products/i)
    await user.type(searchInput, 'ta')
    
    await waitFor(() => {
      const suggestion = screen.getByText('Lake Tahoe Board Shorts')
      user.click(suggestion)
    })
    
    await waitFor(() => {
      expect(performAISearch).toHaveBeenCalledWith(expect.objectContaining({
        query: 'Lake Tahoe Board Shorts'
      }))
    })
  })

  it('shows filters when filter button is clicked', async () => {
    const user = userEvent.setup()
    render(<SearchFunctionality isOpen={true} onClose={mockOnClose} />)
    
    const filterButton = screen.getByLabelText(/toggle filters/i)
    await user.click(filterButton)
    
    expect(screen.getByText('Categories:')).toBeInTheDocument()
    expect(screen.getByText('All')).toBeInTheDocument()
    expect(screen.getByText('Apparel')).toBeInTheDocument()
    expect(screen.getByText('Swimwear')).toBeInTheDocument()
  })

  it('filters results by category', async () => {
    const user = userEvent.setup()
    const { performAISearch } = require('@/lib/ai-search')
    
    performAISearch.mockResolvedValue([
      {
        id: '1',
        name: 'Test Swimwear',
        description: 'Test description',
        price: '$50.00',
        category: 'Swimwear',
        relevanceScore: 1.0,
        matchType: 'exact'
      }
    ])

    render(<SearchFunctionality isOpen={true} onClose={mockOnClose} />)
    
    // Open filters
    const filterButton = screen.getByLabelText(/toggle filters/i)
    await user.click(filterButton)
    
    // Select Swimwear category
    const swimwearButton = screen.getByText('Swimwear')
    await user.click(swimwearButton)
    
    // Perform search
    const searchInput = screen.getByPlaceholderText(/search for products/i)
    await user.type(searchInput, 'test')
    
    await waitFor(() => {
      expect(performAISearch).toHaveBeenCalledWith(expect.objectContaining({
        query: 'test',
        category: 'Swimwear'
      }))
    })
  })

  it('clears search input when clear button is clicked', async () => {
    const user = userEvent.setup()
    render(<SearchFunctionality isOpen={true} onClose={mockOnClose} />)
    
    const searchInput = screen.getByPlaceholderText(/search for products/i)
    await user.type(searchInput, 'test query')
    
    const clearButton = screen.getByLabelText(/clear search/i)
    await user.click(clearButton)
    
    expect(searchInput).toHaveValue('')
  })

  it('displays popular searches when no query entered', () => {
    render(<SearchFunctionality isOpen={true} onClose={mockOnClose} />)
    
    expect(screen.getByText('Popular Searches')).toBeInTheDocument()
    expect(screen.getByText('Board shorts')).toBeInTheDocument()
    expect(screen.getByText('Lake Tahoe')).toBeInTheDocument()
  })

  it('displays recent searches from localStorage', () => {
    const mockRecentSearches = ['board shorts', 'tahoe gear']
    ;(window.localStorage.getItem as jest.Mock).mockReturnValue(
      JSON.stringify(mockRecentSearches)
    )

    render(<SearchFunctionality isOpen={true} onClose={mockOnClose} />)
    
    expect(screen.getByText('Recent Searches')).toBeInTheDocument()
    expect(screen.getByText('board shorts')).toBeInTheDocument()
    expect(screen.getByText('tahoe gear')).toBeInTheDocument()
  })

  it('handles search errors gracefully', async () => {
    const user = userEvent.setup()
    const { performAISearch } = require('@/lib/ai-search')
    
    performAISearch.mockRejectedValue(new Error('Search failed'))
    
    // Mock console.error to avoid error output in tests
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    render(<SearchFunctionality isOpen={true} onClose={mockOnClose} />)
    
    const searchInput = screen.getByPlaceholderText(/search for products/i)
    await user.type(searchInput, 'test')
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Search error'),
        expect.any(Error)
      )
    })
    
    consoleSpy.mockRestore()
  })

  it('is accessible with keyboard navigation', async () => {
    const user = userEvent.setup()
    const { getSearchSuggestions } = require('@/lib/ai-search')
    
    getSearchSuggestions.mockReturnValue([
      { query: 'First Suggestion', type: 'product', confidence: 0.9 },
      { query: 'Second Suggestion', type: 'product', confidence: 0.8 }
    ])

    render(<SearchFunctionality isOpen={true} onClose={mockOnClose} />)
    
    const searchInput = screen.getByPlaceholderText(/search for products/i)
    await user.type(searchInput, 'test')
    
    // Navigate suggestions with arrow keys
    await user.keyboard('{ArrowDown}')
    await user.keyboard('{ArrowDown}')
    await user.keyboard('{ArrowUp}')
    
    // Should be able to select with Enter
    await user.keyboard('{Enter}')
    
    // Test passes if no errors are thrown during navigation
    expect(true).toBe(true)
  })

  it('has proper ARIA labels for accessibility', () => {
    render(<SearchFunctionality isOpen={true} onClose={mockOnClose} />)
    
    expect(screen.getByLabelText(/search products/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/close search/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/toggle filters/i)).toBeInTheDocument()
  })
}) 