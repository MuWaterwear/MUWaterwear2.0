'use client'

import { useState } from 'react'
import LakePageTemplate from '@/components/pages/LakePageTemplate'
import MobileNavigation from '@/components/responsive/MobileNavigation'
import NavigationBar from '@/components/NavigationBar'
import { useCart } from '@/contexts/CartContext'
import { MobileOnly, DesktopOnly } from '@/components/responsive/ResponsiveLayout'
import WeatherWebcamSection from '@/components/Weather/WeatherWebcamSection'

import apparelProductsData from '@/data/apparel-products.json'

export default function LakeWashingtonPage() {
  const { setIsCartOpen } = useCart()
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Lake Washington accessories
  const washingtonAccessories = [
    {
      id: 'beanie-washington',
      name: 'Washington Beanie',
      category: 'accessories',
      description: 'Lake Washington branded cuffed beanie in multiple colors',
      price: 22,
      images: [
        '/images/ACCESSORIES/WASHINGTON-BEANIE/cuffed-beanie-black-front-685a3e559551c.png',
        '/images/ACCESSORIES/WASHINGTON-BEANIE/cuffed-beanie-heather-grey-front-685a3e559591e.png',
        '/images/ACCESSORIES/WASHINGTON-BEANIE/cuffed-beanie-navy-front-685a3e5595863.png',
        '/images/ACCESSORIES/WASHINGTON-BEANIE/cuffed-beanie-dark-grey-front-685a3e55958bf.png',
        '/images/ACCESSORIES/WASHINGTON-BEANIE/cuffed-beanie-baby-pink-front-685a3e559597c.png',
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
      details:
        'Lake Washington branded beanie with classic cuffed design. Perfect for Pacific Northwest adventures in 5 stylish colors.',
    },
    {
      id: 'hat-washington-lake',
      name: 'Lake Washington Hat',
      category: 'accessories',
      description: 'Classic dad hat with Lake Washington branding',
      price: 28,
      images: [
        '/images/ACCESSORIES/WASHINGTON-LAKE-HAT/classic-dad-hat-light-blue-front-685a3e1a73046.png',
        '/images/ACCESSORIES/WASHINGTON-LAKE-HAT/classic-dad-hat-black-front-685a3e1a708a5.png',
        '/images/ACCESSORIES/WASHINGTON-LAKE-HAT/classic-dad-hat-navy-front-685a3e1a71126.png',
        '/images/ACCESSORIES/WASHINGTON-LAKE-HAT/classic-dad-hat-khaki-front-685a3e1a7173d.png',
        '/images/ACCESSORIES/WASHINGTON-LAKE-HAT/classic-dad-hat-stone-front-685a3e1a71e51.png',
        '/images/ACCESSORIES/WASHINGTON-LAKE-HAT/classic-dad-hat-pink-front-685a3e1a726fd.png',
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
      details:
        'Premium classic dad hat featuring Lake Washington branding. Adjustable fit with curved brim design in 6 versatile colors.',
    },
  ]

  const washingtonProducts = apparelProductsData.filter((product: any) =>
    product.lake === 'WASHINGTON' || product.name.toLowerCase().includes('washington')
  )

  const allWashingtonProducts = [...washingtonProducts, ...washingtonAccessories]

  const lakeInfo = {
    name: 'Lake Washington',
    description: 'Washington',
    heroImage: '/images/LAKEWASHINGTON.svg',
    headerBackgroundImage: '/images/LAKEWASHINGTON.svg',
    footerBackgroundImage: '/images/waterway-outline-2.png',
    icon: '/images/waterway-outline-1.png',
    gpsCoordinates: '47.63° N, 122.27° W',
    elevation: '20 ft',
    maxDepth: '214 ft',
  }

  const webcamConfig = {
    src: 'https://open.ivideon.com/embed/v3/?server=200-YV6knPliOPswemRS31OP0Q&camera=0&width=&height=&lang=en',
    title: 'Lake Washington Live Webcam',
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <DesktopOnly>
        <NavigationBar onMobileMenuOpen={() => setMobileFiltersOpen(true)} />
      </DesktopOnly>

      <MobileOnly>
        <MobileNavigation onCartOpen={() => setIsCartOpen(true)} />

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
          location="Lake Washington, WA"
          webcamSrc={webcamConfig.src}
          webcamTitle={webcamConfig.title}
          lakemonsterUrl="https://waterdata.usgs.gov/monitoring-location/12119000/"
        />

        <LakePageTemplate
          lakeInfo={lakeInfo}
          apparelProducts={allWashingtonProducts}
          webcamConfig={webcamConfig}
                />
              </div>
            </div>
  )
} 