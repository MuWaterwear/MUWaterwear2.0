import { NextResponse } from 'next/server'
import { stripeConfig, diagnoseStripeSetup } from '@/lib/stripe-config'
import { getStripeUrls, debugUrls } from '@/lib/url-utils'

export async function GET() {
  console.log('🏃 Running Stripe diagnostics...')
  
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
      IS_LOCAL: !process.env.VERCEL_ENV,
    },
    stripeKeys: {
      hasSecretKey: !!process.env.STRIPE_SECRET_KEY,
      hasPublishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      secretKeyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 8) || 'not set',
      publishableKeyPrefix: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.substring(0, 8) || 'not set',
      isLiveMode: process.env.STRIPE_SECRET_KEY?.startsWith('sk_live_') || false,
      keysMatch: (
        (process.env.STRIPE_SECRET_KEY?.startsWith('sk_live_') && 
         process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_live_')) ||
        (process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_') && 
         process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_test_'))
      ) || false,
    },
    urlConfiguration: {
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'not set',
      calculatedUrls: debugUrls(),
    },
    initialization: {
      success: false,
      error: null as string | null,
    },
    accountValidation: {
      success: false,
      error: null as string | null,
    },
    connectionTest: {
      success: false,
      error: null as string | null,
    },
  }

  // Test Stripe initialization
  try {
    const initSuccess = await stripeConfig.initialize()
    diagnostics.initialization.success = initSuccess
    if (!initSuccess) {
      diagnostics.initialization.error = 'Failed to initialize Stripe'
    }
  } catch (error) {
    diagnostics.initialization.success = false
    diagnostics.initialization.error = error instanceof Error ? error.message : 'Unknown error'
  }

  // Test account validation if initialized
  if (diagnostics.initialization.success) {
    try {
      const accountValid = await stripeConfig.validateAccount()
      diagnostics.accountValidation.success = accountValid
      if (!accountValid) {
        diagnostics.accountValidation.error = 'Account validation failed'
      }
    } catch (error) {
      diagnostics.accountValidation.success = false
      diagnostics.accountValidation.error = error instanceof Error ? error.message : 'Unknown error'
    }

    // Test connection
    try {
      const connectionOk = await stripeConfig.testConnection()
      diagnostics.connectionTest.success = connectionOk
      if (!connectionOk) {
        diagnostics.connectionTest.error = 'Connection test failed'
      }
    } catch (error) {
      diagnostics.connectionTest.success = false
      diagnostics.connectionTest.error = error instanceof Error ? error.message : 'Unknown error'
    }
  }

  // Determine overall status
  const allTestsPassed = 
    diagnostics.stripeKeys.hasSecretKey && 
    diagnostics.stripeKeys.hasPublishableKey && 
    diagnostics.stripeKeys.keysMatch &&
    diagnostics.initialization.success &&
    diagnostics.accountValidation.success &&
    diagnostics.connectionTest.success &&
    diagnostics.urlConfiguration.NEXT_PUBLIC_BASE_URL !== 'not set'

  return NextResponse.json({
    status: allTestsPassed ? 'healthy' : 'unhealthy',
    diagnostics,
    recommendations: generateRecommendations(diagnostics),
  })
}

function generateRecommendations(diagnostics: any): string[] {
  const recommendations: string[] = []

  if (!diagnostics.stripeKeys.hasSecretKey) {
    recommendations.push('Set STRIPE_SECRET_KEY environment variable')
  }

  if (!diagnostics.stripeKeys.hasPublishableKey) {
    recommendations.push('Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable')
  }

  if (!diagnostics.stripeKeys.keysMatch) {
    recommendations.push('Ensure both Stripe keys are from the same environment (both test or both live)')
  }

  if (diagnostics.urlConfiguration.NEXT_PUBLIC_BASE_URL === 'not set') {
    recommendations.push('Set NEXT_PUBLIC_BASE_URL environment variable (e.g., "http://localhost:3000" for local development or "https://muwaterwear.com" for production)')
  }

  if (!diagnostics.initialization.success) {
    recommendations.push('Check Stripe initialization errors in server logs')
  }

  if (!diagnostics.accountValidation.success) {
    recommendations.push('Ensure your Stripe account is properly configured and can accept charges')
  }

  return recommendations
} 