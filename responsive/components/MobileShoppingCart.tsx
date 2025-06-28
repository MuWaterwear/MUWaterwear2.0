"use client"

import { useState, useEffect } from "react"
import { X, Minus, Plus, ShoppingCart, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useCart } from "@/contexts/CartContext"
import { loadStripe } from '@stripe/stripe-js'
import CustomerInfoForm from "@/components/CustomerInfoForm"

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function MobileShoppingCart() {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeItem, 
    getCartTotal, 
    getCartItemCount,
    clearCart
  } = useCart()
  
  const [isAnimating, setIsAnimating] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [showCustomerForm, setShowCustomerForm] = useState(false)
  const [savingCustomer, setSavingCustomer] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [couponError, setCouponError] = useState('')
  const [actualCosts, setActualCosts] = useState<{[itemId: string]: {productionCost: number; shippingCost: number; taxCost: number; totalCost: number}} | null>(null)
  const [isLoadingCosts, setIsLoadingCosts] = useState(false)

  useEffect(() => {
    if (isCartOpen) {
      setIsAnimating(true)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isCartOpen])

  const handleClose = () => {
    setIsAnimating(false)
    setTimeout(() => setIsCartOpen(false), 300)
  }

  const handleCheckout = () => {
    if (cart.length === 0) return
    setShowCustomerForm(true)
  }

  const [customerInfo, setCustomerInfo] = useState<{ firstName: string; lastName: string; email: string } | null>(null)

  const handleCustomerSubmit = async (customerData: { firstName: string; lastName: string; email: string }) => {
    setSavingCustomer(true)

    try {
      // Save customer data to MongoDB
      const customerResponse = await fetch('/api/save-customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...customerData,
          cartItems: cart
        }),
      })

      if (!customerResponse.ok) {
        throw new Error('Failed to save customer information')
      }

      const customerResult = await customerResponse.json()
      console.log('Customer saved:', customerResult)

      // Store customer info for Stripe checkout
      setCustomerInfo(customerData)

      // Close customer form
      setShowCustomerForm(false)

      // Proceed to Stripe checkout with customer info
      await proceedToStripeCheckout(customerData)

    } catch (error) {
      console.error('Error saving customer:', error)
      alert('There was an error saving your information. Please try again.')
    } finally {
      setSavingCustomer(false)
    }
  }

  const proceedToStripeCheckout = async (customerData?: { firstName: string; lastName: string; email: string }) => {
    if (cart.length === 0) return
    
    if (!stripePromise) {
      alert('Stripe is not configured. Please check your environment variables.')
      return
    }
    
    setIsCheckingOut(true)
    setCouponError('')
    
    try {
      // Convert user-friendly coupon to Stripe format for API call
      let stripeCouponCode = appliedCoupon
      if (appliedCoupon?.toLowerCase() === 'lindbergh@lake737') {
        stripeCouponCode = 'LINDBERGH-LAKE737'
      }
      
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart,
          couponCode: stripeCouponCode || undefined,
          // Pass actual costs for Lindbergh coupon
          actualCosts: appliedCoupon?.toLowerCase() === 'lindbergh@lake737' ? actualCosts : undefined,
          effectiveTotal: parseFloat(getEffectiveCartTotal()) + getEffectiveShipping(),
          // Pass customer info for auto-fill
          customerInfo: customerData
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (errorData.error && errorData.error.includes('coupon')) {
          setCouponError(errorData.error)
          setAppliedCoupon(null)
          return
        }
        throw new Error('Failed to create checkout session')
      }

      const { sessionId, appliedCoupon: confirmedCoupon } = await response.json()
      const stripe = await stripePromise

      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId })
        if (error) {
          console.error('Stripe checkout error:', error)
          alert('There was an error processing your payment. Please try again.')
        }
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('There was an error processing your payment. Please try again.')
    } finally {
      setIsCheckingOut(false)
    }
  }

  const loadProductionCosts = async () => {
    try {
      console.log('🔍 [MOBILE] Loading production costs from /printify-production-costs-detailed.json...')
      const response = await fetch('/printify-production-costs-detailed.json')
      console.log('📡 [MOBILE] Fetch response status:', response.status, response.statusText)
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ [MOBILE] Production data loaded successfully, products count:', data.products?.length || 0)
        
        // Validate data structure
        if (!data.products || !Array.isArray(data.products)) {
          console.error('❌ [MOBILE] Invalid production data structure:', data)
          return []
        }
        
        // Log first product for debugging
        if (data.products.length > 0) {
          console.log('📋 [MOBILE] First product sample:', data.products[0])
        }
        
        return data.products
      } else {
        console.error('❌ [MOBILE] Failed to load production data:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('❌ [MOBILE] Error loading production costs:', error)
    }
    return []
  }

  const calculateActualCosts = async () => {
    console.log('🧮 [MOBILE] Starting actual costs calculation...')
    setIsLoadingCosts(true)
    
    const productionData = await loadProductionCosts()
    console.log('📊 [MOBILE] Production data loaded, analyzing cart items...')
    
    const actualCostsData: { [itemId: string]: { productionCost: number; shippingCost: number; taxCost: number; totalCost: number } } = {}

    cart.forEach((item, index) => {
      console.log(`\n🛍️ [MOBILE] Processing cart item ${index + 1}:`, item?.name || 'UNDEFINED NAME')
      
      // Safety check for item name
      if (!item || !item.name || typeof item.name !== 'string') {
        console.error('❌ [MOBILE] Invalid item or item name:', item)
        return
      }
      
      // Find matching product in production data by looking for key words in product name
      const itemWords: string[] = item.name.toLowerCase().split(' ').filter((word: string) => word && word.length > 0)
      console.log('🔤 [MOBILE] Item words to match:', itemWords)
      
      const matchingProduct = productionData.find((p: any) => {
        if (!p || !p.productTitle || typeof p.productTitle !== 'string') return false
        
        const productWords = p.productTitle.toLowerCase().split(' ').filter((word: string) => word && word.length > 0)
        // Check if at least 2 words match
        const matchingWords = itemWords.filter((word: string) => 
          word && typeof word === 'string' && word.length > 2 && 
          productWords.some((pWord: string) => 
            pWord && typeof pWord === 'string' && (pWord.includes(word) || word.includes(pWord))
          )
        )
        
        if (matchingWords.length >= 2) {
          console.log(`✅ [MOBILE] Found matching product: "${p.productTitle}" (${matchingWords.length} words matched:`, matchingWords, ')')
          return true
        }
        return false
      })

      if (matchingProduct && matchingProduct.variants) {
        console.log(`📦 [MOBILE] Found ${matchingProduct.variants.length} variants for product`)
        
        // Find best matching variant (prefer the size if available, otherwise use first available)
        let variant = matchingProduct.variants.find((v: any) => 
          v && v.isAvailable && item.size && 
          v.variantTitle && typeof v.variantTitle === 'string' &&
          v.variantTitle.toLowerCase().includes(item.size.toLowerCase())
        )
        
        if (!variant) {
          variant = matchingProduct.variants.find((v: any) => v && v.isAvailable) || matchingProduct.variants[0]
        }
        
        if (variant && typeof variant === 'object') {
          console.log('🎯 [MOBILE] Using variant:', variant.variantTitle || 'UNKNOWN VARIANT')
          console.log('🔍 [MOBILE] Full variant object:', variant)
          console.log('💰 [MOBILE] Raw costs - Production:', variant.productionCost || 0, 'cents, Shipping (camelCase):', variant.shippingCost || 0, 'cents, Shipping (snake_case):', variant.shipping_cost || 0, 'cents')
          
          const productionCost = (variant.productionCost || 0) / 100 // Convert from cents
          let shippingCost = (variant.shippingCost || variant.shipping_cost || 0) / 100 // Convert from cents, try both field names
          
          // Fallback: If Printify doesn't provide shipping costs, use per-item estimate
          if (shippingCost === 0) {
            // Calculate total shipping and distribute per item
            const totalItems = cart.reduce((total, cartItem) => total + cartItem.quantity, 0)
            const totalShipping = 5.44 + ((totalItems - 1) * 2.77) // First item $5.44, additional $2.77 each
            shippingCost = totalShipping / totalItems // Distribute evenly per item
            console.log(`🚚 [MOBILE] Using fallback shipping: $${totalShipping.toFixed(2)} total ÷ ${totalItems} items = $${shippingCost.toFixed(2)} per item`)
          }
          
          const taxCost = productionCost * 0.06 // 6% tax on production cost only
          const totalCost = productionCost + shippingCost + taxCost
          
          console.log('🚢 [MOBILE] Shipping cost check:')
          console.log('  - variant.shippingCost:', variant.shippingCost)
          console.log('  - variant.shipping_cost:', variant.shipping_cost)
          console.log('  - Final calculated shipping:', shippingCost)

          console.log('💵 [MOBILE] Calculated costs per unit:')
          console.log('  - Production:', `$${productionCost.toFixed(2)}`)
          console.log('  - Shipping:', `$${shippingCost.toFixed(2)}`)
          console.log('  - Tax (6%):', `$${taxCost.toFixed(2)}`)
          console.log('  - Total per unit:', `$${totalCost.toFixed(2)}`)
          console.log('  - Quantity:', item.quantity)
          console.log('  - Total for this item:', `$${(totalCost * item.quantity).toFixed(2)}`)

          actualCostsData[item.id] = {
            productionCost: productionCost * item.quantity,
            shippingCost: shippingCost * item.quantity,
            taxCost: taxCost * item.quantity,
            totalCost: totalCost * item.quantity
          }
        } else {
          console.warn('⚠️ [MOBILE] No suitable variant found for', item.name)
        }
      } else {
        console.warn('⚠️ [MOBILE] No matching product found for', item.name)
        console.log('📋 [MOBILE] Available products (first 5):')
        productionData.slice(0, 5).forEach((p: any, i: number) => {
          console.log(`  ${i + 1}. ${p.productTitle}`)
        })
      }
    })

    console.log('\n📊 [MOBILE] Final actual costs data:', actualCostsData)
    console.log('🎯 [MOBILE] Total items with actual costs:', Object.keys(actualCostsData).length)

    setActualCosts(actualCostsData)
    setIsLoadingCosts(false)
    return actualCostsData
  }

  const validateCoupon = async () => {
    console.log('🎫 [MOBILE] Validating coupon:', couponCode)
    
    if (!couponCode.trim()) {
      console.log('❌ [MOBILE] Empty coupon code')
      return
    }
    
    setCouponError('')
    
    try {
      let processedCode = couponCode.trim()
      console.log('🔄 [MOBILE] Processing coupon code:', processedCode)
      
      // Handle the special Lindbergh@lake737 format
      if (processedCode.toLowerCase() === 'lindbergh@lake737') {
        console.log('🎯 [MOBILE] Lindbergh coupon detected! Starting cost calculation...')
        processedCode = 'LINDBERGH-LAKE737'
        
        // Calculate actual costs for Lindbergh coupon
        console.log('💰 [MOBILE] Calling calculateActualCosts...')
        await calculateActualCosts()
        console.log('✅ [MOBILE] Actual costs calculation completed')
      } else {
        console.log('🔤 [MOBILE] Regular coupon, converting to uppercase:', processedCode.toUpperCase())
        processedCode = processedCode.toUpperCase()
        // Clear actual costs for other coupons
        setActualCosts(null)
      }
      
      // Store the original user input for display
      console.log('💾 [MOBILE] Setting applied coupon:', couponCode.trim())
      setAppliedCoupon(couponCode.trim())
      setCouponCode('')
      console.log('✅ [MOBILE] Coupon validation completed successfully')
    } catch (error) {
      console.error('❌ [MOBILE] Error during coupon validation:', error)
      setCouponError('Invalid coupon code')
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponError('')
    setActualCosts(null)
  }

  // Calculate effective cart total based on coupon
  const getEffectiveCartTotal = () => {
    if (appliedCoupon?.toLowerCase() === 'lindbergh@lake737' && actualCosts) {
      // Use actual production costs + tax (shipping calculated separately)
      return Object.values(actualCosts).reduce((sum, cost) => sum + cost.productionCost + cost.taxCost, 0).toFixed(2)
    }
    return getCartTotal()
  }

  // Calculate effective shipping based on coupon
  const getEffectiveShipping = () => {
    if (appliedCoupon?.toLowerCase() === 'lindbergh@lake737' && actualCosts) {
      // Return actual shipping costs for Lindbergh coupon
      return Object.values(actualCosts).reduce((sum, cost) => sum + cost.shippingCost, 0)
    }
    
    // Free shipping coupon
    if (appliedCoupon?.toLowerCase() === 'freeship' || appliedCoupon?.toLowerCase() === 'shipfree') {
      return 0
    }
    
    return calculateShipping()
  }

  // Check if cart contains only apparel and accessories for free shipping
  const hasOnlyApparelAndAccessories = () => {
    return cart.every(item => {
      const itemName = item.name.toLowerCase()
      const itemId = item.id.toLowerCase()
      
      // Check if it's apparel (contains shirt, tee, hoodie, tank, polo, etc.)
      const isApparel = itemName.includes('shirt') || itemName.includes('tee') || 
                       itemName.includes('hoodie') || itemName.includes('tank') || 
                       itemName.includes('polo') || itemName.includes('swimsuit') ||
                       itemName.includes('shorts') || itemName.includes('wetsuit') ||
                       itemId.includes('apparel') || itemId.includes('shirt') ||
                       itemId.includes('tee') || itemId.includes('hoodie')
      
      // Check if it's accessories (hats, beanies, etc.)
      const isAccessory = itemName.includes('hat') || itemName.includes('beanie') ||
                         itemName.includes('cap') || itemId.includes('accessories') ||
                         itemId.includes('hat') || itemId.includes('beanie')
      
      return isApparel || isAccessory
    })
  }

  const calculateShipping = () => {
    if (cart.length === 0) return 0
    
    // Free shipping for orders over $50
    const subtotal = parseFloat(getCartTotal())
    if (subtotal >= 50) return 0
    
    if (hasOnlyApparelAndAccessories()) {
      const totalItems = cart.reduce((total, item) => total + item.quantity, 0)
      if (totalItems === 0) return 0
      
      // First item is $5.44, each additional item is $2.77
      const firstItemCost = 5.44
      const additionalItemCost = 2.77
      const additionalItems = Math.max(0, totalItems - 1)
      
      return firstItemCost + (additionalItems * additionalItemCost)
    }
    
    return 4.75 // Standard shipping rate for gear
  }

  const getOriginalShipping = () => {
    if (cart.length === 0) return 0
    
    if (hasOnlyApparelAndAccessories()) {
      const totalItems = cart.reduce((total, item) => total + item.quantity, 0)
      if (totalItems === 0) return 0
      
      // First item is $5.44, each additional item is $2.77
      const firstItemCost = 5.44
      const additionalItemCost = 2.77
      const additionalItems = Math.max(0, totalItems - 1)
      
      return firstItemCost + (additionalItems * additionalItemCost)
    }
    
    return 4.75 // Standard shipping rate for gear
  }

  const itemCount = getCartItemCount()

  if (!isCartOpen && !isAnimating) return null

  return (
    <div className="md:hidden">
      {/* Full Screen Cart Overlay */}
      <div
        className={`fixed inset-0 bg-gray-900 z-[70] transform transition-transform duration-300 ${
          isAnimating ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-6 w-6 text-cyan-400" />
              <h2 className="text-xl font-bold text-white">Cart ({itemCount})</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-gray-400 hover:text-white hover:bg-gray-800 touch-manipulation"
              aria-label="Close cart"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingCart className="h-20 w-20 text-gray-600 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-white mb-2">Your cart is empty</h3>
                <p className="text-gray-400 mb-8">Add some water-worthy gear to get started!</p>
                <Button
                  onClick={handleClose}
                  className="bg-cyan-400 hover:bg-cyan-500 text-black font-semibold px-8 py-3 touch-manipulation"
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-cyan-400/50 transition-colors"
                  >
                    <div className="flex gap-4">
                      <div className="relative w-20 h-20 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white mb-1 truncate">{item.name}</h3>
                        {item.size && (
                          <p className="text-sm text-gray-400 mb-3">Size: {item.size}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-10 w-10 text-gray-400 hover:text-white hover:bg-gray-700 touch-manipulation"
                              onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="text-white font-medium w-12 text-center text-lg">{item.quantity}</span>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-10 w-10 text-gray-400 hover:text-white hover:bg-gray-700 touch-manipulation"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="text-cyan-400 font-bold text-lg">{item.price}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-sm text-gray-500 hover:text-red-400 transition-colors mt-2 touch-manipulation"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer with Checkout */}
          {cart.length > 0 && (
            <div className="border-t border-gray-800 bg-gray-900/95 backdrop-blur-sm p-4 space-y-4">
              {/* Coupon Code Section */}
              <div className="space-y-2">
                {!appliedCoupon ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && validateCoupon()}
                      className="flex-1 px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none touch-manipulation"
                    />
                    <Button
                      onClick={validateCoupon}
                      disabled={!couponCode.trim()}
                      variant="outline"
                      className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black disabled:opacity-50 px-4 py-3 touch-manipulation"
                    >
                      Apply
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-green-400 font-medium">Coupon: {appliedCoupon}</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-gray-400 hover:text-white touch-manipulation"
                    >
                      Remove
                    </button>
                  </div>
                )}
                
                {couponError && (
                  <p className="text-red-400 text-xs">{couponError}</p>
                )}
              </div>

              {/* Free Shipping Notice */}
              <div className="text-center">
                <p className="text-cyan-400 text-sm font-bold">
                  Free shipping on orders $50+ for all apparel & accessories
                </p>
              </div>

              <div className="space-y-3">
                {/* Show actual costs breakdown for Lindbergh coupon */}
                {appliedCoupon?.toLowerCase() === 'lindbergh@lake737' && actualCosts ? (
                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 space-y-2">
                    <div className="text-center text-blue-400 font-medium mb-2">
                      🔵 Lindbergh Actual Cost Breakdown
                    </div>
                    
                    {/* Production Costs */}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Production Cost</span>
                      <span className="text-white font-medium">
                        ${Object.values(actualCosts).reduce((sum, cost) => sum + cost.productionCost, 0).toFixed(2)}
                      </span>
                    </div>
                    
                    {/* Shipping Costs */}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Shipping Cost</span>
                      <span className="text-white font-medium">
                        ${Object.values(actualCosts).reduce((sum, cost) => sum + cost.shippingCost, 0).toFixed(2)}
                      </span>
                    </div>
                    
                    {/* Tax (6% on production cost) */}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Tax (6% on production)</span>
                      <span className="text-white font-medium">
                        ${Object.values(actualCosts).reduce((sum, cost) => sum + cost.taxCost, 0).toFixed(2)}
                      </span>
                    </div>
                    
                    {isLoadingCosts && (
                      <div className="text-center text-blue-400 text-sm">
                        Loading actual costs...
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-medium">Subtotal</span>
                      <span className="text-white font-bold">${getEffectiveCartTotal()}</span>
                    </div>
                    
                    {/* Shipping Calculation */}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-medium">Shipping</span>
                      <div className="text-right">
                        {(parseFloat(getEffectiveCartTotal()) >= 50 && appliedCoupon?.toLowerCase() !== 'lindbergh@lake737') || 
                         appliedCoupon?.toLowerCase() === 'freeship' || 
                         appliedCoupon?.toLowerCase() === 'shipfree' ? (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 line-through text-sm">${getOriginalShipping().toFixed(2)}</span>
                            <span className="text-green-400 font-bold">FREE</span>
                          </div>
                        ) : (
                          <span className="text-white font-bold">${getEffectiveShipping().toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  </>
                )}
                
                {/* Total - Always show this */}
                <div className="flex justify-between items-center text-xl border-t border-gray-700 pt-3">
                  <span className={`font-bold ${appliedCoupon?.toLowerCase() === 'lindbergh@lake737' ? 'text-blue-400' : 'text-gray-400'}`}>
                    Total
                  </span>
                  <span className={`font-bold ${appliedCoupon?.toLowerCase() === 'lindbergh@lake737' ? 'text-blue-400' : 'text-white'}`}>
                    ${(parseFloat(getEffectiveCartTotal()) + getEffectiveShipping()).toFixed(2)}
                  </span>
                </div>
              </div>
              <Button 
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full bg-cyan-400 hover:bg-cyan-500 text-black font-bold py-4 text-lg shadow-lg shadow-cyan-400/20 transition-all hover:shadow-cyan-400/30 touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCheckingOut ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                    Processing...
                  </div>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    CHECKOUT
                  </>
                )}
              </Button>
              <p className="text-xs text-gray-500 text-center">
                Shipping and taxes calculated at checkout
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Customer Info Form */}
      <CustomerInfoForm 
        isOpen={showCustomerForm}
        onClose={() => setShowCustomerForm(false)}
        onSubmit={handleCustomerSubmit}
        isProcessing={savingCustomer}
      />
    </div>
  )
} 