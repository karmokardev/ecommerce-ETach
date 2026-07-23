import { Head, router } from '@inertiajs/react';
import { FaEdit, FaTrash, FaPlus, FaEye, FaPaperPlane, FaBan } from "react-icons/fa";
import { useState } from 'react';
import DeleteModal from '@/components/DeleteModal';
import SearchBar from '@/components/SearchBar';
import StatusFilter from '@/components/StatusFilter';
import { toast } from 'sonner';

interface EmailCampaign {
    id: number;
    name: string;
    subject: string;
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

interface EmailCampaignsProps {
    campaigns: {
        data: EmailCampaign[];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
    };
    filters: {
        search: string;
        status: string;
        type: string;
    };
}

export default function EmailCampaigns({ campaigns, filters }: EmailCampaignsProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [typeFilter, setTypeFilter] = useState(filters.type || '');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [campaignToDelete, setCampaignToDelete] = useState<number | null>(null);

    const handleEdit = (campaignId: number) => {
        router.get(`/email-campaigns/${campaignId}/edit`);
    };

    const handleView = (campaignId: number) => {
        router.get(`/email-campaigns/${campaignId}`);
    };

    const handleDeleteClick = (campaignId: number) => {
        setCampaignToDelete(campaignId);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (campaignToDelete) {
            router.delete(`/email-campaigns/${campaignToDelete}`, {
                onSuccess: () => {
                    toast.success('Email campaign deleted successfully');
                    setDeleteModalOpen(false);
                    setCampaignToDelete(null);
                },
                onError: () => {
                    toast.error('Failed to delete email campaign');
                },
            });
        }
    };

    const navigate = (overrides: Partial<{ search: string; status: string; type: string; page: number }> = {}) => {
        router.get('/email-campaigns', {
            search: searchTerm,
            status: statusFilter,
            type: typeFilter,
            page: 1,
            ...overrides,
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        navigate({ page: 1 });
    };

    const handleStatusChange = (value: string) => {
        setStatusFilter(value);
        navigate({ status: value, page: 1 });
    };

    const handleTypeChange = (value: string) => {
        setTypeFilter(value);
        navigate({ type: value, page: 1 });
    };

    const handlePageChange = (page: number) => {
        navigate({ page });
    };

    const handleSend = (campaignId: number) => {
        router.post(`/email-campaigns/${campaignId}/send`, {}, {
            onSuccess: () => {
                toast.success('Email campaign sent successfully');
            },
            onError: () => {
                toast.error('Failed to send email campaign');
            },
        });
    };

    const handleCancel = (campaignId: number) => {
        router.post(`/email-campaigns/${campaignId}/cancel`, {}, {
            onSuccess: () => {
                toast.success('Email campaign cancelled successfully');
            },
            onError: () => {
                toast.error('Failed to cancel email campaign');
            },
        });
    };

    const formatDate = (date: string | null) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleString();
    };

    const getOpenRate = (opened: number, total: number) => {
        if (total === 0) return '0%';
        return `${((opened / total) * 100).toFixed(1)}%`;
    };

    const getClickRate = (clicked: number, total: number) => {
        if (total === 0) return '0%';
        return `${((clicked / total) * 100).toFixed(1)}%`;
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
            <Head title="Email Campaigns Management" />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold dark:text-white">Email Campaigns Management</h1>

                    <div className="flex items-center gap-4">
                        <SearchBar
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="Search campaigns..."
                            showSubmitButton={true}
                            submitButtonText="Search"
                            onSubmit={handleSearch}
                        />
                        <StatusFilter
                            value={statusFilter}
                            onChange={handleStatusChange}
                            options={[
                                { value: '', label: 'All Status' },
                                { value: 'draft', label: 'Draft' },
                                { value: 'scheduled', label: 'Scheduled' },
                                { value: 'sent', label: 'Sent' },
                                { value: 'cancelled', label: 'Cancelled' },
                            ]}
                        />
                        <select
                            value={typeFilter}
                            onChange={(e) => handleTypeChange(e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-neutral-800"
                        >
                            <option value="">All Types</option>
                            <option value="order_confirmation">Order Confirmation</option>
                            <option value="promotional">Promotional</option>
                            <option value="newsletter">Newsletter</option>
                            <option value="abandoned_cart">Abandoned Cart</option>
                        </select>
                        <button
                            onClick={() => router.get('/email-campaigns/create')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                            <FaPlus />
                            Create Campaign
                        </button>
                    </div>
                </div>

                {/* Table View */}
                <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-neutral-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Subject</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recipients</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Open Rate</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Click Rate</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Scheduled/Sent</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-neutral-800">
                                {campaigns.data && campaigns.data.length > 0 ? (
                                    campaigns.data.map((campaign) => (
                                        <tr key={campaign.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{campaign.name}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900 dark:text-gray-100 truncate max-w-xs">{campaign.subject}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                                    {getTypeLabel(campaign.type)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(campaign.status)}`}>
                                                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                {campaign.recipients_count}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                {getOpenRate(campaign.opened_count, campaign.recipients_count)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                {getClickRate(campaign.clicked_count, campaign.recipients_count)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {formatDate(campaign.scheduled_at || campaign.sent_at)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                <button
                                                    onClick={() => handleView(campaign.id)}
                                                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mr-2 transition-colors"
                                                    title="View"
                                                >
                                                    <FaEye className="w-4 h-4" />
                                                </button>
                                                {(campaign.status === 'draft' || campaign.status === 'scheduled') && (
                                                    <button
                                                        onClick={() => handleSend(campaign.id)}
                                                        className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 mr-2 transition-colors"
                                                        title="Send Now"
                                                    >
                                                        <FaPaperPlane className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {campaign.status === 'scheduled' && (
                                                    <button
                                                        onClick={() => handleCancel(campaign.id)}
                                                        className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 mr-2 transition-colors"
                                                        title="Cancel"
                                                    >
                                                        <FaBan className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {campaign.status === 'draft' && (
                                                    <button
                                                        onClick={() => handleEdit(campaign.id)}
                                                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mr-2 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <FaEdit className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteClick(campaign.id)}
                                                    className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                                    title="Delete"
                                                >
                                                    <FaTrash className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={9} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                            No email campaigns found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {campaigns.last_page > 1 && (
                        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 dark:border-neutral-800">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Showing {campaigns.from} to {campaigns.to} of {campaigns.total} campaigns
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handlePageChange(campaigns.current_page - 1)}
                                    disabled={campaigns.current_page === 1}
                                    className="px-3 py-1 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
                                    Page {campaigns.current_page} of {campaigns.last_page}
                                </span>
                                <button
                                    onClick={() => handlePageChange(campaigns.current_page + 1)}
                                    disabled={campaigns.current_page === campaigns.last_page}
                                    className="px-3 py-1 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <DeleteModal
                    open={deleteModalOpen}
                    onClose={() => {
                        setDeleteModalOpen(false);
                        setCampaignToDelete(null);
                    }}
                    onConfirm={handleDeleteConfirm}
                    title="Delete Email Campaign"
                    message="Are you sure you want to delete this email campaign? This action cannot be undone."
                />
            </div>
        </>
    );
}
