// ============================================
// DIET PAGE - Detailed meal planning & tracking
// ============================================

import React, { useState } from 'react';
import { useStore } from '../state/store';
import { Card } from '../ui/components/Card';
import { MealTimeline } from '../ui/components/MealTimeline';
import { ModeSwitcher } from '../ui/components/ModeSwitcher';
import { useToast } from '../ui/components/Toast';
import { getDayInfo, calculateDynamicTargets, shouldShowPostWorkout } from '../state/persistence';
import { FOOD_DATABASE } from '../diet/foods';
import { DIET_TIPS } from '../diet/tips';

export function Diet() {
    const todayLog = useStore((state) => state.getTodayLog());
    const mode = useStore((state) => state.mode);
    const targets = useStore((state) => state.targets);
    const calorieCycling = useStore((state) => state.calorieCycling); // Select calorieCycling
    const profile = useStore((state) => state.profile);
    const weightMode = useStore((state) => state.weightMode);
    const toggleGymDay = useStore((state) => state.toggleGymDay);
    const { showToast } = useToast();

    const [showTiffinLibrary, setShowTiffinLibrary] = useState(false);
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
            <Card className="relative overflow-hidden border border-white/5 bg-gradient-to-br from-surface-800 to-surface-900 shadow-xl">
                {/* Background decorative glow */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>

                <div className="space-y-6 relative">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <span>📊</span> Daily Targets
                        </h2>
                        <div className="text-xs text-zinc-400 bg-surface-700/50 px-2 py-1 rounded-lg">
                            {Math.round(todayMacros.calories / effectiveTargets.calories * 100)}% Complete
                        </div>
                    </div>

                    {/* Protein Bar - The Hero */}
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-zinc-400 text-sm font-medium">Protein</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-neon-teal">{todayMacros.protein}g</span>
                                <span className="text-sm text-zinc-500">/ {effectiveTargets.protein}g</span>
                            </div>
                        </div>
                        <div className="w-full h-4 bg-surface-950 rounded-full overflow-hidden border border-white/5 shadow-inner">
                            <div
                                className="h-full bg-gradient-to-r from-teal-600 via-neon-teal to-emerald-400 transition-all duration-700 ease-out relative"
                                style={{ width: `${Math.min(proteinProgress, 100)}%` }}
                            >
                                <div className="absolute inset-0 bg-white/20 opacity-0 animate-pulse-slow"></div>
                            </div>
                        </div>
                    </div>

                    {/* Calories Bar */}
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-zinc-400 text-sm font-medium">Calories</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-bold text-white">{todayMacros.calories}</span>
                                <span className="text-sm text-zinc-500">/ {effectiveTargets.calories}</span>
                            </div>
                        </div>
                        <div className="w-full h-3 bg-surface-950 rounded-full overflow-hidden border border-white/5 shadow-inner">
                            <div
                                className="h-full bg-gradient-to-r from-orange-500 to-yellow-400 transition-all duration-700 ease-out"
                                style={{ width: `${Math.min(calorieProgress, 100)}%` }}
                            />
                        </div>
                    </div>

                    {/* Mini Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="p-3 bg-surface-700/30 rounded-xl border border-white/5 flex items-center justify-between">
                            <div>
                                <div className="text-xs text-zinc-400">Carbs</div>
                                <div className="text-lg font-bold text-blue-400">{todayMacros.carbs}g</div>
                            </div>
                        </div>
                        <div className="p-3 bg-surface-700/30 rounded-xl border border-white/5 flex items-center justify-between">
                            <div>
                                <div className="text-xs text-zinc-400">Fats</div>
                                <div className="text-lg font-bold text-purple-400">{todayMacros.fat}g</div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Meal Timeline */}
            <MealTimeline />

            {/* Training Day Nutrition Note - Moved to bottom */}
            {/* Daily Diet Tip - Shufflable */}
            <Card className="border-neon-teal/20 bg-neon-teal/5">
                <div className="flex items-start gap-4">
                    <span className="text-3xl animate-bounce-slow">{DIET_TIPS[tipIndex].emoji}</span>
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="font-bold text-neon-teal">Pro Tip</h3>
                            <button
                                onClick={() => setTipIndex(prev => (prev + 1) % DIET_TIPS.length)}
                                className="text-xs bg-surface-800 hover:bg-surface-700 text-zinc-300 px-2 py-1 rounded-md transition-colors flex items-center gap-1"
                            >
                                <span>🎲</span> Shuffle
                            </button>
                        </div>
                        <p className="text-sm text-zinc-300 leading-relaxed">
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
                        className="w-full py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-xl text-purple-400 font-medium transition-colors"
                    >
                        🍱 {showTiffinLibrary ? 'Hide' : 'View'} Tiffin Ideas
                    </button>
                )
            }

            {/* Tiffin Library */}
            {
                showTiffinLibrary && (
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-white">Tiffin Library (≥20g protein)</h3>
                        {TIFFIN_OPTIONS.map((option, i) => (
                            <Card key={i} className="border-purple-500/20">
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">{option.emoji}</span>
                                    <div className="flex-1">
                                        <div className="font-medium text-white">{option.name}</div>
                                        <div className="text-sm text-zinc-400 mt-1">{option.contents}</div>
                                        <div className="flex items-center gap-3 mt-2 text-xs">
                                            <span className="text-green-400 font-medium">~{option.protein}g protein</span>
                                            <span className="text-zinc-500">⏱ {option.packTime}</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )
            }
        </div >
    );
}

// Tiffin options data
const TIFFIN_OPTIONS = [
    {
        emoji: '🥚',
        name: '2 Boiled Eggs + Dahi',
        contents: '2 boiled eggs + dahi 200g',
        protein: 20,
        packTime: '2 min',
    },
    {
        emoji: '🥚',
        name: '3 Boiled Eggs + Fruit',
        contents: '3 boiled eggs + apple/banana + milk 200ml',
        protein: 25,
        packTime: '3 min',
    },
    {
        emoji: '🍗',
        name: 'Chicken + Roti',
        contents: 'Chicken pieces 100g + roti 1',
        protein: 30,
        packTime: '5 min',
    },
    {
        emoji: '🫘',
        name: 'Soya Chunks (Dry)',
        contents: 'Soya chunks 40g (dry masala) + cucumber',
        protein: 21,
        packTime: '5 min',
    },
    {
        emoji: '🧀',
        name: 'Paneer + Apple',
        contents: 'Paneer 120g + apple',
        protein: 22,
        packTime: '2 min',
    },
    {
        emoji: '🥣',
        name: 'Dahi + Chana + Egg',
        contents: 'Dahi 250g + roasted chana 40g + 1 egg',
        protein: 24,
        packTime: '3 min',
    },
    {
        emoji: '🥜',
        name: 'PB Sandwich + Milk',
        contents: 'Bread 2 + peanut butter 30g + milk 250ml',
        protein: 24,
        packTime: '3 min',
    },
    {
        emoji: '🍳',
        name: 'Roti Omelette Roll',
        contents: 'Roti 1 + omelette (2 eggs) + dahi 100g',
        protein: 22,
        packTime: '5 min',
    },
    {
        emoji: '🥣',
        name: 'Overnight Oats',
        contents: 'Oats 50g + milk 250ml + dahi 100g + nuts',
        protein: 24,
        packTime: 'Night before',
    },
    {
        emoji: '🫘',
        name: 'Chickpea (Chana) Sadeko',
        contents: 'Boiled chana 200g + onion + tomato + lemon',
        protein: 15,
        packTime: '5 min',
    },
    {
        emoji: '🌭',
        name: 'Soya Chilli',
        contents: 'Fried soya chunks 50g with capsicum/onion',
        protein: 26,
        packTime: '10 min',
    },
    {
        emoji: '🥞',
        name: 'Besan Cheela (Pancakes)',
        contents: 'Besan 50g + dahi 100g + veggies',
        protein: 15,
        packTime: '10 min',
    },
    {
        emoji: '🥤',
        name: 'Satu Shake (Power Drink)',
        contents: 'Satu 4 tbsp + water/milk + sugar/honey',
        protein: 18,
        packTime: '1 min',
    },
    {
        emoji: '🥪',
        name: 'Egg Bhurji Sandwich',
        contents: '2 Brown bread + 2 egg bhurji',
        protein: 18,
        packTime: '5 min',
    },
    {
        emoji: '🥗',
        name: 'Sprouts Salad',
        contents: 'Sprouted moong 1 bowl + paneer cubes',
        protein: 15,
        packTime: '2 min',
    },
    {
        emoji: '🥜',
        name: 'Roasted Peanuts Pack',
        contents: 'Peanuts 50g + Apple + Dahi cup',
        protein: 16,
        packTime: '1 min',
    }
];
