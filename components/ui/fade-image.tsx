import OptimizedImage from './optimized-image'
import { ImageProps } from 'next/image'

interface FadeImageProps extends Omit<ImageProps, 'priority' | 'loading' | 'placeholder' | 'src'> {
  src: string
  priority?: boolean
  loading?: 'lazy' | 'eager'
  placeholder?: 'blur' | 'empty' | 'skeleton'
  size?: 'thumbnail' | 'small' | 'medium' | 'large' | 'hero'
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