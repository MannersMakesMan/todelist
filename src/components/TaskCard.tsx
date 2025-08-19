'use client'

import { useState } from 'react'
import { TaskWithCategory } from '@/types'
import { formatDate, getPriorityColor, getPriorityText, cn } from '@/lib/utils'
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
      "bg-white rounded-lg shadow-sm border-l-4 p-4 transition-all duration-200 hover:shadow-md",
      task.completed ? "opacity-75 border-l-green-400" : "border-l-blue-400",
      isOverdue && "border-l-red-400"
    )}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <button
            onClick={handleToggleComplete}
            disabled={isLoading}
            className="mt-1 text-gray-400 hover:text-green-500 transition-colors disabled:opacity-50"
          >
            {task.completed ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <Circle className="h-5 w-5" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "text-sm font-medium text-gray-900",
              task.completed && "line-through text-gray-500"
            )}>
              {task.title}
            </h3>
            
            {task.description && (
              <p className={cn(
                "mt-1 text-sm text-gray-600",
                task.completed && "line-through text-gray-400"
              )}>
                {task.description}
              </p>
            )}

            <div className="flex items-center space-x-4 mt-2">
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
                  isOverdue ? "text-red-500" : "text-gray-500"
                )}>
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(task.dueDate)}</span>
                  {isOverdue && <Clock className="h-3 w-3 ml-1" />}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onEdit(task)}
            className="text-gray-400 hover:text-blue-500 transition-colors"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}