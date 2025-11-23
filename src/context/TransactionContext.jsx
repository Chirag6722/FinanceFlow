import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    onSnapshot,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';
import { useCards } from './CardContext';

const TransactionContext = createContext();

export function TransactionProvider({ children }) {
    const [transactions, setTransactions] = useState([]);
    const { user } = useAuth();
    const { updateCardBalance, cards } = useCards();

    useEffect(() => {
        if (!user) {
            setTransactions([]);
            return;
        }

        // Real-time listener for user's transactions
        const q = query(
            collection(db, 'users', user.uid, 'transactions'),
            orderBy('date', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const transactionsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setTransactions(transactionsData);
        });

        return () => unsubscribe();
    }, [user]);

    const addTransaction = async (transaction) => {
        if (!user) return;

        try {
            // Ensure cash transactions are linked to the Cash card and validate balance
            if (transaction.paymentMethod === 'Cash' && !transaction.cardId) {
                const cashCard = cards.find(c => c.type === 'Cash');
                if (cashCard) {
                    transaction.cardId = cashCard.id; // associate transaction with cash card
                    const amount = parseFloat(transaction.amount);
                    if (cashCard.balance < amount) {
                        throw new Error(`Insufficient cash balance. Available: ₹${cashCard.balance.toFixed(2)}, Required: ₹${amount.toFixed(2)}`);
                    }
                }
            }

            // Check if transaction is linked to a card and validate balance for expenses
            if (transaction.cardId && transaction.type === 'expense' && updateCardBalance) {
                const card = cards.find(c => c.id === transaction.cardId);
                if (card) {
                    const transactionAmount = parseFloat(transaction.amount);
                    if (card.balance < transactionAmount) {
                        throw new Error(`Insufficient balance in ${card.name}. Available: ₹${card.balance.toFixed(2)}, Required: ₹${transactionAmount.toFixed(2)}`);
                    }
                }
            }

            await addDoc(collection(db, 'users', user.uid, 'transactions'), {
                ...transaction,
                createdAt: serverTimestamp()
            });

            // Update card balance if transaction is linked to a card
            if (transaction.cardId && updateCardBalance) {
                const amount = parseFloat(transaction.amount);
                const balanceChange = transaction.type === 'income' ? amount : -amount;
                await updateCardBalance(transaction.cardId, balanceChange);
            }
        } catch (error) {
            console.error('Error adding transaction:', error);
            throw error;
        }
    };

    const updateTransaction = async (id, updates) => {
        if (!user) return;

        try {
            // Get the old transaction to reverse its balance effect
            const oldTransaction = transactions.find(t => t.id === id);

            const transactionRef = doc(db, 'users', user.uid, 'transactions', id);
            await updateDoc(transactionRef, {
                ...updates,
                updatedAt: serverTimestamp()
            });

            // Update card balances if needed
            if (updateCardBalance && oldTransaction) {
                // Reverse old transaction's effect
                if (oldTransaction.cardId) {
                    const oldAmount = parseFloat(oldTransaction.amount);
                    const oldChange = oldTransaction.type === 'income' ? -oldAmount : oldAmount;
                    await updateCardBalance(oldTransaction.cardId, oldChange);
                }

                // Apply new transaction's effect
                if (updates.cardId) {
                    const newAmount = parseFloat(updates.amount || oldTransaction.amount);
                    const newChange = (updates.type || oldTransaction.type) === 'income' ? newAmount : -newAmount;
                    await updateCardBalance(updates.cardId, newChange);
                }
            }
        } catch (error) {
            console.error('Error updating transaction:', error);
            throw error;
        }
    };

    const deleteTransaction = async (id) => {
        if (!user) return;

        try {
            const transactionId = String(id);
            const transaction = transactions.find(t => t.id === transactionId);

            await deleteDoc(doc(db, 'users', user.uid, 'transactions', transactionId));

            // Reverse the transaction's effect on card balance
            if (transaction && transaction.cardId && updateCardBalance) {
                const amount = parseFloat(transaction.amount);
                const balanceChange = transaction.type === 'income' ? -amount : amount;
                await updateCardBalance(transaction.cardId, balanceChange);
            }
        } catch (error) {
            console.error('Error deleting transaction:', error);
            throw error;
        }
    };

    const getStats = () => {
        // Only count transactions that are NOT linked to cards
        // (card-linked transactions are already reflected in card balances)
        const income = transactions
            .filter(t => t.type === 'income' && !t.cardId)
            .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

        const expense = transactions
            .filter(t => t.type === 'expense' && !t.cardId)
            .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

        return {
            income,
            expense,
            balance: income - expense
        };
    };

    return (
        <TransactionContext.Provider value={{
            transactions,
            addTransaction,
            updateTransaction,
            deleteTransaction,
            getStats
        }}>
            {children}
        </TransactionContext.Provider>
    );
}

export function useTransactions() {
    const context = useContext(TransactionContext);
    if (context === undefined) {
        throw new Error('useTransactions must be used within a TransactionProvider');
    }
    return context;
}
