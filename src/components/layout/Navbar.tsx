import { Link } from "wouter";

export function Navbar() {

    return (
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
            <div className="flex items-center gap-6 px-8 py-3.5 rounded-full bg-[#030305] border-b-2 border-cyan-500 shadow-[0_10px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(34,211,238,0.2)] text-white font-medium">
                <Link href="/" className="hover:text-white/70 transition-colors">
                    Home
                </Link>
                <Link href="/services" className="hover:text-white/70 transition-colors">
                    Services
                </Link>
                <Link href="/packages" className="hover:text-white/70 transition-colors">
                    Packages
                </Link>
                <Link href="/how-it-works" className="hover:text-white/70 transition-colors">
                    How it Works
                </Link>
                <Link href="/about" className="hover:text-white/70 transition-colors">
                    About
                </Link>
                <Link href="/contact" className="bg-white text-black px-4 py-1.5 rounded-full font-semibold hover:bg-white/90 transition-colors">
                    Enquire
                </Link>
            </div>
        </nav>
    );
}
