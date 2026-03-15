import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";

export function useLenis() {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        // Only run on client
        if (typeof window === "undefined") return;

        // Skip on touch devices — native scroll is already smooth and
        // hardware-accelerated. Lenis hijacking touch events adds latency.
        if (window.matchMedia("(hover: none)").matches) return;

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 1,
        });

        lenisRef.current = lenis;

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    return lenisRef;
}
