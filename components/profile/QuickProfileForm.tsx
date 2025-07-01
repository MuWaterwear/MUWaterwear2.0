import React, { useState } from 'react'
import { Button } from '@/components/ui/button'

export interface CachedUser {
  firstName: string
  lastName: string
  email: string
  phone?: string
  favoriteBodyOfWater?: string
  isGuest: boolean
  lastUsed: string
  shippingAddresses?: any[]
  orderHistory?: any[]
}

interface QuickProfileFormProps {
  initialData?: Partial<CachedUser>
  onSave: (userData: Omit<CachedUser, 'lastUsed'>) => void
  onClose: () => void
}

export function QuickProfileForm({ initialData, onSave, onClose }: QuickProfileFormProps) {
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    favoriteBodyOfWater: (initialData as any)?.favoriteBodyOfWater || '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSave({
        ...formData,
        isGuest: true,
      })
    }
  }

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
  }

  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-gray-900 rounded-xl border border-gray-800 shadow-2xl z-50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">
            {initialData ? 'Edit Profile' : 'Quick Profile Setup'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Favorite body of water (e.g., Lake Tahoe, Pacific Ocean)"
              value={formData.favoriteBodyOfWater}
              onChange={e => updateField('favoriteBodyOfWater', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="text"
                placeholder="First name"
                value={formData.firstName}
                onChange={e => updateField('firstName', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none text-sm"
              />
              {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <input
                type="text"
                placeholder="Last name"
                value={formData.lastName}
                onChange={e => updateField('lastName', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none text-sm"
              />
              {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <input
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={e => updateField('email', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none text-sm"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <input
              type="tel"
              placeholder="Phone (optional)"
              value={formData.phone}
              onChange={e => updateField('phone', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none text-sm"
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              className="flex-1 bg-cyan-400 hover:bg-cyan-500 text-black font-medium py-2 text-sm"
            >
              Save Profile
            </Button>
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="px-4 py-2 text-sm border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
          </div>
        </form>

        <p className="text-xs text-gray-500 mt-3 text-center">
          Your info is saved locally for faster checkout
        </p>
      </div>
    </div>
  )
}
