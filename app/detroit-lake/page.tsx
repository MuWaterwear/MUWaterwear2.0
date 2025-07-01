'use client'

import { useState } from 'react'
import LakePageTemplate from '@/components/pages/LakePageTemplate'
import MobileNavigation from '@/components/responsive/MobileNavigation'
import NavigationBar from '@/components/NavigationBar'
import { useCart } from '@/contexts/CartContext'
import { MobileOnly, DesktopOnly } from '@/components/responsive/ResponsiveLayout'
import WeatherWebcamSection from '@/components/Weather/WeatherWebcamSection'

// Import Detroit-specific products from the JSON file
import apparelProductsData from '@/data/apparel-products.json'

export default function DetroitLakePage() {
  const { setIsCartOpen } = useCart()
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Detroit-specific accessories data
  const detroitAccessories = [
    {
      id: 'beanie-detroit',
      name: 'Detroit Beanie',
      category: 'accessories',
      description: 'Detroit Lake branded cuffed beanie in multiple colors',
      price: 22,
      images: [
        '/images/ACCESSORIES/DETROIT-BEANIE/cuffed-beanie-black-front-685a39440793c.png',
        '/images/ACCESSORIES/DETROIT-BEANIE/cuffed-beanie-heather-grey-front-685a394407f81.png',
        '/images/ACCESSORIES/DETROIT-BEANIE/cuffed-beanie-navy-front-685a394407ec3.png',
        '/images/ACCESSORIES/DETROIT-BEANIE/cuffed-beanie-dark-grey-front-685a394407f22.png',
        '/images/ACCESSORIES/DETROIT-BEANIE/cuffed-beanie-baby-pink-front-685a394407fcc.png',
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
      details: 'Detroit Lake branded beanie with classic cuffed design. Perfect for Oregon lake adventures in 5 stylish colors.',
    },
    {
      id: 'hat-detroit-lake',
      name: 'Detroit Lake Hat',
      category: 'accessories',
      description: 'Classic dad hat with Detroit Lake branding',
      price: 28,
      images: [
        '/images/ACCESSORIES/DETROIT-LAKE-HAT/classic-dad-hat-light-blue-front-685a3b475dc80.png',
        '/images/ACCESSORIES/DETROIT-LAKE-HAT/classic-dad-hat-black-front-685a3b475b645.png',
        '/images/ACCESSORIES/DETROIT-LAKE-HAT/classic-dad-hat-navy-front-685a3b475c0b7.png',
        '/images/ACCESSORIES/DETROIT-LAKE-HAT/classic-dad-hat-khaki-front-685a3b475c651.png',
        '/images/ACCESSORIES/DETROIT-LAKE-HAT/classic-dad-hat-stone-front-685a3b475ccc1.png',
        '/images/ACCESSORIES/DETROIT-LAKE-HAT/classic-dad-hat-pink-front-685a3b475d423.png',
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
      details: 'Premium classic dad hat featuring Detroit Lake branding. Adjustable fit with curved brim design in 6 versatile colors.',
    },
  ]

  // Filter products specific to Detroit Lake
  const detroitProducts = apparelProductsData.filter(product => 
    product.lake === 'DETROIT' || 
    product.name.toLowerCase().includes('detroit')
  )

  // Combine apparel and accessories
  const allDetroitProducts = [...detroitProducts, ...detroitAccessories]

  const lakeInfo = {
    name: "Detroit Lake",
    description: 'Oregon',
    heroImage: '/images/DETROITLAKE.svg',
    headerBackgroundImage: '/images/DETROITLAKE.svg',
    footerBackgroundImage: '/images/waterway-outline-2.png',
    icon: '/images/waterway-outline-2.png',
    gpsCoordinates: '44.7242° N, 122.1456° W',
    elevation: '1,569 ft',
    maxDepth: '463 ft',
  }

  const webcamConfig = {
    src: 'https://www.windy.com/webcams/1227219117?44.727,-122.135,8,p:cams',
    title: 'Detroit Lake Live Webcam',
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
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black/90" />
          
          {/* Content Container */}
          <div className="relative z-10 px-6 pb-8 space-y-4">
            {/* Lake Icon */}
            <div className="w-24 h-24 mx-auto mb-4">
              <img
                src={lakeInfo.icon}
                alt="Detroit Lake Icon"
                className="w-full h-full object-contain opacity-90 brightness-0 saturate-100 invert"
                style={{
                  filter: 'brightness(0) saturate(100%) invert(65%) sepia(98%) saturate(3207%) hue-rotate(163deg) brightness(101%) contrast(101%)',
                }}
              />
            </div>
            
            {/* Lake Name */}
            <h1 className="text-4xl font-bold text-center tracking-tight text-white">
              {lakeInfo.name.toUpperCase()}
            </h1>
            
            {/* Location */}
            <p className="text-xl text-gray-300 text-center font-light">
              {lakeInfo.description}
            </p>
            
            {/* Lake Details */}
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
            {/* Detroit Lake Icon */}
            <div className="w-32 h-32 flex items-center justify-center mb-6 mx-auto">
              <img
                src={lakeInfo.icon}
                alt="Detroit Lake Icon"
                className="w-full h-full object-contain opacity-90 brightness-0 saturate-100 invert"
                style={{
                  filter: 'brightness(0) saturate(100%) invert(65%) sepia(98%) saturate(3207%) hue-rotate(163deg) brightness(101%) contrast(101%)',
                }}
              />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight text-white">
              {lakeInfo.name.toUpperCase()}
            </h1>
            <p className="text-xl text-gray-300 mb-6 font-light leading-relaxed">
              {lakeInfo.description}
            </p>
            
            {/* Lake Data */}
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
          location="Detroit Lake, OR" 
          webcamSrc={webcamConfig.src}
          webcamTitle={webcamConfig.title}
          lakemonsterUrl="https://waterdata.usgs.gov/monitoring-location/14181500/"
        />

        {/* Lake Page Template with Detroit-specific content */}
        <LakePageTemplate 
          lakeInfo={lakeInfo}
          apparelProducts={allDetroitProducts}
          webcamConfig={webcamConfig}
        />
      </div>
    </div>
  )
}