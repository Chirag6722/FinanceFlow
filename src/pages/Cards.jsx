import React, { useState } from 'react';
import { Plus, CreditCard, Edit2, Trash2, Wallet } from 'lucide-react';
import { useCards } from '../context/CardContext';
import { useTransactions } from '../context/TransactionContext';
import { CardModal } from '../components/Cards/CardModal';

const CardComponent = ({ card, onEdit, onDelete }) => {
    const { transactions } = useTransactions();

    // Get transactions for this card
    const cardTransactions = transactions.filter(t => t.cardId === card.id);
    const recentTransactions = cardTransactions.slice(0, 3);

    return (
        <div className="space-y-4">
            <div
                className="relative overflow-hidden rounded-2xl p-6 text-white shadow-xl transition-transform hover:scale-[1.02] cursor-pointer"
                style={{ backgroundColor: card.color }}
            >
                <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute bottom-0 left-0 -ml-8 -mb-8 h-32 w-32 rounded-full bg-black/10 blur-2xl" />

                <div className="relative z-10 flex flex-col justify-between h-48">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-medium text-white/80 mb-1">Current Balance</p>
                            <h3 className="text-2xl font-bold">₹{(card.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(card);
                                }}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (confirm('Are you sure you want to delete this card?')) {
                                        onDelete(card.id);
                                    }
                                }}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <CreditCard size={32} />
                            <div>
                                <p className="font-bold text-lg">{card.name}</p>
                                {card.lastFour && (
                                    <p className="text-sm opacity-80">•••• {card.lastFour}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-xs font-medium text-white/80 mb-1">Type</p>
                                <p className="font-medium">{card.type}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-white/80 mb-1">Transactions</p>
                                <p className="font-medium">{cardTransactions.length}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Transactions for this card */}
            {recentTransactions.length > 0 && (
                <div className="glass rounded-xl p-4 border border-black/5 dark:border-white/5">
                    <p className="text-sm font-medium text-text-secondary mb-2">Recent Activity</p>
                    <div className="space-y-2">
                        {recentTransactions.map(transaction => (
                            <div key={transaction.id} className="flex justify-between items-center text-sm">
                                <span className="text-text-primary">{transaction.description}</span>
                                <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                                    {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const Cards = () => {
    const { cards, deleteCard } = useCards();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    const handleEdit = (card) => {
        setSelectedCard(card);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setSelectedCard(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCard(null);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary mb-2">My Cards</h1>
                    <p className="text-text-secondary">Manage your cards and payment methods.</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 font-medium"
                >
                    <Plus size={20} />
                    <span>Add New Card</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map(card => (
                    <CardComponent
                        key={card.id}
                        card={card}
                        onEdit={handleEdit}
                        onDelete={deleteCard}
                    />
                ))}

                {/* Add Card Placeholder */}
                <button
                    onClick={handleAddNew}
                    className="h-full min-h-[240px] rounded-2xl border-2 border-dashed border-black/10 dark:border-white/10 flex flex-col items-center justify-center gap-4 text-text-secondary hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all group"
                >
                    <div className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <Plus size={24} />
                    </div>
                    <span className="font-medium">Add New Card</span>
                </button>
            </div>

            {cards.length === 0 && (
                <div className="glass rounded-2xl overflow-hidden border border-black/5 dark:border-white/5 p-12">
                    <div className="text-center text-text-secondary">
                        <Wallet size={64} className="mx-auto mb-4 opacity-20" />
                        <h3 className="text-xl font-semibold mb-2">No cards yet</h3>
                        <p className="mb-4">Add your first card to start tracking balances</p>
                        <button
                            onClick={handleAddNew}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
                        >
                            <Plus size={20} />
                            <span>Add Your First Card</span>
                        </button>
                    </div>
                </div>
            )}

            <CardModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                card={selectedCard}
            />
        </div>
    );
};

export default Cards;
