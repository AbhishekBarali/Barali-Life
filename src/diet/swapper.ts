// ============================================
// INGREDIENT SWAPPER - Smart food substitutions
// Now with UNIVERSAL fallback for all foods!
// ============================================

import { FoodId, FoodItem, MealIntention } from '../types';
import { FOOD_DATABASE, getFood, getProteinFoods } from './foods';

// Specific swap definitions with hints
const SPECIFIC_SWAPS: Partial<Record<FoodId, { alternatives: FoodId[]; hints: Partial<Record<FoodId, string>> }>> = {
    // Chicken swaps
    CHICKEN_CURRY: {
        alternatives: ['CHICKEN_AIRFRIED', 'CHICKEN_GRILLED', 'EGGS_BOILED', 'SOYA_CURRY', 'PANEER_CURRY', 'KALA_CHANA', 'WHEY', 'BUFF_CURRY', 'FISH_CURRY'],
        hints: {
            CHICKEN_AIRFRIED: 'Healthier, same protein',
            CHICKEN_GRILLED: 'Lowest fat option',
            EGGS_BOILED: '4 eggs = same protein',
            SOYA_CURRY: 'Veg alternative',
            PANEER_CURRY: 'Veg, high fat',
            KALA_CHANA: '1 big bowl',
            WHEY: '1.5 scoops',
            BUFF_CURRY: 'Leaner meat',
            FISH_CURRY: 'Lower fat, omega-3',
        },
    },
    CHICKEN_AIRFRIED: {
        alternatives: ['CHICKEN_GRILLED', 'CHICKEN_CURRY', 'SOYA_CHUNKS', 'EGGS_BOILED', 'PANEER', 'WHEY', 'BUFF_SUKUTI'],
        hints: {
            CHICKEN_GRILLED: 'Even healthier',
            CHICKEN_CURRY: 'More flavorful',
            SOYA_CHUNKS: '50g dry = 26g protein',
            EGGS_BOILED: '4 eggs',
            PANEER: '100g',
            WHEY: '1 scoop',
            BUFF_SUKUTI: '50g = 25g protein',
        },
    },

    // Dal Bhat variants
    DAL_BHAT_TARKARI: {
        alternatives: ['DAL_BHAT_CHICKEN', 'DAL_BHAT_EGG', 'DAL_BHAT_PANEER', 'DAL_BHAT_SOYA', 'DAL_BHAT_FISH', 'BHAT_MASU', 'ROTI_DAL'],
        hints: {
            DAL_BHAT_CHICKEN: '+24g protein!',
            DAL_BHAT_EGG: '+10g protein',
            DAL_BHAT_PANEER: '+14g protein (veg)',
            DAL_BHAT_SOYA: '+18g protein (veg)',
            DAL_BHAT_FISH: '+18g protein',
            BHAT_MASU: 'Rice + meat only',
            ROTI_DAL: 'Lower carb option',
        },
    },
    DAL_BHAT_CHICKEN: {
        alternatives: ['DAL_BHAT_MUTTON', 'DAL_BHAT_FISH', 'DAL_BHAT_EGG', 'DAL_BHAT_PANEER', 'DAL_BHAT_SOYA', 'BHAT_MASU', 'DAL_BHAT_TARKARI'],
        hints: {
            DAL_BHAT_MUTTON: 'Richer, more fat',
            DAL_BHAT_FISH: 'Leaner option',
            DAL_BHAT_EGG: 'Cheaper alternative',
            DAL_BHAT_PANEER: 'Veg option',
            DAL_BHAT_SOYA: 'Highest protein veg',
            BHAT_MASU: 'Just rice + meat',
            DAL_BHAT_TARKARI: 'Veg version',
        },
    },
    DAL_BHAT_EGG: {
        alternatives: ['DAL_BHAT_CHICKEN', 'DAL_BHAT_PANEER', 'DAL_BHAT_SOYA', 'DAL_BHAT_TARKARI', 'EGGS_BOILED'],
        hints: {
            DAL_BHAT_CHICKEN: 'More protein',
            DAL_BHAT_PANEER: 'Veg option',
            DAL_BHAT_SOYA: 'More protein (veg)',
            DAL_BHAT_TARKARI: 'Lighter',
            EGGS_BOILED: 'Just eggs',
        },
    },

    // Eggs
    EGGS_BOILED: {
        alternatives: ['EGGS_OMELETTE', 'EGGS_FRIED', 'EGGS_BHURJI', 'EGG_CURRY', 'WHEY', 'SOYA_CHUNKS', 'PANEER', 'DAHI', 'PEANUT_BUTTER'],
        hints: {
            EGGS_OMELETTE: 'More oil, same protein',
            EGGS_FRIED: 'Quick option',
            EGGS_BHURJI: 'Scrambled style',
            EGG_CURRY: 'With gravy',
            WHEY: '1 scoop = 2 eggs',
            SOYA_CHUNKS: '30g dry',
            PANEER: '80g',
            DAHI: '2 bowls',
            PEANUT_BUTTER: '2 tbsp + bread',
        },
    },

    // Milk & Dairy
    MILK: {
        alternatives: ['LASSI', 'DAHI', 'BUTTERMILK', 'WHEY'],
        hints: {
            LASSI: 'Sweet/salty',
            DAHI: 'Probiotic',
            BUTTERMILK: 'Lower fat',
            WHEY: 'More protein',
        },
    },
    DAHI: {
        alternatives: ['LASSI', 'BUTTERMILK', 'MILK', 'CHIURA_DAHI'],
        hints: {
            LASSI: 'Drink version',
            BUTTERMILK: 'Thinner',
            MILK: 'Liquid',
            CHIURA_DAHI: 'With chiura',
        },
    },

    // Nuts
    PEANUTS: {
        alternatives: ['ALMONDS', 'CASHEWS', 'WALNUTS', 'MIXED_NUTS', 'ROASTED_CHANA', 'PEANUT_BUTTER'],
        hints: {
            ALMONDS: 'More vitamin E',
            CASHEWS: 'Creamier',
            WALNUTS: 'Omega-3',
            MIXED_NUTS: 'Variety',
            ROASTED_CHANA: 'More protein',
            PEANUT_BUTTER: 'Spreadable',
        },
    },
    ALMONDS: {
        alternatives: ['PEANUTS', 'CASHEWS', 'WALNUTS', 'MIXED_NUTS'],
        hints: {
            PEANUTS: 'Cheaper',
            CASHEWS: 'Different taste',
            WALNUTS: 'Brain food',
            MIXED_NUTS: 'Variety',
        },
    },

    // Bread
    BREAD_PEANUT_BUTTER: {
        alternatives: ['BREAD_BUTTER', 'BREAD_HONEY', 'BREAD_JAM', 'TOAST_EGG', 'PARATHA', 'OATS_BANANA'],
        hints: {
            BREAD_BUTTER: 'Less protein',
            BREAD_HONEY: 'More carbs',
            BREAD_JAM: 'Sweet option',
            TOAST_EGG: 'More protein!',
            PARATHA: 'Nepali breakfast',
            OATS_BANANA: 'Healthier option',
        },
    },

    // Fruits
    BANANA: {
        alternatives: ['APPLE', 'ORANGE', 'MANGO', 'PAPAYA', 'POMEGRANATE'],
        hints: {
            APPLE: 'Less carbs',
            ORANGE: 'Vitamin C',
            MANGO: 'Seasonal',
            PAPAYA: 'Good for digestion',
            POMEGRANATE: 'Antioxidants',
        },
    },
    APPLE: {
        alternatives: ['BANANA', 'ORANGE', 'MANGO', 'PAPAYA'],
        hints: {
            BANANA: 'More energy',
            ORANGE: 'Vitamin C',
            MANGO: 'Sweet',
            PAPAYA: 'Digestive',
        },
    },

    // Oats
    OATS: {
        alternatives: ['OATS_BANANA', 'OATS_HONEY', 'CORNFLAKES', 'CHIURA_DAHI'],
        hints: {
            OATS_BANANA: 'With banana',
            OATS_HONEY: 'Sweeter',
            CORNFLAKES: 'Quicker',
            CHIURA_DAHI: 'Nepali alternative',
        },
    },

    // Legumes
    KALA_CHANA: {
        alternatives: ['CHANA_BOILED', 'CHANA_MASALA', 'SOYA_CHUNKS', 'RAJMA', 'EGGS_BOILED', 'DAL', 'ROASTED_CHANA'],
        hints: {
            CHANA_BOILED: 'Plain version',
            CHANA_MASALA: 'With gravy',
            SOYA_CHUNKS: '40g dry',
            RAJMA: 'Kidney beans',
            EGGS_BOILED: '3 eggs',
            DAL: '2 bowls',
            ROASTED_CHANA: 'Dry snack version',
        },
    },

    // Whey
    WHEY: {
        alternatives: ['EGGS_BOILED', 'SOYA_CHUNKS', 'DAHI', 'MILK', 'PEANUT_BUTTER', 'ALMONDS', 'PANEER'],
        hints: {
            EGGS_BOILED: '4 eggs = same protein',
            SOYA_CHUNKS: '50g dry',
            DAHI: '2 bowls + egg',
            MILK: '2 glasses',
            PEANUT_BUTTER: '3 tbsp',
            ALMONDS: '60g (lots!)',
            PANEER: '80g',
        },
    },

    // Paneer (plain) - swaps with other plain proteins
    PANEER: {
        alternatives: ['PANEER_CURRY', 'PANEER_BHURJI', 'TOFU', 'DAHI', 'EGGS_BOILED'],
        hints: {
            PANEER_CURRY: 'Make it a curry',
            PANEER_BHURJI: 'Scrambled style',
            TOFU: 'Lighter alternative',
            DAHI: 'Quick option',
            EGGS_BOILED: '3 eggs',
        },
    },

    // PANEER CURRY - swaps with OTHER CURRIES only (realistic!)
    PANEER_CURRY: {
        alternatives: ['EGG_CURRY', 'SOYA_CURRY', 'CHICKEN_CURRY', 'DAL_BHAT_PANEER', 'CHANA_MASALA'],
        hints: {
            EGG_CURRY: 'Similar protein, cheaper',
            SOYA_CURRY: 'Higher protein veg option',
            CHICKEN_CURRY: 'Non-veg alternative',
            DAL_BHAT_PANEER: 'Full meal with rice',
            CHANA_MASALA: 'Legume curry option',
        },
    },

    // EGG CURRY - swaps with other curries
    EGG_CURRY: {
        alternatives: ['PANEER_CURRY', 'SOYA_CURRY', 'CHICKEN_CURRY', 'DAL_BHAT_EGG', 'CHANA_MASALA'],
        hints: {
            PANEER_CURRY: 'Veg alternative',
            SOYA_CURRY: 'Higher protein',
            CHICKEN_CURRY: 'More protein',
            DAL_BHAT_EGG: 'Full meal with rice',
            CHANA_MASALA: 'Legume option',
        },
    },

    // SOYA CURRY - swaps with other curries
    SOYA_CURRY: {
        alternatives: ['PANEER_CURRY', 'EGG_CURRY', 'CHICKEN_CURRY', 'CHANA_MASALA', 'DAL_BHAT_SOYA'],
        hints: {
            PANEER_CURRY: 'Veg alternative',
            EGG_CURRY: 'Similar protein',
            CHICKEN_CURRY: 'Non-veg option',
            CHANA_MASALA: 'Legume curry',
            DAL_BHAT_SOYA: 'Full meal with rice',
        },
    },

    // Soya Chunks (DRY) - swaps with other DRY snacks, NOT curries
    SOYA_CHUNKS: {
        alternatives: ['ROASTED_CHANA', 'KALA_CHANA', 'PEANUTS', 'CHANA_BOILED', 'MIXED_NUTS'],
        hints: {
            ROASTED_CHANA: 'Dry snack alternative',
            KALA_CHANA: 'Boiled option',
            PEANUTS: 'Easy to carry',
            CHANA_BOILED: 'Plain boiled',
            MIXED_NUTS: 'Variety snack',
        },
    },
};

