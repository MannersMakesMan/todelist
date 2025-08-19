'use client'

import { useState } from 'react'
import { TaskWithCategory } from '@/types'
import { formatDate, formatDateTime, getPriorityColor, getPriorityText, cn } from '@/lib/utils'
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Edit2, 
  Trash2, 
  Calendar,
  Tag
} from 'lucide-react'

interface TaskCardProps {
  task: TaskWithCategory
  onToggleComplete: (id: string, completed: boolean) => void
  onEdit: (task: TaskWithCategory) => void
  onDelete: (id: string) => void
}

export default function TaskCard({
  task,
  onToggleComplete,
  onEdit,
  onDelete
}: TaskCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleToggleComplete = async () => {
    setIsLoading(true)
    try {
      await onToggleComplete(task.id, !task.completed)
    } finally {
      setIsLoading(false)
    }
  }

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed

  return (
    <div className={cn(
      "bg-white dark:bg-gray-800 rounded-lg shadow-sm border-l-4 p-3 sm:p-4 transition-all duration-200 hover:shadow-md",
      task.completed ? "opacity-75 border-l-green-400" : "border-l-blue-400",
      isOverdue && "border-l-red-400"
    )}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-2 sm:space-x-3 flex-1 min-w-0">
          <button
            onClick={handleToggleComplete}
            disabled={isLoading}
            className="mt-1 text-gray-400 hover:text-green-500 transition-colors disabled:opacity-50 flex-shrink-0"
          >
            {task.completed ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <Circle className="h-5 w-5" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "text-sm font-medium text-gray-900 dark:text-white break-words",
              task.completed && "line-through text-gray-500 dark:text-gray-400"
            )}>
              {task.title}
            </h3>
            
            {task.description && (
              <p className={cn(
                "mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-300 break-words",
                task.completed && "line-through text-gray-400 dark:text-gray-500"
              )}>
                {task.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2 mt-2">
              {/* 优先级 */}
              <span className={cn(
                "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                getPriorityColor(task.priority)
              )}>
                {getPriorityText(task.priority)}
              </span>

              {/* 分类 */}
              {task.category && (
                <div className="flex items-center space-x-1">
                  <Tag className="h-3 w-3 text-gray-400" />
                  <span 
                    className="text-xs px-2 py-1 rounded-full text-white"
                    style={{ backgroundColor: task.category.color }}
                  >
                    {task.category.name}
                  </span>
                </div>
              )}

              {/* 截止日期 */}
              {task.dueDate && (
                <div className={cn(
                  "flex items-center space-x-1 text-xs",
                  isOverdue ? "text-red-500" : "text-gray-500 dark:text-gray-400"
                )}>
                  <Calendar className="h-3 w-3" />
                  <span>截止: {formatDateTime(task.dueDate)}</span>
                  {isOverdue && <Clock className="h-3 w-3 ml-1" />}
                </div>
              )}

              {/* 创建时间 */}
              <div className="flex items-center space-x-1 text-xs text-gray-400 dark:text-gray-500">
                <Clock className="h-3 w-3" />
                <span>创建: {formatDateTime(task.createdAt)}</span>
              </div>

              {/* 更新时间 */}
              {task.updatedAt !== task.createdAt && (
                <div className="flex items-center space-x-1 text-xs text-gray-400 dark:text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>更新: {formatDateTime(task.updatedAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2 ml-2 sm:ml-4 flex-shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="p-1 sm:p-2 text-gray-400 hover:text-blue-500 transition-colors"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 sm:p-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}