'use client'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
export default function SuccessActions() {
  return (
    <div className="space-y-3">
      <Button asChild className="w-full bg-cyan-400 hover:bg-cyan-500 text-black font-bold">
        <Link href="/" prefetch={true}>
          <ArrowRight className="w-4 h-4 mr-2" />
          Continue Shopping
        </Link>
      </Button>
      <Button
        asChild
        variant="outline"
        className="w-full border-slate-700 text-gray-300 hover:bg-slate-800"
      >
        <Link href="/about" prefetch={true}>
          Learn More About MU Waterwear
        </Link>
      </Button>
    </div>
  )
} 