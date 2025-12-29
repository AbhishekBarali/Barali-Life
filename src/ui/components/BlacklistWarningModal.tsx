// ============================================
// BLACKLIST WARNING MODAL - Damage Control trigger
// Shows when user logs junk food
// ============================================

import React from 'react';
import { createPortal } from 'react-dom';
import { FoodItem } from '../../types';
import { getRandomConfirmation, getBlacklistWarning } from '../../diet/blacklist';

interface BlacklistWarningModalProps {
    isOpen: boolean;
    food: FoodItem | null;
    onConfirm: () => void;
    onCancel: () => void;
}

export function BlacklistWarningModal({ isOpen, food, onConfirm, onCancel }: BlacklistWarningModalProps) {
    if (!isOpen || !food) return null;

    const warning = getBlacklistWarning(food.id);
    const confirmation = getRandomConfirmation();

    const modalContent = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                onClick={onCancel}
            />

            {/* Modal */}
            <div className="relative bg-zinc-900 rounded-3xl w-full max-w-md p-6 border border-red-500/30 shadow-2xl shadow-red-500/20">
                {/* Warning Header */}
                <div className="text-center mb-6">
                    <div className="text-6xl mb-4 animate-bounce">{food.emoji}</div>
                    <h2 className="text-2xl font-bold text-red-400 mb-2">⚠️ Junk Alert!</h2>
                    <p className="text-zinc-400">{warning}</p>
                </div>

                {/* Damage Forecast */}
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6">
                    <div className="text-sm font-medium text-red-400 mb-2">💥 Damage Forecast:</div>
                    <ul className="text-sm text-zinc-300 space-y-1">
                        <li>• Next meal switches to <span className="text-orange-400 font-medium">Damage Control</span></li>
                        <li>• High protein foods will be suggested</li>
                        <li>• Your protein goal may be harder to reach</li>
                    </ul>
                </div>

                {/* Confirmation */}
                <div className="text-center text-sm text-zinc-500 mb-6 italic">
                    "{confirmation}"
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3 bg-surface-700 hover:bg-surface-600 text-white rounded-xl font-medium transition-colors"
                    >
                        Nevermind
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white rounded-xl font-bold transition-all"
                    >
                        Log It Anyway
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
