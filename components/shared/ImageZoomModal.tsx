'use client'

import { Button } from '@/components/ui/button'
import { X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import Image from 'next/image'

interface ImageZoomModalProps {
  isOpen: boolean
  imageSrc: string
  imageZoom: number
  imagePosition: { x: number; y: number }
  isDragging: boolean
  onClose: () => void
  onZoomIn: () => void
  onZoomOut: () => void
  onZoomReset: () => void
  onMouseDown: (e: React.MouseEvent) => void
  onMouseMove: (e: React.MouseEvent) => void
  onMouseUp: () => void
}

export default function ImageZoomModal({
  isOpen,
  imageSrc,
  imageZoom,
  imagePosition,
  isDragging,
  onClose,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onMouseDown,
  onMouseMove,
  onMouseUp,
}: ImageZoomModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="relative max-w-4xl max-h-full w-full h-full flex items-center justify-center">
        {/* Close Button */}
        <Button
          onClick={onClose}
          variant="outline"
          size="icon"
          className="absolute top-4 right-4 z-10 bg-black/50 border-gray-600 text-white hover:bg-black/70"
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Zoom Controls */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <Button
            onClick={onZoomIn}
            variant="outline"
            size="icon"
            className="bg-black/50 border-gray-600 text-white hover:bg-black/70"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            onClick={onZoomOut}
            variant="outline"
            size="icon"
            className="bg-black/50 border-gray-600 text-white hover:bg-black/70"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            onClick={onZoomReset}
            variant="outline"
            size="icon"
            className="bg-black/50 border-gray-600 text-white hover:bg-black/70"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* Image */}
        <div
          className="relative w-full h-full overflow-hidden rounded-lg cursor-move"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          style={{ cursor: isDragging ? 'grabbing' : imageZoom > 1 ? 'grab' : 'default' }}
        >
          <Image
            src={imageSrc}
            alt="Expanded product view"
            fill
            className="object-contain transition-transform duration-200"
            style={{
              transform: `scale(${imageZoom}) translate(${imagePosition.x / imageZoom}px, ${imagePosition.y / imageZoom}px)`,
              transformOrigin: 'center',
            }}
            priority
          />
        </div>

        {/* Zoom Level Indicator */}
        <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
          {Math.round(imageZoom * 100)}%
        </div>
      </div>
    </div>
  )
} 