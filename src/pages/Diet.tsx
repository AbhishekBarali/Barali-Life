// ============================================
// DIET PAGE - Meal planning and tracking
// FIXED: Progress bar shows actual % (not capped at 100)
// ============================================

import React from 'react';
import { useStore } from '../state/store';
import { selectTodayMacros } from '../state/selectors';
import { getDayInfo } from '../state/persistence';
import { Card } from '../ui/components/Card';
import { ModeSwitcher } from '../ui/components/ModeSwitcher';
import { MealTimeline } from '../ui/components/MealTimeline';
import { MODE_LABELS, WORKOUT_LABELS } from '../types';

export function Diet() {
    const todayLog = useStore((state) => state.getTodayLog());
    const targets = useStore((state) => state.targets);
    const mode = useStore((state) => state.mode);

    const dayInfo = getDayInfo();
    const todayMacros = selectTodayMacros(todayLog);

    // Calculate actual percentage (can go above 100%)
    const proteinProgress = Math.round((todayMacros.protein / targets.proteinPerDay) * 100);
    // For progress bar width, cap at 100%
    const progressBarWidth = Math.min(100, proteinProgress);
    // Show different color when over target
    const isOverTarget = proteinProgress > 100;

    return (
        <div className="space-y-6 pb-24">
            {/* Header - Vibrant */}
            <div className="text-center py-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-teal via-green-400 to-neon-teal bg-clip-text text-transparent">
                    Diet Plan
                </h1>
                <p className="text-zinc-400 mt-1">{dayInfo.dayName}, {dayInfo.date}</p>
                {dayInfo.isGymDay && (
                    <span className="inline-block mt-2 px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm font-medium">
                        💪 {WORKOUT_LABELS[dayInfo.workoutType]} Day
                    </span>
                )}
            </div>

            {/* Mode Switcher */}
            <Card className="border-white/10">
                <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Current Mode</div>
                <ModeSwitcher />
            </Card>

            {/* Macro Summary - Shows actual percentage */}
            <Card className={`
                bg-gradient-to-br border shadow-lg
                ${isOverTarget
                    ? 'from-green-500/20 via-surface-800 to-emerald-500/10 border-green-500/40 shadow-green-500/20'
                    : 'from-neon-teal/20 via-surface-800 to-purple-500/10 border-neon-teal/30 shadow-neon-teal/10'}
            `}>
                {/* Progress bar at top */}
                <div className="mb-4">
                    <div className="flex justify-between text-xs text-zinc-400 mb-1">
                        <span>Protein Progress</span>
                        <span className={`font-bold ${isOverTarget ? 'text-green-400' : 'text-neon-teal'}`}>
                            {proteinProgress}%
                            {isOverTarget && ' 🎉'}
                        </span>
                    </div>
                    <div className="h-3 bg-surface-700 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 relative ${isOverTarget
                                ? 'bg-gradient-to-r from-green-400 via-emerald-400 to-green-500'
                                : 'bg-gradient-to-r from-neon-teal via-green-400 to-emerald-400'
                                }`}
                            style={{ width: `${progressBarWidth}%` }}
                        >
                            <div className="absolute inset-0 bg-white/20 animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* Macro grid */}
                <div className="grid grid-cols-4 gap-3">
                    <div className="text-center p-3 bg-surface-800/50 rounded-xl">
                        <div className={`text-2xl font-bold ${isOverTarget ? 'text-green-400' : 'text-neon-teal'}`}>
                            {todayMacros.protein}g
                        </div>
                        <div className="text-xs text-zinc-500 mt-1">Protein</div>
                    </div>
                    <div className="text-center p-3 bg-surface-800/50 rounded-xl">
                        <div className="text-2xl font-bold text-white">{todayMacros.carbs}g</div>
                        <div className="text-xs text-zinc-500 mt-1">Carbs</div>
                    </div>
                    <div className="text-center p-3 bg-surface-800/50 rounded-xl">
                        <div className="text-2xl font-bold text-white">{todayMacros.fat}g</div>
                        <div className="text-xs text-zinc-500 mt-1">Fat</div>
                    </div>
                    <div className="text-center p-3 bg-surface-800/50 rounded-xl">
                        <div className="text-2xl font-bold text-white">{todayMacros.calories}</div>
                        <div className="text-xs text-zinc-500 mt-1">kcal</div>
                    </div>
                </div>

                {/* Target message */}
                <div className="mt-4 text-center text-sm">
                    {isOverTarget ? (
                        <span className="text-green-400">
                            🏆 Goal exceeded by {todayMacros.protein - targets.proteinPerDay}g! Amazing!
                        </span>
                    ) : (
                        <span className="text-yellow-400/80">
                            ⚡ {targets.proteinPerDay - todayMacros.protein}g more protein to hit your goal!
                        </span>
                    )}
                </div>
            </Card>

            {/* Meal Timeline */}
            <div>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <span>🍽️</span>
                    <span>Today's Meals</span>
                </h2>
                <MealTimeline />
            </div>


        </div>
    );
}
