import { Head } from '@inertiajs/react';
import HeroSection from '../components/Hero/herosection';
import FeaturedProduct from './Frontend/FeaturedProducts/featuredProduct';
import ProductSection from './Frontend/ProducrtSection/Product';
import FlashDealBanner from '../components/FlashDealBanner';

interface SliderImage {
    id?: number;
    image: string;
}

interface HeroSettings {
    slider_images?: SliderImage[];
    slider_enabled?: string;
    auto_slide_interval?: number;
}

interface Props {
    heroSettings?: HeroSettings;
}

export default function Home({ heroSettings }: Props) {
    return (
        <>
            <Head title="Home" />
            <HeroSection settings={heroSettings} />
            <FlashDealBanner />
            <ProductSection />
            <FeaturedProduct />
        </>
    );
}
