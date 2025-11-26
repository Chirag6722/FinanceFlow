import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar } from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass p-4 rounded-xl border border-black/5 dark:border-white/10">
                <p className="text-text-secondary text-sm mb-2">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} className="text-sm font-bold" style={{ color: entry.color }}>
                        {entry.name}: ₹{entry.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const Analytics = () => {
    const { transactions } = useTransactions();

    // Calculate category data from transactions
    const categoryData = useMemo(() => {
        const categories = {};

        transactions
            .filter(t => t.type === 'expense')
            .forEach(t => {
                const amount = parseFloat(t.amount);
                if (categories[t.category]) {
                    categories[t.category] += amount;
                } else {
                    categories[t.category] = amount;
                }
            });

        return Object.entries(categories)
            .map(([name, value], index) => ({
                name,
                value: parseFloat(value.toFixed(2)),
                color: COLORS[index % COLORS.length]
            }))
            .sort((a, b) => b.value - a.value);
    }, [transactions]);

    // Calculate monthly data from transactions
    const monthlyData = useMemo(() => {
        const months = {};

        transactions.forEach(t => {
            const date = new Date(t.date);
            const monthKey = date.toLocaleDateString('en-US', { month: 'short' });

            if (!months[monthKey]) {
                months[monthKey] = { name: monthKey, income: 0, expense: 0, date };
            }

            const amount = parseFloat(t.amount);
            if (t.type === 'income') {
                months[monthKey].income += amount;
            } else {
                months[monthKey].expense += amount;
            }
        });

        return Object.values(months)
            .sort((a, b) => a.date - b.date)
            .slice(-6) // Last 6 months
            .map(({ name, income, expense }) => ({
                name,
                income: parseFloat(income.toFixed(2)),
                expense: parseFloat(expense.toFixed(2))
            }));
    }, [transactions]);

    // Calculate summary stats
    const stats = useMemo(() => {
        const totalExpense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        const avgMonthlySpend = monthlyData.length > 0
            ? monthlyData.reduce((sum, m) => sum + m.expense, 0) / monthlyData.length
            : 0;

        const highestCategory = categoryData.length > 0 ? categoryData[0] : { name: 'N/A', value: 0 };
        const categoryPercentage = totalExpense > 0
            ? ((highestCategory.value / totalExpense) * 100).toFixed(0)
            : 0;

        const savingsRate = totalIncome > 0
            ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(0)
            : 0;

        return {
            avgMonthlySpend,
            highestCategory: highestCategory.name,
            categoryPercentage,
            savingsRate
        };
    }, [transactions, categoryData, monthlyData]);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary mb-2">Analytics</h1>
                    <p className="text-text-secondary">Detailed insights into your spending habits.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-surface border border-black/5 dark:border-white/5 rounded-xl text-text-secondary hover:text-text-primary transition-colors">
                    <Calendar size={18} />
                    <span>Last 6 Months</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Spending by Category */}
                <div className="glass p-6 rounded-2xl border border-black/5 dark:border-white/5">
                    <h3 className="text-lg font-bold text-text-primary mb-6">Spending by Category</h3>
                    <div className="h-[300px] w-full">
                        {categoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-text-secondary">
                                No expense data available
                            </div>
                        )}
                    </div>
                </div>

                {/* Monthly Comparison */}
                <div className="glass p-6 rounded-2xl border border-black/5 dark:border-white/5">
                    <h3 className="text-lg font-bold text-text-primary mb-6">Income vs Expense</h3>
                    <div className="h-[300px] w-full">
                        {monthlyData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                                        tickFormatter={(value) => `₹${value}`}
                                    />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(128,128,128,0.05)' }} />
                                    <Legend />
                                    <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-text-secondary">
                                No transaction data available
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-2xl border border-black/5 dark:border-white/5">
                    <p className="text-text-secondary text-sm mb-1">Average Monthly Spend</p>
                    <h4 className="text-2xl font-bold text-text-primary">
                        ₹{stats.avgMonthlySpend.toFixed(2)}
                    </h4>
                    <p className="text-xs text-text-secondary mt-2">Based on last {monthlyData.length} months</p>
                </div>
                <div className="glass p-6 rounded-2xl border border-black/5 dark:border-white/5">
                    <p className="text-text-secondary text-sm mb-1">Highest Spending Category</p>
                    <h4 className="text-2xl font-bold text-text-primary">{stats.highestCategory}</h4>
                    <p className="text-xs text-text-secondary mt-2">{stats.categoryPercentage}% of total expenses</p>
                </div>
                <div className="glass p-6 rounded-2xl border border-black/5 dark:border-white/5">
                    <p className="text-text-secondary text-sm mb-1">Savings Rate</p>
                    <h4 className="text-2xl font-bold text-text-primary">{stats.savingsRate}%</h4>
                    <p className={`text-xs mt-2 ${parseFloat(stats.savingsRate) > 0 ? 'text-secondary' : 'text-danger'}`}>
                        {parseFloat(stats.savingsRate) > 0 ? 'On track for goal' : 'Need to save more'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
