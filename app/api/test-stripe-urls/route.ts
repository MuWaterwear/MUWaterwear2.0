import { NextRequest, NextResponse } from 'next/server'
import { debugUrls, validateUrl } from '@/lib/url-utils'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing Stripe URL configuration...')
    
    // Get the formatted URLs
    const urls = debugUrls()
    
    // Test URL validity
    const testResults = {
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL
      },
      urls: urls,
      validation: {
        success: validateUrl(urls.success.replace('{CHECKOUT_SESSION_ID}', 'test_session')),
        cancel: validateUrl(urls.cancel),
        base: validateUrl(urls.base)
      },
      stripeCompatible: true
    }
    
    // Check if URLs are Stripe compatible
    if (!testResults.validation.success || !testResults.validation.cancel) {
      testResults.stripeCompatible = false
    }
    
    // Check for https requirement
    if (!urls.success.startsWith('https://') || !urls.cancel.startsWith('https://')) {
      testResults.stripeCompatible = false
    }
    
    console.log('✅ URL test results:', testResults)
    
    return NextResponse.json(testResults)
  } catch (error) {
    console.error('🚨 URL test failed:', error)
    return NextResponse.json({
      error: 'URL test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 