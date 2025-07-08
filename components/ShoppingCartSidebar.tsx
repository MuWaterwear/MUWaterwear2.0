'use client'

import { useState, useEffect } from 'react'
import { X, Minus, Plus, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useCart } from '@/contexts/CartContext'
import { useMobile } from '@/hooks/useMobile'
import { loadStripe } from '@stripe/stripe-js'
import { useSession } from 'next-auth/react'

// Initialize Stripe
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null

export default function ShoppingCartSidebar() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeItem,
    getCartTotal,
    getCartItemCount,
    clearCart,
  } = useCart()

  const { isMobile } = useMobile()
  const { data: session } = useSession()
  const [isAnimating, setIsAnimating] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [showCustomerForm, setShowCustomerForm] = useState(false)
  const [savingCustomer, setSavingCustomer] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [couponError, setCouponError] = useState('')
  const [actualCosts, setActualCosts] = useState<{
    [itemId: string]: {
      productionCost: number
      shippingCost: number
      taxCost: number
      totalCost: number
    }
  } | null>(null)
  const [isLoadingCosts, setIsLoadingCosts] = useState(false)

  useEffect(() => {
    if (isCartOpen) {
      setIsAnimating(true)
    }
  }, [isCartOpen])

  const handleClose = () => {
    setIsAnimating(false)
    setTimeout(() => setIsCartOpen(false), 300)
  }

  const handleCheckout = () => {
    if (cart.length === 0) return

    // Check for cached user data or authenticated session
    const cachedUser = localStorage.getItem('mu-user-profile')
    let userData = null

    if (session?.user) {
      // Use authenticated session data
      userData = {
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        email: session.user.email,
      }
    } else if (cachedUser) {
      // Use cached user data
      try {
        const cached = JSON.parse(cachedUser)
        userData = {
          firstName: cached.firstName,
          lastName: cached.lastName,
          email: cached.email,
        }
      } catch (error) {
        console.error('Error parsing cached user data:', error)
      }
    }

    if (userData) {
      proceedToStripeCheckout(userData)
    } else {
      // Proceed without customer info
      proceedToStripeCheckout()
    }
  }

  const [customerInfo, setCustomerInfo] = useState<{
    firstName: string
    lastName: string
    email: string
  } | null>(null)

  const handleCustomerSubmit = async (customerData: {
    firstName: string
    lastName: string
    email: string
  }) => {
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
          cartItems: cart,
        }),
      })

      if (!customerResponse.ok) {
        throw new Error('Failed to save customer information')
      }

      const customerResult = await customerResponse.json()
      console.log('Customer saved:', customerResult)

      // Cache user data locally for future use
      const cachedUserData = {
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        email: customerData.email,
        isGuest: true,
        lastUsed: new Date().toISOString(),
      }
      localStorage.setItem('mu-user-profile', JSON.stringify(cachedUserData))

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

  const proceedToStripeCheckout = async (customerData?: {
    firstName: string
    lastName: string
    email: string
  }) => {
    if (cart.length === 0) return

    setIsCheckingOut(true)
    setCouponError('')

    try {
      // Convert user-friendly coupon to Stripe format for API call
      let stripeCouponCode = appliedCoupon
      if (appliedCoupon?.toLowerCase() === 'lindbergh@lake737') {
        stripeCouponCode = 'LINDBERGH-LAKE737'
      }

      // Store cart data and total for success page
      const orderTotal = parseFloat(getEffectiveCartTotal()) + getEffectiveShipping()
      localStorage.setItem('checkout-cart-data', JSON.stringify(cart))
      localStorage.setItem('checkout-order-total', orderTotal.toString())

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart,
          couponCode: stripeCouponCode || undefined,
          // Pass actual costs for Lindbergh coupon
          actualCosts:
            appliedCoupon?.toLowerCase() === 'lindbergh@lake737' ? actualCosts : undefined,
          effectiveTotal: orderTotal,
          // Pass customer info for auto-fill
          customerInfo: customerData,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('🚨 Checkout session creation failed:', errorData)
        
        if (errorData.error && errorData.error.includes('coupon')) {
          setCouponError(errorData.error)
          setAppliedCoupon(null)
          return
        }
        
        // Provide specific error messages based on the response
        if (errorData.error && errorData.error.includes('Stripe configuration')) {
          alert('🚨 Payment system configuration error. Please contact support.')
          return
        }
        
        if (errorData.error && errorData.error.includes('Configuration error')) {
          alert('🚨 System configuration error. Please contact support.')
          return
        }
        
        throw new Error(errorData.error || 'Failed to create checkout session')
      }

      const { sessionId, appliedCoupon: confirmedCoupon } = await response.json()
      
      if (!sessionId) {
        console.error('🚨 No session ID received from checkout session creation')
        alert('🚨 Payment session could not be created. Please try again.')
        return
      }
      
      console.log('✅ Checkout session created successfully:', sessionId)
      
      if (!stripePromise) {
        console.error('🚨 Stripe not initialized - missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY')
        alert('🚨 Payment system not configured. Please contact support.')
        return
      }
      
      const stripe = await stripePromise

      if (stripe) {
        console.log('🚀 Redirecting to Stripe checkout...')
        const { error } = await stripe.redirectToCheckout({ sessionId })
        if (error) {
          console.error('🚨 Stripe checkout redirect error:', error)
          alert('🚨 Payment redirect failed: ' + error.message)
        }
      } else {
        console.error('🚨 Stripe instance not available')
        alert('🚨 Payment system not available. Please contact support.')
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
      console.log('🔍 Loading production costs from /printify-production-costs-detailed.json...')
      const response = await fetch('/printify-production-costs-detailed.json')
      console.log('📡 Fetch response status:', response.status, response.statusText)

      if (response.ok) {
        const data = await response.json()
        console.log(
          '✅ Production data loaded successfully, products count:',
          data.products?.length || 0
        )

        // Validate data structure
        if (!data.products || !Array.isArray(data.products)) {
          console.error('❌ Invalid production data structure:', data)
          return []
        }

        // Log first product for debugging
        if (data.products.length > 0) {
          console.log('📋 First product sample:', data.products[0])
        }

        return data.products
      } else {
        console.error('❌ Failed to load production data:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('❌ Error loading production costs:', error)
    }
    return []
  }

  const calculateActualCosts = async () => {
    console.log('🧮 Starting actual costs calculation...')
    setIsLoadingCosts(true)

    const productionData = await loadProductionCosts()
    console.log('📊 Production data loaded, analyzing cart items...')

    const actualCostsData: {
      [itemId: string]: {
        productionCost: number
        shippingCost: number
        taxCost: number
        totalCost: number
      }
    } = {}

    cart.forEach((item, index) => {
      console.log(`\n🛍️ Processing cart item ${index + 1}:`, item?.name || 'UNDEFINED NAME')

      // Safety check for item name
      if (!item || !item.name || typeof item.name !== 'string') {
        console.error('❌ Invalid item or item name:', item)
        return
      }

      // Find matching product in production data by looking for key words in product name
      const itemWords: string[] = item.name
        .toLowerCase()
        .split(' ')
        .filter((word: string) => word && word.length > 0)
      console.log('🔤 Item words to match:', itemWords)

      const matchingProduct = productionData.find((p: any) => {
        if (!p || !p.productTitle || typeof p.productTitle !== 'string') return false

        const productWords = p.productTitle
          .toLowerCase()
          .split(' ')
          .filter((word: string) => word && word.length > 0)
        // Check if at least 2 words match
        const matchingWords = itemWords.filter(
          (word: string) =>
            word &&
            typeof word === 'string' &&
            word.length > 2 &&
            productWords.some(
              (pWord: string) =>
                pWord && typeof pWord === 'string' && (pWord.includes(word) || word.includes(pWord))
            )
        )

        if (matchingWords.length >= 2) {
          console.log(
            `✅ Found matching product: "${p.productTitle}" (${matchingWords.length} words matched:`,
            matchingWords,
            ')'
          )
          return true
        }
        return false
      })

      if (matchingProduct && matchingProduct.variants) {
        console.log(`📦 Found ${matchingProduct.variants.length} variants for product`)

        // Find best matching variant (prefer the size if available, otherwise use first available)
        let variant = matchingProduct.variants.find(
          (v: any) =>
            v &&
            v.isAvailable &&
            item.size &&
            v.variantTitle &&
            typeof v.variantTitle === 'string' &&
            v.variantTitle.toLowerCase().includes(item.size.toLowerCase())
        )

        if (!variant) {
          variant =
            matchingProduct.variants.find((v: any) => v && v.isAvailable) ||
            matchingProduct.variants[0]
        }

        if (variant && typeof variant === 'object') {
          console.log('🎯 Using variant:', variant.variantTitle || 'UNKNOWN VARIANT')
          console.log('🔍 Full variant object:', variant)
          console.log(
            '💰 Raw costs - Production:',
            variant.productionCost || 0,
            'cents, Shipping (camelCase):',
            variant.shippingCost || 0,
            'cents, Shipping (snake_case):',
            variant.shipping_cost || 0,
            'cents'
          )

          const productionCost = (variant.productionCost || 0) / 100 // Convert from cents
          let shippingCost = (variant.shippingCost || variant.shipping_cost || 0) / 100 // Convert from cents, try both field names

          // Fallback: If Printify doesn't provide shipping costs, use per-item estimate
          if (shippingCost === 0) {
            // Calculate total shipping and distribute per item
            const totalItems = cart.reduce((total, cartItem) => total + cartItem.quantity, 0)
            const totalShipping = 5.44 + (totalItems - 1) * 2.77 // First item $5.44, additional $2.77 each
            shippingCost = totalShipping / totalItems // Distribute evenly per item
            console.log(
              `🚚 Using fallback shipping: $${totalShipping.toFixed(2)} total ÷ ${totalItems} items = $${shippingCost.toFixed(2)} per item`
            )
          }

          const taxCost = productionCost * 0.06 // 6% tax on production cost only
          const totalCost = productionCost + shippingCost + taxCost

          console.log('🚢 Shipping cost check:')
          console.log('  - variant.shippingCost:', variant.shippingCost)
          console.log('  - variant.shipping_cost:', variant.shipping_cost)
          console.log('  - Final calculated shipping:', shippingCost)

          console.log('💵 Calculated costs per unit:')
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
            totalCost: totalCost * item.quantity,
          }
        } else {
          console.warn('⚠️ No suitable variant found for', item.name)
        }
      } else {
        console.warn('⚠️ No matching product found for', item.name)
        console.log('📋 Available products (first 5):')
        productionData.slice(0, 5).forEach((p: any, i: number) => {
          console.log(`  ${i + 1}. ${p.productTitle}`)
        })
      }
    })

    console.log('\n📊 Final actual costs data:', actualCostsData)
    console.log('🎯 Total items with actual costs:', Object.keys(actualCostsData).length)

    setActualCosts(actualCostsData)
    setIsLoadingCosts(false)
    return actualCostsData
  }

  const validateCoupon = async () => {
    console.log('🎫 Validating coupon:', couponCode)

    if (!couponCode.trim()) {
      console.log('❌ Empty coupon code')
      return
    }

    setCouponError('')

    try {
      let processedCode = couponCode.trim()
      console.log('🔄 Processing coupon code:', processedCode)

      // Handle the special Lindbergh@lake737 format
      if (processedCode.toLowerCase() === 'lindbergh@lake737') {
        console.log('🎯 Lindbergh coupon detected! Starting cost calculation...')
        processedCode = 'LINDBERGH-LAKE737'

        // Calculate actual costs for Lindbergh coupon
        console.log('💰 Calling calculateActualCosts...')
        await calculateActualCosts()
        console.log('✅ Actual costs calculation completed')
      } else {
        console.log('🔤 Regular coupon, converting to uppercase:', processedCode.toUpperCase())
        processedCode = processedCode.toUpperCase()
        // Clear actual costs for other coupons
        setActualCosts(null)
      }

      // Store the original user input for display
      console.log('💾 Setting applied coupon:', couponCode.trim())
      setAppliedCoupon(couponCode.trim())
      setCouponCode('')
      console.log('✅ Coupon validation completed successfully')
    } catch (error) {
      console.error('❌ Error during coupon validation:', error)
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
      return Object.values(actualCosts)
        .reduce((sum, cost) => sum + cost.productionCost + cost.taxCost, 0)
        .toFixed(2)
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
    if (
      appliedCoupon?.toLowerCase() === 'freeship' ||
      appliedCoupon?.toLowerCase() === 'shipfree'
    ) {
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
      const isApparel =
        itemName.includes('shirt') ||
        itemName.includes('tee') ||
        itemName.includes('hoodie') ||
        itemName.includes('tank') ||
        itemName.includes('polo') ||
        itemName.includes('swimsuit') ||
        itemName.includes('shorts') ||
        itemName.includes('wetsuit') ||
        itemId.includes('apparel') ||
        itemId.includes('shirt') ||
        itemId.includes('tee') ||
        itemId.includes('hoodie')

      // Check if it's accessories (hats, beanies, etc.)
      const isAccessory =
        itemName.includes('hat') ||
        itemName.includes('beanie') ||
        itemName.includes('cap') ||
        itemId.includes('accessories') ||
        itemId.includes('hat') ||
        itemId.includes('beanie')

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

      return firstItemCost + additionalItems * additionalItemCost
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

      return firstItemCost + additionalItems * additionalItemCost
    }

    return 4.75 // Standard shipping rate for gear
  }

  const itemCount = getCartItemCount()

  if (!isCartOpen && !isAnimating) return null

  // On mobile, don't render this component (use MobileShoppingCart instead)
  if (isMobile) return null

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] transition-opacity duration-300 ${
            isAnimating ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={handleClose}
        />
      )}

      {/* Cart Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-full md:w-[480px] bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out z-[10000] ${
          isCartOpen && isAnimating ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Cart Content */}
        <div className="flex flex-col h-full">
          {/* Cart Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div className="flex items-center space-x-4">
              <ShoppingCart className="h-6 w-6 text-gray-400" />
              <h2 className="text-xl font-semibold text-white">Shopping Cart</h2>
              {getCartItemCount() > 0 && (
                <span className="bg-cyan-400 text-black text-sm font-bold px-2 py-1 rounded-full">
                  {getCartItemCount()}
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white"
              onClick={handleClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6 cart-scroll">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Your cart is empty</p>
                <p className="text-gray-500 text-sm mt-2">
                  Add some water-worthy gear to get started!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.map(item => (
                  <div
                    key={item.id}
                    className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-cyan-400/50 transition-colors"
                  >
                    <div className="flex gap-4">
                      <div className="relative w-24 h-24 bg-gray-700 rounded-lg overflow-hidden">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1">{item.name}</h3>
                        {item.size && (
                          <p className="text-sm text-gray-400 mb-2">Size: {item.size}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700"
                              onClick={() =>
                                updateQuantity(item.id, Math.max(0, item.quantity - 1))
                              }
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="text-white font-medium w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="text-cyan-400 font-semibold">{item.price}</p>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-xs text-gray-500 hover:text-red-400 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="border-t border-gray-800 p-6 space-y-4">
              {/* Coupon Code Section */}
              <div className="space-y-2">
                {!appliedCoupon ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && validateCoupon()}
                      className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none text-sm"
                    />
                    <Button
                      onClick={validateCoupon}
                      disabled={!couponCode.trim()}
                      variant="outline"
                      size="sm"
                      className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black disabled:opacity-50"
                    >
                      Apply
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-green-400 text-sm font-medium">
                        Coupon: {appliedCoupon}
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-gray-400 hover:text-white text-sm"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {couponError && <p className="text-red-400 text-xs">{couponError}</p>}
              </div>

              {/* Free Shipping Notice */}
              <div className="text-center">
                <p className="text-cyan-400 text-sm font-bold">
                  Free shipping on orders $50+ for all apparel & accessories
                </p>
              </div>

              <div className="space-y-2">
                {/* Show actual costs breakdown for Lindbergh coupon */}
                {appliedCoupon?.toLowerCase() === 'lindbergh@lake737' && actualCosts ? (
                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 space-y-2">
                    <div className="text-center text-blue-400 text-sm font-medium mb-2">
                      🔵 Lindbergh Actual Cost Breakdown
                    </div>

                    {/* Production Costs */}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Production Cost</span>
                      <span className="text-white font-medium">
                        $
                        {Object.values(actualCosts)
                          .reduce((sum, cost) => sum + cost.productionCost, 0)
                          .toFixed(2)}
                      </span>
                    </div>

                    {/* Shipping Costs */}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Shipping Cost</span>
                      <span className="text-white font-medium">
                        $
                        {Object.values(actualCosts)
                          .reduce((sum, cost) => sum + cost.shippingCost, 0)
                          .toFixed(2)}
                      </span>
                    </div>

                    {/* Tax (6% on production cost) */}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Tax (6% on production)</span>
                      <span className="text-white font-medium">
                        $
                        {Object.values(actualCosts)
                          .reduce((sum, cost) => sum + cost.taxCost, 0)
                          .toFixed(2)}
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
                      <span className="text-gray-400">Subtotal</span>
                      <span className="text-white font-bold">${getEffectiveCartTotal()}</span>
                    </div>

                    {/* Shipping Calculation */}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Shipping</span>
                      <div className="text-right">
                        {(parseFloat(getEffectiveCartTotal()) >= 50 &&
                          appliedCoupon?.toLowerCase() !== 'lindbergh@lake737') ||
                        appliedCoupon?.toLowerCase() === 'freeship' ||
                        appliedCoupon?.toLowerCase() === 'shipfree' ? (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 line-through text-sm">
                              ${getOriginalShipping().toFixed(2)}
                            </span>
                            <span className="text-green-400 font-medium">FREE</span>
                          </div>
                        ) : (
                          <span className="text-white">${getEffectiveShipping().toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Total - Always show this */}
                <div className="flex justify-between items-center text-lg border-t border-gray-700 pt-2">
                  <span
                    className={`font-bold ${appliedCoupon?.toLowerCase() === 'lindbergh@lake737' ? 'text-blue-400' : 'text-gray-400'}`}
                  >
                    Total
                  </span>
                  <span
                    className={`font-bold ${appliedCoupon?.toLowerCase() === 'lindbergh@lake737' ? 'text-blue-400' : 'text-white'}`}
                  >
                    ${(parseFloat(getEffectiveCartTotal()) + getEffectiveShipping()).toFixed(2)}
                  </span>
                </div>
              </div>
              <Button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full bg-cyan-400 hover:bg-cyan-500 text-black font-bold py-4 text-lg shadow-lg shadow-cyan-400/20 transition-all hover:shadow-cyan-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCheckingOut ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                    Processing...
                  </div>
                ) : (
                  'CHECKOUT'
                )}
              </Button>
              <p className="text-xs text-gray-500 text-center">
                Shipping and taxes calculated at checkout
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
