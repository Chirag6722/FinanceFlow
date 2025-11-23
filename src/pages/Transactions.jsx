import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, ArrowUpRight, ArrowDownRight, MoreHorizontal } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import TransactionModal from '../components/Transactions/TransactionModal';
import { cn } from '../lib/utils';
import { useTransactions } from '../context/TransactionContext';

const Transactions = () => {
    const { transactions, addTransaction, deleteTransaction } = useTransactions();
    const [searchParams] = useSearchParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    useEffect(() => {
        const searchQuery = searchParams.get('search');
        if (searchQuery) {
            setSearchTerm(searchQuery);
        }
    }, [searchParams]);

    const handleSaveTransaction = async (newTransaction) => {
        try {
            await addTransaction(newTransaction);
            setIsModalOpen(false);
        } catch (error) {
            alert(error.message || 'Failed to add transaction');
        }
    };

    const filteredTransactions = transactions.filter(t => {
        const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || t.type === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary mb-2">Transactions</h1>
                    <p className="text-text-secondary">Manage and track all your financial activities.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 font-medium"
                >
                    <Plus size={20} />
                    <span>Add Transaction</span>
                </button>
            </div>

            {/* Filters & Search */}
            <div className="glass p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-background border border-black/5 dark:border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary/50 transition-colors"
                    />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <button
                        onClick={() => setFilterType('all')}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                            filterType === 'all' ? "bg-primary/10 text-primary" : "text-text-secondary hover:bg-black/5 dark:hover:bg-white/5"
                        )}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilterType('income')}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                            filterType === 'income' ? "bg-secondary/10 text-secondary" : "text-text-secondary hover:bg-black/5 dark:hover:bg-white/5"
                        )}
                    >
                        Income
                    </button>
                    <button
                        onClick={() => setFilterType('expense')}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                            filterType === 'expense' ? "bg-danger/10 text-danger" : "text-text-secondary hover:bg-black/5 dark:hover:bg-white/5"
                        )}
                    >
                        Expense
                    </button>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="glass rounded-2xl overflow-hidden border border-black/5 dark:border-white/5">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5">
                                <th className="text-left py-4 px-6 text-xs font-semibold text-text-secondary uppercase tracking-wider">Description</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-text-secondary uppercase tracking-wider">Category</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-text-secondary uppercase tracking-wider">Date</th>
                                <th className="text-right py-4 px-6 text-xs font-semibold text-text-secondary uppercase tracking-wider">Amount</th>
                                <th className="text-center py-4 px-6 text-xs font-semibold text-text-secondary uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5 dark:divide-white/5">
                            {filteredTransactions.map((t) => (
                                <tr key={t.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center",
                                                t.type === 'income' ? "bg-secondary/10 text-secondary" : "bg-danger/10 text-danger"
                                            )}>
                                                {t.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                                            </div>
                                            <span className="font-medium text-text-primary">{t.description}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="px-2.5 py-1 rounded-lg bg-black/5 dark:bg-white/5 text-xs font-medium text-text-secondary border border-black/5 dark:border-white/5">
                                            {t.category}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-text-secondary">
                                        {t.date}
                                    </td>
                                    <td className={cn(
                                        "py-4 px-6 text-right font-bold",
                                        t.type === 'income' ? "text-secondary" : "text-text-primary"
                                    )}>
                                        {t.type === 'income' ? '+' : '-'}${t.amount}
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <div className="relative group/menu">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const menu = e.currentTarget.nextElementSibling;
                                                    menu.classList.toggle('hidden');
                                                }}
                                                className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-text-secondary transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <MoreHorizontal size={18} />
                                            </button>
                                            <div className="hidden absolute right-0 mt-2 w-48 bg-surface border border-black/10 dark:border-white/10 rounded-xl shadow-lg z-10">
                                                <button
                                                    onClick={async (e) => {
                                                        e.stopPropagation();
                                                        const menu = e.currentTarget.parentElement;
                                                        menu.classList.add('hidden');

                                                        if (window.confirm('Are you sure you want to delete this transaction?')) {
                                                            try {
                                                                await deleteTransaction(t.id);
                                                            } catch (error) {
                                                                console.error('Delete error:', error);
                                                                alert(`Failed to delete transaction: ${error.message}`);
                                                            }
                                                        }
                                                    }}
                                                    className="w-full px-4 py-2 text-left text-sm text-danger hover:bg-danger/10 transition-colors rounded-xl"
                                                >
                                                    Delete Transaction
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredTransactions.length === 0 && (
                    <div className="p-12 text-center text-text-secondary">
                        <p>No transactions found matching your criteria.</p>
                    </div>
                )}
            </div>

            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveTransaction}
            />
        </div>
    );
};

export default Transactions;
