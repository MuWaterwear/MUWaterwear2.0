'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import { handleError, ErrorType } from '@/lib/core/error-handling'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorId: string | null
  retryCount: number
}

/**
 * Error Boundary component that catches JavaScript errors anywhere in the child component tree
 */
export class ErrorBoundary extends Component<Props, State> {
  private maxRetries = 3

  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorId: null,
      retryCount: 0
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error using our error handling system
    const appError = handleError(error, ErrorType.UNKNOWN_ERROR, {
      logToConsole: true,
      logToService: true,
      showToUser: false // We'll show our own UI
    })

    this.setState({
      errorId: appError.id
    })

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Log additional React error info
    console.error('React Error Boundary caught an error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorBoundary: this.constructor.name
    })
  }

  handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorId: null,
        retryCount: prevState.retryCount + 1
      }))
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorId: null,
      retryCount: 0
    })
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 rounded-lg border border-slate-800 p-8 text-center">
            <div className="mb-6">
              <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                Oops! Something went wrong
              </h2>
              <p className="text-slate-400 mb-4">
                We encountered an unexpected error. Don't worry, our team has been notified.
              </p>
              
              {this.state.errorId && (
                <div className="bg-slate-800 rounded p-3 mb-4">
                  <p className="text-xs text-slate-500 mb-1">Error ID:</p>
                  <code className="text-xs text-cyan-400 font-mono">
                    {this.state.errorId}
                  </code>
                </div>
              )}

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left bg-slate-800 rounded p-3 mb-4">
                  <summary className="text-sm text-slate-400 cursor-pointer mb-2">
                    Error Details (Development)
                  </summary>
                  <pre className="text-xs text-red-400 overflow-auto">
                    {this.state.error.message}
                    {'\n\n'}
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>

            <div className="space-y-3">
              {this.state.retryCount < this.maxRetries && (
                <Button
                  onClick={this.handleRetry}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again ({this.maxRetries - this.state.retryCount} attempts left)
                </Button>
              )}

              <Button
                onClick={this.handleReset}
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                Reset Component
              </Button>

              <Button
                onClick={this.handleGoHome}
                variant="ghost"
                className="w-full text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <Home className="h-4 w-4 mr-2" />
                Go to Homepage
              </Button>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <p className="text-xs text-slate-500">
                If this problem persists, please contact{' '}
                <a 
                  href="mailto:support@muwaterwear.com" 
                  className="text-cyan-400 hover:text-cyan-300"
                >
                  support@muwaterwear.com
                </a>
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Higher-order component that wraps a component with error boundary
 */
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

/**
 * Specialized Error Boundary for checkout flow
 */
export const CheckoutErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary
    onError={(error, errorInfo) => {
      // Special handling for checkout errors
      handleError(error, ErrorType.CHECKOUT_ERROR, {
        logToService: true,
        showToUser: false
      })
    }}
    fallback={
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          Checkout Error
        </h3>
        <p className="text-red-600 mb-4">
          We encountered an issue during checkout. Please try again or contact support.
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          Refresh Page
        </Button>
      </div>
    }
  >
    {children}
  </ErrorBoundary>
)

/**
 * Specialized Error Boundary for cart operations
 */
export const CartErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary
    onError={(error, errorInfo) => {
      handleError(error, ErrorType.CART_ERROR, {
        logToService: true,
        showToUser: false
      })
    }}
    fallback={
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
        <AlertCircle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
        <p className="text-yellow-800 text-sm">
          Cart temporarily unavailable. Please refresh the page.
        </p>
      </div>
    }
  >
    {children}
  </ErrorBoundary>
) 