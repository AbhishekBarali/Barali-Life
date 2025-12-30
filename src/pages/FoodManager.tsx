// ============================================
// FOOD MANAGER PAGE - Add/Edit/Delete foods
// ============================================

import React, { useState, useEffect, useCallback } from 'react';
import { getFoods, createFood, updateFood, deleteFood, uploadFoodImage, Food, CreateFoodData } from '../api/foods';
import { Card } from '../ui/components/Card';
import { useToast } from '../ui/components/Toast';

// Predefined tags
const AVAILABLE_TAGS = ['protein', 'carb', 'veg', 'fruit', 'snack', 'drink', 'breakfast', 'lunch', 'dinner', 'healthy', 'quick', 'supplement'];

// Predefined emojis
const AVAILABLE_EMOJIS = ['🍽️', '🥚', '🍳', '🥛', '🍗', '🍖', '🐟', '🧀', '🫘', '🍚', '🫓', '🥬', '🥔', '🍌', '🍎', '🥜', '🥟', '🍜', '🥣', '🍱', '🥤', '🍵', '☕', '🥗', '🥘', '🌰', '🌶️', '🥩', '🍢'];

export function FoodManager() {
    const [foods, setFoods] = useState<Food[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterTag, setFilterTag] = useState('');
    const [showCustomOnly, setShowCustomOnly] = useState(false);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingFood, setEditingFood] = useState<Food | null>(null);
    const [formData, setFormData] = useState<CreateFoodData>({
        label: '',
        emoji: '🍽️',
        qty: 1,
        unit: 'serving',
        protein: 0,
        carbs: 0,
        fat: 0,
        tags: [],
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const { showToast } = useToast();

    // Fetch foods
    const fetchFoods = useCallback(async () => {
        setLoading(true);
        const result = await getFoods({
            search: searchQuery || undefined,
            tag: filterTag || undefined,
            custom_only: showCustomOnly || undefined,
        });
        if (result.data) {
            setFoods(result.data);
        } else if (result.error) {
            showToast(result.error, 'error');
        }
        setLoading(false);
    }, [searchQuery, filterTag, showCustomOnly, showToast]);

    useEffect(() => {
        fetchFoods();
    }, [fetchFoods]);

    // Open modal for adding new food
    const handleAdd = () => {
        setEditingFood(null);
        setFormData({
            label: '',
            emoji: '🍽️',
            qty: 1,
            unit: 'serving',
            protein: 0,
            carbs: 0,
            fat: 0,
            tags: [],
        });
        setImageFile(null);
        setImagePreview(null);
        setShowModal(true);
    };

    // Open modal for editing
    const handleEdit = (food: Food) => {
        setEditingFood(food);
        setFormData({
            label: food.label,
            emoji: food.emoji,
            qty: food.qty,
            unit: food.unit,
            grams: food.grams || undefined,
            protein: food.protein,
            carbs: food.carbs,
            fat: food.fat,
            calories: food.calories,
            tags: food.tags,
            image_url: food.image_url || undefined,
        });
        setImagePreview(food.image_url || null);
        setImageFile(null);
        setShowModal(true);
    };

    // Handle image selection
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Toggle tag
    const toggleTag = (tag: string) => {
        const currentTags = formData.tags || [];
        if (currentTags.includes(tag)) {
            setFormData({ ...formData, tags: currentTags.filter(t => t !== tag) });
        } else {
            setFormData({ ...formData, tags: [...currentTags, tag] });
        }
    };

    // Calculate calories from macros
    const calculateCalories = () => {
        const protein = formData.protein || 0;
        const carbs = formData.carbs || 0;
        const fat = formData.fat || 0;
        return protein * 4 + carbs * 4 + fat * 9;
    };

    // Save food
    const handleSave = async () => {
        if (!formData.label) {
            showToast('Name is required', 'error');
            return;
        }

        setSaving(true);

        try {
            let imageUrl = formData.image_url;

            // Upload image if new one selected
            if (imageFile) {
                const uploadResult = await uploadFoodImage(imageFile);
                if (uploadResult.data) {
                    imageUrl = uploadResult.data.url;
                } else if (uploadResult.error) {
                    showToast(`Image upload failed: ${uploadResult.error}`, 'error');
                }
            }

            const dataToSave = {
                ...formData,
                image_url: imageUrl,
                calories: formData.calories || calculateCalories(),
            };

            if (editingFood) {
                // Update existing
                const result = await updateFood(editingFood.id, dataToSave);
                if (result.data) {
                    showToast('Food updated successfully!', 'success');
                    setShowModal(false);
                    fetchFoods();
                } else if (result.error) {
                    showToast(result.error, 'error');
                }
            } else {
                // Create new
                const result = await createFood(dataToSave);
                if (result.data) {
                    showToast('Food added successfully!', 'success');
                    setShowModal(false);
                    fetchFoods();
                } else if (result.error) {
                    showToast(result.error, 'error');
                }
            }
        } catch (error) {
            showToast('An error occurred', 'error');
        }

        setSaving(false);
    };

    // Delete food
    const handleDelete = async (food: Food) => {
        if (!confirm(`Delete "${food.label}"?`)) return;

        const result = await deleteFood(food.id);
        if (result.data) {
            showToast('Food deleted', 'success');
            fetchFoods();
        } else if (result.error) {
            showToast(result.error, 'error');
        }
    };

    return (
        <div className="space-y-5 pb-24">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Food Manager</h1>
                <button
                    onClick={handleAdd}
                    className="px-4 py-2 bg-neon-teal text-black rounded-xl font-medium hover:bg-neon-teal/90 transition-colors"
                >
                    + Add Food
                </button>
            </div>

            {/* Search & Filters */}
            <Card>
                <div className="space-y-3">
                    <input
                        type="text"
                        placeholder="Search foods..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 bg-surface-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-neon-teal/50"
                    />
                    <div className="flex flex-wrap gap-2">
                        <select
                            value={filterTag}
                            onChange={(e) => setFilterTag(e.target.value)}
                            className="px-3 py-1.5 bg-surface-700 rounded-lg text-white text-sm focus:outline-none"
                        >
                            <option value="">All Tags</option>
                            {AVAILABLE_TAGS.map(tag => (
                                <option key={tag} value={tag}>{tag}</option>
                            ))}
                        </select>
                        <label className="flex items-center gap-2 text-sm text-zinc-400">
                            <input
                                type="checkbox"
                                checked={showCustomOnly}
                                onChange={(e) => setShowCustomOnly(e.target.checked)}
                                className="rounded"
                            />
                            Custom only
                        </label>
                    </div>
                </div>
            </Card>

            {/* Foods List */}
            {loading ? (
                <div className="text-center py-8 text-zinc-400">Loading...</div>
            ) : foods.length === 0 ? (
                <div className="text-center py-8 text-zinc-400">No foods found</div>
            ) : (
                <div className="space-y-2">
                    {foods.map(food => (
                        <Card key={food.id} className="hover:border-neon-teal/30 transition-colors">
                            <div className="flex items-center gap-3">
                                {/* Image or Emoji */}
                                <div className="w-12 h-12 rounded-lg bg-surface-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                                    {food.image_url ? (
                                        <img src={food.image_url} alt={food.label} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-2xl">{food.emoji}</span>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-white truncate">{food.label}</div>
                                    <div className="text-sm text-zinc-400">
                                        {food.qty} {food.unit} • {food.protein}g protein • {food.calories} kcal
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(food)}
                                        className="p-2 text-zinc-400 hover:text-white transition-colors"
                                    >
                                        ✏️
                                    </button>
                                    {food.is_custom && (
                                        <button
                                            onClick={() => handleDelete(food)}
                                            className="p-2 text-zinc-400 hover:text-red-400 transition-colors"
                                        >
                                            🗑️
                                        </button>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-surface-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-5 border-b border-surface-700">
                            <h2 className="text-xl font-bold text-white">
                                {editingFood ? 'Edit Food' : 'Add New Food'}
                            </h2>
                        </div>

                        <div className="p-5 space-y-4">
                            {/* Image */}
                            <div>
                                <label className="block text-sm text-zinc-400 mb-2">Image (optional)</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 rounded-xl bg-surface-700 flex items-center justify-center overflow-hidden">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-3xl">{formData.emoji}</span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                            id="food-image"
                                        />
                                        <label
                                            htmlFor="food-image"
                                            className="inline-block px-4 py-2 bg-surface-700 rounded-lg text-sm text-white cursor-pointer hover:bg-surface-600 transition-colors"
                                        >
                                            Upload Image
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Emoji */}
                            <div>
                                <label className="block text-sm text-zinc-400 mb-2">Emoji</label>
                                <div className="flex flex-wrap gap-2">
                                    {AVAILABLE_EMOJIS.map(emoji => (
                                        <button
                                            key={emoji}
                                            onClick={() => setFormData({ ...formData, emoji })}
                                            className={`w-10 h-10 text-xl rounded-lg ${formData.emoji === emoji ? 'bg-neon-teal/20 ring-2 ring-neon-teal' : 'bg-surface-700 hover:bg-surface-600'}`}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-sm text-zinc-400 mb-2">Name *</label>
                                <input
                                    type="text"
                                    value={formData.label || ''}
                                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                    className="w-full px-4 py-2 bg-surface-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-teal/50"
                                    placeholder="e.g., Grilled Chicken Breast"
                                />
                            </div>

                            {/* Quantity & Unit */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm text-zinc-400 mb-2">Quantity</label>
                                    <input
                                        type="number"
                                        value={formData.qty || ''}
                                        onChange={(e) => setFormData({ ...formData, qty: Number(e.target.value) })}
                                        className="w-full px-4 py-2 bg-surface-700 rounded-lg text-white focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-zinc-400 mb-2">Unit</label>
                                    <select
                                        value={formData.unit || 'serving'}
                                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                        className="w-full px-4 py-2 bg-surface-700 rounded-lg text-white focus:outline-none"
                                    >
                                        <option value="serving">serving</option>
                                        <option value="g">g</option>
                                        <option value="ml">ml</option>
                                        <option value="piece">piece</option>
                                        <option value="pieces">pieces</option>
                                        <option value="cup">cup</option>
                                        <option value="bowl">bowl</option>
                                        <option value="plate">plate</option>
                                        <option value="scoop">scoop</option>
                                        <option value="tbsp">tbsp</option>
                                        <option value="glass">glass</option>
                                        <option value="eggs">eggs</option>
                                        <option value="slices">slices</option>
                                        <option value="medium">medium</option>
                                    </select>
                                </div>
                            </div>

                            {/* Macros */}
                            <div>
                                <label className="block text-sm text-zinc-400 mb-2">Macros (per serving)</label>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <div className="text-xs text-zinc-500 mb-1">Protein (g)</div>
                                        <input
                                            type="number"
                                            value={formData.protein || ''}
                                            onChange={(e) => setFormData({ ...formData, protein: Number(e.target.value) })}
                                            className="w-full px-3 py-2 bg-surface-700 rounded-lg text-white text-center focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <div className="text-xs text-zinc-500 mb-1">Carbs (g)</div>
                                        <input
                                            type="number"
                                            value={formData.carbs || ''}
                                            onChange={(e) => setFormData({ ...formData, carbs: Number(e.target.value) })}
                                            className="w-full px-3 py-2 bg-surface-700 rounded-lg text-white text-center focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <div className="text-xs text-zinc-500 mb-1">Fat (g)</div>
                                        <input
                                            type="number"
                                            value={formData.fat || ''}
                                            onChange={(e) => setFormData({ ...formData, fat: Number(e.target.value) })}
                                            className="w-full px-3 py-2 bg-surface-700 rounded-lg text-white text-center focus:outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="mt-2 text-sm text-zinc-400">
                                    Calculated calories: <span className="text-white font-medium">{calculateCalories()} kcal</span>
                                </div>
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-sm text-zinc-400 mb-2">Tags</label>
                                <div className="flex flex-wrap gap-2">
                                    {AVAILABLE_TAGS.map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => toggleTag(tag)}
                                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${formData.tags?.includes(tag)
                                                    ? 'bg-neon-teal text-black'
                                                    : 'bg-surface-700 text-zinc-400 hover:bg-surface-600'
                                                }`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-5 border-t border-surface-700 flex gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 py-2.5 bg-surface-700 rounded-xl text-white font-medium hover:bg-surface-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-1 py-2.5 bg-neon-teal text-black rounded-xl font-medium hover:bg-neon-teal/90 transition-colors disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
