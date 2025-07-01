'use client'

import { useState, useEffect } from 'react'

interface PrintifyProduct {
  id: string
  title: string
  description: string
  variants: Array<{
    id: number
    title: string
    price: number
  }>
}

interface PrintifyOrder {
  id: string
  external_id: string
  status: string
  created_at: string
  line_items: Array<{
    product_id: string
    variant_id: number
    quantity: number
  }>
}

export default function PrintifyAdminPage() {
  const [products, setProducts] = useState<PrintifyProduct[]>([])
  const [orders, setOrders] = useState<PrintifyOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch products and orders from your API
      const [productsRes, ordersRes] = await Promise.all([
        fetch('/api/printify/products'),
        fetch('/api/printify/orders'),
      ])

      if (productsRes.ok) {
        const productsData = await productsRes.json()
        setProducts(productsData.data || [])
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json()
        setOrders(ordersData.data || [])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const testWebhook = async () => {
    try {
      const response = await fetch('/api/test-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: true }),
      })

      if (response.ok) {
        alert('Webhook test successful!')
      } else {
        alert('Webhook test failed!')
      }
    } catch (err) {
      alert('Webhook test error: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Printify Admin Dashboard</h1>
          <div className="text-center">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Printify Admin Dashboard</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Setup Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Integration Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{products.length}</div>
              <div className="text-gray-600">Products in Printify</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{orders.length}</div>
              <div className="text-gray-600">Total Orders</div>
            </div>
            <div className="text-center">
              <button
                onClick={testWebhook}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Test Webhook
              </button>
            </div>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Setup Instructions</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm mr-3">
                1
              </div>
              <span>Create Printify account and get API token</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm mr-3">
                2
              </div>
              <span>Add environment variables to .env.local</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm mr-3">
                3
              </div>
              <span>Create products in Printify dashboard</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm mr-3">
                4
              </div>
              <span>Update product mapping in webhook</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm mr-3">
                5
              </div>
              <span>Set up Stripe webhook endpoint</span>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Printify Products</h2>
          {products.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No products found in Printify.</p>
              <p className="text-sm mt-2">Create products in your Printify dashboard first.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Product ID</th>
                    <th className="px-4 py-2 text-left">Title</th>
                    <th className="px-4 py-2 text-left">Variants</th>
                    <th className="px-4 py-2 text-left">Price Range</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id} className="border-t">
                      <td className="px-4 py-2 font-mono text-sm">{product.id}</td>
                      <td className="px-4 py-2">{product.title}</td>
                      <td className="px-4 py-2">{product.variants?.length || 0}</td>
                      <td className="px-4 py-2">
                        {product.variants?.length > 0 && (
                          <span>
                            ${Math.min(...product.variants.map(v => v.price / 100)).toFixed(2)} - $
                            {Math.max(...product.variants.map(v => v.price / 100)).toFixed(2)}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          {orders.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No orders found.</p>
              <p className="text-sm mt-2">
                Orders will appear here after customers complete checkout.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Order ID</th>
                    <th className="px-4 py-2 text-left">External ID</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Items</th>
                    <th className="px-4 py-2 text-left">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className="border-t">
                      <td className="px-4 py-2 font-mono text-sm">{order.id}</td>
                      <td className="px-4 py-2 font-mono text-sm">{order.external_id}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            order.status === 'fulfilled'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">{order.line_items?.length || 0}</td>
                      <td className="px-4 py-2">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
