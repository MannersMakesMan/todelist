'use client'

import { useState, useEffect, useRef } from 'react'
import { TaskFilters as Filters, Priority, Category } from '@/types'
import { Search, Filter, X, Clock, History } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
import { useSearchHistory } from '@/hooks/useSearchHistory'

interface TaskFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  categories: Category[]
}

export default function TaskFilters({
  filters,
  onFiltersChange,
  categories
}: TaskFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [localSearch, setLocalSearch] = useState(filters.search || '')
  const [showSearchHistory, setShowSearchHistory] = useState(false)
  const debouncedSearch = useDebounce(localSearch, 500)
  const { searchHistory, addToHistory, clearHistory, removeFromHistory } = useSearchHistory()
  const searchRef = useRef<HTMLInputElement>(null)

  // 防抖搜索效果
  useEffect(() => {
    handleFilterChange('search', debouncedSearch)
    if (debouncedSearch && debouncedSearch !== filters.search) {
      addToHistory(debouncedSearch)
    }
  }, [debouncedSearch])

  const handleFilterChange = (key: keyof Filters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value === '' ? undefined : value
    })
  }

  const clearFilters = () => {
    setLocalSearch('')
    onFiltersChange({})
    setShowAdvanced(false)
  }

  const handleSearchSelect = (searchTerm: string) => {
    setLocalSearch(searchTerm)
    setShowSearchHistory(false)
    searchRef.current?.focus()
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 space-y-4">
      <div className="flex items-center space-x-4">
        {/* 搜索框 */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            ref={searchRef}
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onFocus={() => setShowSearchHistory(searchHistory.length > 0)}
            onBlur={() => setTimeout(() => setShowSearchHistory(false), 150)}
            placeholder="搜索任务标题或描述... (实时搜索带防抖)"
            className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchHistory.length > 0 && (
            <History 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600"
              onClick={() => setShowSearchHistory(!showSearchHistory)}
            />
          )}
          
          {/* 搜索历史下拉 */}
          {showSearchHistory && searchHistory.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
              <div className="p-2 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">搜索历史</span>
                <button
                  onClick={clearHistory}
                  className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  清空
                </button>
              </div>
              {searchHistory.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleSearchSelect(item)}
                >
                  <div className="flex items-center space-x-2">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-200">{item}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFromHistory(item)
                    }}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 高级筛选按钮 */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <Filter className="h-4 w-4" />
          <span>筛选</span>
        </button>

        {/* 清除筛选按钮 */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
          >
            <X className="h-4 w-4" />
            <span>清除</span>
          </button>
        )}
      </div>

      {/* 快速筛选按钮 */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleFilterChange('completed', filters.completed === false ? undefined : false)}
          className={`px-3 py-1 text-xs rounded-full transition-colors ${
            filters.completed === false
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          未完成
        </button>
        <button
          onClick={() => handleFilterChange('completed', filters.completed === true ? undefined : true)}
          className={`px-3 py-1 text-xs rounded-full transition-colors ${
            filters.completed === true
              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-700'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          已完成
        </button>
      </div>

      {/* 高级筛选面板 */}
      {showAdvanced && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                分类
              </label>
              <select
                value={filters.categoryId || ''}
                onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">所有分类</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                优先级
              </label>
              <select
                value={filters.priority || ''}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">所有优先级</option>
                <option value={Priority.LOW}>低</option>
                <option value={Priority.MEDIUM}>中</option>
                <option value={Priority.HIGH}>高</option>
                <option value={Priority.URGENT}>紧急</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}