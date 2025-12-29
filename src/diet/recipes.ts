// ============================================
// RECIPES DATABASE - Quick cooking methods
// ============================================

import { FoodId } from '../types';

export interface Recipe {
    foodId: FoodId;
    name: string;
    time: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    ingredients: string[];
    steps: string[];
    lazyTip?: string;
    proTip?: string;
}

export const RECIPES: Partial<Record<FoodId, Recipe>> = {
    // ============================================
    // EGGS
    // ============================================
    EGGS_BOILED: {
        foodId: 'EGGS_BOILED',
        name: 'Perfect Boiled Eggs',
        time: '12 min',
        difficulty: 'Easy',
        ingredients: ['2-4 eggs', 'Water', 'Salt (optional)'],
        steps: [
            'Put eggs in a pot, cover with cold water',
            'Bring to a rolling boil',
            'Turn off heat, cover with lid',
            'Wait 10 mins for hard boiled, 6 mins for soft',
            'Put in cold water to stop cooking',
            'Peel and enjoy with salt & pepper',
        ],
        lazyTip: 'Boil 6 eggs at once, store in fridge for 5 days. Instant protein!',
    },
    EGGS_OMELETTE: {
        foodId: 'EGGS_OMELETTE',
        name: 'Quick Omelette',
        time: '5 min',
        difficulty: 'Easy',
        ingredients: ['2 eggs', '1 tbsp oil/butter', 'Salt & pepper', 'Onion (optional)', 'Green chili (optional)'],
        steps: [
            'Beat eggs with salt in a bowl',
            'Heat oil in a pan on medium',
            'Add chopped onion & chili if using',
            'Pour beaten eggs',
            'Let it set for 1-2 mins',
            'Fold in half and serve',
        ],
        lazyTip: 'Skip veggies - plain omelette is just as good for protein!',
    },

    // ============================================
    // CHICKEN
    // ============================================
    CHICKEN_AIRFRIED: {
        foodId: 'CHICKEN_AIRFRIED',
        name: 'Air-Fried Chicken',
        time: '25 min',
        difficulty: 'Easy',
        ingredients: [
            '150g chicken pieces',
            '1 tbsp oil',
            '1 tsp salt',
            '1/2 tsp turmeric',
            '1/2 tsp red chili powder',
            '1/2 tsp garam masala',
        ],
        steps: [
            'Wash and pat dry chicken pieces',
            'Mix all spices with oil to make a paste',
            'Coat chicken well with the paste',
            'Let it marinate 10 mins (or overnight in fridge)',
            'Air fry at 180°C for 20-22 mins',
            'Flip halfway through',
            'Check if cooked through, serve hot',
        ],
        lazyTip: 'Marinate the night before. Next day just throw in air fryer!',
        proTip: 'For crispier skin, spray a little oil before air frying.',
    },
    CHICKEN_CURRY: {
        foodId: 'CHICKEN_CURRY',
        name: 'Simple Chicken Curry',
        time: '35 min',
        difficulty: 'Medium',
        ingredients: [
            '250g chicken',
            '2 onions (sliced)',
            '2 tomatoes (chopped)',
            '1 tbsp ginger-garlic paste',
            'Spices: turmeric, red chili, cumin, garam masala',
            'Oil, salt, water',
        ],
        steps: [
            'Heat oil, fry onions until golden',
            'Add ginger-garlic paste, cook 1 min',
            'Add tomatoes and all spices',
            'Cook until oil separates (5 mins)',
            'Add chicken, mix well',
            'Add 1 cup water, cover and cook 20 mins',
            'Check chicken is cooked, adjust salt',
        ],
        lazyTip: 'Use store-bought curry paste to skip half the steps!',
    },

    // ============================================
    // SOYA & LEGUMES
    // ============================================
    SOYA_CHUNKS: {
        foodId: 'SOYA_CHUNKS',
        name: 'Soya Chunks Curry',
        time: '20 min',
        difficulty: 'Easy',
        ingredients: [
            '50g soya chunks (dry)',
            '1 onion',
            '1 tomato',
            'Ginger-garlic paste',
            'Basic spices',
            'Oil',
        ],
        steps: [
            'Soak soya in hot water for 10 mins',
            'Squeeze out water completely',
            'Heat oil, fry onions',
            'Add paste and spices',
            'Add tomatoes, cook 3 mins',
            'Add soya chunks, mix well',
            'Add little water, cook 5 mins',
        ],
        lazyTip: 'Squeeze soya REALLY well or it will be rubbery!',
    },
    KALA_CHANA: {
        foodId: 'KALA_CHANA',
        name: 'Spicy Kala Chana',
        time: '15 min (pre-soaked)',
        difficulty: 'Easy',
        ingredients: [
            '1 cup kala chana (soaked overnight)',
            'Onion, tomato',
            'Cumin, coriander, garam masala',
            'Salt, oil',
        ],
        steps: [
            'Pressure cook soaked chana until soft (15 mins)',
            'Heat oil, add cumin seeds',
            'Add onions, cook until brown',
            'Add tomatoes and spices',
            'Add cooked chana with some water',
            'Simmer 5 mins, garnish with coriander',
        ],
        lazyTip: 'Use canned chickpeas for zero prep!',
    },

    // ============================================
    // BREAKFAST
    // ============================================
    CHIURA_DAHI: {
        foodId: 'CHIURA_DAHI',
        name: 'Chiura + Dahi Combo',
        time: '2 min',
        difficulty: 'Easy',
        ingredients: ['1 cup chiura (beaten rice)', '1 bowl dahi (curd)', 'Sugar or salt to taste'],
        steps: [
            'Put chiura in a bowl',
            'Add dahi on top',
            'Mix well',
            'Add sugar for sweet, salt for savory',
            'Eat immediately!',
        ],
        lazyTip: 'The ultimate lazy protein breakfast. No cooking required!',
    },
    OATS_BANANA: {
        foodId: 'OATS_BANANA',
        name: 'Oats + Banana Bowl',
        time: '5 min',
        difficulty: 'Easy',
        ingredients: ['1/2 cup oats', '1 cup milk/water', '1 banana', 'Honey (optional)'],
        steps: [
            'Cook oats with milk/water in microwave 2-3 mins',
            'Or cook on stove, stirring until thick',
            'Slice banana on top',
            'Drizzle honey if you want',
        ],
        lazyTip: 'Make overnight oats: mix oats + milk night before. Ready in morning!',
    },

    // ============================================
    // QUICK PROTEINS
    // ============================================
    WHEY: {
        foodId: 'WHEY',
        name: 'Whey Protein Shake',
        time: '1 min',
        difficulty: 'Easy',
        ingredients: ['1 scoop whey protein', '250ml water or milk', 'Ice (optional)'],
        steps: [
            'Add liquid to shaker bottle first',
            'Add protein powder',
            'Shake vigorously for 30 seconds',
            'Drink within 1 hour of workout',
        ],
        lazyTip: 'Water = fewer calories. Milk = better taste. Your choice!',
        proTip: 'Add a banana for slower digestion before bed.',
    },
    DAHI: {
        foodId: 'DAHI',
        name: 'Fresh Dahi',
        time: '0 min',
        difficulty: 'Easy',
        ingredients: ['1 bowl dahi/curd'],
        steps: [
            'Scoop fresh dahi into bowl',
            'Eat as is, or add salt/sugar',
            'Great for gut health!',
        ],
        lazyTip: 'Buy from local dairy for freshest taste.',
    },
    PEANUTS: {
        foodId: 'PEANUTS',
        name: 'Roasted Peanuts',
        time: '0 min',
        difficulty: 'Easy',
        ingredients: ['30g peanuts', 'Salt (optional)'],
        steps: [
            'Buy pre-roasted peanuts',
            'Eat as snack',
            'Great protein + healthy fats!',
        ],
        lazyTip: 'Keep a jar at your desk. Instant 8g protein snack!',
    },

    // ============================================
    // SALADS
    // ============================================
    SALAD: {
        foodId: 'SALAD',
        name: 'Quick Fresh Salad',
        time: '5 min',
        difficulty: 'Easy',
        ingredients: [
            '1 cucumber',
            '1 tomato',
            '1/2 onion',
            'Salt, black pepper',
            'Lemon juice',
        ],
        steps: [
            'Chop all vegetables into bite-size pieces',
            'Mix in a bowl',
            'Add salt, pepper, lemon juice',
            'Toss and eat immediately',
        ],
        lazyTip: 'Pre-chop veggies on Sunday for instant salads all week.',
    },
};

// Get recipe for a food
export function getRecipe(foodId: FoodId): Recipe | null {
    return RECIPES[foodId] || null;
}

// Check if food has a recipe
export function hasRecipe(foodId: FoodId): boolean {
    return foodId in RECIPES;
}

// Get all recipes
export function getAllRecipes(): Recipe[] {
    return Object.values(RECIPES) as Recipe[];
}
