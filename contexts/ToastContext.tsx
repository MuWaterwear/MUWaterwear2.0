'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { Toast, ToastProps } from '@/components/ui/toast'

interface ToastContextType {
  toasts: ToastProps[]
  addToast: (toast: Omit<ToastProps, 'id'>) => string
  removeToast: (id: string) => void
  clearToasts: () => void
  showSuccess: (title: string, description?: string) => string
  showError: (title: string, description?: string) => string
  showWarning: (title: string, description?: string) => string
  showInfo: (title: string, description?: string) => string
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: React.ReactNode
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const generateId = () => `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  const addToast = useCallback((toast: Omit<ToastProps, 'id'>) => {
    const id = generateId()
    const newToast: ToastProps = {
      ...toast,
      id,
      duration: toast.duration ?? 5000
    }

    setToasts(prev => [...prev, newToast])

    // Auto-remove toast after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }

    return id
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const clearToasts = useCallback(() => {
    setToasts([])
  }, [])

  const showSuccess = useCallback((title: string, description?: string) => {
    return addToast({ title, description, type: 'success' })
  }, [addToast])

  const showError = useCallback((title: string, description?: string) => {
    return addToast({ title, description, type: 'error', duration: 7000 })
  }, [addToast])

  const showWarning = useCallback((title: string, description?: string) => {
    return addToast({ title, description, type: 'warning', duration: 6000 })
  }, [addToast])

  const showInfo = useCallback((title: string, description?: string) => {
    return addToast({ title, description, type: 'info' })
  }, [addToast])

  const value: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

interface ToastContainerProps {
  toasts: ToastProps[]
  onRemove: (id: string) => void
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-96 max-w-[calc(100vw-2rem)]">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  )
} 