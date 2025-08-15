import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchProducts } from '../lib/api'
import ProductCard from '../components/ProductCard'
import { Helmet } from 'react-helmet-async'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProducts()
      .then(d => setProducts(d.products || []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <Helmet>
        <title>CurveCraft — Premium Shapewear</title>
        <meta name="description" content="Elegant, body-positive shapewear with buttery-soft compression." />
      </Helmet>

      <section className="hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 items-center gap-10">
            <div>
              <h1 className="font-display text-4xl md:text-5xl tracking-tight">Confidence, crafted.</h1>
              <p className="mt-4 text-neutral-700 max-w-prose">Premium shapewear designed for real bodies. Buttery-soft fabrics, seamless finishes, and inclusive sizing from XS–3XL.</p>
              <div className="mt-6 flex gap-3">
                <Link to="/collections/bodysuits" onClick={() => console.log('CTA: Shop Bodysuits')} className="btn btn-primary">Shop Bodysuits</Link>
                <Link to="/about" className="btn btn-ghost">Our Story</Link>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-soft border border-black/5 bg-neutral-100 aspect-[4/5]"></div>
          </div>
        </div>
      </section>

      <section className="mt-12 md:mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl mb-4">Trending Now</h2>
          {loading && <div className="py-10">Loading products…</div>}
          {error && <div className="py-10 text-red-600">{error}</div>}
          {!loading && !error && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.slice(0,8).map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mt-16 md:mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {[{t:'Bodysuits',k:'bodysuits'},{t:'High-Waist Shorts',k:'high-waist-shorts'},{t:'Waist Trainers',k:'waist-trainers'}].map(cat => (
              <Link key={cat.k} to={`/collections/${cat.k}`} className="card p-6 hover:shadow-lg transition-shadow">
                <div className="h-40 bg-neutral-100 rounded-lg mb-4"></div>
                <div className="font-medium">{cat.t}</div>
                <div className="text-sm text-neutral-600">Shop now →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}