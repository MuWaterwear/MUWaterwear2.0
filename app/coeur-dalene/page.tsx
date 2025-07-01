'use client'

import { useState } from 'react'
import LakePageTemplate from '@/components/pages/LakePageTemplate'
import MobileNavigation from '@/components/responsive/MobileNavigation'
import NavigationBar from '@/components/NavigationBar'
import { useCart } from '@/contexts/CartContext'
import { MobileOnly, DesktopOnly } from '@/components/responsive/ResponsiveLayout'
import WeatherWebcamSection from '@/components/Weather/WeatherWebcamSection'
import { getProductsByLake } from '@/lib/features/apparel-products'

export default function CoeurDalenePage() {
  const { setIsCartOpen } = useCart()
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const accessories = [
    {
      id: 'beanie-cda',
      name: 'CDA Beanie',
      category: 'accessories',
      description: "Lake Coeur d'Alene branded cuffed beanie in multiple colors",
      price: 22,
      images: [
        '/images/ACCESSORIES/CDA-BEANIE/cuffed-beanie-black-front-685a34884ee68.png',
        '/images/ACCESSORIES/CDA-BEANIE/cuffed-beanie-heather-grey-front-685a34884f4c1.png',
        '/images/ACCESSORIES/CDA-BEANIE/cuffed-beanie-navy-front-685a34884f413.png',
        '/images/ACCESSORIES/CDA-BEANIE/cuffed-beanie-dark-grey-front-685a34884f473.png',
        '/images/ACCESSORIES/CDA-BEANIE/cuffed-beanie-baby-pink-front-685a34884f50b.png',
      ],
      colors: [
        { name: 'Black', hex: '#000000' },
        { name: 'Heather Grey', hex: '#9CA3AF' },
        { name: 'Navy', hex: '#1E3A8A' },
        { name: 'Dark Grey', hex: '#4B5563' },
        { name: 'Baby Pink', hex: '#F9A8D4' },
      ],
      sizes: ['One Size'],
      featured: true,
      lake: 'CDA',
      details:
        "Lake Coeur d'Alene branded beanie with classic cuffed design. Perfect for Idaho lake adventures in 5 stylish colors.",
    },
    {
      id: 'hat-cda-lake',
      name: 'CDA Lake Hat',
      category: 'accessories',
      description: 'Classic dad hat with Lake Coeur d\'Alene branding',
      price: 28,
      images: [
        '/images/ACCESSORIES/CDA-LAKE-HAT/classic-dad-hat-light-blue-front-685a35beae716.png',
        '/images/ACCESSORIES/CDA-LAKE-HAT/classic-dad-hat-black-front-685a35bea21a8.png',
        '/images/ACCESSORIES/CDA-LAKE-HAT/classic-dad-hat-navy-front-685a35bea3c57.png',
        '/images/ACCESSORIES/CDA-LAKE-HAT/classic-dad-hat-khaki-front-685a35bea6e3a.png',
        '/images/ACCESSORIES/CDA-LAKE-HAT/classic-dad-hat-stone-front-685a35bea97f6.png',
        '/images/ACCESSORIES/CDA-LAKE-HAT/classic-dad-hat-pink-front-685a35beac4d7.png',
      ],
      colors: [
        { name: 'Light Blue', hex: '#7DD3FC' },
        { name: 'Black', hex: '#000000' },
        { name: 'Navy', hex: '#1E3A8A' },
        { name: 'Khaki', hex: '#8B7355' },
        { name: 'Stone', hex: '#A8A29E' },
        { name: 'Pink', hex: '#EC4899' },
      ],
      sizes: ['One Size'],
      featured: true,
      lake: 'CDA',
      details:
        'Premium classic dad hat featuring Lake Coeur d\'Alene branding. Adjustable fit with curved brim design in 6 versatile colors.',
    },
  ]

  // Get CDA products from centralized source
  const cdaProducts = getProductsByLake('CDA').filter(
    product => product.lake === 'CDA' || product.name.toLowerCase().includes('cda') || product.name.toLowerCase().includes('coeur')
  )

  const allCdaProducts = [...cdaProducts, ...accessories].map(product => ({
    ...product,
    name: product.name.replace(/Cda/g, 'CDA'),
  }))

  const lakeInfo = {
    name: "Lake Coeur d'Alene",
    description: 'Idaho',
    heroImage: '/images/CDA-Background.svg',
    headerBackgroundImage: '/images/CDA-Background.svg',
    footerBackgroundImage: '/images/waterway-outline-2.png',
    icon: '/images/lake-icon.png',
    gpsCoordinates: '47.6661° N, 116.7706° W',
    elevation: '2,100 ft',
    maxDepth: '220 ft',
  }

  const webcamConfig = {
    src: 'https://api.wetmet.net/client-content/PlayerFrame.php?CAMERA=162-02-01',
    title: "Lake Coeur d'Alene Live Webcam",
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Desktop Navigation */}
      <DesktopOnly>
        <NavigationBar onMobileMenuOpen={() => setMobileFiltersOpen(true)} />
      </DesktopOnly>

      {/* Mobile Navigation */}
      <MobileOnly>
        <MobileNavigation onCartOpen={() => setIsCartOpen(true)} />

        {/* Mobile Hero Section */}
        <section
          className="relative h-[50vh] flex flex-col justify-end overflow-hidden"
          style={{
            backgroundImage: `url(${lakeInfo.heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black/90" />

          <div className="relative z-10 px-6 pb-8 space-y-4">
            <div className="w-24 h-24 mx-auto mb-4">
              <img
                src={lakeInfo.icon}
                alt={`${lakeInfo.name} Icon`}
                className="w-full h-full object-contain opacity-90 brightness-0 saturate-100 invert"
                style={{
                  filter:
                    'brightness(0) saturate(100%) invert(65%) sepia(98%) saturate(3207%) hue-rotate(163deg) brightness(101%) contrast(101%)',
                }}
              />
            </div>

            <h1 className="text-4xl font-bold text-center tracking-tight text-white">
              {lakeInfo.name.toUpperCase()}
            </h1>

            <p className="text-xl text-gray-300 text-center font-light">{lakeInfo.description}</p>

            <div className="bg-black/50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-200 space-x-2">
                <span>Elevation: {lakeInfo.elevation}</span>
                <span>•</span>
                <span>GPS: {lakeInfo.gpsCoordinates}</span>
                <span>•</span>
                <span>Max Depth: {lakeInfo.maxDepth}</span>
              </p>
            </div>
          </div>
        </section>
      </MobileOnly>

      {/* Desktop Hero Section */}
      <DesktopOnly>
        <section
          className="relative h-96 flex flex-col items-center justify-center overflow-hidden"
          style={{
            backgroundImage: `url(${lakeInfo.heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
          <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
            <div className="w-32 h-32 flex items-center justify-center mb-6 mx-auto">
              <img
                src={lakeInfo.icon}
                alt={`${lakeInfo.name} Icon`}
                className="w-full h-full object-contain opacity-90 brightness-0 saturate-100 invert"
                style={{
                  filter:
                    'brightness(0) saturate(100%) invert(65%) sepia(98%) saturate(3207%) hue-rotate(163deg) brightness(101%) contrast(101%)',
                }}
              />
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight text-white">
              {lakeInfo.name.toUpperCase()}
            </h1>
            <p className="text-xl text-gray-300 mb-6 font-light leading-relaxed">
              {lakeInfo.description}
            </p>

            <div className="text-center text-gray-300">
              <p className="text-sm">
                Elevation: {lakeInfo.elevation} • GPS: {lakeInfo.gpsCoordinates} • Max Depth: {lakeInfo.maxDepth}
              </p>
            </div>
          </div>
        </section>
      </DesktopOnly>

      <div className="container mx-auto px-4 py-8">
        <WeatherWebcamSection 
          location="Coeur d'Alene, ID" 
          webcamSrc={webcamConfig.src}
          webcamTitle={webcamConfig.title}
          lakemonsterUrl="https://waterdata.usgs.gov/monitoring-location/12415500/"
        />

        <LakePageTemplate
          lakeInfo={lakeInfo}
          apparelProducts={allCdaProducts}
          webcamConfig={webcamConfig}
        />
      </div>
    </div>
  )
} 