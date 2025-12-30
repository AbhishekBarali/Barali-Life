// ============================================
// STORE - Zustand state management
// ============================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    AppState,
    Mode,
    MealSlot,
    FoodId,
    DayLog,
    EatenEntry,
    MealPlan,
    MacroTargets,
    WeightMode,
    WorkoutSchedule,
    ThemeType, // Added ThemeType
} from '../types';
import { generateMealsForMode, generateRandomizedMeals } from '../diet/templates';
import { FOOD_DATABASE } from '../diet/foods';

// ============================================
// Helper: Get today's date as YYYY-MM-DD
// ============================================
function getTodayDateString(): string {
    return new Date().toISOString().split('T')[0];
}

// ============================================
// Helper: Get workout type for a day
// ============================================
function getWorkoutTypeForDay(date: Date, schedule: WorkoutSchedule): 'DAY_A_PULL' | 'DAY_B_PUSH' | 'REST' | 'FULL_BODY_A' | 'FULL_BODY_B' {
    const dayOfWeek = date.getDay();

    if (schedule === 'FOUR_DAY_PUSH_PULL') {
        // Mon/Thu = Pull, Tue/Fri = Push, Wed/Sat/Sun = Rest
        if (dayOfWeek === 1 || dayOfWeek === 4) return 'DAY_A_PULL';
        if (dayOfWeek === 2 || dayOfWeek === 5) return 'DAY_B_PUSH';
        return 'REST';
    } else {
        // THREE_DAY_LESS_TIME: Mon/Wed/Fri, alternating A/B
        // Week 1: A/B/A, Week 2: B/A/B
        if (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5) {
            const weekNumber = Math.floor(date.getTime() / (7 * 24 * 60 * 60 * 1000));
            const isEvenWeek = weekNumber % 2 === 0;
            if (dayOfWeek === 1) return isEvenWeek ? 'FULL_BODY_A' : 'FULL_BODY_B';
            if (dayOfWeek === 3) return isEvenWeek ? 'FULL_BODY_B' : 'FULL_BODY_A';
            return isEvenWeek ? 'FULL_BODY_A' : 'FULL_BODY_B';
        }
        return 'REST';
    }
}

// ============================================
// Create default day log
// ============================================
function createDefaultDayLog(mode: Mode, schedule: WorkoutSchedule): DayLog {
    const today = new Date();
    const workoutType = getWorkoutTypeForDay(today, schedule);

    return {
        date: getTodayDateString(),
        meals: generateMealsForMode(mode),
        eaten: [],
        gym: {
            completed: false,
            skipped: false,
            workoutType,
        },
    };
}

// ============================================
// Default targets
// ============================================
const DEFAULT_TARGETS: MacroTargets = {
    proteinPerDay: 140,
    carbsPerDay: 350,
    fatPerDay: 70,
    caloriesPerDay: 2700,
    waterLiters: 2.5,
};