// Categories for smart fallback
const FOOD_CATEGORIES: Record<string, FoodId[]> = {
    PROTEIN_HIGH: ['CHICKEN_CURRY', 'CHICKEN_AIRFRIED', 'CHICKEN_GRILLED', 'BUFF_CURRY', 'FISH_CURRY', 'EGGS_BOILED', 'SOYA_CHUNKS', 'PANEER', 'WHEY', 'DAL_BHAT_CHICKEN'],
    PROTEIN_VEG: ['SOYA_CHUNKS', 'SOYA_CURRY', 'PANEER', 'PANEER_CURRY', 'KALA_CHANA', 'RAJMA', 'TOFU', 'DAL', 'DAHI'],
    EGGS: ['EGGS_BOILED', 'EGGS_OMELETTE', 'EGGS_FRIED', 'EGGS_BHURJI', 'EGG_CURRY', 'TOAST_EGG'],
    DAL_BHAT: ['DAL_BHAT_TARKARI', 'DAL_BHAT_CHICKEN', 'DAL_BHAT_EGG', 'DAL_BHAT_PANEER', 'DAL_BHAT_SOYA', 'DAL_BHAT_FISH', 'DAL_BHAT_MUTTON', 'BHAT_MASU', 'BHAT_TARKARI'],
    DAIRY: ['MILK', 'DAHI', 'LASSI', 'BUTTERMILK', 'PANEER', 'CHIURA_DAHI'],
    NUTS: ['PEANUTS', 'ALMONDS', 'CASHEWS', 'WALNUTS', 'MIXED_NUTS', 'ROASTED_CHANA', 'PEANUT_BUTTER'],
    FRUITS: ['BANANA', 'APPLE', 'ORANGE', 'MANGO', 'PAPAYA', 'POMEGRANATE'],
    BREAKFAST: ['OATS', 'OATS_BANANA', 'OATS_HONEY', 'CORNFLAKES', 'CHIURA_DAHI', 'BREAD_PEANUT_BUTTER', 'TOAST_EGG', 'PARATHA'],
    SNACKS: ['PEANUTS', 'ALMONDS', 'ROASTED_CHANA', 'MAKHANA', 'DIGESTIVE_BISCUITS', 'PROTEIN_BAR'],
};

