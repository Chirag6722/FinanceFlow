import React, { createContext, useState, useContext, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

export const InvestmentContext = createContext();

export const useInvestments = () => {
    const context = useContext(InvestmentContext);
    if (!context) {
        throw new Error('useInvestments must be used within an InvestmentProvider');
    }
    return context;
};

// API Keys
const ALPHA_VANTAGE_KEY = 'S3MFM2MV5SS5QBSD';
const COINGECKO_KEY = 'CG-2X2zvvyY51DF6SqBNRbUUGVZ';

export const InvestmentProvider = ({ children }) => {
    const [investments, setInvestments] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    // Load investments from Firestore
    useEffect(() => {
        if (!user) {
            setInvestments([]);
            setLoading(false);
            return;
        }

        const q = query(collection(db, 'users', user.uid, 'investments'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const investmentsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setInvestments(investmentsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    // Fetch current price from APIs
    const fetchCurrentPrice = async (investment) => {
        try {
            const { type, symbol } = investment;

            if (type === 'Stocks') {
                // Alpha Vantage API for stocks
                const response = await fetch(
                    `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_KEY}`
                );
                const data = await response.json();
                const price = parseFloat(data['Global Quote']?.['05. price']);
                return price || null;
            } else if (type === 'Cryptocurrency') {
                // CoinGecko API for crypto
                const response = await fetch(
                    `https://api.coingecko.com/api/v3/simple/price?ids=${symbol.toLowerCase()}&vs_currencies=inr`,
                    {
                        headers: {
                            'x-cg-demo-api-key': COINGECKO_KEY
                        }
                    }
                );
                const data = await response.json();
                const price = data[symbol.toLowerCase()]?.inr;
                return price || null;
            } else if (type === 'Mutual Funds') {
                // MFAPI for mutual funds
                const response = await fetch(`https://api.mfapi.in/mf/${symbol}`);
                const data = await response.json();
                const price = parseFloat(data.data?.[0]?.nav);
                return price || null;
            }

            return null;
        } catch (error) {
            console.error('Error fetching price:', error);
            return null;
        }
    };

    const addInvestment = async (investmentData) => {
        if (!user) return;

        try {
            const newInvestment = {
                ...investmentData,
                createdAt: new Date().toISOString()
            };

            await addDoc(collection(db, 'users', user.uid, 'investments'), newInvestment);
        } catch (error) {
            console.error('Error adding investment:', error);
            throw error;
        }
    };

    const updateInvestment = async (investmentId, updates) => {
        if (!user) return;

        try {
            const investmentRef = doc(db, 'users', user.uid, 'investments', investmentId);
            await updateDoc(investmentRef, {
                ...updates,
                updatedAt: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error updating investment:', error);
            throw error;
        }
    };

    const deleteInvestment = async (investmentId) => {
        if (!user) return;

        try {
            await deleteDoc(doc(db, 'users', user.uid, 'investments', investmentId));
        } catch (error) {
            console.error('Error deleting investment:', error);
            throw error;
        }
    };

    const refreshPrice = async (investmentId) => {
        const investment = investments.find(inv => inv.id === investmentId);
        if (!investment) return;

        const newPrice = await fetchCurrentPrice(investment);
        if (newPrice) {
            await updateInvestment(investmentId, { currentPrice: newPrice });
        }
        return newPrice;
    };

    const refreshAllPrices = async () => {
        const promises = investments.map(inv => refreshPrice(inv.id));
        await Promise.all(promises);
    };

    const getPortfolioStats = () => {
        const totalInvested = investments.reduce((sum, inv) => {
            return sum + (inv.quantity * inv.buyPrice);
        }, 0);

        const currentValue = investments.reduce((sum, inv) => {
            return sum + (inv.quantity * (inv.currentPrice || inv.buyPrice));
        }, 0);

        const totalReturns = currentValue - totalInvested;
        const returnsPercentage = totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0;

        return {
            totalInvested,
            currentValue,
            totalReturns,
            returnsPercentage
        };
    };

    const value = {
        investments,
        loading,
        addInvestment,
        updateInvestment,
        deleteInvestment,
        refreshPrice,
        refreshAllPrices,
        getPortfolioStats
    };

    return (
        <InvestmentContext.Provider value={value}>
            {children}
        </InvestmentContext.Provider>
    );
};