// ============================================
// Store
// ============================================
export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            // Initial state
            mode: 'STANDARD_DAY' as Mode,
            theme: 'default' as ThemeType, // Added theme
            targets: DEFAULT_TARGETS,
            weightMode: 'MAINTAIN' as WeightMode,
            workoutSchedule: 'FOUR_DAY_PUSH_PULL' as WorkoutSchedule,

            profile: {
                weightKg: 74,
                heightCm: 175,
                age: 20,
                gender: 'male' as const,
                goal: 'build_muscle',
            },

            inventory: {
                availableFoodIds: [
                    'EGGS_BOILED', 'EGGS_OMELETTE', 'EGGS_BHURJI',
                    'CHICKEN_CURRY', 'CHICKEN_GRILLED',
                    'DAL', 'RICE', 'ROTI',
                    'DAHI', 'MILK',
                    'BANANA', 'APPLE',
                    'WHEY', 'PEANUTS', 'ALMONDS',
                    'BREAD_PEANUT_BUTTER', 'OATS',
                ],
            },

            blacklist: [
                'BUFF_MOMO', 'CHOWMEIN', 'INSTANT_NOODLES',
                'COLD_DRINK', 'PIZZA', 'BURGER', 'SAMOSA',
            ],

            logs: {},

            streaks: {
                gym: 0,
                protein: 0,
            },

            // Get today's log (creates if doesn't exist)
            getTodayLog: () => {
                const state = get();
                const today = getTodayDateString();

                if (!state.logs[today]) {
                    const newLog = createDefaultDayLog(state.mode, state.workoutSchedule);
                    set((s) => ({
                        logs: { ...s.logs, [today]: newLog },
                    }));
                    return newLog;
                }

                return state.logs[today];
            },

            // Set mode
            setMode: (mode: Mode) => {
                set({ mode });
                // Regenerate today's meals
                const today = getTodayDateString();
                const state = get();
                const currentLog = state.logs[today];
                if (currentLog) {
                    set((s) => ({
                        logs: {
                            ...s.logs,
                            [today]: {
                                ...currentLog,
                                meals: generateMealsForMode(mode),
                            },
                        },
                    }));
                }
            },

            // Set theme
            setTheme: (theme) => {
                set({ theme });
            },

            // Log food
            logFood: (slot: MealSlot, foodId: FoodId, qty?: number) => {
                const today = getTodayDateString();
                const state = get();
                const currentLog = state.logs[today] || createDefaultDayLog(state.mode, state.workoutSchedule);

                const entry: EatenEntry = { slot, foodId };
                if (qty !== undefined) entry.qty = qty;

                set((s) => ({
                    logs: {
                        ...s.logs,
                        [today]: {
                            ...currentLog,
                            eaten: [...currentLog.eaten, entry],
                        },
                    },
                }));
            },

            // Unlog food
            unlogFood: (slot: MealSlot, foodId: FoodId) => {
                const today = getTodayDateString();
                const state = get();
                const currentLog = state.logs[today];
                if (!currentLog) return;

                // Remove first matching entry
                const index = currentLog.eaten.findIndex(
                    (e) => e.slot === slot && e.foodId === foodId
                );
                if (index !== -1) {
                    const newEaten = [...currentLog.eaten];
                    newEaten.splice(index, 1);
                    set((s) => ({
                        logs: {
                            ...s.logs,
                            [today]: {
                                ...currentLog,
                                eaten: newEaten,
                            },
                        },
                    }));
                }
            },

            // Log custom food
            logCustomFood: (slot: MealSlot, food: EatenEntry['customFood']) => {
                const today = getTodayDateString();
                const state = get();
                const currentLog = state.logs[today] || createDefaultDayLog(state.mode, state.workoutSchedule);

                const entry: EatenEntry = {
                    slot,
                    foodId: `CUSTOM_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    customFood: food,
                };

                set((s) => ({
                    logs: {
                        ...s.logs,
                        [today]: {
                            ...currentLog,
                            eaten: [...currentLog.eaten, entry],
                        },
                    },
                }));
            },

            // Complete gym
            completeGym: () => {
                const today = getTodayDateString();
                const state = get();
                const currentLog = state.logs[today] || createDefaultDayLog(state.mode, state.workoutSchedule);

                set((s) => ({
                    logs: {
                        ...s.logs,
                        [today]: {
                            ...currentLog,
                            gym: { ...currentLog.gym, completed: true, skipped: false },
                        },
                    },
                    streaks: { ...s.streaks, gym: s.streaks.gym + 1 },
                }));
            },

            // Skip gym
            skipGym: () => {
                const today = getTodayDateString();
                const state = get();
                const currentLog = state.logs[today] || createDefaultDayLog(state.mode, state.workoutSchedule);

                set((s) => ({
                    logs: {
                        ...s.logs,
                        [today]: {
                            ...currentLog,
                            gym: { ...currentLog.gym, completed: false, skipped: true },
                        },
                    },
                    streaks: { ...s.streaks, gym: 0 }, // Reset streak
                }));
            },

            // Manual toggle for gym day
            toggleGymDay: () => {
                const today = getTodayDateString();
                const state = get();
                const currentLog = state.logs[today] || createDefaultDayLog(state.mode, state.workoutSchedule);

                // Determine current logical state
                const isAutoGymDay = currentLog.gym.workoutType !== 'REST';
                const currentIsGymDay = currentLog.isGymDayOverride !== undefined
                    ? currentLog.isGymDayOverride
                    : isAutoGymDay;

                set((s) => ({
                    logs: {
                        ...s.logs,
                        [today]: {
                            ...currentLog,
                            isGymDayOverride: !currentIsGymDay,
                        },
                    },
                }));
            },

            // Set targets
            setTargets: (targets: Partial<MacroTargets>) => {
                set((s) => ({
                    targets: { ...s.targets, ...targets },
                }));
            },

            // Update targets (alias for setTargets)
            updateTargets: (targets: Partial<MacroTargets>) => {
                set((s) => ({
                    targets: { ...s.targets, ...targets },
                }));
            },

            // Set profile
            setProfile: (profile: Partial<AppState['profile']>) => {
                set((s) => ({
                    profile: { ...s.profile, ...profile },
                }));
            },

            // Update profile (alias for setProfile)
            updateProfile: (profile: Partial<AppState['profile']>) => {
                set((s) => ({
                    profile: { ...s.profile, ...profile },
                }));
            },

            // Set inventory
            setInventory: (inventory) => {
                set({ inventory });
            },

            // Set blacklist
            setBlacklist: (blacklist) => {
                set({ blacklist });
            },

            // Update inventory (Settings.tsx passes FoodId[] directly)
            updateInventory: (foodIds: FoodId[]) => {
                set({ inventory: { availableFoodIds: foodIds } });
            },

            // Update blacklist (alias for setBlacklist)
            updateBlacklist: (blacklist) => {
                set({ blacklist });
            },

            // Reset day (clear today's log)
            resetDay: () => {
                const today = getTodayDateString();
                const state = get();
                const newLog = createDefaultDayLog(state.mode, state.workoutSchedule);
                set((s) => ({
                    logs: { ...s.logs, [today]: newLog },
                }));
            },

            // Set weight mode
            setWeightMode: (weightMode: WeightMode) => {
                set({ weightMode });
            },

            // Set workout schedule
            setWorkoutSchedule: (workoutSchedule: WorkoutSchedule) => {
                set({ workoutSchedule });
            },

            // Export data
            exportData: () => {
                const state = get();
                return JSON.stringify({
                    mode: state.mode,
                    targets: state.targets,
                    profile: state.profile,
                    inventory: state.inventory,
                    blacklist: state.blacklist,
                    logs: state.logs,
                    streaks: state.streaks,
                    weightMode: state.weightMode,
                    workoutSchedule: state.workoutSchedule,
                });
            },

            // Import data
            importData: (data: string) => {
                try {
                    const parsed = JSON.parse(data);
                    set({
                        mode: parsed.mode || 'STANDARD_DAY',
                        targets: parsed.targets || DEFAULT_TARGETS,
                        profile: parsed.profile || get().profile,
                        inventory: parsed.inventory || get().inventory,
                        blacklist: parsed.blacklist || get().blacklist,
                        logs: parsed.logs || {},
                        streaks: parsed.streaks || get().streaks,
                        weightMode: parsed.weightMode || 'MAINTAIN',
                        workoutSchedule: parsed.workoutSchedule || 'FOUR_DAY_PUSH_PULL',
                    });
                } catch (e) {
                    console.error('Failed to import data:', e);
                }
            },

            // Export state (alias for exportData)
            exportState: () => {
                const state = get();
                return JSON.stringify({
                    mode: state.mode,
                    targets: state.targets,
                    profile: state.profile,
                    inventory: state.inventory,
                    blacklist: state.blacklist,
                    logs: state.logs,
                    streaks: state.streaks,
                    weightMode: state.weightMode,
                    workoutSchedule: state.workoutSchedule,
                });
            },

            // Import state (alias for importData)
            importState: (data: string) => {
                try {
                    const parsed = JSON.parse(data);
                    set({
                        mode: parsed.mode || 'STANDARD_DAY',
                        targets: parsed.targets || DEFAULT_TARGETS,
                        profile: parsed.profile || get().profile,
                        inventory: parsed.inventory || get().inventory,
                        blacklist: parsed.blacklist || get().blacklist,
                        logs: parsed.logs || {},
                        streaks: parsed.streaks || get().streaks,
                        weightMode: parsed.weightMode || 'MAINTAIN',
                        workoutSchedule: parsed.workoutSchedule || 'FOUR_DAY_PUSH_PULL',
                    });
                } catch (e) {
                    console.error('Failed to import state:', e);
                }
            },

            // Clear all data
            clearAllData: () => {
                set({
                    mode: 'STANDARD_DAY',
                    targets: DEFAULT_TARGETS,
                    logs: {},
                    streaks: { gym: 0, protein: 0 },
                });
            },

            // Swap food in a meal
            swapFood: (slot: MealSlot, from: FoodId, to: FoodId) => {
                const today = getTodayDateString();
                const state = get();
                const currentLog = state.logs[today];
                if (!currentLog) return;

                const meal = currentLog.meals[slot];
                if (!meal) return;

                // Replace the food in the meal items
                const newItems = meal.items.map(item => {
                    if (item.id === from) {
                        const newFood = { ...FOOD_DATABASE[to], originalId: item.originalId || from };
                        return newFood;
                    }
                    return item;
                });

                set((s) => ({
                    logs: {
                        ...s.logs,
                        [today]: {
                            ...currentLog,
                            meals: {
                                ...currentLog.meals,
                                [slot]: {
                                    ...meal,
                                    items: newItems,
                                },
                            },
                        },
                    },
                }));
            },

            // Calorie Cycling
            calorieCycling: {
                enabled: false,
                gymAdjustment: 300,
                restAdjustment: -200,
            },

            setCalorieCycling: (config) => {
                set({ calorieCycling: config });
            },

            getDailyTargets: () => {
                const state = get();
                const today = getTodayDateString();
                const currentLog = state.logs[today]; // Don't create if not exists, just check

                // Base targets
                let targets = { ...state.targets };

                if (!state.calorieCycling.enabled) {
                    return targets;
                }

                // Determine if today is a gym day (re-using logic from toggleGymDay roughly)
                let isGymDay = false;

                if (currentLog) {
                    // If log exists, respect overrides or computed type
                    const isAutoGymDay = currentLog.gym.workoutType !== 'REST';
                    isGymDay = currentLog.isGymDayOverride !== undefined
                        ? currentLog.isGymDayOverride
                        : isAutoGymDay;
                } else {
                    // If no log yet, compute theoretical default
                    const workoutType = getWorkoutTypeForDay(new Date(), state.workoutSchedule);
                    isGymDay = workoutType !== 'REST';
                }

                // Apply adjustments
                if (isGymDay) {
                    targets.caloriesPerDay += state.calorieCycling.gymAdjustment;
                    // Optional: Protein could scale too, but sticking to calories for now
                } else {
                    targets.caloriesPerDay += state.calorieCycling.restAdjustment;
                }

                return targets;
            },

            // Dispatch action for various operations
            dispatch: (action: { type: string; payload?: any }) => {
                const state = get();
                const today = getTodayDateString();
                const currentLog = state.logs[today] || createDefaultDayLog(state.mode, state.workoutSchedule);

                switch (action.type) {
                    case 'SHUFFLE_DAY':
                        // Regenerate meals with some variety
                        const shuffledMeals = generateRandomizedMeals(state.mode);
                        set((s) => ({
                            logs: {
                                ...s.logs,
                                [today]: {
                                    ...currentLog,
                                    meals: shuffledMeals,
                                },
                            },
                        }));
                        break;
                    default:
                        break;
                }
            },
        }),
        {
            name: 'barali-life-storage',
        }
    )
);
