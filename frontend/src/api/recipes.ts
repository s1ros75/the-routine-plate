import client from './client'
import type { Recipe, RecipeSearchResponse } from '@/types'

export const getRecipes = (): Promise<Recipe[]> =>
  client.get<Recipe[]>('/api/v1/recipes').then((res) => res.data)

export const getRecipe = (id: number): Promise<Recipe> =>
  client.get<Recipe>(`/api/v1/recipes/${id}`).then((res) => res.data)

export const searchByIngredients = (ingredientIds: number[]): Promise<RecipeSearchResponse> =>
  client
    .post<RecipeSearchResponse>('/api/v1/recipes/search', { ingredient_ids: ingredientIds })
    .then((res) => res.data)
