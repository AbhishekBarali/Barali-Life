// ============================================
// TYPE DEFINITIONS - Barali Life
// ============================================

// ============================================
// Mode types (4 modes total)
// ============================================
export type Mode =
    | 'STANDARD_DAY'
    | 'COLLEGE_RUSH'
    | 'BURNT_OUT'
    | 'BURNT_OUT_COLLEGE';

export const MODE_LABELS: Record<Mode, string> = {
    STANDARD_DAY: 'Standard Day',
    COLLEGE_RUSH: 'College Rush',
    BURNT_OUT: 'Burnt Out',
    BURNT_OUT_COLLEGE: 'Burnt Out (College)',
};

export const MODE_DESCRIPTIONS: Record<Mode, string> = {
    STANDARD_DAY: 'Normal day (7 AM), gym at 2 PM',
    COLLEGE_RUSH: 'Early wake (5:30 AM), college schedule',
    BURNT_OUT: 'Low energy day, minimal cooking',
    BURNT_OUT_COLLEGE: 'Low energy college day (5:30 AM)',
};

// ============================================
// Meal types - Realistic timings for Nepal college student
// ============================================
export type MealSlot = 'BREAKFAST' | 'MORNING_SNACK' | 'LUNCH' | 'EVENING_SNACK' | 'DINNER';

export const MEAL_SLOT_LABELS: Record<MealSlot, string> = {
    BREAKFAST: 'Breakfast',
    MORNING_SNACK: 'Pre-Workout',
    LUNCH: 'Lunch',
    EVENING_SNACK: 'Post-Workout',
    DINNER: 'Dinner',
};

// Default times for Standard modes (7 AM wake, gym at 2 PM)
export const MEAL_SLOT_TIMES: Record<MealSlot, string> = {
    BREAKFAST: '7:00 - 8:00 AM',
    LUNCH: '11:00 - 12:00 PM',
    MORNING_SNACK: '1:00 - 1:30 PM',      // Pre-workout
    EVENING_SNACK: '4:00 - 5:00 PM',      // Post-gym
    DINNER: '8:00 - 9:00 PM',
};

// Mode-specific meal LABELS (Tiffin for college, Pre-Workout for standard)
export const MODE_MEAL_LABELS: Record<Mode, Record<MealSlot, string>> = {
    STANDARD_DAY: {
        BREAKFAST: 'Breakfast',
        LUNCH: 'Lunch',
        MORNING_SNACK: 'Pre-Workout',
        EVENING_SNACK: 'Post-Workout',
        DINNER: 'Dinner',
    },
    COLLEGE_RUSH: {
        BREAKFAST: 'Quick Breakfast',
        MORNING_SNACK: 'Tiffin',           // Packed lunch at college
        LUNCH: 'Lunch (Home)',             // Returned home at 12
        EVENING_SNACK: 'Post-Workout',
        DINNER: 'Dinner',
    },
    BURNT_OUT: {
        BREAKFAST: 'Breakfast',
        LUNCH: 'Lunch',
        MORNING_SNACK: 'Snack',
        EVENING_SNACK: 'Snack',
        DINNER: 'Dinner',
    },
    BURNT_OUT_COLLEGE: {
        BREAKFAST: 'Quick Breakfast',
        MORNING_SNACK: 'Tiffin',
        LUNCH: 'Lunch (Home)',
        EVENING_SNACK: 'Snack',
        DINNER: 'Dinner',
    },
};

// Mode-specific meal SLOT ORDER (Chronological)
export const MODE_MEAL_ORDER: Record<Mode, MealSlot[]> = {
    STANDARD_DAY: ['BREAKFAST', 'LUNCH', 'MORNING_SNACK', 'EVENING_SNACK', 'DINNER'],
    COLLEGE_RUSH: ['BREAKFAST', 'MORNING_SNACK', 'LUNCH', 'EVENING_SNACK', 'DINNER'],
    BURNT_OUT: ['BREAKFAST', 'LUNCH', 'MORNING_SNACK', 'EVENING_SNACK', 'DINNER'],
    BURNT_OUT_COLLEGE: ['BREAKFAST', 'MORNING_SNACK', 'LUNCH', 'EVENING_SNACK', 'DINNER'],
};

