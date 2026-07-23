import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

interface DueCustomer {
    id: number;
    name: string;
    phone: string | null;
    balance: number;
    total_due: number;
    credit_limit: number;
    available_credit: number;
}

interface CreateProps {
    dueCustomers: DueCustomer[];
}

export default function DueCollectionsCreate({ dueCustomers }: CreateProps) {
    const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [transactionId, setTransactionId] = useState('');
    const [notes, setNotes] = useState('');

    const selectedCustomerData = dueCustomers.find(c => c.id === selectedCustomer);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedCustomer) {
            toast.error('Please select a customer');
            return;
        }

        if (!amount || Number(amount) <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        const maxAmount = selectedCustomerData ? Math.abs(selectedCustomerData.balance) : 0;
        if (Number(amount) > maxAmount) {
            toast.error(`Amount cannot exceed due amount of $${maxAmount.toFixed(2)}`);
            return;
        }

        router.post('/due-collections', {
            user_id: selectedCustomer,
            amount: Number(amount),
            payment_method: paymentMethod,
            transaction_id: transactionId || null,
            notes: notes || null,
        }, {
            onSuccess: () => {
                toast.success('Payment collected successfully');
                setSelectedCustomer(null);
                setAmount('');
                setPaymentMethod('cash');
                setTransactionId('');
                setNotes('');
            },
            onError: () => {
                toast.error('Failed to collect payment');
            },
        });
    };

    return (
        <>
            <Head title="New Due Collection" />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold dark:text-white">New Due Collection</h1>
                    <button
                        onClick={() => window.history.back()}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Back
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Select Customer *
                                        </label>
                                        <select
                                            value={selectedCustomer || ''}
                                            onChange={(e) => setSelectedCustomer(e.target.value ? Number(e.target.value) : null)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                            required
                                        >
                                            <option value="">Select a customer</option>
                                            {dueCustomers.map(customer => (
                                                <option key={customer.id} value={customer.id}>
                                                    {customer.name} - Due: ${customer.total_due.toFixed(2)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {selectedCustomerData && (
                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                            <h3 className="font-medium dark:text-white mb-2">Customer Details</h3>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div>
                                                    <span className="text-gray-500 dark:text-gray-400">Name:</span>
                                                    <span className="ml-2 dark:text-white">{selectedCustomerData.name}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 dark:text-gray-400">Phone:</span>
                                                    <span className="ml-2 dark:text-white">{selectedCustomerData.phone || 'N/A'}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 dark:text-gray-400">Total Due:</span>
                                                    <span className="ml-2 text-red-600 dark:text-red-400 font-medium">
                                                        ${selectedCustomerData.total_due.toFixed(2)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 dark:text-gray-400">Credit Limit:</span>
                                                    <span className="ml-2 dark:text-white">${selectedCustomerData.credit_limit.toFixed(2)}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 dark:text-gray-400">Available Credit:</span>
                                                    <span className="ml-2 dark:text-white">${selectedCustomerData.available_credit.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Amount *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="Enter amount"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                            required
                                        />
                                        {selectedCustomerData && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                Maximum: ${Math.abs(selectedCustomerData.balance).toFixed(2)}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Payment Method *
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['cash', 'card', 'bkash', 'nagad'].map((method) => (
                                                <button
                                                    key={method}
                                                    type="button"
                                                    onClick={() => setPaymentMethod(method)}
                                                    className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                                                        paymentMethod === method
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-gray-100 dark:bg-neutral-800 dark:text-gray-300'
                                                    }`}
                                                >
                                                    {method}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Transaction ID
                                        </label>
                                        <input
                                            type="text"
                                            value={transactionId}
                                            onChange={(e) => setTransactionId(e.target.value)}
                                            placeholder="Enter transaction ID (optional)"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Notes
                                        </label>
                                        <textarea
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            placeholder="Enter notes (optional)"
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 resize-none"
                                        />
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            type="submit"
                                            className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                                        >
                                            Collect Payment
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => window.history.back()}
                                            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Summary */}
                    <div>
                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                            <h2 className="text-lg font-bold dark:text-white mb-4">Summary</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm dark:text-gray-300">
                                    <span>Total Due Customers</span>
                                    <span className="font-medium dark:text-white">{dueCustomers.length}</span>
                                </div>
                                <div className="flex justify-between text-sm dark:text-gray-300">
                                    <span>Total Due Amount</span>
                                    <span className="font-medium text-red-600 dark:text-red-400">
                                        ${dueCustomers.reduce((sum, c) => sum + c.total_due, 0).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6 mt-4">
                            <h2 className="text-lg font-bold dark:text-white mb-4">Top Due Customers</h2>
                            <div className="space-y-2">
                                {dueCustomers.slice(0, 5).map((customer) => (
                                    <div
                                        key={customer.id}
                                        onClick={() => setSelectedCustomer(customer.id)}
                                        className="p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
                                    >
                                        <div className="font-medium dark:text-white">{customer.name}</div>
                                        <div className="text-sm text-red-600 dark:text-red-400">
                                            Due: ${customer.total_due.toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
