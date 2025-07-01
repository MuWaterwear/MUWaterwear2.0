'use client'
import { useState, useEffect } from 'react'
import { Section } from '@/components/ui/section'
import { Button } from '@/components/ui/button'
import { FadeImage } from '@/components/ui/fade-image'
import Link from 'next/link'
import { ChevronRight, Waves } from 'lucide-react'

interface HeroProps {
  videoSrc?: string
  imageSrc?: string
  title?: string
  subtitle?: string
  ctaText?: string
  ctaHref?: string
}

export default function Hero({
  videoSrc = '/videos/Mainherobackground video.mp4',
  imageSrc = '/images/hero-water.jpg',
  title = 'Live the Water Lifestyle',
  subtitle = 'Premium gear for every adventure on the water',
  ctaText = 'Shop Collection',
  ctaHref = '/apparel'
}: HeroProps) {
  const [videoError, setVideoError] = useState(false)

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Video/Image */}
      {videoSrc && !videoError ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => setVideoError(true)}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : (
        <FadeImage
          src={imageSrc}
          alt="Water lifestyle"
          fill
          className="object-cover"
          priority
        />
      )}

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />

      {/* Water-inspired animated overlay */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-ocean via-transparent to-brand-teal animate-pulse" style={{ animationDuration: '8s' }} />
      </div>

      {/* Content */}
      <Section>
        <div className="relative z-10 text-center text-white max-w-3xl mx-auto">
          <Waves className="w-16 h-16 mx-auto mb-6 text-brand-softTeal animate-pulse" />
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            {title}
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-gray-200 font-light">
            {subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={ctaHref}>
              <Button 
                size="lg" 
                className="bg-brand-accent hover:bg-brand-accent/90 text-white px-8 py-6 text-lg font-medium group"
              >
                {ctaText}
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/about">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
              >
                Our Story
              </Button>
            </Link>
          </div>
        </div>
      </Section>

      {/* Subtle wave animation at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32">
        <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path 
            d="M0,50 C360,90 720,10 1440,50 L1440,100 L0,100 Z" 
            fill="rgba(255,255,255,0.05)"
            className="animate-pulse"
            style={{ animationDuration: '6s' }}
          />
          <path 
            d="M0,60 C360,20 720,80 1440,60 L1440,100 L0,100 Z" 
            fill="rgba(255,255,255,0.03)"
            className="animate-pulse"
            style={{ animationDuration: '8s' }}
          />
        </svg>
      </div>
    </section>
  )
} 