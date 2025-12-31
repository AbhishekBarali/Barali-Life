// ============================================
// MEAL TEMPLATES - Mode-based meal generation
// FIXED: Social Mode realistic, variety options
// ============================================

import { Mode, MealSlot, MealPlan, MealIntention, FoodItem } from '../types';
import { getFood, FOOD_DATABASE } from './foods';

// ============================================
// Template definitions for each mode
// Each mode now has MULTIPLE OPTIONS per slot for variety
// ============================================

// Variety pools - pick random items from these for variety
// ============================================
// Variety pools - pick random items from these for variety
// ============================================
const BREAKFAST_PROTEINS = ['EGGS_BOILED', 'EGGS_OMELETTE', 'EGGS_FRIED', 'EGGS_BHURJI'];
const BREAKFAST_CARBS = ['BREAD_PEANUT_BUTTER', 'PARATHA', 'OATS', 'BREAD_HONEY', 'MUESLI'];
const BREAKFAST_EXTRAS = ['BANANA', 'MILK', 'APPLE', 'TEA_PLAIN', 'COFFEE_MILK'];

const LUNCH_MAINS = ['DAL_BHAT_CHICKEN', 'DAL_BHAT_MUTTON', 'DAL_BHAT_EGG', 'DAL_BHAT_FISH', 'DAL_BHAT_PANEER', 'DAL_BHAT_TARKARI'];
const LUNCH_SIDES = ['SALAD', 'TARKARI', 'ACHAR', 'DAHI'];

const DINNER_MAINS = ['DAL_BHAT_EGG', 'DAL_BHAT_SOYA', 'DAL_BHAT_PANEER', 'ROTI_DAL', 'DAL_BHAT_CHICKEN', 'KHICHDI'];
const DINNER_SIDES = ['DAHI', 'TARKARI', 'SALAD'];

const SNACK_PROTEINS = ['WHEY', 'PEANUTS', 'ALMONDS', 'ROASTED_CHANA', 'MIXED_NUTS', 'EGGS_BOILED'];
const SNACK_EXTRAS = ['BANANA', 'APPLE', 'ORANGE', 'DIGESTIVE_BISCUITS', 'BREAD_PEANUT_BUTTER'];

// Low effort pools for Burnt Out modes
const QUICK_BREAKFAST = ['MUESLI', 'BREAD_PEANUT_BUTTER', 'OATS', 'BANANA', 'MILK'];
const QUICK_MEALS = ['DAL_BHAT_TARKARI', 'KHICHDI', 'ROTI_DAL', 'INSTANT_NOODLES_EGG', 'BREAD_PEANUT_BUTTER'];
const QUICK_SNACKS = ['PEANUTS', 'ROASTED_CHANA', 'BANANA', 'ALMONDS', 'DAHI'];

// Helper to pick random item from array
function pickRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Helper to pick random items from array (no duplicates)
function pickRandomMany<T>(arr: T[], count: number): T[] {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, arr.length));
}

// Helper to pick smart based on inventory
function pickSmart(pool: string[], inventory: string[]): string {
    const inStock = pool.filter(id => inventory.includes(id));
    // 80% chance to pick from inventory if available
    if (inStock.length > 0 && Math.random() < 0.8) {
        return pickRandom(inStock);
    }
    return pickRandom(pool);
}

