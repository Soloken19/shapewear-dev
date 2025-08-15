import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { fetchProduct } from '../lib/api'
import { useCart } from '../lib/cart.jsx'
import SizeSelector from '../components/SizeSelector'
import FabricInfoModal from '../components/FabricInfoModal'
import BeforeAfterSlider from '../components/BeforeAfterSlider'

export default function Product() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [qty, setQty] = useState(1)
  const [showFabricModal, setShowFabricModal] = useState(false)
  const cart = useCart()

  useEffect(() => {
    fetchProduct(slug)
      .then(data => {
        setProduct(data.product)
        setSelectedSize(data.product.sizes[0] || '')
        setSelectedColor(data.product.colors[0] || '')
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [slug])

  const handleAddToCart = () => {
    if (!product || !selectedSize || !selectedColor) return
    cart.add({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      qty,
      size: selectedSize,
      color: selectedColor
    })
    // Simple feedback - could be enhanced with toast/modal
    alert('Added to cart!')
  }

  if (loading) return <div className="p-8">Loading product...</div>
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>
  if (!product) return <div className="p-8">Product not found</div>

  const avgRating = product.reviews?.length > 0 
    ? (product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length).toFixed(1)
    : null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-[3/4] bg-neutral-100 rounded-lg overflow-hidden">
            <img 
              src={product.images?.primary || '/placeholder.svg'} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images?.before && product.images?.after && (
            <BeforeAfterSlider 
              beforeImage={product.images.before}
              afterImage={product.images.after}
            />
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-display tracking-tight">{product.name}</h1>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-2xl font-medium">${product.price}</span>
              {avgRating && (
                <div className="flex items-center gap-1 text-sm text-neutral-600">
                  <span>★</span>
                  <span>{avgRating}</span>
                  <span>({product.reviews.length} reviews)</span>
                </div>
              )}
            </div>
          </div>

          <p className="text-neutral-700 leading-relaxed">{product.description}</p>

          {/* Size Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Size</label>
            <SizeSelector 
              sizes={product.sizes}
              selected={selectedSize}
              onChange={setSelectedSize}
            />
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Color</label>
            <div className="flex gap-2">
              {product.colors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 text-sm border rounded-md transition-colors ${
                    selectedColor === color 
                      ? 'border-neutral-900 bg-neutral-900 text-white' 
                      : 'border-neutral-300 hover:border-neutral-400'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <select 
              value={qty} 
              onChange={(e) => setQty(Number(e.target.value))}
              className="border border-neutral-300 rounded-md px-3 py-2"
            >
              {[1,2,3,4,5].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={!selectedSize || !selectedColor}
            className="w-full bg-neutral-900 text-white py-3 px-6 rounded-md font-medium hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add to Cart
          </button>

          {/* Product Details */}
          <div className="space-y-4 pt-6 border-t border-neutral-200">
            <div>
              <h3 className="font-medium mb-2">Compression Level</h3>
              <p className="text-sm text-neutral-600">{product.compression}</p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Fabric & Care</h3>
              <button 
                onClick={() => setShowFabricModal(true)}
                className="text-sm text-neutral-600 underline hover:text-neutral-900"
              >
                View fabric details
              </button>
            </div>
          </div>

          {/* Reviews */}
          {product.reviews?.length > 0 && (
            <div className="pt-6 border-t border-neutral-200">
              <h3 className="font-medium mb-4">Customer Reviews</h3>
              <div className="space-y-4">
                {product.reviews.map((review, idx) => (
                  <div key={idx} className="border-l-2 border-neutral-100 pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{review.user}</span>
                      <div className="flex">
                        {Array.from({length: 5}, (_, i) => (
                          <span key={i} className={`text-sm ${i < review.rating ? 'text-yellow-400' : 'text-neutral-300'}`}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-neutral-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fabric Modal */}
      {showFabricModal && (
        <FabricInfoModal 
          fabric={product.fabric}
          onClose={() => setShowFabricModal(false)}
        />
      )}
    </div>
  )
}