import axios from 'axios';
import { Ingredient, ApiResponse } from '../types';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const ingredientApi = {
  // Get all ingredients
  getAll: async (): Promise<Ingredient[]> => {
    const response = await api.get<ApiResponse>('/ingredients');
    return response.data.ingredients || [];
  },

  // Add a new ingredient
  add: async (ingredient: { name: string; details?: string }): Promise<Ingredient> => {
    const response = await api.post<ApiResponse>('/ingredients', ingredient);
    if (!response.data.ingredient) {
      throw new Error(response.data.error || 'Failed to add ingredient');
    }
    return response.data.ingredient;
  },

  // Delete an ingredient
  delete: async (id: number): Promise<void> => {
    const response = await api.delete<ApiResponse>(`/ingredients/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to delete ingredient');
    }
  },
}; 