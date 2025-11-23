import React, { useState } from 'react';
import { Search, Bell, User, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import { useTransactions } from '../../context/TransactionContext';

const Header = ({ toggleSidebar }) => {
    const { user } = useAuth();
    const { transactions } = useTransactions();
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    // Use username from Firestore or extract from email
    const displayName = user?.username || user?.displayName || user?.email?.split('@')[0] || 'User';

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Navigate to transactions page with search query
            navigate(`/transactions?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <header className="flex items-center justify-between px-8 py-5 bg-background/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-4 flex-1">
                {/* Hamburger toggle for mobile */}
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-md md:hidden hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary hover:text-text-primary transition-colors"
                >
                    <Menu size={20} />
                </button>

                <form onSubmit={handleSearch} className="relative w-full max-w-md hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search transactions..."
                        className="w-full bg-surface border border-black/5 dark:border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary/50 transition-colors"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                        <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-1.5 font-mono text-[10px] font-medium text-text-secondary">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    </div>
                </form>
            </div>

            <div className="flex items-center gap-4">
                <ThemeToggle />

                <button className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary hover:text-text-primary transition-colors relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-danger border-2 border-background"></span>
                </button>

                <div className="flex items-center gap-3 pl-4 border-l border-black/5 dark:border-white/5">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-text-primary capitalize">{displayName}</p>
                        <p className="text-xs text-text-secondary">{user?.email}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary p-[2px]">
                        <div className="w-full h-full rounded-full bg-surface flex items-center justify-center overflow-hidden">
                            <User size={20} className="text-text-primary" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
