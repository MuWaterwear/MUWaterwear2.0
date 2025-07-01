"use client"

import { useState } from "react"
import Image from "next/image"
import { Product } from "@/lib/features/apparel-products"

interface ExpandedImageModalProps {
  isOpen: boolean
  onClose: () => void
  currentImage: string | null
  product: Product | null
  currentImageIndex: number
  onNavigate: (direction: 'prev' | 'next') => void
}

export default function ExpandedImageModal({
  isOpen,
  onClose,
  currentImage,
  product,
  currentImageIndex,
  onNavigate
}: ExpandedImageModalProps) {
  const [imageZoom, setImageZoom] = useState(1)
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  if (!isOpen || !currentImage || !product) return null

  const handleZoomIn = () => {
    setImageZoom(prev => Math.min(prev + 0.5, 3))
  }

  const handleZoomOut = () => {
    setImageZoom(prev => {
      const newZoom = Math.max(prev - 0.5, 1)
      if (newZoom === 1) {
        setImagePosition({ x: 0, y: 0 })
      }
      return newZoom
    })
  }

  const handleZoomReset = () => {
    setImageZoom(1)
    setImagePosition({ x: 0, y: 0 })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (imageZoom > 1) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - imagePosition.x, y: e.clientY - imagePosition.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && imageZoom > 1) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const totalImages = product.images.length

  return (
    <div
      className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 max-sm:p-0"
      onClick={onClose}
    >
      <div className={`relative ${
        product.id === 'uv-mu-paddleboard' 
          ? 'max-w-7xl max-h-[98vh]' 
          : 'max-w-5xl max-h-[90vh] max-sm:max-w-full max-sm:max-h-full'
      }`}>
        <button
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-50 max-sm:top-4 max-sm:right-4 max-sm:bg-black/70 max-sm:p-2 max-sm:rounded-full"
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 max-sm:h-6 max-sm:w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className="sr-only">Close</span>
        </button>
        
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <div 
            className="relative overflow-hidden max-h-[90vh] flex items-center justify-center max-sm:max-h-screen max-sm:h-screen"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ cursor: imageZoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
          >
            <Image
              src={currentImage}
              alt="Expanded Product"
              width={1200}
              height={1200}
              className={`w-auto object-contain transition-transform duration-200 ${
                product.id === 'uv-mu-paddleboard' 
                  ? 'max-h-[98vh] min-h-[80vh]' 
                  : 'max-h-[90vh] max-sm:max-h-[80vh] max-sm:max-w-full'
              }`}
              style={{
                transform: `scale(${product.id === 'uv-mu-paddleboard' ? imageZoom * 1.5 : imageZoom}) translate(${imagePosition.x / imageZoom}px, ${imagePosition.y / imageZoom}px)`,
                transformOrigin: 'center center'
              }}
              draggable={false}
              priority
            />
          </div>

          {/* Navigation Controls */}
          {totalImages > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onNavigate('prev')
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-colors shadow-lg z-[110] border border-white/20 hover:border-white/40 max-sm:p-2 max-sm:left-2"
                aria-label="Previous image"
              >
                <svg className="w-6 h-6 max-sm:w-5 max-sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onNavigate('next')
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-colors shadow-lg z-[110] border border-white/20 hover:border-white/40 max-sm:p-2 max-sm:right-2"
                aria-label="Next image"
              >
                <svg className="w-6 h-6 max-sm:w-5 max-sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Image Counter and Dots */}
          {totalImages > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-[110] max-sm:bottom-20">
              <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm border border-white/20">
                {currentImageIndex + 1} of {totalImages}
              </div>
              
              <div className="flex gap-2 max-sm:gap-1.5">
                {Array.from({ length: totalImages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation()
                      onNavigate(index > currentImageIndex ? 'next' : 'prev')
                    }}
                    className={`w-3 h-3 rounded-full transition-all border-2 max-sm:w-2.5 max-sm:h-2.5 ${
                      currentImageIndex === index 
                        ? 'bg-white border-white' 
                        : 'bg-white/30 border-white/50 hover:bg-white/50'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Zoom Controls - Hidden on Mobile */}
          <div className="absolute top-4 right-4 flex-col gap-2 z-50 hidden sm:flex">
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleZoomIn()
              }}
              className="bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-colors shadow-lg"
              aria-label="Zoom in"
              disabled={imageZoom >= 3}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleZoomOut()
              }}
              className="bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-colors shadow-lg"
              aria-label="Zoom out"
              disabled={imageZoom <= 1}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
              </svg>
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleZoomReset()
              }}
              className="bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-colors shadow-lg"
              aria-label="Reset zoom"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          {/* Zoom Level Indicator */}
          {imageZoom > 1 && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm z-50">
              {Math.round(imageZoom * 100)}%
            </div>
          )}
        </div>
      </div>
    </div>
  )
}