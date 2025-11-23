import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Target, TrendingUp, DollarSign } from 'lucide-react';
import { useGoals } from '../context/GoalContext';
import { GoalModal } from '../components/Goals/GoalModal';

const Goals = () => {
    const { goals, deleteGoal, addToGoal, getGoalProgress } = useGoals();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [addAmountModal, setAddAmountModal] = useState(null);
    const [addAmount, setAddAmount] = useState(0);

    const handleEdit = (goal) => {
        setSelectedGoal(goal);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setSelectedGoal(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedGoal(null);
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this goal?')) {
            await deleteGoal(id);
        }
    };

    const handleAddMoney = async (goalId) => {
        if (addAmount > 0) {
            await addToGoal(goalId, addAmount);
            setAddAmountModal(null);
            setAddAmount(0);
        }
    };

    const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
    const totalSaved = goals.reduce((sum, g) => sum + (g.currentAmount || 0), 0);
    const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary mb-2">Goals & Savings</h1>
                    <p className="text-text-secondary">Track your financial goals and progress.</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 font-medium"
                >
                    <Plus size={20} />
                    <span>Add Goal</span>
                </button>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-2xl border border-black/5 dark:border-white/5">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-text-secondary">Total Target</p>
                        <Target className="w-5 h-5 text-indigo-600" />
                    </div>
                    <p className="text-2xl font-bold text-text-primary">₹{totalTarget.toFixed(2)}</p>
                </div>

                <div className="glass p-6 rounded-2xl border border-black/5 dark:border-white/5">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-text-secondary">Total Saved</p>
                        <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-green-600">₹{totalSaved.toFixed(2)}</p>
                </div>

                <div className="glass p-6 rounded-2xl border border-black/5 dark:border-white/5">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-text-secondary">Overall Progress</p>
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-text-primary">{overallProgress.toFixed(1)}%</p>
                </div>
            </div>

            {/* Goals List */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-text-primary">Your Goals</h2>

                {goals.length === 0 ? (
                    <div className="glass rounded-2xl p-12 text-center border border-black/5 dark:border-white/5">
                        <Target size={64} className="mx-auto mb-4 opacity-20 text-text-secondary" />
                        <h3 className="text-xl font-semibold mb-2 text-text-primary">No goals yet</h3>
                        <p className="text-text-secondary mb-4">Set financial goals and track your progress</p>
                        <button
                            onClick={handleAddNew}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
                        >
                            <Plus size={20} />
                            <span>Add Your First Goal</span>
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {goals.map((goal) => {
                            const progress = getGoalProgress(goal);

                            return (
                                <div key={goal.id} className="glass p-6 rounded-2xl border border-black/5 dark:border-white/5 hover:shadow-lg transition-shadow">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-text-primary">{goal.name}</h3>
                                            <p className="text-sm text-text-secondary">{goal.category}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(goal)}
                                                className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(goal.id)}
                                                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Progress Circle */}
                                    <div className="flex items-center justify-center mb-4">
                                        <div className="relative w-32 h-32">
                                            <svg className="w-full h-full transform -rotate-90">
                                                <circle
                                                    cx="64"
                                                    cy="64"
                                                    r="56"
                                                    stroke="currentColor"
                                                    strokeWidth="8"
                                                    fill="none"
                                                    className="text-gray-200 dark:text-gray-700"
                                                />
                                                <circle
                                                    cx="64"
                                                    cy="64"
                                                    r="56"
                                                    stroke="currentColor"
                                                    strokeWidth="8"
                                                    fill="none"
                                                    strokeDasharray={`${2 * Math.PI * 56}`}
                                                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress.percentage / 100)}`}
                                                    className="text-indigo-600 transition-all duration-500"
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-2xl font-bold text-text-primary">{progress.percentage.toFixed(0)}%</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-text-secondary">Saved</span>
                                            <span className="font-semibold text-text-primary">₹{(goal.currentAmount || 0).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-text-secondary">Target</span>
                                            <span className="font-semibold text-text-primary">₹{goal.targetAmount.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-text-secondary">Remaining</span>
                                            <span className="font-semibold text-text-primary">₹{progress.remaining.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-text-secondary">Deadline</span>
                                            <span className="font-semibold text-text-primary">{goal.deadline}</span>
                                        </div>
                                        {progress.monthsRemaining > 0 && (
                                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                                    💡 Save ₹{progress.requiredMonthlySavings.toFixed(2)}/month to reach your goal
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => setAddAmountModal(goal.id)}
                                        className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                    >
                                        Add Money
                                    </button>

                                    {addAmountModal === goal.id && (
                                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full">
                                                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Add Money to Goal</h3>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={addAmount}
                                                    onChange={(e) => setAddAmount(parseFloat(e.target.value) || 0)}
                                                    placeholder="Enter amount"
                                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-4"
                                                />
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => setAddAmountModal(null)}
                                                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={() => handleAddMoney(goal.id)}
                                                        className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                                    >
                                                        Add
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <GoalModal isOpen={isModalOpen} onClose={handleCloseModal} goal={selectedGoal} />
        </div>
    );
};

export default Goals;
