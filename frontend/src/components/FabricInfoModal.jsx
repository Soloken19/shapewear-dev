import React from 'react'

export default function FabricInfoModal({ open, onClose, fabric }) {
  if (!open) return null
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-end md:items-center justify-center">
        <div className="card w-full md:w-[520px] p-6 m-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="font-display text-xl">Fabric & Care</div>
            <button onClick={onClose} className="btn btn-ghost" aria-label="Close">✕</button>
          </div>
          <div className="mt-4 text-sm">
            <div><span className="font-medium">Composition:</span> {fabric?.composition}</div>
            <div className="mt-2"><span className="font-medium">Feel:</span> {fabric?.feel}</div>
            <div className="mt-2"><span className="font-medium">Care:</span> {fabric?.care}</div>
          </div>
        </div>
      </div>
    </div>
  )
}