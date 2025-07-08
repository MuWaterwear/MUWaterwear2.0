import { NextRequest, NextResponse } from 'next/server'
import { diagnoseStripeSetup, stripeConfig } from '@/lib/stripe-config'

export async function GET(request: NextRequest) {
  // Only allow diagnostics in development or with proper authorization
  const isProduction = process.env.NODE_ENV === 'production'
  const authHeader = request.headers.get('authorization')
  
  if (isProduction && authHeader !== `Bearer ${process.env.STRIPE_DIAGNOSTIC_TOKEN}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    console.log('🔍 Starting Stripe diagnostics...')
    
    const diagnostics = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      checks: {
        envVars: {
          hasSecretKey: !!process.env.STRIPE_SECRET_KEY,
          hasPublishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
          hasBaseUrl: !!process.env.NEXT_PUBLIC_BASE_URL,
          secretKeyType: process.env.STRIPE_SECRET_KEY?.startsWith('sk_live_') ? 'live' : 
                         process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_') ? 'test' : 'invalid',
          publishableKeyType: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_live_') ? 'live' :
                              process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_test_') ? 'test' : 'invalid',
          baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
        },
        initialization: false,
        accountValidation: false,
        connectionTest: false,
        overallStatus: 'failed'
      },
      errors: [] as string[],
      warnings: [] as string[],
      recommendations: [] as string[]
    }

    // Check environment variables
    if (!diagnostics.checks.envVars.hasSecretKey) {
      diagnostics.errors.push('STRIPE_SECRET_KEY environment variable is missing')
    }
    
    if (!diagnostics.checks.envVars.hasPublishableKey) {
      diagnostics.errors.push('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable is missing')
    }
    
    if (!diagnostics.checks.envVars.hasBaseUrl) {
      diagnostics.errors.push('NEXT_PUBLIC_BASE_URL environment variable is missing')
    }

    // Check for key mismatch
    if (diagnostics.checks.envVars.secretKeyType !== diagnostics.checks.envVars.publishableKeyType) {
      diagnostics.errors.push('Stripe API key environment mismatch (mixing live and test keys)')
    }

    // Run comprehensive diagnostics
    if (diagnostics.errors.length === 0) {
      const config = stripeConfig
      
      // Test initialization
      diagnostics.checks.initialization = await config.initialize()
      if (!diagnostics.checks.initialization) {
        diagnostics.errors.push('Stripe initialization failed')
      }

      // Test account validation
      diagnostics.checks.accountValidation = await config.validateAccount()
      if (!diagnostics.checks.accountValidation) {
        diagnostics.errors.push('Stripe account validation failed')
      }

      // Test connection
      diagnostics.checks.connectionTest = await config.testConnection()
      if (!diagnostics.checks.connectionTest) {
        diagnostics.errors.push('Stripe connection test failed')
      }

      // Check for live mode considerations
      if (config.isLiveMode()) {
        diagnostics.warnings.push('Running in LIVE mode - ensure webhooks are configured')
        diagnostics.recommendations.push('Verify webhook endpoints are properly configured for production')
        diagnostics.recommendations.push('Ensure SSL certificates are valid for webhook endpoints')
      }
    }

    // Determine overall status
    if (diagnostics.errors.length === 0) {
      diagnostics.checks.overallStatus = 'passed'
    } else if (diagnostics.warnings.length > 0) {
      diagnostics.checks.overallStatus = 'warning'
    }

    // Add general recommendations
    if (diagnostics.checks.overallStatus === 'failed') {
      diagnostics.recommendations.push('Check server logs for detailed error information')
      diagnostics.recommendations.push('Verify Stripe dashboard for account status')
      diagnostics.recommendations.push('Ensure all environment variables are properly set')
    }

    return NextResponse.json(diagnostics)
  } catch (error) {
    console.error('🚨 Stripe diagnostics error:', error)
    return NextResponse.json({
      error: 'Diagnostic test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  // Quick connectivity test
  try {
    const { testType } = await request.json()
    
    if (testType === 'quick') {
      const hasKeys = !!(process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
      return NextResponse.json({ 
        status: hasKeys ? 'configured' : 'missing-keys',
        hasKeys,
        isLive: process.env.STRIPE_SECRET_KEY?.startsWith('sk_live_') || false
      })
    }
    
    return NextResponse.json({ error: 'Invalid test type' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Test failed' }, { status: 500 })
  }
} 