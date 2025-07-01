import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/core/utils'

interface BadgeProps extends React.ComponentProps<'div'> {
  size?: 'sm' | 'md' | 'lg'
  alt?: string
}

function Badge({ className, size = 'md', alt = 'Idaho State Silhouette', ...props }: BadgeProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  const imageSizes = {
    sm: { width: 24, height: 24 },
    md: { width: 32, height: 32 },
    lg: { width: 48, height: 48 },
  }

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-md overflow-hidden',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <Image
        src="/idaho-silhouette.png"
        alt={alt}
        width={imageSizes[size].width}
        height={imageSizes[size].height}
        className="object-cover w-full h-full"
        priority
      />
    </div>
  )
}

export { Badge }
