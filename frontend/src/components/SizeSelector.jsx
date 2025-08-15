import React from 'react'

export default function SizeSelector({ sizes = [], value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map(s => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          aria-pressed={value===s}
          className={`px-3 py-2 rounded-full border text-sm ${value===s ? 'bg-black text-white' : 'hover:bg-black/5'}`}
        >
          {s}
        </button>
      ))}
    </div>
  )
}