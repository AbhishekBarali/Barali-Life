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
    const [expandedId, setExpandedId] = useState<string | null>(null); // Track expanded card
    const logFood = useStore((state) => state.logFood);
    const { showToast } = useToast();

    if (!isOpen) return null;

    const filteredTiffins = TIFFIN_IDEAS.filter(t => t.category === activeCategory);
    const categoryInfo = TIFFIN_CATEGORIES[activeCategory];

    const handleQuickAdd = (tiffin: TiffinIdea, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent toggling expansion
        // Add all items to MORNING_SNACK slot
        tiffin.items.forEach(foodId => {
            logFood('MORNING_SNACK', foodId);
        });
        showToast(`Added ${tiffin.name} to Tiffin! 🍱`, 'success');
        onClose();
    };

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
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
                <div className="bg-[var(--bg-elevated)] p-5 border-b border-[var(--surface-700)]">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl grayscale">🍱</span>
                            <div>
                                <h2 className="text-xl font-bold text-[var(--text-primary)]">Tiffin Ideas</h2>
                                <p className="text-sm text-[var(--text-secondary)]">Quick add to your tiffin slot</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--surface-800)] rounded-full w-8 h-8 flex items-center justify-center"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Category Tabs - Monotonous Style */}
                    <div className="flex gap-2">
                        {(Object.keys(TIFFIN_CATEGORIES) as TiffinCategory[]).map((cat) => {
                            const info = TIFFIN_CATEGORIES[cat];
                            const isActive = activeCategory === cat;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all border ${isActive
                                        ? 'bg-[var(--surface-700)] text-[var(--text-primary)] border-[var(--surface-600)]'
                                        : 'bg-transparent text-[var(--text-secondary)] border-transparent hover:bg-[var(--surface-800)]'
                                        }`}
                                >
                                    <span className="mr-1 grayscale">{info.emoji}</span>
                                    <span className="hidden sm:inline">{info.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Category Description */}
                    <p className="text-xs text-[var(--text-muted)] mt-3 text-center">
                        {categoryInfo.description}
                    </p>
                </div>

                {/* Tiffin List - Accordion Style */}
                <div className="p-4 space-y-3 overflow-y-auto max-h-[50vh] bg-[var(--bg-base)]">
                    {filteredTiffins.map((tiffin) => {
                        const isExpanded = expandedId === tiffin.id;
                        return (
                            <div
                                key={tiffin.id}
                                onClick={() => toggleExpand(tiffin.id)}
                                className={`p-3 rounded-xl border transition-all cursor-pointer ${isExpanded
                                    ? 'bg-[var(--surface-800)] border-[var(--surface-600)]'
                                    : 'bg-[var(--surface-800)]/40 border-[var(--surface-700)] hover:bg-[var(--surface-800)]'
                                    }`}
                            >
                                {/* Header Row (Always Visible) */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl grayscale opacity-80">{tiffin.emoji}</span>
                                        <div>
                                            <h3 className="font-semibold text-[var(--text-primary)] text-sm">{tiffin.name}</h3>
                                            <div className="text-xs text-[var(--text-secondary)]">
                                                <span className="font-medium">{tiffin.totalProtein}g protein</span>
                                                <span className="mx-1">•</span>
                                                <span>{tiffin.totalCalories} kcal</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`text-[var(--text-secondary)] transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                                        ▼
                                    </div>
                                </div>

                                {/* Expanded Content (Hidden by default) */}
                                {isExpanded && (
                                    <div className="mt-4 pt-3 border-t border-[var(--surface-700)] animate-in fade-in slide-in-from-top-2 duration-200">
                                        <p className="text-sm text-[var(--text-secondary)] mb-3">{tiffin.prepNote}</p>

                                        {tiffin.tip && (
                                            <div className="text-xs text-[var(--text-secondary)] mb-3 flex items-center gap-2 bg-[var(--surface-900)] p-2 rounded-lg border border-[var(--surface-700)]">
                                                <span>💡</span>
                                                <span>{tiffin.tip}</span>
                                            </div>
                                        )}

                                        {/* Items List */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {tiffin.items.map((foodId) => {
                                                const food = getFood(foodId);
                                                return (
                                                    <div
                                                        key={foodId}
                                                        className="px-2 py-1 bg-[var(--surface-900)] rounded-md text-xs text-[var(--text-secondary)] border border-[var(--surface-700)]"
                                                    >
                                                        {food.emoji} {food.label}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <button
                                            onClick={(e) => handleQuickAdd(tiffin, e)}
                                            className="w-full py-2 bg-[var(--surface-700)] hover:bg-[var(--surface-600)] text-white rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 border border-[var(--surface-600)]"
                                        >
                                            <span>➕</span>
                                            <span>Add to Tiffin</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="bg-[var(--bg-elevated)] p-4 border-t border-[var(--surface-700)]">
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-[var(--surface-800)] hover:bg-[var(--surface-700)] text-[var(--text-primary)] rounded-xl transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
