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
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
      <div className="flex items-center space-x-4">
        {/* 选中状态显示 */}
        <div className="flex items-center space-x-2">
          <button
            onClick={isAllSelected ? onDeselectAll : onSelectAll}
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
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
          <span className="text-sm text-gray-600">
            已选择 {selectedCount}/{totalCount} 项
          </span>
        </div>

        <div className="h-4 border-l border-gray-300"></div>

        {/* 批量操作按钮 */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onBatchComplete}
            className="flex items-center space-x-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-sm"
          >
            <CheckCircle className="h-4 w-4" />
            <span>标记完成</span>
          </button>

          <button
            onClick={onBatchUncomplete}
            className="flex items-center space-x-1 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition-colors text-sm"
          >
            <X className="h-4 w-4" />
            <span>取消完成</span>
          </button>

          <button
            onClick={onBatchDelete}
            className="flex items-center space-x-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
          >
            <Trash2 className="h-4 w-4" />
            <span>批量删除</span>
          </button>
        </div>

        <button
          onClick={onDeselectAll}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}