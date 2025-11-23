import React from 'react';
import { Wallet, TrendingUp, TrendingDown, CreditCard } from 'lucide-react';
import StatCard from '../components/Dashboard/StatCard';
import ExpenseChart from '../components/Dashboard/ExpenseChart';
import TransactionList from '../components/Transactions/TransactionList';
import { useTransactions } from '../context/TransactionContext';
import { useCards } from '../context/CardContext';

const Dashboard = () => {
    const { getStats } = useTransactions();
    const { cards } = useCards();
    const stats = getStats();

    // Calculate total balance in all cards
    const totalInCards = cards.reduce((sum, card) => sum + (card.balance || 0), 0);

    // Total balance includes both transaction balance and card balances
    const totalBalance = stats.balance + totalInCards;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">Dashboard</h1>
                <p className="text-text-secondary">Welcome back, here's what's happening with your finance today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Balance"
                    amount={`₹${totalBalance.toFixed(2)}`}
                    trend="up"
                    trendValue="+2.5%"
                    icon={Wallet}
                    color="bg-primary"
                />
                <StatCard
                    title="Total Income"
                    amount={`₹${stats.income.toFixed(2)}`}
                    trend="up"
                    trendValue="+12%"
                    icon={TrendingUp}
                    color="bg-secondary"
                />
                <StatCard
                    title="Total Expense"
                    amount={`₹${stats.expense.toFixed(2)}`}
                    trend="down"
                    trendValue="-5%"
                    icon={TrendingDown}
                    color="bg-danger"
                />
                <StatCard
                    title="Total in Cards"
                    amount={`₹${totalInCards.toFixed(2)}`}
                    trend="neutral"
                    trendValue={`${cards.length} cards`}
                    icon={CreditCard}
                    color="bg-purple-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <ExpenseChart />
                </div>
                <div className="lg:col-span-1">
                    <TransactionList />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
