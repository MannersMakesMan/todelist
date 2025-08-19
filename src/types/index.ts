import { Task, Category, Priority } from '@prisma/client'

export type TaskWithCategory = Task & {
  category?: Category | null
}

export type CategoryWithTasks = Category & {
  tasks: Task[]
}

export { Task, Category, Priority }

export interface TaskFormData {
  title: string
  description?: string
  categoryId?: string
  priority: Priority
  dueDate?: Date | null
}

export interface CategoryFormData {
  name: string
  color: string
}

export interface TaskFilters {
  completed?: boolean
  categoryId?: string
  priority?: Priority
  search?: string
}