import React, { useState } from 'react';
import { Plus, UserCheck, Users } from 'lucide-react';
import { useSplits } from '../context/SplitContext';
import { SplitModal } from '../components/Splits/SplitModal';

const Settlements = () => {
    const { splits, markAsSettled, getSettlementSummary } = useSplits();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const summary = getSettlementSummary();

    const handleMarkSettled = async (splitId, personName) => {
        await markAsSettled(splitId, personName);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary mb-2">Settlements</h1>
                    <p className="text-text-secondary">Track split bills and settlements with friends.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 font-medium"
                >
                    <Plus size={20} />
                    <span>Add Split</span>
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass p-6 rounded-2xl border border-black/5 dark:border-white/5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                            <UserCheck className="w-5 h-5 text-green-600" />
                        </div>
                        <h2 className="text-lg font-bold text-text-primary">People Owe You</h2>
                    </div>
                    {summary.owesYou.length === 0 ? (
                        <p className="text-text-secondary text-sm">No pending settlements</p>
                    ) : (
                        <div className="space-y-2">
                            {summary.owesYou.map((person, index) => (
                                <div key={index} className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
                                    <span className="font-medium text-text-primary">{person.name}</span>
                                    <span className="font-bold text-green-600">₹{person.amount.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="glass p-6 rounded-2xl border border-black/5 dark:border-white/5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                            <Users className="w-5 h-5 text-red-600" />
                        </div>
                        <h2 className="text-lg font-bold text-text-primary">You Owe</h2>
                    </div>
                    {summary.youOwe.length === 0 ? (
                        <p className="text-text-secondary text-sm">No pending payments</p>
                    ) : (
                        <div className="space-y-2">
                            {summary.youOwe.map((person, index) => (
                                <div key={index} className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/10 rounded-lg">
                                    <span className="font-medium text-text-primary">{person.name}</span>
                                    <span className="font-bold text-red-600">₹{person.amount.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Split Transactions List */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-text-primary">Split Transactions</h2>
                {splits.length === 0 ? (
                    <div className="glass rounded-2xl p-12 text-center border border-black/5 dark:border-white/5">
                        <Users size={64} className="mx-auto mb-4 opacity-20 text-text-secondary" />
                        <h3 className="text-xl font-semibold mb-2 text-text-primary">No split transactions yet</h3>
                        <p className="text-text-secondary mb-4">Split bills with friends and track who owes what</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
                        >
                            <Plus size={20} />
                            <span>Add Your First Split</span>
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {splits.map((split) => (
                            <div key={split.id} className="glass p-6 rounded-2xl border border-black/5 dark:border-white/5">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-text-primary">{split.description}</h3>
                                        <p className="text-sm text-text-secondary">
                                            Paid by {split.paidBy} • ₹{split.totalAmount.toFixed(2)}
                                        </p>
                                    </div>
                                    <span className="text-xs text-text-secondary">{split.date}</span>
                                </div>
                                <div className="space-y-2">
                                    {split.people.map((person, index) => (
                                        <div key={index} className="flex justify-between items-center p-3 bg-black/5 dark:bg-white/5 rounded-lg">
                                            <div>
                                                <span className="font-medium text-text-primary">{person.name}</span>
                                                <span className="text-sm text-text-secondary ml-2">₹{person.amount.toFixed(2)}</span>
                                            </div>
                                            {person.isPaid ? (
                                                <span className="text-xs bg-green-100 dark:bg-green-900/20 text-green-600 px-3 py-1 rounded-full">
                                                    Settled
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => handleMarkSettled(split.id, person.name)}
                                                    className="text-xs bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 px-3 py-1 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-900/30"
                                                >
                                                    Mark Settled
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <SplitModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default Settlements;
