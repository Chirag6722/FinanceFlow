import React, { useState, useEffect } from 'react';
import { X, CreditCard } from 'lucide-react';
import { useCards } from '../../context/CardContext';

const CARD_TYPES = ['Cash', 'Debit Card', 'Credit Card'];
const CARD_COLORS = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Green', value: '#10b981' },
    { name: 'Orange', value: '#f59e0b' },
    { name: 'Red', value: '#ef4444' },
];

export function CardModal({ isOpen, onClose, card = null }) {
    const { addCard, updateCard } = useCards();
    const [formData, setFormData] = useState({
        name: '',
        type: 'Debit Card',
        lastFour: '',
        initialBalance: 0,
        color: '#3b82f6'
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (card) {
            setFormData({
                name: card.name || '',
                type: card.type || 'Debit Card',
                lastFour: card.lastFour || '',
                initialBalance: card.balance || 0,
                color: card.color || '#3b82f6'
            });
        } else {
            setFormData({
                name: '',
                type: 'Debit Card',
                lastFour: '',
                initialBalance: 0,
                color: '#3b82f6'
            });
        }
    }, [card, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (card) {
                // Update existing card
                await updateCard(card.id, {
                    name: formData.name,
                    type: formData.type,
                    lastFour: formData.lastFour,
                    color: formData.color
                });
            } else {
                // Add new card
                await addCard(formData);
            }
            onClose();
        } catch (error) {
            console.error('Error saving card:', error);
            alert('Failed to save card. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {card ? 'Edit Card' : 'Add New Card'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Card Preview */}
                        <div
                            className="p-6 rounded-xl text-white shadow-lg"
                            style={{ backgroundColor: formData.color }}
                        >
                            <div className="flex items-center justify-between mb-8">
                                <CreditCard className="w-8 h-8" />
                                <span className="text-sm opacity-80">{formData.type}</span>
                            </div>
                            <div className="space-y-2">
                                <p className="text-2xl font-bold">
                                    {formData.name || 'Card Name'}
                                </p>
                                {formData.lastFour && (
                                    <p className="text-sm opacity-80">•••• {formData.lastFour}</p>
                                )}
                            </div>
                        </div>

                        {/* Card Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Card Name
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., HDFC Debit Card"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>

                        {/* Card Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Card Type
                            </label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                {CARD_TYPES.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        {/* Last Four Digits */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Last 4 Digits (Optional)
                            </label>
                            <input
                                type="text"
                                maxLength="4"
                                value={formData.lastFour}
                                onChange={(e) => setFormData({ ...formData, lastFour: e.target.value.replace(/\D/g, '') })}
                                placeholder="1234"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>

                        {/* Initial Balance (only for new cards) */}
                        {!card && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Initial Balance
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.initialBalance}
                                    onChange={(e) => setFormData({ ...formData, initialBalance: parseFloat(e.target.value) || 0 })}
                                    placeholder="0.00"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                        )}

                        {/* Color Picker */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Card Color
                            </label>
                            <div className="grid grid-cols-6 gap-2">
                                {CARD_COLORS.map(color => (
                                    <button
                                        key={color.value}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, color: color.value })}
                                        className={`w-full aspect-square rounded-lg transition-all ${formData.color === color.value
                                            ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110'
                                            : 'hover:scale-105'
                                            }`}
                                        style={{ backgroundColor: color.value }}
                                        title={color.name}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Saving...' : card ? 'Update Card' : 'Add Card'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
