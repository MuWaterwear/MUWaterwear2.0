// SEO optimization utilities for MU Waterwear
import { Metadata } from 'next'

interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  canonical?: string
  ogImage?: string
  noIndex?: boolean
  structuredData?: object
}

interface ProductSEO {
  name: string
  description: string
  price: number
  currency: string
  availability: 'InStock' | 'OutOfStock' | 'PreOrder'
  images: string[]
  category: string
  brand: string
  sku?: string
  gtin?: string
}

class SEOManager {
  private baseUrl: string
  private siteName: string
  private defaultImage: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://muwaterwear.com'
    this.siteName = 'MU Waterwear'
    this.defaultImage = `${this.baseUrl}/images/og-default.jpg`
  }

  // Generate optimized metadata for pages
  generateMetadata(config: SEOConfig): Metadata {
    const {
      title,
      description,
      keywords = [],
      canonical,
      ogImage = this.defaultImage,
      noIndex = false,
      structuredData,
    } = config

    const fullTitle = title.includes(this.siteName) ? title : `${title} | ${this.siteName}`
    const canonicalUrl = canonical || this.baseUrl

    const metadata: Metadata = {
      title: fullTitle,
      description,
      keywords: keywords.join(', '),
      robots: noIndex ? 'noindex, nofollow' : 'index, follow',
      alternates: {
        canonical: canonicalUrl,
      },

      // Open Graph
      openGraph: {
        title: fullTitle,
        description,
        url: canonicalUrl,
        siteName: this.siteName,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        locale: 'en_US',
        type: 'website',
      },

      // Twitter Card
      twitter: {
        card: 'summary_large_image',
        title: fullTitle,
        description,
        images: [ogImage],
        creator: '@muwaterwear',
      },

      // Additional meta tags
      other: {
        'theme-color': '#06b6d4', // cyan-400
        'msapplication-TileColor': '#06b6d4',
        'apple-mobile-web-app-capable': 'yes',
        'apple-mobile-web-app-status-bar-style': 'default',
        ...(structuredData ? { 'ld+json': JSON.stringify(structuredData) } : {}),
      },
    }

    return metadata
  }

  // Generate structured data for products
  generateProductStructuredData(product: ProductSEO): object {
    return {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.images,
      brand: {
        '@type': 'Brand',
        name: product.brand,
      },
      category: product.category,
      sku: product.sku,
      gtin: product.gtin,
      offers: {
        '@type': 'Offer',
        url: this.baseUrl,
        priceCurrency: product.currency,
        price: product.price,
        priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        availability: `https://schema.org/${product.availability}`,
        seller: {
          '@type': 'Organization',
          name: this.siteName,
        },
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        reviewCount: '127',
      },
    }
  }

  // Generate structured data for organization
  generateOrganizationStructuredData(): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: this.siteName,
      description:
        'Premium water sports gear and apparel for Pacific Northwest and Mountain West water warriors.',
      url: this.baseUrl,
      logo: `${this.baseUrl}/images/logo.png`,
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+1-555-0123',
        contactType: 'customer service',
        email: 'info@muwaterwear.com',
      },
      sameAs: [
        'https://instagram.com/muwaterwear',
        'https://facebook.com/muwaterwear',
        'https://twitter.com/muwaterwear',
      ],
    }
  }

  // Generate structured data for breadcrumbs
  generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: `${this.baseUrl}${item.url}`,
      })),
    }
  }

  // Generate FAQ structured data
  generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    }
  }

  // Generate local business structured data
  generateLocalBusinessStructuredData(): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: this.siteName,
      description: 'Premium water sports gear and apparel',
      url: this.baseUrl,
      telephone: '+1-555-0123',
      email: 'info@muwaterwear.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '123 Lake Shore Drive',
        addressLocality: 'Seattle',
        addressRegion: 'WA',
        postalCode: '98101',
        addressCountry: 'US',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '47.6062',
        longitude: '-122.3321',
      },
      openingHours: ['Mo-Fr 09:00-18:00', 'Sa 10:00-16:00'],
      priceRange: '$',
      servedCuisine: [],
      acceptsReservations: false,
    }
  }

  // Optimize images for SEO
  optimizeImageForSEO(src: string, alt: string, width?: number, height?: number) {
    return {
      src,
      alt,
      width: width || 800,
      height: height || 600,
      loading: 'lazy' as const,
      sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    }
  }

  // Generate canonical URL
  generateCanonicalUrl(path: string): string {
    return `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`
  }

  // Extract and optimize keywords
  extractKeywords(content: string, baseKeywords: string[] = []): string[] {
    const commonWords = [
      'the',
      'and',
      'or',
      'but',
      'in',
      'on',
      'at',
      'to',
      'for',
      'of',
      'with',
      'by',
    ]
    const words = content
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.includes(word))

    const wordCount = words.reduce(
      (acc, word) => {
        acc[word] = (acc[word] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    const topWords = Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word)

    return [...new Set([...baseKeywords, ...topWords])]
  }

  // Generate sitemap data
  generateSitemapData(
    urls: Array<{ url: string; lastModified?: Date; priority?: number }>
  ): string {
    const sitemapUrls = urls
      .map(
        ({ url, lastModified = new Date(), priority = 0.5 }) => `
      <url>
        <loc>${this.baseUrl}${url}</loc>
        <lastmod>${lastModified.toISOString().split('T')[0]}</lastmod>
        <priority>${priority}</priority>
      </url>
    `
      )
      .join('')

    return `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${sitemapUrls}
      </urlset>
    `
  }

  // Generate robots.txt content
  generateRobotsTxt(): string {
    return `User-agent: *
Allow: /

User-agent: Googlebot
Allow: /

Sitemap: ${this.baseUrl}/sitemap.xml

# Block access to admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /private/

# Allow specific paths for SEO
Allow: /api/images/
Allow: /_next/static/
`
  }
}

