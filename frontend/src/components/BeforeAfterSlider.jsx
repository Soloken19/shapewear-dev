import React, { useEffect, useRef, useState } from 'react'

export default function BeforeAfterSlider({ before, after, alt }) {
  const ref = useRef(null)
  const [pos, setPos] = useState(50)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let dragging = false

    function onDown(e){ dragging = true }
    function onUp(){ dragging = false }
    function onMove(e){ if(!dragging) return; const r = el.getBoundingClientRect(); const x = (e.touches? e.touches[0].clientX : e.clientX) - r.left; setPos(Math.min(100, Math.max(0, x / r.width * 100))) }

    el.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    el.addEventListener('mousemove', onMove)

    el.addEventListener('touchstart', onDown, { passive: true })
    window.addEventListener('touchend', onUp, { passive: true })
    el.addEventListener('touchmove', onMove, { passive: true })

    return () => {
      el.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('touchstart', onDown)
      window.removeEventListener('touchend', onUp)
      el.removeEventListener('touchmove', onMove)
    }
  }, [])

  return (
    <div ref={ref} className="relative w-full h-full">
      <img src={after} alt={alt} className="absolute inset-0 w-full h-full object-cover" />
      <img src={before} alt={alt} className="absolute inset-0 w-full h-full object-cover" style={{ clipPath: `inset(0 ${100-pos}% 0 0)` }} />
      <div className="absolute inset-y-0" style={{ left: `${pos}%` }}>
        <div className="w-0.5 h-full bg-white/90 shadow"></div>
        <div role="slider" aria-label="Before / After" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pos)} tabIndex={0} className="-translate-x-1/2 -mt-4 absolute top-1/2 w-8 h-8 rounded-full bg-white shadow-soft border border-black/10 flex items-center justify-center text-xs">↔</div>
      </div>
    </div>
  )
}