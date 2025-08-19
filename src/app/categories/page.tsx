'use client'

import { useState, useEffect } from 'react'
import { Category, CategoryFormData } from '@/types'
import CategoryForm from '@/components/CategoryForm'
import LoadingSpinner from '@/components/LoadingSpinner'
import EmptyState from '@/components/EmptyState'
import { Plus, Edit2, Trash2, Tag, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('加载分类失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const handleCreateCategory = async (data: CategoryFormData) => {
    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    if (response.ok) {
      await loadCategories()
    } else {
      throw new Error('创建分类失败')
    }
  }

  const handleUpdateCategory = async (data: CategoryFormData) => {
    if (!editingCategory) return

    const response = await fetch(`/api/categories/${editingCategory.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    if (response.ok) {
      await loadCategories()
      setEditingCategory(null)
    } else {
      throw new Error('更新分类失败')
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('确定要删除这个分类吗？相关任务将取消分类关联。')) return

    const response = await fetch(`/api/categories/${id}`, {
      method: 'DELETE'
    })

    if (response.ok) {
      await loadCategories()
    } else {
      const error = await response.json()
      alert(error.error || '删除分类失败')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面头部 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-4 mb-2">
                <Link
                  href="/"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  返回任务列表
                </Link>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                <Tag className="h-8 w-8 text-blue-600" />
                <span>分类管理</span>
              </h1>
              <p className="mt-2 text-gray-600">管理您的任务分类，让任务更有条理</p>
            </div>
            <button
              onClick={() => setIsCategoryFormOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>新建分类</span>
            </button>
          </div>
        </div>

        {/* 分类列表 */}
        <div className="bg-white rounded-lg shadow-sm border">
          {isLoading ? (
            <LoadingSpinner text="加载分类中..." />
          ) : categories.length === 0 ? (
            <EmptyState
              title="暂无分类"
              description="您还没有创建任何分类。创建分类可以帮助您更好地组织任务。"
              actionLabel="创建第一个分类"
              onAction={() => setIsCategoryFormOpen(true)}
            />
          ) : (
            <div className="divide-y divide-gray-100">
              {categories.map((category) => (
                <div key={category.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {(category as any)._count?.tasks || 0} 个任务
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingCategory(category)}
                        className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 统计信息 */}
        {!isLoading && categories.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">统计信息</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-600">总分类数</p>
                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-600">总任务数</p>
                <p className="text-2xl font-bold text-blue-600">
                  {categories.reduce((total, cat) => total + ((cat as any)._count?.tasks || 0), 0)}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-600">平均任务数</p>
                <p className="text-2xl font-bold text-green-600">
                  {categories.length > 0 
                    ? Math.round(categories.reduce((total, cat) => total + ((cat as any)._count?.tasks || 0), 0) / categories.length)
                    : 0}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 分类表单弹窗 */}
      <CategoryForm
        isOpen={isCategoryFormOpen || !!editingCategory}
        onClose={() => {
          setIsCategoryFormOpen(false)
          setEditingCategory(null)
        }}
        onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
        initialData={editingCategory || undefined}
      />
    </div>
  )
}