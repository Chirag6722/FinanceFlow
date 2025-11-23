import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

export const RecurringContext = createContext();

export const useRecurring = () => {
    const context = useContext(RecurringContext);
    if (!context) {
        throw new Error('useRecurring must be used within a RecurringProvider');
    }
    return context;
};

export const RecurringProvider = ({ children }) => {
    const [recurringTransactions, setRecurringTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    // Load recurring transactions from Firestore
    useEffect(() => {
        if (!user) {
            setRecurringTransactions([]);
            setLoading(false);
            return;
        }

        const q = query(collection(db, 'users', user.uid, 'recurring'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const recurringData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setRecurringTransactions(recurringData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const addRecurring = async (recurringData) => {
        if (!user) return;

        try {
            const newRecurring = {
                ...recurringData,
                isActive: true,
                createdAt: new Date().toISOString()
            };

            await addDoc(collection(db, 'users', user.uid, 'recurring'), newRecurring);
        } catch (error) {
            console.error('Error adding recurring transaction:', error);
            throw error;
        }
    };

    const updateRecurring = async (recurringId, updates) => {
        if (!user) return;

        try {
            const recurringRef = doc(db, 'users', user.uid, 'recurring', recurringId);
            await updateDoc(recurringRef, {
                ...updates,
                updatedAt: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error updating recurring transaction:', error);
            throw error;
        }
    };

    const deleteRecurring = async (recurringId) => {
        if (!user) return;

        try {
            await deleteDoc(doc(db, 'users', user.uid, 'recurring', recurringId));
        } catch (error) {
            console.error('Error deleting recurring transaction:', error);
            throw error;
        }
    };

    const toggleRecurring = async (recurringId, isActive) => {
        await updateRecurring(recurringId, { isActive });
    };

    // Calculate next occurrence date
    const getNextOccurrence = (recurring) => {
        const lastDate = recurring.lastCreated ? new Date(recurring.lastCreated) : new Date(recurring.startDate);
        const next = new Date(lastDate);

        switch (recurring.frequency) {
            case 'Daily':
                next.setDate(next.getDate() + 1);
                break;
            case 'Weekly':
                next.setDate(next.getDate() + 7);
                break;
            case 'Monthly':
                next.setMonth(next.getMonth() + 1);
                break;
            case 'Yearly':
                next.setFullYear(next.getFullYear() + 1);
                break;
        }

        return next.toISOString().split('T')[0];
    };

    const value = {
        recurringTransactions,
        loading,
        addRecurring,
        updateRecurring,
        deleteRecurring,
        toggleRecurring,
        getNextOccurrence
    };

    return (
        <RecurringContext.Provider value={value}>
            {children}
        </RecurringContext.Provider>
    );
};
