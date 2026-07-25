import { Head } from '@inertiajs/react';
import Navbar from '../components/Navbar/navbar';
import Footer from '../components/Footer/footer';
import HeroSection from '../components/Hero/herosection';

export default function Home() {
    return (
        <>
            <Head title="Home" />
            <HeroSection />
        </>
    );
}
