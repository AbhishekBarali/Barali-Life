// ============================================
// TYPES - Central type definitions for the app
// ============================================

// ============================================
// Food Types
// ============================================
export type FoodId = string;

export interface Macros {
    protein: number;
    carbs: number;
    fat: number;
    calories: number;
    fiber?: number; // Optional - fiber content in grams
}

export interface FoodItem {
    id: FoodId;
    emoji: string;
    label: string;
    qty: number;
    unit: string;
    tags: string[];
    macros: Macros;
    grams?: number; // Optional: actual weight in grams for portion tracking
    originalId?: FoodId; // If food was swapped, this is the original
    warning?: string; // Warning for unhealthy/junk foods
}

// ============================================
// Meal Types
// ============================================
export type MealSlot = 'BREAKFAST' | 'MORNING_SNACK' | 'LUNCH' | 'EVENING_SNACK' | 'DINNER';

export type MealIntention =
    | 'PROTEIN_FOCUS'
    | 'BALANCED'
    | 'LIGHT'
    | 'DAMAGE_CONTROL';

export interface MealPlan {
    slot: MealSlot;
    items: FoodItem[];
    intention: MealIntention;
    note?: string;
}

export interface MealItem extends FoodItem {
    isModule?: boolean; // Protein module that can be swapped
}

// ============================================
// Mode Types (Scenarios)
// ============================================
export type Mode =
    | 'STANDARD_DAY'      // Weekend/holiday, 7 AM wake
    | 'COLLEGE_RUSH'      // College day, 5:30 AM wake
    | 'BURNT_OUT'         // Low energy, 7 AM wake
    | 'BURNT_OUT_COLLEGE' // Low energy college day
    | 'SUNDAY_SPECIAL';   // College + commute, no gym

export const MODE_LABELS: Record<Mode, string> = {
    STANDARD_DAY: 'Standard Day',
    COLLEGE_RUSH: 'College Rush',
    BURNT_OUT: 'Burnt Out',
    BURNT_OUT_COLLEGE: 'Burnt Out (College)',
    SUNDAY_SPECIAL: 'Sunday Special',
};

export const MODE_DESCRIPTIONS: Record<Mode, string> = {
    STANDARD_DAY: 'Weekend/holiday, normal routine',
    COLLEGE_RUSH: 'Early college, tiffin packed',
    BURNT_OUT: 'Minimal cooking, easy foods',
    BURNT_OUT_COLLEGE: 'Low energy college day',
    SUNDAY_SPECIAL: 'College + commute day',
};

// ============================================
// Mode-specific Meal Labels
// ============================================
export const MODE_MEAL_LABELS: Record<Mode, Record<MealSlot, string>> = {
    STANDARD_DAY: {
        BREAKFAST: 'Breakfast',
        MORNING_SNACK: 'Pre-Workout',
        LUNCH: 'Lunch',
        EVENING_SNACK: 'Post-Workout',
        DINNER: 'Dinner',
    },
    COLLEGE_RUSH: {
        BREAKFAST: 'Quick Breakfast',
        MORNING_SNACK: '🍱 Tiffin',
        LUNCH: 'Lunch (Home)',
        EVENING_SNACK: 'Post-Workout',
        DINNER: 'Dinner',
    },
    BURNT_OUT: {
        BREAKFAST: 'Easy Breakfast',
        MORNING_SNACK: 'Light Snack',
        LUNCH: 'Simple Lunch',
        EVENING_SNACK: 'Protein Snack',
        DINNER: 'Easy Dinner',
    },
    BURNT_OUT_COLLEGE: {
        BREAKFAST: 'Zero Effort Breakfast',
        MORNING_SNACK: '🍱 Easy Tiffin',
        LUNCH: 'Simple Lunch',
        EVENING_SNACK: 'Quick Protein',
        DINNER: 'Easy Dinner',
    },
    SUNDAY_SPECIAL: {
        BREAKFAST: 'Quick Breakfast',
        MORNING_SNACK: '🍱 Tiffin',
        LUNCH: 'Late Lunch (2 PM)',
        EVENING_SNACK: 'Light Snack',
        DINNER: 'Dinner',
    },
};

