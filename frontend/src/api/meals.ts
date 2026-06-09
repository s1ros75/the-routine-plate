import client from './client'
import type { Meal, MealCreateInput, CalculateNutritionResponse, WeeklySummary } from '@/types'

export const getMeals = (): Promise<Meal[]> =>
  client.get<Meal[]>('/api/v1/meals').then(res => res.data)

export const createMeal = (data: MealCreateInput): Promise<Meal> =>
  client.post<Meal>('/api/v1/meals', { meal: data }).then(res => res.data)

export const calculateNutrition = (
  ingredientsList: Array<{ ingredient_id: number; amount_g: number }>
): Promise<CalculateNutritionResponse> =>
  client
    .post<CalculateNutritionResponse>('/api/v1/meals/calculate', { ingredients: ingredientsList })
    .then(res => res.data)

export const getWeeklySummary = (weekStart: string | null = null): Promise<WeeklySummary> => {
  const params = weekStart ? { week_start: weekStart } : {}
  return client.get<WeeklySummary>('/api/v1/meals/weekly_summary', { params }).then(res => res.data)
}
