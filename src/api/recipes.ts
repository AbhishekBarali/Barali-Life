// ============================================
// RECIPES API - CRUD operations for recipes
// ============================================

import { get, post, put, del, uploadFile } from './client';
import { Food } from './foods';

export interface RecipeIngredient {
    id: number;
    food_id: string;
    qty: number;
    unit: string | null;
    food: {
        label: string;
        emoji: string;
        protein: number;
        carbs: number;
        fat: number;
        calories: number;
    };
}

export interface Recipe {
    id: string;
    name: string;
    description: string | null;
    image_url: string | null;
    prep_time: number | null;
    cook_time: number | null;
    servings: number;
    instructions: string[];
    tags: string[];
    total_protein: number;
    total_carbs: number;
    total_fat: number;
    total_calories: number;
    ingredients?: RecipeIngredient[];
    created_at: string;
    updated_at: string;
}

export interface CreateRecipeData {
    name: string;
    description?: string;
    image_url?: string;
    prep_time?: number;
    cook_time?: number;
    servings?: number;
    instructions?: string[];
    tags?: string[];
    ingredients?: {
        food_id: string;
        qty: number;
        unit?: string;
    }[];
}

// Get all recipes with optional filters
export async function getRecipes(params?: {
    search?: string;
    tag?: string;
}) {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.tag) query.set('tag', params.tag);

    const queryString = query.toString();
    return get<Recipe[]>(`/recipes${queryString ? `?${queryString}` : ''}`);
}

// Get single recipe with ingredients
export async function getRecipe(id: string) {
    return get<Recipe>(`/recipes/${id}`);
}

// Create new recipe
export async function createRecipe(data: CreateRecipeData) {
    return post<Recipe>('/recipes', data);
}

// Update recipe
export async function updateRecipe(id: string, data: Partial<CreateRecipeData>) {
    return put<Recipe>(`/recipes/${id}`, data);
}

// Delete recipe
export async function deleteRecipe(id: string) {
    return del<{ success: boolean; message: string }>(`/recipes/${id}`);
}

// Upload recipe image
export async function uploadRecipeImage(file: File) {
    return uploadFile(file, 'recipe');
}
