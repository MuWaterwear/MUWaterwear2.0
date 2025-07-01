/**
 * Comprehensive Error Handling System for MU Waterwear
 * Provides consistent error handling, logging, and user feedback
 */

export enum ErrorType {
  // Network and API errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  API_ERROR = 'API_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  
  // Authentication and authorization
  AUTH_ERROR = 'AUTH_ERROR',
  PERMISSION_ERROR = 'PERMISSION_ERROR',
  
  // Payment and checkout
  PAYMENT_ERROR = 'PAYMENT_ERROR',
  CHECKOUT_ERROR = 'CHECKOUT_ERROR',
  STRIPE_ERROR = 'STRIPE_ERROR',
  
  // Cart operations
  CART_ERROR = 'CART_ERROR',
  INVENTORY_ERROR = 'INVENTORY_ERROR',
  
  // Data validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  FORM_ERROR = 'FORM_ERROR',
  
  // Email and notifications
  EMAIL_ERROR = 'EMAIL_ERROR',
  NOTIFICATION_ERROR = 'NOTIFICATION_ERROR',
  
  // File and storage
  STORAGE_ERROR = 'STORAGE_ERROR',
  FILE_ERROR = 'FILE_ERROR',
  
  // General application errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  SERVER_ERROR = 'SERVER_ERROR'
}

export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface AppError {
  id: string
  type: ErrorType
  severity: ErrorSeverity
  message: string
  userMessage: string
  details?: any
  timestamp: number
  context?: {
    userId?: string
    sessionId?: string
    url?: string
    userAgent?: string
    action?: string
  }
  stack?: string
  retryable?: boolean
  retryCount?: number
  maxRetries?: number
}

export interface ErrorHandlerOptions {
  logToConsole?: boolean
  logToService?: boolean
  showToUser?: boolean
  retryable?: boolean
  maxRetries?: number
  onRetry?: () => void
  onMaxRetriesReached?: () => void
}

/**
 * Main error handler class
 */
