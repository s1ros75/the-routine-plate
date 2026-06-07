export type Difficulty = 'easy' | 'normal' | 'hard'
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export type RecipeIngredient = {
  id: number
  name: string
  amount_g: number
}

// NutritionCalculator::Result が Float で返すため number
export type Nutrition = {
  protein_g: number
  fat_g: number
  carbohydrate_g: number
  sodium_g: number
  calories_kcal: number
}

export type Recipe = {
  id: number
  name: string
  description: string | null
  meal_type: MealType
  cooking_time_minutes: number | null
  difficulty: Difficulty
  instructions: string[]
  tags: string[]
  ingredients: RecipeIngredient[]
  nutrition: Nutrition
}

export type RecipeSearchResponse = {
  matched_recipes: Recipe[]
  count: number
}

export type RecipeSearchInput = {
  ingredient_ids: number[]
}
