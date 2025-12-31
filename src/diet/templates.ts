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
export function generateRandomizedMeals(mode: Mode, inventory: string[] = []): Record<MealSlot, MealPlan> {
    const base = generateMealsForMode(mode);

    // Apply shuffling logic based on mode type
    if (mode === 'STANDARD_DAY' || mode === 'COLLEGE_RUSH' || mode === 'SUNDAY_SPECIAL') {
        // High effort / Normal shuffle
        const breakfastProtein = pickSmart(BREAKFAST_PROTEINS, inventory);
        const breakfastCarb = pickSmart(BREAKFAST_CARBS, inventory);
        const breakfastExtra = pickSmart(BREAKFAST_EXTRAS, inventory);

        base['BREAKFAST'] = {
            ...base['BREAKFAST'],
            items: [getFood(breakfastProtein as any), getFood(breakfastCarb as any), getFood(breakfastExtra as any)].filter(Boolean) as FoodItem[],
        };

        const lunchMain = pickSmart(LUNCH_MAINS, inventory);
        const lunchSide = pickSmart(LUNCH_SIDES, inventory);

        base['LUNCH'] = {
            ...base['LUNCH'],
            items: [getFood(lunchMain as any), getFood(lunchSide as any)].filter(Boolean) as FoodItem[],
        };

        const dinnerMain = pickSmart(DINNER_MAINS, inventory);
        const dinnerSide = pickSmart(DINNER_SIDES, inventory);

        base['DINNER'] = {
            ...base['DINNER'],
            items: [getFood(dinnerMain as any), getFood(dinnerSide as any)].filter(Boolean) as FoodItem[],
        };

        // Randomize snacks
        const snackProtein = pickSmart(SNACK_PROTEINS, inventory);
        const snackExtra = pickSmart(SNACK_EXTRAS, inventory);
        // Apply to Morning or Evening depending on mode slot
        if (base['MORNING_SNACK']) {
            base['MORNING_SNACK'].items = [getFood(snackExtra as any), getFood(snackProtein as any)].filter(Boolean) as FoodItem[];
            // Reverse order sometimes for variety? Nah keep simple
        }
    }
    else if (mode.includes('BURNT_OUT')) {
        // Low effort shuffle (pick from quick pools)
        const quickBreakfast = pickSmart(QUICK_BREAKFAST, inventory);
        const quickBreakfastExtra = pickSmart(BREAKFAST_EXTRAS, inventory);

        base['BREAKFAST'] = {
            ...base['BREAKFAST'],
            items: [getFood(quickBreakfast as any), getFood(quickBreakfastExtra as any)].filter(Boolean) as FoodItem[],
        };

        const quickMeal1 = pickSmart(QUICK_MEALS, inventory);
        const quickSide1 = pickSmart(['DAHI', 'ACHAR', 'SALAD'], inventory);

        base['LUNCH'] = {
            ...base['LUNCH'],
            items: [getFood(quickMeal1 as any), getFood(quickSide1 as any)].filter(Boolean) as FoodItem[],
        };

        const quickMeal2 = pickSmart(QUICK_MEALS, inventory);
        const quickSide2 = pickSmart(['DAHI', 'SALAD'], inventory);

        base['DINNER'] = {
            ...base['DINNER'],
            items: [getFood(quickMeal2 as any), getFood(quickSide2 as any)].filter(Boolean) as FoodItem[],
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
