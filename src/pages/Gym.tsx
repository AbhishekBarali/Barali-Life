// ============================================
// GYM PAGE - Your workout routine
// FIXED: 30+ tips, no counter (feels infinite)
// ============================================

import React, { useState, useEffect } from 'react';
import { useStore } from '../state/store';
import { getDayInfo } from '../state/persistence';
import { Card } from '../ui/components/Card';
import { BigButton } from '../ui/components/BigButton';
import { Calendar } from '../ui/components/Calendar';
import { useToast } from '../ui/components/Toast';

// YOUR ACTUAL GYM ROUTINE (supports both schedules)
const WORKOUTS: Record<string, { name: string; description: string; exercises: { name: string; sets: string; emoji: string; muscle: string }[] }> = {
    'DAY_A_PULL': {
        name: 'Day A: Pull + Deadlift',
        description: 'Back, Biceps, Deadlift',
        exercises: [
            { name: 'Lat Pulldown', sets: '4x10-12', emoji: '💪', muscle: 'Lats' },
            { name: 'Cable Rows', sets: '4x10-12', emoji: '🚣', muscle: 'Back' },
            { name: 'Bicep Curls', sets: '3x12-15', emoji: '💪', muscle: 'Biceps' },
            { name: 'Deadlift', sets: '4x5-6', emoji: '🏋️', muscle: 'Full Body' },
        ],
    },
    'DAY_B_PUSH': {
        name: 'Day B: Push + Squats',
        description: 'Chest, Shoulders, Legs',
        exercises: [
            { name: 'Bench Press', sets: '4x8-10', emoji: '🏋️', muscle: 'Chest' },
            { name: 'Incline Bench Press', sets: '3x10-12', emoji: '🏋️', muscle: 'Upper Chest' },
            { name: 'Shoulder Press', sets: '4x8-10', emoji: '💪', muscle: 'Shoulders' },
            { name: 'Squats', sets: '4x8-10', emoji: '🦵', muscle: 'Legs' },
        ],
    },
    'FULL_BODY_A': {
        name: 'Full Body A',
        description: 'Squat, Bench, Row',
        exercises: [
            { name: 'Squat', sets: '3x8-10', emoji: '🦵', muscle: 'Legs' },
            { name: 'Bench Press', sets: '3x8-10', emoji: '🏋️', muscle: 'Chest' },
            { name: 'Barbell Row', sets: '3x8-10', emoji: '🚣', muscle: 'Back' },
            { name: 'Shoulder Press', sets: '3x10-12', emoji: '💪', muscle: 'Shoulders' },
        ],
    },
    'FULL_BODY_B': {
        name: 'Full Body B',
        description: 'Deadlift, Press, Pulldown',
        exercises: [
            { name: 'Deadlift', sets: '3x5-6', emoji: '🏋️', muscle: 'Full Body' },
            { name: 'Incline Press', sets: '3x8-10', emoji: '🏋️', muscle: 'Chest' },
            { name: 'Lat Pulldown', sets: '3x10-12', emoji: '💪', muscle: 'Lats' },
            { name: 'Bicep Curls', sets: '3x12-15', emoji: '💪', muscle: 'Biceps' },
        ],
    },
    'REST': {
        name: 'Rest Day',
        description: 'Recovery & Light Activity',
        exercises: [
            { name: 'Light Walking', sets: '20-30 min', emoji: '🚶', muscle: 'Active Recovery' },
            { name: 'Stretching', sets: '10 min', emoji: '🧘', muscle: 'Flexibility' },
        ],
    },
};

// 30+ TIPS PER WORKOUT TYPE - Feels infinite!
const PUSH_TIPS = [
    "Push day! Focus on chest-to-bar on bench. Squeeze at the top.",
    "Keep your elbows at 45° angle on bench press to protect shoulders.",
    "For incline press, aim for the upper chest squeeze at the top.",
    "On shoulder press, don't lock out fully - keep tension in delts.",
    "Squeeze your glutes during bench press for a stable base.",
    "Control the negative (lowering) for 2-3 seconds on each rep.",
    "Pre-exhaust with flies before bench for better chest activation.",
    "Breathe out during the push, breathe in on the way down.",
    "For squats: push through your heels, not your toes.",
    "Keep your core braced throughout every press movement.",
    "Retract your shoulder blades before benching for stability.",
    "Touch the bar to your lower chest, not your neck.",
    "On shoulder press, stop just before lockout to keep tension.",
    "Pause at the bottom of each rep to eliminate momentum.",
    "Warm up with rotator cuff exercises before pressing.",
    "Keep your wrists straight, not bent, during bench press.",
    "Progressive overload: add 2.5kg when you hit all target reps.",
    "Focus on the mind-muscle connection with your pecs.",
    "Don't flare your elbows out - keep them at 45 degrees.",
    "Squat deep! Aim for parallel or below for full quad activation.",
    "Keep your chest up and back straight during squats.",
    "Brace your core like you're about to get punched.",
    "Use leg drive on bench press for extra power.",
    "On incline, lower the bar to upper chest/collarbone area.",
    "Grip the bar hard - it activates more muscle fibers.",
    "Squeeze your pecs together at the top of every press.",
    "Front squats target quads more than back squats.",
    "Keep your feet flat and drive through the floor.",
    "Don't rush between reps - control is key.",
    "Visualize the muscle working before each set.",
];

