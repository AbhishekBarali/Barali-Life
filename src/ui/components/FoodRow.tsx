// ============================================
// FOOD ROW - Premium food item display
// ============================================

import React, { useState } from 'react';
import { FoodItem, FoodId, MealSlot, MealIntention } from '../../types';
import { hasRecipe } from '../../diet/recipes';
import { RecipeModal } from './RecipeModal';

interface FoodRowProps {
    food: FoodItem;
    slot: MealSlot;
    isEaten: boolean;
    intention: MealIntention;
    onToggleEaten: () => void;
    onSwap?: () => void;
}

export function FoodRow({ food, slot, isEaten, intention, onToggleEaten, onSwap }: FoodRowProps) {
    const [showRecipe, setShowRecipe] = useState(false);
    const hasRecipeAvailable = hasRecipe(food.id);

    return (
        <>
            <div
                className={`
                    flex items-center gap-3 p-3 rounded-xl transition-all duration-150
                    ${isEaten
                        ? 'bg-primary/10 border border-primary/20'
                        : 'bg-surface-700/50 hover:bg-surface-600/70 border border-transparent'}
                `}
            >
                {/* Clickable food area */}
                <button
                    onClick={onToggleEaten}
                    className="flex items-center gap-3 flex-1 text-left group"
                >
                    {/* Emoji */}
                    <span className={`text-2xl transition-transform group-hover:scale-105 ${isEaten ? '' : 'opacity-90'}`}>
                        {food.emoji}
                    </span>

                    <div className="flex-1 min-w-0">
                        <div className={`font-medium text-[15px] flex items-center gap-2 ${isEaten ? 'text-primary' : 'text-white'}`}>
                            {food.label}
                            {isEaten && (
                                <span className="inline-flex items-center justify-center w-4 h-4 bg-primary text-bg-base text-[10px] font-bold rounded-full">
                                    ✓
                                </span>
                            )}
                        </div>
                        <div className="text-[13px] text-zinc-500">
                            {food.qty} {food.unit} • <span className="text-primary/80">{food.macros.protein}g protein</span>
                        </div>
                    </div>
                </button>

                {/* Action buttons */}
                <div className="flex items-center gap-0.5">
                    {/* Recipe button */}
                    {hasRecipeAvailable && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowRecipe(true);
                            }}
                            className="p-2 text-secondary/70 hover:text-secondary hover:bg-secondary/10 rounded-lg transition-all"
                            title="View Recipe"
                        >
                            📖
                        </button>
                    )}

                    {/* Swap button */}
                    {onSwap && !isEaten && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onSwap();
                            }}
                            className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                            title="Swap"
                        >
                            🔄
                        </button>
                    )}
                </div>

                {/* Macros - Right side */}
                <div className="text-right pl-3 border-l border-white/5">
                    <div className={`text-base font-semibold ${isEaten ? 'text-primary' : 'text-primary/90'}`}>
                        {food.macros.protein}g
                    </div>
                    <div className="text-[11px] text-zinc-600">{food.macros.calories} kcal</div>
                </div>
            </div>

            {/* Recipe Modal */}
            <RecipeModal
                foodId={showRecipe ? food.id : null}
                isOpen={showRecipe}
                onClose={() => setShowRecipe(false)}
            />
        </>
    );
}

// Compact food chip for quick display
export function FoodChip({ food, onClick }: { food: FoodItem; onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 px-3 py-1.5 bg-surface-700/60 hover:bg-surface-600/80 rounded-full text-sm transition-all border border-white/5 hover:border-white/10"
        >
            <span>{food.emoji}</span>
            <span className="text-white font-medium">{food.label}</span>
            <span className="text-primary/80 text-xs">+{food.macros.protein}g</span>
        </button>
    );
}
