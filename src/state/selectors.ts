// ============================================
// SELECTORS - Derived state calculations
// ============================================

import { AppState, DayLog, MealSlot, FoodId } from '../types';
import { FOOD_DATABASE } from '../diet/foods';

// ============================================
// Today's macros from eaten foods
// ============================================
export function selectTodayMacros(todayLog: DayLog) {
    let protein = 0;
    let carbs = 0;
    let fat = 0;
    let calories = 0;

    for (const entry of todayLog.eaten) {
        if (entry.foodId === 'CUSTOM' && entry.customFood) {
            protein += entry.customFood.protein;
            carbs += entry.customFood.carbs;
            fat += entry.customFood.fat;
            calories += entry.customFood.calories;
        } else if (entry.foodId !== 'CUSTOM') {
            const food = FOOD_DATABASE[entry.foodId];
            if (food) {
                const multiplier = entry.qty ? entry.qty / food.qty : 1;
                protein += food.macros.protein * multiplier;
                carbs += food.macros.carbs * multiplier;
                fat += food.macros.fat * multiplier;
                calories += food.macros.calories * multiplier;
            }
        }
    }

    return {
        protein: Math.round(protein),
        carbs: Math.round(carbs),
        fat: Math.round(fat),
        calories: Math.round(calories),
    };
}

// ============================================
// Check if a food is eaten in a slot
// ============================================
export function isFoodEaten(todayLog: DayLog, slot: MealSlot, foodId: FoodId): boolean {
    return todayLog.eaten.some(e => e.slot === slot && e.foodId === foodId);
}

// ============================================
// Get eaten foods for a slot
// ============================================
export function getEatenFoodsForSlot(todayLog: DayLog, slot: MealSlot) {
    return todayLog.eaten.filter(e => e.slot === slot);
}

// ============================================
// Get current meal slot based on time
// ============================================
export function getCurrentMealSlot(): MealSlot {
    const hour = new Date().getHours();
    if (hour < 10) return 'BREAKFAST';
    if (hour < 12) return 'MORNING_SNACK';
    if (hour < 15) return 'LUNCH';
    if (hour < 18) return 'EVENING_SNACK';
    return 'DINNER';
}

// ============================================
// Get next meal slot
// ============================================
export function getNextMealSlot(): MealSlot {
    const current = getCurrentMealSlot();
    const slots: MealSlot[] = ['BREAKFAST', 'MORNING_SNACK', 'LUNCH', 'EVENING_SNACK', 'DINNER'];
    const currentIndex = slots.indexOf(current);
    return slots[Math.min(currentIndex + 1, slots.length - 1)];
}

// ============================================
// Protein progress
// ============================================
export function selectProteinProgress(todayLog: DayLog, target: number): number {
    const macros = selectTodayMacros(todayLog);
    return Math.min(100, Math.round((macros.protein / target) * 100));
}

// ============================================
// Workout day label
// ============================================
export function getWorkoutDayLabel(dayOfWeek: number): string {
    if (dayOfWeek === 1 || dayOfWeek === 4) {
        return 'Pull + Deadlift';
    }
    if (dayOfWeek === 2 || dayOfWeek === 5) {
        return 'Push + Squats';
    }
    return 'Rest Day';
}

// ============================================
// Is gym day
// ============================================
export function isGymDay(dayOfWeek: number): boolean {
    return [1, 2, 4, 5].includes(dayOfWeek);
}