// Get food category
function getFoodCategory(foodId: FoodId): string | null {
    for (const [category, foods] of Object.entries(FOOD_CATEGORIES)) {
        if (foods.includes(foodId)) {
            return category;
        }
    }
    return null;
}

// Generate universal swaps based on category and protein content
function generateUniversalSwaps(foodId: FoodId): { alternatives: FoodId[]; hints: Partial<Record<FoodId, string>> } {
    const food = FOOD_DATABASE[foodId];
    if (!food) return { alternatives: [], hints: {} };

    const category = getFoodCategory(foodId);
    const alternatives: FoodId[] = [];
    const hints: Partial<Record<FoodId, string>> = {};

    // Get foods from same category
    if (category && FOOD_CATEGORIES[category]) {
        const categoryFoods = FOOD_CATEGORIES[category].filter(f => f !== foodId && FOOD_DATABASE[f]);
        alternatives.push(...categoryFoods.slice(0, 5));
        categoryFoods.forEach(f => {
            const altFood = FOOD_DATABASE[f];
            if (altFood) {
                hints[f] = `${altFood.macros.protein}g protein`;
            }
        });
    }

    // Add protein alternatives if current food has protein
    if (food.macros.protein >= 5 && alternatives.length < 6) {
        const proteinFoods = getProteinFoods()
            .filter(f => f.id !== foodId && !alternatives.includes(f.id))
            .slice(0, 6 - alternatives.length);

        proteinFoods.forEach(f => {
            alternatives.push(f.id);
            hints[f.id] = `${f.macros.protein}g protein alternative`;
        });
    }

    return { alternatives, hints };
}