// ============================================
// BASE Template definitions for each mode
// 4 modes: STANDARD_DAY, COLLEGE_RUSH, BURNT_OUT, BURNT_OUT_COLLEGE
// ============================================
const MEAL_TEMPLATES: Record<Mode, Record<MealSlot, { items: string[]; intention: MealIntention; note?: string }>> = {
    // STANDARD DAY - Normal 7 AM wake, gym at 2 PM
    STANDARD_DAY: {
        BREAKFAST: {
            items: ['EGGS_BOILED', 'BREAD_PEANUT_BUTTER', 'BANANA', 'MILK'],
            intention: 'PROTEIN_FOCUS',
            note: 'Start with protein',
        },
        LUNCH: {
            items: ['DAL_BHAT_CHICKEN', 'SALAD'],
            intention: 'BALANCED',
            note: 'Big lunch',
        },
        MORNING_SNACK: {
            items: ['MIXED_NUTS', 'APPLE'],
            intention: 'LIGHT',
            note: 'Pre-workout snack',
        },
        EVENING_SNACK: {
            items: ['WHEY', 'BANANA'],
            intention: 'PROTEIN_FOCUS',
            note: 'Post-gym protein',
        },
        DINNER: {
            items: ['DAL_BHAT_EGG', 'TARKARI', 'DAHI'],
            intention: 'BALANCED',
            note: 'Light & balanced',
        },
    },

    // COLLEGE_RUSH - 5:30 AM wake, tiffin at 9:05, return home 12 PM
    COLLEGE_RUSH: {
        BREAKFAST: {
            items: ['BREAD_PEANUT_BUTTER', 'BANANA', 'MILK'],
            intention: 'LIGHT',
            note: '5:30 AM - Quick! No time to cook',
        },
        MORNING_SNACK: {
            items: ['PARATHA', 'EGGS_BOILED'],
            intention: 'PROTEIN_FOCUS',
            note: '🍱 Tiffin - packed from home',
        },
        LUNCH: {
            items: ['DAL_BHAT_CHICKEN', 'SALAD'],
            intention: 'BALANCED',
            note: '12 PM - Home, big lunch before gym',
        },
        EVENING_SNACK: {
            items: ['WHEY', 'BANANA'],
            intention: 'PROTEIN_FOCUS',
            note: '4 PM Post-gym',
        },
        DINNER: {
            items: ['DAL_BHAT_EGG', 'DAHI'],
            intention: 'BALANCED',
            note: '7:30 PM Dinner',
        },
    },

    // BURNT OUT - Low energy day, 7 AM wake, minimal cooking
    BURNT_OUT: {
        BREAKFAST: {
            items: ['MUESLI', 'BANANA', 'MILK'],
            intention: 'LIGHT',
            note: '7 AM - No cooking needed',
        },
        LUNCH: {
            items: ['DAL_BHAT_TARKARI', 'DAHI'],
            intention: 'LIGHT',
            note: 'Simple dal bhat',
        },
        MORNING_SNACK: {
            items: ['PEANUTS', 'ORANGE'],
            intention: 'LIGHT',
            note: 'Light snack',
        },
        EVENING_SNACK: {
            items: ['WHEY', 'BANANA'],
            intention: 'PROTEIN_FOCUS',
            note: '4 PM - Easy protein',
        },
        DINNER: {
            items: ['ROTI_DAL', 'DAHI'],
            intention: 'LIGHT',
            note: 'Simple roti dal',
        },
    },

    // BURNT OUT COLLEGE - Low energy college day, 5:30 AM wake
    BURNT_OUT_COLLEGE: {
        BREAKFAST: {
            items: ['MUESLI', 'BANANA', 'MILK'],
            intention: 'LIGHT',
            note: 'Zero effort breakfast',
        },
        MORNING_SNACK: {
            items: ['BREAD_PEANUT_BUTTER', 'APPLE'],
            intention: 'LIGHT',
            note: '🍱 Tiffin - easy to pack',
        },
        LUNCH: {
            items: ['DAL_BHAT_TARKARI', 'DAHI'],
            intention: 'LIGHT',
            note: 'Simple home meal',
        },
        EVENING_SNACK: {
            items: ['WHEY'],
            intention: 'PROTEIN_FOCUS',
            note: '4 PM - Skip gym if tired',
        },
        DINNER: {
            items: ['KHICHDI', 'DAHI'],
            intention: 'LIGHT',
            note: 'Super easy khichdi',
        },
    },

    // SUNDAY SPECIAL
    SUNDAY_SPECIAL: {
        BREAKFAST: {
            items: ['MILK', 'BANANA', 'ROASTED_CHANA'],
            intention: 'LIGHT',
            note: 'Quick before leaving',
        },
        MORNING_SNACK: {
            items: ['EGGS_BOILED', 'DAHI'],
            intention: 'PROTEIN_FOCUS',
            note: '🍱 Tiffin at 9:15 AM',
        },
        LUNCH: {
            items: ['DAL_BHAT_CHICKEN', 'TARKARI', 'SALAD'],
            intention: 'BALANCED',
            note: 'Late lunch after bus',
        },
        EVENING_SNACK: {
            items: ['DAHI', 'BANANA'],
            intention: 'LIGHT',
            note: 'Light snack (no gym)',
        },
        DINNER: {
            items: ['DAL_BHAT_EGG', 'TARKARI', 'DAHI'],
            intention: 'BALANCED',
            note: 'Dinner',
        },
    },
};

