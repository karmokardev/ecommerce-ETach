import { usePage } from '@inertiajs/react';

export default function AppLogo() {
    const { settings } = usePage<{ settings: { logo: string } }>().props;

    return (
        <>
            {settings?.logo ? (
                <img 
                    src={settings.logo} 
                    alt="Logo" 
                    className="size-8 rounded-md object-contain"
                />
            ) : (
                <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary/20 text-sidebar-primary-foreground">
                    <span className="text-lg font-bold text-white dark:text-black">H</span>
                </div>
            )}
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    Hridoy
                </span>
            </div>
        </>
    );
}
