import React, { useState, useEffect } from 'react';
import { X, TrendingUp, Calendar, Hash, DollarSign, FileText } from 'lucide-react';
import { useInvestments } from '../../context/InvestmentContext';

const INVESTMENT_TYPES = [
    'Stocks',
    'Mutual Funds',
    'Cryptocurrency',
    'Gold',
    'Fixed Deposit',
    'Bonds',
    'Real Estate',
    'Other'
];

export function InvestmentModal({ isOpen, onClose, investment = null }) {
    const { addInvestment, updateInvestment } = useInvestments();
    const [formData, setFormData] = useState({
        name: '',
        type: 'Stocks',
        symbol: '',
        quantity: 0,
        buyPrice: 0,
        currentPrice: 0,
        buyDate: new Date().toISOString().split('T')[0],
        notes: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (investment) {
            setFormData({
                name: investment.name || '',
                type: investment.type || 'Stocks',
                symbol: investment.symbol || '',
                quantity: investment.quantity || 0,
                buyPrice: investment.buyPrice || 0,
                currentPrice: investment.currentPrice || 0,
                buyDate: investment.buyDate || new Date().toISOString().split('T')[0],
                notes: investment.notes || ''
            });
        } else {
            setFormData({
                name: '',
                type: 'Stocks',
                symbol: '',
                quantity: 0,
                buyPrice: 0,
                currentPrice: 0,
                buyDate: new Date().toISOString().split('T')[0],
                notes: ''
            });
        }
    }, [investment, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (investment) {
                await updateInvestment(investment.id, formData);
            } else {
                await addInvestment(formData);
            }
            onClose();
        } catch (error) {
            console.error('Error saving investment:', error);
            alert('Failed to save investment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const totalInvested = formData.quantity * formData.buyPrice;
    const currentValue = formData.quantity * (formData.currentPrice || formData.buyPrice);
    const profitLoss = currentValue - totalInvested;
    const profitLossPercent = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {investment ? 'Edit Investment' : 'Add New Investment'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
                    {/* Investment Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Investment Name
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g., Reliance Industries, Bitcoin"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Type
                            </label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                {INVESTMENT_TYPES.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        {/* Symbol/Code */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Symbol/Code
                                <span className="text-xs text-gray-500 ml-1">
                                    {formData.type === 'Stocks' && '(e.g., RELIANCE.BSE)'}
                                    {formData.type === 'Cryptocurrency' && '(e.g., bitcoin)'}
                                    {formData.type === 'Mutual Funds' && '(e.g., 120503)'}
                                </span>
                            </label>
                            <input
                                type="text"
                                value={formData.symbol}
                                onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                                placeholder="For API price fetch"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Quantity */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Quantity
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>

                        {/* Buy Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Buy Price (₹)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={formData.buyPrice}
                                onChange={(e) => setFormData({ ...formData, buyPrice: parseFloat(e.target.value) || 0 })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Current Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Current Price (₹)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.currentPrice}
                                onChange={(e) => setFormData({ ...formData, currentPrice: parseFloat(e.target.value) || 0 })}
                                placeholder="Auto-fetched or manual"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>

                        {/* Buy Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Buy Date
                            </label>
                            <input
                                type="date"
                                required
                                value={formData.buyDate}
                                onChange={(e) => setFormData({ ...formData, buyDate: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Preview */}
                    {formData.quantity > 0 && formData.buyPrice > 0 && (
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-600 dark:text-gray-400">Total Invested</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">₹{totalInvested.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600 dark:text-gray-400">Current Value</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">₹{currentValue.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600 dark:text-gray-400">Profit/Loss</p>
                                    <p className={`text-lg font-bold ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {profitLoss >= 0 ? '+' : ''}₹{profitLoss.toFixed(2)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600 dark:text-gray-400">Returns</p>
                                    <p className={`text-lg font-bold ${profitLossPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {profitLossPercent >= 0 ? '+' : ''}{profitLossPercent.toFixed(2)}%
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Notes (Optional)
                        </label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows="3"
                            placeholder="Add any notes about this investment..."
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
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
                            {loading ? 'Saving...' : investment ? 'Update Investment' : 'Add Investment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
