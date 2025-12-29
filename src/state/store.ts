// ============================================
// ZUSTAND STORE - Global state management
// ============================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, DietEvent, Mode, MealSlot, FoodId, Profile, Targets, DayLog } from '../types';
import { DEFAULT_STATE, getTodayISO, getDayInfo } from './persistence';
import { appReducer } from './reducer';
import { FOOD_DATABASE } from '../diet/foods';
import { generateMealsForMode } from '../diet/templates';

// Create empty day log
function createEmptyDayLog(dateISO: string, mode: Mode): DayLog {
    const info = getDayInfo();

    return {
        dateISO,
        mode,
        meals: generateMealsForMode(mode),
        eaten: [],
        gym: {
            planned: info.isGymDay,
            completed: false,
            workoutType: info.workoutType,
            xpEarned: 0,
        },
        warnings: [],
    };
}

// ============================================
// Store Interface
// ============================================
interface BaraliStore extends AppState {
    // Actions
    dispatch: (event: DietEvent) => void;
    ensureTodayLog: () => void;

    // Convenience actions
    setMode: (mode: Mode) => void;
    logFood: (slot: MealSlot, foodId: FoodId, qty?: number) => void;
    logCustomFood: (slot: MealSlot, customFood: { name: string; protein: number; carbs: number; fat: number; calories: number }) => void;
    unlogFood: (slot: MealSlot, foodId: FoodId) => void;
    swapFood: (slot: MealSlot, from: FoodId, to: FoodId) => void;
    regenerateMeal: (slot: MealSlot) => void;
    resetDay: () => void;
    completeGym: () => void;
    missGym: () => void;
    updateProfile: (profile: Partial<Profile>) => void;
    updateTargets: (targets: Partial<Targets>) => void;
    updateInventory: (foodIds: FoodId[]) => void;
    updateBlacklist: (foodIds: FoodId[]) => void;
    importState: (state: AppState) => void;
    exportState: () => string;

    // Selectors
    getTodayLog: () => DayLog;
    getTodayMacros: () => { protein: number; carbs: number; fat: number; calories: number };
}

// ============================================
// Create Store
// ============================================
export const useStore = create<BaraliStore>()(
    persist(
        (set, get) => ({
            // Initial state
            ...DEFAULT_STATE,

            // Ensure today's log exists
            ensureTodayLog: () => {
                const today = getTodayISO();
                const state = get();
                if (!state.logs[today]) {
                    set({
                        logs: {
                            ...state.logs,
                            [today]: createEmptyDayLog(today, state.mode),
                        },
                    });
                }
            },

            // Main dispatch function
            dispatch: (event: DietEvent) => {
                get().ensureTodayLog();
                set((state) => {
                    const newState = appReducer(state, event);
                    return newState;
                });
            },

            // Convenience actions
            setMode: (mode: Mode) => {
                get().dispatch({ type: 'SET_MODE', mode });
            },

            logFood: (slot: MealSlot, foodId: FoodId, qty?: number) => {
                get().dispatch({ type: 'LOG_FOOD', slot, foodId, qty });
            },

            logCustomFood: (slot: MealSlot, customFood: { name: string; protein: number; carbs: number; fat: number; calories: number }) => {
                get().dispatch({ type: 'LOG_CUSTOM_FOOD', slot, customFood });
            },

            unlogFood: (slot: MealSlot, foodId: FoodId) => {
                get().dispatch({ type: 'UNLOG_FOOD', slot, foodId });
            },

            swapFood: (slot: MealSlot, from: FoodId, to: FoodId) => {
                get().dispatch({ type: 'SWAP_FOOD', slot, from, to });
            },

            regenerateMeal: (slot: MealSlot) => {
                get().dispatch({ type: 'REGENERATE_MEAL', slot });
            },

            resetDay: () => {
                get().dispatch({ type: 'RESET_DAY' });
            },

            completeGym: () => {
                get().dispatch({ type: 'COMPLETE_GYM' });
            },

            missGym: () => {
                get().dispatch({ type: 'MISS_GYM' });
            },

            updateProfile: (profile: Partial<Profile>) => {
                get().dispatch({ type: 'UPDATE_PROFILE', profile });
            },

            updateTargets: (targets: Partial<Targets>) => {
                get().dispatch({ type: 'UPDATE_TARGETS', targets });
            },

            updateInventory: (foodIds: FoodId[]) => {
                get().dispatch({ type: 'UPDATE_INVENTORY', foodIds });
            },

            updateBlacklist: (foodIds: FoodId[]) => {
                get().dispatch({ type: 'UPDATE_BLACKLIST', foodIds });
            },

            importState: (state: AppState) => {
                get().dispatch({ type: 'IMPORT_STATE', state });
            },

            exportState: () => {
                const state = get();
                const { dispatch, setMode, logFood, unlogFood, swapFood, regenerateMeal,
                    resetDay, completeGym, missGym,
                    updateProfile, updateTargets, updateInventory,
                    updateBlacklist, importState: _, exportState: __, getTodayLog,
                    getTodayMacros, ensureTodayLog: ___, ...appState } = state;
                return JSON.stringify(appState, null, 2);
            },

            // Selectors
            getTodayLog: () => {
                const today = getTodayISO();
                const state = get();
                if (!state.logs[today]) {
                    get().ensureTodayLog();
                }
                return state.logs[today] || createEmptyDayLog(today, state.mode);
            },

            getTodayMacros: () => {
                const todayLog = get().getTodayLog();
                const eaten = todayLog.eaten || [];

                let protein = 0;
                let carbs = 0;
                let fat = 0;
                let calories = 0;

                for (const entry of eaten) {
                    // Handle custom foods
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
            },
        }),
        {
            name: 'baraliLife:v1',
        }
    )
);
