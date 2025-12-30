// ============================================
// PERSISTENCE - Day info and calculations
// ============================================

import { useStore } from './store';
import { WorkoutType, DayType } from '../types';

// ============================================
// Get comprehensive day info
// ============================================
export interface DayInfo {
    dayName: string;
    date: string;
    isGymDay: boolean;
    dayType: DayType;
    workoutType: WorkoutType;
    isCollegeDay: boolean;
    isSunday: boolean;
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function getDayInfo(): DayInfo {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const state = useStore.getState();
    const schedule = state.workoutSchedule;

    // Determine workout type based on schedule
    let workoutType: WorkoutType;
    let isGymDay: boolean;

    if (schedule === 'FOUR_DAY_PUSH_PULL') {
        // Mon/Thu = Pull, Tue/Fri = Push, Wed/Sat/Sun = Rest
        if (dayOfWeek === 1 || dayOfWeek === 4) {
            workoutType = 'DAY_A_PULL';
            isGymDay = true;
        } else if (dayOfWeek === 2 || dayOfWeek === 5) {
            workoutType = 'DAY_B_PUSH';
            isGymDay = true;
        } else {
            workoutType = 'REST';
            isGymDay = false;
        }
    } else {
        // THREE_DAY_LESS_TIME: Mon/Wed/Fri
        const weekNumber = Math.floor(now.getTime() / (7 * 24 * 60 * 60 * 1000));
        const isEvenWeek = weekNumber % 2 === 0;

        if (dayOfWeek === 1) {
            workoutType = isEvenWeek ? 'FULL_BODY_A' : 'FULL_BODY_B';
            isGymDay = true;
        } else if (dayOfWeek === 3) {
            workoutType = isEvenWeek ? 'FULL_BODY_B' : 'FULL_BODY_A';
            isGymDay = true;
        } else if (dayOfWeek === 5) {
            workoutType = isEvenWeek ? 'FULL_BODY_A' : 'FULL_BODY_B';
            isGymDay = true;
        } else {
            workoutType = 'REST';
            isGymDay = false;
        }
    }

    // Check for manual override in logs
    const todayKey = now.toISOString().split('T')[0];
    const todayLog = state.logs[todayKey];
    if (todayLog && todayLog.isGymDayOverride !== undefined) {
        isGymDay = todayLog.isGymDayOverride;
    }

    // College days: Mon-Fri (except holidays)
    const isCollegeDay = dayOfWeek >= 1 && dayOfWeek <= 5;
    const isSunday = dayOfWeek === 0;

    // Day type for calorie adjustments
    const dayType: DayType = isGymDay ? 'training' : 'rest';

    return {
        dayName: DAY_NAMES[dayOfWeek],
        date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        isGymDay,
        dayType,
        workoutType,
        isCollegeDay,
        isSunday,
    };
}

// ============================================
// Calculate dynamic calorie targets
// ============================================
export function calculateDynamicTargets(
    isTrainingDay: boolean,
    weightMode: 'CUT' | 'MAINTAIN' | 'LEAN_BULK',
    bodyweight: number
): { protein: number; carbs: number; fat: number; calories: number } {
    // Protein: 1.8g per kg, rounded to nearest 5, minimum 120g
    const proteinTarget = Math.max(120, Math.round((1.8 * bodyweight) / 5) * 5);

    // Base targets
    let calories = isTrainingDay ? 2725 : 2400;
    let carbs = isTrainingDay ? 355 : 300;
    let fat = isTrainingDay ? 70 : 70;

    // Mode adjustments
    if (weightMode === 'CUT') {
        calories -= isTrainingDay ? 300 : 375;
        carbs -= isTrainingDay ? 50 : 75;
    } else if (weightMode === 'LEAN_BULK') {
        calories += isTrainingDay ? 250 : 150;
        carbs += isTrainingDay ? 60 : 40;
    }

    return {
        protein: proteinTarget,
        carbs: Math.round(carbs),
        fat: Math.round(fat),
        calories: Math.round(calories),
    };
}

// ============================================
// Calculate rice portion based on mode
// ============================================
export function getRicePortion(
    isTrainingDay: boolean,
    weightMode: 'CUT' | 'MAINTAIN' | 'LEAN_BULK'
): number {
    // Base: 200g training, 150g rest
    let portion = isTrainingDay ? 200 : 150;

    // Mode adjustments
    if (weightMode === 'CUT') {
        portion -= 50;
    } else if (weightMode === 'LEAN_BULK') {
        portion += 50;
    }

    return portion;
}

// ============================================
// Check if post-workout slot should be shown
// ============================================
export function shouldShowPostWorkout(): boolean {
    const { isGymDay } = getDayInfo();
    return isGymDay;
}
