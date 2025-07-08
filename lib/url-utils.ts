/**
 * URL utilities for Stripe integration
 */

export function validateUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function ensureHttpsScheme(url: string): string {
  if (!url) {
    return 'https://muwaterwear.com'
  }
  
  // If it already has a scheme, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  // Add https:// prefix
  return `https://${url}`
}

export function getStripeUrls() {
  const baseUrl = ensureHttpsScheme(process.env.NEXT_PUBLIC_BASE_URL || 'muwaterwear.com')
  
  const urls = {
    success: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel: `${baseUrl}`,
    base: baseUrl
  }
  
  // Validate URLs
  if (!validateUrl(urls.success.replace('{CHECKOUT_SESSION_ID}', 'test'))) {
    console.error('🚨 Invalid success URL:', urls.success)
  }
  
  if (!validateUrl(urls.cancel)) {
    console.error('🚨 Invalid cancel URL:', urls.cancel)
  }
  
  console.log('✅ Stripe URLs generated:', urls)
  return urls
}

export function debugUrls() {
  console.log('🔍 URL Configuration Debug:')
  console.log('  NEXT_PUBLIC_BASE_URL:', process.env.NEXT_PUBLIC_BASE_URL)
  console.log('  NODE_ENV:', process.env.NODE_ENV)
  
  const urls = getStripeUrls()
  console.log('  Generated URLs:', urls)
  
  // Test URL validity
  console.log('  URL Validation:')
  console.log('    Success URL valid:', validateUrl(urls.success.replace('{CHECKOUT_SESSION_ID}', 'test')))
  console.log('    Cancel URL valid:', validateUrl(urls.cancel))
  console.log('    Base URL valid:', validateUrl(urls.base))
  
  return urls
} 