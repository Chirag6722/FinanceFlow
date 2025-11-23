import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useSplits } from '../../context/SplitContext';

export function SplitModal({ isOpen, onClose, split = null }) {
    const { addSplit, updateSplit } = useSplits();
    const [formData, setFormData] = useState({
        description: '',
        totalAmount: 0,
        paidBy: 'You',
        date: new Date().toISOString().split('T')[0],
        people: [{ name: '', amount: 0, isPaid: false }]
    });
    const [splitType, setSplitType] = useState('equal'); // 'equal' or 'custom'
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        if (split) {
            setFormData(split);
        } else {
            setFormData({
                description: '',
                totalAmount: 0,
                paidBy: 'You',
                date: new Date().toISOString().split('T')[0],
                people: [{ name: '', amount: 0, isPaid: false }]
            });
        }
    }, [split, isOpen]);

    const handleAddPerson = () => {
        setFormData({
            ...formData,
            people: [...formData.people, { name: '', amount: 0, isPaid: false }]
        });
    };

    const handleRemovePerson = (index) => {
        const newPeople = formData.people.filter((_, i) => i !== index);
        setFormData({ ...formData, people: newPeople });
    };

    const handlePersonChange = (index, field, value) => {
        const newPeople = [...formData.people];
        newPeople[index][field] = value;
        setFormData({ ...formData, people: newPeople });
    };

    const handleSplitTypeChange = (type) => {
        setSplitType(type);
        if (type === 'equal' && formData.totalAmount > 0 && formData.people.length > 0) {
            const amountPerPerson = formData.totalAmount / formData.people.length;
            const newPeople = formData.people.map(p => ({ ...p, amount: amountPerPerson }));
            setFormData({ ...formData, people: newPeople });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (split) {
                await updateSplit(split.id, formData);
            } else {
                await addSplit(formData);
            }
            onClose();
        } catch (error) {
            console.error('Error saving split:', error);
            alert('Failed to save split transaction. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {split ? 'Edit Split' : 'Split Transaction'}
                        </h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="e.g., Dinner at Restaurant"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Total Amount */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Total Amount (₹)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={formData.totalAmount}
                                onChange={(e) => setFormData({ ...formData, totalAmount: parseFloat(e.target.value) || 0 })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Paid By */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Paid By
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.paidBy}
                                onChange={(e) => setFormData({ ...formData, paidBy: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Split Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Split Type
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => handleSplitTypeChange('equal')}
                                className={`py-2 rounded-lg font-medium ${splitType === 'equal' ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700'
                                    }`}
                            >
                                Equal Split
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSplitTypeChange('custom')}
                                className={`py-2 rounded-lg font-medium ${splitType === 'custom' ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700'
                                    }`}
                            >
                                Custom Amounts
                            </button>
                        </div>
                    </div>

                    {/* People */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Split With
                            </label>
                            <button
                                type="button"
                                onClick={handleAddPerson}
                                className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700"
                            >
                                <Plus size={16} /> Add Person
                            </button>
                        </div>
                        <div className="space-y-2">
                            {formData.people.map((person, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        value={person.name}
                                        onChange={(e) => handlePersonChange(index, 'name', e.target.value)}
                                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="Amount"
                                        value={person.amount}
                                        onChange={(e) => handlePersonChange(index, 'amount', parseFloat(e.target.value) || 0)}
                                        disabled={splitType === 'equal'}
                                        className="w-32 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemovePerson(index)}
                                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : split ? 'Update' : 'Add Split'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
