import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export function SiteLoader() {
    const loaderRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        // Skip loader on mobile — get straight to content
        const isMobile = window.matchMedia("(hover: none)").matches;
        if (isMobile) {
            setIsComplete(true);
            return;
        }

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                onComplete: () => setIsComplete(true)
            });

            // Initial state
            gsap.set(loaderRef.current, { autoAlpha: 1 });
            gsap.set(".loader-element", { autoAlpha: 0, y: 20 });
            gsap.set(progressRef.current, { scaleX: 0, transformOrigin: "left center" });

            // Entrance — snappier
            tl.to(".loader-element", {
                autoAlpha: 1,
                y: 0,
                duration: 0.4,
                stagger: 0.1,
                ease: "power3.out"
            });

            // Progress bar — fast sweep
            tl.to(progressRef.current, {
                scaleX: 1,
                duration: 0.6,
                ease: "power2.inOut"
            }, "-=0.2");

            // Exit sequence — no pause, immediate
            tl.to(".loader-element", {
                autoAlpha: 0,
                y: -20,
                duration: 0.3,
                stagger: 0.05,
                ease: "power3.in"
            })
                .to(loaderRef.current, {
                    autoAlpha: 0,
                    duration: 0.4,
                    ease: "power2.inOut",
                    backdropFilter: "blur(0px)"
                });

        }, loaderRef);

        return () => ctx.revert();
    }, []);

    if (isComplete) return null;

    return (
        <div
            ref={loaderRef}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#030305] backdrop-blur-xl"
        >
            {/* Background Orbs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-900/20 rounded-full blur-[120px] pointer-events-none loader-element" />

            <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-6">
                <div className="flex items-center gap-4 mb-8 loader-element">
                    <div className="w-12 h-12 rounded-full border border-cyan-500/30 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-cyan-500/10" />
                        <div className="w-6 h-6 rounded-full bg-cyan-400 blur-[2px] animate-pulse" />
                    </div>
                </div>

                <div className="w-full space-y-4 loader-element">
                    <div className="flex justify-between items-end">
                        <span className="text-cyan-400 font-mono text-xs tracking-widest uppercase">Initializing Protocol</span>
                        <span ref={textRef} className="text-white/50 font-mono text-xs">AWAITING CONNECTION</span>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="h-px w-full bg-white/10 relative overflow-hidden rounded-full">
                        <div
                            ref={progressRef}
                            className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-cyan-400 to-cyan-200"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