// ============================================
// Generate meals for a mode (with variety)
// ============================================
export function generateMealsForMode(mode: Mode): Record<MealSlot, MealPlan> {
    const template = MEAL_TEMPLATES[mode];

    // Fallback if template doesn't exist
    if (!template) {
        console.warn(`Template not found for mode "${mode}", falling back to STANDARD_DAY`);
        return generateMealsForMode('STANDARD_DAY');
    }

    const result: Partial<Record<MealSlot, MealPlan>> = {};

    for (const slot of Object.keys(template) as MealSlot[]) {
        const slotTemplate = template[slot];
        result[slot] = {
            slot,
            items: slotTemplate.items.map(id => getFood(id as any)).filter(Boolean) as FoodItem[],
            intention: slotTemplate.intention,
            note: slotTemplate.note,
        };
    }

    return result as Record<MealSlot, MealPlan>;
}

// ============================================
// Generate RANDOMIZED meals for variety
// FIXED: Supports ALL modes and Inventory prioritization
// ============================================
// Helper to pick unique items from multiple pools
function pickUniqueFromPools(pools: string[][], inventory: string[], count: number): string[] {
    const selected = new Set<string>();
    const allOptions = pools.flat();

    // Safety break
    let attempts = 0;
    while (selected.size < count && attempts < 20) {
        attempts++;
        // Cycle through pools to distribute variety
        const pool = pools[(selected.size) % pools.length];
        const item = pickSmart(pool, inventory);
        selected.add(item);
    }

    return Array.from(selected);
}

// ============================================
// Generate RANDOMIZED meals for variety
// FIXED: Supports ALL modes and Inventory with NO DUPLICATES
// ============================================
export function generateRandomizedMeals(mode: Mode, inventory: string[] = []): Record<MealSlot, MealPlan> {
    const base = generateMealsForMode(mode);

    // Apply shuffling logic based on mode type
    if (mode === 'STANDARD_DAY' || mode === 'COLLEGE_RUSH' || mode === 'SUNDAY_SPECIAL') {
        // High effort / Normal shuffle

        // Breakfast: 3 items (Protein, Carb, Extra)
        const breakfastItems = pickUniqueFromPools(
            [BREAKFAST_PROTEINS, BREAKFAST_CARBS, BREAKFAST_EXTRAS],
            inventory,
            3
        );

        base['BREAKFAST'] = {
            ...base['BREAKFAST'],
            items: breakfastItems.map(id => getFood(id as any)).filter(Boolean) as FoodItem[],
        };

        // Lunch: 2 items (Main, Side)
        const lunchItems = pickUniqueFromPools([LUNCH_MAINS, LUNCH_SIDES], inventory, 2);

        base['LUNCH'] = {
            ...base['LUNCH'],
            items: lunchItems.map(id => getFood(id as any)).filter(Boolean) as FoodItem[],
        };

        // Dinner: 3 items (Main, Side, Side)
        const dinnerItems = pickUniqueFromPools([DINNER_MAINS, DINNER_SIDES], inventory, 3);

        base['DINNER'] = {
            ...base['DINNER'],
            items: dinnerItems.map(id => getFood(id as any)).filter(Boolean) as FoodItem[],
        };

        // Randomize snacks
        const snackItems = pickUniqueFromPools([SNACK_PROTEINS, SNACK_EXTRAS], inventory, 2);

        // Apply to Morning or Evening depending on mode slot
        if (base['MORNING_SNACK']) {
            base['MORNING_SNACK'].items = snackItems.map(id => getFood(id as any)).filter(Boolean) as FoodItem[];
        }
    }
    else if (mode.includes('BURNT_OUT')) {
        // Low effort shuffle (pick from quick pools)

        // Breakfast: 2 items
        const quickBreakfastItems = pickUniqueFromPools([QUICK_BREAKFAST, BREAKFAST_EXTRAS], inventory, 2);

        base['BREAKFAST'] = {
            ...base['BREAKFAST'],
            items: quickBreakfastItems.map(id => getFood(id as any)).filter(Boolean) as FoodItem[],
        };

        // Lunch: 2 items
        const quickLunchItems = pickUniqueFromPools([QUICK_MEALS, ['DAHI', 'ACHAR', 'SALAD']], inventory, 2);

        base['LUNCH'] = {
            ...base['LUNCH'],
            items: quickLunchItems.map(id => getFood(id as any)).filter(Boolean) as FoodItem[],
        };

        // Dinner: 2 items
        const quickDinnerItems = pickUniqueFromPools([QUICK_MEALS, ['DAHI', 'SALAD']], inventory, 2);

        base['DINNER'] = {
            ...base['DINNER'],
            items: quickDinnerItems.map(id => getFood(id as any)).filter(Boolean) as FoodItem[],
        };
    }

    return base;
}

