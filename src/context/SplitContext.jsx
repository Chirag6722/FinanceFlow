import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

export const SplitContext = createContext();

export const useSplits = () => {
    const context = useContext(SplitContext);
    if (!context) {
        throw new Error('useSplits must be used within a SplitProvider');
    }
    return context;
};

export const SplitProvider = ({ children }) => {
    const [splits, setSplits] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    // Load split transactions from Firestore
    useEffect(() => {
        if (!user) {
            setSplits([]);
            setLoading(false);
            return;
        }

        const q = query(collection(db, 'users', user.uid, 'splits'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const splitsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setSplits(splitsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const addSplit = async (splitData) => {
        if (!user) return;

        try {
            const newSplit = {
                ...splitData,
                createdAt: new Date().toISOString()
            };

            await addDoc(collection(db, 'users', user.uid, 'splits'), newSplit);
        } catch (error) {
            console.error('Error adding split:', error);
            throw error;
        }
    };

    const updateSplit = async (splitId, updates) => {
        if (!user) return;

        try {
            const splitRef = doc(db, 'users', user.uid, 'splits', splitId);
            await updateDoc(splitRef, {
                ...updates,
                updatedAt: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error updating split:', error);
            throw error;
        }
    };

    const deleteSplit = async (splitId) => {
        if (!user) return;

        try {
            await deleteDoc(doc(db, 'users', user.uid, 'splits', splitId));
        } catch (error) {
            console.error('Error deleting split:', error);
            throw error;
        }
    };

    const markAsSettled = async (splitId, personName) => {
        const split = splits.find(s => s.id === splitId);
        if (!split) return;

        const updatedPeople = split.people.map(p =>
            p.name === personName ? { ...p, isPaid: true } : p
        );

        await updateSplit(splitId, { people: updatedPeople });
    };

    const getSettlementSummary = () => {
        const summary = { owesYou: [], youOwe: [] };

        splits.forEach(split => {
            split.people.forEach(person => {
                if (!person.isPaid) {
                    if (split.paidBy === 'You') {
                        // Others owe you
                        const existing = summary.owesYou.find(p => p.name === person.name);
                        if (existing) {
                            existing.amount += person.amount;
                        } else {
                            summary.owesYou.push({ name: person.name, amount: person.amount });
                        }
                    } else if (person.name === 'You') {
                        // You owe someone
                        const existing = summary.youOwe.find(p => p.name === split.paidBy);
                        if (existing) {
                            existing.amount += person.amount;
                        } else {
                            summary.youOwe.push({ name: split.paidBy, amount: person.amount });
                        }
                    }
                }
            });
        });

        return summary;
    };

    const value = {
        splits,
        loading,
        addSplit,
        updateSplit,
        deleteSplit,
        markAsSettled,
        getSettlementSummary
    };

    return (
        <SplitContext.Provider value={value}>
            {children}
        </SplitContext.Provider>
    );
};
