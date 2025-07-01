import React, { useState } from 'react'
import { Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface ShippingAddress {
  id: string
  name: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
  createdAt: string
}

interface ShippingAddressManagerProps {
  addresses: ShippingAddress[]
  onSave: (address: Omit<ShippingAddress, 'id' | 'createdAt'>) => void
  onUpdate: (addressId: string, updates: Partial<ShippingAddress>) => void
  onDelete: (addressId: string) => void
  onClose: () => void
}

export function ShippingAddressManager({
  addresses,
  onSave,
  onUpdate,
  onDelete,
  onClose,
}: ShippingAddressManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)

  return (
    <div className="absolute right-0 top-full mt-2 w-96 bg-gray-900 rounded-xl border border-gray-800 shadow-2xl z-50 max-h-96 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Shipping Addresses</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ×
          </button>
        </div>

        {/* Address List */}
        <div className="space-y-3 mb-4">
          {addresses.map(address => (
            <div key={address.id} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
              {editingId === address.id ? (
                <AddressForm
                  initialData={address}
                  onSave={updatedAddress => {
                    onUpdate(address.id, updatedAddress)
                    setEditingId(null)
                  }}
                  onCancel={() => setEditingId(null)}
                  isEditing={true}
                />
              ) : (
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-white font-medium">{address.name}</p>
                        {address.isDefault && (
                          <span className="bg-cyan-400 text-black text-xs px-2 py-1 rounded-full font-medium">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm">{address.street}</p>
                      <p className="text-gray-300 text-sm">
                        {address.city}, {address.state} {address.postalCode}
                      </p>
                      <p className="text-gray-400 text-xs">{address.country}</p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setEditingId(address.id)}
                        className="text-gray-400 hover:text-cyan-400 p-1"
                        title="Edit address"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(address.id)}
                        className="text-gray-400 hover:text-red-400 p-1"
                        title="Delete address"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  {!address.isDefault && (
                    <button
                      onClick={() => onUpdate(address.id, { isDefault: true })}
                      className="mt-2 text-xs text-cyan-400 hover:text-cyan-300"
                    >
                      Set as default
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add New Address */}
        {isAddingNew ? (
          <AddressForm
            onSave={newAddress => {
              onSave(newAddress)
              setIsAddingNew(false)
            }}
            onCancel={() => setIsAddingNew(false)}
            isEditing={false}
          />
        ) : (
          <Button
            onClick={() => setIsAddingNew(true)}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-600"
            variant="outline"
          >
            + Add New Address
          </Button>
        )}
      </div>
    </div>
  )
}

// Address Form Component
interface AddressFormProps {
  initialData?: Partial<ShippingAddress>
  onSave: (address: Omit<ShippingAddress, 'id' | 'createdAt'>) => void
  onCancel: () => void
  isEditing: boolean
}

function AddressForm({ initialData, onSave, onCancel, isEditing }: AddressFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    street: initialData?.street || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    postalCode: initialData?.postalCode || '',
    country: initialData?.country || 'US',
    isDefault: initialData?.isDefault || false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.street.trim()) newErrors.street = 'Street address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.state.trim()) newErrors.state = 'State is required'
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSave(formData)
    }
  }

  const updateField = (field: keyof typeof formData, value: string | boolean) => {
    setFormData({ ...formData, [field]: value })
    if (errors[field as string]) {
      setErrors({ ...errors, [field as string]: '' })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <input
          type="text"
          placeholder="Address name (e.g., Home, Work)"
          value={formData.name}
          onChange={e => updateField('name', e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none text-sm"
        />
        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
      </div>

      <div>
        <input
          type="text"
          placeholder="Street address"
          value={formData.street}
          onChange={e => updateField('street', e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none text-sm"
        />
        {errors.street && <p className="text-red-400 text-xs mt-1">{errors.street}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <input
            type="text"
            placeholder="City"
            value={formData.city}
            onChange={e => updateField('city', e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none text-sm"
          />
          {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
        </div>
        <div>
          <input
            type="text"
            placeholder="State"
            value={formData.state}
            onChange={e => updateField('state', e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none text-sm"
          />
          {errors.state && <p className="text-red-400 text-xs mt-1">{errors.state}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <input
            type="text"
            placeholder="Postal code"
            value={formData.postalCode}
            onChange={e => updateField('postalCode', e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none text-sm"
          />
          {errors.postalCode && <p className="text-red-400 text-xs mt-1">{errors.postalCode}</p>}
        </div>
        <div>
          <select
            value={formData.country}
            onChange={e => updateField('country', e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none text-sm"
          >
            <option value="US">United States</option>
            <option value="CA">Canada</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isDefault"
          checked={formData.isDefault}
          onChange={e => updateField('isDefault', e.target.checked)}
          className="rounded border-gray-600 text-cyan-400 focus:ring-cyan-400"
        />
        <label htmlFor="isDefault" className="text-sm text-gray-300">
          Set as default shipping address
        </label>
      </div>

      <div className="flex gap-2">
        <Button
          type="submit"
          className="flex-1 bg-cyan-400 hover:bg-cyan-500 text-black font-medium py-2 text-sm"
        >
          {isEditing ? 'Update Address' : 'Save Address'}
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          className="px-4 py-2 text-sm border-gray-600 text-gray-300 hover:bg-gray-800"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
