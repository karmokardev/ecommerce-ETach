import React from 'react';
import { Share2 } from 'lucide-react';

interface ShareButtonProps {
    size?: 'sm' | 'md' | 'lg';
    onShare?: () => void;
}

const ShareButton: React.FC<ShareButtonProps> = ({
    size = 'md',
    onShare,
}) => {
    const handleShare = async () => {
        if (onShare) {
            onShare();
            return;
        }

        // Default share functionality using Web Share API if available
        if (navigator.share) {
            try {
                await navigator.share({
                    title: document.title,
                    url: window.location.href,
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            // Fallback: copy URL to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-8 h-8',
        lg: 'w-10 h-10',
    };

    const iconSizes = {
        sm: 14,
        md: 15,
        lg: 18,
    };

    return (
        <button
            onClick={handleShare}
            aria-label="Share"
            className={`
                rounded-full bg-white flex items-center justify-center 
                text-neutral-700 hover:text-neutral-900 transition-colors
                ${sizeClasses[size]}
            `}
        >
            <Share2 size={iconSizes[size]} />
        </button>
    );
};

export default ShareButton;
