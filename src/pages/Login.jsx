import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Wallet, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isSignup, setIsSignup] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login, signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!email || !password) {
            setError('Please enter both email and password');
            setLoading(false);
            return;
        }

        if (isSignup && !username) {
            setError('Please enter a username');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        try {
            const result = isSignup
                ? await signup(email, password, username)
                : await login(email, password);

            if (result.success) {
                navigate('/');
            } else {
                setError(result.error || 'Authentication failed');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary mb-4">
                        <Wallet size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-text-primary mb-2">FinanceFlow</h1>
                    <p className="text-text-secondary">
                        {isSignup ? 'Create your account' : 'Sign in to manage your finances'}
                    </p>
                </div>

                {/* Login Card */}
                <div className="glass p-8 rounded-2xl border border-black/5 dark:border-white/5">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username (only for signup) */}
                        {isSignup && (
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-text-secondary uppercase">Username</label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full bg-background border border-black/10 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-text-primary focus:outline-none focus:border-primary/50 transition-colors"
                                        placeholder="johndoe"
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-text-secondary uppercase">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-background border border-black/10 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-text-primary focus:outline-none focus:border-primary/50 transition-colors"
                                    placeholder="you@example.com"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-text-secondary uppercase">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-background border border-black/10 dark:border-white/10 rounded-xl pl-10 pr-12 py-3 text-text-primary focus:outline-none focus:border-primary/50 transition-colors"
                                    placeholder="••••••••"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 rounded-lg bg-danger/10 border border-danger/20">
                                <p className="text-sm text-danger">{error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-4 py-3 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors font-medium shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Please wait...' : (isSignup ? 'Create Account' : 'Sign In')}
                        </button>
                    </form>

                    {/* Toggle Sign Up / Sign In */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => {
                                setIsSignup(!isSignup);
                                setError('');
                                setUsername('');
                            }}
                            className="text-sm text-primary hover:text-primary/80 transition-colors"
                        >
                            {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-text-secondary mt-6">
                    By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
};

export default Login;
