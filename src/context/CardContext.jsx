import React, { createContext, useState, useContext, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

export const CardContext = createContext();

export const useCards = () => {
    const context = useContext(CardContext);
    if (!context) {
        throw new Error('useCards must be used within a CardProvider');
    }
    return context;
};

export const CardProvider = ({ children }) => {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    // Load cards from Firestore
    useEffect(() => {
        if (!user) {
            setCards([]);
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, 'users', user.uid, 'cards')
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const cardsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCards(cardsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const addCard = async (cardData) => {
        if (!user) return;

        try {
            const newCard = {
                ...cardData,
                balance: cardData.initialBalance || 0,
                createdAt: new Date().toISOString()
            };

            await addDoc(collection(db, 'users', user.uid, 'cards'), newCard);
        } catch (error) {
            console.error('Error adding card:', error);
            throw error;
        }
    };

    const updateCard = async (cardId, updates) => {
        if (!user) return;

        try {
            const cardRef = doc(db, 'users', user.uid, 'cards', cardId);
            await updateDoc(cardRef, {
                ...updates,
                updatedAt: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error updating card:', error);
            throw error;
        }
    };

    const deleteCard = async (cardId) => {
        if (!user) return;

        try {
            await deleteDoc(doc(db, 'users', user.uid, 'cards', cardId));
        } catch (error) {
            console.error('Error deleting card:', error);
            throw error;
        }
    };

    const updateCardBalance = async (cardId, amount) => {
        const card = cards.find(c => c.id === cardId);
        if (!card) return;

        try {
            const newBalance = (card.balance || 0) + amount;
            await updateCard(cardId, { balance: newBalance });
        } catch (error) {
            console.error('Error updating card balance:', error);
            throw error;
        }
    };

    const getCardById = (cardId) => {
        return cards.find(c => c.id === cardId);
    };

    const value = {
        cards,
        loading,
        addCard,
        updateCard,
        deleteCard,
        updateCardBalance,
        getCardById
    };

    return (
        <CardContext.Provider value={value}>
            {children}
        </CardContext.Provider>
    );
};
