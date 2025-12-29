// ============================================
// BLACKLIST - Junk food warnings
// ============================================

import { FoodId } from '../types';

// Default blacklisted foods
export const DEFAULT_BLACKLIST: FoodId[] = [
    'MOMOS',
    'VEG_MOMO',
    'CHOWMEIN',
    'SAMOSA',
    'PAKODA',
    'SUGARY_TEA',
    'PIZZA',
    'BURGER',
    'FRIES',
    'COLD_DRINK',
    'INSTANT_NOODLES',
];

// Check if food is blacklisted
export function isBlacklisted(foodId: FoodId, blacklist: FoodId[]): boolean {
    return blacklist.includes(foodId);
}

// Warning messages for blacklisted foods
export const BLACKLIST_WARNINGS: Partial<Record<FoodId, string>> = {
    MOMOS: '🥟 Momos detected! Low protein (10g). Try Buff Momo instead (18g protein).',
    VEG_MOMO: '🥟 Veg Momo = only 6g protein. Not worth the carbs!',
    CHOWMEIN: '🍜 Chowmein = empty carbs + oil. This will cost you 100 burpees.',
    SAMOSA: '🔺 Samosa alert! Deep fried + potatoes = calorie bomb.',
    PAKODA: '🍘 Pakoda = fried batter. Minimal nutrition.',
    SUGARY_TEA: '🍵 That sugar hits different... and not in a good way.',
    PIZZA: '🍕 Pizza party? Your protein goals are crying.',
    BURGER: '🍔 Fast food burger = mystery meat + sugar buns.',
    FRIES: '🍟 Fried potatoes disguised as a side dish.',
    COLD_DRINK: '🥤 Liquid sugar. Zero nutrition. Avoid!',
    INSTANT_NOODLES: '🍜 Wai Wai = empty carbs + sodium bomb.',
};

// Get warning for a food
export function getBlacklistWarning(foodId: FoodId): string {
    return BLACKLIST_WARNINGS[foodId] || 'This food is on your blacklist. Think twice!';
}

// Confirmation messages (creative friction)
export const CONFIRMATION_MESSAGES = [
    'This requires 100 burpees. Are you sure?',
    'Your abs called. They said "no."',
    'Damage Control will be activated. Proceed?',
    'Future you will not thank present you.',
    'Gym gains leaving chat... Continue?',
    'Your protein goals are crying. Still want it?',
];

// Get random confirmation message
export function getRandomConfirmation(): string {
    return CONFIRMATION_MESSAGES[Math.floor(Math.random() * CONFIRMATION_MESSAGES.length)];
}
