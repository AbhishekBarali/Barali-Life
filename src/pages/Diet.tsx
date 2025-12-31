// ============================================
// DIET PAGE - Detailed meal planning & tracking
// ============================================

import React, { useState } from 'react';
import { useStore } from '../state/store';
import { Card } from '../ui/components/Card';
import { MealTimeline } from '../ui/components/MealTimeline';
import { ModeSwitcher } from '../ui/components/ModeSwitcher';
import { RecipeModal } from '../ui/components/RecipeModal';
import { useToast } from '../ui/components/Toast';
import { getDayInfo, calculateDynamicTargets, shouldShowPostWorkout } from '../state/persistence';
import { FOOD_DATABASE, getFood } from '../diet/foods';
import { hasRecipe } from '../diet/recipes';
import { DIET_TIPS } from '../diet/tips';
import { TiffinCategory, TIFFIN_CATEGORIES, getTiffinsByCategory } from '../diet/tiffins';
import { FoodId } from '../types';

export function Diet() {
    const todayLog = useStore((state) => state.getTodayLog());
    const mode = useStore((state) => state.mode);
    const targets = useStore((state) => state.targets);
    const calorieCycling = useStore((state) => state.calorieCycling); // Select calorieCycling
    const profile = useStore((state) => state.profile);
    const weightMode = useStore((state) => state.weightMode);
    const toggleGymDay = useStore((state) => state.toggleGymDay);
    const logFood = useStore((state) => state.logFood);
    const { showToast } = useToast();

    const [showTiffinLibrary, setShowTiffinLibrary] = useState(false);
    const [tiffinCategory, setTiffinCategory] = useState<TiffinCategory>('QUICK_RUSH');
    const [selectedRecipe, setSelectedRecipe] = useState<FoodId | null>(null);
    const [expandedTiffinId, setExpandedTiffinId] = useState<string | null>(null);
    const [tipIndex, setTipIndex] = useState(() => Math.floor(Math.random() * DIET_TIPS.length));

    const dayInfo = getDayInfo();

    // Calculate effective targets (Dynamic Calorie Cycling) - Standardized with Dashboard
    const effectiveTargets = React.useMemo(() => {
        // Default to base targets
        let currentTargets = { ...targets };

        if (calorieCycling.enabled) {
            const adjustment = dayInfo.isGymDay
                ? calorieCycling.gymAdjustment
                : calorieCycling.restAdjustment;

            currentTargets.caloriesPerDay += adjustment;
        }

        return {
            protein: currentTargets.proteinPerDay,
            calories: currentTargets.caloriesPerDay,
            carbs: currentTargets.carbsPerDay,
            fat: currentTargets.fatPerDay
        };
    }, [targets, calorieCycling, dayInfo.isGymDay]);

    // Calculate today's macros
    const todayMacros = React.useMemo(() => {
        let protein = 0, carbs = 0, fat = 0, calories = 0, fiber = 0;
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
                    fiber += food.macros.fiber || 0;
                }
            }
        }
        return { protein, carbs, fat, calories, fiber };
    }, [todayLog.eaten]);

    const proteinProgress = Math.min(100, Math.round((todayMacros.protein / effectiveTargets.protein) * 100));
    const calorieProgress = Math.min(100, Math.round((todayMacros.calories / effectiveTargets.calories) * 100));

    return (
        <div className="space-y-5 pb-24">
            {/* Day Type Badge */}
            {/* Day Type Badge - Click to toggle */}
            <div className="text-center">
                <button
                    onClick={toggleGymDay}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:opacity-80 active:scale-95 ${dayInfo.isGymDay
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-blue-500/20 text-blue-400'
                        }`}>
                    {dayInfo.isGymDay ? '💪 Training Day' : '😴 Rest Day'}
                    <span className="text-xs opacity-75">
                        {/* Show dynamic adjustment if enabled, else show generic */}
                        {calorieCycling.enabled
                            ? (dayInfo.isGymDay
                                ? (calorieCycling.gymAdjustment > 0 ? `+${calorieCycling.gymAdjustment}` : `${calorieCycling.gymAdjustment}`)
                                : (calorieCycling.restAdjustment > 0 ? `+${calorieCycling.restAdjustment}` : `${calorieCycling.restAdjustment}`))
                            : ''} kcal
                    </span>
                    <span className="text-xs opacity-50 ml-1">
                        (Tap to switch)
                    </span>
                </button>
            </div>

            {/* Mode Switcher */}
            <ModeSwitcher />

            {/* Macro Progress */}
            {/* Macro Progress - Premium UI */}
            <Card className="relative overflow-hidden border border-[var(--surface-700)] bg-gradient-to-br from-[var(--surface-800)] to-[var(--surface-900)] shadow-xl">
                {/* Background decorative glow */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--primary)]/5 rounded-full blur-3xl"></div>

                <div className="space-y-6 relative">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                            <span>📊</span> Daily Targets
                        </h2>
                    </div>

                    {/* Protein Bar - The Hero */}
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-[var(--text-secondary)] text-sm font-medium">Protein</span>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-xl font-bold text-[var(--primary)]">{todayMacros.protein}g</span>
                                <span className="text-base text-[var(--text-muted)]">/ {effectiveTargets.protein}g</span>
                            </div>
                        </div>
                        <div className="w-full h-4 bg-[var(--surface-950)] rounded-full overflow-hidden border border-white/5 shadow-inner">
                            <div
                                className="h-full bg-[var(--primary)] transition-all duration-700 ease-out relative"
                                style={{ width: `${Math.min(proteinProgress, 100)}%` }}
                            >
                                <div className="absolute inset-0 bg-white/20 opacity-0 animate-pulse-slow"></div>
                            </div>
                        </div>
                    </div>

                    {/* Calories Bar */}
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-[var(--text-secondary)] text-sm font-medium">Calories</span>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-lg font-bold text-[var(--text-primary)]">{todayMacros.calories}</span>
                                <span className="text-sm text-[var(--text-muted)]">/ {effectiveTargets.calories}</span>
                            </div>
                        </div>
                        <div className="w-full h-3 bg-[var(--surface-950)] rounded-full overflow-hidden border border-white/5 shadow-inner">
                            <div
                                className="h-full bg-[var(--text-secondary)] transition-all duration-700 ease-out"
                                style={{ width: `${Math.min(calorieProgress, 100)}%` }}
                            />
                        </div>
                    </div>

                    {/* Mini Stats Grid */}
                    <div className="grid grid-cols-3 gap-3 pt-2">
                        <div className="p-3 bg-[var(--surface-700)]/30 rounded-xl border border-[var(--surface-700)]">
                            <div className="text-xs text-[var(--text-secondary)]">Carbs</div>
                            <div className="text-lg font-bold text-[var(--text-primary)]">{todayMacros.carbs}g</div>
                        </div>
                        <div className="p-3 bg-[var(--surface-700)]/30 rounded-xl border border-[var(--surface-700)]">
                            <div className="text-xs text-[var(--text-secondary)]">Fats</div>
                            <div className="text-lg font-bold text-[var(--text-primary)]">{todayMacros.fat}g</div>
                        </div>
                        <div className="p-3 bg-[var(--surface-700)]/30 rounded-xl border border-[var(--surface-700)]">
                            <div className="text-xs text-[var(--text-secondary)]">Fiber</div>
                            <div className="text-lg font-bold text-[var(--text-primary)]">{todayMacros.fiber}g</div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Meal Timeline */}
            <MealTimeline />

            {/* Daily Diet Tip - Shufflable */}
            <Card className="border-[var(--primary)]/20 bg-[var(--primary)]/5">
                <div className="flex items-start gap-4">
                    <span className="text-3xl animate-bounce-slow grayscale">{DIET_TIPS[tipIndex].emoji}</span>
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="font-bold text-[var(--primary)]">Pro Tip</h3>
                            <button
                                onClick={() => setTipIndex(prev => (prev + 1) % DIET_TIPS.length)}
                                className="text-xs bg-[var(--surface-800)] hover:bg-[var(--surface-700)] text-[var(--text-secondary)] px-2 py-1 rounded-md transition-colors flex items-center gap-1"
                            >
                                <span>🎲</span> Shuffle
                            </button>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                            {DIET_TIPS[tipIndex].text}
                        </p>
                    </div>
                </div>
            </Card>


            {/* Tiffin Library Toggle */}
            {
                mode.includes('COLLEGE') && (
                    <button
                        onClick={() => setShowTiffinLibrary(!showTiffinLibrary)}
                        className="w-full py-3 bg-[var(--surface-800)] hover:bg-[var(--surface-700)] border border-[var(--surface-700)] rounded-xl text-[var(--text-primary)] font-medium transition-colors"
                    >
                        🍱 {showTiffinLibrary ? 'Hide' : 'View'} Tiffin Ideas
                    </button>
                )
            }

            {/* Tiffin Library - Now with Categories & Accordion! */}
            {
                showTiffinLibrary && (
                    <div className="space-y-4">
                        {/* Category Tabs */}
                        <div className="flex gap-2">
                            {(['QUICK_RUSH', 'MEDIUM_TIME', 'MEAL_PREP'] as TiffinCategory[]).map((cat) => {
                                const info = TIFFIN_CATEGORIES[cat];
                                const isActive = tiffinCategory === cat;
                                return (
                                    <button
                                        key={cat}
                                        onClick={() => setTiffinCategory(cat)}
                                        className={`flex-1 py-2 px-2 rounded-xl text-xs font-medium transition-all ${isActive
                                            ? 'bg-[var(--surface-700)] text-[var(--text-primary)] border border-[var(--surface-600)]'
                                            : 'bg-transparent text-[var(--text-secondary)] hover:bg-[var(--surface-800)] border border-transparent'
                                            }`}
                                    >
                                        <span className="mr-1 grayscale">{info.emoji}</span>
                                        <span>{info.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Category Description */}
                        <p className="text-xs text-[var(--text-muted)] text-center">
                            {TIFFIN_CATEGORIES[tiffinCategory].description}
                        </p>

                        <div className="space-y-3">
                            {getTiffinsByCategory(tiffinCategory).map((tiffin) => {
                                const isExpanded = expandedTiffinId === tiffin.id;
                                return (
                                    <div
                                        key={tiffin.id}
                                        onClick={() => setExpandedTiffinId(isExpanded ? null : tiffin.id)}
                                        className={`rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden ${isExpanded
                                            ? 'bg-[var(--surface-800)] border-[var(--surface-600)]'
                                            : 'bg-[var(--surface-800)]/40 border-[var(--surface-700)] hover:bg-[var(--surface-800)]'
                                            }`}
                                    >
                                        <div className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl grayscale opacity-80">{tiffin.emoji}</span>
                                                    <div>
                                                        <div className="font-medium text-[var(--text-primary)]">{tiffin.name}</div>
                                                        <div className="flex items-center gap-2 mt-1 text-xs">
                                                            <span className="text-[var(--text-secondary)]">{tiffin.totalProtein}g protein</span>
                                                            <span className="text-[var(--text-muted)]">•</span>
                                                            <span className="text-[var(--text-muted)]">{tiffin.totalCalories} kcal</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`text-[var(--text-muted)] transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                                                    ▼
                                                </div>
                                            </div>

                                            {/* Expanded Content */}
                                            {isExpanded && (
                                                <div className="mt-4 pt-4 border-t border-[var(--surface-700)] animate-in fade-in slide-in-from-top-2">
                                                    <p className="text-sm text-[var(--text-secondary)] mb-3">{tiffin.prepNote}</p>

                                                    {/* Tip */}
                                                    {tiffin.tip && (
                                                        <div className="text-xs text-[var(--text-muted)] mb-3 flex items-center gap-2 bg-[var(--surface-900)] p-2 rounded-lg border border-[var(--surface-700)]">
                                                            <span>💡</span>
                                                            <span>{tiffin.tip}</span>
                                                        </div>
                                                    )}

                                                    {/* Items with Recipe Links */}
                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {tiffin.items.map((foodId) => {
                                                            const food = getFood(foodId);
                                                            const hasRecipeForItem = hasRecipe(foodId);
                                                            return (
                                                                <span
                                                                    key={foodId}
                                                                    className={`px-2 py-1 bg-[var(--surface-900)] rounded text-xs text-[var(--text-secondary)] border border-[var(--surface-700)] ${hasRecipeForItem ? 'cursor-pointer hover:bg-[var(--surface-800)] hover:border-[var(--text-muted)]' : ''
                                                                        }`}
                                                                    onClick={(e) => {
                                                                        if (hasRecipeForItem) {
                                                                            e.stopPropagation();
                                                                            setSelectedRecipe(foodId);
                                                                        }
                                                                    }}
                                                                >
                                                                    {food.emoji} {food.label}
                                                                    {hasRecipeForItem && ' 📖'}
                                                                </span>
                                                            );
                                                        })}
                                                    </div>

                                                    {/* Quick Add Button */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            tiffin.items.forEach(foodId => {
                                                                logFood('MORNING_SNACK', foodId);
                                                            });
                                                            showToast(`Added ${tiffin.name} to Tiffin! 🍱`, 'success');
                                                        }}
                                                        className="w-full py-2 bg-[var(--surface-700)] hover:bg-[var(--surface-600)] text-[var(--text-primary)] rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 border border-[var(--surface-600)]"
                                                    >
                                                        <span>➕</span>
                                                        <span>Quick Add to Tiffin</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )
            }

            {/* Recipe Modal */}
            <RecipeModal
                foodId={selectedRecipe}
                isOpen={!!selectedRecipe}
                onClose={() => setSelectedRecipe(null)}
            />
        </div >
    );
}

