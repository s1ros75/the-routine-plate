import client from './client';
export const getIngredients = () => client.get('/api/v1/ingredients').then(res => res.data);
export const getIngredient = (id) => client.get(`/api/v1/ingredients/${id}`).then(res => res.data);
export const createIngredient = (data) => client.post('/api/v1/ingredients', { ingredient: data }).then(res => res.data);
