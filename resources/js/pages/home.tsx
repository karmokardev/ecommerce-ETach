import { Head, usePage } from '@inertiajs/react';

export default function Home() {
    const page = usePage();

    return (
        <>
            <Head title="Home" />
            <div className="">
               <h1>Home</h1>
            </div>
        </>
    );
}
