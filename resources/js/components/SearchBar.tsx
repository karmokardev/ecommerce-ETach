import { Search } from 'lucide-react';
import { useState } from 'react';

interface SearchBarProps {
    data?: any[];
    searchFields?: string[];
    onFilteredDataChange?: (filteredData: any[]) => void;
    value?: string;
    onChange?: (value: string) => void;
    onSubmit?: (e: React.FormEvent) => void;
    placeholder?: string;
    className?: string;
    showSubmitButton?: boolean;
    submitButtonText?: string;
}

export default function SearchBar({
    data,
    searchFields = ['key', 'value'],
    onFilteredDataChange,
    value: controlledValue,
    onChange: controlledOnChange,
    onSubmit,
    placeholder = 'Search...',
    className = '',
    showSubmitButton = false,
    submitButtonText = 'Search',
}: SearchBarProps) {
    const [internalValue, setInternalValue] = useState('');
    const isControlled = controlledValue !== undefined;
    const searchQuery = isControlled ? controlledValue : internalValue;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        
        if (isControlled && controlledOnChange) {
            controlledOnChange(newValue);
        } else {
            setInternalValue(newValue);
        }

        // Filter data if provided
        if (data && onFilteredDataChange) {
            const filtered = data.filter((item) => {
                return searchFields.some((field) => {
                    const fieldValue = item[field];
                    if (fieldValue !== null && fieldValue !== undefined) {
                        return String(fieldValue).toLowerCase().includes(newValue.toLowerCase());
                    }
                    return false;
                });
            });
            onFilteredDataChange(filtered);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        if (onSubmit) {
            onSubmit(e);
        }
    };

    const content = (
        <>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    placeholder={placeholder}
                    value={searchQuery}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 text-sm transition-all"
                />
            </div>
            {showSubmitButton && (
                <button
                    type="submit"
                    className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                >
                    {submitButtonText}
                </button>
            )}
        </>
    );

    if (showSubmitButton && onSubmit) {
        return (
            <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
                {content}
            </form>
        );
    }

    return <div className={className}>{content}</div>;
}
