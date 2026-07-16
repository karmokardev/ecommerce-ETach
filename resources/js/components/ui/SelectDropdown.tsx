import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface SelectOption {
    id: number;
    name: string;
}

interface SelectDropdownProps {
    categories: SelectOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function SelectDropdown({ 
    categories, 
    value, 
    onChange, 
    placeholder = "All Categories" 
}: SelectDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedCategory = categories.find(cat => cat.id.toString() === value);
    const displayValue = selectedCategory ? selectedCategory.name : placeholder;

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleSelect = (categoryId: string) => {
        onChange(categoryId);
        setIsOpen(false);
    };

    return (
        <div ref={dropdownRef} className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="px-3 py-3 text-sm border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 flex items-center justify-between min-w-[180px] text-left"
            >
                <span className="truncate">{displayValue}</span>
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <div className="py-1">
                        <button
                            type="button"
                            onClick={() => handleSelect('')}
                            className={`w-full px-3 py-2 text-sm text-left flex items-center justify-between hover:bg-gray-100 dark:hover:bg-neutral-700 text-gray-900 dark:text-gray-100 ${
                                value === '' ? 'bg-gray-100 dark:bg-neutral-700' : ''
                            }`}
                        >
                            <span>{placeholder}</span>
                            {value === '' && <Check className="w-4 h-4 text-blue-500" />}
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => handleSelect(cat.id.toString())}
                                className={`w-full px-3 py-2 text-sm text-left flex items-center justify-between hover:bg-gray-100 dark:hover:bg-neutral-700 text-gray-900 dark:text-gray-100 ${
                                    value === cat.id.toString() ? 'bg-gray-100 dark:bg-neutral-700' : ''
                                }`}
                            >
                                <span className="truncate">{cat.name}</span>
                                {value === cat.id.toString() && <Check className="w-4 h-4 text-blue-500" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
