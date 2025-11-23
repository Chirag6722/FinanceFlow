import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Play, Pause, Repeat } from 'lucide-react';
import { useRecurring } from '../context/RecurringContext';
import { RecurringModal } from '../components/Recurring/RecurringModal';

const RecurringTransactions = () => {
    const { recurringTransactions, deleteRecurring, toggleRecurring, getNextOccurrence } = useRecurring();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRecurring, setSelectedRecurring] = useState(null);

    const handleEdit = (recurring) => {
        setSelectedRecurring(recurring);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setSelectedRecurring(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRecurring(null);
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this recurring transaction?')) {
            await deleteRecurring(id);
        }
    };

    const handleToggle = async (id, currentStatus) => {
        await toggleRecurring(id, !currentStatus);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary mb-2">Recurring Transactions</h1>
                    <p className="text-text-secondary">Automate your regular income and expenses.</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 font-medium"
                >
                    <Plus size={20} />
                    <span>Add Recurring</span>
                </button>
            </div>

            {/* Recurring List */}
            <div className="space-y-4">
                {recurringTransactions.length === 0 ? (
                    <div className="glass rounded-2xl p-12 text-center border border-black/5 dark:border-white/5">
                        <Repeat size={64} className="mx-auto mb-4 opacity-20 text-text-secondary" />
                        <h3 className="text-xl font-semibold mb-2 text-text-primary">No recurring transactions yet</h3>
                        <p className="text-text-secondary mb-4">Set up recurring transactions for salary, rent, subscriptions, etc.</p>
                        <button
                            onClick={handleAddNew}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
                        >
                            <Plus size={20} />
                            <span>Add Your First Recurring Transaction</span>
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {recurringTransactions.map((recurring) => {
                            const nextDate = getNextOccurrence(recurring);
                            const isIncome = recurring.type === 'income';

                            return (
                                <div
                                    key={recurring.id}
                                    className={`glass p-6 rounded-2xl border border-black/5 dark:border-white/5 hover:shadow-lg transition-shadow ${!recurring.isActive ? 'opacity-60' : ''
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isIncome ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
                                                }`}>
                                                <Repeat className={`w-5 h-5 ${isIncome ? 'text-green-600' : 'text-red-600'}`} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-text-primary">{recurring.description}</h3>
                                                <p className="text-sm text-text-secondary">{recurring.category}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleToggle(recurring.id, recurring.isActive)}
                                                className={`p-2 rounded-lg transition-colors ${recurring.isActive
                                                        ? 'hover:bg-yellow-50 dark:hover:bg-yellow-900/20 text-yellow-600'
                                                        : 'hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600'
                                                    }`}
                                                title={recurring.isActive ? 'Pause' : 'Resume'}
                                            >
                                                {recurring.isActive ? <Pause size={16} /> : <Play size={16} />}
                                            </button>
                                            <button
                                                onClick={() => handleEdit(recurring)}
                                                className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(recurring.id)}
                                                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <p className="text-xs text-text-secondary">Amount</p>
                                            <p className={`text-xl font-bold ${isIncome ? 'text-green-600' : 'text-text-primary'}`}>
                                                {isIncome ? '+' : '-'}₹{recurring.amount.toFixed(2)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-text-secondary">Frequency</p>
                                            <p className="font-semibold text-text-primary">{recurring.frequency}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-text-secondary">Next Occurrence</p>
                                            <p className="font-semibold text-text-primary">{nextDate}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-text-secondary">Status</p>
                                            <p className={`font-semibold ${recurring.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                                                {recurring.isActive ? 'Active' : 'Paused'}
                                            </p>
                                        </div>
                                    </div>

                                    {recurring.endDate && (
                                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                                📅 Ends on: {recurring.endDate}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <RecurringModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                recurring={selectedRecurring}
            />
        </div>
    );
};

export default RecurringTransactions;
