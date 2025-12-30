// ============================================
// FOODS API - CRUD operations for foods
// ============================================

import { get, post, put, del, uploadFile } from './client';

export interface Food {
    id: string;
    label: string;
    emoji: string;
    qty: number;
    unit: string;
    grams: number | null;
    tags: string[];
    protein: number;
    carbs: number;
    fat: number;
    calories: number;
    image_url: string | null;
    is_custom: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateFoodData {
    label: string;
    emoji?: string;
    qty?: number;
    unit?: string;
    grams?: number;
    tags?: string[];
    protein?: number;
    carbs?: number;
    fat?: number;
    calories?: number;
    image_url?: string;
}

// Get all foods with optional filters
export async function getFoods(params?: {
    search?: string;
    tag?: string;
    custom_only?: boolean;
}) {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.tag) query.set('tag', params.tag);
    if (params?.custom_only) query.set('custom_only', 'true');

    const queryString = query.toString();
    return get<Food[]>(`/foods${queryString ? `?${queryString}` : ''}`);
}

// Get single food by ID
export async function getFood(id: string) {
    return get<Food>(`/foods/${id}`);
}

// Create new food
export async function createFood(data: CreateFoodData) {
    return post<Food>('/foods', data);
}

// Update food
export async function updateFood(id: string, data: Partial<CreateFoodData>) {
    return put<Food>(`/foods/${id}`, data);
}

// Delete food
export async function deleteFood(id: string) {
    return del<{ success: boolean; message: string }>(`/foods/${id}`);
}

// Upload food image
export async function uploadFoodImage(file: File) {
    return uploadFile(file, 'food');
}

// Get food alternatives
export async function getFoodAlternatives(foodId: string) {
    return get<{
        id: number;
        food_id: string;
        alternative: Food;
        priority: number;
    }[]>(`/alternatives/${foodId}`);
}

// Add food alternative
export async function addFoodAlternative(foodId: string, alternativeFoodId: string, priority?: number) {
    return post<{ id: number }>('/alternatives', {
        food_id: foodId,
        alternative_food_id: alternativeFoodId,
        priority: priority || 0,
    });
}

// Remove food alternative
export async function removeFoodAlternative(id: number) {
    return del<{ success: boolean }>(`/alternatives/${id}`);
}

// Get suggested alternatives (auto-suggest based on similar protein)
export async function getSuggestedAlternatives(foodId: string) {
    return get<Food[]>(`/alternatives/suggest/${foodId}`);
}
