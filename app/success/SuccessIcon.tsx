'use client'
import { CheckCircle } from 'lucide-react'
export default function SuccessIcon() {
  return (
    <div className="relative mb-6">
      <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-10 h-10 text-green-400" />
      </div>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-green-400/20 rounded-full animate-ping"></div>
    </div>
  )
} 