export interface SwapOption {
    foodId: FoodId;
    food: FoodItem;
    hint: string;
    available: boolean;
}

// Get swap options for a food item (with universal fallback!)
export function getSwapOptions(
    foodId: FoodId,
    availableFoodIds: FoodId[],
    intention: MealIntention
): SwapOption[] {
    // Try specific swaps first
    let swapInfo = SPECIFIC_SWAPS[foodId];

    // Universal fallback if no specific swaps
    if (!swapInfo || swapInfo.alternatives.length === 0) {
        const universal = generateUniversalSwaps(foodId);
        if (universal.alternatives.length > 0) {
            swapInfo = universal;
        } else {
            return [];
        }
    }

    // Filter junk in DAMAGE_CONTROL mode
    const junkFoods: FoodId[] = ['MOMOS', 'CHOWMEIN', 'SAMOSA', 'SUGARY_TEA', 'PIZZA', 'BURGER', 'FRIES', 'COLD_DRINK', 'INSTANT_NOODLES'];

    return swapInfo.alternatives
        .filter(alt => {
            if (!FOOD_DATABASE[alt]) return false;
            if (intention === 'DAMAGE_CONTROL') {
                return !junkFoods.includes(alt);
            }
            return true;
        })
        .map(alt => ({
            foodId: alt,
            food: getFood(alt),
            hint: swapInfo!.hints[alt] || 'Alternative option',
            available: availableFoodIds.includes(alt),
        }))
        .sort((a, b) => {
            if (a.available && !b.available) return -1;
            if (!a.available && b.available) return 1;
            return b.food.macros.protein - a.food.macros.protein;
        });
}

// Check if swap is valid
export function isValidSwap(
    from: FoodId,
    to: FoodId,
    availableFoodIds: FoodId[],
    intention: MealIntention
): boolean {
    const options = getSwapOptions(from, availableFoodIds, intention);
    return options.some(opt => opt.foodId === to);
}

// Universally available foods
export const ALWAYS_AVAILABLE: FoodId[] = [
    'WATER',
    'COFFEE_BLACK',
    'TEA_PLAIN',
    'BANANA',
    'APPLE',
    'ORANGE',
    'BISCUITS',
    'BREAD_BUTTER',
];

export function isAlwaysAvailable(foodId: FoodId): boolean {
    return ALWAYS_AVAILABLE.includes(foodId);
}
