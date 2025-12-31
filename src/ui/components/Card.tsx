// ============================================
// CARD COMPONENT - Premium, consistent styling
// ============================================

import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'elevated' | 'interactive';
    status?: 'current' | 'done' | 'default';
    onClick?: () => void;
}

export function Card({
    children,
    className = '',
    variant = 'default',
    status = 'default',
    onClick
}: CardProps) {
    // Consistent base styles for all cards
    const baseStyles = `
        rounded-2xl p-4 
        transition-all duration-200 ease-out
        border border-white/[0.06]
    `;

    // Variant styles
    const variantStyles = {
        default: 'bg-surface-800/90',
        elevated: 'bg-surface-700/90 shadow-soft',
        interactive: 'bg-surface-800/90 hover:bg-surface-700/90 cursor-pointer active:scale-[0.99]',
    };

    // Status styles - completely consistent, no visual differences between cards
    const statusStyles = {
        current: 'border-primary/30 bg-gradient-to-br from-surface-800 to-surface-800/80 shadow-lg shadow-primary/5 ring-1 ring-primary/20',
        done: 'opacity-70 grayscale-[0.3]',
        default: '',
    };

    return (
        <div
            onClick={onClick}
            className={`
                ${baseStyles}
                ${variantStyles[variant]}
                ${statusStyles[status]}
                ${onClick && variant !== 'interactive' ? 'cursor-pointer hover:bg-surface-700/90' : ''}
                ${className}
            `}
        >
            {children}
        </div>
    );
}

// Mini card for stats display
interface MiniCardProps {
    label: string;
    value: string | number;
    icon?: string;
    className?: string;
    highlight?: boolean;
}

export function MiniCard({ label, value, icon, className = '', highlight = false }: MiniCardProps) {
    return (
        <div className={`
            rounded-xl p-3 
            ${highlight
                ? 'bg-primary/10 border border-primary/20'
                : 'bg-surface-700/50 border border-white/[0.04]'}
            ${className}
        `}>
            <div className={`flex items-center gap-2 text-xs mb-1 ${highlight ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'}`}>
                {icon && <span>{icon}</span>}
                <span className="font-medium">{label}</span>
            </div>
            <div className={`font-semibold text-lg ${highlight ? 'text-[var(--primary)]' : 'text-[var(--text-primary)]'}`}>
                {value}
            </div>
        </div>
    );
}
