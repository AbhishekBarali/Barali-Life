// ============================================
// SETTINGS PAGE - App configuration
// FIXED: Save Profile button recalculates targets
// ============================================

import React, { useState } from 'react';
import { useStore } from '../state/store';
import { Card } from '../ui/components/Card';
import { useToast } from '../ui/components/Toast';
import { FoodId } from '../types';
import { getProteinFoods, getJunkFoods } from '../diet/foods';

export function Settings() {
    const profile = useStore((state) => state.profile);
    const targets = useStore((state) => state.targets);
    const inventory = useStore((state) => state.inventory);
    const blacklist = useStore((state) => state.blacklist);
    const updateProfile = useStore((state) => state.updateProfile);
    const updateTargets = useStore((state) => state.updateTargets);
    const updateInventory = useStore((state) => state.updateInventory);
    const updateBlacklist = useStore((state) => state.updateBlacklist);
    const resetDay = useStore((state) => state.resetDay);
    const exportState = useStore((state) => state.exportState);
    const importState = useStore((state) => state.importState);
    const calorieCycling = useStore((state) => state.calorieCycling);
    const setCalorieCycling = useStore((state) => state.setCalorieCycling);
    const theme = useStore((state) => state.theme);
    const setTheme = useStore((state) => state.setTheme);
    const { showToast } = useToast();

    // Local state for editing
    const [editProfile, setEditProfile] = useState({
        heightCm: profile.heightCm,
        weightKg: profile.weightKg,
        goal: profile.goal,
    });

    const [importJson, setImportJson] = useState('');
    const [showDanger, setShowDanger] = useState(false);

    // Protein foods for inventory
    const proteinFoods = getProteinFoods();
    const junkFoods = getJunkFoods();

    // Calculate recommended targets based on profile
    const calculateTargets = (weight: number, goal: string) => {
        // Protein: 1.8g per kg for recomp/bulk, 2.2g for cut, 1.5g for maintain
        let proteinMultiplier = 1.8;
        if (goal === 'CUT') proteinMultiplier = 2.2;
        if (goal === 'MAINTAIN') proteinMultiplier = 1.5;
        if (goal === 'BULK') proteinMultiplier = 1.8;

        // Calories: Estimate based on goal
        // Rough TDEE estimate for moderately active person
        const baseTDEE = weight * 30; // ~30 cal/kg for moderate activity
        let calorieTarget = baseTDEE;
        if (goal === 'CUT') calorieTarget = baseTDEE - 400;
        if (goal === 'BULK') calorieTarget = baseTDEE + 300;
        if (goal === 'BODY_RECOMPOSITION') calorieTarget = baseTDEE - 100;

        return {
            proteinPerDay: Math.round(weight * proteinMultiplier),
            caloriesPerDay: Math.round(calorieTarget),
            waterLiters: targets.waterLiters, // Keep water unchanged
        };
    };

    const handleSaveProfile = () => {
        // Update profile
        updateProfile(editProfile);

        // Recalculate and update targets
        const newTargets = calculateTargets(editProfile.weightKg, editProfile.goal);
        updateTargets(newTargets);

        showToast('✅ Profile saved! Targets updated.', 'success');
    };

    const hasChanges =
        editProfile.heightCm !== profile.heightCm ||
        editProfile.weightKg !== profile.weightKg ||
        editProfile.goal !== profile.goal;

    const handleExport = () => {
        const json = exportState();
        navigator.clipboard.writeText(json);
        showToast('Data copied to clipboard! 📋', 'success');
    };

    const handleImport = () => {
        try {
            const data = JSON.parse(importJson);
            importState(data);
            showToast('Data imported successfully! ✓', 'success');
            setImportJson('');
        } catch (e) {
            showToast('Invalid JSON format', 'error');
        }
    };

    const handleClearAll = () => {
        localStorage.removeItem('baraliLife:v1');
        showToast('All data cleared! Refreshing...', 'success');
        setTimeout(() => window.location.reload(), 500);
    };

    const toggleInventory = (foodId: FoodId) => {
        const newList = inventory.availableFoodIds.includes(foodId)
            ? inventory.availableFoodIds.filter(id => id !== foodId)
            : [...inventory.availableFoodIds, foodId];
        updateInventory(newList);
    };

    const toggleBlacklist = (foodId: FoodId) => {
        const newList = blacklist.includes(foodId)
            ? blacklist.filter(id => id !== foodId)
            : [...blacklist, foodId];
        updateBlacklist(newList);
    };

    return (
        <div className="space-y-6 pb-24">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-2xl font-bold text-white">Settings</h1>
                <p className="text-zinc-400">Configure your app</p>
            </div>

            {/* Profile Section */}
            <Card className={hasChanges ? 'border-yellow-500/50' : ''}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-white">Profile</h2>
                    {hasChanges && (
                        <span className="text-xs text-yellow-400 px-2 py-1 bg-yellow-500/10 rounded-full">
                            Unsaved changes
                        </span>
                    )}
                </div>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-zinc-400 block mb-1">Height (cm)</label>
                            <input
                                type="number"
                                value={editProfile.heightCm}
                                onChange={(e) => setEditProfile({ ...editProfile, heightCm: Number(e.target.value) })}
                                className="w-full px-4 py-3 bg-zinc-800 rounded-xl text-white focus:ring-2 focus:ring-neon-teal outline-none border border-zinc-700"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-zinc-400 block mb-1">Weight (kg)</label>
                            <input
                                type="number"
                                value={editProfile.weightKg}
                                onChange={(e) => setEditProfile({ ...editProfile, weightKg: Number(e.target.value) })}
                                className="w-full px-4 py-3 bg-zinc-800 rounded-xl text-white focus:ring-2 focus:ring-neon-teal outline-none border border-zinc-700"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm text-zinc-400 block mb-1">Goal</label>
                        <div className="relative">
                            <select
                                value={editProfile.goal}
                                onChange={(e) => setEditProfile({ ...editProfile, goal: e.target.value as any })}
                                className="w-full px-4 py-3 bg-zinc-800 rounded-xl text-white focus:ring-2 focus:ring-neon-teal outline-none border border-zinc-700 appearance-none pr-10 touch-manipulation"
                            >
                                <option className="bg-zinc-800 text-white py-2" value="BODY_RECOMPOSITION">Body Recomposition</option>
                                <option className="bg-zinc-800 text-white py-2" value="BULK">Bulk</option>
                                <option className="bg-zinc-800 text-white py-2" value="CUT">Cut</option>
                                <option className="bg-zinc-800 text-white py-2" value="MAINTAIN">Maintain</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none text-xs">
                                ▼
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSaveProfile}
                        disabled={!hasChanges}
                        className={`
                            w-full py-3 rounded-xl font-semibold transition-all
                            ${hasChanges
                                ? 'bg-neon-teal text-black hover:brightness-110'
                                : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'}
                        `}
                    >
                        {hasChanges ? '💾 Save Profile & Update Targets' : '✓ Profile Saved'}
                    </button>

                    {/* Preview of what will change */}
                    {hasChanges && (
                        <div className="p-3 bg-yellow-500/10 rounded-xl text-sm">
                            <div className="text-yellow-400 font-medium mb-1">Preview after save:</div>
                            <div className="text-zinc-400">
                                Protein: {calculateTargets(editProfile.weightKg, editProfile.goal).proteinPerDay}g/day •
                                Calories: {calculateTargets(editProfile.weightKg, editProfile.goal).caloriesPerDay}/day
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            {/* Daily Targets (Current) */}
            <Card>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-white">Daily Targets</h2>
                </div>

                <div className="space-y-6">
                    {/* Calorie Cycling Section */}
                    <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <div className="font-medium text-white flex items-center gap-2">
                                    🚲 Calorie Cycling
                                    {calorieCycling.enabled && (
                                        <span className="text-xs px-2 py-0.5 bg-neon-teal/20 text-neon-teal rounded-full">Active</span>
                                    )}
                                </div>
                                <div className="text-xs text-zinc-400">Adjust calories based on activity</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={calorieCycling.enabled}
                                    onChange={(e) => setCalorieCycling({
                                        ...calorieCycling,
                                        enabled: e.target.checked
                                    })}
                                />
                                <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-teal"></div>
                            </label>
                        </div>
                    </div>

                    {calorieCycling.enabled && (
                        <div className="space-y-3 animate-fade-in">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-green-400 block mb-1">Gym Day Adjustment</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={calorieCycling.gymAdjustment}
                                            onChange={(e) => setCalorieCycling({
                                                ...calorieCycling,
                                                gymAdjustment: Number(e.target.value)
                                            })}
                                            className="w-full px-3 py-2 bg-zinc-900 rounded-lg text-white border border-zinc-700 focus:border-green-500 outline-none"
                                        />
                                        <div className="absolute right-3 top-2 text-xs text-zinc-500">kcal</div>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-orange-400 block mb-1">Rest Day Adjustment</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={calorieCycling.restAdjustment}
                                            onChange={(e) => setCalorieCycling({
                                                ...calorieCycling,
                                                restAdjustment: Number(e.target.value)
                                            })}
                                            className="w-full px-3 py-2 bg-zinc-900 rounded-lg text-white border border-zinc-700 focus:border-orange-500 outline-none"
                                        />
                                        <div className="absolute right-3 top-2 text-xs text-zinc-500">kcal</div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-xs bg-zinc-900/50 p-3 rounded-lg border border-zinc-700/50 space-y-1">
                                <div className="flex justify-between">
                                    <span className="text-zinc-400">Base Goal:</span>
                                    <span className="text-white">{targets.caloriesPerDay} kcal</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-green-400">Gym Days:</span>
                                    <span className="text-white font-medium">{targets.caloriesPerDay + calorieCycling.gymAdjustment} kcal</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-orange-400">Rest Days:</span>
                                    <span className="text-white font-medium">{targets.caloriesPerDay + calorieCycling.restAdjustment} kcal</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Standard Targets */}
                <div>
                    <label className="text-sm text-zinc-400 block mb-1">
                        Base Protein Goal
                        <span className="text-neon-teal ml-2">= {targets.proteinPerDay}g</span>
                    </label>
                    <input
                        type="number"
                        value={targets.proteinPerDay}
                        onChange={(e) => updateTargets({ proteinPerDay: Number(e.target.value) })}
                        className="w-full px-4 py-3 bg-zinc-800 rounded-xl text-white focus:ring-2 focus:ring-neon-teal outline-none border border-zinc-700"
                    />
                </div>
                <div>
                    <label className="text-sm text-zinc-400 block mb-1">
                        Base Calorie Goal
                        <span className="text-neon-teal ml-2">= {targets.caloriesPerDay}</span>
                    </label>
                    <input
                        type="number"
                        value={targets.caloriesPerDay}
                        onChange={(e) => updateTargets({ caloriesPerDay: Number(e.target.value) })}
                        className="w-full px-4 py-3 bg-zinc-800 rounded-xl text-white focus:ring-2 focus:ring-neon-teal outline-none border border-zinc-700"
                    />
                </div>
                <div>
                    <label className="text-sm text-zinc-400 block mb-1">Water (liters)</label>
                    <input
                        type="number"
                        step="0.5"
                        value={targets.waterLiters}
                        onChange={(e) => updateTargets({ waterLiters: Number(e.target.value) })}
                        className="w-full px-4 py-3 bg-zinc-800 rounded-xl text-white focus:ring-2 focus:ring-neon-teal outline-none border border-zinc-700"
                    />
                </div>
                <p className="text-xs text-zinc-500">
                    💡 These are your base values. Calorie cycling will adjust them automatically based on your workout schedule.
                </p>
            </Card>

            {/* Inventory */}
            <Card>
                <h2 className="text-lg font-semibold text-white mb-2">Inventory (What's at Home)</h2>
                <p className="text-sm text-zinc-400 mb-4">Select protein sources you have available:</p>
                <div className="flex flex-wrap gap-2 max-h-[400px] overflow-y-auto">
                    {proteinFoods.map(food => (
                        <button
                            key={food.id}
                            onClick={() => toggleInventory(food.id)}
                            className={`
                                flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all
                                ${inventory.availableFoodIds.includes(food.id)
                                    ? 'bg-neon-teal/20 text-neon-teal border border-neon-teal/30'
                                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 border border-zinc-700'}
                            `}
                        >
                            <span>{food.emoji}</span>
                            <span>{food.label}</span>
                        </button>
                    ))}
                </div>
                <p className="text-xs text-zinc-500 mt-3">
                    Showing all {proteinFoods.length} protein sources. Scroll to see more.
                </p>
            </Card>

            {/* Blacklist */}
            <Card>
                <h2 className="text-lg font-semibold text-white mb-2">Blacklist (Junk Foods)</h2>
                <p className="text-sm text-zinc-400 mb-4">Foods that trigger Damage Control:</p>
                <div className="flex flex-wrap gap-2">
                    {junkFoods.map(food => (
                        <button
                            key={food.id}
                            onClick={() => toggleBlacklist(food.id)}
                            className={`
                                flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all
                                ${blacklist.includes(food.id)
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 border border-zinc-700'}
                            `}
                        >
                            <span>{food.emoji}</span>
                            <span>{food.label}</span>
                        </button>
                    ))}
                </div>
            </Card>



            {/* Preferences */}
            <Card>
                <h2 className="text-lg font-semibold text-white mb-4">Preferences</h2>

                {/* Smart Shuffle Toggle */}
                <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700 mb-4">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <div className="font-medium text-white flex items-center gap-2">
                                🔀 Smart Shuffle
                                {useStore((state) => state.smartShuffle) && (
                                    <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full">Active</span>
                                )}
                            </div>
                            <div className="text-xs text-zinc-400">Prioritize items from your Inventory (80% chance)</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={useStore((state) => state.smartShuffle)}
                                onChange={(e) => useStore.getState().setSmartShuffle(e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => setTheme('default')}
                        className={`p-3 rounded-xl border text-left transition-all ${theme === 'default'
                            ? 'bg-[var(--surface-800)] border-[var(--primary)] ring-1 ring-[var(--primary)]'
                            : 'bg-[var(--surface-900)] border-transparent hover:bg-[var(--surface-800)]'
                            }`}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-4 h-4 rounded-full bg-[#38bdf8]" />
                            <span className="text-sm font-medium text-[var(--text-primary)]">Midnight Pro</span>
                        </div>
                        <div className="text-xs text-[var(--text-secondary)]">Deep Blue & Sky</div>
                    </button>

                    <button
                        onClick={() => setTheme('apple')}
                        className={`p-3 rounded-xl border text-left transition-all ${theme === 'apple'
                            ? 'bg-[var(--surface-800)] border-[var(--primary)] ring-1 ring-[var(--primary)]'
                            : 'bg-[var(--surface-900)] border-transparent hover:bg-[var(--surface-800)]'
                            }`}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-4 h-4 rounded-full bg-[#a78bfa]" />
                            <span className="text-sm font-medium text-[var(--text-primary)]">Nebula</span>
                        </div>
                        <div className="text-xs text-[var(--text-secondary)]">Soft Violet</div>
                    </button>

                    <button
                        onClick={() => setTheme('sunset')}
                        className={`p-3 rounded-xl border text-left transition-all ${theme === 'sunset'
                            ? 'bg-[var(--surface-800)] border-[var(--primary)] ring-1 ring-[var(--primary)]'
                            : 'bg-[var(--surface-900)] border-transparent hover:bg-[var(--surface-800)]'
                            }`}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-4 h-4 rounded-full bg-[#e5e5e5]" />
                            <span className="text-sm font-medium text-[var(--text-primary)]">Slate</span>
                        </div>
                        <div className="text-xs text-[var(--text-secondary)]">Monochrome</div>
                    </button>

                    <button
                        onClick={() => setTheme('neon')}
                        className={`p-3 rounded-xl border text-left transition-all ${theme === 'neon'
                            ? 'bg-[var(--surface-800)] border-[var(--primary)] ring-1 ring-[var(--primary)]'
                            : 'bg-[var(--surface-900)] border-transparent hover:bg-[var(--surface-800)]'
                            }`}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-4 h-4 rounded-full bg-[#ffffff] border border-zinc-700" />
                            <span className="text-sm font-medium text-[var(--text-primary)]">Obsidian</span>
                        </div>
                        <div className="text-xs text-[var(--text-secondary)]">True Black</div>
                    </button>
                </div>
            </Card>

            {/* Data Management */}
            <Card>
                <h2 className="text-lg font-semibold text-white mb-4">Data Management</h2>
                <div className="space-y-3">
                    <button
                        onClick={handleExport}
                        className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-white transition-colors border border-zinc-700"
                    >
                        📋 Export Data (Copy to Clipboard)
                    </button>
                    <div>
                        <textarea
                            placeholder="Paste JSON here to import..."
                            value={importJson}
                            onChange={(e) => setImportJson(e.target.value)}
                            className="w-full h-24 px-4 py-3 bg-zinc-800 rounded-xl text-white text-sm focus:ring-2 focus:ring-neon-teal outline-none border border-zinc-700"
                        />
                        <button
                            onClick={handleImport}
                            disabled={!importJson}
                            className="w-full mt-2 py-3 bg-neon-teal text-black rounded-xl font-medium disabled:opacity-50"
                        >
                            Import Data
                        </button>
                    </div>
                    <button
                        onClick={() => {
                            resetDay();
                            showToast('Today reset! 🔄', 'success');
                        }}
                        className="w-full py-3 bg-orange-500/20 text-orange-400 rounded-xl hover:bg-orange-500/30 transition-colors"
                    >
                        🔄 Reset Today's Log
                    </button>
                </div>
            </Card>

            {/* About */}
            <Card>
                <h2 className="text-lg font-semibold text-white mb-2">About</h2>
                <div className="text-sm text-zinc-400 space-y-1">
                    <p><strong>Barali Life</strong> v1.0</p>
                    <p>Your personal diet & gym tracker</p>
                    <p className="text-zinc-500">Made with 💪 in Nepal</p>
                </div>
            </Card>
        </div>
    );
}
