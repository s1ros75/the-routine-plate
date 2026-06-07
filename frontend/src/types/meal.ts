import type { MealType, Nutrition } from './recipe'

// meal_json の実際のレスポンス構造に対応
// memo/user_id/created_at/updated_at は API から返らない
export type Meal = {
  id: number
  name: string
  meal_type: MealType
  scheduled_at: string
  protein_g: number
  sodium_g: number
  calories_kcal: number
}

export type MealCreateInput = {
  name: string
  meal_type: MealType
  scheduled_at: string
  memo?: string
  ingredients: Array<{
    ingredient_id: number
    amount_g: number
  }>
}

export type CalculateNutritionInput = {
  ingredients: Array<{
    ingredient_id: number
    amount_g: number
  }>
}

export type CalculateNutritionResponse = {
  nutrition: Nutrition
}

export type MealNutritionResponse = {
  meal_id: number
  meal_name: string
  nutrition: Nutrition
}
