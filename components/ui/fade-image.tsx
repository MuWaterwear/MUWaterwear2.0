import OptimizedImage from './optimized-image'

interface FadeImageProps {
  src: string
  alt: string
  size?: 'thumbnail' | 'small' | 'medium' | 'large' | 'hero'
  className?: string
  priority?: boolean
  placeholder?: 'blur' | 'empty' | 'skeleton'
  loading?: 'lazy' | 'eager'
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void
  onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void
  fallbackSrc?: string
  aspectRatio?: string
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  quality?: number
  fill?: boolean
  width?: number
  height?: number
  sizes?: string
  style?: React.CSSProperties
}

/**
 * FadeImage – Optimized image wrapper that provides lazy-loading with a soft fade-in.
 * Now uses OptimizedImage for better performance with WebP/AVIF support.
 * Ensures high-quality imagery guideline and perceived performance.
 */
export const FadeImage = ({
  src,
  alt,
  className,
  priority = false,
  loading = 'lazy',
  placeholder = 'skeleton',
  size = 'medium',
  ...props
}: FadeImageProps) => (
  <OptimizedImage
    src={src}
    alt={alt}
    className={`${className ?? ''} transition-opacity duration-300`}
    priority={priority}
    loading={loading}
    placeholder={placeholder}
    size={size}
    {...props}
  />
) 