// ============================================
// Mode-specific Meal Times
// ============================================
export const MODE_MEAL_TIMES: Record<Mode, Record<MealSlot, string>> = {
    STANDARD_DAY: {
        BREAKFAST: '7:00 - 8:00 AM',
        MORNING_SNACK: '1:00 - 1:30 PM',
        LUNCH: '11:00 - 12:00 PM',
        EVENING_SNACK: '4:00 - 5:00 PM',
        DINNER: '8:00 - 9:00 PM',
    },
    COLLEGE_RUSH: {
        BREAKFAST: '5:30 - 6:00 AM',
        MORNING_SNACK: '9:05 - 9:30 AM',
        LUNCH: '12:00 - 12:30 PM',
        EVENING_SNACK: '4:00 - 5:00 PM',
        DINNER: '7:30 - 8:30 PM',
    },
    BURNT_OUT: {
        BREAKFAST: '7:00 - 8:00 AM',
        MORNING_SNACK: '11:00 - 11:30 AM',
        LUNCH: '12:00 - 1:00 PM',
        EVENING_SNACK: '4:00 - 5:00 PM',
        DINNER: '8:00 - 9:00 PM',
    },
    BURNT_OUT_COLLEGE: {
        BREAKFAST: '5:30 - 6:00 AM',
        MORNING_SNACK: '9:05 - 9:30 AM',
        LUNCH: '12:00 - 12:30 PM',
        EVENING_SNACK: '4:00 - 5:00 PM',
        DINNER: '7:30 - 8:30 PM',
    },
    SUNDAY_SPECIAL: {
        BREAKFAST: '5:45 - 6:00 AM',
        MORNING_SNACK: '9:15 - 9:30 AM',
        LUNCH: '2:00 - 2:30 PM',
        EVENING_SNACK: '4:30 - 5:00 PM',
        DINNER: '7:30 - 8:30 PM',
    },
};

// ============================================
// Mode-specific Meal Order
// ============================================
export const MODE_MEAL_ORDER: Record<Mode, MealSlot[]> = {
    STANDARD_DAY: ['BREAKFAST', 'LUNCH', 'MORNING_SNACK', 'EVENING_SNACK', 'DINNER'],
    COLLEGE_RUSH: ['BREAKFAST', 'MORNING_SNACK', 'LUNCH', 'EVENING_SNACK', 'DINNER'],
    BURNT_OUT: ['BREAKFAST', 'MORNING_SNACK', 'LUNCH', 'EVENING_SNACK', 'DINNER'],
    BURNT_OUT_COLLEGE: ['BREAKFAST', 'MORNING_SNACK', 'LUNCH', 'EVENING_SNACK', 'DINNER'],
    SUNDAY_SPECIAL: ['BREAKFAST', 'MORNING_SNACK', 'LUNCH', 'EVENING_SNACK', 'DINNER'],
};

export const MEAL_SLOT_LABELS: Record<MealSlot, string> = {
    BREAKFAST: 'Breakfast',
    MORNING_SNACK: 'Morning Snack',
    LUNCH: 'Lunch',
    EVENING_SNACK: 'Evening Snack',
    DINNER: 'Dinner',
};

// ============================================
// Workout Types
// ============================================
export type WorkoutType = 'DAY_A_PULL' | 'DAY_B_PUSH' | 'REST' | 'FULL_BODY_A' | 'FULL_BODY_B';

export type WorkoutSchedule = 'FOUR_DAY_PUSH_PULL' | 'THREE_DAY_LESS_TIME';

export const WORKOUT_LABELS: Record<WorkoutType, string> = {
    DAY_A_PULL: 'Day A: Pull + Deadlift',
    DAY_B_PUSH: 'Day B: Push + Squats',
    REST: 'Rest Day',
    FULL_BODY_A: 'Full Body A',
    FULL_BODY_B: 'Full Body B',
};

