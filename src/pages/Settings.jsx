import React, { useState } from 'react';
import { User, Mail, Lock, Trash2, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { updateProfile, updatePassword, deleteUser } from 'firebase/auth';
import { doc, deleteDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

const Settings = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [username, setUsername] = useState(user?.username || '');
    const [email, setEmail] = useState(user?.email || '');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const currentUser = auth.currentUser;

            await setDoc(doc(db, 'users', currentUser.uid), {
                username: username,
                email: currentUser.email,
                updatedAt: new Date().toISOString()
            }, { merge: true });

            await updateProfile(currentUser, {
                displayName: username
            });

            setSuccess('Profile updated successfully! Refreshing...');

            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const currentUser = auth.currentUser;
            await updatePassword(currentUser, newPassword);
            setSuccess('Password updated successfully!');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            if (err.code === 'auth/requires-recent-login') {
                setError('For security reasons, please log out and log back in before changing your password.');
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm(
            'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.'
        );

        if (!confirmed) return;

        const doubleConfirm = window.confirm(
            'This is your last chance. Are you absolutely sure you want to delete your account?'
        );

        if (!doubleConfirm) return;

        setLoading(true);

        try {
            const currentUser = auth.currentUser;

            await deleteDoc(doc(db, 'users', currentUser.uid));
            await deleteUser(currentUser);
            await logout();
            navigate('/login');
        } catch (err) {
            if (err.code === 'auth/requires-recent-login') {
                setError('For security reasons, please log out and log back in before deleting your account.');
            } else {
                setError(err.message || 'Failed to delete account. You may need to re-login and try again.');
            }
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">Settings</h1>
                <p className="text-text-secondary">Manage your account settings and preferences.</p>
            </div>

            {success && (
                <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/20">
                    <p className="text-sm text-secondary">{success}</p>
                </div>
            )}
            {error && (
                <div className="p-4 rounded-xl bg-danger/10 border border-danger/20">
                    <p className="text-sm text-danger">{error}</p>
                </div>
            )}

            <div className="glass p-6 rounded-2xl border border-black/5 dark:border-white/5">
                <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
                    <User size={20} />
                    Profile Information
                </h2>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-text-secondary uppercase">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-background border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary/50 transition-colors"
                            placeholder="Your username"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-text-secondary uppercase">Email</label>
                        <input
                            type="email"
                            value={email}
                            disabled
                            className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-text-secondary cursor-not-allowed"
                            placeholder="Your email"
                        />
                        <p className="text-xs text-text-secondary">Email cannot be changed</p>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        <Save size={18} />
                        Save Changes
                    </button>
                </form>
            </div>

            <div className="glass p-6 rounded-2xl border border-black/5 dark:border-white/5">
                <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
                    <Lock size={20} />
                    Change Password
                </h2>
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-text-secondary uppercase">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full bg-background border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary/50 transition-colors"
                            placeholder="Enter new password"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-text-secondary uppercase">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-background border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary/50 transition-colors"
                            placeholder="Confirm new password"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !newPassword || !confirmPassword}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        <Save size={18} />
                        Update Password
                    </button>
                </form>
            </div>

            <div className="glass p-6 rounded-2xl border border-danger/20">
                <h2 className="text-xl font-bold text-danger mb-4 flex items-center gap-2">
                    <Trash2 size={20} />
                    Danger Zone
                </h2>
                <p className="text-text-secondary text-sm mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                </p>
                <button
                    onClick={handleDeleteAccount}
                    disabled={loading}
                    className="px-4 py-2 bg-danger text-white rounded-xl hover:bg-danger/90 transition-colors disabled:opacity-50"
                >
                    Delete Account
                </button>
            </div>
        </div>
    );
};

export default Settings;
