import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

export const GoalContext = createContext();

export const useGoals = () => {
    const context = useContext(GoalContext);
    if (!context) {
        throw new Error('useGoals must be used within a GoalProvider');
    }
    return context;
};

export const GoalProvider = ({ children }) => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    // Load goals from Firestore
    useEffect(() => {
        if (!user) {
            setGoals([]);
            setLoading(false);
            return;
        }

        const q = query(collection(db, 'users', user.uid, 'goals'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const goalsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setGoals(goalsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const addGoal = async (goalData) => {
        if (!user) return;

        try {
            const newGoal = {
                ...goalData,
                currentAmount: goalData.currentAmount || 0,
                createdAt: new Date().toISOString()
            };

            await addDoc(collection(db, 'users', user.uid, 'goals'), newGoal);
        } catch (error) {
            console.error('Error adding goal:', error);
            throw error;
        }
    };

    const updateGoal = async (goalId, updates) => {
        if (!user) return;

        try {
            const goalRef = doc(db, 'users', user.uid, 'goals', goalId);
            await updateDoc(goalRef, {
                ...updates,
                updatedAt: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error updating goal:', error);
            throw error;
        }
    };

    const deleteGoal = async (goalId) => {
        if (!user) return;

        try {
            await deleteDoc(doc(db, 'users', user.uid, 'goals', goalId));
        } catch (error) {
            console.error('Error deleting goal:', error);
            throw error;
        }
    };

    const addToGoal = async (goalId, amount) => {
        const goal = goals.find(g => g.id === goalId);
        if (!goal) return;

        const newAmount = (goal.currentAmount || 0) + amount;
        await updateGoal(goalId, { currentAmount: newAmount });
    };

    const getGoalProgress = (goal) => {
        const percentage = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
        const remaining = goal.targetAmount - goal.currentAmount;

        // Calculate required monthly savings
        const today = new Date();
        const deadline = new Date(goal.deadline);
        const monthsRemaining = Math.max(0, (deadline.getFullYear() - today.getFullYear()) * 12 + (deadline.getMonth() - today.getMonth()));
        const requiredMonthlySavings = monthsRemaining > 0 ? remaining / monthsRemaining : 0;

        return {
            percentage: Math.min(percentage, 100),
            remaining: Math.max(remaining, 0),
            monthsRemaining,
            requiredMonthlySavings: Math.max(requiredMonthlySavings, 0)
        };
    };

    const value = {
        goals,
        loading,
        addGoal,
        updateGoal,
        deleteGoal,
        addToGoal,
        getGoalProgress
    };

    return (
        <GoalContext.Provider value={value}>
            {children}
        </GoalContext.Provider>
    );
};
