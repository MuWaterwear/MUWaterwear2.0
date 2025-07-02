"use client"

import React, { useEffect, useState } from 'react'
import SuccessIcon from './SuccessIcon'
import OrderSummary from './OrderSummary'
import SuccessActions from './SuccessActions'
import ContactInfo from './ContactInfo'
import SuccessLoading from './SuccessLoading'

export default function SuccessPage() {
  const [cartData, setCartData] = useState<any[]>([])
  const [orderTotal, setOrderTotal] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Retrieve cart and total stored before redirecting to Stripe
    try {
      const storedCart = localStorage.getItem('checkout-cart-data')
      const storedTotal = localStorage.getItem('checkout-order-total')
      if (storedCart) {
        setCartData(JSON.parse(storedCart))
      }
      if (storedTotal) {
        setOrderTotal(parseFloat(storedTotal))
      }
    } catch (error) {
      console.error('Error loading checkout data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  if (isLoading) {
    return <SuccessLoading />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white px-4 py-16">
      <div className="max-w-md w-full text-center">
        <SuccessIcon />
        <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-gray-400 mb-6">
          Thank you for your purchase. We emailed your receipt and order confirmation.
        </p>
        <OrderSummary amount={orderTotal || undefined} items={cartData} />
        <SuccessActions />
        <ContactInfo />
      </div>
    </div>
  )
}
