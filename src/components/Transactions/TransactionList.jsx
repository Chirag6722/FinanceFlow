import React from 'react';
import { ShoppingBag, Coffee, Car, Home, ArrowUpRight, ArrowDownRight, Wallet, CreditCard, Smartphone } from 'lucide-react';
import { useTransactions } from '../../context/TransactionContext';
import { useCards } from '../../context/CardContext';
import { Link } from 'react-router-dom';

const TransactionList = () => {
    const { transactions } = useTransactions();
    const { getCardById } = useCards();
    const recentTransactions = transactions.slice(0, 5);

    const getCategoryIcon = (category) => {
        const icons = {
            'Food': Coffee,
            'Shopping': ShoppingBag,
            'Transport': Car,
            'Bills': Home,
            'Salary': Home,
            'Freelance': Home,
        };
        return icons[category] || ShoppingBag;
    };

    const getPaymentMethodIcon = (method) => {
        const icons = {
            'Cash': Wallet,
            'UPI': Smartphone,
            'Bank Transfer': Home,
            'Debit Card': CreditCard,
            'Credit Card': CreditCard,
        };
        return icons[method] || Wallet;
    };

    return (
        <div className="glass p-6 rounded-2xl h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-text-primary">Recent Transactions</h3>
                <Link to="/transactions" className="text-sm text-primary hover:text-primary/80 transition-colors">
                    View All
                </Link>
            </div>

            <div className="space-y-4">
                {recentTransactions.map((tx) => {
                    const Icon = getCategoryIcon(tx.category);
                    const isIncome = tx.type === 'income';

                    return (
                        <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors group cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full ${isIncome ? 'bg-secondary/20 text-secondary' : 'bg-danger/20 text-danger'} flex items-center justify-center`}>
                                    {isIncome ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                                </div>
                                <div>
                                    <h4 className="text-text-primary font-medium group-hover:text-primary transition-colors">{tx.description}</h4>
                                    <p className="text-xs text-text-secondary">{tx.date}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`font-bold ${isIncome ? 'text-secondary' : 'text-text-primary'}`}>
                                    {isIncome ? '+' : '-'}₹{tx.amount}
                                </p>
                                <div className="flex items-center justify-end gap-2 mt-1">
                                    {tx.paymentMethod && (
                                        <span className="text-xs text-text-secondary flex items-center gap-1">
                                            {React.createElement(getPaymentMethodIcon(tx.paymentMethod), { size: 12 })}
                                            {tx.paymentMethod}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TransactionList;
