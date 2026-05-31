import client from './client'

export const getRecipes = () =>
  client.get('/api/v1/recipes').then((res) => res.data)

export const getRecipe = (id) =>
  client.get(`/api/v1/recipes/${id}`).then((res) => res.data)

export const searchByIngredients = (ingredientIds) =>
  client
    .post('/api/v1/recipes/search', { ingredient_ids: ingredientIds })
    .then((res) => res.data)
