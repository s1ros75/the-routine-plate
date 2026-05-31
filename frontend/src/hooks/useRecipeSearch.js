import { useState } from 'react'
import { searchByIngredients } from '../api/recipes'

export const useRecipeSearch = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [matchedRecipes, setMatchedRecipes] = useState([])
  const [count, setCount] = useState(0)

  const searchRecipes = async (ingredientIds) => {
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
