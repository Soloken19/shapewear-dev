import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../lib/cart.jsx'
import { postCheckout } from '../lib/api'

export default function Checkout() {
  const cart = useCart()
  const [formData, setFormData] = useState({
    email: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: ''
    }
  })
  const [loading, setLoading] = useState(false)
  const [orderResult, setOrderResult] = useState(null)
  const [error, setError] = useState(null)

  const handleInputChange = (field, value) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1]
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [addressField]: value }
      }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload = {
        items: cart.state.items,
        email: formData.email,
        address: formData.address,
        promoCode: cart.state.promoCode
      }

      const result = await postCheckout(payload)
      setOrderResult(result)
      cart.clear()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (cart.count() === 0 && !orderResult) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-display tracking-tight mb-4">Your cart is empty</h1>
        <Link 
          to="/collections/bodysuits"
          className="inline-flex items-center px-6 py-3 bg-neutral-900 text-white rounded-md font-medium hover:bg-neutral-800 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  if (orderResult) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8">
          <h1 className="text-2xl font-display tracking-tight text-green-800 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-green-700 mb-4">{orderResult.message}</p>
          <p className="text-sm text-green-600 mb-6">
            Order ID: <span className="font-mono">{orderResult.orderId}</span>
          </p>
          <p className="text-lg font-medium text-green-800 mb-8">
            Total: ${orderResult.total.toFixed(2)}
          </p>
          <Link 
            to="/"
            className="inline-flex items-center px-6 py-3 bg-neutral-900 text-white rounded-md font-medium hover:bg-neutral-800 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-display tracking-tight mb-8">Checkout</h1>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Information */}
            <div>
              <h2 className="text-lg font-medium mb-4">Contact Information</h2>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full border border-neutral-300 rounded-md px-3 py-2"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <h2 className="text-lg font-medium mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Street Address</label>
                  <input
                    type="text"
                    required
                    value={formData.address.street}
                    onChange={(e) => handleInputChange('address.street', e.target.value)}
                    className="w-full border border-neutral-300 rounded-md px-3 py-2"
                    placeholder="123 Main St"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <input
                      type="text"
                      required
                      value={formData.address.city}
                      onChange={(e) => handleInputChange('address.city', e.target.value)}
                      className="w-full border border-neutral-300 rounded-md px-3 py-2"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">State</label>
                    <input
                      type="text"
                      required
                      value={formData.address.state}
                      onChange={(e) => handleInputChange('address.state', e.target.value)}
                      className="w-full border border-neutral-300 rounded-md px-3 py-2"
                      placeholder="ST"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">ZIP Code</label>
                  <input
                    type="text"
                    required
                    value={formData.address.zip}
                    onChange={(e) => handleInputChange('address.zip', e.target.value)}
                    className="w-full border border-neutral-300 rounded-md px-3 py-2"
                    placeholder="12345"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-neutral-900 text-white py-3 px-6 rounded-md font-medium hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-neutral-50 p-6 rounded-lg h-fit">
          <h2 className="font-medium mb-4">Order Summary</h2>
          
          <div className="space-y-3 mb-6">
            {cart.state.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-neutral-600">{item.size} • {item.color} • Qty {item.qty}</div>
                </div>
                <div className="font-medium">${(item.price * item.qty).toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-sm border-t border-neutral-200 pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${cart.subtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            {cart.state.promoCode && (
              <div className="flex justify-between text-green-600">
                <span>Promo ({cart.state.promoCode})</span>
                <span>-$0.00</span>
              </div>
            )}
            <div className="border-t border-neutral-200 pt-2 mt-4">
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${cart.subtotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}