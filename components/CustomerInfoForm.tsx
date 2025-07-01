'use client'

import React, { useState } from 'react'
import { X, User, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CustomerInfoFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (customerData: { firstName: string; lastName: string; email: string }) => void
  isProcessing?: boolean
}

export default function CustomerInfoForm({
  isOpen,
  onClose,
  onSubmit,
  isProcessing = false,
}: CustomerInfoFormProps) {
  const [customerData, setCustomerData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!customerData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }
    if (!customerData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }
    if (!customerData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(customerData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(customerData)
    }
  }

  const updateField = (field: keyof typeof customerData, value: string) => {
    setCustomerData({ ...customerData, [field]: value })
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Customer Information</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-gray-800"
            disabled={isProcessing}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-cyan-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-6 h-6 text-cyan-400" />
            </div>
            <p className="text-gray-400">
              Please provide your information to continue with checkout
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">First Name *</label>
                <input
                  type="text"
                  required
                  value={customerData.firstName}
                  onChange={e => updateField('firstName', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  placeholder="John"
                  disabled={isProcessing}
                />
                {errors.firstName && (
                  <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Last Name *</label>
                <input
                  type="text"
                  required
                  value={customerData.lastName}
                  onChange={e => updateField('lastName', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  placeholder="Doe"
                  disabled={isProcessing}
                />
                {errors.lastName && <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={customerData.email}
                onChange={e => updateField('email', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                placeholder="john@example.com"
                disabled={isProcessing}
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-cyan-400 hover:bg-cyan-500 text-black font-bold py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                    Saving...
                  </div>
                ) : (
                  <>
                    Continue to Checkout
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Your information will be saved securely and used for order updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
