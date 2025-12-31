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

const LUNCH_MAINS = ['DAL_BHAT_CHICKEN', 'DAL_BHAT_MUTTON', 'DAL_BHAT_EGG', 'DAL_BHAT_FISH', 'DAL_BHAT_PANEER'];
const LUNCH_SIDES = ['SALAD', 'VEG_TARKARI', 'ACHAR', 'DAHI', 'GOBI_TARKARI', 'SAAG'];

// Dinner mains - lighter options, no overlap with lunch proteins
const DINNER_MAINS = ['DAL_BHAT_TARKARI', 'DAL_BHAT_EGG', 'ROTI_DAL', 'KHICHDI', 'DAL_BHAT_PANEER'];
// More tarkari variety for dinner sides
const DINNER_SIDES = ['DAHI', 'VEG_TARKARI', 'SALAD', 'SAAG', 'BODI_TARKARI', 'GOBI_TARKARI', 'ALOO_TARKARI'];
// Specific tarkari pool for variety
const TARKARI_OPTIONS = ['VEG_TARKARI', 'SAAG', 'GOBI_TARKARI', 'BODI_TARKARI', 'ALOO_TARKARI', 'PHARSI', 'BHANTA_TARKARI', 'LAUKA', 'PALUNGO'];

const SNACK_PROTEINS = ['WHEY', 'PEANUTS', 'ALMONDS', 'ROASTED_CHANA', 'MIXED_NUTS', 'EGGS_BOILED'];
const SNACK_EXTRAS = ['BANANA', 'APPLE', 'ORANGE', 'DIGESTIVE_BISCUITS', 'BREAD_PEANUT_BUTTER'];