const PULL_TIPS = [
    "Pull day! Keep your back straight on deadlifts. Feel the squeeze on rows.",
    "Retract your shoulder blades before starting any pull movement.",
    "On lat pulldowns, pull to your upper chest, not behind neck.",
    "Squeeze at the bottom of each row for 1 second.",
    "Don't use momentum on bicep curls - slow and controlled wins.",
    "For deadlifts: the bar should stay close to your body throughout.",
    "Think 'elbows back' on rows to really engage your back.",
    "Superset biceps with back exercises for better pump.",
    "Focus on mind-muscle connection - imagine your lats doing the work.",
    "Warm up with light rows before heavy deadlifts.",
    "On pulldowns, lean back slightly and drive elbows down.",
    "Use straps for heavy deadlifts if grip is limiting you.",
    "Pause at the top of deadlifts - squeeze your glutes.",
    "Keep your core tight throughout deadlifts to protect your back.",
    "Don't jerk the weight on curls - control the entire movement.",
    "Try different row variations: barbell, dumbbell, cable, machine.",
    "Pull with your elbows, not your hands, to activate back more.",
    "Hammer curls hit brachialis for thicker arms.",
    "Keep your head neutral during deadlifts - don't look up.",
    "Use a double overhand grip until you need mixed grip.",
    "Feel the stretch at the top of lat pulldowns.",
    "Don't round your lower back - maintain neutral spine.",
    "Squeeze your lats at the bottom of every pull.",
    "Slow negatives on bicep curls = more growth.",
    "Romanian deadlifts target hamstrings and glutes more.",
    "Keep your shoulders down and back during rowing.",
    "Use a full range of motion on every rep.",
    "Don't shrug your shoulders during lat pulldowns.",
    "Take 2-3 minute rest between heavy deadlift sets.",
    "Quality reps over ego lifting - leave your pride at the door.",
];

const REST_TIPS = [
    "Rest days are for recovery. Light walking and stretching help muscle growth.",
    "Sleep is when your muscles actually grow - aim for 8 hours.",
    "Foam rolling today can reduce soreness and improve mobility.",
    "Stay active with a 20-minute walk - it aids recovery.",
    "Hydrate extra on rest days - your muscles are rebuilding.",
    "Do some light yoga or mobility work for your hips and shoulders.",
    "Rest doesn't mean Netflix all day - light movement helps recovery.",
    "Eat your protein even on rest days - muscles rebuild 24/7.",
    "Take a contrast shower (hot/cold) to boost circulation.",
    "Plan your meals for the next gym day today.",
    "Light cardio like swimming or cycling promotes blood flow.",
    "Work on flexibility - tight muscles limit your gains.",
    "Massage or self-myofascial release helps recovery.",
    "Mental rest is important too - stress affects gains.",
    "Review your form by watching technique videos.",
    "Prepare your gym bag and clothes for tomorrow.",
    "Listen to your body - if you're very sore, rest more.",
    "Meditation can help with recovery and focus.",
    "Sunlight exposure helps vitamin D and sleep quality.",
    "Track your progress - review your workout logs.",
    "Stretching the muscles you trained yesterday helps recovery.",
    "Cold showers reduce inflammation and muscle soreness.",
    "A light 15-minute walk after meals aids digestion.",
    "Read about nutrition or training to keep motivated.",
    "Active recovery > complete inactivity.",
    "Epsom salt baths can help with muscle soreness.",
    "Visualize your next workout - mental rehearsal works.",
    "Stay accountable - tell someone about your fitness goals.",
    "Progress photos motivate more than the scale.",
    "Gratitude for your body keeps you consistent.",
];

