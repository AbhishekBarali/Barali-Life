// ============================================
// MEAL TIMELINE - Vibrant meal display
// ADDED: Quick Add Food button for each meal
// ============================================

import React, { useState } from 'react';
import { useStore } from '../../state/store';
import { MealSlot, FoodId, MODE_MEAL_LABELS, MODE_MEAL_TIMES, MODE_MEAL_ORDER } from '../../types';
import { Card } from './Card';
import { FoodRow } from './FoodRow';
import { SwapModal } from './SwapModal';
import { BlacklistWarningModal } from './BlacklistWarningModal';
import { QuickAddFoodModal } from './QuickAddFoodModal';
import { useToast } from './Toast';
import { isBlacklisted } from '../../diet/blacklist';
import { getFood, FOOD_DATABASE } from '../../diet/foods';

// Slot icons for visual appeal
const SLOT_ICONS: Record<MealSlot, string> = {
    BREAKFAST: '🌅',
    MORNING_SNACK: '☕',
    LUNCH: '🍽️',
    EVENING_SNACK: '🍎',
    DINNER: '🌙',
};

export function MealTimeline() {
    const todayLog = useStore((state) => state.getTodayLog());
    const mode = useStore((state) => state.mode);
    const blacklist = useStore((state) => state.blacklist);
    const inventory = useStore((state) => state.inventory);
    const logFood = useStore((state) => state.logFood);
    const unlogFood = useStore((state) => state.unlogFood);

    // Get mode-specific meal times and labels
    const mealTimes = MODE_MEAL_TIMES[mode];
    const mealLabels = MODE_MEAL_LABELS[mode];
    const swapFood = useStore((state) => state.swapFood);
    const dispatch = useStore((state) => state.dispatch);
    const { showToast } = useToast();

    const [swapInfo, setSwapInfo] = useState<{ slot: MealSlot; foodId: FoodId; originalId?: FoodId } | null>(null);
    const [warningFood, setWarningFood] = useState<{ slot: MealSlot; foodId: FoodId } | null>(null);
    const [showQuickAdd, setShowQuickAdd] = useState(false);

    // Dynamic slot order based on mode
    const mealSlots: MealSlot[] = MODE_MEAL_ORDER[mode];

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

    // Check if food is eaten
    const isFoodEaten = (slot: MealSlot, foodId: FoodId) => {
        return todayLog.eaten.some(e => e.slot === slot && e.foodId === foodId);
    };

    // Handle toggle eaten
    const handleToggleEaten = (slot: MealSlot, foodId: FoodId) => {
        if (isFoodEaten(slot, foodId)) {
            unlogFood(slot, foodId);
            showToast('❌ Removed', 'info');
        } else {
            if (isBlacklisted(foodId, blacklist)) {
                setWarningFood({ slot, foodId });
            } else {
                logFood(slot, foodId);
                const food = getFood(foodId);
                showToast(`${food.emoji} +${food.macros.protein}g protein!`, 'success');
            }
        }
    };

    // Confirm junk food - triggers Damage Control
    const handleConfirmJunk = () => {
        if (warningFood) {
            logFood(warningFood.slot, warningFood.foodId);
            showToast('⚠️ Logged! Damage Control activated for next meal.', 'warning');
            setWarningFood(null);
        }
    };

    // Handle swap
    const handleSwap = (from: FoodId, to: FoodId) => {
        if (swapInfo) {
            swapFood(swapInfo.slot, from, to);
            const toFood = getFood(to);
            showToast(`🔄 Swapped to ${toFood.label}!`, 'success');
            setSwapInfo(null);
        }
    };

    // Get status for each meal
    const getMealStatus = (slot: MealSlot): 'done' | 'current' | 'upcoming' => {
        const slotIndex = mealSlots.indexOf(slot);
        const currentIndex = mealSlots.indexOf(currentSlot);

        const hasEaten = todayLog.eaten.some(e => e.slot === slot);
        if (hasEaten && slotIndex < currentIndex) return 'done';
        if (slot === currentSlot) return 'current';
        return slotIndex < currentIndex ? 'done' : 'upcoming';
    };

    // Calculate protein for a slot
    const getSlotProtein = (slot: MealSlot): number => {
        return todayLog.eaten
            .filter(e => e.slot === slot)
            .reduce((sum, e) => {
                if (e.foodId === 'CUSTOM' && e.customFood) {
                    return sum + e.customFood.protein;
                } else if (e.foodId !== 'CUSTOM') {
                    return sum + (FOOD_DATABASE[e.foodId]?.macros.protein || 0);
                }
                return sum;
            }, 0);
    };

    return (
        <div className="space-y-4">
            {/* Action Buttons Row */}
            <div className="flex gap-3">
                {/* Quick Add Button */}
                <button
                    onClick={() => setShowQuickAdd(true)}
                    className="flex-1 py-3 bg-gradient-to-r from-neon-teal/20 to-green-500/20 hover:from-neon-teal/30 hover:to-green-500/30 border-2 border-dashed border-neon-teal/40 rounded-xl text-neon-teal font-semibold transition-all flex items-center justify-center gap-2"
                >
                    <span>➕</span>
                    <span>Quick Add</span>
                </button>

                {/* Shuffle Button */}
                <button
                    onClick={() => {
                        dispatch({ type: 'SHUFFLE_DAY' });
                        showToast('🔀 Meals shuffled!', 'success');
                    }}
                    className="px-5 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border-2 border-dashed border-purple-500/40 rounded-xl text-purple-400 font-semibold transition-all flex items-center justify-center gap-2"
                >
                    <span>🔀</span>
                    <span>Shuffle</span>
                </button>
            </div>

            {mealSlots.map(slot => {
                const meal = todayLog.meals[slot];
                if (!meal) return null;

                const status = getMealStatus(slot);
                const eatenCount = todayLog.eaten.filter(e => e.slot === slot).length;
                const slotProtein = getSlotProtein(slot);

                // Find extra items (logged but not in plan)
                const extraEaten = todayLog.eaten.filter(e =>
                    e.slot === slot &&
                    !meal.items.some(i => i.id === e.foodId)
                );

                return (
                    <Card
                        key={slot}
                        status={status as 'current' | 'done' | 'default'}
                        className="animate-fade-in"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <span className="text-xl">
                                    {SLOT_ICONS[slot]}
                                </span>
                                <div>
                                    <div className={`font-semibold text-lg ${status === 'current' ? 'text-white' : 'text-zinc-200'}`}>
                                        {mealLabels[slot]}
                                    </div>
                                    <div className="text-xs text-zinc-500">{mealTimes[slot]}</div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="text-right">
                                {eatenCount > 0 && (
                                    <div className="text-sm text-primary font-medium">
                                        +{slotProtein}g protein
                                    </div>
                                )}
                                {eatenCount > 0 && (
                                    <div className="text-xs text-zinc-500">
                                        {eatenCount} logged
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Meal note/intention */}
                        {meal.note && status === 'current' && (
                            <div className="mb-4 px-3 py-2 bg-primary/5 rounded-lg border border-primary/10">
                                <span className="text-sm text-primary/80">💡 {meal.note}</span>
                            </div>
                        )}

                        {/* Damage Control indicator */}
                        {meal.intention === 'DAMAGE_CONTROL' && (
                            <div className="mb-4 px-3 py-2 bg-warning/5 rounded-lg border border-warning/10">
                                <span className="text-sm text-warning">⚠️ Damage Control - High protein!</span>
                            </div>
                        )}

                        {/* Food items */}
                        <div className="space-y-2">
                            {meal.items.map(food => (
                                <FoodRow
                                    key={food.id}
                                    food={food}
                                    slot={slot}
                                    isEaten={isFoodEaten(slot, food.id)}
                                    intention={meal.intention}
                                    onToggleEaten={() => handleToggleEaten(slot, food.id)}
                                    onSwap={() => setSwapInfo({
                                        slot,
                                        foodId: food.id,
                                        originalId: food.originalId, // Pass original if food was swapped
                                    })}

                                />
                            ))}
                        </div>

                        {/* Extra Logged Items */}
                        {extraEaten.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                                <div className="text-xs text-zinc-500 font-medium px-1 uppercase tracking-wider">
                                    Extra / Custom
                                </div>
                                {extraEaten.map((entry) => {
                                    const food = entry.customFood ? {
                                        id: entry.foodId,
                                        emoji: '🍽️',
                                        label: entry.customFood.name,
                                        qty: entry.qty || 1,
                                        unit: 'serving',
                                        tags: ['custom'],
                                        macros: entry.customFood
                                    } : getFood(entry.foodId);

                                    return (
                                        <FoodRow
                                            key={entry.foodId}
                                            food={food}
                                            slot={slot}
                                            isEaten={true}
                                            intention={meal.intention}
                                            onToggleEaten={() => handleToggleEaten(slot, entry.foodId)}

                                        />
                                    );
                                })}
                            </div>
                        )}
                    </Card>
                );
            })}

            {/* Quick Add Food Modal */}
            <QuickAddFoodModal
                isOpen={showQuickAdd}
                onClose={() => setShowQuickAdd(false)}
            />

            {/* Swap Modal */}
            <SwapModal
                isOpen={!!swapInfo}
                foodId={swapInfo?.foodId || null}
                originalId={swapInfo?.originalId}
                availableFoodIds={inventory.availableFoodIds}
                intention={swapInfo ? todayLog.meals[swapInfo.slot]?.intention || 'BALANCED' : 'BALANCED'}
                onSwap={handleSwap}
                onClose={() => setSwapInfo(null)}
            />

            {/* Blacklist Warning Modal */}
            <BlacklistWarningModal
                isOpen={!!warningFood}
                food={warningFood ? getFood(warningFood.foodId) : null}
                onConfirm={handleConfirmJunk}
                onCancel={() => setWarningFood(null)}
            />
        </div>
    );
}
