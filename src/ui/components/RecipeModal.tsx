// ============================================
// RECIPE MODAL - View cooking instructions
// FIXED: Completely solid background, no transparency
// ============================================

import React from 'react';
import { createPortal } from 'react-dom';
import { FoodId } from '../../types';
import { getRecipe } from '../../diet/recipes';
import { getFood } from '../../diet/foods';

interface RecipeModalProps {
    foodId: FoodId | null;
    isOpen: boolean;
    onClose: () => void;
}

export function RecipeModal({ foodId, isOpen, onClose }: RecipeModalProps) {
    if (!isOpen || !foodId) return null;

    const recipe = getRecipe(foodId);
    const food = getFood(foodId);

    const modalContent = (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            onClick={onClose}
        >
            {/* Solid black backdrop */}
            <div className="absolute inset-0 bg-black" />

            {/* Modal - completely solid, no transparency */}
            <div
                className="relative bg-[#1a1a1a] rounded-2xl w-full max-w-lg max-h-[85vh] overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {!recipe ? (
                    // No recipe available
                    <div className="p-6">
                        <div className="text-center py-4">
                            <span className="text-5xl mb-4 block">{food.emoji}</span>
                            <h2 className="text-xl font-bold text-white mb-2">{food.label}</h2>
                            <p className="text-zinc-400">No recipe needed - ready to eat!</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-full mt-4 py-3 bg-neon-teal text-black rounded-xl font-semibold"
                        >
                            Got it! 👍
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Header - solid background */}
                        <div className="bg-[#1a1a1a] p-5 border-b border-zinc-700">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-4xl">{food.emoji}</span>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">{recipe.name}</h2>
                                        <div className="flex items-center gap-3 text-sm text-zinc-400 mt-1">
                                            <span>⏱️ {recipe.time}</span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs ${recipe.difficulty === 'Easy' ? 'bg-green-900 text-green-300' :
                                                recipe.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-300' :
                                                    'bg-red-900 text-red-300'
                                                }`}>
                                                {recipe.difficulty}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-zinc-400 hover:text-white bg-zinc-800 rounded-full w-8 h-8 flex items-center justify-center text-lg"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Content - solid background */}
                        <div className="p-5 space-y-5 overflow-y-auto max-h-[50vh] bg-[#1a1a1a]">
                            {/* Lazy Tip */}
                            {recipe.lazyTip && (
                                <div className="p-4 bg-teal-950 rounded-xl border border-teal-800">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span>💤</span>
                                        <span className="font-medium text-teal-300">Lazy Mode Tip</span>
                                    </div>
                                    <p className="text-sm text-zinc-300">{recipe.lazyTip}</p>
                                </div>
                            )}

                            {/* Ingredients */}
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">📝 Ingredients</h3>
                                <ul className="space-y-2">
                                    {recipe.ingredients.map((ing, i) => (
                                        <li key={i} className="flex items-center gap-3 text-zinc-300">
                                            <span className="w-2 h-2 bg-teal-400 rounded-full flex-shrink-0" />
                                            {ing}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Steps */}
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">👨‍🍳 Steps</h3>
                                <ol className="space-y-3">
                                    {recipe.steps.map((step, i) => (
                                        <li key={i} className="flex gap-3">
                                            <span className="flex-shrink-0 w-7 h-7 bg-teal-900 rounded-full flex items-center justify-center text-sm font-medium text-teal-300">
                                                {i + 1}
                                            </span>
                                            <span className="text-zinc-300 pt-1">{step}</span>
                                        </li>
                                    ))}
                                </ol>
                            </div>

                            {/* Pro Tip */}
                            {recipe.proTip && (
                                <div className="p-4 bg-purple-950 rounded-xl border border-purple-800">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span>💡</span>
                                        <span className="font-medium text-purple-300">Pro Tip</span>
                                    </div>
                                    <p className="text-sm text-zinc-300">{recipe.proTip}</p>
                                </div>
                            )}

                            {/* Macros */}
                            <div className="p-4 bg-zinc-800 rounded-xl">
                                <h3 className="text-sm font-medium text-zinc-400 mb-2">Nutrition per serving</h3>
                                <div className="grid grid-cols-4 gap-2 text-center">
                                    <div>
                                        <div className="text-lg font-bold text-teal-400">{food.macros.protein}g</div>
                                        <div className="text-xs text-zinc-500">Protein</div>
                                    </div>
                                    <div>
                                        <div className="text-lg font-bold text-white">{food.macros.carbs}g</div>
                                        <div className="text-xs text-zinc-500">Carbs</div>
                                    </div>
                                    <div>
                                        <div className="text-lg font-bold text-white">{food.macros.fat}g</div>
                                        <div className="text-xs text-zinc-500">Fat</div>
                                    </div>
                                    <div>
                                        <div className="text-lg font-bold text-white">{food.macros.calories}</div>
                                        <div className="text-xs text-zinc-500">kcal</div>
                                    </div>
                                </div>

                                {/* Portion Note */}
                                {recipe.portionNote && (
                                    <div className="mt-3 pt-3 border-t border-zinc-700">
                                        <div className="flex items-center gap-2 text-sm">
                                            <span>📏</span>
                                            <span className="text-zinc-300">{recipe.portionNote}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer - solid background */}
                        <div className="bg-[#1a1a1a] p-4 border-t border-zinc-700">
                            <button
                                onClick={onClose}
                                className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-black rounded-xl font-semibold transition-colors"
                            >
                                Got it! 👍
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
