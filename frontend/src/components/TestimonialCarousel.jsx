import React, { useEffect, useState } from 'react'

const DATA = [
  { quote: 'Sculpting without the squeeze. Love it!', name: 'Maya' },
  { quote: 'Invisible under everything. Confidence booster!', name: 'Rae' },
  { quote: 'Featherlight and comfy all day.', name: 'Naya' },
]

export default function TestimonialCarousel() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % DATA.length), 4000)
    return () => clearInterval(id)
  }, [])
  const t = DATA[i]
  return (
    <div className="card p-6 text-center">
      <div className="text-lg">“{t.quote}”</div>
      <div className="mt-2 text-sm text-neutral-600">— {t.name}</div>
    </div>
  )
}