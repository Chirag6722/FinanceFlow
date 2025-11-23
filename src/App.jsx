import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Cards from './pages/Cards';
import Analytics from './pages/Analytics';
import Investments from './pages/Investments';
import Budgets from './pages/Budgets';
import RecurringTransactions from './pages/RecurringTransactions';
import Goals from './pages/Goals';
import Insights from './pages/Insights';
import Settings from './pages/Settings';
import Login from './pages/Login';
import { ThemeProvider } from './context/ThemeContext';
import { TransactionProvider } from './context/TransactionContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CardProvider } from './context/CardContext';
import { InvestmentProvider } from './context/InvestmentContext';
import { BudgetProvider } from './context/BudgetContext';
import { RecurringProvider } from './context/RecurringContext';
import { SplitProvider } from './context/SplitContext';
import { GoalProvider } from './context/GoalContext';


// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// App Routes Component (needs to be inside AuthProvider to use useAuth)
function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="cards" element={<Cards />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="investments" element={<Investments />} />
        <Route path="budgets" element={<Budgets />} />
        <Route path="recurring" element={<RecurringTransactions />} />
        <Route path="goals" element={<Goals />} />
        <Route path="insights" element={<Insights />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CardProvider>
          <InvestmentProvider>
            <BudgetProvider>
              <RecurringProvider>
                <GoalProvider>
                  <SplitProvider>
                    <TransactionProvider>
                      <Router>
                        <AppRoutes />
                      </Router>
                    </TransactionProvider>
                  </SplitProvider>
                </GoalProvider>
              </RecurringProvider>
            </BudgetProvider>
          </InvestmentProvider>
        </CardProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
