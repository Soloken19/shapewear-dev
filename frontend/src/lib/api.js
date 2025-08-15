const BASE_URL = (import.meta.env.REACT_APP_BACKEND_URL || '/api')

export async function fetchProducts() {
  const res = await fetch(`${BASE_URL}/products`)
  if (!res.ok) throw new Error('Failed to load products')
  return res.json()
}

export async function fetchProduct(slug) {
  const res = await fetch(`${BASE_URL}/products/${slug}`)
  if (!res.ok) throw new Error('Product not found')
  return res.json()
}

export async function postCheckout(payload) {
  const res = await fetch(`${BASE_URL}/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!res.ok) {
    const e = await res.json().catch(() => ({}))
    throw new Error(e.detail || 'Checkout failed')
  }
  return res.json()
}