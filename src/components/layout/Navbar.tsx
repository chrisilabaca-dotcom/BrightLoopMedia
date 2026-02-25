import { Link } from "wouter";

export function Navbar() {

    return (
        <nav className="fixed top-0 left-0 w-full z-50 pointer-events-auto bg-[#030305]/95 backdrop-blur-2xl border-b border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
            <div className="container mx-auto px-6 h-20 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-white font-medium">
                <Link href="/" className="hover:text-cyan-400 transition-colors">
                    Home
                </Link>
                <Link href="/services" className="hover:text-cyan-400 transition-colors">
                    Services
                </Link>
                <Link href="/packages" className="hover:text-cyan-400 transition-colors">
                    Packages
                </Link>
                <Link href="/how-it-works" className="hover:text-cyan-400 transition-colors">
                    How it Works
                </Link>
                <Link href="/about" className="hover:text-cyan-400 transition-colors">
                    About
                </Link>
                <Link href="/contact" className="bg-white text-black px-5 py-2 rounded-full font-bold hover:bg-cyan-400 transition-colors ml-4 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                    Enquire
                </Link>
            </div>
        </nav>
    );
}
