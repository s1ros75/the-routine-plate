import client from './client'

export const getMeals = () =>
  client.get('/api/v1/meals').then((res) => res.data)

export const createMeal = (data) =>
  client.post('/api/v1/meals', { meal: data }).then((res) => res.data)

export const calculateNutrition = (ingredientsList) =>
  client
    .post('/api/v1/meals/calculate', { ingredients: ingredientsList })
    .then((res) => res.data)

export const getWeeklySummary = (weekStart = null) => {
  const params = weekStart ? { week_start: weekStart } : {}
  return client.get('/api/v1/meals/weekly_summary', { params }).then((res) => res.data)
}