export function Gym() {
    const todayLog = useStore((state) => state.getTodayLog());
    const streaks = useStore((state) => state.streaks);
    const completeGym = useStore((state) => state.completeGym);
    const skipGym = useStore((state) => state.skipGym);
    const { showToast } = useToast();

    const [showCalendar, setShowCalendar] = useState(false);
    const [tipIndex, setTipIndex] = useState(0);

    const dayInfo = getDayInfo();
    const workoutType = todayLog.gym.workoutType;
    const workout = WORKOUTS[workoutType] || WORKOUTS['REST'];

    // Get tips based on workout type (PUSH or FULL_BODY_A/B for push days, PULL for pull days)
    const tips = (workoutType === 'DAY_B_PUSH' || workoutType === 'FULL_BODY_A' || workoutType === 'FULL_BODY_B')
        ? PUSH_TIPS
        : (workoutType === 'DAY_A_PULL')
            ? PULL_TIPS
            : REST_TIPS;

    // Randomize on mount
    useEffect(() => {
        setTipIndex(Math.floor(Math.random() * tips.length));
    }, [workoutType]);

    const cycleTip = () => {
        setTipIndex((prev) => (prev + 1) % tips.length);
    };

    const handleComplete = () => {
        completeGym();
        showToast('💪 Workout complete!', 'success');
    };

    const handleSkip = () => {
        skipGym();
        showToast('Streak reset. Get it tomorrow! 💪', 'warning');
    };

    return (
        <div className="space-y-6 pb-24">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-2xl font-bold text-white">Gym</h1>
                <p className="text-zinc-400">{dayInfo.dayName}, {dayInfo.date}</p>
            </div>

            {/* Streak - Big and prominent */}
            <Card className="text-center border-orange-500/30">
                <div className="text-4xl font-bold text-orange-400">🔥 {streaks.gym}</div>
                <div className="text-zinc-400 mt-1">Day Streak</div>
            </Card>

            {/* Calendar Toggle */}
            <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="w-full py-3 bg-surface-700 hover:bg-surface-600 rounded-xl text-white font-medium transition-colors flex items-center justify-center gap-2"
            >
                📅 {showCalendar ? 'Hide Calendar' : 'View Calendar'}
            </button>

            {showCalendar && <Calendar />}

            {/* Today's Workout */}
            <Card
                className={`
                    ${todayLog.gym.completed ? 'border-green-500/30 bg-green-500/5' : ''}
                    ${workoutType === 'REST' ? 'opacity-70' : ''}
                `}
            >
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="text-xl font-bold text-white">{workout.name}</div>
                        <div className="text-sm text-zinc-400">{workout.description}</div>
                    </div>
                    {todayLog.gym.completed && (
                        <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-xl text-lg">
                            ✓ Done
                        </span>
                    )}
                </div>

                {/* Exercises */}
                <div className="space-y-2 mb-4">
                    {workout.exercises.map((ex, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between p-3 bg-surface-700/50 rounded-xl"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xl">{ex.emoji}</span>
                                <div>
                                    <span className="text-white font-medium">{ex.name}</span>
                                    <div className="text-xs text-zinc-500">{ex.muscle}</div>
                                </div>
                            </div>
                            <span className="text-neon-teal font-mono">{ex.sets}</span>
                        </div>
                    ))}
                </div>

                {/* Action Buttons */}
                {workoutType !== 'REST' && !todayLog.gym.completed && (
                    <div className="flex gap-3">
                        <BigButton
                            variant="primary"
                            onClick={handleComplete}
                            className="flex-1"
                        >
                            ✓ Complete Workout
                        </BigButton>
                        <BigButton
                            variant="ghost"
                            onClick={handleSkip}
                            className="px-4"
                        >
                            Skip
                        </BigButton>
                    </div>
                )}
            </Card>

            {/* Weekly Schedule */}
            <Card>
                <div className="text-lg font-semibold text-white mb-3">Weekly Schedule</div>
                <div className="space-y-2">
                    {[
                        { day: 'Mon', label: 'Day A: Push + Legs', isGym: true },
                        { day: 'Tue', label: 'Day B: Pull + Arms', isGym: true },
                        { day: 'Wed', label: 'Rest Day', isGym: false },
                        { day: 'Thu', label: 'Day A: Push + Legs', isGym: true },
                        { day: 'Fri', label: 'Day B: Pull + Arms', isGym: true },
                        { day: 'Sat', label: 'Rest Day', isGym: false },
                        { day: 'Sun', label: 'Rest Day', isGym: false },
                    ].map((item) => {
                        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                        const todayName = days[new Date().getDay()];
                        const isToday = item.day === todayName;

                        return (
                            <div
                                key={item.day}
                                className={`
                                    flex items-center justify-between p-3 rounded-xl
                                    ${isToday ? 'bg-neon-teal/10 border border-neon-teal/30' : 'bg-surface-700/30'}
                                `}
                            >
                                <span className={isToday ? 'text-neon-teal font-medium' : 'text-zinc-400'}>
                                    {item.day}
                                </span>
                                <span className={item.isGym ? 'text-white' : 'text-zinc-500'}>
                                    {item.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </Card>

            {/* Cycling Tip - No counter, feels infinite */}
            <Card className="border-purple-500/20">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <span>💡</span>
                        <span className="font-medium text-white">Pro Tip</span>
                    </div>
                    <button
                        onClick={cycleTip}
                        className="px-4 py-1.5 text-sm bg-purple-500/20 text-purple-400 rounded-full hover:bg-purple-500/30 transition-colors flex items-center gap-1"
                    >
                        <span>Next</span>
                        <span>→</span>
                    </button>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">
                    {tips[tipIndex]}
                </p>
            </Card>
        </div>
    );
}
