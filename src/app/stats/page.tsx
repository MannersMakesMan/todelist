'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, BarChart3, PieChart, TrendingUp, Calendar } from 'lucide-react'
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  Legend
} from 'recharts'
import LoadingSpinner from '@/components/LoadingSpinner'

interface StatsData {
  overview: {
    total: number
    completed: number
    pending: number
    completionRate: number
  }
  charts: {
    priority: Array<{ name: string; value: number; priority: string }>
    category: Array<{ name: string; value: number; color: string }>
    weekTrend: Array<{ date: string; created: number; completed: number }>
    monthTrend: Array<{ date: string; created: number; completed: number }>
  }
  recent: {
    last7Days: { created: number; completed: number }
    last30Days: { created: number; completed: number }
  }
}

const PRIORITY_COLORS = {
  'LOW': '#9CA3AF',
  'MEDIUM': '#3B82F6',
  'HIGH': '#F59E0B',
  'URGENT': '#EF4444'
}

export default function StatsPage() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'week' | 'month'>('week')

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch('/api/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('加载统计数据失败:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner text="加载统计数据中..." />
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">加载统计数据失败</p>
          <Link href="/" className="text-blue-600 hover:text-blue-700 mt-2 inline-block">
            返回首页
          </Link>
        </div>
      </div>
    )
  }

  const priorityChartData = stats.charts.priority.map(item => ({
    ...item,
    fill: PRIORITY_COLORS[item.priority as keyof typeof PRIORITY_COLORS]
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面头部 */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              返回任务列表
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <span>数据统计看板</span>
          </h1>
          <p className="mt-2 text-gray-600">全面了解您的任务完成情况和趋势分析</p>
        </div>

        {/* 概览卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">总任务数</p>
                <p className="text-3xl font-bold text-gray-900">{stats.overview.total}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">已完成</p>
                <p className="text-3xl font-bold text-green-600">{stats.overview.completed}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">待完成</p>
                <p className="text-3xl font-bold text-blue-600">{stats.overview.pending}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">完成率</p>
                <p className="text-3xl font-bold text-purple-600">{stats.overview.completionRate}%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <PieChart className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* 图表区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 优先级分布 */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-medium text-gray-900 mb-4">优先级分布</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    dataKey="value"
                    data={priorityChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                  >
                    {priorityChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 分类分布 */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-medium text-gray-900 mb-4">分类分布</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.charts.category}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 任务趋势 */}
        <div className="bg-white rounded-lg p-6 shadow-sm border mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">任务趋势</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('week')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'week'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                本周
              </button>
              <button
                onClick={() => setActiveTab('month')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'month'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                本月
              </button>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activeTab === 'week' ? stats.charts.weekTrend : stats.charts.monthTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="created" 
                  stroke="#3B82F6" 
                  name="创建任务"
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#10B981" 
                  name="完成任务"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 最近活动统计 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center space-x-3 mb-4">
              <Calendar className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-medium text-gray-900">最近 7 天</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">创建任务</span>
                <span className="text-xl font-bold text-blue-600">{stats.recent.last7Days.created}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">完成任务</span>
                <span className="text-xl font-bold text-green-600">{stats.recent.last7Days.completed}</span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">完成率</span>
                  <span className="text-xl font-bold text-purple-600">
                    {stats.recent.last7Days.created > 0 
                      ? Math.round((stats.recent.last7Days.completed / stats.recent.last7Days.created) * 100)
                      : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center space-x-3 mb-4">
              <Calendar className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-medium text-gray-900">最近 30 天</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">创建任务</span>
                <span className="text-xl font-bold text-blue-600">{stats.recent.last30Days.created}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">完成任务</span>
                <span className="text-xl font-bold text-green-600">{stats.recent.last30Days.completed}</span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">完成率</span>
                  <span className="text-xl font-bold text-purple-600">
                    {stats.recent.last30Days.created > 0 
                      ? Math.round((stats.recent.last30Days.completed / stats.recent.last30Days.created) * 100)
                      : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}