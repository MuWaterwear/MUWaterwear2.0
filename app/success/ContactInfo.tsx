'use client'
export default function ContactInfo() {
  return (
    <div className="mt-8 pt-6 border-t border-slate-700">
      <p className="text-xs text-gray-500">
        Questions about your order? Contact us at{' '}
        <a
          href="mailto:info@muwaterwear.com"
          className="text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          info@muwaterwear.com
        </a>
      </p>
    </div>
  )
} 