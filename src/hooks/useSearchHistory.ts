import { useState, useEffect } from 'react'

const SEARCH_HISTORY_KEY = 'todo-search-history'
const MAX_HISTORY_ITEMS = 10

export function useSearchHistory() {
  const [searchHistory, setSearchHistory] = useState<string[]>([])

  // 从localStorage加载搜索历史
  useEffect(() => {
    const saved = localStorage.getItem(SEARCH_HISTORY_KEY)
    if (saved) {
      setSearchHistory(JSON.parse(saved))
    }
  }, [])

  // 添加搜索项到历史
  const addToHistory = (searchTerm: string) => {
    if (!searchTerm.trim()) return

    const updated = [
      searchTerm,
      ...searchHistory.filter(item => item !== searchTerm)
    ].slice(0, MAX_HISTORY_ITEMS)

    setSearchHistory(updated)
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated))
  }

  // 清空搜索历史
  const clearHistory = () => {
    setSearchHistory([])
    localStorage.removeItem(SEARCH_HISTORY_KEY)
  }

  // 删除单个历史项
  const removeFromHistory = (searchTerm: string) => {
    const updated = searchHistory.filter(item => item !== searchTerm)
    setSearchHistory(updated)
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated))
  }

  return {
    searchHistory,
    addToHistory,
    clearHistory,
    removeFromHistory
  }
}