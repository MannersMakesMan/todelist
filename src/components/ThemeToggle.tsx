'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useState } from 'react'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const themes = [
    { key: 'light' as const, label: '浅色', icon: Sun },
    { key: 'dark' as const, label: '深色', icon: Moon },
    { key: 'system' as const, label: '跟随系统', icon: Monitor }
  ]

  const currentTheme = themes.find(t => t.key === theme) || themes[0]
  const CurrentIcon = currentTheme.icon

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <CurrentIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
        <span className="text-sm text-gray-700 dark:text-gray-200 hidden sm:inline">
          {currentTheme.label}
        </span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
            <div className="py-1">
              {themes.map((themeOption) => {
                const Icon = themeOption.icon
                return (
                  <button
                    key={themeOption.key}
                    onClick={() => {
                      setTheme(themeOption.key)
                      setIsOpen(false)
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      theme === themeOption.key 
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                        : 'text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{themeOption.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}