// ============================================
// TIFFIN IDEAS MODAL - Browse and add tiffin combos
// Categories: Quick Rush, Medium, Meal Prep
// ============================================

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useStore } from '../../state/store';
import { useToast } from './Toast';
import { TIFFIN_CATEGORIES, TIFFIN_IDEAS, TiffinCategory, TiffinIdea } from '../../diet/tiffins';
import { getFood } from '../../diet/foods';
import { hasRecipe } from '../../diet/recipes';

interface TiffinIdeasModalProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenRecipe: (foodId: string) => void;
}

export function TiffinIdeasModal({ isOpen, onClose, onOpenRecipe }: TiffinIdeasModalProps) {
    const [activeCategory, setActiveCategory] = useState<TiffinCategory>('QUICK_RUSH');
    const logFood = useStore((state) => state.logFood);
    const { showToast } = useToast();

    if (!isOpen) return null;

    const filteredTiffins = TIFFIN_IDEAS.filter(t => t.category === activeCategory);
    const categoryInfo = TIFFIN_CATEGORIES[activeCategory];

    const handleQuickAdd = (tiffin: TiffinIdea) => {
        // Add all items to MORNING_SNACK slot
        tiffin.items.forEach(foodId => {
            logFood('MORNING_SNACK', foodId);
        });
        showToast(`Added ${tiffin.name} to Tiffin! 🍱`, 'success');
        onClose();
    };

    const modalContent = (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/90" />

            {/* Modal */}
            <div
                className="relative bg-[#1a1a1a] rounded-2xl w-full max-w-lg max-h-[85vh] overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-[#1a1a1a] p-5 border-b border-zinc-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">🍱</span>
                            <div>
                                <h2 className="text-xl font-bold text-white">Tiffin Ideas</h2>
                                <p className="text-sm text-zinc-400">Quick add to your tiffin slot</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-zinc-400 hover:text-white bg-zinc-800 rounded-full w-8 h-8 flex items-center justify-center"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex gap-2">
                        {(Object.keys(TIFFIN_CATEGORIES) as TiffinCategory[]).map((cat) => {
                            const info = TIFFIN_CATEGORIES[cat];
                            const isActive = activeCategory === cat;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all ${isActive
                                            ? 'bg-teal-500 text-black'
                                            : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                                        }`}
                                >
                                    <span className="mr-1">{info.emoji}</span>
                                    <span className="hidden sm:inline">{info.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Category Description */}
                    <p className="text-xs text-zinc-500 mt-3 text-center">
                        {categoryInfo.emoji} {categoryInfo.description}
                    </p>
                </div>

                {/* Tiffin List */}
                <div className="p-4 space-y-3 overflow-y-auto max-h-[50vh]">
                    {filteredTiffins.map((tiffin) => (
                        <div
                            key={tiffin.id}
                            className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700 hover:border-zinc-600 transition-all"
                        >
                            {/* Header Row */}
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{tiffin.emoji}</span>
                                    <div>
                                        <h3 className="font-semibold text-white">{tiffin.name}</h3>
                                        <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1">
                                            <span className="text-teal-400 font-medium">{tiffin.totalProtein}g protein</span>
                                            <span>•</span>
                                            <span>{tiffin.totalCalories} kcal</span>
                                            <span>•</span>
                                            <span>⏱️ {tiffin.prepTime}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Prep Note */}
                            <p className="text-sm text-zinc-400 mb-3">{tiffin.prepNote}</p>

                            {/* Tip */}
                            {tiffin.tip && (
                                <div className="text-xs text-purple-400 mb-3 flex items-center gap-1">
                                    <span>💡</span>
                                    <span>{tiffin.tip}</span>
                                </div>
                            )}

                            {/* Items */}
                            <div className="flex flex-wrap gap-2 mb-3">
                                {tiffin.items.map((foodId) => {
                                    const food = getFood(foodId);
                                    const hasRecipeForItem = hasRecipe(foodId);
                                    return (
                                        <button
                                            key={foodId}
                                            onClick={() => hasRecipeForItem && onOpenRecipe(foodId)}
                                            className={`px-2 py-1 bg-zinc-700 rounded-lg text-xs flex items-center gap-1 ${hasRecipeForItem ? 'hover:bg-zinc-600 cursor-pointer' : ''
                                                }`}
                                            disabled={!hasRecipeForItem}
                                        >
                                            <span>{food.emoji}</span>
                                            <span className="text-zinc-300">{food.label}</span>
                                            {hasRecipeForItem && <span className="text-teal-400">📖</span>}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Quick Add Button */}
                            <button
                                onClick={() => handleQuickAdd(tiffin)}
                                className="w-full py-2 bg-teal-500 hover:bg-teal-400 text-black rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                            >
                                <span>➕</span>
                                <span>Quick Add to Tiffin</span>
                            </button>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="bg-[#1a1a1a] p-4 border-t border-zinc-700">
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
