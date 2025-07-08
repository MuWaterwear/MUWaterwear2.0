import Stripe from 'stripe'
import { getStripeUrls } from './url-utils'

// Stripe configuration and diagnostics
export class StripeConfig {
  private static instance: StripeConfig
  private stripe: Stripe | null = null
  private isInitialized = false

  private constructor() {}

  static getInstance(): StripeConfig {
    if (!StripeConfig.instance) {
      StripeConfig.instance = new StripeConfig()
    }
    return StripeConfig.instance
  }

  async initialize(): Promise<boolean> {
    try {
      // Check required environment variables
      const secretKey = process.env.STRIPE_SECRET_KEY
      const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      
      if (!secretKey) {
        console.error('🚨 STRIPE_SECRET_KEY is not configured')
        return false
      }

      if (!publishableKey) {
        console.error('🚨 NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not configured')
        return false
      }

      // Determine if we're in live mode
      const isLiveMode = secretKey.startsWith('sk_live_') && publishableKey.startsWith('pk_live_')
      const isTestMode = secretKey.startsWith('sk_test_') && publishableKey.startsWith('pk_test_')

      if (!isLiveMode && !isTestMode) {
        console.error('🚨 Invalid Stripe API keys format')
        return false
      }

      // Check for key mismatch
      if ((secretKey.startsWith('sk_live_') && !publishableKey.startsWith('pk_live_')) ||
          (secretKey.startsWith('sk_test_') && !publishableKey.startsWith('pk_test_'))) {
        console.error('🚨 Stripe API key mismatch: secret and publishable keys are from different environments')
        return false
      }

      // Initialize Stripe with production-optimized settings
      this.stripe = new Stripe(secretKey, {
        apiVersion: '2025-05-28.basil',
        typescript: true,
        ...(isLiveMode && {
          // Enable priority routing for live mode
          stripeAccount: undefined, // Use default account
          timeout: 10000, // 10 second timeout for production
          maxNetworkRetries: 3, // Retry failed requests
        })
      })

      console.log(`✅ Stripe initialized successfully in ${isLiveMode ? 'LIVE' : 'TEST'} mode`)
      this.isInitialized = true
      return true
    } catch (error) {
      console.error('🚨 Failed to initialize Stripe:', error)
      return false
    }
  }

  getStripe(): Stripe | null {
    if (!this.isInitialized) {
      console.error('🚨 Stripe not initialized. Call initialize() first.')
      return null
    }
    return this.stripe
  }

  async validateAccount(): Promise<boolean> {
    if (!this.stripe) {
      console.error('🚨 Stripe not initialized')
      return false
    }

    try {
      const account = await this.stripe.accounts.retrieve()
      console.log('✅ Stripe account validated:', {
        id: account.id,
        country: account.country,
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled,
        requirements: account.requirements?.currently_due?.length || 0
      })
      
      if (!account.charges_enabled) {
        console.error('🚨 Stripe account cannot accept charges')
        return false
      }

      return true
    } catch (error) {
      console.error('🚨 Stripe account validation failed:', error)
      return false
    }
  }

  async createCheckoutSession(params: Stripe.Checkout.SessionCreateParams): Promise<Stripe.Checkout.Session | null> {
    if (!this.stripe) {
      console.error('🚨 Stripe not initialized')
      return null
    }

    try {
      // Get properly formatted URLs for Stripe
      const urls = getStripeUrls()

      // Add production-specific configurations
      const enhancedParams: Stripe.Checkout.SessionCreateParams = {
        ...params,
        // Ensure proper success/cancel URLs
        success_url: params.success_url || urls.success,
        cancel_url: params.cancel_url || urls.cancel,
        // Enable automatic tax calculation
        automatic_tax: {
          enabled: true,
        },
        // Set proper customer creation
        customer_creation: 'always',
        // Enable billing address collection
        billing_address_collection: 'required',
        // Set shipping address collection for US/CA
        shipping_address_collection: {
          allowed_countries: ['US', 'CA'],
        },
        // Add metadata for tracking
        metadata: {
          ...params.metadata,
          created_at: new Date().toISOString(),
          source: 'muwaterwear-web',
        }
      }

      const session = await this.stripe.checkout.sessions.create(enhancedParams)
      console.log('✅ Checkout session created:', session.id)
      return session
    } catch (error) {
      console.error('🚨 Failed to create checkout session:', error)
      return null
    }
  }

  isLiveMode(): boolean {
    const secretKey = process.env.STRIPE_SECRET_KEY
    return secretKey?.startsWith('sk_live_') || false
  }

  async testConnection(): Promise<boolean> {
    if (!this.stripe) {
      console.error('🚨 Stripe not initialized')
      return false
    }

    try {
      await this.stripe.accounts.retrieve()
      console.log('✅ Stripe connection test successful')
      return true
    } catch (error) {
      console.error('🚨 Stripe connection test failed:', error)
      return false
    }
  }
}

// Export singleton instance
export const stripeConfig = StripeConfig.getInstance()

// Diagnostic function for troubleshooting
export async function diagnoseStripeSetup() {
  console.log('🔍 Running Stripe diagnostics...')
  
  const config = StripeConfig.getInstance()
  
  // Test initialization
  const initialized = await config.initialize()
  if (!initialized) {
    console.error('❌ Stripe initialization failed')
    return false
  }
  
  // Test account validation
  const accountValid = await config.validateAccount()
  if (!accountValid) {
    console.error('❌ Stripe account validation failed')
    return false
  }
  
  // Test connection
  const connectionOk = await config.testConnection()
  if (!connectionOk) {
    console.error('❌ Stripe connection test failed')
    return false
  }
  
  console.log('✅ All Stripe diagnostics passed')
  return true
} 