'use client'

import { useState, useRef } from 'react'
import { X, Upload, Download, FileText, Table, Code } from 'lucide-react'
import { parseCSV, parseExcel, exportTasks, ImportTask } from '@/lib/import-export'

interface ImportExportModalProps {
  isOpen: boolean
  onClose: () => void
  onImportComplete: () => void
}

export default function ImportExportModal({
  isOpen,
  onClose,
  onImportComplete
}: ImportExportModalProps) {
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('export')
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState<string>('')
  const [importPreview, setImportPreview] = useState<ImportTask[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleClose = () => {
    setActiveTab('export')
    setIsProcessing(false)
    setMessage('')
    setImportPreview([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onClose()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsProcessing(true)
    setMessage('')

    try {
      let tasks: ImportTask[] = []
      
      if (file.name.endsWith('.csv')) {
        tasks = await parseCSV(file)
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        tasks = await parseExcel(file)
      } else {
        throw new Error('不支持的文件格式。请选择CSV或Excel文件。')
      }

      if (tasks.length === 0) {
        throw new Error('文件中没有找到有效的任务数据')
      }

      setImportPreview(tasks.slice(0, 5)) // 只显示前5条预览
      setMessage(`找到 ${tasks.length} 条任务数据`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '文件解析失败')
      setImportPreview([])
    } finally {
      setIsProcessing(false)
    }
  }

  const handleImport = async () => {
    if (!fileInputRef.current?.files?.[0]) return

    setIsProcessing(true)
    try {
      const file = fileInputRef.current.files[0]
      let tasks: ImportTask[] = []

      if (file.name.endsWith('.csv')) {
        tasks = await parseCSV(file)
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        tasks = await parseExcel(file)
      }

      const response = await fetch('/api/tasks/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks })
      })

      if (response.ok) {
        const result = await response.json()
        setMessage(`导入完成：成功 ${result.success} 条，失败 ${result.failed} 条`)
        
        if (result.errors.length > 0) {
          setMessage(prev => prev + `\n错误详情：\n${result.errors.join('\n')}`)
        }

        if (result.success > 0) {
          onImportComplete()
        }
      } else {
        const error = await response.json()
        setMessage(error.error || '导入失败')
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '导入失败')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleExport = async (format: 'csv' | 'excel' | 'json') => {
    setIsProcessing(true)
    try {
      const result = await exportTasks(format)
      setMessage(result.message)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '导出失败')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">数据导入导出</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* 标签页 */}
          <div className="flex space-x-1 mb-6">
            <button
              onClick={() => setActiveTab('export')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'export'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Download className="h-4 w-4 inline mr-2" />
              导出数据
            </button>
            <button
              onClick={() => setActiveTab('import')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'import'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Upload className="h-4 w-4 inline mr-2" />
              导入数据
            </button>
          </div>

          {/* 导出面板 */}
          {activeTab === 'export' && (
            <div className="space-y-4">
              <p className="text-gray-600">选择导出格式：</p>
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => handleExport('csv')}
                  disabled={isProcessing}
                  className="flex flex-col items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FileText className="h-8 w-8 text-green-600 mb-2" />
                  <span className="text-sm font-medium">CSV</span>
                  <span className="text-xs text-gray-500">兼容性最佳</span>
                </button>
                <button
                  onClick={() => handleExport('excel')}
                  disabled={isProcessing}
                  className="flex flex-col items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Table className="h-8 w-8 text-blue-600 mb-2" />
                  <span className="text-sm font-medium">Excel</span>
                  <span className="text-xs text-gray-500">功能丰富</span>
                </button>
                <button
                  onClick={() => handleExport('json')}
                  disabled={isProcessing}
                  className="flex flex-col items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Code className="h-8 w-8 text-purple-600 mb-2" />
                  <span className="text-sm font-medium">JSON</span>
                  <span className="text-xs text-gray-500">程序友好</span>
                </button>
              </div>
            </div>
          )}

          {/* 导入面板 */}
          {activeTab === 'import' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  选择文件（支持 CSV、Excel 格式）
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              {importPreview.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">数据预览（前5条）：</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-xs border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-2 py-1">标题</th>
                          <th className="border border-gray-300 px-2 py-1">描述</th>
                          <th className="border border-gray-300 px-2 py-1">状态</th>
                          <th className="border border-gray-300 px-2 py-1">优先级</th>
                          <th className="border border-gray-300 px-2 py-1">分类</th>
                        </tr>
                      </thead>
                      <tbody>
                        {importPreview.map((task, index) => (
                          <tr key={index}>
                            <td className="border border-gray-300 px-2 py-1">{task.title}</td>
                            <td className="border border-gray-300 px-2 py-1">{task.description || '-'}</td>
                            <td className="border border-gray-300 px-2 py-1">{task.status || '-'}</td>
                            <td className="border border-gray-300 px-2 py-1">{task.priority || '-'}</td>
                            <td className="border border-gray-300 px-2 py-1">{task.category || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button
                    onClick={handleImport}
                    disabled={isProcessing}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? '导入中...' : '确认导入'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 消息显示 */}
          {message && (
            <div className={`mt-4 p-3 rounded-md text-sm whitespace-pre-line ${
              message.includes('失败') || message.includes('错误')
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              {message}
            </div>
          )}

          {/* 说明 */}
          <div className="mt-6 text-xs text-gray-500 space-y-1">
            <p><strong>导入说明：</strong></p>
            <p>• 支持的列名：标题/title、描述/description、状态/status、优先级/priority、分类/category、截止日期/dueDate</p>
            <p>• 标题为必填项，其他字段可选</p>
            <p>• 状态支持：已完成/completed、未完成</p>
            <p>• 优先级支持：低/low、中/medium、高/high、紧急/urgent</p>
          </div>
        </div>
      </div>
    </div>
  )
}