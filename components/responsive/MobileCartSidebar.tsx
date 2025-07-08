'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/contexts/CartContext'
import { useMobile } from '@/hooks/useMobile'
import { Button } from '@/components/ui/button'
import { X, ShoppingCart, Minus, Plus, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function MobileCartSidebar() {
  const { isMobile } = useMobile()
  const router = useRouter()
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeItem,
    getCartTotal,
    getCartItemCount,
    isLoading,
  } = useCart()

  const [isAnimating, setIsAnimating] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [couponError, setCouponError] = useState('')
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  // Handle opening/closing animations
  useEffect(() => {
    if (isCartOpen) {
      setIsAnimating(true)
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isCartOpen])

  const handleClose = () => {
    setIsCartOpen(false)
  }

  const handleCheckout = async () => {
    if (isCheckingOut) return
    setIsCheckingOut(true)

    try {
      // Store cart data for success page
      const orderTotal = parseFloat(getEffectiveTotal())
      localStorage.setItem('checkout-cart-data', JSON.stringify(cart))
      localStorage.setItem('checkout-order-total', orderTotal.toString())

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart,
          couponCode: appliedCoupon || undefined,
          effectiveTotal: orderTotal,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create checkout session')
      }

      const { sessionId } = await response.json()
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

  const validateCoupon = async () => {
    setCouponError('')
    
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code')
      return
    }

    // Simple coupon validation - you can expand this
    const validCoupons = ['WELCOME10', 'SAVE20', 'FIRSTORDER']
    
    if (validCoupons.includes(couponCode.toUpperCase())) {
      setAppliedCoupon(couponCode.toUpperCase())
      setCouponCode('')
    } else {
      setCouponError('Invalid coupon code')
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponError('')
  }

  const hasOnlyApparelAndAccessories = () => {
    return cart.every(item => 
      item.name.toLowerCase().includes('tee') ||
      item.name.toLowerCase().includes('shirt') ||
      item.name.toLowerCase().includes('hoodie') ||
      item.name.toLowerCase().includes('hat') ||
      item.name.toLowerCase().includes('beanie') ||
      item.name.toLowerCase().includes('accessory')
    )
  }

  const calculateShipping = () => {
    const subtotal = parseFloat(getCartTotal().replace('$', ''))
    
    // Free shipping on $50+ for apparel & accessories
    if (hasOnlyApparelAndAccessories() && subtotal >= 50) {
      return 0
    }
    
    // Standard shipping rates
    return 4.75
  }

  const getEffectiveTotal = () => {
    const subtotal = parseFloat(getCartTotal().replace('$', ''))
    const shipping = calculateShipping()
    let discount = 0

    if (appliedCoupon === 'WELCOME10') {
      discount = subtotal * 0.1
    } else if (appliedCoupon === 'SAVE20') {
      discount = subtotal * 0.2
    } else if (appliedCoupon === 'FIRSTORDER') {
      discount = Math.min(subtotal * 0.15, 25) // 15% off up to $25
    }

    return (subtotal + shipping - discount).toFixed(2)
  }

  // Don't render on desktop or when not needed
  if (!isMobile || (!isCartOpen && !isAnimating)) return null

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div
          className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] transition-opacity duration-300 ${
            isAnimating ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={handleClose}
        />
      )}

      {/* Mobile Cart Sidebar - Full Screen */}
      <div
        className={`fixed inset-0 bg-gray-950 transform transition-transform duration-300 ease-in-out z-[10000] ${
          isCartOpen && isAnimating ? 'translate-x-0' : 'translate-x-full'
        }`}
      >


        {/* Cart Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-950">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white -ml-2"
              onClick={handleClose}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h2 className="text-xl font-semibold text-white">Cart</h2>
            {getCartItemCount() > 0 && (
              <span className="bg-cyan-400 text-black text-sm font-bold px-2 py-1 rounded-full">
                {getCartItemCount()}
              </span>
            )}
          </div>
        </div>

        {/* Cart Content */}
        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 pb-32">
            {cart.length === 0 ? (
              <div className="text-center py-20">
                <ShoppingCart className="h-20 w-20 text-gray-600 mx-auto mb-6" />
                <p className="text-gray-400 text-xl mb-2">Your cart is empty</p>
                <p className="text-gray-500 text-sm mb-8">
                  Add some water-worthy gear to get started!
                </p>
                <Button
                  onClick={() => {
                    handleClose()
                    router.push('/gear')
                  }}
                  className="bg-cyan-400 hover:bg-cyan-500 text-black font-bold px-8 py-3 rounded-full"
                >
                  Shop Now
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map(item => (
                  <div
                    key={item.id}
                    className="bg-gray-900 rounded-xl p-4 border border-gray-800"
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
                        <h3 className="font-semibold text-white mb-1 text-sm leading-tight">
                          {item.name}
                        </h3>
                        {item.size && (
                          <p className="text-xs text-gray-400 mb-2">Size: {item.size}</p>
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
                            <span className="text-white font-medium w-8 text-center text-sm">
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
                            <p className="text-cyan-400 font-semibold text-sm">{item.price}</p>
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

          {/* Footer - Fixed at bottom */}
          {cart.length > 0 && (
            <div className="fixed bottom-0 left-0 right-0 bg-gray-950 border-t border-gray-800 p-4 space-y-4">
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
              {hasOnlyApparelAndAccessories() && (
                <div className="text-center">
                  <p className="text-cyan-400 text-sm font-bold">
                    Free shipping on orders $50+ for apparel & accessories
                  </p>
                </div>
              )}

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white font-medium">{getCartTotal()}</span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Shipping</span>
                  <span className="text-white font-medium">
                    {calculateShipping() === 0 ? 'Free' : `$${calculateShipping().toFixed(2)}`}
                  </span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Discount ({appliedCoupon})</span>
                    <span className="text-green-400 font-medium">
                      -${(parseFloat(getCartTotal().replace('$', '')) + calculateShipping() - parseFloat(getEffectiveTotal())).toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="border-t border-gray-700 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">Total</span>
                    <span className="text-cyan-400 font-bold text-lg">${getEffectiveTotal()}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full bg-cyan-400 hover:bg-cyan-500 text-black font-bold py-4 rounded-full text-lg shadow-lg shadow-cyan-400/20 transition-all hover:shadow-cyan-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCheckingOut ? 'Processing...' : `Checkout • $${getEffectiveTotal()}`}
              </Button>

              {/* Home indicator */}
              <div className="flex justify-center pt-2">
                <div className="w-32 h-1 bg-gray-800 rounded-full" />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
} 