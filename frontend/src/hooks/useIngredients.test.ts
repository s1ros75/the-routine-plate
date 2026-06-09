import { renderHook, waitFor } from '@testing-library/react'
import { vi, type Mock } from 'vitest'
import { useIngredients } from './useIngredients'
import { getIngredients } from '@/api/ingredients'
import type { Ingredient } from '@/types'

vi.mock('@/api/ingredients')

const mockGetIngredients = getIngredients as Mock

const sampleIngredients: Ingredient[] = [
  {
    id: 1,
    name: '鶏むね肉',
    protein_per_100g: '23.3',
    fat_per_100g: '1.9',
    carbohydrate_per_100g: '0',
    sodium_per_100g: '0.1',
    calories_per_100g: '108',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
]

describe('useIngredients', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('初期状態で loading が true になる', () => {
    mockGetIngredients.mockReturnValue(new Promise(() => {}))
    const { result } = renderHook(() => useIngredients())
    expect(result.current.loading).toBe(true)
  })

  it('データ取得成功時に data 配列が設定される', async () => {
    mockGetIngredients.mockResolvedValue(sampleIngredients)
    const { result } = renderHook(() => useIngredients())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.data).toEqual(sampleIngredients)
    expect(result.current.error).toBeNull()
  })

  it('API エラー時に error 状態が設定される', async () => {
    mockGetIngredients.mockRejectedValue({
      response: { data: { error: 'サーバーエラー' } },
    })
    const { result } = renderHook(() => useIngredients())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBe('サーバーエラー')
    expect(result.current.data).toEqual([])
  })

  it('API エラーでレスポンスなし時に message フォールバックが使われる', async () => {
    mockGetIngredients.mockRejectedValue({ message: 'Network Error' })
    const { result } = renderHook(() => useIngredients())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBe('Network Error')
  })
})
