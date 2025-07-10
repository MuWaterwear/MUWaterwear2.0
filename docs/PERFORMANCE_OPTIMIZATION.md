# Lake Pages Performance Optimization Guide

This guide explains the performance optimizations implemented to significantly improve the loading speed of lake pages and product images.

## Overview

The optimization strategy focuses on:
1. **Image Optimization**: WebP/AVIF conversion with multiple sizes
2. **Smart Preloading**: Critical image preloading for above-the-fold content
3. **Optimized Components**: Enhanced image components with lazy loading
4. **Product Data Optimization**: Pre-computed product display data
5. **Caching Strategy**: Efficient caching and memoization

## Key Improvements

### 1. Image Optimization System

#### Enhanced Image Optimization Script
- **Location**: `scripts/optimize-images.js`
- **Features**:
  - Converts images to WebP and AVIF formats
  - Generates multiple sizes (thumbnail, small, medium, large, hero)
  - Creates fallback images for older browsers
  - Generates a manifest file for fast lookups
  - Focuses on product images (ACCESSORIES, APPAREL, gear folders)

#### Usage:
```bash
node scripts/optimize-images.js
```

#### Generated Files:
- `public/images/optimized/[size]/[filename].webp` - WebP versions
- `public/images/optimized/[size]/[filename].avif` - AVIF versions (when supported)
- `public/images/optimized/[size]/[filename].jpg|png` - Fallback versions
- `public/images/optimized/manifest.json` - Image manifest for fast lookups

### 2. Optimized Image Components

#### OptimizedImage Component
- **Location**: `components/ui/optimized-image.tsx`
- **Features**:
  - Automatic WebP/AVIF support with PNG/JPEG fallbacks
  - Lazy loading with intersection observer
  - Multiple placeholder options (skeleton, blur, empty)
  - Responsive sizing with proper aspect ratios
  - Priority loading for above-the-fold images

#### Specialized Components:
- `ProductImage` - Pre-configured for product displays
- `HeroImage` - Optimized for hero sections
- `CriticalImage` - For above-the-fold content

#### Usage:
```tsx
import { ProductImage, HeroImage, CriticalImage } from '@/components/ui/optimized-image'

// For product displays
<ProductImage 
  src="/images/product.jpg" 
  alt="Product Name" 
  size="medium" 
/>

// For hero sections
<HeroImage 
  src="/images/hero.jpg" 
  alt="Hero Image" 
  priority 
/>

// For critical images
<CriticalImage 
  src="/images/critical.jpg" 
  alt="Critical Image" 
  size="large" 
/>
```

### 3. Image Preloading System

#### CriticalImagePreloader Component
- **Location**: `components/shared/ImagePreloader.tsx`
- **Features**:
  - Preloads hero images and icons with priority
  - Preloads first 6 product images
  - Uses optimized image paths from manifest
  - Fallback to original images when manifest unavailable

#### Usage:
```tsx
import { CriticalImagePreloader } from '@/components/shared/ImagePreloader'

<CriticalImagePreloader
  heroImage="/images/hero.jpg"
  iconImage="/images/icon.png"
  productImages={productImages}
/>
```

### 4. Product Data Optimization

#### Product Optimization Utilities
- **Location**: `lib/utils/product-optimization.ts`
- **Features**:
  - Pre-computes optimal display images for consistent rendering
  - Creates color-to-image mappings for faster lookups
  - Generates image preloads for different sizes
  - Memoization for expensive operations
  - Caching for repeated product processing

#### Key Functions:
```tsx
import { 
  optimizeProducts, 
  getCriticalImages, 
  getOptimizedProduct 
} from '@/lib/utils/product-optimization'

// Optimize array of products
const optimizedProducts = optimizeProducts(rawProducts)

// Get critical images for preloading
const criticalImages = getCriticalImages(products, 6)

// Get single optimized product with caching
const optimizedProduct = getOptimizedProduct(rawProduct)
```

### 5. Updated FadeImage Component