// ============================================
// Day Types for Calorie Adjustments
// ============================================
export type DayType = 'training' | 'rest';

export type WeightMode = 'CUT' | 'MAINTAIN' | 'LEAN_BULK';

// ============================================
// Protein Module Types
// ============================================
export interface ProteinModule {
    id: string;
    name: string;
    emoji: string;
    grams: number;
    protein: number;
    tags: string[];
    costEstimate?: string;
}

// ============================================
// State Types
// ============================================
export interface MacroTargets {
    proteinPerDay: number;
    carbsPerDay: number;
    fatPerDay: number;
    caloriesPerDay: number;
    waterLiters: number;
}

export interface GymLog {
    completed: boolean;
    skipped: boolean;
    workoutType: WorkoutType;
}

export interface EatenEntry {
    slot: MealSlot;
    foodId: FoodId;
    qty?: number;
    customFood?: {
        name: string;
        protein: number;
        carbs: number;
        fat: number;
        calories: number;
    };
}

export interface DayLog {
    date: string; // YYYY-MM-DD
    meals: Partial<Record<MealSlot, MealPlan>>;
    eaten: EatenEntry[];
    gym: GymLog;
    notes?: string;
    isGymDayOverride?: boolean;
}

export interface Inventory {
    availableFoodIds: FoodId[];
}

export interface Streaks {
    gym: number;
    protein: number;
}

export interface CalorieCycling {
    enabled: boolean;
    gymAdjustment: number;
    restAdjustment: number;
}

export type ThemeType = 'default' | 'apple' | 'sunset' | 'neon';

export interface AppState {
    // Current state
    mode: Mode;
    theme: ThemeType; // Added theme
    targets: MacroTargets;
    weightMode: WeightMode;
    workoutSchedule: WorkoutSchedule;

    // Profile
    profile: {
        weightKg: number;
        heightCm: number;
        age: number;
        gender: 'male' | 'female';
        goal: string;
    };

    // Food management
    inventory: Inventory;
    blacklist: FoodId[];

    // Logs
    logs: Record<string, DayLog>; // keyed by date YYYY-MM-DD

    // Streaks
    streaks: Streaks;

    // Calorie Cycling
    calorieCycling: CalorieCycling;
    setCalorieCycling: (config: CalorieCycling) => void;
    getDailyTargets: () => MacroTargets;

    // Smart Shuffle
    smartShuffle: boolean;
    setSmartShuffle: (enabled: boolean) => void;

    // Actions
    getTodayLog: () => DayLog;
    setMode: (mode: Mode) => void;
    setTheme: (theme: ThemeType) => void; // Added setTheme
    logFood: (slot: MealSlot, foodId: FoodId, qty?: number) => void;
    unlogFood: (slot: MealSlot, foodId: FoodId) => void;
    logCustomFood: (slot: MealSlot, food: EatenEntry['customFood']) => void;
    completeGym: () => void;
    skipGym: () => void;
    toggleGymDay: () => void; // Manual override for training day
    setTargets: (targets: Partial<MacroTargets>) => void;
    updateTargets: (targets: Partial<MacroTargets>) => void; // Alias for setTargets
    setProfile: (profile: Partial<AppState['profile']>) => void;
    updateProfile: (profile: Partial<AppState['profile']>) => void; // Alias for setProfile
    setInventory: (inventory: Inventory) => void;
    updateInventory: (foodIds: FoodId[]) => void; // Settings.tsx passes array directly
    setBlacklist: (blacklist: FoodId[]) => void;
    updateBlacklist: (blacklist: FoodId[]) => void;
    setWeightMode: (mode: WeightMode) => void;
    setWorkoutSchedule: (schedule: WorkoutSchedule) => void;
    swapFood: (slot: MealSlot, from: FoodId, to: FoodId) => void;
    dispatch: (action: { type: string; payload?: any }) => void;
    resetDay: () => void;
    exportData: () => string;
    exportState: () => string; // Alias for exportData
    importData: (data: string) => void;
    importState: (data: string) => void; // Alias for importData
    clearAllData: () => void;
}
