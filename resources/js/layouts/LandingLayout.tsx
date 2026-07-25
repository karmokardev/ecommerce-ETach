import Footer from "@/components/Footer/footer";
import Navbar from "@/components/Navbar/navbar";

interface LandingLayoutProps {
    children: React.ReactNode;
}

export default function LandingLayout({ children }: LandingLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar/>
            <div className="">
                {children}
            </div>
            <Footer />
        </div>
    );
}