// ============================================
// Damage control meal (after junk food)
// ============================================
export function createDamageControlMeal(slot: MealSlot): MealPlan {
    // High protein, low carb damage control
    const damageControlItems = {
        BREAKFAST: ['EGGS_BOILED', 'DAHI', 'SALAD'],
        MORNING_SNACK: ['ALMONDS'],
        LUNCH: ['DAL', 'CHICKEN_GRILLED', 'SALAD', 'DAHI'],
        EVENING_SNACK: ['WHEY'],
        DINNER: ['SALAD', 'CHICKEN_GRILLED', 'DAHI', 'WHEY'],
    };

    return {
        slot,
        items: damageControlItems[slot].map(id => getFood(id as any)).filter(Boolean) as FoodItem[],
        intention: 'DAMAGE_CONTROL',
        note: '⚠️ Damage Control - extra protein, minimal carbs',
    };
}

// ============================================
// Restaurant cards for Social Mode
// MORE REALISTIC with actual portion info
// ============================================
export const RESTAURANT_CARDS = [
    {
        name: 'Momo Shop',
        emoji: '🥟',
        bestChoice: 'Buff Momo (10pc) - 18-20g protein',
        ifForced: 'Steam over fried, skip jhol achar',
        avoid: 'Veg momo (only 6g protein for 10pc)',
        compensate: 'Whey shake after if still hungry',
        proteinTip: '10pc steam buff momo ≈ 18g protein',
    },
    {
        name: 'Sekuwa Stall',
        emoji: '🍗',
        bestChoice: 'Chicken Sekuwa (200g) - 40g protein',
        ifForced: 'Skip the rice, eat with salad',
        avoid: 'Too much bread/rice on the side',
        compensate: 'One of the best social options!',
        proteinTip: '100g chicken sekuwa ≈ 20g protein',
    },
    {
        name: 'Dal Bhat Place',
        emoji: '🍛',
        bestChoice: 'Dal Bhat + Chicken + Extra meat',
        ifForced: 'Ask for extra dal, add egg',
        avoid: 'Pure veg sets without protein',
        compensate: 'Add whey if protein is low',
        proteinTip: 'Chicken curry ≈ 25g protein',
    },
    {
        name: 'Fast Food',
        emoji: '🍔',
        bestChoice: 'Grilled chicken burger (skip fries)',
        ifForced: 'Burger without fries, no cold drink',
        avoid: 'Combo meals, large fries, sodas',
        compensate: 'Salad + whey for next meal',
        proteinTip: 'Chicken burger ≈ 15-20g protein',
    },
    {
        name: 'Pizza Place',
        emoji: '🍕',
        bestChoice: 'Chicken/paneer pizza (2 slices max)',
        ifForced: 'Share with friends, don\'t finish alone',
        avoid: 'Cheesy crust, extra cheese, garlic bread',
        compensate: 'Skip dinner rice, have whey + salad',
        proteinTip: '2 slices chicken pizza ≈ 10-12g protein',
    },
];

// ============================================
// Emergency foods (when stuck/traffic)
// ============================================
export const EMERGENCY_FOODS = [
    'WHEY',
    'BANANA',
    'PEANUTS',
    'ALMONDS',
    'ROASTED_CHANA',
    'WATER',
];
