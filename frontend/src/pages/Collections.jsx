import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchProducts } from '../lib/api'
import ProductCard from '../components/ProductCard'
import { Helmet } from 'react-helmet-async'

const ALL_SIZES = ["XS","S","M","L","XL","2XL","3XL"]
const COLORS = ["Sand","Almond","Mocha","Espresso","Black","Blush"]

export default function Collections() {
  const { category } = useParams()
  const [all, setAll] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [size, setSize] = useState('')
  const [color, setColor] = useState('')

  useEffect(() => {
    setLoading(true)
    fetchProducts()
      .then(d => setAll(d.products || []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [category])

  const filtered = useMemo(() => {
    let x = all.filter(p => p.categories?.includes(category))
    if (size) x = x.filter(p => p.sizes?.includes(size))
    if (color) x = x.filter(p => p.colors?.includes(color))
    return x
  }, [all, category, size, color])

  return (
    <div>
      <Helmet>
        <title>CurveCraft — {category?.replace('-', ' ')}</title>
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-3xl capitalize">{category?.replace('-', ' ')}</h1>
          <div className="flex items-center gap-3">
            <select value={size} onChange={e=>setSize(e.target.value)} className="border rounded-full px-3 py-2 text-sm">
              <option value="">Size</option>
              {ALL_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={color} onChange={e=>setColor(e.target.value)} className="border rounded-full px-3 py-2 text-sm">
              <option value="">Color</option>
              {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {loading && <div className="py-10">Loading…</div>}
        {error && <div className="py-10 text-red-600">{error}</div>}

        {!loading && !error && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            {filtered.length === 0 && (
              <div className="col-span-full text-neutral-600">No products match the selected filters.</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}