// ============================================
// QUICK ADD FOOD MODAL - Log any food not in current plan
// ADDED: Custom food with custom macros option
// ============================================

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { FoodId, MealSlot, MEAL_SLOT_LABELS } from '../../types';
import { FOOD_DATABASE, getFood } from '../../diet/foods';
import { useStore } from '../../state/store';
import { useToast } from './Toast';
import { isBlacklisted } from '../../diet/blacklist';

interface QuickAddFoodModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function QuickAddFoodModal({ isOpen, onClose }: QuickAddFoodModalProps) {
    const logFood = useStore((state) => state.logFood);
    const logCustomFood = useStore((state) => state.logCustomFood);
    const blacklist = useStore((state) => state.blacklist);
    const { showToast } = useToast();

    const [selectedSlot, setSelectedSlot] = useState<MealSlot>(() => {
        // Default to current time slot
        const hour = new Date().getHours();
        if (hour < 8) return 'BREAKFAST';
        if (hour < 11) return 'MORNING_SNACK';
        if (hour < 15) return 'LUNCH';
        if (hour < 18) return 'EVENING_SNACK';
        return 'DINNER';
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'protein' | 'junk' | 'snacks' | 'custom'>('all');

    // Custom food state
    const [customName, setCustomName] = useState('');
    const [customProtein, setCustomProtein] = useState(0);
    const [customCarbs, setCustomCarbs] = useState(0);
    const [customFat, setCustomFat] = useState(0);
    const [customCalories, setCustomCalories] = useState(0);

    if (!isOpen) return null;

    // Get all foods based on category
    const allFoods = Object.values(FOOD_DATABASE);
    const filteredFoods = selectedCategory === 'custom' ? [] : allFoods.filter(food => {
        // Search filter
        const matchesSearch = food.label.toLowerCase().includes(searchQuery.toLowerCase());

        // Category filter
        if (selectedCategory === 'protein') {
            return matchesSearch && food.macros.protein >= 8;
        }
        if (selectedCategory === 'junk') {
            return matchesSearch && food.tags.includes('junk');
        }
        if (selectedCategory === 'snacks') {
            return matchesSearch && food.tags.includes('snack');
        }
        return matchesSearch;
    });

    const handleAddFood = (foodId: FoodId) => {
        const food = getFood(foodId);

        if (isBlacklisted(foodId, blacklist)) {
            logFood(selectedSlot, foodId);
            showToast(`⚠️ ${food.emoji} logged! Damage Control activated.`, 'warning');
        } else {
            logFood(selectedSlot, foodId);
            showToast(`${food.emoji} +${food.macros.protein}g protein!`, 'success');
        }

        onClose();
    };

    const handleAddCustomFood = () => {
        if (!customName.trim()) {
            showToast('Enter a name for your food', 'error');
            return;
        }

        logCustomFood(selectedSlot, {
            name: customName,
            protein: customProtein,
            carbs: customCarbs,
            fat: customFat,
            calories: customCalories || (customProtein * 4 + customCarbs * 4 + customFat * 9),
        });

        showToast(`🍽️ ${customName} +${customProtein}g protein!`, 'success');
        onClose();
    };

    const slots: MealSlot[] = ['BREAKFAST', 'MORNING_SNACK', 'LUNCH', 'EVENING_SNACK', 'DINNER'];

    const modalContent = (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-[#1a1a1a] rounded-t-3xl sm:rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="sticky top-0 bg-[#1a1a1a] p-5 border-b border-zinc-700 z-10">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-white">➕ Quick Add Food</h2>
                        <button
                            onClick={onClose}
                            className="p-2 text-zinc-400 hover:text-white bg-zinc-800 rounded-full"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Meal Slot Selector */}
                    <div className="mb-4">
                        <label className="text-xs text-zinc-400 mb-2 block">Add to:</label>
                        <div className="flex gap-2 flex-wrap">
                            {slots.map(slot => (
                                <button
                                    key={slot}
                                    onClick={() => setSelectedSlot(slot)}
                                    className={`
                                        px-3 py-1.5 rounded-full text-sm transition-all
                                        ${selectedSlot === slot
                                            ? 'bg-neon-teal text-black font-medium'
                                            : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}
                                    `}
                                >
                                    {MEAL_SLOT_LABELS[slot]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Category Filter - Including Custom */}
                    <div className="flex gap-2 mb-3 flex-wrap">
                        {[
                            { key: 'all', label: 'All', emoji: '📋' },
                            { key: 'protein', label: 'Protein', emoji: '💪' },
                            { key: 'snacks', label: 'Snacks', emoji: '🍎' },
                            { key: 'junk', label: 'Junk', emoji: '🍕' },
                            { key: 'custom', label: 'Custom', emoji: '✏️' },
                        ].map(cat => (
                            <button
                                key={cat.key}
                                onClick={() => setSelectedCategory(cat.key as any)}
                                className={`
                                    flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-all
                                    ${selectedCategory === cat.key
                                        ? 'bg-white/10 text-white border border-white/20'
                                        : 'text-zinc-500 hover:text-zinc-300'}
                                `}
                            >
                                <span>{cat.emoji}</span>
                                <span>{cat.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Search (only for non-custom) */}
                    {selectedCategory !== 'custom' && (
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="🔍 Search foods..."
                            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-neon-teal outline-none"
                            autoFocus
                        />
                    )}
                </div>

                {/* Content */}
                <div className="p-4 overflow-y-auto max-h-[50vh]">
                    {selectedCategory === 'custom' ? (
                        // Custom Food Form
                        <div className="space-y-4">
                            <div className="p-4 bg-zinc-800 rounded-xl border border-zinc-700">
                                <h3 className="font-medium text-white mb-3">✏️ Add Custom Food</h3>
                                <p className="text-sm text-zinc-400 mb-4">
                                    Enter details for food not in the database
                                </p>

                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs text-zinc-500 block mb-1">Food Name *</label>
                                        <input
                                            type="text"
                                            value={customName}
                                            onChange={(e) => setCustomName(e.target.value)}
                                            placeholder="e.g., Homemade Curry"
                                            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-600 rounded-lg text-white"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs text-zinc-500 block mb-1">Protein (g)</label>
                                            <input
                                                type="number"
                                                value={customProtein}
                                                onChange={(e) => setCustomProtein(Number(e.target.value))}
                                                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-600 rounded-lg text-neon-teal"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-zinc-500 block mb-1">Carbs (g)</label>
                                            <input
                                                type="number"
                                                value={customCarbs}
                                                onChange={(e) => setCustomCarbs(Number(e.target.value))}
                                                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-600 rounded-lg text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-zinc-500 block mb-1">Fat (g)</label>
                                            <input
                                                type="number"
                                                value={customFat}
                                                onChange={(e) => setCustomFat(Number(e.target.value))}
                                                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-600 rounded-lg text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-zinc-500 block mb-1">Calories (auto)</label>
                                            <input
                                                type="number"
                                                value={customCalories || (customProtein * 4 + customCarbs * 4 + customFat * 9)}
                                                onChange={(e) => setCustomCalories(Number(e.target.value))}
                                                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-600 rounded-lg text-zinc-400"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleAddCustomFood}
                                        disabled={!customName.trim()}
                                        className="w-full py-3 bg-neon-teal text-black rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Add to {MEAL_SLOT_LABELS[selectedSlot]}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Food List
                        <div className="space-y-2">
                            {filteredFoods.length === 0 ? (
                                <div className="text-center py-8 text-zinc-500">
                                    No foods found. Try a different search or add custom.
                                </div>
                            ) : (
                                filteredFoods.slice(0, 30).map(food => (
                                    <button
                                        key={food.id}
                                        onClick={() => handleAddFood(food.id)}
                                        className={`
                                            w-full flex items-center gap-4 p-4 rounded-xl transition-all
                                            ${isBlacklisted(food.id, blacklist)
                                                ? 'bg-red-500/10 hover:bg-red-500/20 border border-red-500/20'
                                                : 'bg-zinc-800 hover:bg-zinc-700'}
                                        `}
                                    >
                                        <span className="text-3xl">{food.emoji}</span>
                                        <div className="flex-1 text-left">
                                            <div className="font-medium text-white">
                                                {food.label}
                                                {isBlacklisted(food.id, blacklist) && (
                                                    <span className="ml-2 text-xs text-red-400">⚠️ Junk</span>
                                                )}
                                            </div>
                                            <div className="text-sm text-zinc-400">
                                                {food.qty} {food.unit}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-neon-teal font-bold">{food.macros.protein}g</div>
                                            <div className="text-xs text-zinc-500">{food.macros.calories} kcal</div>
                                        </div>
                                    </button>
                                ))
                            )}

                            {filteredFoods.length > 30 && (
                                <div className="text-center py-4 text-zinc-500 text-sm">
                                    Showing 30 of {filteredFoods.length} foods. Type to search for more.
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-[#1a1a1a] p-4 border-t border-zinc-700 text-center text-sm text-zinc-500">
                    {selectedCategory === 'custom'
                        ? 'Enter macros and add your custom food'
                        : 'Tap any food to add it'}
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
