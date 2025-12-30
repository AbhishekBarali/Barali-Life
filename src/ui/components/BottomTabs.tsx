// ============================================
// BOTTOM TABS - Premium navigation
// ============================================

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface TabItem {
    path: string;
    label: string;
    icon: string;
}

const TABS: TabItem[] = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/diet', label: 'Diet', icon: '🍽️' },
    { path: '/gym', label: 'Gym', icon: '💪' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
];

export function BottomTabs() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface-900 border-t border-white/10 safe-area-pb shadow-2xl">
            <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
                {TABS.map((tab) => {
                    const isActive = location.pathname === tab.path;
                    return (
                        <button
                            key={tab.path}
                            onClick={() => navigate(tab.path)}
                            className={`
                                relative flex flex-col items-center justify-center flex-1 h-full
                                transition-all duration-150
                                ${isActive
                                    ? 'text-primary'
                                    : 'text-zinc-500 hover:text-zinc-400 active:scale-95'}
                            `}
                        >
                            <span className={`text-xl mb-0.5 transition-transform ${isActive ? 'scale-110' : ''}`}>
                                {tab.icon}
                            </span>
                            <span className={`text-[11px] font-medium ${isActive ? 'text-primary' : ''}`}>
                                {tab.label}
                            </span>
                            {/* Active indicator dot */}
                            {isActive && (
                                <span className="absolute bottom-2 w-1 h-1 bg-primary rounded-full" />
                            )}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}

// Desktop Sidebar
export function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <aside className="hidden lg:flex flex-col w-64 bg-surface-900 border-r border-white/[0.04] h-screen sticky top-0">
            <div className="p-6">
                <h1 className="text-xl font-bold text-white">
                    <span className="text-gradient-primary">Barali</span> Life
                </h1>
                <p className="text-xs text-zinc-600 mt-1">Diet & Gym Tracker</p>
            </div>

            <nav className="flex-1 px-3">
                {TABS.map((tab) => {
                    const isActive = location.pathname === tab.path;
                    return (
                        <button
                            key={tab.path}
                            onClick={() => navigate(tab.path)}
                            className={`
                                w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1
                                transition-all duration-150
                                ${isActive
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-zinc-500 hover:bg-white/[0.03] hover:text-zinc-300'}
                            `}
                        >
                            <span className="text-lg">{tab.icon}</span>
                            <span className="font-medium text-sm">{tab.label}</span>
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
}
