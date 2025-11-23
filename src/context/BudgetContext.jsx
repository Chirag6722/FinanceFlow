import React, { createContext, useState, useContext, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

export const BudgetContext = createContext();

export const useBudgets = () => {
    const context = useContext(BudgetContext);
    if (!context) {
        throw new Error('useBudgets must be used within a BudgetProvider');
    }
    return context;
};

export const BudgetProvider = ({ children }) => {
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    // Load budgets from Firestore
    useEffect(() => {
        if (!user) {
            setBudgets([]);
            setLoading(false);
            return;
        }

        const q = query(collection(db, 'users', user.uid, 'budgets'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const budgetsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setBudgets(budgetsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const addBudget = async (budgetData) => {
        if (!user) return;

        try {
            const newBudget = {
                ...budgetData,
                createdAt: new Date().toISOString()
            };

            await addDoc(collection(db, 'users', user.uid, 'budgets'), newBudget);
        } catch (error) {
            console.error('Error adding budget:', error);
            throw error;
        }
    };

    const updateBudget = async (budgetId, updates) => {
        if (!user) return;

        try {
            const budgetRef = doc(db, 'users', user.uid, 'budgets', budgetId);
            await updateDoc(budgetRef, {
                ...updates,
                updatedAt: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error updating budget:', error);
            throw error;
        }
    };

    const deleteBudget = async (budgetId) => {
        if (!user) return;

        try {
            await deleteDoc(doc(db, 'users', user.uid, 'budgets', budgetId));
        } catch (error) {
            console.error('Error deleting budget:', error);
            throw error;
        }
    };

    // This function will be called from components with transactions passed in
    const getBudgetStatus = (budget, transactions) => {
        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

        // Calculate spending for this budget's category in current month
        const spending = transactions
            .filter(t =>
                t.type === 'expense' &&
                t.category === budget.category &&
                t.date.startsWith(currentMonth)
            )
            .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

        const percentage = budget.amount > 0 ? (spending / budget.amount) * 100 : 0;
        const remaining = budget.amount - spending;

        let status = 'good'; // green
        if (percentage >= 100) status = 'exceeded'; // red
        else if (percentage >= 80) status = 'warning'; // yellow

        return {
            spending,
            percentage,
            remaining,
            status
        };
    };

    const getAllBudgetsStatus = (transactions) => {
        return budgets.map(budget => ({
            ...budget,
            ...getBudgetStatus(budget, transactions)
        }));
    };

    const value = {
        budgets,
        loading,
        addBudget,
        updateBudget,
        deleteBudget,
        getBudgetStatus,
        getAllBudgetsStatus
    };

    return (
        <BudgetContext.Provider value={value}>
            {children}
        </BudgetContext.Provider>
    );
};
