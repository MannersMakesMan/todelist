'use client'

import { CheckSquare, Square, Trash2, CheckCircle, X } from 'lucide-react'

interface BatchActionsBarProps {
  selectedCount: number
  totalCount: number
  onSelectAll: () => void
  onDeselectAll: () => void
  onBatchDelete: () => void
  onBatchComplete: () => void
  onBatchUncomplete: () => void
  isAllSelected: boolean
  isVisible: boolean
}

export default function BatchActionsBar({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onBatchDelete,
  onBatchComplete,
  onBatchUncomplete,
  isAllSelected,
  isVisible
}: BatchActionsBarProps) {
  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-50">
      <div className="flex items-center space-x-4">
        {/* 选中状态显示 */}
        <div className="flex items-center space-x-2">
          <button
            onClick={isAllSelected ? onDeselectAll : onSelectAll}
            className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            {isAllSelected ? (
              <CheckSquare className="h-5 w-5" />
            ) : (
              <Square className="h-5 w-5" />
            )}
            <span className="text-sm font-medium">
              {isAllSelected ? '取消全选' : '全选'}
            </span>
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            已选择 {selectedCount}/{totalCount} 项
          </span>
        </div>

        <div className="h-4 border-l border-gray-300 dark:border-gray-600"></div>

        {/* 批量操作按钮 */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onBatchComplete}
            className="flex items-center space-x-1 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-md hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors text-sm"
          >
            <CheckCircle className="h-4 w-4" />
            <span>标记完成</span>
          </button>

          <button
            onClick={onBatchUncomplete}
            className="flex items-center space-x-1 px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-md hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors text-sm"
          >
            <X className="h-4 w-4" />
            <span>取消完成</span>
          </button>

          <button
            onClick={onBatchDelete}
            className="flex items-center space-x-1 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors text-sm"
          >
            <Trash2 className="h-4 w-4" />
            <span>批量删除</span>
          </button>
        </div>

        <button
          onClick={onDeselectAll}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}