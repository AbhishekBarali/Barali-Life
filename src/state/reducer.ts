// ============================================
// DIET ENGINE - Core state machine logic
// ============================================

import {
    AppState, DayLog, DietEvent, Mode, MealSlot, FoodId,
    WorkoutType, MealPlan
} from '../types';
import { getTodayISO, DEFAULT_STATE, getDayInfo } from './persistence';
import { generateMealsForMode, createDamageControlMeal, generateRandomizedMeals } from '../diet/templates';
import { isBlacklisted } from '../diet/blacklist';
import { getFood } from '../diet/foods';

// ============================================
// Day Log Initialization
// ============================================
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

// Get or create today's log
export function getOrCreateTodayLog(state: AppState): DayLog {
    const today = getTodayISO();
    if (state.logs[today]) {
        return state.logs[today];
    }
    return createEmptyDayLog(today, state.mode);
}

// ============================================
// Find next main meal slot for damage control
// ============================================
function getNextMainMealSlot(currentSlot: MealSlot): MealSlot {
    const slots: MealSlot[] = ['BREAKFAST', 'LUNCH', 'DINNER'];
    const currentIndex = slots.indexOf(currentSlot);

    if (currentIndex === -1 || currentIndex === 2) {
        return 'DINNER';
    }

    return slots[currentIndex + 1];
}

