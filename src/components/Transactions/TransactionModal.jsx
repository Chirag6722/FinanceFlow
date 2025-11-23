import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, Tag, FileText, Wallet, CreditCard, Image } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useCards } from '../../context/CardContext';

const TransactionModal = ({ isOpen, onClose, onSave, transaction = null }) => {
    const { cards } = useCards();
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        type: 'expense',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        paymentMethod: 'Cash',
        cardId: '',
        receiptUrl: ''
    });


    useEffect(() => {
        if (transaction) {
            setFormData(transaction);
        } else {
            setFormData({
                type: 'expense',
                amount: '',
                category: '',
                date: new Date().toISOString().split('T')[0],
                description: '',
                paymentMethod: 'Cash',
                cardId: '',
                receiptUrl: ''
            });
        }
    }, [transaction, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-surface border border-white/10 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <h2 className="text-xl font-bold text-text-primary">
                        {transaction ? 'Edit Transaction' : 'Add Transaction'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/5 text-text-secondary hover:text-text-primary transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
                    {/* Type Selection */}
                    <div className="grid grid-cols-2 gap-4 p-1 bg-white/5 rounded-xl">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: 'income' })}
                            className={cn(
                                "py-2 rounded-lg text-sm font-medium transition-all",
                                formData.type === 'income'
                                    ? "bg-secondary text-white shadow-lg"
                                    : "text-text-secondary hover:text-text-primary"
                            )}
                        >
                            Income
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: 'expense' })}
                            className={cn(
                                "py-2 rounded-lg text-sm font-medium transition-all",
                                formData.type === 'expense'
                                    ? "bg-danger text-white shadow-lg"
                                    : "text-text-secondary hover:text-text-primary"
                            )}
                        >
                            Expense
                        </button>
                    </div>

                    {/* Amount */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-text-secondary uppercase">Amount</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                            <input
                                type="number"
                                required
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                className="w-full bg-background border border-white/10 rounded-xl pl-10 pr-4 py-3 text-text-primary focus:outline-none focus:border-primary/50 transition-colors"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-text-secondary uppercase">Category</label>
                        <div className="relative">
                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                            <select
                                required
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full bg-background border border-white/10 rounded-xl pl-10 pr-4 py-3 text-text-primary focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                            >
                                <option value="" disabled>Select Category</option>
                                <option value="Food">Food & Dining</option>
                                <option value="Shopping">Shopping</option>
                                <option value="Transport">Transport</option>
                                <option value="Bills">Bills & Utilities</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Salary">Salary</option>
                                <option value="Freelance">Freelance</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-text-secondary uppercase">Payment Method</label>
                        <div className="relative">
                            <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                            <select
                                required
                                value={formData.paymentMethod}
                                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value, cardId: e.target.value === 'Cash' ? '' : formData.cardId })}
                                className="w-full bg-background border border-white/10 rounded-xl pl-10 pr-4 py-3 text-text-primary focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                            >
                                <option value="Cash">Cash</option>
                                <option value="Debit Card">Debit Card</option>
                                <option value="Credit Card">Credit Card</option>
                            </select>
                        </div>
                    </div>

                    {/* Card Selection */}
                    {(formData.paymentMethod === 'Debit Card' || formData.paymentMethod === 'Credit Card') && (
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-text-secondary uppercase">Select Card</label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                                <select
                                    required
                                    value={formData.cardId}
                                    onChange={(e) => setFormData({ ...formData, cardId: e.target.value })}
                                    className="w-full bg-background border border-white/10 rounded-xl pl-10 pr-4 py-3 text-text-primary focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                                >
                                    <option value="" disabled>Select a card</option>
                                    {cards
                                        .filter(card => {
                                            if (formData.paymentMethod === 'Debit Card') {
                                                return card.type === 'Debit Card' || card.type === 'Bank Account';
                                            }
                                            return card.type === 'Credit Card';
                                        })
                                        .map(card => (
                                            <option key={card.id} value={card.id}>
                                                {card.name} {card.lastFour ? `(••${card.lastFour})` : ''}
                                            </option>
                                        ))}
                                </select>
                            </div>
                            {cards.filter(card =>
                                formData.paymentMethod === 'Debit Card'
                                    ? (card.type === 'Debit Card' || card.type === 'Bank Account')
                                    : card.type === 'Credit Card'
                            ).length === 0 && (
                                    <p className="text-xs text-yellow-500">No {formData.paymentMethod.toLowerCase()}s found. Add one in the Cards page.</p>
                                )}
                        </div>
                    )}

                    {/* Date */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-text-secondary uppercase">Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                            <input
                                type="date"
                                required
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full bg-background border border-white/10 rounded-xl pl-10 pr-4 py-3 text-text-primary focus:outline-none focus:border-primary/50 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-text-secondary uppercase">Description</label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                            <input
                                type="text"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-background border border-white/10 rounded-xl pl-10 pr-4 py-3 text-text-primary focus:outline-none focus:border-primary/50 transition-colors"
                                placeholder="Add a note..."
                            />
                        </div>
                    </div>

                    {/* Receipt URL */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-text-secondary uppercase">Receipt (Optional)</label>
                        <div className="relative">
                            <Image className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                            <input
                                type="url"
                                value={formData.receiptUrl}
                                onChange={(e) => setFormData({ ...formData, receiptUrl: e.target.value })}
                                className="w-full bg-background border border-white/10 rounded-xl pl-10 pr-4 py-3 text-text-primary focus:outline-none focus:border-primary/50 transition-colors"
                                placeholder="Paste receipt image URL"
                            />
                        </div>
                        <p className="text-xs text-text-secondary">💡 Upload to cloud storage and paste link here</p>
                    </div>

                    {/* Buttons */}
                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-text-primary hover:bg-white/5 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors font-medium shadow-lg shadow-primary/25"
                        >
                            Save Transaction
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionModal;
