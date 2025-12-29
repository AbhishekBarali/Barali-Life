// ============================================
// SWAP MODAL - With Reset to Original option
// FIXED: Shows original food's alternatives + Reset button
// ============================================

import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import { FoodId, MealIntention, MealItem } from '../../types';
import { getSwapOptions, SwapOption } from '../../diet/swapper';
import { getFood } from '../../diet/foods';

interface SwapModalProps {
    isOpen: boolean;
    foodId: FoodId | null;
    originalId?: FoodId; // If food has been swapped, this is the original
    availableFoodIds: FoodId[];
    intention: MealIntention;
    onSwap: (from: FoodId, to: FoodId) => void;
    onClose: () => void;
}

export function SwapModal({
    isOpen,
    foodId,
    originalId,
    availableFoodIds,
    intention,
    onSwap,
    onClose
}: SwapModalProps) {
    // Store the current foodId in a ref to prevent issues during render
    const currentFoodIdRef = useRef<FoodId | null>(null);

    if (isOpen && foodId && currentFoodIdRef.current !== foodId) {
        currentFoodIdRef.current = foodId;
    }

    if (!isOpen) {
        currentFoodIdRef.current = null;
    }

    if (!isOpen || !foodId) return null;

    const food = getFood(foodId);

    // If there's an original food (has been swapped), show ORIGINAL's alternatives
    // Otherwise show current food's alternatives
    const swapForId = originalId || foodId;
    const swapOptions = getSwapOptions(swapForId, availableFoodIds, intention);

    // Filter out the current food from options (can't swap to itself)
    const filteredOptions = swapOptions.filter(opt => opt.foodId !== foodId);

    // If food was swapped, add Reset option at top
    const hasBeenSwapped = Boolean(originalId);
    const originalFood = originalId ? getFood(originalId) : null;

    const handleSelectOption = (targetFoodId: FoodId) => {
        const currentId = currentFoodIdRef.current;
        if (!currentId) return;

        onSwap(currentId, targetFoodId);
    };

    const handleReset = () => {
        if (!originalId) return;
        const currentId = currentFoodIdRef.current;
        if (!currentId) return;

        onSwap(currentId, originalId);
    };

    const handleClose = () => {
        currentFoodIdRef.current = null;
        onClose();
    };

    const modalContent = (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative bg-zinc-900 rounded-t-3xl sm:rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden border border-white/10 shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 bg-zinc-900 p-5 border-b border-white/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">{food.emoji}</span>
                            <div>
                                <h2 className="text-lg font-bold text-white">Swap {food.label}</h2>
                                <p className="text-sm text-neon-teal">{food.macros.protein}g protein</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-zinc-400 hover:text-white p-2 bg-surface-700 rounded-full w-8 h-8 flex items-center justify-center"
                        >
                            ✕
                        </button>
                    </div>
                    {hasBeenSwapped && originalFood && (
                        <p className="text-xs text-zinc-500 mt-2">
                            Swapped from: {originalFood.emoji} {originalFood.label}
                        </p>
                    )}
                </div>

                {/* Options */}
                <div className="p-4 space-y-2 overflow-y-auto max-h-[50vh]">
                    {/* Reset to Original - compact button at top */}
                    {hasBeenSwapped && originalFood && (
                        <button
                            type="button"
                            onClick={handleReset}
                            className="w-full flex items-center gap-3 p-3 rounded-xl transition-all bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600"
                        >
                            <span className="text-lg">↩️</span>
                            <div className="flex-1 text-left">
                                <div className="text-sm text-zinc-300">
                                    Reset to <span className="text-white font-medium">{originalFood.label}</span>
                                </div>
                            </div>
                            <span className="text-xs text-zinc-500">{originalFood.macros.protein}g</span>
                        </button>
                    )}

                    {/* Subtle separator if showing reset */}
                    {hasBeenSwapped && filteredOptions.length > 0 && (
                        <div className="h-px bg-white/5 my-2"></div>
                    )}

                    {/* Regular swap options */}
                    {filteredOptions.map((option) => (
                        <button
                            key={option.foodId}
                            type="button"
                            onClick={() => handleSelectOption(option.foodId)}
                            className={`
                                w-full flex items-center gap-4 p-4 rounded-xl transition-all
                                ${option.available
                                    ? 'bg-surface-700 hover:bg-surface-600 hover:scale-[1.02]'
                                    : 'bg-surface-800/30 opacity-50'}
                            `}
                        >
                            <span className="text-3xl">{option.food.emoji}</span>
                            <div className="flex-1 text-left">
                                <div className="font-medium text-white">
                                    {option.food.label}
                                    {option.available && (
                                        <span className="ml-2 text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
                                            ✓ In stock
                                        </span>
                                    )}
                                </div>
                                <div className="text-sm text-zinc-400">{option.hint}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-neon-teal font-bold text-lg">{option.food.macros.protein}g</div>
                                <div className="text-xs text-zinc-500">protein</div>
                            </div>
                        </button>
                    ))}

                    {/* No options message */}
                    {filteredOptions.length === 0 && !hasBeenSwapped && (
                        <div className="text-center py-8 text-zinc-400">
                            <span className="text-5xl mb-4 block">{food.emoji}</span>
                            <p>No alternatives available for {food.label}</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-zinc-900 p-4 border-t border-white/10">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="w-full py-3 bg-surface-700 hover:bg-surface-600 text-white rounded-xl font-medium transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
