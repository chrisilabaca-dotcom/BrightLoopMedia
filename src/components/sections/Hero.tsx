import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const orbRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || !orbRef.current) return;

        const ctx = gsap.context(() => {
            // Mouse following orb
            const xTo = gsap.quickTo(orbRef.current, "x", { duration: 1.5, ease: "power3" });
            const yTo = gsap.quickTo(orbRef.current, "y", { duration: 1.5, ease: "power3" });

            window.addEventListener("mousemove", (e) => {
                xTo(e.clientX - window.innerWidth / 2);
                yTo(e.clientY - window.innerHeight / 2);
            });

            // Entry animation
            gsap.from(".hero-text-line", {
                y: 100,
                opacity: 0,
                duration: 1.2,
                stagger: 0.1,
                ease: "power4.out",
                delay: 0.2
            });

            gsap.from(".hero-badge", {
                scale: 0.8,
                opacity: 0,
                duration: 1,
                ease: "elastic.out(1, 0.5)"
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden bg-[#030305]">
            {/* 2026 Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />

            {/* Glowing Mouse Follower Orb */}
            <div ref={orbRef} className="absolute left-1/2 top-1/2 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none -translate-x-1/2 -translate-y-1/2" />

            {/* Deep intense background splashes */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-pink-500/15 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />

            <div className="z-10 px-6 container mx-auto mt-20 relative">
                {/* Micro-badge */}
                <div className="hero-badge mx-auto mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-medium tracking-wide text-white/90">2026 Digital Showroom</span>
                </div>

                {/* Liquid Typography */}
                <h1 className="text-6xl md:text-8xl lg:text-[9rem] font-bold tracking-tighter leading-[0.9]">
                    <div className="hero-text-line overflow-hidden p-2">
                        <span className="bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-white/40">Bright Loop</span>
                    </div>
                    <div className="hero-text-line overflow-hidden p-2 -mt-4">
                        <span className="bg-clip-text text-transparent bg-gradient-to-br from-cyan-300 to-blue-600 drop-shadow-[0_0_40px_rgba(56,189,248,0.3)]">Media.</span>
                    </div>
                </h1>

                <div className="hero-text-line mt-12 mb-16 max-w-2xl mx-auto space-y-4">
                    <p className="text-xl md:text-2xl text-white/70 font-light leading-relaxed">
                        We build high-performance websites and AI systems that bring you serious enquiries.
                    </p>
                    <p className="text-lg text-cyan-200/80 font-mono tracking-wider">
                        [ FIXED PRICE. NO WAFFLE. ]
                    </p>
                </div>

                {/* Glassmorphism Actions */}
                <div className="hero-text-line flex flex-col sm:flex-row gap-6 justify-center items-center">
                    <a href="/contact" className="group relative px-8 py-4 rounded-full bg-white text-black font-semibold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center gap-2">
                        <span className="relative z-10">Start a Project</span>
                        <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                        <div className="absolute inset-0 bg-gradient-to-r from-white via-blue-100 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>

                    <a href="#services" className="px-8 py-4 rounded-full bg-white/5 text-white font-medium border border-white/10 backdrop-blur-xl hover:bg-white/10 hover:border-white/20 transition-all">
                        Explore the Tech
                    </a>
                </div>
            </div>

            {/* Fade out to void */}
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#030305] to-transparent pointer-events-none" />
        </section>
    );
}
