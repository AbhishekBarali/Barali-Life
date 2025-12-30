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
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[60] pointer-events-none flex justify-center w-full max-w-sm px-4">
            {toasts.slice(-1).map((toast) => (
                <div
                    key={toast.id}
                    onClick={() => onHide(toast.id)}
                    className={`
                        px-5 py-2.5 rounded-full backdrop-blur-md shadow-2xl border
                        flex items-center gap-3 text-sm font-medium
                        animate-in slide-in-from-bottom-4 zoom-in-95 duration-200
                        pointer-events-auto cursor-pointer select-none
                        ${toast.type === 'error'
                            ? 'bg-red-500/90 border-red-400 text-white'
                            : toast.type === 'success'
                                ? 'bg-zinc-800/95 border-emerald-500/30 text-white'
                                : 'bg-zinc-800/95 border-white/10 text-zinc-100'
                        }
                    `}
                >
                    <span className="text-lg leading-none">
                        {toast.type === 'success' && '✅'}
                        {toast.type === 'error' && '❌'}
                        {toast.type === 'warning' && '⚠️'}
                        {toast.type === 'info' && 'ℹ️'}
                        {toast.type === 'xp' && '⚡'}
                        {/* {toast.icon} */} {/* Simpler icons for pill look */}
                    </span>
                    <span className="truncate max-w-[200px]">{toast.message}</span>
                </div>
            ))}
        </div>
    );
}
