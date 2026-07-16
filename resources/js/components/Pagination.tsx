import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    startIndex?: number;
    endIndex?: number;
    totalItems?: number;
    itemName?: string;
    showPageNumbers?: boolean;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    startIndex,
    endIndex,
    totalItems,
    itemName = 'items',
    showPageNumbers = false,
}: PaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 dark:border-neutral-800">
            {startIndex !== undefined && endIndex !== undefined && totalItems !== undefined ? (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} {itemName}
                </div>
            ) : (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    Page {currentPage} of {totalPages}
                </div>
            )}
            
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                </button>
                
                {showPageNumbers && (
                    <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                className={`w-8 h-8 text-sm font-medium rounded-lg transition-all ${
                                    currentPage === page
                                        ? 'bg-green-500 text-white'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                )}
                
                {!showPageNumbers && (
                    <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
                        Page {currentPage} of {totalPages}
                    </span>
                )}
                
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all"
                >
                    Next
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
