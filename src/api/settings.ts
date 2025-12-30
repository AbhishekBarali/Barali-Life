// ============================================
// SETTINGS API - User settings and preferences
// ============================================

import { get, put, post, del } from './client';

export interface UserSettings {
    mode: string;
    weight_mode: string;
    workout_schedule: string;
    weight_kg: number;
    height_cm: number;
    age: number;
    gender: string;
    goal: string;
    protein_target: number;
    carbs_target: number;
    fat_target: number;
    calories_target: number;
    water_liters: number;
    gym_streak: number;
    protein_streak: number;
}

export interface BlacklistItem {
    id: number;
    food_id: string;
    reason: string | null;
    label: string;
    emoji: string;
}

// Get user settings
export async function getSettings() {
    return get<UserSettings>('/settings');
}

// Update user settings
export async function updateSettings(data: Partial<UserSettings>) {
    return put<UserSettings>('/settings', data);
}

// Get blacklist
export async function getBlacklist() {
    return get<BlacklistItem[]>('/settings/blacklist');
}

// Add food to blacklist
export async function addToBlacklist(foodId: string, reason?: string) {
    return post<{ success: boolean }>('/settings/blacklist', { food_id: foodId, reason });
}

// Remove food from blacklist
export async function removeFromBlacklist(foodId: string) {
    return del<{ success: boolean }>(`/settings/blacklist/${foodId}`);
}
