import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../lib/cart.jsx'

export default function Cart() {
  const cart = useCart()

  if (cart.count() === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-display tracking-tight mb-4">Your cart is empty</h1>
        <p className="text-neutral-600 mb-8">Add some beautiful shapewear to get started.</p>
        <Link 
          to="/collections/bodysuits"
          className="inline-flex items-center px-6 py-3 bg-neutral-900 text-white rounded-md font-medium hover:bg-neutral-800 transition-colors"
        >
          Shop Bodysuits
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-display tracking-tight mb-8">Shopping Cart</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.state.items.map((item, index) => (
            <div key={index} className="flex gap-4 p-4 border border-neutral-200 rounded-lg">
              <div className="w-20 h-24 bg-neutral-100 rounded-md flex-shrink-0">
                <img 
                  src="/placeholder.svg" 
                  alt={item.name}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm">{item.name}</h3>
                <p className="text-sm text-neutral-600 mt-1">
                  {item.size} • {item.color}
                </p>
                <p className="text-sm font-medium mt-2">${item.price}</p>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <select 
                  value={item.qty}
                  onChange={(e) => cart.setQty(index, e.target.value)}
                  className="text-sm border border-neutral-300 rounded px-2 py-1"
                >
                  {[1,2,3,4,5].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                
                <button
                  onClick={() => cart.remove(index)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-neutral-50 p-6 rounded-lg h-fit">
          <h2 className="font-medium mb-4">Order Summary</h2>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal ({cart.count()} items)</span>
              <span>${cart.subtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="border-t border-neutral-200 pt-2 mt-4">
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${cart.subtotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Promo Code */}
          <div className="mt-6">
            <label className="block text-sm font-medium mb-2">Promo Code</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={cart.state.promoCode}
                onChange={(e) => cart.setPromo(e.target.value)}
                placeholder="Enter code"
                className="flex-1 text-sm border border-neutral-300 rounded px-3 py-2"
              />
              <button className="text-sm px-3 py-2 bg-neutral-200 rounded hover:bg-neutral-300">
                Apply
              </button>
            </div>
          </div>

          <Link
            to="/checkout"
            className="w-full mt-6 bg-neutral-900 text-white py-3 px-6 rounded-md font-medium hover:bg-neutral-800 transition-colors inline-block text-center"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  )
}