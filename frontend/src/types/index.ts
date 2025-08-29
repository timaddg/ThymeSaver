export interface Ingredient {
  ingredient_id: number;
  user_id: number;
  name: string;
  quantity?: string;
  created_at?: string;
}

export interface ApiResponse {
  success: boolean;
  ingredients?: Ingredient[];
  ingredient?: Ingredient;
  error?: string;
  message?: string;
} 