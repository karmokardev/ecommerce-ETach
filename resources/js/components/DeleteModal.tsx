type Props = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
};

export default function DeleteModal({
    open,
    onClose,
    onConfirm,
    title = "Are you sure?",
    message = "You want to delete this item!",
}: Props) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

            {/* Modal */}
            <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-xl">

                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                        <span className="text-red-600 dark:text-red-400 text-3xl">!</span>
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-xl font-semibold text-center text-gray-900 dark:text-gray-100">
                    {title}
                </h2>

                {/* Message */}
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
                    {message}
                </p>

                {/* Buttons */}
                <div className="flex justify-center gap-4 mt-6">

                    <button
                        onClick={onClose}
                        className="px-5 py-2 rounded-lg bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-neutral-600 transition"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="px-5 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600 transition"
                    >
                        Yes, Delete it!
                    </button>
                </div>
            </div>
        </div>
    );
}
