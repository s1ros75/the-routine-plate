export type Ingredient = {
  id: number
  name: string
  protein_per_100g: string
  fat_per_100g: string
  carbohydrate_per_100g: string
  sodium_per_100g: string
  calories_per_100g: string
  created_at: string
  updated_at: string
}

export type IngredientCreateInput = Omit<Ingredient, 'id' | 'created_at' | 'updated_at'>
