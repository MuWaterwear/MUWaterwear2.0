"use client"

import React from 'react'

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="text-center p-8">
        <h1 className="text-3xl font-bold mb-4">Success!</h1>
        <p className="text-lg">Thank you for your purchase. We will email you shortly with your order confirmation.</p>
        <a href="https://muwaterwear.com" className="text-cyan-400 underline mt-4 inline-block">Continue shopping at MUWaterwear.com</a>
      </div>
    </div>
  )
}