#### Enhanced FadeImage
- **Location**: `components/ui/fade-image.tsx`
- **Features**:
  - Now uses OptimizedImage internally
  - Maintains backward compatibility
  - Improved performance with WebP/AVIF support

## Implementation in Lake Pages

### Coeur d'Alene Page Example

```tsx
// Import optimized components and utilities
import { CriticalImagePreloader } from '@/components/shared/ImagePreloader'
import { HeroImage } from '@/components/ui/optimized-image'
import { optimizeProducts, getCriticalImages } from '@/lib/utils/product-optimization'

export default function CoeurDalenePage() {
  // Optimize products for better performance
  const allCdaProducts = optimizeProducts(rawAllCdaProducts)
  const criticalProductImages = getCriticalImages(allCdaProducts, 6)

  return (
    <div>
      {/* Preload critical images */}
      <CriticalImagePreloader
        heroImage={lakeInfo.heroImage}
        iconImage={lakeInfo.icon}
        productImages={criticalProductImages}
      />
      
      {/* Use optimized hero image */}
      <HeroImage
        src={lakeInfo.heroImage}
        alt="Lake Hero"
        priority
      />
      
      {/* Products now use optimized data */}
      {allCdaProducts.map(product => (
        <ProductCard 
          key={product.id}
          image={product.displayImage}
          hoverImage={product.hoverImage}
          // ... other props
        />
      ))}
    </div>
  )
}
```

## Performance Benefits

### Expected Improvements:
- **70-80% reduction** in image file sizes (WebP vs PNG)
- **90% reduction** in image file sizes (AVIF vs PNG)
- **50% faster** initial page load due to image preloading
- **40% faster** perceived performance with skeleton loading
- **30% reduction** in JavaScript processing time with optimized product data

### Metrics to Monitor:
- **Largest Contentful Paint (LCP)**: Should improve by 1-2 seconds
- **First Input Delay (FID)**: Should remain stable or improve
- **Cumulative Layout Shift (CLS)**: Should improve with proper aspect ratios
- **Total Blocking Time (TBT)**: Should improve with optimized data processing

## Next Steps

### 1. Apply to All Lake Pages
Update all lake pages to use the new optimization system:
- `app/detroit-lake/page.tsx`
- `app/flathead/page.tsx`
- `app/lake-tahoe/page.tsx`
- `app/lake-washington/page.tsx`
- `app/lindbergh/page.tsx`

### 2. Update Product Carousels
Enhance the ProductCarousel component:
- Use optimized product data
- Implement virtual scrolling for large product lists
- Add intersection observer for carousel items

### 3. Service Worker Caching
Implement service worker caching for optimized images:
- Cache WebP/AVIF versions
- Implement cache-first strategy for images
- Add background sync for new images

### 4. Performance Monitoring
Add performance monitoring:
- Web Vitals tracking
- Image loading metrics
- User experience analytics

## Troubleshooting

### Common Issues:

1. **Manifest not found**: Run `node scripts/optimize-images.js` first
2. **Images not loading**: Check if optimized images exist in correct directories
3. **TypeScript errors**: Ensure all imports are correct and types are up to date
4. **Performance not improving**: Clear browser cache and test with throttled network

### Debug Commands:
```bash
# Check if Sharp is installed
npm list sharp

# Run image optimization
node scripts/optimize-images.js

# Check manifest file
cat public/images/optimized/manifest.json

# Check optimized images
ls -la public/images/optimized/
```

## Contributing

When adding new images or products:
1. Add original images to appropriate directories
2. Run the optimization script
3. Update product data to use optimized structure
4. Test performance improvements
5. Update documentation if needed

## Browser Support

- **WebP**: Chrome 23+, Firefox 65+, Safari 14+, Edge 18+
- **AVIF**: Chrome 85+, Firefox 93+, Safari 16+
- **Fallback**: PNG/JPEG supported in all browsers

The system automatically provides fallbacks for older browsers. 