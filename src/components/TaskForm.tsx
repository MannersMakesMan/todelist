'use client'

import { useState, useEffect } from 'react'
import { TaskFormData, Priority, Category } from '@/types'
import { X, Sparkles, Wand2 } from 'lucide-react'

interface TaskFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: TaskFormData) => Promise<void>
  initialData?: Partial<TaskFormData>
  categories: Category[]
}

export default function TaskForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  categories
}: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    categoryId: '',
    priority: Priority.MEDIUM,
    dueDate: null
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false)
  const [isGeneratingCategory, setIsGeneratingCategory] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        categoryId: initialData.categoryId || '',
        priority: initialData.priority || Priority.MEDIUM,
        dueDate: initialData.dueDate || null
      })
    } else {
      setFormData({
        title: '',
        description: '',
        categoryId: '',
        priority: Priority.MEDIUM,
        dueDate: null
      })
    }
  }, [initialData, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    setIsSubmitting(true)
    try {
      await onSubmit({
        ...formData,
        categoryId: formData.categoryId || undefined
      })
      onClose()
    } catch (error) {
      console.error('提交失败:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGenerateDescription = async () => {
    if (!formData.title.trim()) {
      alert('请先输入任务标题')
      return
    }

    setIsGeneratingDescription(true)
    try {
      const response = await fetch('/api/ai/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: formData.title })
      })

      if (response.ok) {
        const data = await response.json()
        setFormData({ ...formData, description: data.description })
      } else {
        throw new Error('生成描述失败')
      }
    } catch (error) {
      console.error('生成描述失败:', error)
      alert('生成描述失败，请稍后重试')
    } finally {
      setIsGeneratingDescription(false)
    }
  }

  const handleSuggestCategory = async () => {
    if (!formData.title.trim()) {
      alert('请先输入任务标题')
      return
    }

    setIsGeneratingCategory(true)
    try {
      const response = await fetch('/api/ai/suggest-category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: formData.title,
          description: formData.description 
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.suggestedCategory) {
          if (data.suggestedCategory.isNew) {
            // 推荐创建新分类
            const confirmCreate = confirm(`AI推荐创建新分类："${data.suggestedCategory.name}"，是否创建？`)
            if (confirmCreate) {
              // 创建新分类
              const createResponse = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  name: data.suggestedCategory.name,
                  color: data.suggestedCategory.color
                })
              })

              if (createResponse.ok) {
                const newCategory = await createResponse.json()
                setFormData({ ...formData, categoryId: newCategory.id })
                // 重新加载页面以更新分类列表
                window.location.reload()
              }
            }
          } else {
            // 使用现有分类
            setFormData({ ...formData, categoryId: data.suggestedCategory.id })
          }
        } else {
          alert('未找到合适的分类推荐')
        }
      } else {
        throw new Error('分类推荐失败')
      }
    } catch (error) {
      console.error('分类推荐失败:', error)
      alert('分类推荐失败，请稍后重试')
    } finally {
      setIsGeneratingCategory(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {initialData ? '编辑任务' : '新建任务'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              任务标题 *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="输入任务标题"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                任务描述
              </label>
              <button
                type="button"
                onClick={handleGenerateDescription}
                disabled={isGeneratingDescription || !formData.title.trim()}
                className="flex items-center space-x-1 px-2 py-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="h-3 w-3" />
                <span>{isGeneratingDescription ? '生成中...' : 'AI生成'}</span>
              </button>
            </div>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="输入任务描述"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  分类
                </label>
                <button
                  type="button"
                  onClick={handleSuggestCategory}
                  disabled={isGeneratingCategory || !formData.title.trim()}
                  className="flex items-center space-x-1 px-2 py-1 text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Wand2 className="h-3 w-3" />
                  <span>{isGeneratingCategory ? '推荐中...' : 'AI推荐'}</span>
                </button>
              </div>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">无分类</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                优先级
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={Priority.LOW}>低</option>
                <option value={Priority.MEDIUM}>中</option>
                <option value={Priority.HIGH}>高</option>
                <option value={Priority.URGENT}>紧急</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              截止日期
            </label>
            <input
              type="date"
              value={formData.dueDate ? new Date(formData.dueDate).toISOString().split('T')[0] : ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                dueDate: e.target.value ? new Date(e.target.value) : null 
              })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.title.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? '保存中...' : (initialData ? '更新' : '创建')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}