import React, { useState } from 'react';
import { Plus, Edit2, Trash2, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { useBudgets } from '../context/BudgetContext';
import { useTransactions } from '../context/TransactionContext';
import { BudgetModal } from '../components/Budgets/BudgetModal';

const Budgets = () => {
    const { budgets, deleteBudget, getAllBudgetsStatus } = useBudgets();
    const { transactions } = useTransactions();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBudget, setSelectedBudget] = useState(null);

    const budgetsWithStatus = getAllBudgetsStatus(transactions);

    const handleEdit = (budget) => {
        setSelectedBudget(budget);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setSelectedBudget(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedBudget(null);
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this budget?')) {
            await deleteBudget(id);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'good':
                return 'bg-green-500';
            case 'warning':
                return 'bg-yellow-500';
            case 'exceeded':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'good':
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'warning':
                return <AlertCircle className="w-5 h-5 text-yellow-600" />;
            case 'exceeded':
                return <AlertCircle className="w-5 h-5 text-red-600" />;
            default:
                return null;
        }
    };

    const totalBudget = budgetsWithStatus.reduce((sum, b) => sum + b.amount, 0);
    const totalSpending = budgetsWithStatus.reduce((sum, b) => sum + b.spending, 0);
    const overallPercentage = totalBudget > 0 ? (totalSpending / totalBudget) * 100 : 0;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary mb-2">Budgets</h1>
                    <p className="text-text-secondary">Manage your spending budgets by category.</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 font-medium"
                >
                    <Plus size={20} />
                    <span>Add Budget</span>
                </button>
            </div>

            {/* Overall Summary */}
            <div className="glass p-6 rounded-2xl border border-black/5 dark:border-white/5">
                <h2 className="text-lg font-bold text-text-primary mb-4">Overall Budget Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <p className="text-sm text-text-secondary mb-1">Total Budget</p>
                        <p className="text-2xl font-bold text-text-primary">₹{totalBudget.toFixed(2)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-text-secondary mb-1">Total Spending</p>
                        <p className="text-2xl font-bold text-text-primary">₹{totalSpending.toFixed(2)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-text-secondary mb-1">Overall Progress</p>
                        <div className="flex items-center gap-3">
                            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                <div
                                    className={`h-3 rounded-full transition-all ${overallPercentage >= 100 ? 'bg-red-500' :
                                        overallPercentage >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                                        }`}
                                    style={{ width: `${Math.min(overallPercentage, 100)}%` }}
                                />
                            </div>
                            <span className="text-sm font-semibold text-text-primary">{overallPercentage.toFixed(0)}%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Budget Cards */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-text-primary">Category Budgets</h2>

                {budgetsWithStatus.length === 0 ? (
                    <div className="glass rounded-2xl p-12 text-center border border-black/5 dark:border-white/5">
                        <TrendingUp size={64} className="mx-auto mb-4 opacity-20 text-text-secondary" />
                        <h3 className="text-xl font-semibold mb-2 text-text-primary">No budgets yet</h3>
                        <p className="text-text-secondary mb-4">Set budgets to track your spending by category</p>
                        <button
                            onClick={handleAddNew}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
                        >
                            <Plus size={20} />
                            <span>Add Your First Budget</span>
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {budgetsWithStatus.map((budget) => (
                            <div
                                key={budget.id}
                                className="glass p-6 rounded-2xl border border-black/5 dark:border-white/5 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        {getStatusIcon(budget.status)}
                                        <div>
                                            <h3 className="text-lg font-bold text-text-primary">{budget.category}</h3>
                                            <p className="text-sm text-text-secondary">{budget.period}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(budget)}
                                            className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(budget.id)}
                                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-text-secondary">Spent</span>
                                        <span className="font-semibold text-text-primary">
                                            ₹{budget.spending.toFixed(2)} / ₹{budget.amount.toFixed(2)}
                                        </span>
                                    </div>

                                    <div className="relative">
                                        <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                            <div
                                                className={`h-3 rounded-full transition-all ${getStatusColor(budget.status)}`}
                                                style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between mt-2 text-sm">
                                            <span className={`font-semibold ${budget.status === 'exceeded' ? 'text-red-600' :
                                                budget.status === 'warning' ? 'text-yellow-600' : 'text-green-600'
                                                }`}>
                                                {budget.percentage.toFixed(1)}%
                                            </span>
                                            <span className={`font-semibold ${budget.remaining < 0 ? 'text-red-600' : 'text-text-primary'
                                                }`}>
                                                {budget.remaining >= 0 ? 'Remaining: ' : 'Over by: '}
                                                ₹{Math.abs(budget.remaining).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    {budget.status === 'exceeded' && (
                                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                                            <p className="text-sm text-red-800 dark:text-red-200">
                                                ⚠️ Budget exceeded! Consider reducing spending in this category.
                                            </p>
                                        </div>
                                    )}

                                    {budget.status === 'warning' && (
                                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                                ⚡ Approaching budget limit. Watch your spending!
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <BudgetModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                budget={selectedBudget}
            />
        </div>
    );
};

export default Budgets;
