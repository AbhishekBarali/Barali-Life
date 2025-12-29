// ============================================
// BIG BUTTON - Gym-friendly large buttons
// ============================================

import React from 'react';

interface BigButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
    size?: 'md' | 'lg' | 'xl';
    disabled?: boolean;
    fullWidth?: boolean;
    icon?: string;
    className?: string;
}

export function BigButton({
    children,
    onClick,
    variant = 'primary',
    size = 'lg',
    disabled = false,
    fullWidth = false,
    icon,
    className = '',
}: BigButtonProps) {
    const variants = {
        primary: 'bg-gradient-to-r from-neon-teal to-emerald-500 text-dark-900 font-semibold hover:opacity-90',
        secondary: 'bg-surface-600 text-white hover:bg-surface-500 border border-white/10',
        danger: 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:opacity-90',
        success: 'bg-gradient-to-r from-green-600 to-green-500 text-white hover:opacity-90',
        ghost: 'bg-transparent text-zinc-400 hover:text-white hover:bg-surface-700',
    };

    const sizes = {
        md: 'py-3 px-6 text-base',
        lg: 'py-4 px-8 text-lg',
        xl: 'py-5 px-10 text-xl',
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        rounded-xl font-medium
        transition-all duration-200
        active:scale-[0.97]
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-3
        ${className}
      `}
        >
            {icon && <span className="text-2xl">{icon}</span>}
            {children}
        </button>
    );
}

// Icon only button
interface IconButtonProps {
    icon: string;
    onClick?: () => void;
    variant?: 'ghost' | 'filled';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function IconButton({
    icon,
    onClick,
    variant = 'ghost',
    size = 'md',
    className = '',
}: IconButtonProps) {
    const sizeClasses = {
        sm: 'w-8 h-8 text-lg',
        md: 'w-10 h-10 text-xl',
        lg: 'w-12 h-12 text-2xl',
    };

    const variantClasses = {
        ghost: 'bg-transparent hover:bg-surface-600',
        filled: 'bg-surface-600 hover:bg-surface-500',
    };

    return (
        <button
            onClick={onClick}
            className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded-xl flex items-center justify-center
        transition-all duration-200 active:scale-95
        ${className}
      `}
        >
            {icon}
        </button>
    );
}
