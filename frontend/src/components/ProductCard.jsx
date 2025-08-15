import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <Link to={`/product/${product.slug}`} className="block card overflow-hidden group focus:outline-none focus:ring-2 focus:ring-brand-espresso/40">
      <div className="aspect-[4/5] bg-neutral-100 overflow-hidden">
        <img
          src={product.image || '/placeholder.svg'}
          alt={product.name}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={(e) => { e.currentTarget.src = '/placeholder.svg' }}
          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 img-fade ${loaded ? 'loaded' : ''}`}
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium leading-tight">{product.name}</h3>
          <div className="text-sm text-neutral-700">${product.price.toFixed(2)}</div>
        </div>
        {product.rating ? (
          <div className="mt-1 text-xs text-neutral-600">⭐ {product.rating} · {product.reviewsCount} reviews</div>
        ) : (
          <div className="mt-1 text-xs text-neutral-500">New</div>
        )}
        <div className="mt-3 inline-flex items-center gap-2">
          {product.colors?.slice(0,4).map((c) => (
            <span key={c} className="w-3 h-3 rounded-full border border-black/10" title={c} style={{ background: c.toLowerCase()==='black' ? '#111' : undefined }}></span>
          ))}
        </div>
      </div>
    </Link>
  )
}