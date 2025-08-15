import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchProduct } from '../lib/api'
import { useCart } from '../lib/cart'
import SizeSelector from '../components/SizeSelector'
import BeforeAfterSlider from '../components/BeforeAfterSlider'
import FabricInfoModal from '../components/FabricInfoModal'
import { Helmet } from 'react-helmet-async'

export default function Product() {
  const { slug } = useParams()
  const { add } = useCart()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [size, setSize] = useState('')
  const [color, setColor] = useState('')
  const [qty, setQty] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetchProduct(slug)
      .then(d => setData(d.product))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [slug])

  const canAdd = useMemo(() => size && color && qty > 0, [size, color, qty])

  if (loading) return <div className="p-8">Loading…</div>
  if (error) return <div className="p-8 text-red-600">{error}</div>
  if (!data) return null

  const onAdd = () => {
    if (!canAdd) return
    add({ id: data.id, slug: data.slug, name: data.name, price: data.price, qty, size, color })
    console.log('track:add_to_cart', { slug: data.slug, size, color, qty })
  }

  return (
    <div>
      <Helmet>
        <title>{data.name} — CurveCraft</title>
        <meta name="description" content={data.description} />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid md:grid-cols-2 gap-8">
        <div>
          <div className="aspect-[4/5] bg-neutral-100 rounded-xl overflow-hidden">
            <BeforeAfterSlider before={data.images.before || '/placeholder.svg'} after={data.images.after || '/placeholder.svg'} alt={data.name} />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {data.images.gallery?.map((src, i) => (
              <img key={i} src={src} alt={`${data.name} ${i+1}`} loading="lazy" className="w-full h-24 object-cover rounded-lg bg-neutral-100" onError={(e)=>{e.currentTarget.src='/placeholder.svg'}} />
            ))}
          </div>
        </div>
        <div>
          <h1 className="font-display text-3xl leading-tight">{data.name}</h1>
          <div className="mt-2 text-neutral-700">${data.price.toFixed(2)}</div>
          <p className="mt-4 text-neutral-700">{data.description}</p>

          <div className="mt-6">
            <div className="text-sm font-medium mb-2">Size</div>
            <SizeSelector sizes={data.sizes} value={size} onChange={setSize} />
            <p className="text-xs text-neutral-600 mt-2">Tip: If between sizes, size up for comfort.</p>
          </div>

          <div className="mt-4">
            <div className="text-sm font-medium mb-2">Color</div>
            <div className="flex gap-2">
              {data.colors.map(c => (
                <button key={c} onClick={() => setColor(c)} aria-pressed={color===c} className={`w-8 h-8 rounded-full border ${color===c? 'ring-2 ring-black' : ''}`} title={c}></button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <label className="text-sm" htmlFor="qty">Qty</label>
            <input id="qty" type="number" min="1" value={qty} onChange={e=>setQty(Math.max(1, Number(e.target.value)||1))} className="w-20 border rounded-full px-3 py-2 text-sm" />
            <button onClick={() => setModalOpen(true)} className="btn btn-ghost">Fabric & Care</button>
          </div>

          <div className="mt-6 flex gap-3">
            <button disabled={!canAdd} onClick={onAdd} className="btn btn-primary disabled:opacity-50">Add to Cart</button>
            <button className="btn btn-ghost" onClick={()=>console.log('track:cta_buy_now',{slug:data.slug})}>Buy Now</button>
          </div>
        </div>
      </div>

      <FabricInfoModal open={modalOpen} onClose={() => setModalOpen(false)} fabric={data.fabric} />

      <div className="fixed md:hidden left-0 right-0 bottom-0 border-t border-black/10 bg-white/95 backdrop-blur p-4">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="font-medium">${data.price.toFixed(2)}</div>
          <button disabled={!canAdd} onClick={onAdd} className="btn btn-primary flex-1">Add to Cart</button>
        </div>
      </div>
    </div>
  )
}