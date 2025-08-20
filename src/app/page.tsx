'use client'

import { useState, useEffect } from 'react'
import { TaskWithCategory, TaskFilters, TaskFormData, Category } from '@/types'
import TaskCard from '@/components/TaskCard'
import TaskForm from '@/components/TaskForm'
import TaskFiltersComponent from '@/components/TaskFilters'
import LoadingSpinner from '@/components/LoadingSpinner'
import EmptyState from '@/components/EmptyState'
import ImportExportModal from '@/components/ImportExportModal'
import { Plus, List, BarChart3, Tag, Download, CheckSquare } from 'lucide-react'
import Link from 'next/link'
import BatchActionsBar from '@/components/BatchActionsBar'

export default function Home() {
  const [tasks, setTasks] = useState<TaskWithCategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [filters, setFilters] = useState<TaskFilters>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<TaskWithCategory | null>(null)
  const [isImportExportOpen, setIsImportExportOpen] = useState(false)
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [showBatchMode, setShowBatchMode] = useState(false)

  // 加载数据
  const loadTasks = async () => {
    try {
      const params = new URLSearchParams()
      if (filters.completed !== undefined) params.append('completed', String(filters.completed))
      if (filters.categoryId) params.append('categoryId', filters.categoryId)
      if (filters.priority) params.append('priority', filters.priority)
      if (filters.search) params.append('search', filters.search)

      const response = await fetch(`/api/tasks?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setTasks(data)
      }
    } catch (error) {
      console.error('加载任务失败:', error)
    }
  }

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('加载分类失败:', error)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      await Promise.all([loadTasks(), loadCategories()])
      setIsLoading(false)
    }
    loadData()
  }, [filters])

  // 任务操作
  const handleCreateTask = async (data: TaskFormData) => {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    if (response.ok) {
      await loadTasks()
    } else {
      throw new Error('创建任务失败')
    }
  }

  const handleUpdateTask = async (data: TaskFormData) => {
    if (!editingTask) return

    const response = await fetch(`/api/tasks/${editingTask.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    if (response.ok) {
      await loadTasks()
      setEditingTask(null)
    } else {
      throw new Error('更新任务失败')
    }
  }

  const handleToggleComplete = async (id: string, completed: boolean) => {
    // 乐观更新：立即更新UI
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, completed } : task
      )
    )

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed })
      })

      if (!response.ok) {
        // 如果请求失败，回滚状态
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === id ? { ...task, completed: !completed } : task
          )
        )
        console.error('更新任务状态失败')
      }
    } catch (error) {
      // 如果网络错误，回滚状态
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === id ? { ...task, completed: !completed } : task
        )
      )
      console.error('更新任务状态失败:', error)
    }
  }

  const handleDeleteTask = async (id: string) => {
    if (!confirm('确定要删除这个任务吗？')) return

    const response = await fetch(`/api/tasks/${id}`, {
      method: 'DELETE'
    })

    if (response.ok) {
      await loadTasks()
    }
  }

  // 批量操作函数
  const handleTaskSelect = (taskId: string, selected: boolean) => {
    if (selected) {
      setSelectedTasks([...selectedTasks, taskId])
    } else {
      setSelectedTasks(selectedTasks.filter(id => id !== taskId))
    }
  }

  const handleSelectAll = () => {
    setSelectedTasks(tasks.map(task => task.id))
  }

  const handleDeselectAll = () => {
    setSelectedTasks([])
  }

  const handleBatchDelete = async () => {
    if (!confirm(`确定要删除选中的 ${selectedTasks.length} 个任务吗？`)) return

    try {
      await Promise.all(
        selectedTasks.map(id => 
          fetch(`/api/tasks/${id}`, { method: 'DELETE' })
        )
      )
      await loadTasks()
      setSelectedTasks([])
    } catch (error) {
      console.error('批量删除失败:', error)
    }
  }

  const handleBatchComplete = async () => {
    try {
      await Promise.all(
        selectedTasks.map(id => 
          fetch(`/api/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: true })
          })
        )
      )
      await loadTasks()
      setSelectedTasks([])
    } catch (error) {
      console.error('批量完成失败:', error)
    }
  }

  const handleBatchUncomplete = async () => {
    try {
      await Promise.all(
        selectedTasks.map(id => 
          fetch(`/api/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: false })
          })
        )
      )
      await loadTasks()
      setSelectedTasks([])
    } catch (error) {
      console.error('批量取消完成失败:', error)
    }
  }

  // 统计数据
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    completionRate: tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面头部 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                <List className="h-8 w-8 text-blue-600" />
                <span>TodoList 任务管理</span>
              </h1>
              <p className="mt-2 text-gray-600">高效管理您的日常任务</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                onClick={() => setIsImportExportOpen(true)}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm"
              >
                <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">导入导出</span>
              </button>
              <Link
                href="/stats"
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm"
              >
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">数据统计</span>
              </Link>
              <Link
                href="/categories"
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm"
              >
                <Tag className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">管理分类</span>
              </Link>
              <button
                onClick={() => {
                  setShowBatchMode(!showBatchMode)
                  setSelectedTasks([])
                }}
                className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 border rounded-lg transition-colors text-xs sm:text-sm ${
                  showBatchMode 
                    ? 'bg-green-100 border-green-300 text-green-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <CheckSquare className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">{showBatchMode ? '退出批量' : '批量操作'}</span>
              </button>
              <button
                onClick={() => setIsTaskFormOpen(true)}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm"
              >
                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>新建任务</span>
              </button>
            </div>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">总任务</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="p-2 bg-gray-100 rounded-lg">
                  <List className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">待完成</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.pending}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Plus className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">已完成</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">完成率</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.completionRate}%</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 筛选器 */}
        <div className="mb-6">
          <TaskFiltersComponent
            filters={filters}
            onFiltersChange={setFilters}
            categories={categories}
          />
        </div>

        {/* 任务列表 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {isLoading ? (
            <LoadingSpinner text="加载任务中..." />
          ) : tasks.length === 0 ? (
            <EmptyState
              title="暂无任务"
              description="您还没有创建任何任务。点击上方按钮开始添加您的第一个任务吧！"
              actionLabel="创建第一个任务"
              onAction={() => setIsTaskFormOpen(true)}
            />
          ) : (
            <div className="divide-y divide-gray-100">
              {tasks.map((task) => (
                <div key={task.id} className="p-4">
                  <TaskCard
                    task={task}
                    onToggleComplete={handleToggleComplete}
                    onEdit={setEditingTask}
                    onDelete={handleDeleteTask}
                    showSelectBox={showBatchMode}
                    isSelected={selectedTasks.includes(task.id)}
                    onSelect={handleTaskSelect}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 批量操作工具栏 */}
      <BatchActionsBar
        selectedCount={selectedTasks.length}
        totalCount={tasks.length}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
        onBatchDelete={handleBatchDelete}
        onBatchComplete={handleBatchComplete}
        onBatchUncomplete={handleBatchUncomplete}
        isAllSelected={selectedTasks.length === tasks.length && tasks.length > 0}
        isVisible={showBatchMode && selectedTasks.length > 0}
      />

      {/* 任务表单弹窗 */}
      <TaskForm
        isOpen={isTaskFormOpen || !!editingTask}
        onClose={() => {
          setIsTaskFormOpen(false)
          setEditingTask(null)
        }}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        initialData={editingTask ? {
          ...editingTask,
          description: editingTask.description || undefined,
          categoryId: editingTask.categoryId || undefined
        } : undefined}
        categories={categories}
      />

      {/* 导入导出弹窗 */}
      <ImportExportModal
        isOpen={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
        onImportComplete={loadTasks}
      />
    </div>
  )
}