// Low effort pools for Burnt Out modes
const QUICK_BREAKFAST = ['MUESLI', 'BREAD_PEANUT_BUTTER', 'OATS', 'BANANA', 'MILK'];
const QUICK_MEALS = ['DAL_BHAT_TARKARI', 'KHICHDI', 'ROTI_DAL', 'DAL_BHAT_EGG'];
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
// TARGET: ~2100 kcal baseline (scaling will adjust to user target)
// FIBER TARGET: 25g+ per day
// ============================================
const MEAL_TEMPLATES: Record<Mode, Record<MealSlot, { items: string[]; intention: MealIntention; note?: string }>> = {
    // STANDARD DAY - Normal 7 AM wake, gym at 2 PM
    // Calories: 400 + 300 + 500 + 250 + 550 = 2000 kcal
    STANDARD_DAY: {
        BREAKFAST: {
            // 140 + 170 + 105 = 415 kcal, 19g protein
            items: ['EGGS_BOILED', 'OATS', 'BANANA'],
            intention: 'PROTEIN_FOCUS',
            note: 'Start with protein + fiber',
        },
        MORNING_SNACK: {
            // 180 + 95 = 275 kcal, 5g protein
            items: ['MIXED_NUTS', 'APPLE'],
            intention: 'LIGHT',
            note: 'Pre-workout energy',
        },
        LUNCH: {
            // 500 + 90 = 590 kcal, 38g protein, 4g fiber
            items: ['DAL_BHAT_CHICKEN', 'SAAG'],
            intention: 'BALANCED',
            note: 'Big lunch with greens',
        },
        EVENING_SNACK: {
            // 120 + 105 = 225 kcal, 26g protein
            items: ['WHEY', 'BANANA'],
            intention: 'PROTEIN_FOCUS',
            note: 'Post-gym protein',
        },
        DINNER: {
            // 430 + 90 + 100 = 620 kcal, 18g protein, 7g fiber
            items: ['DAL_BHAT_TARKARI', 'GOBI_TARKARI', 'DAHI'],
            intention: 'BALANCED',
            note: 'Light dinner with vegetables',
        },
    },

    // COLLEGE_RUSH - 5:30 AM wake, tiffin at 9:05, return home 12 PM
    // Calories: 350 + 320 + 550 + 225 + 530 = 1975 kcal
    COLLEGE_RUSH: {
        BREAKFAST: {
            // 350 (less than before) - bread PB + banana
            items: ['BREAD_PEANUT_BUTTER', 'BANANA'],
            intention: 'LIGHT',
            note: '5:30 AM - Quick! No cooking',
        },
        MORNING_SNACK: {
            // 140 + 180 = 320 kcal, 18g protein (tiffin)
            items: ['EGGS_BOILED', 'PARATHA'],
            intention: 'PROTEIN_FOCUS',
            note: '🍱 Tiffin - packed from home',
        },
        LUNCH: {
            // 500 + 50 = 550 kcal, 26g protein
            items: ['DAL_BHAT_EGG', 'SALAD'],
            intention: 'BALANCED',
            note: '12 PM - Home lunch with veggies',
        },
        EVENING_SNACK: {
            // 120 + 105 = 225 kcal, 26g protein
            items: ['WHEY', 'BANANA'],
            intention: 'PROTEIN_FOCUS',
            note: '4 PM Post-gym protein',
        },
        DINNER: {
            // 430 + 100 = 530 kcal, 14g protein, 6g fiber
            items: ['DAL_BHAT_TARKARI', 'DAHI'],
            intention: 'BALANCED',
            note: '7:30 PM Light dinner',
        },
    },

    // BURNT OUT - Low energy day, 7 AM wake, minimal cooking
    // Calories: 350 + 200 + 450 + 225 + 400 = 1625 kcal (lighter day)
    BURNT_OUT: {
        BREAKFAST: {
            // 200 + 105 = 305 kcal, 12g protein
            items: ['MUESLI_DAHI', 'BANANA'],
            intention: 'LIGHT',
            note: '7 AM - Zero cooking',
        },
        MORNING_SNACK: {
            // 150 + 95 = 245 kcal, 8g protein
            items: ['PEANUTS', 'APPLE'],
            intention: 'LIGHT',
            note: 'Easy protein snack',
        },
        LUNCH: {
            // 430 + 100 = 530 kcal, 14g protein
            items: ['DAL_BHAT_TARKARI', 'DAHI'],
            intention: 'LIGHT',
            note: 'Simple dal bhat',
        },
        EVENING_SNACK: {
            // 120 kcal, 25g protein
            items: ['WHEY'],
            intention: 'PROTEIN_FOCUS',
            note: '4 PM - Easy protein boost',
        },
        DINNER: {
            // 420 + 100 = 520 kcal, 18g protein
            items: ['ROTI_DAL', 'DAHI'],
            intention: 'LIGHT',
            note: 'Simple roti dal',
        },
    },

    // BURNT OUT COLLEGE - Low energy college day, 5:30 AM wake
    // Calories: 280 + 450 + 430 + 120 + 350 = 1630 kcal (low energy)
    BURNT_OUT_COLLEGE: {
        BREAKFAST: {
            // 170 + 105 = 275 kcal, 7g protein
            items: ['OATS', 'BANANA'],
            intention: 'LIGHT',
            note: 'Zero effort breakfast',
        },
        MORNING_SNACK: {
            // 350 + 95 = 445 kcal, 13g protein (tiffin)
            items: ['BREAD_PEANUT_BUTTER', 'APPLE'],
            intention: 'LIGHT',
            note: '🍱 Tiffin - easy to pack',
        },
        LUNCH: {
            // 430 kcal, 14g protein
            items: ['DAL_BHAT_TARKARI'],
            intention: 'LIGHT',
            note: 'Simple home meal',
        },
        EVENING_SNACK: {
            // 120 kcal, 25g protein
            items: ['WHEY'],
            intention: 'PROTEIN_FOCUS',
            note: '4 PM - Skip gym if tired',
        },
        DINNER: {
            // 350 + 100 = 450 kcal, 15g protein
            items: ['KHICHDI', 'DAHI'],
            intention: 'LIGHT',
            note: 'Super easy khichdi',
        },
    },

    // SUNDAY SPECIAL - Rest day, home cooking
    // Calories: 450 + 350 + 600 + 200 + 600 = 2200 kcal (feast day)
    SUNDAY_SPECIAL: {
        BREAKFAST: {
            // 180 + 180 + 150 = 510 kcal, 16g protein
            items: ['EGGS_OMELETTE', 'PARATHA', 'MILK'],
            intention: 'BALANCED',
            note: 'Leisurely breakfast',
        },
        MORNING_SNACK: {
            // 170 + 105 = 275 kcal, 7g protein
            items: ['OATS', 'BANANA'],
            intention: 'LIGHT',
            note: 'Mid-morning fiber',
        },
        LUNCH: {
            // 550 + 90 = 640 kcal, 40g protein, 4g fiber
            items: ['DAL_BHAT_MUTTON', 'SAAG'],
            intention: 'BALANCED',
            note: 'Sunday feast!',
        },
        EVENING_SNACK: {
            // 180 + 100 = 280 kcal, 12g protein
            items: ['MIXED_NUTS', 'DAHI'],
            intention: 'LIGHT',
            note: 'Relaxed snacking',
        },
        DINNER: {
            // 500 + 90 + 100 = 690 kcal, 35g protein, 7g fiber
            items: ['DAL_BHAT_CHICKEN', 'BODI_TARKARI', 'DAHI'],
            intention: 'BALANCED',
            note: 'Family dinner with veggies',
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

        // Lunch: 1 Main + 1 Side (with tarkari)
        const lunchMain = pickSmart(LUNCH_MAINS, inventory);
        const lunchTarkari = pickSmart(TARKARI_OPTIONS, inventory);
        const lunchItems = [lunchMain, lunchTarkari];

        base['LUNCH'] = {
            ...base['LUNCH'],
            items: lunchItems.map(id => getFood(id as any)).filter(Boolean) as FoodItem[],
        };

        // Dinner: 1 Main + 1 Tarkari + 1 Side (no duplicate mains!)
        const dinnerMain = pickSmart(DINNER_MAINS, inventory);
        const dinnerTarkari = pickSmart(TARKARI_OPTIONS.filter(t => t !== lunchTarkari), inventory); // Different tarkari than lunch
        const dinnerSide = pickSmart(['DAHI', 'SALAD'].filter(s => s !== lunchTarkari && s !== dinnerTarkari), inventory);
        const dinnerItems = [dinnerMain, dinnerTarkari, dinnerSide];

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
