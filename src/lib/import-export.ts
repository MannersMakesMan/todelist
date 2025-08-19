import Papa from 'papaparse'
import * as XLSX from 'xlsx'

export interface ImportTask {
  title: string
  description?: string
  status?: string
  priority?: string
  category?: string
  dueDate?: string
  completed?: boolean
}

export function parseCSV(file: File): Promise<ImportTask[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      encoding: 'UTF-8',
      complete: (results) => {
        try {
          const tasks: ImportTask[] = results.data.map((row: any) => ({
            title: row['标题'] || row['title'] || row['Title'] || '',
            description: row['描述'] || row['description'] || row['Description'] || '',
            status: row['状态'] || row['status'] || row['Status'] || '',
            priority: row['优先级'] || row['priority'] || row['Priority'] || '',
            category: row['分类'] || row['category'] || row['Category'] || '',
            dueDate: row['截止日期'] || row['dueDate'] || row['Due Date'] || '',
            completed: row['completed'] === 'true' || row['completed'] === true
          }))
          resolve(tasks.filter(task => task.title.trim()))
        } catch (error) {
          reject(new Error('CSV解析失败'))
        }
      },
      error: (error) => {
        reject(new Error(`CSV解析错误: ${error.message}`))
      }
    })
  })
}

export function parseExcel(file: File): Promise<ImportTask[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 })
        
        if (jsonData.length < 2) {
          reject(new Error('Excel文件格式错误'))
          return
        }
        
        const headers = jsonData[0] as string[]
        const rows = jsonData.slice(1) as any[][]
        
        const tasks: ImportTask[] = rows.map(row => {
          const task: ImportTask = { title: '' }
          
          headers.forEach((header, index) => {
            const value = row[index]?.toString() || ''
            
            if (header === '标题' || header === 'title' || header === 'Title') {
              task.title = value
            } else if (header === '描述' || header === 'description' || header === 'Description') {
              task.description = value
            } else if (header === '状态' || header === 'status' || header === 'Status') {
              task.status = value
            } else if (header === '优先级' || header === 'priority' || header === 'Priority') {
              task.priority = value
            } else if (header === '分类' || header === 'category' || header === 'Category') {
              task.category = value
            } else if (header === '截止日期' || header === 'dueDate' || header === 'Due Date') {
              task.dueDate = value
            }
          })
          
          return task
        })
        
        resolve(tasks.filter(task => task.title.trim()))
      } catch (error) {
        reject(new Error('Excel解析失败'))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('文件读取失败'))
    }
    
    reader.readAsArrayBuffer(file)
  })
}

export async function exportTasks(format: 'csv' | 'excel' | 'json' = 'csv') {
  try {
    if (format === 'excel') {
      // 对于Excel导出，我们先获取JSON数据然后在前端处理
      const response = await fetch('/api/tasks/export?format=json')
      if (!response.ok) throw new Error('导出失败')
      
      const { data } = await response.json()
      
      const worksheet = XLSX.utils.json_to_sheet(data)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, '任务列表')
      
      const fileName = `tasks-${new Date().toISOString().split('T')[0]}.xlsx`
      XLSX.writeFile(workbook, fileName)
      
      return { success: true, message: 'Excel文件已下载' }
    } else {
      // CSV和JSON直接从API下载
      const response = await fetch(`/api/tasks/export?format=${format}`)
      if (!response.ok) throw new Error('导出失败')
      
      if (format === 'json') {
        const data = await response.json()
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `tasks-${new Date().toISOString().split('T')[0]}.json`
        a.click()
        URL.revokeObjectURL(url)
      } else {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `tasks-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        URL.revokeObjectURL(url)
      }
      
      return { success: true, message: '文件已下载' }
    }
  } catch (error) {
    return { 
      success: false, 
      message: error instanceof Error ? error.message : '导出失败' 
    }
  }
}