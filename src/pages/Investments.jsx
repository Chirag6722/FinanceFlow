import React, { useState } from 'react';
import { Plus, TrendingUp, TrendingDown, RefreshCw, Edit2, Trash2, DollarSign } from 'lucide-react';
import { useInvestments } from '../context/InvestmentContext';
import { InvestmentModal } from '../components/Investments/InvestmentModal';

const Investments = () => {
    const { investments, deleteInvestment, refreshPrice, refreshAllPrices, getPortfolioStats } = useInvestments();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInvestment, setSelectedInvestment] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [refreshingId, setRefreshingId] = useState(null);

    const stats = getPortfolioStats();

    const handleEdit = (investment) => {
        setSelectedInvestment(investment);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setSelectedInvestment(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedInvestment(null);
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this investment?')) {
            await deleteInvestment(id);
        }
    };

    const handleRefreshPrice = async (id) => {
        setRefreshingId(id);
        await refreshPrice(id);
        setRefreshingId(null);
    };

    const handleRefreshAll = async () => {
        setRefreshing(true);
        await refreshAllPrices();
        setRefreshing(false);
    };

    const getInvestmentProfitLoss = (investment) => {
        const invested = investment.quantity * investment.buyPrice;
        const current = investment.quantity * (investment.currentPrice || investment.buyPrice);
        const profitLoss = current - invested;
        const percentage = invested > 0 ? (profitLoss / invested) * 100 : 0;
        return { profitLoss, percentage };
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary mb-2">Investments</h1>
                    <p className="text-text-secondary">Track your investment portfolio and returns.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleRefreshAll}
                        disabled={refreshing}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
                        <span>{refreshing ? 'Refreshing...' : 'Refresh All'}</span>
                    </button>
                    <button
                        onClick={handleAddNew}
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 font-medium"
                    >
                        <Plus size={20} />
                        <span>Add Investment</span>
                    </button>
                </div>
            </div>

            {/* Portfolio Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass p-6 rounded-2xl border border-black/5 dark:border-white/5">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-text-secondary">Total Invested</p>
                        <DollarSign className="w-5 h-5 text-indigo-600" />
                    </div>
                    <p className="text-2xl font-bold text-text-primary">₹{stats.totalInvested.toFixed(2)}</p>
                </div>

                <div className="glass p-6 rounded-2xl border border-black/5 dark:border-white/5">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-text-secondary">Current Value</p>
                        <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-text-primary">₹{stats.currentValue.toFixed(2)}</p>
                </div>

                <div className="glass p-6 rounded-2xl border border-black/5 dark:border-white/5">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-text-secondary">Total Returns</p>
                        {stats.totalReturns >= 0 ? (
                            <TrendingUp className="w-5 h-5 text-green-600" />
                        ) : (
                            <TrendingDown className="w-5 h-5 text-red-600" />
                        )}
                    </div>
                    <p className={`text-2xl font-bold ${stats.totalReturns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stats.totalReturns >= 0 ? '+' : ''}₹{stats.totalReturns.toFixed(2)}
                    </p>
                </div>

                <div className="glass p-6 rounded-2xl border border-black/5 dark:border-white/5">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-text-secondary">Returns %</p>
                        {stats.returnsPercentage >= 0 ? (
                            <TrendingUp className="w-5 h-5 text-green-600" />
                        ) : (
                            <TrendingDown className="w-5 h-5 text-red-600" />
                        )}
                    </div>
                    <p className={`text-2xl font-bold ${stats.returnsPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stats.returnsPercentage >= 0 ? '+' : ''}{stats.returnsPercentage.toFixed(2)}%
                    </p>
                </div>
            </div>

            {/* Investments List */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-text-primary">Your Investments</h2>

                {investments.length === 0 ? (
                    <div className="glass rounded-2xl p-12 text-center border border-black/5 dark:border-white/5">
                        <TrendingUp size={64} className="mx-auto mb-4 opacity-20 text-text-secondary" />
                        <h3 className="text-xl font-semibold mb-2 text-text-primary">No investments yet</h3>
                        <p className="text-text-secondary mb-4">Start tracking your investment portfolio</p>
                        <button
                            onClick={handleAddNew}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
                        >
                            <Plus size={20} />
                            <span>Add Your First Investment</span>
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {investments.map((investment) => {
                            const { profitLoss, percentage } = getInvestmentProfitLoss(investment);
                            const invested = investment.quantity * investment.buyPrice;
                            const currentValue = investment.quantity * (investment.currentPrice || investment.buyPrice);

                            return (
                                <div
                                    key={investment.id}
                                    className="glass p-6 rounded-2xl border border-black/5 dark:border-white/5 hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-text-primary">{investment.name}</h3>
                                            <p className="text-sm text-text-secondary">{investment.type}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleRefreshPrice(investment.id)}
                                                disabled={refreshingId === investment.id || !investment.symbol}
                                                className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50"
                                                title="Refresh price"
                                            >
                                                <RefreshCw size={16} className={refreshingId === investment.id ? 'animate-spin' : ''} />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(investment)}
                                                className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(investment.id)}
                                                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <p className="text-xs text-text-secondary">Quantity</p>
                                            <p className="font-semibold text-text-primary">{investment.quantity}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-text-secondary">Buy Price</p>
                                            <p className="font-semibold text-text-primary">₹{investment.buyPrice.toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-text-secondary">Current Price</p>
                                            <p className="font-semibold text-text-primary">
                                                ₹{(investment.currentPrice || investment.buyPrice).toFixed(2)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-text-secondary">Buy Date</p>
                                            <p className="font-semibold text-text-primary">{investment.buyDate}</p>
                                        </div>
                                    </div>

                                    <div className="border-t border-black/5 dark:border-white/5 pt-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs text-text-secondary">Invested</p>
                                                <p className="font-bold text-text-primary">₹{invested.toFixed(2)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-text-secondary">Current Value</p>
                                                <p className="font-bold text-text-primary">₹{currentValue.toFixed(2)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-text-secondary">Profit/Loss</p>
                                                <p className={`font-bold ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {profitLoss >= 0 ? '+' : ''}₹{profitLoss.toFixed(2)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-text-secondary">Returns</p>
                                                <p className={`font-bold ${percentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {percentage >= 0 ? '+' : ''}{percentage.toFixed(2)}%
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {investment.notes && (
                                        <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/5">
                                            <p className="text-xs text-text-secondary mb-1">Notes</p>
                                            <p className="text-sm text-text-primary">{investment.notes}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <InvestmentModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                investment={selectedInvestment}
            />
        </div>
    );
};

export default Investments;
