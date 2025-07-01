'use client'
import { Package } from 'lucide-react'
interface OrderSummaryProps {
  orderId?: string | null
  amount?: number
  items?: Array<{ name: string; price: string; quantity: number; size?: string }>
}
export default function OrderSummary({ orderId, amount, items }: OrderSummaryProps) {
  return (
    <div className="bg-slate-800 rounded-lg p-4 mb-6 border border-slate-700">
      <div className="flex items-center justify-center gap-2 text-cyan-400 mb-2">
        <Package className="w-5 h-5" />
        <span className="font-medium">Order Details</span>
      </div>
      {orderId && <p className="text-sm text-gray-400 mb-2">Order ID: {orderId}</p>}
      {amount && <p className="text-sm text-gray-400 mb-2">Total: ${amount.toFixed(2)}</p>}
      {items && items.length > 0 && (
        <div className="mb-2">
          <p className="text-xs text-gray-500">Items ({items.length}):</p>
          {items.slice(0, 3).map((item, index) => (
            <p key={`${item.name}-${index}`} className="text-xs text-gray-400">
              • {item.name} {item.size && `(${item.size})`} × {item.quantity}
            </p>
          ))}
          {items.length > 3 && (
            <p className="text-xs text-gray-500">+{items.length - 3} more items</p>
          )}
        </div>
      )}
      <p className="text-sm text-gray-400">
        You'll receive a confirmation email shortly with tracking information.
      </p>
      {orderId && (
        <p className="text-xs text-cyan-400 mt-2">
          ✅ Order saved to your profile for future reference
        </p>
      )}
    </div>
  )
} 