'use client'

import { useState } from 'react'
import { TaskFilters as Filters, Priority, Category } from '@/types'
import { Search, Filter, X } from 'lucide-react'

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

  const handleFilterChange = (key: keyof Filters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value === '' ? undefined : value
    })
  }

  const clearFilters = () => {
    onFiltersChange({})
    setShowAdvanced(false)
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 space-y-4">
      <div className="flex items-center space-x-4">
        {/* 搜索框 */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="搜索任务标题或描述..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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