import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../lib/cart'
import { Helmet } from 'react-helmet-async'

export default function Cart() {
  const cart = useCart()
  const items = cart.state.items
  const subtotal = cart.subtotal()

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Helmet><title>Cart — CurveCraft</title></Helmet>
      <h1 className="font-display text-3xl">Your Cart</h1>
      {items.length === 0 ? (
        <div className="py-12">Your cart is empty. <Link to="/" className="underline">Continue shopping</Link>.</div>
      ) : (
        <div className="mt-6 grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {items.map((it, i) => (
              <div key={i} className="card p-4 flex items-center gap-4">
                <div className="w-20 h-24 bg-neutral-100 rounded-lg" />
                <div className="flex-1">
                  <div className="font-medium">{it.name}</div>
                  <div className="text-sm text-neutral-600">{it.color} • {it.size}</div>
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <label htmlFor={`qty-${i}`}>Qty</label>
                    <input id={`qty-${i}`} type="number" min="1" value={it.qty} onChange={e=>cart.setQty(i, e.target.value)} className="w-20 border rounded-full px-3 py-1" />
                    <button className="text-red-600 text-sm" onClick={()=>cart.remove(i)}>Remove</button>
                  </div>
                </div>
                <div className="font-medium">${(it.price*it.qty).toFixed(2)}</div>
              </div>
            ))}
          </div>
          <div className="card p-4 h-fit">
            <div className="flex items-center justify-between">
              <div className="text-neutral-600">Subtotal</div>
              <div className="font-medium">${subtotal.toFixed(2)}</div>
            </div>
            <div className="mt-4">
              <label className="text-sm">Promo Code</label>
              <input type="text" value={cart.state.promoCode} onChange={e=>cart.setPromo(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2" placeholder="WELCOME10" />
            </div>
            <Link to="/checkout" className="btn btn-primary w-full mt-4 text-center">Checkout</Link>
          </div>
        </div>
      )}
    </div>
  )
}