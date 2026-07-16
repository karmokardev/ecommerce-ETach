import { Filter } from 'lucide-react';

interface StatusOption {
    value: string;
    label: string;
}

interface StatusFilterProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
    showAllOption?: boolean;
    allOptionLabel?: string;
    options?: StatusOption[];
}

export default function StatusFilter({
    value,
    onChange,
    className = '',
    showAllOption = true,
    allOptionLabel = 'All Status',
    options,
}: StatusFilterProps) {
    const defaultOptions: StatusOption[] = [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
    ];

    const statusOptions = options || defaultOptions;

    return (
        <div className={`relative ${className}`}>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 text-sm appearance-none cursor-pointer transition-all"
            >
                {showAllOption && <option value="">{allOptionLabel}</option>}
                {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <svg
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                />
            </svg>
        </div>
    );
}
