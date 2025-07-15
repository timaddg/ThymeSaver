import axios from 'axios';
import { Ingredient, ApiResponse } from '../types';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Handler to be set by AuthContext for logging out
let logoutHandler: (() => void) | null = null;
export function setLogoutHandler(handler: () => void) {
  logoutHandler = handler;
}

// Add a response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      if (logoutHandler) logoutHandler();
    }
    return Promise.reject(error);
  }
);

export const ingredientApi = {
  // Get all ingredients
  getAll: async (): Promise<Ingredient[]> => {
    const response = await api.get<ApiResponse>('/ingredients');
    return response.data.ingredients || [];
  },

  // Add a new ingredient
  add: async (ingredient: { user_id: number; name: string; quantity?: string }) => {
    const response = await axios.post('/api/ingredients', ingredient);
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