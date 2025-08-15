import React, { useState } from 'react'
import { postCheckout } from '../lib/api'
import { useCart } from '../lib/cart'
import { Helmet } from 'react-helmet-async'

export default function Checkout() {
  const cart = useCart()
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload = {
        items: cart.state.items,
        email,
        address: { line1: address },
        promoCode: cart.state.promoCode || undefined,
      }
      const res = await postCheckout(payload)
      setResult(res)
      cart.clear()
      console.log('track:checkout', res)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Helmet><title>Checkout — CurveCraft</title></Helmet>
      <h1 className="font-display text-3xl">Checkout</h1>
      {result ? (
        <div className="card p-6 mt-6">
          <div className="text-xl font-medium">Order Confirmed</div>
          <div className="mt-2 text-neutral-700">Order ID: {result.orderId}</div>
          <div className="mt-1">Total Paid: ${result.total.toFixed(2)} {result.currency}</div>
          <div className="mt-4 text-sm text-neutral-600">This is a checkout stub for demo purposes.</div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="card p-6 mt-6 space-y-4">
          <div>
            <label className="text-sm">Email</label>
            <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2" placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-sm">Address</label>
            <input type="text" value={address} onChange={e=>setAddress(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2" placeholder="123 Curve St" />
          </div>
          <button disabled={loading || cart.state.items.length===0} className="btn btn-primary">{loading ? 'Processing…' : 'Pay Now'}</button>
          {error && <div className="text-red-600 text-sm">{error}</div>}
        </form>
      )}
    </div>
  )
}