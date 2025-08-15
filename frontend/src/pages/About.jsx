import React from 'react'
import { Helmet } from 'react-helmet-async'

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Helmet><title>Our Story — CurveCraft</title></Helmet>
      <h1 className="font-display text-4xl">Our Story</h1>
      <p className="mt-4 text-neutral-700">CurveCraft was born from a simple belief: every body deserves comfort and confidence. We craft elegant shapewear with a body-positive ethos, inclusive sizing, and ethically-minded production.</p>
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="font-medium">Manufacturing Ethics</div>
          <p className="mt-2 text-neutral-700 text-sm">Our partners are audited regularly for fair wages, safe environments, and eco-conscious processes.</p>
        </div>
        <div className="card p-6">
          <div className="font-medium">Inclusivity</div>
          <p className="mt-2 text-neutral-700 text-sm">We design for sizes XS–3XL with diverse fit models and community feedback guiding every iteration.</p>
        </div>
      </div>
    </div>
  )
}