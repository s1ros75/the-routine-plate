import { useState, useEffect } from 'react'
import { getIngredients } from '../api/ingredients'
import type { Ingredient } from '@/types'

export const useIngredients = () => {
  const [data, setData] = useState<Ingredient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  const retry = () => setTick((t) => t + 1)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)

    getIngredients()
      .then((ingredients) => {
        if (!cancelled) setData(ingredients)
      })
      .catch((err: { response?: { data?: { error?: string } }; message?: string }) => {
        if (!cancelled) {
          const message = err.response?.data?.error ?? err.message ?? '食材の取得に失敗しました'
          setError(message)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [tick])

  return { data, loading, error, retry }
}
