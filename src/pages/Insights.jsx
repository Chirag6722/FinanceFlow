import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Insights = () => {
    const { transactions } = useTransactions();

    // Calculate insights
    const last6Months = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        return date.toISOString().slice(0, 7);
    }).reverse();

    const monthlyData = last6Months.map(month => {
        const monthTransactions = transactions.filter(t => t.date.startsWith(month));
        const income = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
        const expense = monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
        return {
            month: month.slice(5),
            income,
            expense,
            net: income - expense
        };
    });

    // Category breakdown
    const categoryData = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
        categoryData[t.category] = (categoryData[t.category] || 0) + parseFloat(t.amount || 0);
    });

    const categoryChartData = Object.entries(categoryData).map(([name, value]) => ({ name, value }));
    const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#6b7280'];

    // Top categories
    const topCategories = Object.entries(categoryData)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    // Average daily spending
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    const daysWithTransactions = new Set(transactions.map(t => t.date)).size;
    const avgDailySpending = daysWithTransactions > 0 ? totalExpense / daysWithTransactions : 0;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">Financial Insights</h1>
                <p className="text-text-secondary">Analyze your spending patterns and trends.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-2xl border border-black/5 dark:border-white/5">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-text-secondary">Avg. Daily Spending</p>
                        <DollarSign className="w-5 h-5 text-indigo-600" />
                    </div>
                    <p className="text-2xl font-bold text-text-primary">₹{avgDailySpending.toFixed(2)}</p>
                </div>

                <div className="glass p-6 rounded-2xl border border-black/5 dark:border-white/5">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-text-secondary">Total Categories</p>
                        <Calendar className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-text-primary">{Object.keys(categoryData).length}</p>
                </div>

                <div className="glass p-6 rounded-2xl border border-black/5 dark:border-white/5">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-text-secondary">Total Transactions</p>
                        <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-text-primary">{transactions.length}</p>
                </div>
            </div>

            {/* Monthly Trend */}
            <div className="glass p-6 rounded-2xl border border-black/5 dark:border-white/5">
                <h2 className="text-xl font-bold text-text-primary mb-4">6-Month Trend</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.1} />
                        <XAxis dataKey="month" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                        <Legend />
                        <Area type="monotone" dataKey="income" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="expense" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Category Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass p-6 rounded-2xl border border-black/5 dark:border-white/5">
                    <h2 className="text-xl font-bold text-text-primary mb-4">Category Distribution</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={categoryChartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {categoryChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="glass p-6 rounded-2xl border border-black/5 dark:border-white/5">
                    <h2 className="text-xl font-bold text-text-primary mb-4">Top Spending Categories</h2>
                    <div className="space-y-4">
                        {topCategories.map(([category, amount], index) => {
                            const percentage = (amount / totalExpense) * 100;
                            return (
                                <div key={category}>
                                    <div className="flex justify-between mb-2">
                                        <span className="font-medium text-text-primary">{category}</span>
                                        <span className="font-bold text-text-primary">₹{amount.toFixed(2)}</span>
                                    </div>
                                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div
                                            className="h-2 rounded-full"
                                            style={{
                                                width: `${percentage}%`,
                                                backgroundColor: COLORS[index % COLORS.length]
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Insights;
