export interface Ingredient {
  id: number;
  name: string;
  details?: string;
}

export interface ApiResponse {
  success: boolean;
  ingredients?: Ingredient[];
  ingredient?: Ingredient;
  error?: string;
  message?: string;
} 