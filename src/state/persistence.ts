// ============================================
// PERSISTENCE - LocalStorage management
// ============================================

import { AppState, Mode, FoodId, WorkoutType } from '../types';

export const STORAGE_KEY = 'baraliLife:v1';

// ============================================
// Get today's date in ISO format (Nepal timezone)
// ============================================
export function getTodayISO(): string {
    const now = new Date();
    // Nepal is UTC+5:45
    const nepalOffset = 5 * 60 + 45;
    const utcOffset = now.getTimezoneOffset();
    const nepalTime = new Date(now.getTime() + (nepalOffset + utcOffset) * 60000);
    return nepalTime.toISOString().split('T')[0];
}

// Get current day info
export function getDayInfo(): { dayName: string; date: string; isGymDay: boolean; workoutType: WorkoutType } {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = now.getDay();
    const dayName = days[dayOfWeek];

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const date = `${now.getDate()} ${months[now.getMonth()]}`;

    // 2-day cycle: Mon/Thu = Day A, Tue/Fri = Day B, Wed/Sat/Sun = Rest
    let workoutType: WorkoutType = 'REST';
    if (dayOfWeek === 1 || dayOfWeek === 4) {  // Mon, Thu
        workoutType = 'DAY_A_PUSH';
    } else if (dayOfWeek === 2 || dayOfWeek === 5) {  // Tue, Fri
        workoutType = 'DAY_B_PULL';
    }

    const isGymDay = workoutType !== 'REST';

    return { dayName, date, isGymDay, workoutType };
}

// ============================================
// Default state
// ============================================
export const DEFAULT_STATE: AppState = {
    mode: 'STANDARD_DAY' as Mode,
    profile: {
        heightCm: 175,
        weightKg: 74,
        goal: 'BODY_RECOMPOSITION',
    },
    targets: {
        proteinPerDay: 130,
        caloriesPerDay: 2200,
        waterLiters: 3,
    },
    inventory: {
        availableFoodIds: [
            'EGGS_BOILED',
            'EGGS_OMELETTE',
            'CHICKEN_CURRY',
            'CHICKEN_AIRFRIED',
            'SOYA_CHUNKS',
            'KALA_CHANA',
            'PANEER',
            'WHEY',
            'DAHI',
            'BANANA',
            'PEANUTS',
            'ALMONDS',
            'PEANUT_BUTTER',
            'BREAD_PEANUT_BUTTER',
        ] as FoodId[],
    },
    blacklist: ['MOMOS', 'CHOWMEIN', 'SAMOSA', 'SUGARY_TEA', 'COLD_DRINK', 'INSTANT_NOODLES'] as FoodId[],
    logs: {},
    streaks: {
        gym: 0,
        nutrition: 0,
    },
    totalXP: {
        gym: 0,
    },
};

// ============================================
// Load state from LocalStorage
// ============================================
export function loadState(): AppState {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            return { ...DEFAULT_STATE, ...parsed };
        }
    } catch (e) {
        console.error('Failed to load state:', e);
    }
    return DEFAULT_STATE;
}

// ============================================
// Save state to LocalStorage
// ============================================
export function saveState(state: AppState): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        console.error('Failed to save state:', e);
    }
}

// ============================================
// Export state as JSON string
// ============================================
export function exportState(state: AppState): string {
    return JSON.stringify(state, null, 2);
}

// ============================================
// Import state from JSON object
// ============================================
export function importState(data: unknown): AppState | null {
    try {
        if (typeof data === 'object' && data !== null) {
            return { ...DEFAULT_STATE, ...(data as AppState) };
        }
    } catch (e) {
        console.error('Failed to import state:', e);
    }
    return null;
}

// ============================================
// Clear all stored data
// ============================================
export function clearState(): void {
    localStorage.removeItem(STORAGE_KEY);
}
