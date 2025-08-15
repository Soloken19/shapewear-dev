import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react'

const KEY = 'curvecraft_cart_v1'

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || { items: [], promoCode: '' } } catch { return { items: [], promoCode: '' } }
}
function save(state) { try { localStorage.setItem(KEY, JSON.stringify(state)) } catch {}
}

function reducer(state, action) {
  switch (action.type) {
    case 'INIT': return action.value
    case 'ADD': {
      const { item } = action
      const idx = state.items.findIndex(i => i.slug === item.slug && i.size === item.size && i.color === item.color)
      const items = [...state.items]
      if (idx >= 0) items[idx] = { ...items[idx], qty: items[idx].qty + item.qty }
      else items.push(item)
      const next = { ...state, items }
      save(next)
      return next
    }
    case 'REMOVE': {
      const items = state.items.filter((_, i) => i !== action.index)
      const next = { ...state, items }
      save(next)
      return next
    }
    case 'SET_QTY': {
      const items = state.items.map((it, i) => i === action.index ? { ...it, qty: action.qty } : it)
      const next = { ...state, items }
      save(next)
      return next
    }
    case 'SET_PROMO': {
      const next = { ...state, promoCode: action.code }
      save(next)
      return next
    }
    case 'CLEAR': {
      const next = { items: [], promoCode: '' }
      save(next)
      return next
    }
    default: return state
  }
}

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { items: [], promoCode: '' })

  useEffect(() => {
    dispatch({ type: 'INIT', value: load() })
  }, [])

  const api = useMemo(() => ({
    state,
    add(item) { dispatch({ type: 'ADD', item }) },
    remove(index) { dispatch({ type: 'REMOVE', index }) },
    setQty(index, qty) { dispatch({ type: 'SET_QTY', index, qty: Math.max(1, Number(qty)||1) }) },
    setPromo(code) { dispatch({ type: 'SET_PROMO', code }) },
    clear() { dispatch({ type: 'CLEAR' }) },
    subtotal() { return state.items.reduce((s, i) => s + i.price * i.qty, 0) },
    count() { return state.items.reduce((s, i) => s + i.qty, 0) },
  }), [state])

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}