// Export singleton instance
export const seoManager = new SEOManager()

// Common SEO configurations
export const commonSEOConfigs = {
  home: {
    title: 'MU Waterwear - Premium Water Sports Gear & Apparel',
    description:
      'Built for the water. Forged for legends. Premium gear and apparel for Pacific Northwest and Mountain West water warriors. Shop board shorts, tees, hats, and more.',
    keywords: [
      'water sports',
      'swimwear',
      'board shorts',
      'lake gear',
      'premium apparel',
      'tahoe',
      'pacific northwest',
      'mountain west',
    ],
  },

  products: {
    title: 'Premium Water Sports Products',
    description:
      'Discover our collection of premium water sports gear and apparel. From board shorts to beanies, built for legends.',
    keywords: ['products', 'water sports gear', 'apparel', 'swimwear', 'accessories'],
  },

  about: {
    title: 'About MU Waterwear - Built for Water, Forged for Legends',
    description:
      "Learn about MU Waterwear's mission to create premium water sports gear for Pacific Northwest and Mountain West adventurers.",
    keywords: ['about', 'company', 'mission', 'water sports', 'premium gear'],
  },

  success: {
    title: 'Order Confirmed - Thank You',
    description:
      'Your MU Waterwear order has been confirmed. Thank you for choosing premium water sports gear.',
    keywords: ['order confirmation', 'thank you', 'success'],
    noIndex: true,
  },
}

// Utility functions
export function generatePageMetadata(
  page: keyof typeof commonSEOConfigs,
  overrides: Partial<SEOConfig> = {}
): Metadata {
  const config = { ...commonSEOConfigs[page], ...overrides }
  return seoManager.generateMetadata(config)
}

export function generateProductMetadata(
  product: ProductSEO,
  overrides: Partial<SEOConfig> = {}
): Metadata {
  const structuredData = seoManager.generateProductStructuredData(product)
  const config: SEOConfig = {
    title: `${product.name} - Premium Water Sports Gear`,
    description: `${product.description} Shop premium water sports gear at MU Waterwear. $${product.price}.`,
    keywords: [
      product.name.toLowerCase(),
      product.category.toLowerCase(),
      'water sports',
      'premium gear',
    ],
    structuredData,
    ...overrides,
  }

  return seoManager.generateMetadata(config)
}
