// ============================================
// CALENDAR - Monthly tracking view
// COLORBLIND-FRIENDLY: Uses icons and patterns, not just colors
// ============================================

import React, { useState } from 'react';
import { useStore } from '../../state/store';
import { Card } from './Card';

interface CalendarProps {
    onDayClick?: (dateISO: string) => void;
}

export function Calendar({ onDayClick }: CalendarProps) {
    const logs = useStore((state) => state.logs);

    const [currentMonth, setCurrentMonth] = useState(new Date());

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const formatDateISO = (year: number, month: number, day: number) => {
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };

    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);

    const goToPrevMonth = () => {
        setCurrentMonth(new Date(year, month - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentMonth(new Date(year, month + 1, 1));
    };

    const today = new Date();
    const todayISO = formatDateISO(today.getFullYear(), today.getMonth(), today.getDate());

    // Build calendar grid
    const calendarDays = [];

    // Empty cells
    for (let i = 0; i < firstDay; i++) {
        calendarDays.push(null);
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push(day);
    }

    return (
        <Card>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={goToPrevMonth}
                    className="p-2 text-zinc-400 hover:text-white hover:bg-surface-600 rounded-lg text-xl"
                >
                    ←
                </button>
                <h3 className="text-lg font-semibold text-white">
                    {months[month]} {year}
                </h3>
                <button
                    onClick={goToNextMonth}
                    className="p-2 text-zinc-400 hover:text-white hover:bg-surface-600 rounded-lg text-xl"
                >
                    →
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 gap-1">
                {days.map((d, i) => (
                    <div key={i} className="text-center text-xs text-zinc-500 py-2 font-medium">
                        {d}
                    </div>
                ))}

                {calendarDays.map((day, i) => {
                    if (day === null) {
                        return <div key={i} className="aspect-square" />;
                    }

                    const dateISO = formatDateISO(year, month, day);
                    const log = logs[dateISO];
                    const isToday = dateISO === todayISO;

                    const gymDone = log?.gym?.completed;
                    const hasEaten = log?.eaten && log.eaten.length > 0;

                    // Colorblind-friendly: Use icons and distinct patterns
                    // Blue outline for today, filled for completed activities
                    let bgClass = "bg-surface-700/30";
                    let textClass = "text-zinc-400";
                    let borderClass = "border-transparent";

                    if (gymDone && hasEaten) {
                        // Perfect day - filled with pattern
                        bgClass = "bg-white/20";
                        textClass = "text-white font-bold";
                        borderClass = "border-white/50";
                    } else if (gymDone) {
                        // Gym only - diagonal lines pattern (simulated with emoji)
                        bgClass = "bg-white/10";
                        textClass = "text-white font-bold";
                        borderClass = "border-white/30 border-dashed";
                    } else if (hasEaten) {
                        // Diet only
                        bgClass = "bg-white/5";
                        textClass = "text-zinc-300";
                    }

                    if (isToday) {
                        borderClass = "border-2 border-white";
                        textClass = "text-white font-bold";
                    }

                    return (
                        <button
                            key={i}
                            onClick={() => onDayClick?.(dateISO)}
                            className={`
                                aspect-square rounded-lg flex flex-col items-center justify-center text-sm
                                transition-all border ${borderClass} ${bgClass} ${textClass}
                                hover:brightness-125
                            `}
                        >
                            <span>{day}</span>

                            {/* Clear icons for accessibility */}
                            <div className="flex gap-0.5 mt-0.5 h-3 items-center justify-center">
                                {gymDone && <span className="text-[10px]">💪</span>}
                                {hasEaten && <span className="text-[10px]">🍽️</span>}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Legend - with clear icons */}
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/10">
                <div className="text-xs text-zinc-400 text-center mb-1">Legend (Colorblind Friendly)</div>
                <div className="flex justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-white/10 border border-dashed border-white/30 rounded flex items-center justify-center text-[10px]">💪</div>
                        <span className="text-zinc-300">Gym</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-white/5 rounded flex items-center justify-center text-[10px]">🍽️</div>
                        <span className="text-zinc-300">Diet</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-white/20 border border-white/50 rounded flex items-center justify-center text-[8px]">💪🍽️</div>
                        <span className="text-zinc-300">Both</span>
                    </div>
                </div>
            </div>
        </Card>
    );
}
