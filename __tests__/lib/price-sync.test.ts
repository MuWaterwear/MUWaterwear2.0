import { PriceSynchronizer, ProductPrice, PriceSyncResult } from '@/lib/features/price-sync'

// Mock fetch globally
global.fetch = jest.fn()

describe('PriceSynchronizer', () => {
  let priceSynchronizer: PriceSynchronizer
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>

  beforeEach(() => {
    jest.clearAllMocks()
    priceSynchronizer = PriceSynchronizer.getInstance()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Singleton Pattern', () => {
    it('returns the same instance when called multiple times', () => {
      const instance1 = PriceSynchronizer.getInstance()
      const instance2 = PriceSynchronizer.getInstance()
      
      expect(instance1).toBe(instance2)
    })
  })

  describe('syncProductPrice', () => {
    const mockProduct: ProductPrice = {
      id: 'prod_123',
      name: 'Test Product',
      currentPrice: 99.99,
      currency: 'usd',
      syncStatus: 'pending'
    }

    it('successfully syncs product price when Stripe price differs', async () => {
      // Mock Stripe API responses
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ unit_amount: 8999 }) // $89.99 in cents
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({})
        } as Response)

      const result = await priceSynchronizer.syncProductPrice(mockProduct.id, mockProduct.currentPrice)

      expect(result.success).toBe(true)
      expect(result.productId).toBe(mockProduct.id)
      expect(result.oldPrice).toBe(89.99)
      expect(result.newPrice).toBe(99.99)
      expect(result.stripeUpdated).toBe(true)
      expect(mockFetch).toHaveBeenCalledTimes(2)
    })

    it('handles case when prices already match', async () => {
      // Mock Stripe API response with matching price
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ unit_amount: 9999 }) // $99.99 in cents
      } as Response)

      const result = await priceSynchronizer.syncProductPrice(mockProduct.id, mockProduct.currentPrice)

      expect(result.success).toBe(true)
      expect(result.stripeUpdated).toBe(false)
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    it('handles Stripe API errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Stripe API error'))

      const result = await priceSynchronizer.syncProductPrice(mockProduct.id, mockProduct.currentPrice)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Stripe API error')
    })

    it('handles product not found in Stripe', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      } as Response)

      const result = await priceSynchronizer.syncProductPrice(mockProduct.id, mockProduct.currentPrice)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Stripe API error: 404')
    })
  })

  describe('syncAllPrices', () => {
    const mockProducts: ProductPrice[] = [
      {
        id: 'prod_1',
        name: 'Product 1',
        currentPrice: 50.00,
        currency: 'usd',
        syncStatus: 'pending'
      },
      {
        id: 'prod_2',
        name: 'Product 2',
        currentPrice: 75.00,
        currency: 'usd',
        syncStatus: 'pending'
      }
    ]

    it('syncs multiple products successfully', async () => {
      // Mock successful responses for all products
      mockFetch
        .mockResolvedValue({
          ok: true,
          json: () => Promise.resolve({ unit_amount: 5000 })
        } as Response)

      const results = await priceSynchronizer.syncAllPrices(mockProducts)

      expect(results).toHaveLength(2)
      expect(results.every(r => r.success)).toBe(true)
    })

    it('handles mixed success and failure results', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ unit_amount: 5000 })
        } as Response)
        .mockRejectedValueOnce(new Error('Network error'))

      const results = await priceSynchronizer.syncAllPrices(mockProducts)

      expect(results).toHaveLength(2)
      expect(results[0].success).toBe(true)
      expect(results[1].success).toBe(false)
    })

    it('prevents concurrent sync operations', async () => {
      const syncPromise1 = priceSynchronizer.syncAllPrices(mockProducts)
      
      await expect(priceSynchronizer.syncAllPrices(mockProducts))
        .rejects
        .toThrow('Price synchronization is already in progress')

      // Complete the first sync
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ unit_amount: 5000 })
      } as Response)
      
      await syncPromise1
    })
  })

  describe('Pricing Rules', () => {
    it('applies seasonal discount during off-season', () => {
      // Mock date to be in December (off-season)
      const mockDate = new Date('2024-12-15')
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any)

      const products: ProductPrice[] = [{
        id: 'prod_1',
        name: 'Seasonal Product',
        currentPrice: 100.00,
        originalPrice: 100.00,
        currency: 'usd',
        syncStatus: 'pending'
      }]

      const rules = priceSynchronizer.getPricingRules()
      const seasonalRule = rules.find(r => r.id === 'seasonal-discount')
      
      expect(seasonalRule).toBeDefined()
      expect(seasonalRule!.condition(products[0])).toBe(true)
      
      const changes = seasonalRule!.action(products[0])
      expect(changes.currentPrice).toBe(85.00) // 15% discount
      expect(changes.discountPercentage).toBe(15)

      jest.restoreAllMocks()
    })

    it('applies bulk pricing for bundle products', () => {
      const products: ProductPrice[] = [{
        id: 'prod_1',
        name: 'Bundle Pack',
        currentPrice: 100.00,
        originalPrice: 100.00,
        currency: 'usd',
        syncStatus: 'pending'
      }]

      const rules = priceSynchronizer.getPricingRules()
      const bulkRule = rules.find(r => r.id === 'bulk-pricing')
      
      expect(bulkRule).toBeDefined()
      expect(bulkRule!.condition(products[0])).toBe(true)
      
      const changes = bulkRule!.action(products[0])
      expect(changes.currentPrice).toBe(90.00) // 10% discount
      expect(changes.discountPercentage).toBe(10)
    })

    it('applies premium pricing for premium products', () => {
      const products: ProductPrice[] = [{
        id: 'prod_1',
        name: 'Premium Wetsuit',
        currentPrice: 100.00,
        originalPrice: 100.00,
        currency: 'usd',
        syncStatus: 'pending'
      }]

      const rules = priceSynchronizer.getPricingRules()
      const premiumRule = rules.find(r => r.id === 'premium-pricing')
      
      expect(premiumRule).toBeDefined()
      expect(premiumRule!.condition(products[0])).toBe(true)
      
      const changes = premiumRule!.action(products[0])
      expect(changes.currentPrice).toBe(115.00) // 15% markup
    })

    it('allows adding custom pricing rules', () => {
      const customRule = {
        id: 'custom-rule',
        name: 'Custom Discount',
        condition: (product: ProductPrice) => product.name.includes('Special'),
        action: (product: ProductPrice) => ({ currentPrice: product.originalPrice! * 0.8 }),
        priority: 10,
        enabled: true
      }

      priceSynchronizer.updatePricingRule(customRule)
      
      const rules = priceSynchronizer.getPricingRules()
      expect(rules.find(r => r.id === 'custom-rule')).toEqual(customRule)
    })

    it('allows removing pricing rules', () => {
      const removed = priceSynchronizer.removePricingRule('seasonal-discount')
      
      expect(removed).toBe(true)
      
      const rules = priceSynchronizer.getPricingRules()
      expect(rules.find(r => r.id === 'seasonal-discount')).toBeUndefined()
    })
  })

  describe('validatePriceConsistency', () => {
    const mockProducts: ProductPrice[] = [
      {
        id: 'prod_1',
        name: 'Product 1',
        currentPrice: 50.00,
        currency: 'usd',
        syncStatus: 'pending'
      },
      {
        id: 'prod_2',
        name: 'Product 2',
        currentPrice: 75.00,
        currency: 'usd',
        syncStatus: 'pending'
      }
    ]

    it('identifies price mismatches', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ unit_amount: 4500 }) // $45.00, different from $50.00
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ unit_amount: 7500 }) // $75.00, matches
        } as Response)

      const result = await priceSynchronizer.validatePriceConsistency(mockProducts)

      expect(result.consistent).toBe(false)
      expect(result.issues).toHaveLength(1)
      expect(result.issues[0].productId).toBe('prod_1')
      expect(result.issues[0].issue).toBe('Price mismatch between internal and Stripe')
      expect(result.issues[0].internalPrice).toBe(50.00)
      expect(result.issues[0].stripePrice).toBe(45.00)
    })

    it('identifies products not found in Stripe', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 404
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ unit_amount: 7500 })
        } as Response)

      const result = await priceSynchronizer.validatePriceConsistency(mockProducts)

      expect(result.consistent).toBe(false)
      expect(result.issues).toHaveLength(1)
      expect(result.issues[0].productId).toBe('prod_1')
      expect(result.issues[0].issue).toBe('Product not found in Stripe')
    })

    it('reports consistent prices when all match', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ unit_amount: 5000 })
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ unit_amount: 7500 })
        } as Response)

      const result = await priceSynchronizer.validatePriceConsistency(mockProducts)

      expect(result.consistent).toBe(true)
      expect(result.issues).toHaveLength(0)
    })
  })

  describe('getSyncStatus', () => {
    it('returns correct sync status', () => {
      const status = priceSynchronizer.getSyncStatus()

      expect(status.syncInProgress).toBe(false)
      expect(status.activePricingRules).toBeGreaterThan(0)
      expect(status.lastFullSync).toBeUndefined()
    })
  })
}) 