import React from 'react';
import { LayoutDashboard, CreditCard, PieChart, Settings, LogOut, Wallet, TrendingUp, Target, Repeat, BarChart3, Flag } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: CreditCard, label: 'Transactions', path: '/transactions' },
        { icon: Wallet, label: 'Cards', path: '/cards' },
        { icon: PieChart, label: 'Analytics', path: '/analytics' },
        { icon: TrendingUp, label: 'Investments', path: '/investments' },
        { icon: Target, label: 'Budgets', path: '/budgets' },
        { icon: Repeat, label: 'Recurring', path: '/recurring' },
        { icon: Flag, label: 'Goals', path: '/goals' },
        { icon: BarChart3, label: 'Insights', path: '/insights' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <>
            {/* Backdrop Overlay for Mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`fixed left-0 top-0 h-screen w-64 bg-surface border-r border-white/5 flex flex-col p-6 transform transition-transform duration-300 z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                            <div className="w-4 h-4 rounded-full bg-white/20" />
                        </div>
                        <h1 className="text-xl font-bold text-text-primary">FinanceFlow</h1>
                    </div>
                    {/* Close Button for Mobile */}
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-white/5 text-text-secondary md:hidden"
                    >
                        <LogOut className="rotate-180" size={20} />
                    </button>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => onClose && onClose()} // Close sidebar on navigation
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                    isActive
                                        ? "bg-primary text-white shadow-lg shadow-primary/25"
                                        : "text-text-secondary hover:text-text-primary hover:bg-black/5 dark:hover:bg-white/5"
                                )}
                            >
                                <Icon size={20} />
                                <span className="font-medium">{item.label}</span>
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto pt-6 border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-text-secondary hover:text-danger hover:bg-danger/10 transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
