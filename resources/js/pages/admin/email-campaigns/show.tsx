import { Head, router } from '@inertiajs/react';
import { FaEdit, FaTrash, FaArrowLeft, FaEnvelope, FaCalendar, FaPaperPlane, FaBan, FaEye, FaMousePointer } from "react-icons/fa";
import { toast } from 'sonner';

interface EmailCampaign {
    id: number;
    name: string;
    subject: string;
    content: string;
    type: string;
    status: string;
    scheduled_at: string | null;
    sent_at: string | null;
    recipients_count: number;
    opened_count: number;
    clicked_count: number;
    created_at: string;
    updated_at: string;
}

interface EmailCampaignShowProps {
    campaign: EmailCampaign;
}

export default function EmailCampaignShow({ campaign }: EmailCampaignShowProps) {
    const handleEdit = () => {
        router.get(`/email-campaigns/${campaign.id}/edit`);
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this email campaign?')) {
            router.delete(`/email-campaigns/${campaign.id}`, {
                onSuccess: () => {
                    toast.success('Email campaign deleted successfully');
                    router.get('/email-campaigns');
                },
            });
        }
    };

    const handleSend = () => {
        router.post(`/email-campaigns/${campaign.id}/send`, {}, {
            onSuccess: () => {
                toast.success('Email campaign sent successfully');
            },
        });
    };

    const handleCancel = () => {
        router.post(`/email-campaigns/${campaign.id}/cancel`, {}, {
            onSuccess: () => {
                toast.success('Email campaign cancelled successfully');
            },
        });
    };

    const formatDate = (date: string | null) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleString();
    };

    const getOpenRate = () => {
        if (campaign.recipients_count === 0) return '0%';
        return `${((campaign.opened_count / campaign.recipients_count) * 100).toFixed(1)}%`;
    };

    const getClickRate = () => {
        if (campaign.recipients_count === 0) return '0%';
        return `${((campaign.clicked_count / campaign.recipients_count) * 100).toFixed(1)}%`;
    };

    const getTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            order_confirmation: 'Order Confirmation',
            promotional: 'Promotional',
            newsletter: 'Newsletter',
            abandoned_cart: 'Abandoned Cart',
        };
        return labels[type] || type;
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
            scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            sent: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <>
            <Head title={`Email Campaign: ${campaign.name}`} />
            <div className="p-6">
                <div className="mb-6">
                    <button
                        onClick={() => router.get('/email-campaigns')}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-4 transition-colors"
                    >
                        <FaArrowLeft />
                        Back to Email Campaigns
                    </button>
                    <h1 className="text-2xl font-bold dark:text-white">Email Campaign Details</h1>
                </div>

                <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-200 dark:border-neutral-800">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                    <FaEnvelope className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{campaign.name}</h2>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(campaign.status)}`}>
                                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {(campaign.status === 'draft' || campaign.status === 'scheduled') && (
                                <button
                                    onClick={handleSend}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                                >
                                    <FaPaperPlane />
                                    Send Now
                                </button>
                            )}
                            {campaign.status === 'scheduled' && (
                                <button
                                    onClick={handleCancel}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                                >
                                    <FaBan />
                                    Cancel
                                </button>
                            )}
                            {campaign.status === 'draft' && (
                                <button
                                    onClick={handleEdit}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Edit
                                </button>
                            )}
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>

                    {/* Campaign Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                <FaEnvelope className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Subject</h3>
                                <p className="text-gray-900 dark:text-white font-medium">{campaign.subject}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                <FaEnvelope className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Type</h3>
                                <p className="text-gray-900 dark:text-white font-medium">{getTypeLabel(campaign.type)}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                <FaCalendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Scheduled For</h3>
                                <p className="text-gray-900 dark:text-white font-medium">{formatDate(campaign.scheduled_at)}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                                <FaPaperPlane className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Sent At</h3>
                                <p className="text-gray-900 dark:text-white font-medium">{formatDate(campaign.sent_at)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Statistics */}
                    {campaign.status === 'sent' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-gray-50 dark:bg-neutral-800 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <FaEnvelope className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Recipients</h3>
                                </div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{campaign.recipients_count}</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-neutral-800 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <FaEye className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Open Rate</h3>
                                </div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{getOpenRate()}</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-neutral-800 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <FaMousePointer className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Click Rate</h3>
                                </div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{getClickRate()}</p>
                            </div>
                        </div>
                    )}

                    {/* Email Content */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Email Content</h3>
                        <div className="bg-gray-50 dark:bg-neutral-800 p-4 rounded-lg">
                            <pre className="text-gray-900 dark:text-white whitespace-pre-wrap font-sans text-sm">{campaign.content}</pre>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-6 border-t border-gray-200 dark:border-neutral-800">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Created: {formatDate(campaign.created_at)} • Last updated: {formatDate(campaign.updated_at)}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
