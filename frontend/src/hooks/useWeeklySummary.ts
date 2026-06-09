import { useState, useEffect, useCallback } from 'react'
import { getWeeklySummary } from '../api/meals'
import type { WeeklySummary } from '@/types'

export const useWeeklySummary = (weekStart: string | null = null) => {
  const [data, setData] = useState<WeeklySummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await getWeeklySummary(weekStart)
      setData(result)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [weekStart])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}