export class ErrorHandler {
  private static instance: ErrorHandler
  private errors: AppError[] = []
  private maxStoredErrors = 100

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler()
    }
    return ErrorHandler.instance
  }

  /**
   * Handle an error with comprehensive logging and user feedback
   */
  handle(
    error: Error | AppError | any,
    type: ErrorType = ErrorType.UNKNOWN_ERROR,
    options: ErrorHandlerOptions = {}
  ): AppError {
    const appError = this.normalizeError(error, type)
    
    // Set options
    appError.retryable = options.retryable ?? this.isRetryableError(type)
    appError.maxRetries = options.maxRetries ?? 3

    // Store error
    this.storeError(appError)

    // Log error
    if (options.logToConsole !== false) {
      this.logToConsole(appError)
    }

    if (options.logToService) {
      this.logToService(appError)
    }

    // Show to user if needed
    if (options.showToUser !== false) {
      this.showToUser(appError)
    }

    return appError
  }

  /**
   * Normalize different error types into AppError format
   */
  private normalizeError(error: any, type: ErrorType): AppError {
    if (this.isAppError(error)) {
      return error
    }

    const errorId = this.generateErrorId()
    const timestamp = Date.now()

    // Handle different error sources
    if (error instanceof Error) {
      return {
        id: errorId,
        type,
        severity: this.getSeverityForType(type),
        message: error.message,
        userMessage: this.getUserMessage(type, error.message),
        timestamp,
        stack: error.stack,
        context: this.getContext()
      }
    }

    // Handle Stripe errors
    if (error?.type?.startsWith('card_') || error?.type?.startsWith('payment_')) {
      return {
        id: errorId,
        type: ErrorType.STRIPE_ERROR,
        severity: ErrorSeverity.HIGH,
        message: error.message || 'Payment processing failed',
        userMessage: this.getStripeUserMessage(error),
        details: error,
        timestamp,
        context: this.getContext()
      }
    }

    // Handle API response errors
    if (error?.response) {
      return {
        id: errorId,
        type: ErrorType.API_ERROR,
        severity: ErrorSeverity.MEDIUM,
        message: error.response.data?.message || 'API request failed',
        userMessage: this.getApiUserMessage(error.response.status),
        details: {
          status: error.response.status,
          data: error.response.data
        },
        timestamp,
        context: this.getContext()
      }
    }

    // Generic error
    return {
      id: errorId,
      type,
      severity: this.getSeverityForType(type),
      message: typeof error === 'string' ? error : 'An unexpected error occurred',
      userMessage: this.getUserMessage(type),
      details: error,
      timestamp,
      context: this.getContext()
    }
  }

  /**
   * Check if error is already an AppError
   */
  private isAppError(error: any): error is AppError {
    return error && typeof error === 'object' && 'id' in error && 'type' in error
  }

  /**
   * Generate unique error ID
   */
  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Get severity level for error type
   */
  private getSeverityForType(type: ErrorType): ErrorSeverity {
    const severityMap: Record<ErrorType, ErrorSeverity> = {
      [ErrorType.NETWORK_ERROR]: ErrorSeverity.MEDIUM,
      [ErrorType.API_ERROR]: ErrorSeverity.MEDIUM,
      [ErrorType.TIMEOUT_ERROR]: ErrorSeverity.MEDIUM,
      [ErrorType.AUTH_ERROR]: ErrorSeverity.HIGH,
      [ErrorType.PERMISSION_ERROR]: ErrorSeverity.HIGH,
      [ErrorType.PAYMENT_ERROR]: ErrorSeverity.CRITICAL,
      [ErrorType.CHECKOUT_ERROR]: ErrorSeverity.CRITICAL,
      [ErrorType.STRIPE_ERROR]: ErrorSeverity.CRITICAL,
      [ErrorType.CART_ERROR]: ErrorSeverity.MEDIUM,
      [ErrorType.INVENTORY_ERROR]: ErrorSeverity.MEDIUM,
      [ErrorType.VALIDATION_ERROR]: ErrorSeverity.LOW,
      [ErrorType.FORM_ERROR]: ErrorSeverity.LOW,
      [ErrorType.EMAIL_ERROR]: ErrorSeverity.MEDIUM,
      [ErrorType.NOTIFICATION_ERROR]: ErrorSeverity.LOW,
      [ErrorType.STORAGE_ERROR]: ErrorSeverity.MEDIUM,
      [ErrorType.FILE_ERROR]: ErrorSeverity.MEDIUM,
      [ErrorType.UNKNOWN_ERROR]: ErrorSeverity.MEDIUM,
      [ErrorType.SERVER_ERROR]: ErrorSeverity.HIGH
    }
    return severityMap[type] || ErrorSeverity.MEDIUM
  }

  /**
   * Get user-friendly error message
   */
  private getUserMessage(type: ErrorType, originalMessage?: string): string {
    const messageMap: Record<ErrorType, string> = {
      [ErrorType.NETWORK_ERROR]: 'Connection issue. Please check your internet and try again.',
      [ErrorType.API_ERROR]: 'Service temporarily unavailable. Please try again in a moment.',
      [ErrorType.TIMEOUT_ERROR]: 'Request timed out. Please try again.',
      [ErrorType.AUTH_ERROR]: 'Authentication failed. Please sign in again.',
      [ErrorType.PERMISSION_ERROR]: 'You don\'t have permission to perform this action.',
      [ErrorType.PAYMENT_ERROR]: 'Payment processing failed. Please check your payment details.',
      [ErrorType.CHECKOUT_ERROR]: 'Checkout failed. Please review your order and try again.',
      [ErrorType.STRIPE_ERROR]: 'Payment processing error. Please try a different payment method.',
      [ErrorType.CART_ERROR]: 'Cart operation failed. Please refresh and try again.',
      [ErrorType.INVENTORY_ERROR]: 'Item unavailable. Please check our latest inventory.',
      [ErrorType.VALIDATION_ERROR]: 'Please check your input and try again.',
      [ErrorType.FORM_ERROR]: 'Please correct the highlighted fields.',
      [ErrorType.EMAIL_ERROR]: 'Email delivery failed. We\'ll try again shortly.',
      [ErrorType.NOTIFICATION_ERROR]: 'Notification failed to send.',
      [ErrorType.STORAGE_ERROR]: 'Storage operation failed. Please try again.',
      [ErrorType.FILE_ERROR]: 'File operation failed. Please try again.',
      [ErrorType.UNKNOWN_ERROR]: 'Something went wrong. Please try again.',
      [ErrorType.SERVER_ERROR]: 'Server error. Our team has been notified.'
    }
    return messageMap[type] || 'An unexpected error occurred.'
  }

  /**
   * Get user-friendly Stripe error message
   */
  private getStripeUserMessage(stripeError: any): string {
    const code = stripeError.code || stripeError.type
    
    const stripeMessages: Record<string, string> = {
      'card_declined': 'Your card was declined. Please try a different payment method.',
      'expired_card': 'Your card has expired. Please use a different card.',
      'incorrect_cvc': 'Your card\'s security code is incorrect.',
      'insufficient_funds': 'Your card has insufficient funds.',
      'invalid_expiry_month': 'Your card\'s expiration month is invalid.',
      'invalid_expiry_year': 'Your card\'s expiration year is invalid.',
      'invalid_number': 'Your card number is invalid.',
      'processing_error': 'An error occurred while processing your card. Please try again.',
      'rate_limit': 'Too many requests. Please wait a moment and try again.'
    }

    return stripeMessages[code] || 'Payment processing failed. Please try again or use a different payment method.'
  }

  /**
   * Get user-friendly API error message based on status code
   */
  private getApiUserMessage(status: number): string {
    const statusMessages: Record<number, string> = {
      400: 'Invalid request. Please check your input.',
      401: 'Authentication required. Please sign in.',
      403: 'Access denied. You don\'t have permission.',
      404: 'Resource not found.',
      409: 'Conflict with existing data.',
      429: 'Too many requests. Please wait and try again.',
      500: 'Server error. Our team has been notified.',
      502: 'Service temporarily unavailable.',
      503: 'Service temporarily unavailable.',
      504: 'Request timed out. Please try again.'
    }

    return statusMessages[status] || 'Service error. Please try again.'
  }

  /**
   * Check if error type is retryable
   */
  private isRetryableError(type: ErrorType): boolean {
    const retryableTypes = [
      ErrorType.NETWORK_ERROR,
      ErrorType.TIMEOUT_ERROR,
      ErrorType.API_ERROR,
      ErrorType.EMAIL_ERROR,
      ErrorType.STORAGE_ERROR
    ]
    return retryableTypes.includes(type)
  }

  /**
   * Get current context information
   */
  private getContext() {
    if (typeof window === 'undefined') return {}

    return {
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    }
  }

  /**
   * Store error in memory (limited storage)
   */
  private storeError(error: AppError) {
    this.errors.unshift(error)
    if (this.errors.length > this.maxStoredErrors) {
      this.errors = this.errors.slice(0, this.maxStoredErrors)
    }
  }

  /**
   * Log error to console with proper formatting
   */
  private logToConsole(error: AppError) {
    const logLevel = this.getLogLevel(error.severity)
    const message = `[${error.type}] ${error.message}`
    
    console[logLevel](`🚨 Error ${error.id}:`, message)
    if (error.details) {
      console[logLevel]('Details:', error.details)
    }
    if (error.stack) {
      console[logLevel]('Stack:', error.stack)
    }
  }

  /**
   * Get appropriate console log level
   */
  private getLogLevel(severity: ErrorSeverity): 'log' | 'warn' | 'error' {
    switch (severity) {
      case ErrorSeverity.LOW:
        return 'log'
      case ErrorSeverity.MEDIUM:
        return 'warn'
      case ErrorSeverity.HIGH:
      case ErrorSeverity.CRITICAL:
        return 'error'
      default:
        return 'warn'
    }
  }

  /**
   * Log error to external service (placeholder for future implementation)
   */
  private async logToService(error: AppError) {
    // TODO: Implement logging to external service like Sentry, LogRocket, etc.
    // For now, just log to console in production
    if (process.env.NODE_ENV === 'production') {
      console.error('Production Error:', {
        id: error.id,
        type: error.type,
        message: error.message,
        severity: error.severity,
        context: error.context
      })
    }
  }

  /**
   * Show error to user (can be customized based on UI framework)
   */
  private showToUser(error: AppError) {
    // For now, we'll use a simple alert, but this should be replaced
    // with a proper toast/notification system
    if (typeof window !== 'undefined' && error.severity !== ErrorSeverity.LOW) {
      console.warn('User Error:', error.userMessage)
      // TODO: Integrate with toast notification system
    }
  }

  /**
   * Get all stored errors
   */
  getErrors(): AppError[] {
    return [...this.errors]
  }

  /**
   * Get errors by type
   */
  getErrorsByType(type: ErrorType): AppError[] {
    return this.errors.filter(error => error.type === type)
  }

  /**
   * Clear all stored errors
   */
  clearErrors() {
    this.errors = []
  }

  /**
   * Clear specific error by ID
   */
  clearError(errorId: string) {
    this.errors = this.errors.filter(error => error.id !== errorId)
  }
}

/**
 * Convenience function to handle errors
 */
export const handleError = (
  error: any,
  type: ErrorType = ErrorType.UNKNOWN_ERROR,
  options: ErrorHandlerOptions = {}
): AppError => {
  return ErrorHandler.getInstance().handle(error, type, options)
}

/**
 * Async wrapper that handles errors automatically
 */
export const withErrorHandling = async <T>(
  asyncFn: () => Promise<T>,
  errorType: ErrorType = ErrorType.UNKNOWN_ERROR,
  options: ErrorHandlerOptions = {}
): Promise<T | null> => {
  try {
    return await asyncFn()
  } catch (error) {
    handleError(error, errorType, options)
    return null
  }
}

/**
 * React hook for error handling (to be used in components)
 */
export const useErrorHandler = () => {
  const errorHandler = ErrorHandler.getInstance()

  return {
    handleError: (error: any, type: ErrorType, options?: ErrorHandlerOptions) => 
      errorHandler.handle(error, type, options),
    getErrors: () => errorHandler.getErrors(),
    clearErrors: () => errorHandler.clearErrors(),
    clearError: (id: string) => errorHandler.clearError(id)
  }
} 