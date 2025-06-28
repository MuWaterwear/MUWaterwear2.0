"use client"

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Package, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (sessionId) {
      // Simple loading state - no need to fetch detailed session info
      setLoading(false)
    }
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Processing your order...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 rounded-2xl p-8 text-center border border-slate-800">
        {/* Success Icon */}
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-green-400/20 rounded-full animate-ping"></div>
        </div>

        {/* Success Message */}
        <h1 className="text-2xl font-bold text-white mb-2">
          Order Confirmed!
        </h1>
        <p className="text-gray-400 mb-6">
          Thank you for your purchase. Your MU Waterwear gear is on its way!
        </p>

        {/* Order Info */}
        <div className="bg-slate-800 rounded-lg p-4 mb-6 border border-slate-700">
          <div className="flex items-center justify-center gap-2 text-cyan-400 mb-2">
            <Package className="w-5 h-5" />
            <span className="font-medium">Order Details</span>
          </div>
          {sessionId && (
            <p className="text-sm text-gray-400">
              Order ID: {sessionId.slice(-8).toUpperCase()}
            </p>
          )}
          <p className="text-sm text-gray-400">
            You'll receive a confirmation email shortly with tracking information.
          </p>
        </div>

        {/* Built for Water Message */}
        <div className="mb-6">
          <p className="text-cyan-400 font-medium mb-1">Built for water. Forged for legends.</p>
          <p className="text-sm text-gray-500">
            Your premium waterwear is being prepared with care.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button asChild className="w-full bg-cyan-400 hover:bg-cyan-500 text-black font-bold">
            <Link href="/">
              <ArrowRight className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full border-slate-700 text-gray-300 hover:bg-slate-800">
            <Link href="/about">
              Learn More About MU Waterwear
            </Link>
          </Button>
        </div>

        {/* Contact Info */}
        <div className="mt-8 pt-6 border-t border-slate-700">
          <p className="text-xs text-gray-500">
            Questions about your order? Contact us at{' '}
            <a href="mailto:info@muwaterwear.com" className="text-cyan-400 hover:text-cyan-300">
              info@muwaterwear.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
} 