import React, { Suspense, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import './App.css'
import { Home, Collections, Product, Cart, Checkout, About } from './Routes'
import { useCart } from './lib/cart'

function Header() {
  const cart = useCart()
  return (
    <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90 border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link className="font-display text-2xl tracking-tight" to="/">CurveCraft</Link>
        <nav className="hidden md:flex gap-6 text-sm">
          <Link className="hover:text-brand-espresso transition-colors" to="/collections/bodysuits">Bodysuits</Link>
          <Link className="hover:text-brand-espresso transition-colors" to="/collections/high-waist-shorts">High-Waist Shorts</Link>
          <Link className="hover:text-brand-espresso transition-colors" to="/collections/waist-trainers">Waist Trainers</Link>
          <Link className="hover:text-brand-espresso transition-colors" to="/about">Our Story</Link>
        </nav>
        <Link to="/cart" className="inline-flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-full bg-neutral-900 text-white hover:shadow-soft transition-shadow">
          <span>Cart</span>
          {cart.count() > 0 && (
            <span className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-white text-neutral-900 text-xs">{cart.count()}</span>
          )}
        </Link>
      </div>
    </header>
  )
}

function App() {
  const location = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-[hsl(var(--page))] text-[hsl(var(--ink))]">
      <Header />
      <Suspense fallback={<div className="p-8">Loading…</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collections/:category" element={<Collections />} />
          <Route path="/product/:slug" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<div className="p-8">Page coming soon.</div>} />
        </Routes>
      </Suspense>

      <footer className="mt-24 border-t border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-3 gap-8 text-sm">
          <div>
            <div className="font-display text-xl mb-2">CurveCraft</div>
            <p className="text-neutral-600">Elegant shapewear designed for real bodies. Confidence, crafted.</p>
          </div>
          <div>
            <div className="font-medium mb-2">Shop</div>
            <ul className="space-y-1 text-neutral-700">
              <li><Link to="/collections/bodysuits">Bodysuits</Link></li>
              <li><Link to="/collections/high-waist-shorts">High-Waist Shorts</Link></li>
              <li><Link to="/collections/waist-trainers">Waist Trainers</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-medium mb-2">About</div>
            <ul className="space-y-1 text-neutral-700">
              <li><Link to="/about">Our Story</Link></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Manufacturing Ethics</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Sizing Guide</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-xs text-neutral-500 py-6">© {new Date().getFullYear()} CurveCraft</div>
      </footer>
    </div>
  )
}

export default App