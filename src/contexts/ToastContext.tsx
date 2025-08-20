'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import Toast, { ToastType } from '@/components/Toast'

interface ToastItem {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastContextType {
  showToast: (message: string, type: ToastType, duration?: number) => string
  hideToast: (id: string) => void
  showSuccess: (message: string, duration?: number) => string
  showError: (message: string, duration?: number) => string
  showInfo: (message: string, duration?: number) => string
  showLoading: (message: string) => string
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const showToast = useCallback((message: string, type: ToastType, duration?: number): string => {
    const id = Math.random().toString(36).substring(2, 15)
    const newToast: ToastItem = { id, message, type, duration }
    setToasts(prev => [...prev, newToast])
    return id
  }, [])

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const showSuccess = useCallback((message: string, duration?: number) => {
    return showToast(message, 'success', duration)
  }, [showToast])

  const showError = useCallback((message: string, duration?: number) => {
    return showToast(message, 'error', duration)
  }, [showToast])

  const showInfo = useCallback((message: string, duration?: number) => {
    return showToast(message, 'info', duration)
  }, [showToast])

  const showLoading = useCallback((message: string) => {
    return showToast(message, 'loading')
  }, [showToast])

  return (
    <ToastContext.Provider value={{ showToast, hideToast, showSuccess, showError, showInfo, showLoading }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => hideToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}