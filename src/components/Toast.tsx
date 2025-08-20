'use client'

import { useEffect, useState } from 'react'
import { X, CheckCircle, AlertCircle, Info, Loader2 } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info' | 'loading'

interface ToastProps {
  message: string
  type: ToastType
  duration?: number
  onClose: () => void
}

export default function Toast({ message, type, duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (type === 'loading') return // loading toast 不自动消失

    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // 等待动画完成
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose, type])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />
      case 'loading':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'info':
        return 'bg-blue-50 border-blue-200'
      case 'loading':
        return 'bg-blue-50 border-blue-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-800'
      case 'error':
        return 'text-red-800'
      case 'info':
        return 'text-blue-800'
      case 'loading':
        return 'text-blue-800'
      default:
        return 'text-gray-800'
    }
  }

  return (
    <div className={`transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className={`flex items-center space-x-3 p-4 rounded-lg border shadow-lg max-w-md ${
        getBackgroundColor()
      }`}>
        {getIcon()}
        <span className={`flex-1 text-sm font-medium ${getTextColor()}`}>
          {message}
        </span>
        {type !== 'loading' && (
          <button
            onClick={() => {
              setIsVisible(false)
              setTimeout(onClose, 300)
            }}
            className={`${getTextColor()} hover:opacity-70`}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}