// ============================================
// MAIN REDUCER
// ============================================
export function appReducer(state: AppState, event: DietEvent): AppState {
    const today = getTodayISO();
    const todayLog = getOrCreateTodayLog(state);

    switch (event.type) {
        // ========================================
        // SET MODE
        // ========================================
        case 'SET_MODE': {
            const newMeals = generateMealsForMode(event.mode);

            const updatedLog: DayLog = {
                ...todayLog,
                mode: event.mode,
                meals: newMeals,
            };

            return {
                ...state,
                mode: event.mode,
                logs: {
                    ...state.logs,
                    [today]: updatedLog,
                },
            };
        }

        // ========================================
        // LOG FOOD
        // ========================================
        case 'LOG_FOOD': {
            const { slot, foodId, qty } = event;
            const isJunk = isBlacklisted(foodId, state.blacklist);

            const newEaten = [
                ...todayLog.eaten,
                {
                    slot,
                    foodId,
                    timestamp: Date.now(),
                    qty,
                },
            ];

            let updatedMeals = { ...todayLog.meals };
            let warnings = [...todayLog.warnings];

            if (isJunk) {
                const nextMainMeal = getNextMainMealSlot(slot);
                updatedMeals[nextMainMeal] = createDamageControlMeal(nextMainMeal);

                warnings.push({
                    timestamp: Date.now(),
                    type: 'JUNK_LOGGED',
                    message: `${getFood(foodId).label} logged. Damage Control activated for ${nextMainMeal.toLowerCase()}.`,
                });
            }

            return {
                ...state,
                logs: {
                    ...state.logs,
                    [today]: {
                        ...todayLog,
                        eaten: newEaten,
                        meals: updatedMeals,
                        warnings,
                    },
                },
            };
        }

        // ========================================
        // LOG CUSTOM FOOD - For foods not in database
        // ========================================
        case 'LOG_CUSTOM_FOOD': {
            const { slot, customFood } = event;

            const newEaten = [
                ...todayLog.eaten,
                {
                    slot,
                    foodId: 'CUSTOM' as const,
                    timestamp: Date.now(),
                    customFood,
                },
            ];

            return {
                ...state,
                logs: {
                    ...state.logs,
                    [today]: {
                        ...todayLog,
                        eaten: newEaten,
                    },
                },
            };
        }

        // ========================================
        // UNLOG FOOD
        // ========================================
        case 'UNLOG_FOOD': {
            const { slot, foodId } = event;

            const newEaten = [...todayLog.eaten];
            const indexToRemove = newEaten.findLastIndex(
                (e) => e.slot === slot && e.foodId === foodId
            );

            if (indexToRemove !== -1) {
                newEaten.splice(indexToRemove, 1);
            }

            return {
                ...state,
                logs: {
                    ...state.logs,
                    [today]: {
                        ...todayLog,
                        eaten: newEaten,
                    },
                },
            };
        }

        // ========================================
        // SWAP FOOD - Now tracks original for reset
        // ========================================
        case 'SWAP_FOOD': {
            const { slot, from, to } = event;
            const meal = todayLog.meals[slot];

            const updatedItems = meal.items.map(item => {
                if (item.id === from) {
                    // Get the new food
                    const newFood = getFood(to);
                    // Preserve originalId if already set, otherwise set it to current from
                    const originalId = item.originalId || from;
                    return {
                        ...newFood,
                        qty: item.qty,
                        originalId: originalId, // Track the very first food for reset
                    };
                }
                return item;
            });

            const updatedMeal: MealPlan = {
                ...meal,
                items: updatedItems,
            };

            return {
                ...state,
                logs: {
                    ...state.logs,
                    [today]: {
                        ...todayLog,
                        meals: {
                            ...todayLog.meals,
                            [slot]: updatedMeal,
                        },
                    },
                },
            };
        }

        // ========================================
        // REGENERATE MEAL
        // ========================================
        case 'REGENERATE_MEAL': {
            const { slot } = event;
            const newMeals = generateMealsForMode(state.mode);

            return {
                ...state,
                logs: {
                    ...state.logs,
                    [today]: {
                        ...todayLog,
                        meals: {
                            ...todayLog.meals,
                            [slot]: newMeals[slot],
                        },
                    },
                },
            };
        }

        // ========================================
        // SHUFFLE DAY - Regenerate all meals with variety
        // ========================================
        case 'SHUFFLE_DAY': {
            const shuffledMeals = generateRandomizedMeals(state.mode);

            return {
                ...state,
                logs: {
                    ...state.logs,
                    [today]: {
                        ...todayLog,
                        meals: shuffledMeals,
                    },
                },
            };
        }

        // ========================================
        // RESET DAY
        // ========================================
        case 'RESET_DAY': {
            return {
                ...state,
                logs: {
                    ...state.logs,
                    [today]: createEmptyDayLog(today, state.mode),
                },
            };
        }

        // ========================================
        // COMPLETE GYM
        // ========================================
        case 'COMPLETE_GYM': {
            const xpGained = 100;

            return {
                ...state,
                streaks: {
                    ...state.streaks,
                    gym: state.streaks.gym + 1,
                },
                totalXP: {
                    gym: state.totalXP.gym + xpGained,
                },
                logs: {
                    ...state.logs,
                    [today]: {
                        ...todayLog,
                        gym: {
                            ...todayLog.gym,
                            completed: true,
                            xpEarned: xpGained,
                        },
                    },
                },
            };
        }

        // ========================================
        // MISS GYM
        // ========================================
        case 'MISS_GYM': {
            return {
                ...state,
                streaks: {
                    ...state.streaks,
                    gym: 0,
                },
                logs: {
                    ...state.logs,
                    [today]: {
                        ...todayLog,
                        gym: {
                            ...todayLog.gym,
                            completed: false,
                            xpEarned: 0,
                        },
                        warnings: [
                            ...todayLog.warnings,
                            {
                                timestamp: Date.now(),
                                type: 'STREAK_BROKEN',
                                message: 'Gym streak broken. Start fresh tomorrow! 💪',
                            },
                        ],
                    },
                },
            };
        }

        // ========================================
        // UPDATE PROFILE
        // ========================================
        case 'UPDATE_PROFILE': {
            return {
                ...state,
                profile: {
                    ...state.profile,
                    ...event.profile,
                },
            };
        }

        // ========================================
        // UPDATE TARGETS
        // ========================================
        case 'UPDATE_TARGETS': {
            return {
                ...state,
                targets: {
                    ...state.targets,
                    ...event.targets,
                },
            };
        }

        // ========================================
        // UPDATE INVENTORY
        // ========================================
        case 'UPDATE_INVENTORY': {
            return {
                ...state,
                inventory: {
                    availableFoodIds: event.foodIds,
                },
            };
        }

        // ========================================
        // UPDATE BLACKLIST
        // ========================================
        case 'UPDATE_BLACKLIST': {
            return {
                ...state,
                blacklist: event.foodIds,
            };
        }

        // ========================================
        // IMPORT STATE
        // ========================================
        case 'IMPORT_STATE': {
            return event.state;
        }

        default:
            return state;
    }
}
