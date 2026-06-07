import { useState } from 'react'
import { searchByIngredients } from '../api/recipes'
import type { Recipe } from '@/types'

export const useRecipeSearch = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<unknown>(null)
  const [matchedRecipes, setMatchedRecipes] = useState<Recipe[]>([])
  const [count, setCount] = useState(0)

  const searchRecipes = async (ingredientIds: number[]) => {
    setLoading(true)
    setError(null)
    try {
      const data = await searchByIngredients(ingredientIds)
      setMatchedRecipes(data.matched_recipes)
      setCount(data.count)
    } catch (err) {
      setError(err)
      setMatchedRecipes([])
      setCount(0)
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, matchedRecipes, count, searchRecipes }
}
