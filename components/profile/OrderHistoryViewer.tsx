import React from 'react'
import { Package } from 'lucide-react'

export interface OrderHistory {
  id: string
  orderId: string
  sessionId: string
  orderDate: string
  amount?: number
  status: string
  items?: Array<{
    name: string
    price: string
    quantity: number
    size?: string
    image?: string
  }>
  shippingAddress?: {
    name: string
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
}

interface OrderHistoryViewerProps {
  orders: OrderHistory[]
  onClose: () => void
}

export function OrderHistoryViewer({ orders, onClose }: OrderHistoryViewerProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'text-green-400'
      case 'processing':
      case 'shipped':
        return 'text-yellow-400'
      case 'cancelled':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <div className="absolute right-0 top-full mt-2 w-96 bg-gray-900 rounded-xl border border-gray-800 shadow-2xl z-50 max-h-96 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Order History</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ×
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No orders yet</p>
            <p className="text-gray-500 text-sm">Your order history will appear here</p>
          </div>
        ) : (
          <div className="space-y-2">
            {orders.map(order => (
              <div key={order.id || order.orderId || `${order.sessionId}-${order.orderDate}`} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                {/* Order Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Package className="w-3 h-3 text-cyan-400" />
                    <span className="text-white font-medium text-sm">#{order.orderId}</span>
                    <span className="text-gray-500 text-xs">{formatDate(order.orderDate)}</span>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(order.status)} ${
                      order.status.toLowerCase() === 'completed'
                        ? 'bg-green-400/20'
                        : order.status.toLowerCase() === 'processing'
                          ? 'bg-yellow-400/20'
                          : order.status.toLowerCase() === 'shipped'
                            ? 'bg-blue-400/20'
                            : order.status.toLowerCase() === 'cancelled'
                              ? 'bg-red-400/20'
                              : 'bg-gray-400/20'
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>

                {/* Condensed Items */}
                {order.items && order.items.length > 0 && (
                  <div className="mb-2">
                    <div className="text-xs text-gray-400">
                      {order.items.length === 1
                        ? // Single item - show full name
                          `${order.items[0].name}${order.items[0].size ? ` (${order.items[0].size})` : ''} × ${order.items[0].quantity}`
                        : order.items.length === 2
                          ? // Two items - show both
                            `${order.items[0].name}${order.items[0].size ? ` (${order.items[0].size})` : ''} × ${order.items[0].quantity}, ${order.items[1].name}${order.items[1].size ? ` (${order.items[1].size})` : ''} × ${order.items[1].quantity}`
                          : // Multiple items - show first item and count
                            `${order.items[0].name}${order.items[0].size ? ` (${order.items[0].size})` : ''} × ${order.items[0].quantity} + ${order.items.length - 1} more item${order.items.length - 1 !== 1 ? 's' : ''}`}
                    </div>
                  </div>
                )}

                {/* Total and Status Button */}
                <div className="flex items-center justify-between">
                  {order.amount && (
                    <span className="text-white font-semibold text-sm">
                      ${order.amount.toFixed(2)}
                    </span>
                  )}
                  <button
                    onClick={() => {
                      // You can add order tracking/details functionality here
                      if (order.sessionId) {
                        window.open(`/success?session_id=${order.sessionId}`, '_blank')
                      }
                    }}
                    className="text-xs text-cyan-400 hover:text-cyan-300 bg-cyan-400/10 hover:bg-cyan-400/20 px-2 py-1 rounded transition-colors"
                    title="View order details"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
