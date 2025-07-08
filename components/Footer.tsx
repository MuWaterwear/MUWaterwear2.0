"use client"

import { useState } from "react"
import Link from "next/link"
import NewsletterSignup from "@/components/NewsletterSignup"

export default function Footer() {
  const [showContactEmail, setShowContactEmail] = useState(false)
  const [showReturnsPolicy, setShowReturnsPolicy] = useState(false)
  const [showShippingPolicy, setShowShippingPolicy] = useState(false)

  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-16 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          <div>
            <h4 className="font-bold mb-4 text-cyan-400">SHOP</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/gear" className="hover:text-white transition-colors">Gear</Link></li>
              <li><Link href="/apparel" className="hover:text-white transition-colors">Apparel</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-cyan-400">SUPPORT</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/sizeguide.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Size Guide</Link></li>
              <li>
                {showShippingPolicy ? (
                  <span className="text-slate-300">
                    We charge standard shipping rate but free shipping on all apparel and accessories
                  </span>
                ) : (
                  <button 
                    onClick={() => setShowShippingPolicy(true)}
                    className="hover:text-white transition-colors text-left"
                  >
                    Shipping
                  </button>
                )}
              </li>
              <li>
                {showReturnsPolicy ? (
                  <span className="text-slate-300">
                    14 day return policy across all items, upon delivery
                  </span>
                ) : (
                  <button 
                    onClick={() => setShowReturnsPolicy(true)}
                    className="hover:text-white transition-colors text-left"
                  >
                    Returns
                  </button>
                )}
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-cyan-400">COMPANY</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li>
                {showContactEmail ? (
                  <span className="text-slate-300">
                    info@muwaterwear.com
                  </span>
                ) : (
                  <button 
                    onClick={() => setShowContactEmail(true)}
                    className="hover:text-white transition-colors text-left"
                  >
                    Contact
                  </button>
                )}
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-500">
          <div className="mb-4">
            <Link href="/privacy-policy" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">
              Privacy Policy
            </Link>
            <span className="mx-2 text-slate-600">|</span>
            <Link href="/terms" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">
              Terms of Service
            </Link>
          </div>
          <p>&copy; 2024 MU Waterwear. Engineered for water. Built for performance.</p>
        </div>
      </div>
    </footer>
  )
}