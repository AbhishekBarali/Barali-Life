// ============================================
// DASHBOARD - Clear, simple daily overview
// Removed: Quick Protein Boost (useless)
// Added: Calendar view
// ============================================

import React, { useState } from 'react';
import { useStore } from '../state/store';
import { getDayInfo } from '../state/persistence';
import { Card } from '../ui/components/Card';
import { useToast } from '../ui/components/Toast';
import { RecipeModal } from '../ui/components/RecipeModal';
import { Calendar } from '../ui/components/Calendar';
import { FoodId, MealSlot, MODE_MEAL_LABELS, MODE_MEAL_TIMES, MODE_MEAL_ORDER, WORKOUT_LABELS } from '../types';
import { isBlacklisted } from '../diet/blacklist';
import { getFood, FOOD_DATABASE } from '../diet/foods';
import { hasRecipe } from '../diet/recipes';

export function Dashboard() {
    const todayLog = useStore((state) => state.getTodayLog());
    const mode = useStore((state) => state.mode);
    const targets = useStore((state) => state.targets);
    const blacklist = useStore((state) => state.blacklist);
    const streaks = useStore((state) => state.streaks);
    const logFood = useStore((state) => state.logFood);
    const unlogFood = useStore((state) => state.unlogFood);
    const { showToast } = useToast();

    // Get mode-specific meal times and labels
    const mealTimes = MODE_MEAL_TIMES[mode];
    const mealLabels = MODE_MEAL_LABELS[mode];

    const [selectedRecipe, setSelectedRecipe] = useState<FoodId | null>(null);
    const [showCalendar, setShowCalendar] = useState(false);

    // Get day info
    const dayInfo = getDayInfo();

    // Calculate today's macros from eaten foods
    const todayMacros = React.useMemo(() => {
        let protein = 0, carbs = 0, fat = 0, calories = 0;
        for (const entry of todayLog.eaten) {
            if (entry.foodId === 'CUSTOM' && entry.customFood) {
                protein += entry.customFood.protein;
                carbs += entry.customFood.carbs;
                fat += entry.customFood.fat;
                calories += entry.customFood.calories;
            } else if (entry.foodId !== 'CUSTOM') {
                const food = FOOD_DATABASE[entry.foodId];
                if (food) {
                    protein += food.macros.protein;
                    carbs += food.macros.carbs;
                    fat += food.macros.fat;
                    calories += food.macros.calories;
                }
            }
        }
        return { protein, carbs, fat, calories };
    }, [todayLog.eaten]);

    const proteinNeeded = targets.proteinPerDay - todayMacros.protein;
    const proteinProgress = Math.min(100, Math.round((todayMacros.protein / targets.proteinPerDay) * 100));

    // Get current meal slot (Mode-Aware)
    const getCurrentSlot = (): MealSlot => {
        const hour = new Date().getHours();

        // College Modes: Breakfast -> Tiffin (9) -> Lunch (12)
        if (mode.includes('COLLEGE')) {
            if (hour < 8) return 'BREAKFAST';
            if (hour < 11) return 'MORNING_SNACK'; // Tiffin
            if (hour < 14) return 'LUNCH';         // Lunch (12 PM)
            if (hour < 18) return 'EVENING_SNACK';
            return 'DINNER';
        }

        // Standard Modes: Breakfast -> Lunch (11) -> Pre-Workout (1)
        if (hour < 8) return 'BREAKFAST';
        if (hour < 12) return 'LUNCH';           // Lunch at 11
        if (hour < 14) return 'MORNING_SNACK';   // Pre-workout at 1
        if (hour < 18) return 'EVENING_SNACK';
        return 'DINNER';
    };
    const currentSlot = getCurrentSlot();

    // Check if food is eaten in a slot
    const isFoodEaten = (slot: MealSlot, foodId: FoodId) => {
        return todayLog.eaten.some(e => e.slot === slot && e.foodId === foodId);
    };

    const handleToggleFood = (slot: MealSlot, foodId: FoodId) => {
        if (isFoodEaten(slot, foodId)) {
            unlogFood(slot, foodId);
            showToast('Removed ❌', 'info');
        } else {
            if (isBlacklisted(foodId, blacklist)) {
                showToast('⚠️ Junk food logged! Damage Control activated.', 'warning');
            }
            logFood(slot, foodId);
            const food = getFood(foodId);
            showToast(`${food.emoji} +${food.macros.protein}g protein`, 'success');
        }
    };

    // Dynamic slot order based on mode
    const mealSlots: MealSlot[] = MODE_MEAL_ORDER[mode];

    // Get status for each meal
    const getMealStatus = (slot: MealSlot): 'done' | 'current' | 'upcoming' => {
        const slotIndex = mealSlots.indexOf(slot);
        const currentIndex = mealSlots.indexOf(currentSlot);

        const hasEatenInSlot = todayLog.eaten.some(e => e.slot === slot);
        if (hasEatenInSlot && slotIndex < currentIndex) return 'done';
        if (slot === currentSlot) return 'current';
        return slotIndex < currentIndex ? 'done' : 'upcoming';
    };

    return (
        <div className="space-y-5 pb-24">
            {/* Day Header with Streak */}
            <div className="text-center py-4">
                <div className="text-3xl font-bold text-white">
                    {dayInfo.dayName}, {dayInfo.date}
                </div>
                <div className={`text-lg mt-1 ${dayInfo.isGymDay ? 'text-neon-teal' : 'text-zinc-400'}`}>
                    {dayInfo.isGymDay ? `💪 ${WORKOUT_LABELS[dayInfo.workoutType]}` : '😴 Rest Day'}
                </div>

                {/* Streak badge */}
                {streaks.gym > 0 && (
                    <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm">
                        🔥 {streaks.gym} day streak
                    </div>
                )}
            </div>

            {/* Calendar Toggle */}
            {/* <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="w-full py-3 bg-surface-700 hover:bg-surface-600 rounded-xl text-white font-medium transition-colors flex items-center justify-center gap-2"
            >
                📅 {showCalendar ? 'Hide Calendar' : 'View Calendar'}
            </button> */}

            {/* Calendar */}
            {showCalendar && <Calendar />}

            {/* Protein Progress */}
            <Card className="bg-gradient-to-r from-surface-800 to-surface-700">
                <div className="text-center">
                    <div className="text-sm text-zinc-400 mb-2">Today's Protein</div>
                    <div className="text-4xl font-bold text-white mb-2">
                        <span className="text-neon-teal">{todayMacros.protein}g</span>
                        <span className="text-zinc-500 text-2xl"> / {targets.proteinPerDay}g</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-4 bg-surface-600 rounded-full overflow-hidden mb-3">
                        <div
                            className="h-full bg-gradient-to-r from-neon-teal to-green-400 transition-all duration-500"
                            style={{ width: `${proteinProgress}%` }}
                        />
                    </div>

                    {proteinNeeded > 0 ? (
                        <div className="text-sm text-yellow-400">
                            ⚡ Need {proteinNeeded}g more protein
                        </div>
                    ) : (
                        <div className="text-sm text-green-400">
                            ✅ Protein goal reached!
                        </div>
                    )}
                </div>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
                <Card className="text-center p-4">
                    <div className="text-2xl font-bold text-white">{todayMacros.calories}</div>
                    <div className="text-xs text-zinc-500">Calories</div>
                </Card>
                <Card className="text-center p-4">
                    <div className="text-2xl font-bold text-white">{todayMacros.carbs}g</div>
                    <div className="text-xs text-zinc-500">Carbs</div>
                </Card>
                <Card className="text-center p-4">
                    <div className="text-2xl font-bold text-white">{todayMacros.fat}g</div>
                    <div className="text-xs text-zinc-500">Fat</div>
                </Card>
            </div>

            {/* Meal Timeline */}
            <div className="space-y-3">
                <h2 className="text-lg font-semibold text-white">Today's Meals</h2>

                {mealSlots.map(slot => {
                    const status = getMealStatus(slot);
                    const eatenInSlot = todayLog.eaten.filter(e => e.slot === slot);
                    const meal = todayLog.meals[slot];

                    // Slot icons - consistent for all states
                    const SLOT_ICONS: Record<MealSlot, string> = {
                        BREAKFAST: '🌅',
                        MORNING_SNACK: '☕',
                        LUNCH: '🍽️',
                        EVENING_SNACK: '🍎',
                        DINNER: '🌙',
                    };

                    return (
                        <Card
                            key={slot}
                            status={status as 'current' | 'done' | 'default'}
                        >
                            {/* Meal Header */}
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">
                                        {SLOT_ICONS[slot]}
                                    </span>
                                    <div>
                                        <div className="font-medium text-white">{mealLabels[slot]}</div>
                                        <div className="text-xs text-zinc-500">{mealTimes[slot]}</div>
                                    </div>
                                </div>

                                {eatenInSlot.length > 0 && (
                                    <div className="text-sm text-primary">
                                        +{eatenInSlot.reduce((sum, e) => {
                                            if (e.foodId === 'CUSTOM' && e.customFood) {
                                                return sum + e.customFood.protein;
                                            } else if (e.foodId !== 'CUSTOM') {
                                                return sum + (FOOD_DATABASE[e.foodId]?.macros.protein || 0);
                                            }
                                            return sum;
                                        }, 0)}g
                                    </div>
                                )}
                            </div>

                            {/* Meal note */}
                            {meal?.note && status === 'current' && (
                                <div className="text-sm text-zinc-400 mb-3 italic">
                                    💡 {meal.note}
                                </div>
                            )}

                            {/* Eaten foods */}
                            {eatenInSlot.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {eatenInSlot.map((entry, i) => {
                                        // Handle custom foods
                                        if (entry.foodId === 'CUSTOM' && entry.customFood) {
                                            return (
                                                <div
                                                    key={i}
                                                    className="flex items-center gap-1 px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded-full text-sm"
                                                >
                                                    <span>✏️</span>
                                                    <span>{entry.customFood.name}</span>
                                                    <span className="text-xs">✓</span>
                                                </div>
                                            );
                                        }
                                        if (entry.foodId === 'CUSTOM') return null;
                                        const food = FOOD_DATABASE[entry.foodId];
                                        return (
                                            <div
                                                key={i}
                                                onClick={() => handleToggleFood(slot, entry.foodId as FoodId)}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm cursor-pointer hover:bg-green-500/30"
                                            >
                                                <span>{food?.emoji}</span>
                                                <span>{food?.label}</span>
                                                <span className="text-xs">✓</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Suggested foods - show for ALL meal slots */}
                            {meal && (
                                <div className="flex flex-wrap gap-2">
                                    {meal.items.slice(0, 5).map(item => {
                                        const isEaten = isFoodEaten(slot, item.id);
                                        if (isEaten) return null;
                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => handleToggleFood(slot, item.id)}
                                                className="flex items-center gap-2 px-3 py-2 bg-surface-600 hover:bg-surface-500 rounded-xl text-sm transition-all"
                                            >
                                                <span>{item.emoji}</span>
                                                <span className="text-zinc-300">{item.label}</span>
                                                {hasRecipe(item.id) && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedRecipe(item.id);
                                                        }}
                                                        className="text-purple-400 hover:text-purple-300"
                                                    >
                                                        📖
                                                    </button>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </Card>
                    );
                })}
            </div>

            {/* Gym Status */}
            {dayInfo.isGymDay && (
                <Card className={todayLog.gym.completed ? 'border-green-500/30' : 'border-orange-500/30'}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">{todayLog.gym.completed ? '💪' : '🏋️'}</span>
                            <div>
                                <div className="font-medium text-white">{WORKOUT_LABELS[dayInfo.workoutType]}</div>
                                <div className="text-sm text-zinc-400">
                                    {todayLog.gym.completed ? 'Completed!' : 'Pending'}
                                </div>
                            </div>
                        </div>
                        {todayLog.gym.completed && (
                            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                                ✓ Done
                            </span>
                        )}
                    </div>
                </Card>
            )}

            {/* Recipe Modal */}
            <RecipeModal
                foodId={selectedRecipe}
                isOpen={!!selectedRecipe}
                onClose={() => setSelectedRecipe(null)}
            />
        </div>
    );
}
