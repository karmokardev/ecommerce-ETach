import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { Heart } from 'lucide-react';

const WishlistIcon: React.FC = () => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        fetchWishlistCount();
    }, []);

    const fetchWishlistCount = async () => {
        try {
            const response = await fetch('/wishlist/count');
            const data = await response.json();
            setCount(data.count);
        } catch (error) {
            console.error('Error fetching wishlist count:', error);
        }
    };

    return (
        <Link
            href="/wishlist"
            className="relative p-2 rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors"
            title="Wishlist"
        >
            <Heart size={20} className="text-gray-600 dark:text-gray-300" />
            {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {count > 9 ? '9+' : count}
                </span>
            )}
        </Link>
    );
};

export default WishlistIcon;
