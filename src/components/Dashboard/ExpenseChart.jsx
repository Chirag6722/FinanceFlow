import React, { useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTransactions } from '../../context/TransactionContext';
import { cn } from '../../lib/utils';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass p-4 rounded-xl border border-black/5 dark:border-white/10">
                <p className="text-text-secondary text-sm mb-2">{label}</p>
                <div className="space-y-1">
                    <p className="text-sm font-bold" style={{ color: '#10b981' }}>
                        Income: ${payload[0]?.value?.toFixed(2) || '0.00'}
                    </p>
                    <p className="text-sm font-bold" style={{ color: '#ef4444' }}>
                        Expense: ${payload[1]?.value?.toFixed(2) || '0.00'}
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

const ExpenseChart = () => {
    const { transactions } = useTransactions();
    const [period, setPeriod] = useState(7); // 7, 15, or 30 days

    const chartData = useMemo(() => {
        if (transactions.length === 0) {
            return [];
        }

        // Group transactions by date
        const grouped = {};

        transactions.forEach(t => {
            const date = new Date(t.date);
            const key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            if (!grouped[key]) {
                grouped[key] = {
                    name: key,
                    income: 0,
                    expense: 0,
                    date: date.getTime()
                };
            }

            const amount = parseFloat(t.amount || 0);
            if (t.type === 'income') {
                grouped[key].income += amount;
            } else {
                grouped[key].expense += amount;
            }
        });

        // Convert to array, sort by date, and take last N days
        return Object.values(grouped)
            .sort((a, b) => a.date - b.date)
            .slice(-period)
            .map(({ name, income, expense }) => ({
                name,
                income: parseFloat(income.toFixed(2)),
                expense: parseFloat(expense.toFixed(2))
            }));
    }, [transactions, period]);

    return (
        <div className="glass p-6 rounded-2xl h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-text-primary">Income vs Expense</h3>
                <div className="flex items-center gap-4">
                    {/* Time Period Selector */}
                    <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-lg">
                        <button
                            onClick={() => setPeriod(7)}
                            className={cn(
                                "px-3 py-1 rounded text-xs font-medium transition-colors",
                                period === 7 ? "bg-primary text-white" : "text-text-secondary hover:text-text-primary"
                            )}
                        >
                            7D
                        </button>
                        <button
                            onClick={() => setPeriod(15)}
                            className={cn(
                                "px-3 py-1 rounded text-xs font-medium transition-colors",
                                period === 15 ? "bg-primary text-white" : "text-text-secondary hover:text-text-primary"
                            )}
                        >
                            15D
                        </button>
                        <button
                            onClick={() => setPeriod(30)}
                            className={cn(
                                "px-3 py-1 rounded text-xs font-medium transition-colors",
                                period === 30 ? "bg-primary text-white" : "text-text-secondary hover:text-text-primary"
                            )}
                        >
                            30D
                        </button>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#10b981' }}></div>
                            <span className="text-xs text-text-secondary">Income</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ef4444' }}></div>
                            <span className="text-xs text-text-secondary">Expense</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-[300px] w-full">
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
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
                                tickFormatter={(value) => `$${value}`}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(128,128,128,0.2)' }} />
                            <Area
                                type="monotone"
                                dataKey="income"
                                stroke="#10b981"
                                strokeWidth={2}
                                fill="url(#colorIncome)"
                            />
                            <Area
                                type="monotone"
                                dataKey="expense"
                                stroke="#ef4444"
                                strokeWidth={2}
                                fill="url(#colorExpense)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full text-text-secondary">
                        No transaction data available
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExpenseChart;
