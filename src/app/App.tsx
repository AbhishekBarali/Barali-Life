// ============================================
// APP - Main layout with navigation
// ============================================

import React from 'react';
import { useLocation } from 'react-router-dom';
import { BottomTabs, Sidebar } from '../ui/components/BottomTabs';
import { ToastProvider } from '../ui/components/Toast';
import { Dashboard } from '../pages/Dashboard';
import { Diet } from '../pages/Diet';
import { Gym } from '../pages/Gym';
import { Settings } from '../pages/Settings';

function PageRenderer() {
    const location = useLocation();

    switch (location.pathname) {
        case '/':
            return <Dashboard />;
        case '/diet':
            return <Diet />;
        case '/gym':
            return <Gym />;
        case '/settings':
            return <Settings />;
        default:
            return <Dashboard />;
    }
}

export function App() {
    return (
        <ToastProvider>
            <div className="min-h-screen bg-dark-900 text-white flex">
                {/* Desktop Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <main className="flex-1 lg:ml-0">
                    <div className="max-w-lg mx-auto px-4 py-6 lg:max-w-2xl">
                        <PageRenderer />
                    </div>
                </main>

                {/* Mobile Bottom Tabs */}
                <div className="lg:hidden">
                    <BottomTabs />
                </div>
            </div>
        </ToastProvider>
    );
}