// Mode-specific meal times
export const MODE_MEAL_TIMES: Record<Mode, Record<MealSlot, string>> = {
    // Standard Day - 7 AM wake, gym at 2 PM
    STANDARD_DAY: {
        BREAKFAST: '7:00 - 8:00 AM',
        LUNCH: '11:00 - 12:00 PM',
        MORNING_SNACK: '1:00 - 1:30 PM',      // Pre-workout
        EVENING_SNACK: '4:00 - 5:00 PM',      // Post-gym
        DINNER: '8:00 - 9:00 PM',
    },
    // College Rush - 5:30 AM wake, tiffin at 9:05, return home 12:00
    COLLEGE_RUSH: {
        BREAKFAST: '5:30 - 6:00 AM',          // Quick at home
        MORNING_SNACK: '9:05 - 9:30 AM',      // Tiffin at college
        LUNCH: '12:00 - 12:30 PM',            // Return home, eat
        EVENING_SNACK: '4:00 - 5:00 PM',      // Post-gym
        DINNER: '7:30 - 8:30 PM',
    },
    // Burnt Out - 7 AM wake, minimal effort
    BURNT_OUT: {
        BREAKFAST: '7:00 - 8:00 AM',
        LUNCH: '11:00 - 12:00 PM',
        MORNING_SNACK: '1:00 - 1:30 PM',
        EVENING_SNACK: '4:00 - 5:00 PM',
        DINNER: '8:00 - 9:00 PM',
    },
    // Burnt Out College - 5:30 AM wake, minimal effort
    BURNT_OUT_COLLEGE: {
        BREAKFAST: '5:30 - 6:00 AM',
        MORNING_SNACK: '9:05 - 9:30 AM',
        LUNCH: '12:00 - 12:30 PM',
        EVENING_SNACK: '4:00 - 5:00 PM',
        DINNER: '7:30 - 8:30 PM',
    },
};

// ============================================
// Food types - Comprehensive list
// ============================================
export type FoodId =
    // Breakfast options
    | 'EGGS_BOILED' | 'EGGS_OMELETTE' | 'EGGS_FRIED' | 'EGGS_BHURJI'
    | 'CHIURA' | 'CHIURA_DAHI' | 'CHIURA_TARKARI'
    | 'PARATHA' | 'PARATHA_ALOO' | 'POORI_TARKARI'
    | 'BREAD_BUTTER' | 'BREAD_JAM' | 'BREAD_PEANUT_BUTTER' | 'BREAD_HONEY'
    | 'TOAST_EGG'
    | 'MILK' | 'TEA_PLAIN' | 'COFFEE_BLACK' | 'COFFEE_MILK'
    | 'OATS' | 'OATS_BANANA' | 'OATS_HONEY'
    | 'CORNFLAKES' | 'MUESLI' | 'MUESLI_MILK'

    // Dal Bhat variants (the staple!)
    | 'DAL_BHAT_TARKARI'           // Basic dal bhat with vegetables
    | 'DAL_BHAT_CHICKEN'           // With chicken curry
    | 'DAL_BHAT_MUTTON'            // With mutton
    | 'DAL_BHAT_FISH'              // With fish
    | 'DAL_BHAT_EGG'               // With egg curry
    | 'DAL_BHAT_PANEER'            // With paneer (veg protein)
    | 'DAL_BHAT_SOYA'              // With soya curry
    | 'BHAT_MASU'                  // Rice with meat curry
    | 'BHAT_TARKARI'               // Rice with vegetables only

    // Individual components
    | 'DAL' | 'RICE' | 'TARKARI' | 'ACHAR'
    | 'ROTI' | 'ROTI_DAL' | 'ROTI_SABJI'

    // Proteins - Chicken
    | 'CHICKEN_CURRY' | 'CHICKEN_FRY' | 'CHICKEN_GRILLED' | 'CHICKEN_AIRFRIED'
    | 'CHICKEN_CHILLI' | 'CHICKEN_SEKUWA'

    // Proteins - Other meats
    | 'MUTTON_CURRY' | 'BUFF_CURRY' | 'BUFF_SUKUTI'
    | 'FISH_CURRY' | 'FISH_FRY'

    // Proteins - Eggs
    | 'EGG_CURRY' | 'EGG_BHURJI'

    // Proteins - Vegetarian
    | 'PANEER' | 'PANEER_CURRY' | 'PANEER_BHURJI'
    | 'SOYA_CHUNKS' | 'SOYA_CURRY'
    | 'KALA_CHANA' | 'CHANA_BOILED' | 'CHANA_MASALA'
    | 'RAJMA'
    | 'DAHI' | 'LASSI'
    | 'TOFU'

    // Protein supplements
    | 'WHEY' | 'CREATINE'

    // Vegetables
    | 'VEG_TARKARI' | 'ALOO_TARKARI' | 'SAAG' | 'SALAD' | 'CUCUMBER'
    | 'CAULIFLOWER' | 'CABBAGE' | 'BEANS'

    // Fruits
    | 'BANANA' | 'APPLE' | 'ORANGE' | 'MANGO' | 'PAPAYA' | 'POMEGRANATE'

    // Nuts & Seeds (protein-rich snacks)
    | 'PEANUTS' | 'ALMONDS' | 'CASHEWS' | 'WALNUTS' | 'MIXED_NUTS'
    | 'PEANUT_BUTTER'

    // Healthy snacks
    | 'ROASTED_CHANA' | 'MAKHANA' | 'BISCUITS' | 'DIGESTIVE_BISCUITS'
    | 'PROTEIN_BAR'
    | 'HONEY'

    // Junk foods
    | 'MOMOS' | 'BUFF_MOMO' | 'VEG_MOMO'
    | 'CHOWMEIN'
    | 'SAMOSA' | 'PAKODA'
    | 'SUGARY_TEA'
    | 'PIZZA' | 'BURGER' | 'FRIES'
    | 'COLD_DRINK' | 'INSTANT_NOODLES'

    // Drinks
    | 'WATER' | 'BUTTERMILK' | 'LEMON_WATER' | 'COCONUT_WATER';

