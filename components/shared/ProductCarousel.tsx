'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import { useCart } from '@/contexts/CartContext'

interface Product {
  id: string
  name: string
  description: string
  price: string | number
  images: string[]
  colors: Array<{ name: string; hex: string }>
  sizes: string[]
  details: string
  featuresList: string[]
}

interface ProductCarouselProps {
  products: Product[]
  onImageClick: (imageSrc: string) => void
}

export default function ProductCarousel({ products, onImageClick }: ProductCarouselProps) {
  const { addToCart } = useCart()
  const [selectedSize, setSelectedSize] = useState<{ [key: number]: string }>({})
  const [selectedColor, setSelectedColor] = useState<{ [key: number]: string }>({})
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null)

  const [carouselPosition, setCarouselPosition] = useState(0)
  const cardWidth = 320
  const gap = 32
  const itemWidth = cardWidth + gap

  const infiniteProducts = [
    ...products,
    ...products,
    ...products,
    ...products,
    ...products,
  ]
  const startOffset = -products.length * itemWidth * 2

  const [carouselInitialized, setCarouselInitialized] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(true)

  const handleAddToCart = (product: Product, index: number) => {
    const size = selectedSize[index]
    const color = selectedColor[index] || product.colors[0]?.name

    if (!size) {
      alert('Please select a size before adding to cart.')
      return
    }

    const cartItem = {
      id: `${product.id}-${size}-${color}`,
      name: product.name,
      price: typeof product.price === 'string' ? product.price : `$${product.price}`,
      size,
      color,
      quantity: 1,
      image: product.images[0],
    }

    addToCart(cartItem)
  }

  const scrollCarouselLeft = () => {
    setCarouselPosition(prev => prev + itemWidth)
  }

  const scrollCarouselRight = () => {
    setCarouselPosition(prev => prev - itemWidth)
  }

  useEffect(() => {
    if (!carouselInitialized) {
      setCarouselPosition(startOffset)
      setCarouselInitialized(true)
    }
  }, [startOffset, carouselInitialized])

  useEffect(() => {
    if (!carouselInitialized) return

    const currentPos = carouselPosition
    const setLength = products.length * itemWidth

    const rightBoundary = startOffset + setLength * 1.5
    const leftBoundary = startOffset - setLength * 1.5

    if (currentPos > rightBoundary || currentPos < leftBoundary) {
      setIsTransitioning(false)

      setTimeout(() => {
        if (currentPos > rightBoundary) {
          setCarouselPosition(currentPos - setLength)
        } else if (currentPos < leftBoundary) {
          setCarouselPosition(currentPos + setLength)
        }

        setTimeout(() => {
          setIsTransitioning(true)
        }, 50)
      }, 10)
    }
  }, [carouselPosition, startOffset, products.length, itemWidth, carouselInitialized])

  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Featured Apparel</h2>
          <p className="text-gray-400 text-lg">Premium lakeside apparel designed for water enthusiasts</p>
        </div>

        <div className="relative overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <Button
              onClick={scrollCarouselLeft}
              variant="outline"
              size="icon"
              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 z-10"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              onClick={scrollCarouselRight}
              variant="outline"
              size="icon"
              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 z-10"
            >
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Button>
          </div>

          <div className="overflow-hidden">
            <div
              className="flex gap-8"
              style={{
                transform: `translateX(${carouselPosition}px)`,
                transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none',
                width: `${infiniteProducts.length * itemWidth}px`,
              }}
            >
              {infiniteProducts.map((product, index) => (
                <Card
                  key={`${product.id}-${index}`}
                  className="flex-shrink-0 bg-gray-900 border-gray-800 text-white overflow-hidden"
                  style={{ width: `${cardWidth}px` }}
                >
                  <div className="relative h-80 bg-gray-800">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                      onClick={() => onImageClick(product.images[0])}
                    />
                    <Badge className="absolute top-4 left-4 bg-cyan-500 text-black">
                      {typeof product.price === 'string' ? product.price : `$${product.price}`}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>

                    {/* Color Selection */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-300 mb-2">Color:</p>
                      <div className="flex gap-2 flex-wrap">
                        {product.colors.map((color) => (
                          <button
                            key={color.name}
                            onClick={() =>
                              setSelectedColor(prev => ({ ...prev, [index]: color.name }))
                            }
                            className={`w-6 h-6 rounded-full border-2 ${
                              selectedColor[index] === color.name
                                ? 'border-cyan-400'
                                : 'border-gray-600'
                            }`}
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Size Selection */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-300 mb-2">Size:</p>
                      <div className="flex gap-2 flex-wrap">
                        {product.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(prev => ({ ...prev, [index]: size }))}
                            className={`px-3 py-1 text-sm border rounded ${
                              selectedSize[index] === size
                                ? 'border-cyan-400 bg-cyan-400/20 text-cyan-400'
                                : 'border-gray-600 text-gray-300 hover:border-gray-500'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleAddToCart(product, index)}
                        className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-black font-medium"
                      >
                        Add to Cart
                      </Button>
                      <Button
                        onClick={() =>
                          setExpandedProduct(expandedProduct === index ? null : index)
                        }
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                      >
                        {expandedProduct === index ? 'Less' : 'More'}
                      </Button>
                    </div>

                    {expandedProduct === index && (
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <p className="text-gray-300 text-sm mb-3">{product.details}</p>
                        <ul className="text-gray-400 text-xs space-y-1">
                          {product.featuresList.map((feature, featureIndex) => (
                            <li key={featureIndex}>• {feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 