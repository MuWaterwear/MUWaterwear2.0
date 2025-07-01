/**
 * Environment variable validation and type safety
 */

// List of required environment variables
const requiredEnvVars = [
  'MONGODB_URI',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'PRINTIFY_ACCESS_TOKEN',
  'PRINTIFY_SHOP_ID',
  'WEATHERAPI_KEY',
] as const

// List of optional environment variables
const optionalEnvVars = [
  'NEXT_PUBLIC_DEBUG',
  'RESEND_API_KEY',
  'OPENAI_API_KEY',
  'ANTHROPIC_API_KEY',
  'GOOGLE_ANALYTICS_ID',
  'NEXT_PUBLIC_VERCEL_URL',
  'VERCEL_URL',
] as const

// Type definitions for environment variables
type RequiredEnvVars = {
  [K in typeof requiredEnvVars[number]]: string
}

type OptionalEnvVars = {
  [K in typeof optionalEnvVars[number]]?: string
}

export type EnvVars = RequiredEnvVars & OptionalEnvVars

// Additional custom environment variables
interface CustomEnvVars {
  NODE_ENV: 'development' | 'production' | 'test'
  NEXT_PUBLIC_BASE_URL?: string
  NEXT_PUBLIC_WEBSITE_URL?: string
  NEXT_PUBLIC_DEBUG?: string
}

// Complete environment type
export type Environment = EnvVars & CustomEnvVars

/**
 * Validate that all required environment variables are present
 */
export function validateEnv(): void {
  const missingVars: string[] = []

  for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
      missingVars.push(varName)
    }
  }

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missingVars
        .map(v => `  - ${v}`)
        .join('\n')}\n\nPlease check your .env.local file.`
    )
  }
}

/**
 * Get typed environment variables
 */
export function getEnv(): Environment {
  // Validate on first call
  if (process.env.NODE_ENV !== 'test') {
    validateEnv()
  }

  return {
    // Required vars
    MONGODB_URI: process.env.MONGODB_URI!,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL!,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET!,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
    PRINTIFY_ACCESS_TOKEN: process.env.PRINTIFY_ACCESS_TOKEN!,
    PRINTIFY_SHOP_ID: process.env.PRINTIFY_SHOP_ID!,
    WEATHERAPI_KEY: process.env.WEATHERAPI_KEY!,
    
    // Optional vars
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID,
    NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
    VERCEL_URL: process.env.VERCEL_URL,
    
    // Custom vars
    NODE_ENV: (process.env.NODE_ENV as any) || 'development',
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_WEBSITE_URL: process.env.NEXT_PUBLIC_WEBSITE_URL,
    NEXT_PUBLIC_DEBUG: process.env.NEXT_PUBLIC_DEBUG,
  }
}

/**
 * Check if running in development mode
 */
export function isDev(): boolean {
  return getEnv().NODE_ENV === 'development'
}

/**
 * Check if running in production mode
 */
export function isProd(): boolean {
  return getEnv().NODE_ENV === 'production'
}

/**
 * Get a specific environment variable with type safety
 */
export function getEnvVar(key: keyof Environment): string | undefined {
  return process.env[key]
}

/**
 * Get a required environment variable (throws if missing)
 */
export function getRequiredEnvVar(key: typeof requiredEnvVars[number]): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Required environment variable ${key} is not set`)
  }
  return value
} 