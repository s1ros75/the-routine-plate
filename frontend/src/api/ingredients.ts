import client from './client'
import type { Ingredient, IngredientCreateInput } from '@/types'

export const getIngredients = (): Promise<Ingredient[]> =>
  client.get<Ingredient[]>('/api/v1/ingredients').then((res) => res.data)

export const getIngredient = (id: number): Promise<Ingredient> =>
  client.get<Ingredient>(`/api/v1/ingredients/${id}`).then((res) => res.data)

export const createIngredient = (data: IngredientCreateInput): Promise<Ingredient> =>
  client.post<Ingredient>('/api/v1/ingredients', { ingredient: data }).then((res) => res.data)
