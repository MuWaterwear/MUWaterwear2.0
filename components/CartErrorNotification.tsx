'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, X, RotateCcw } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

export default function CartErrorNotification() {
  const { error, isLoading, lastAction, clearError, retryLastAction } = useCart()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (error) {
      setIsVisible(true)
    }
  }, [error])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => clearError(), 300) // Allow animation to complete
  }

  const handleRetry = async () => {
    await retryLastAction()
  }

  if (!error || !isVisible) return null

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-from-top">
      <div className="bg-red-500 text-white rounded-lg shadow-lg p-4 max-w-sm border border-red-400">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-200 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">Cart Error</p>
            <p className="text-xs text-red-100 mt-1 break-words">{error.message}</p>
            {error.type === 'storage' && (
              <p className="text-xs text-red-200 mt-1">
                This might be due to browser storage limits or private browsing mode.
              </p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="text-red-200 hover:text-white p-1 -mr-1 -mt-1"
            aria-label="Close error notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-2 mt-3">
          <button
            onClick={handleRetry}
            disabled={isLoading}
            className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-red-700 disabled:opacity-50 rounded text-xs font-medium transition-colors"
            aria-label="Retry last action"
          >
            <RotateCcw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Retrying...' : 'Retry'}
          </button>
          <button
            onClick={handleClose}
            className="px-3 py-1 bg-transparent hover:bg-red-600 rounded text-xs transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  )
}

// Add the animation styles to globals.css
const animationStyles = `
@keyframes slide-in-from-top {
  0% {
    opacity: 0;
    transform: translateY(-100%) translateX(0);
  }
  100% {
    opacity: 1;
    transform: translateY(0) translateX(0);
  }
}

.animate-slide-in-from-top {
  animation: slide-in-from-top 0.3s ease-out;
}
`

// Export styles to be added to globals.css
export { animationStyles }
