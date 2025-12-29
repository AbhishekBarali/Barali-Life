// ============================================
// TOAST - Notification toasts
// ============================================

import React, { createContext, useContext, useState, useCallback } from 'react';

interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info' | 'xp';
    icon?: string;
}

interface ToastContextType {
    toasts: Toast[];
    showToast: (message: string, type: Toast['type'], icon?: string) => void;
    hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: Toast['type'], icon?: string) => {
        const id = `toast_${Date.now()}`;
        setToasts((prev) => [...prev, { id, message, type, icon }]);

        // Auto-hide after 3 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    const hideToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, showToast, hideToast }}>
            {children}
            <ToastContainer toasts={toasts} onHide={hideToast} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

// Toast Container
function ToastContainer({ toasts, onHide }: { toasts: Toast[]; onHide: (id: string) => void }) {
    const typeStyles = {
        success: 'bg-green-500/90 border-green-400',
        error: 'bg-red-500/90 border-red-400',
        warning: 'bg-yellow-500/90 border-yellow-400 text-black',
        info: 'bg-blue-500/90 border-blue-400',
        xp: 'bg-gradient-to-r from-neon-teal to-purple-500 border-neon-teal',
    };

    const defaultIcons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ',
        xp: '🔥',
    };

    return (
        <div className="fixed top-4 left-4 right-4 z-50 flex flex-col items-center gap-2 pointer-events-none">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    onClick={() => onHide(toast.id)}
                    className={`
            ${typeStyles[toast.type]}
            px-6 py-3 rounded-xl backdrop-blur-lg border
            text-white font-medium shadow-lg
            flex items-center gap-3
            animate-in slide-in-from-top-2 duration-300
            pointer-events-auto cursor-pointer
          `}
                >
                    <span className="text-xl">{toast.icon || defaultIcons[toast.type]}</span>
                    <span>{toast.message}</span>
                </div>
            ))}
        </div>
    );
}
