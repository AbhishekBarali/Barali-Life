// ============================================
// RECIPES DATABASE - Detailed cooking methods
// EXPANDED: Full portions, oil amounts, times
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
    portionNote?: string; // NEW: Clarify exact serving size
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
        portionNote: '2 eggs = 12g protein, 140 kcal. Add more eggs for higher protein days.',
    },
    EGGS_OMELETTE: {
        foodId: 'EGGS_OMELETTE',
        name: 'Quick Omelette',
        time: '5 min',
        difficulty: 'Easy',
        ingredients: [
            '2 eggs (~100g)',
            '1 tsp oil (5ml) OR 1 tsp butter (5g)',
            'Salt & pepper to taste',
            'Onion 20g (optional)',
            'Green chili 1 piece (optional)',
        ],
        steps: [
            'Beat eggs with salt in a bowl',
            'Heat 1 tsp oil in a pan on medium heat',
            'Add chopped onion & chili if using (30 sec)',
            'Pour beaten eggs evenly',
            'Let it set for 1-2 mins (don\'t stir)',
            'Fold in half and serve',
        ],
        lazyTip: 'Skip veggies - plain omelette is just as good for protein!',
        portionNote: '2 eggs with 1 tsp oil = 180 kcal, 12g protein. Oil adds ~45 kcal.',
    },
    EGGS_BHURJI: {
        foodId: 'EGGS_BHURJI',
        name: 'Egg Bhurji (Scrambled)',
        time: '7 min',
        difficulty: 'Easy',
        ingredients: [
            '2 eggs',
            '1 tbsp oil (15ml)',
            '1 small onion (50g), chopped',
            '1 small tomato (50g), chopped',
            '1 green chili, chopped',
            'Salt, turmeric (1/4 tsp), red chili powder (1/4 tsp)',
        ],
        steps: [
            'Heat 1 tbsp oil in a pan',
            'Add onions, sauté until light brown (2 min)',
            'Add tomatoes, chili, cook until soft (2 min)',
            'Add turmeric and red chili powder',
            'Crack eggs directly into pan',
            'Scramble continuously for 2-3 mins',
            'Season with salt and serve hot',
        ],
        lazyTip: 'Skip tomatoes for faster version - just onion + eggs work great.',
        portionNote: '2 eggs + veggies + 1 tbsp oil = 185 kcal, 12g protein',
    },

    // ============================================
    // DAL & RICE (THE STAPLES)
    // ============================================
    DAL: {
        foodId: 'DAL',
        name: 'Basic Dal (Lentils)',
        time: '25 min',
        difficulty: 'Easy',
        ingredients: [
            '1/2 cup masoor/moong dal (100g dry)',
            '2 cups water (500ml)',
            '1 tbsp oil/ghee (15ml)',
            '1 tsp cumin seeds (jeera)',
            '2 cloves garlic, sliced',
            '1/4 tsp turmeric (haldi)',
            'Salt to taste',
        ],
        steps: [
            'Wash dal 2-3 times until water runs clear',
            'Pressure cook dal with water, salt, turmeric (3 whistles)',
            'OR boil in pot for 20 mins until soft',
            'Heat oil in small pan, add cumin seeds',
            'Wait for seeds to splutter (10 sec)',
            'Add sliced garlic, fry until golden (30 sec)',
            'Pour tadka over cooked dal, mix',
        ],
        lazyTip: 'Cook 2 days worth at once. Reheat with water when needed.',
        proTip: 'Ghee tadka > Oil tadka for authentic taste.',
        portionNote: '1 bowl (150ml cooked) = 120 kcal, 9g protein. This is standard serving.',
    },
    RICE: {
        foodId: 'RICE',
        name: 'Plain White Rice',
        time: '20 min',
        difficulty: 'Easy',
        ingredients: [
            '1 cup raw rice (200g) - makes 2 servings',
            '2 cups water (400ml)',
            'Salt (optional)',
        ],
        steps: [
            'Wash rice 2-3 times until water is clear',
            'Soak for 10 mins (optional, makes fluffy)',
            'Add rice + water to pot, bring to boil',
            'Reduce heat to lowest, cover with lid',
            'Cook 12-15 mins until water absorbed',
            'Fluff with fork and serve',
        ],
        lazyTip: 'Use rice cooker - add rice + water and press button. Done!',
        portionNote: '1 serving = 150g cooked rice = 195 kcal, 4g protein. For cutting, use 100g.',
    },
    TARKARI: {
        foodId: 'TARKARI',
        name: 'Mixed Vegetable Tarkari',
        time: '15 min',
        difficulty: 'Easy',
        ingredients: [
            '200g mixed vegetables (potato, cauliflower, beans)',
            '1 tbsp oil (15ml)',
            '1/2 tsp cumin seeds',
            '1/4 tsp turmeric',
            '1/4 tsp red chili powder',
            'Salt to taste',
            '1/4 cup water',
        ],
        steps: [
            'Chop vegetables into bite-size pieces',
            'Heat 1 tbsp oil in pan or kadhai',
            'Add cumin seeds, wait to splutter',
            'Add vegetables, stir for 2 mins',
            'Add turmeric, chili, salt',
            'Add 1/4 cup water, cover and cook 10 mins',
            'Stir occasionally until vegetables are soft',
        ],
        lazyTip: 'Buy pre-cut vegetables from market to save time.',
        portionNote: '1 bowl (100g with oil) = 90 kcal. Very low calorie - eat more!',
    },

    // ============================================
    // DAL BHAT VARIANTS (Complete Meals)
    // ============================================
    DAL_BHAT_TARKARI: {
        foodId: 'DAL_BHAT_TARKARI',
        name: 'Dal Bhat Tarkari (Veg Plate)',
        time: '30 min',
        difficulty: 'Medium',
        ingredients: [
            '150g cooked rice (1 standard serving)',
            '150ml cooked dal (1 bowl)',
            '100g mixed tarkari',
            '1 tbsp achar',
        ],
        steps: [
            'Prepare rice, dal, and tarkari as per individual recipes',
            'Plate rice in center',
            'Add dal on one side, tarkari on other',
            'Add achar on the side',
            'Optional: Add dahi for extra protein',
        ],
        proTip: 'Add 2 boiled eggs to make this 26g protein instead of 14g!',
        portionNote: 'Standard plate = 430 kcal, 14g protein. For more protein, add egg or chicken.',
    },
    DAL_BHAT_CHICKEN: {
        foodId: 'DAL_BHAT_CHICKEN',
        name: 'Dal Bhat + Chicken Curry',
        time: '45 min',
        difficulty: 'Medium',
        ingredients: [
            '150g cooked rice',
            '150ml cooked dal',
            '150g chicken curry (bone-in pieces)',
            '1 bowl salad',
        ],
        steps: [
            'Prepare rice and dal as per individual recipes',
            'Cook chicken curry (see CHICKEN_CURRY recipe)',
            'Plate rice in center',
            'Add dal, chicken curry, and fresh salad',
        ],
        lazyTip: 'Use leftover chicken from last night. Just reheat!',
        proTip: '150g chicken = ~25-30g protein. Ask for boneless for more meat.',
        portionNote: '1 plate = 590 kcal, 38g protein. Reduce rice to 100g for cutting.',
    },
    DAL_BHAT_EGG: {
        foodId: 'DAL_BHAT_EGG',
        name: 'Dal Bhat + Egg Curry',
        time: '30 min',
        difficulty: 'Easy',
        ingredients: [
            '150g cooked rice',
            '150ml cooked dal',
            '2 boiled eggs in curry gravy',
            '100g tarkari',
            '1 bowl dahi',
        ],
        steps: [
            'Boil 2 eggs, peel them',
            'Make simple onion-tomato gravy (1 onion, 1 tomato, spices)',
            'Add boiled eggs to gravy, simmer 5 mins',
            'Plate with rice, dal, and tarkari',
        ],
        lazyTip: 'Pre-boil eggs in morning. Just make quick gravy at night.',
        portionNote: '1 plate = 520 kcal, 24g protein. Add 1 more egg for 30g protein.',
    },
    DAL_BHAT_PANEER: {
        foodId: 'DAL_BHAT_PANEER',
        name: 'Dal Bhat + Paneer Curry',
        time: '35 min',
        difficulty: 'Medium',
        ingredients: [
            '150g cooked rice',
            '150ml cooked dal',
            '100g paneer, cubed',
            '1 onion, 1 tomato',
            '1 tbsp oil',
            'Spices: turmeric, garam masala, red chili',
        ],
        steps: [
            'Cube paneer into 1-inch pieces',
            'Heat oil, fry paneer lightly (optional)',
            'Sauté onion until golden',
            'Add tomato and spices, cook until mushy',
            'Add paneer and 1/4 cup water',
            'Simmer 5 mins, serve with rice and dal',
        ],
        proTip: 'Don\'t overcook paneer or it becomes rubbery!',
        portionNote: '100g paneer = 20g protein, 260 kcal. Great for vegetarians!',
    },
    DAL_BHAT_SOYA: {
        foodId: 'DAL_BHAT_SOYA',
        name: 'Dal Bhat + Soya Curry',
        time: '30 min',
        difficulty: 'Easy',
        ingredients: [
            '150g cooked rice',
            '150ml cooked dal',
            '50g dry soya chunks (becomes 150g when soaked)',
            '1 onion, 1 tomato',
            '1 tbsp oil',
            'Standard spices',
        ],
        steps: [
            'Soak soya chunks in hot water for 10 mins',
            'Squeeze out ALL water (very important!)',
            'Make onion-tomato gravy with spices',
            'Add soya chunks, mix well',
            'Add 1/4 cup water, simmer 10 mins',
            'Serve with rice and dal',
        ],
        lazyTip: 'Squeeze soya REALLY hard or it tastes rubbery!',
        portionNote: '50g dry soya = 26g protein! Cheapest protein source in Nepal.',
    },

    // ============================================
    // ROTI MEALS
    // ============================================
    ROTI_DAL: {
        foodId: 'ROTI_DAL',
        name: '3 Roti + Dal',
        time: '25 min',
        difficulty: 'Medium',
        ingredients: [
            '1 cup atta flour (120g) for 3 rotis',
            'Water for kneading',
            '150ml cooked dal',
            '1 tsp ghee for rotis (optional)',
        ],
        steps: [
            'Knead flour with water to soft dough (5 mins)',
            'Rest dough 10 mins',
            'Divide into 3 balls, roll each flat',
            'Cook on hot tawa, flip when bubbles appear',
            'Press with cloth to puff up',
            'Apply ghee if desired, serve with dal',
        ],
        lazyTip: 'Buy ready-made rotis from market. Heat on tawa for 30 sec each side.',
        portionNote: '3 rotis + dal = 420 kcal, 18g protein. Low fat, good for cutting.',
    },
    KHICHDI: {
        foodId: 'KHICHDI',
        name: 'Simple Khichdi',
        time: '25 min',
        difficulty: 'Easy',
        ingredients: [
            '1/2 cup rice (100g)',
            '1/4 cup moong dal (50g)',
            '3 cups water',
            '1 tbsp ghee (15ml)',
            '1/2 tsp cumin seeds',
            'Salt, turmeric',
        ],
        steps: [
            'Wash rice and dal together',
            'Pressure cook with water, salt, turmeric (4 whistles)',
            'OR boil in pot until mushy (25 mins)',
            'Heat ghee, add cumin seeds',
            'Pour tadka over khichdi',
            'Mix well, add more water if too thick',
        ],
        lazyTip: 'Ultimate comfort food. One pot, no separates needed.',
        proTip: 'Add 2 boiled eggs for +12g protein!',
        portionNote: '1 big bowl = 300 kcal, 12g protein. Add eggs or paneer for more protein.',
    },

    // ============================================
    // BREAKFAST ITEMS
    // ============================================
    OATS: {
        foodId: 'OATS',
        name: 'Basic Oats',
        time: '5 min',
        difficulty: 'Easy',
        ingredients: [
            '40g rolled oats (1/2 cup dry)',
            '200ml milk OR water',
            'Pinch of salt',
            'Honey/banana (optional)',
        ],
        steps: [
            'Add oats + liquid to a pot',
            'Cook on medium heat, stirring often (3-4 mins)',
            'OR microwave for 2 mins, stir, 1 more min',
            'Add salt, top with banana or honey',
        ],
        lazyTip: 'Overnight oats: Mix oats + milk night before. Ready in morning!',
        portionNote: '40g dry oats + milk = 280 kcal. With water only = 150 kcal.',
    },
    MUESLI: {
        foodId: 'MUESLI',
        name: 'Muesli + Dahi Bowl',
        time: '2 min',
        difficulty: 'Easy',
        ingredients: [
            '50g muesli (check label for sugar)',
            '150g dahi/curd',
            '1/2 banana (optional)',
            'Honey (1 tsp, optional)',
        ],
        steps: [
            'Add muesli to bowl',
            'Pour dahi on top',
            'Slice banana if using',
            'Drizzle honey',
            'Mix and eat!',
        ],
        lazyTip: 'Zero cooking required. Perfect for college mornings!',
        proTip: 'Choose muesli with <15g sugar per 100g for healthier option.',
        portionNote: '50g muesli + 150g dahi = 300 kcal, 12g protein.',
    },
    BREAD_PEANUT_BUTTER: {
        foodId: 'BREAD_PEANUT_BUTTER',
        name: 'PB Toast',
        time: '3 min',
        difficulty: 'Easy',
        ingredients: [
            '2 slices bread (brown/whole wheat = 160 kcal)',
            '2 tbsp peanut butter (~32g = 190 kcal)',
        ],
        steps: [
            'Toast bread if desired',
            'Spread 1 tbsp peanut butter per slice',
            'Eat immediately (gets soggy if left)',
        ],
        lazyTip: 'No cooking. Maximum protein for minimum effort!',
        proTip: 'Natural peanut butter > sugary versions. Check ingredients.',
        portionNote: '2 slices + 2 tbsp PB = 350 kcal, 12g protein. Quick breakfast winner!',
    },
    PARATHA: {
        foodId: 'PARATHA',
        name: 'Plain Paratha',
        time: '15 min',
        difficulty: 'Medium',
        ingredients: [
            '1 cup atta flour (120g)',
            'Water for kneading',
            '2 tbsp oil/ghee (30ml) for cooking',
            'Salt to taste',
        ],
        steps: [
            'Knead flour + salt + water into soft dough',
            'Rest 10 mins',
            'Divide into 2 balls, roll each flat',
            'Apply 1/2 tsp ghee, fold, roll again',
            'Cook on hot tawa with 1 tsp oil per paratha',
            'Flip, press edges, cook until golden spots appear',
        ],
        lazyTip: 'Make extra dough, store in fridge. Fresh parathas in 5 mins!',
        portionNote: '2 parathas (with oil) = 290 kcal, 6g protein. High carb - good before gym.',
    },
    MILK: {
        foodId: 'MILK',
        name: 'Warm Milk',
        time: '3 min',
        difficulty: 'Easy',
        ingredients: [
            '250ml full cream milk = 150 kcal',
            'OR 250ml toned milk = 120 kcal',
            'Sugar (optional, 1 tsp = 20 kcal)',
        ],
        steps: [
            'Pour milk into pot',
            'Heat on medium until steaming (not boiling)',
            'Add sugar if desired',
            'Drink warm before bed for better sleep',
        ],
        lazyTip: 'Microwave for 90 seconds instead of pot.',
        proTip: 'Milk + 1 tsp honey before bed = great for recovery.',
        portionNote: '1 glass (250ml) = 150 kcal, 8g protein (full cream). Easy protein boost.',
    },

    // ============================================
    // CHICKEN
    // ============================================
    CHICKEN_CURRY: {
        foodId: 'CHICKEN_CURRY',
        name: 'Simple Chicken Curry',
        time: '35 min',
        difficulty: 'Medium',
        ingredients: [
            '250g chicken pieces (bone-in gives ~150g meat)',
            '2 onions (150g), sliced',
            '2 tomatoes (150g), chopped',
            '1 tbsp ginger-garlic paste (15g)',
            '2 tbsp oil (30ml)',
            'Spices: 1/2 tsp turmeric, 1 tsp red chili, 1/2 tsp cumin, 1/2 tsp garam masala',
            'Salt, 1 cup water',
        ],
        steps: [
            'Heat 2 tbsp oil, fry onions until golden (5 mins)',
            'Add ginger-garlic paste, cook 1 min',
            'Add tomatoes and all spices',
            'Cook until oil separates (5 mins)',
            'Add chicken, mix well, cook 5 mins',
            'Add 1 cup water, cover and cook 20 mins',
            'Check chicken is cooked (no pink inside)',
        ],
        lazyTip: 'Use store-bought curry paste to skip half the steps!',
        proTip: 'Marinate chicken in curd for 30 mins for tender meat.',
        portionNote: '150g cooked chicken = 250 kcal, 30g protein.',
    },
    CHICKEN_GRILLED: {
        foodId: 'CHICKEN_GRILLED',
        name: 'Grilled Chicken Breast',
        time: '20 min',
        difficulty: 'Easy',
        ingredients: [
            '150g chicken breast',
            '1 tsp oil (5ml)',
            '1/2 tsp salt',
            '1/4 tsp black pepper',
            '1/4 tsp garlic powder (optional)',
        ],
        steps: [
            'Pound breast to even thickness (or butterfly cut)',
            'Season both sides with salt, pepper, garlic',
            'Brush with 1 tsp oil',
            'Heat pan on high until smoking',
            'Cook 4-5 mins per side until cooked through',
            'Rest 3 mins before slicing',
        ],
        lazyTip: 'Air fryer: 180°C for 18 mins. Flip halfway.',
        proTip: 'Don\'t overcook! Internal temp should be 74°C.',
        portionNote: '150g breast = 210 kcal, 35g protein. LOWEST CALORIE protein!',
    },
    CHICKEN_AIRFRIED: {
        foodId: 'CHICKEN_AIRFRIED',
        name: 'Air-Fried Chicken',
        time: '25 min',
        difficulty: 'Easy',
        ingredients: [
            '150g chicken pieces (thigh or drumstick)',
            '1 tbsp oil (15ml)',
            '1 tsp salt',
            '1/2 tsp turmeric',
            '1/2 tsp red chili powder',
            '1/2 tsp garam masala',
        ],
        steps: [
            'Wash and pat dry chicken pieces',
            'Mix all spices with 1 tbsp oil to make paste',
            'Coat chicken well with the paste',
            'Marinate 10 mins (or overnight in fridge)',
            'Air fry at 180°C for 20-22 mins',
            'Flip halfway through',
        ],
        lazyTip: 'Marinate the night before. Next day just throw in air fryer!',
        proTip: 'For crispier skin, spray a little oil before air frying.',
        portionNote: '150g with 1 tbsp oil = 250 kcal, 35g protein.',
    },

    // ============================================
    // QUICK PROTEINS
    // ============================================
    WHEY: {
        foodId: 'WHEY',
        name: 'Whey Protein Shake',
        time: '1 min',
        difficulty: 'Easy',
        ingredients: [
            '1 scoop whey protein (30-35g powder)',
            '250ml water OR milk',
            'Ice (optional)',
        ],
        steps: [
            'Add liquid to shaker bottle first',
            'Add protein powder',
            'Shake vigorously for 30 seconds',
            'Drink within 1 hour of workout',
        ],
        lazyTip: 'Water = fewer calories (120). Milk = better taste (270).',
        proTip: 'Add a banana for slower digestion before bed.',
        portionNote: '1 scoop = 24g protein, 120 kcal. Most efficient protein source!',
    },
    DAHI: {
        foodId: 'DAHI',
        name: 'Fresh Dahi (Curd)',
        time: '0 min',
        difficulty: 'Easy',
        ingredients: ['150g dahi/curd (1 standard bowl)'],
        steps: [
            'Scoop fresh dahi into bowl',
            'Eat as is, or add salt/sugar',
            'Great for gut health!',
        ],
        lazyTip: 'Buy from local dairy for freshest taste.',
        portionNote: '150g dahi = 100 kcal, 8g protein. Add to every meal for easy protein.',
    },
    PEANUTS: {
        foodId: 'PEANUTS',
        name: 'Roasted Peanuts',
        time: '0 min',
        difficulty: 'Easy',
        ingredients: ['30g peanuts (small handful)', 'Salt (optional)'],
        steps: [
            'Buy pre-roasted peanuts',
            'Eat as snack',
            'Great protein + healthy fats!',
        ],
        lazyTip: 'Keep a jar at your desk. Instant 8g protein snack!',
        portionNote: '30g = 170 kcal, 8g protein. Don\'t eat whole jar - high calories!',
    },
    ROASTED_CHANA: {
        foodId: 'ROASTED_CHANA',
        name: 'Roasted Chana',
        time: '0 min',
        difficulty: 'Easy',
        ingredients: ['50g roasted chana (about 1/2 cup)'],
        steps: [
            'Buy pre-roasted chana from shop',
            'Eat as snack anytime',
            'High protein + fiber!',
        ],
        lazyTip: 'Cheapest high-protein snack. Keep at desk/bag always.',
        portionNote: '50g = 160 kcal, 10g protein. Best value protein snack!',
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
            '50g dry soya chunks',
            '1 onion (80g)',
            '1 tomato (80g)',
            '1 tbsp oil (15ml)',
            '1 tsp ginger-garlic paste',
            'Standard spices',
        ],
        steps: [
            'Soak soya in hot water for 10 mins',
            'Squeeze out ALL water (very important!)',
            'Heat oil, fry onions until brown',
            'Add paste and spices',
            'Add tomatoes, cook 3 mins',
            'Add soya chunks, mix well',
            'Add 1/4 cup water, cook 5 mins',
        ],
        lazyTip: 'Squeeze soya REALLY well or it will be rubbery and taste bad!',
        portionNote: '50g dry = 170 kcal, 26g protein. CHEAPEST protein in Nepal!',
    },
    KALA_CHANA: {
        foodId: 'KALA_CHANA',
        name: 'Spicy Kala Chana',
        time: '15 min (pre-soaked)',
        difficulty: 'Easy',
        ingredients: [
            '1 cup kala chana (soaked overnight, ~150g dry)',
            '1 onion, 1 tomato',
            '1 tbsp oil',
            'Cumin, coriander, garam masala',
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
        portionNote: '1 bowl cooked = 220 kcal, 15g protein.',
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
            '1 cucumber (100g)',
            '1 tomato (80g)',
            '1/2 onion (40g)',
            'Salt, black pepper',
            'Lemon juice (1 tbsp)',
            'NO OIL needed',
        ],
        steps: [
            'Chop all vegetables into bite-size pieces',
            'Mix in a bowl',
            'Add salt, pepper, lemon juice',
            'Toss and eat immediately',
        ],
        lazyTip: 'Pre-chop veggies on Sunday for instant salads all week.',
        portionNote: '1 bowl (150g) = 50 kcal, 2g protein. Eat unlimited - very low calorie!',
    },

    // ============================================
    // SNACKS
    // ============================================
    BANANA: {
        foodId: 'BANANA',
        name: 'Banana',
        time: '0 min',
        difficulty: 'Easy',
        ingredients: ['1 medium banana (100-120g)'],
        steps: ['Peel and eat!', 'Great pre or post workout.'],
        lazyTip: 'Keep 2-3 bananas with you always. Best quick carb source.',
        portionNote: '1 medium banana = 105 kcal, 27g carbs. Perfect pre-gym fuel.',
    },
    APPLE: {
        foodId: 'APPLE',
        name: 'Apple',
        time: '0 min',
        difficulty: 'Easy',
        ingredients: ['1 medium apple (150g)'],
        steps: ['Wash and eat with skin!', 'Skin has most fiber.'],
        lazyTip: 'Keep in bag for emergency hunger.',
        portionNote: '1 apple = 95 kcal. Low calorie snack with fiber.',
    },
    ALMONDS: {
        foodId: 'ALMONDS',
        name: 'Almonds',
        time: '0 min',
        difficulty: 'Easy',
        ingredients: ['30g almonds (~20-22 almonds)'],
        steps: ['Eat raw or roasted', 'Don\'t eat too many - calorie dense!'],
        lazyTip: 'Soak overnight for easier digestion.',
        portionNote: '30g = 175 kcal, 6g protein, 15g healthy fats. Limit to 30g/day!',
    },

    // ============================================
    // CHIURA
    // ============================================
    CHIURA_DAHI: {
        foodId: 'CHIURA_DAHI',
        name: 'Chiura + Dahi Combo',
        time: '2 min',
        difficulty: 'Easy',
        ingredients: [
            '1 cup chiura (60g beaten rice)',
            '150g dahi (1 bowl)',
            'Sugar or salt to taste',
        ],
        steps: [
            'Put chiura in a bowl',
            'Add dahi on top',
            'Mix well',
            'Add sugar for sweet, salt for savory',
        ],
        lazyTip: 'The ultimate lazy protein breakfast. No cooking required!',
        portionNote: '1 bowl = 300 kcal, 12g protein. Fast Nepali breakfast.',
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

