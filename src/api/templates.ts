// ============================================
// TEMPLATES API - CRUD operations for meal templates
// ============================================

import { get, post, put, del } from './client';

export interface TemplateItem {
    id: number;
    food_id: string | null;
    recipe_id: string | null;
    qty: number;
    is_swappable: boolean;
    sort_order: number;
    food?: {
        label: string;
        emoji: string;
        protein: number;
        carbs: number;
        fat: number;
        calories: number;
        image_url: string | null;
    };
    recipe?: {
        name: string;
        protein: number;
        carbs: number;
        fat: number;
        calories: number;
        image_url: string | null;
    };
}

export interface MealTemplate {
    id: string;
    name: string;
    mode: string;
    day_type: 'training' | 'rest';
    slot: string;
    intention: string;
    note: string | null;
    is_active: boolean;
    items?: TemplateItem[];
    created_at: string;
    updated_at: string;
}

export interface CreateTemplateData {
    name: string;
    mode: string;
    day_type?: 'training' | 'rest';
    slot: string;
    intention?: string;
    note?: string;
    items?: {
        food_id?: string;
        recipe_id?: string;
        qty?: number;
        is_swappable?: boolean;
    }[];
}

// Get all templates with optional filters
export async function getTemplates(params?: {
    mode?: string;
    day_type?: 'training' | 'rest';
    slot?: string;
    active_only?: boolean;
}) {
    const query = new URLSearchParams();
    if (params?.mode) query.set('mode', params.mode);
    if (params?.day_type) query.set('day_type', params.day_type);
    if (params?.slot) query.set('slot', params.slot);
    if (params?.active_only) query.set('active_only', 'true');

    const queryString = query.toString();
    return get<MealTemplate[]>(`/templates${queryString ? `?${queryString}` : ''}`);
}

// Get single template with items
export async function getTemplate(id: string) {
    return get<MealTemplate>(`/templates/${id}`);
}

// Create new template
export async function createTemplate(data: CreateTemplateData) {
    return post<MealTemplate>('/templates', data);
}

// Update template
export async function updateTemplate(id: string, data: Partial<CreateTemplateData>) {
    return put<MealTemplate>(`/templates/${id}`, data);
}

// Delete template
export async function deleteTemplate(id: string) {
    return del<{ success: boolean; message: string }>(`/templates/${id}`);
}

// Add item to template
export async function addTemplateItem(
    templateId: string,
    item: { food_id?: string; recipe_id?: string; qty?: number; is_swappable?: boolean }
) {
    return post<TemplateItem>(`/templates/${templateId}/items`, item);
}

// Remove item from template
export async function removeTemplateItem(templateId: string, itemId: number) {
    return del<{ success: boolean }>(`/templates/${templateId}/items/${itemId}`);
}
