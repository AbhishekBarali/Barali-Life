// ============================================
// LOGS API - Daily food and gym logging
// ============================================

import { get, post, del } from './client';

export interface LogEntry {
    id: number;
    date: string;
    slot: string;
    qty: number;
    is_custom: boolean;
    food?: {
        id: string;
        label: string;
        emoji: string;
        protein: number;
        carbs: number;
        fat: number;
        calories: number;
        image_url: string | null;
    };
    recipe?: {
        id: string;
        name: string;
        protein: number;
        carbs: number;
        fat: number;
        calories: number;
        image_url: string | null;
    };
    custom?: {
        name: string;
        protein: number;
        carbs: number;
        fat: number;
        calories: number;
    };
    macros: {
        protein: number;
        carbs: number;
        fat: number;
        calories: number;
    };
}

export interface DayLog {
    date: string;
    logs: LogEntry[];
    totals: {
        protein: number;
        carbs: number;
        fat: number;
        calories: number;
    };
    gym: {
        workout_type: string | null;
        completed: boolean;
        skipped: boolean;
        notes: string | null;
    } | null;
}

// Get logs for a specific date
export async function getDayLogs(date: string) {
    return get<DayLog>(`/logs/${date}`);
}

// Log a food
export async function logFood(data: {
    date: string;
    slot: string;
    food_id?: string;
    recipe_id?: string;
    qty?: number;
    is_custom?: boolean;
    custom_name?: string;
    custom_protein?: number;
    custom_carbs?: number;
    custom_fat?: number;
    custom_calories?: number;
}) {
    return post<{ id: number }>('/logs', data);
}

// Remove a log entry
export async function removeLog(id: number) {
    return del<{ success: boolean }>(`/logs/${id}`);
}

// Log gym activity
export async function logGym(data: {
    date: string;
    workout_type?: string;
    completed?: boolean;
    skipped?: boolean;
    notes?: string;
}) {
    return post<{ success: boolean }>('/logs/gym', data);
}

// Get today's date in YYYY-MM-DD format
export function getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
}