export interface FoodItem {
    id: FoodId;
    emoji: string;
    label: string;
    qty: number;
    unit: string;
    tags: string[];
    macros: {
        protein: number;
        carbs: number;
        fat: number;
        calories: number;
    };
}

// ============================================
// Meal intention types
// ============================================
export type MealIntention =
    | 'PROTEIN_FOCUS'
    | 'BALANCED'
    | 'CARB_LOAD'
    | 'LIGHT'
    | 'DAMAGE_CONTROL'
    | 'RECOVERY';

// ============================================
// Meal item (food with original tracking for swaps)
// ============================================
export interface MealItem extends FoodItem {
    originalId?: FoodId; // Original food before any swaps (for reset)
}

// ============================================
// Meal plan structure
// ============================================
export interface MealPlan {
    slot: MealSlot;
    items: MealItem[];
    intention: MealIntention;
    note?: string;
}

// ============================================
// Eaten entry (what user actually ate)
// ============================================
export interface EatenEntry {
    slot: MealSlot;
    foodId: FoodId | 'CUSTOM';
    timestamp: number;
    qty?: number;
    customFood?: {
        name: string;
        protein: number;
        carbs: number;
        fat: number;
        calories: number;
    };
}

// ============================================
// Gym types - Your actual routine
// ============================================
export type WorkoutType = 'DAY_A_PUSH' | 'DAY_B_PULL' | 'REST';

export const WORKOUT_LABELS: Record<WorkoutType, string> = {
    DAY_A_PUSH: 'Day A: Push + Legs',
    DAY_B_PULL: 'Day B: Pull + Arms',
    REST: 'Rest Day',
};

export interface GymLog {
    planned: boolean;
    completed: boolean;
    workoutType: WorkoutType;
    xpEarned: number;
}

// ============================================
// Warning type
// ============================================
export interface Warning {
    timestamp: number;
    type: 'JUNK_LOGGED' | 'PROTEIN_LOW' | 'STREAK_BROKEN';
    message: string;
}

// ============================================
// Day log
// ============================================
export interface DayLog {
    dateISO: string;
    mode: Mode;
    meals: Record<MealSlot, MealPlan>;
    eaten: EatenEntry[];
    gym: GymLog;
    warnings: Warning[];
}

// ============================================
// User profile
// ============================================
export interface Profile {
    heightCm: number;
    weightKg: number;
    goal: 'BODY_RECOMPOSITION' | 'BULK' | 'CUT' | 'MAINTAIN';
}

// ============================================
// Daily targets
// ============================================
export interface Targets {
    proteinPerDay: number;
    caloriesPerDay: number;
    waterLiters: number;
}

// ============================================
// Inventory (foods available at home)
// ============================================
export interface Inventory {
    availableFoodIds: FoodId[];
}

// ============================================
// Streaks
// ============================================
export interface Streaks {
    gym: number;
    nutrition: number;
}

// ============================================
// XP totals
// ============================================
export interface TotalXP {
    gym: number;
}

// ============================================
// Complete app state
// ============================================
export interface AppState {
    mode: Mode;
    profile: Profile;
    targets: Targets;
    inventory: Inventory;
    blacklist: FoodId[];
    logs: Record<string, DayLog>;
    streaks: Streaks;
    totalXP: TotalXP;
}

// ============================================
// Diet event types
// ============================================
export type DietEvent =
    | { type: 'SET_MODE'; mode: Mode }
    | { type: 'LOG_FOOD'; slot: MealSlot; foodId: FoodId; qty?: number }
    | { type: 'LOG_CUSTOM_FOOD'; slot: MealSlot; customFood: { name: string; protein: number; carbs: number; fat: number; calories: number } }
    | { type: 'UNLOG_FOOD'; slot: MealSlot; foodId: FoodId }
    | { type: 'SWAP_FOOD'; slot: MealSlot; from: FoodId; to: FoodId }
    | { type: 'REGENERATE_MEAL'; slot: MealSlot }
    | { type: 'SHUFFLE_DAY' }
    | { type: 'RESET_DAY' }
    | { type: 'COMPLETE_GYM' }
    | { type: 'MISS_GYM' }
    | { type: 'UPDATE_PROFILE'; profile: Partial<Profile> }
    | { type: 'UPDATE_TARGETS'; targets: Partial<Targets> }
    | { type: 'UPDATE_INVENTORY'; foodIds: FoodId[] }
    | { type: 'UPDATE_BLACKLIST'; foodIds: FoodId[] }
    | { type: 'IMPORT_STATE'; state: AppState };
