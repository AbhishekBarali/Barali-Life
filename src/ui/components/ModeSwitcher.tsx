// ============================================
// MODE SWITCHER - Dropdown for mode selection
// FIXED: Proper click handling for dropdown items
// ============================================

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useStore } from '../../state/store';
import { Mode, MODE_LABELS, MODE_DESCRIPTIONS } from '../../types';

const MODE_ICONS: Record<Mode, string> = {
    STANDARD_DAY: '🏠',
    COLLEGE_RUSH: '🏃',
    BURNT_OUT: '😴',
    BURNT_OUT_COLLEGE: '🎓',
    SUNDAY_SPECIAL: '🚌',
};

export function ModeSwitcher() {
    const mode = useStore((state) => state.mode);
    const setMode = useStore((state) => state.setMode);
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

    // Calculate position when opening
    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + 8,
                left: rect.left,
                width: rect.width,
            });
        }
    }, [isOpen]);

    // Close on click outside
    useEffect(() => {
        if (!isOpen) return;

        const handleClick = (e: MouseEvent) => {
            const target = e.target as Node;
            if (
                buttonRef.current?.contains(target) ||
                dropdownRef.current?.contains(target)
            ) {
                return; // Click inside, ignore
            }
            setIsOpen(false);
        };

        // Use setTimeout to avoid immediate close on same click
        const timer = setTimeout(() => {
            document.addEventListener('click', handleClick);
        }, 10);

        return () => {
            clearTimeout(timer);
            document.removeEventListener('click', handleClick);
        };
    }, [isOpen]);

    const handleSelect = (newMode: Mode) => {
        setMode(newMode);
        setIsOpen(false);
    };

    const modes: Mode[] = ['STANDARD_DAY', 'COLLEGE_RUSH', 'BURNT_OUT', 'BURNT_OUT_COLLEGE', 'SUNDAY_SPECIAL'];

    return (
        <>
            {/* Selected Mode Button */}
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-surface-700 hover:bg-surface-600 rounded-xl transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{MODE_ICONS[mode]}</span>
                    <div className="text-left">
                        <div className="font-medium text-white">{MODE_LABELS[mode]}</div>
                        <div className="text-sm text-zinc-400">{MODE_DESCRIPTIONS[mode]}</div>
                    </div>
                </div>
                <span className={`text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    ▼
                </span>
            </button>

            {/* Dropdown Menu - Rendered via Portal */}
            {isOpen && createPortal(
                <div
                    ref={dropdownRef}
                    className="fixed z-[9999] bg-zinc-900 border border-white/20 rounded-xl shadow-2xl overflow-hidden"
                    style={{
                        top: dropdownPosition.top,
                        left: dropdownPosition.left,
                        width: dropdownPosition.width,
                    }}
                >
                    {modes.map((m) => (
                        <button
                            key={m}
                            onClick={() => handleSelect(m)}
                            className={`
                                w-full flex items-center gap-3 p-4 text-left transition-colors border-b border-white/5 last:border-0
                                ${m === mode
                                    ? 'bg-neon-teal/20 text-neon-teal'
                                    : 'hover:bg-surface-700 text-white'}
                            `}
                        >
                            <span className="text-xl">{MODE_ICONS[m]}</span>
                            <div>
                                <div className="font-medium">{MODE_LABELS[m]}</div>
                                <div className="text-xs text-zinc-400">{MODE_DESCRIPTIONS[m]}</div>
                            </div>
                            {m === mode && <span className="ml-auto text-neon-teal">✓</span>}
                        </button>
                    ))}
                </div>,
                document.body
            )}
        </>
    );
}
