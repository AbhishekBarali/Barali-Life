// ============================================
// TIFFIN IDEAS - Categorized lunch box ideas
// 3 Categories: Quick Rush, Medium, Meal Prep
// ============================================

import { FoodId } from '../types';

export type TiffinCategory = 'QUICK_RUSH' | 'MEDIUM_TIME' | 'MEAL_PREP';

export interface TiffinIdea {
    id: string;
    name: string;
    emoji: string;
    category: TiffinCategory;
    items: FoodId[];
    totalProtein: number;
    totalCalories: number;
    prepTime: string;
    prepNote: string;
    tip?: string;
}

export const TIFFIN_CATEGORIES: Record<TiffinCategory, { label: string; emoji: string; description: string }> = {
    QUICK_RUSH: {
        label: 'Quick Rush',
        emoji: '🏃',
        description: 'No cooking, grab and go in < 5 min',
    },
    MEDIUM_TIME: {
        label: 'Medium Time',
        emoji: '⏰',
        description: '10-15 min of light cooking or assembly',
    },
    MEAL_PREP: {
        label: 'Meal Prep',
        emoji: '🌙',
        description: 'Prepare the night before, just pack in morning',
    },
};

export const TIFFIN_IDEAS: TiffinIdea[] = [
    // ============================================
    // 🏃 QUICK RUSH (< 5 min)
    // ============================================
    {
        id: 'TIFFIN_PB_BANANA',
        name: 'PB Toast + Banana',
        emoji: '🥜',
        category: 'QUICK_RUSH',
        items: ['BREAD_PEANUT_BUTTER', 'BANANA'],
        totalProtein: 13,
        totalCalories: 455,
        prepTime: '3 min',
        prepNote: 'Spread PB on bread, pack banana separately',
        tip: 'Wrap toast in foil to keep it from getting soggy',
    },
    {
        id: 'TIFFIN_EGGS_APPLE',
        name: 'Boiled Eggs + Apple',
        emoji: '🥚',
        category: 'QUICK_RUSH',
        items: ['EGGS_BOILED', 'APPLE'],
        totalProtein: 12,
        totalCalories: 235,
        prepTime: '2 min',
        prepNote: 'Pre-boil eggs, just peel and pack',
        tip: 'Boil 6 eggs on Sunday for the whole week!',
    },
    {
        id: 'TIFFIN_MUESLI_CUP',
        name: 'Muesli + Dahi Cup',
        emoji: '🥣',
        category: 'QUICK_RUSH',
        items: ['MUESLI', 'BANANA'],
        totalProtein: 13,
        totalCalories: 405,
        prepTime: '2 min',
        prepNote: 'Layer muesli and dahi in a jar, add banana on top',
        tip: 'Use a mason jar for easy transport and eating',
    },
    {
        id: 'TIFFIN_CHANA_BANANA',
        name: 'Roasted Chana + Banana',
        emoji: '🫘',
        category: 'QUICK_RUSH',
        items: ['ROASTED_CHANA', 'BANANA'],
        totalProtein: 11,
        totalCalories: 265,
        prepTime: '1 min',
        prepNote: 'The original grab-and-go Nepali tiffin!',
        tip: 'Keep a bag of roasted chana in your bag always',
    },
    {
        id: 'TIFFIN_NUTS_FRUIT',
        name: 'Mixed Nuts + Orange',
        emoji: '🥜',
        category: 'QUICK_RUSH',
        items: ['MIXED_NUTS', 'ORANGE'],
        totalProtein: 7,
        totalCalories: 235,
        prepTime: '1 min',
        prepNote: 'Zero prep needed, just grab and go',
        tip: 'Pre-portion nuts in small containers to avoid overeating',
    },

    // ============================================
    // ⏰ MEDIUM TIME (10-15 min)
    // ============================================
    {
        id: 'TIFFIN_PARATHA_EGG',
        name: 'Paratha + Egg Bhurji',
        emoji: '🥚',
        category: 'MEDIUM_TIME',
        items: ['PARATHA', 'EGGS_BHURJI'],
        totalProtein: 18,
        totalCalories: 475,
        prepTime: '12 min',
        prepNote: 'Make paratha, scramble eggs with onion-tomato',
        tip: 'Use leftover paratha from dinner for faster prep',
    },
    {
        id: 'TIFFIN_OMELETTE_SANDWICH',
        name: 'Omelette Sandwich',
        emoji: '🥪',
        category: 'MEDIUM_TIME',
        items: ['EGGS_OMELETTE', 'BREAD_BUTTER'],
        totalProtein: 16,
        totalCalories: 390,
        prepTime: '8 min',
        prepNote: 'Make flat omelette, put between buttered bread',
        tip: 'Add cheese slice for extra protein and taste',
    },
    {
        id: 'TIFFIN_ALOO_PARATHA',
        name: 'Aloo Paratha + Dahi',
        emoji: '🥔',
        category: 'MEDIUM_TIME',
        items: ['PARATHA_ALOO', 'DAHI'],
        totalProtein: 16,
        totalCalories: 450,
        prepTime: '15 min',
        prepNote: 'Stuff paratha with mashed potato, serve with curd',
        tip: 'Make dough the night before for faster morning prep',
    },
    {
        id: 'TIFFIN_CHIURA_EGG',
        name: 'Chiura + Egg Bhurji',
        emoji: '🍳',
        category: 'MEDIUM_TIME',
        items: ['CHIURA', 'EGGS_BHURJI'],
        totalProtein: 16,
        totalCalories: 385,
        prepTime: '10 min',
        prepNote: 'Classic Nepali combo - quick and filling',
        tip: 'Add some achar for extra flavor',
    },
    {
        id: 'TIFFIN_ROTI_PANEER',
        name: 'Roti + Paneer Bhurji',
        emoji: '🧀',
        category: 'MEDIUM_TIME',
        items: ['ROTI', 'PANEER_BHURJI'],
        totalProtein: 29,
        totalCalories: 530,
        prepTime: '15 min',
        prepNote: 'Make roti, crumble and cook paneer with spices',
        tip: 'Highest protein tiffin option for vegetarians!',
    },

    // ============================================
    // 🌙 MEAL PREP (Night Before)
    // ============================================
    {
        id: 'TIFFIN_OVERNIGHT_OATS',
        name: 'Overnight Oats',
        emoji: '🥣',
        category: 'MEAL_PREP',
        items: ['OATS', 'MILK', 'BANANA'],
        totalProtein: 15,
        totalCalories: 425,
        prepTime: '5 min (night)',
        prepNote: 'Mix oats + milk in jar at night. Add banana in morning.',
        tip: 'Add honey and chia seeds for extra nutrition',
    },
    {
        id: 'TIFFIN_SOYA_FRY',
        name: 'Dry Soya Fry',
        emoji: '🫘',
        category: 'MEAL_PREP',
        items: ['SOYA_CHUNKS', 'ROTI'],
        totalProtein: 35,
        totalCalories: 410,
        prepTime: '20 min (night)',
        prepNote: 'Make dry soya curry with lots of spices. Pack with roti.',
        tip: 'BEST protein-to-calorie ratio! Perfect for muscle building.',
    },
    {
        id: 'TIFFIN_EGG_FRIED_RICE',
        name: 'Egg Fried Rice',
        emoji: '🍳',
        category: 'MEAL_PREP',
        items: ['RICE', 'EGGS_BHURJI', 'VEG_TARKARI'],
        totalProtein: 19,
        totalCalories: 470,
        prepTime: '15 min (night)',
        prepNote: 'Use leftover rice, fry with eggs and veggies',
        tip: 'Day-old rice works best for fried rice!',
    },
    {
        id: 'TIFFIN_CHICKEN_RICE',
        name: 'Chicken Rice Box',
        emoji: '🍗',
        category: 'MEAL_PREP',
        items: ['RICE', 'CHICKEN_GRILLED', 'SALAD'],
        totalProtein: 41,
        totalCalories: 455,
        prepTime: '25 min (night)',
        prepNote: 'Grill chicken at night, pack with rice and salad',
        tip: 'The ultimate gym-bro tiffin. High protein, clean eating!',
    },
    {
        id: 'TIFFIN_PANEER_WRAP',
        name: 'Paneer Roti Roll',
        emoji: '🌯',
        category: 'MEAL_PREP',
        items: ['ROTI', 'PANEER', 'SALAD'],
        totalProtein: 31,
        totalCalories: 490,
        prepTime: '20 min (night)',
        prepNote: 'Make roti, add paneer tikka and veggies, roll it up',
        tip: 'Wrap in foil for easy eating during class break',
    },
    {
        id: 'TIFFIN_DAL_RICE',
        name: 'Mini Dal Bhat',
        emoji: '🍛',
        category: 'MEAL_PREP',
        items: ['RICE', 'DAL', 'ACHAR'],
        totalProtein: 13,
        totalCalories: 360,
        prepTime: '15 min (night)',
        prepNote: 'Pack leftover dal bhat from dinner. Classic!',
        tip: 'Use a thermal tiffin box to keep it warm',
    },
];

// Helper functions
export function getTiffinsByCategory(category: TiffinCategory): TiffinIdea[] {
    return TIFFIN_IDEAS.filter(t => t.category === category);
}

export function getTiffinById(id: string): TiffinIdea | undefined {
    return TIFFIN_IDEAS.find(t => t.id === id);
}

export function getAllTiffinCategories(): TiffinCategory[] {
    return ['QUICK_RUSH', 'MEDIUM_TIME', 'MEAL_PREP'];
}
