// ============================================
// XP BADGE - Gamification display
// ============================================

import React from 'react';

interface XPBadgeProps {
    xp: number;
    label?: string;
    size?: 'sm' | 'md' | 'lg';
    showIcon?: boolean;
}

export function XPBadge({ xp, label, size = 'md', showIcon = true }: XPBadgeProps) {
    const sizes = {
        sm: 'text-sm px-2 py-1',
        md: 'text-base px-3 py-1.5',
        lg: 'text-lg px-4 py-2',
    };

    return (
        <div
            className={`
        inline-flex items-center gap-2
        bg-gradient-to-r from-neon-teal/20 to-purple-500/20
        border border-neon-teal/40 rounded-full
        ${sizes[size]}
      `}
        >
            {showIcon && <span>⚡</span>}
            <span className="text-neon-teal font-bold">{xp.toLocaleString()}</span>
            {label && <span className="text-zinc-400">{label}</span>}
        </div>
    );
}

// Streak Badge
interface StreakBadgeProps {
    count: number;
    type: 'gym' | 'nutrition' | 'skill';
    size?: 'sm' | 'md';
}

export function StreakBadge({ count, type, size = 'md' }: StreakBadgeProps) {
    const icons = {
        gym: '💪',
        nutrition: '🥗',
        skill: '🧠',
    };

    const labels = {
        gym: 'Gym',
        nutrition: 'Nutrition',
        skill: 'Skill',
    };

    const sizes = {
        sm: 'text-sm px-2 py-1',
        md: 'text-base px-3 py-1.5',
    };

    return (
        <div
            className={`
        inline-flex items-center gap-2
        bg-surface-700/80 rounded-full
        border border-white/10
        ${sizes[size]}
      `}
        >
            <span>{icons[type]}</span>
            <span className="text-white font-medium">{count}</span>
            <span className="text-zinc-400">{labels[type]}</span>
            {count > 0 && <span className="text-orange-400">🔥</span>}
        </div>
    );
}

// Progress ring for targets
interface ProgressRingProps {
    progress: number; // 0-100
    size?: number;
    strokeWidth?: number;
    color?: string;
    children?: React.ReactNode;
}

export function ProgressRing({
    progress,
    size = 80,
    strokeWidth = 8,
    color = '#00ffc8',
    children,
}: ProgressRingProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width={size} height={size} className="-rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth={strokeWidth}
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="transition-all duration-500"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                {children}
            </div>
        </div>
    );
}
