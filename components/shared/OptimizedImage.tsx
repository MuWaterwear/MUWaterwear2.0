'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  sizes = '100vw',
  quality = 85,
  placeholder = 'blur',
  blurDataURL,
  onLoad
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  // Check if image path needs optimization
  const getOptimizedSrc = (originalSrc: string) => {
    // If already optimized, return as is
    if (originalSrc.includes('optimized-v2')) {
      return originalSrc;
    }

    // Check if WebP is supported
    const supportsWebP = typeof window !== 'undefined' && 
      window.document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;

    // Extract filename and path
    const pathParts = originalSrc.split('/');
    const filename = pathParts.pop();
    const nameWithoutExt = filename?.split('.')[0];
    const basePath = pathParts.join('/');

    // Determine appropriate size based on container
    const getResponsiveSize = () => {
      if (width && width <= 150) return 'thumbnail';
      if (width && width <= 400) return 'small';
      if (width && width <= 800) return 'medium';
      if (width && width <= 1200) return 'large';
      return 'xlarge';
    };

    const size = getResponsiveSize();
    const format = supportsWebP ? 'webp' : 'jpg';

    // Check if optimized version exists
    const optimizedPath = `${basePath}/optimized-v2/${nameWithoutExt}-${size}.${format}`;
    
    // Return optimized path if it exists, otherwise return original
    return optimizedPath;
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
        threshold: 0.01
      }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [priority]);

  // Generate blur data URL for placeholder
  const getBlurDataURL = () => {
    if (blurDataURL) return blurDataURL;
    
    // Generate a simple gradient blur placeholder
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8"%3E%3Cfilter id="b"%3E%3CfeGaussianBlur stdDeviation="1"/%3E%3C/filter%3E%3Crect width="8" height="8" fill="%23e0e0e0" filter="url(%23b)"/%3E%3C/svg%3E';
  };

  const optimizedSrc = getOptimizedSrc(src);

  // Handle loading state
  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  return (
    <div 
      ref={imageRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        width: width || '100%',
        height: height || 'auto',
        minHeight: height || 200
      }}
    >
      {/* Loading skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
      )}

      {/* Image */}
      {isInView && (
        <Image
          src={optimizedSrc}
          alt={alt}
          width={width || 1920}
          height={height || 1080}
          priority={priority}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          sizes={sizes}
          quality={quality}
          placeholder={placeholder}
          blurDataURL={getBlurDataURL()}
          onLoad={handleLoad}
          loading={priority ? 'eager' : 'lazy'}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      )}
    </div>
  );
} 