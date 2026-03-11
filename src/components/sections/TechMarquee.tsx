import { useEffect } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import useMeasure from "react-use-measure";

// Inline SVG logos — monochrome white for dark theme
const techLogos = [
    {
        name: "React",
        svg: (
            <svg viewBox="-11.5 -10.232 23 20.463" className="h-7 w-auto" fill="currentColor">
                <circle r="2.05" />
                <g stroke="currentColor" strokeWidth="1" fill="none">
                    <ellipse rx="11" ry="4.2" />
                    <ellipse rx="11" ry="4.2" transform="rotate(60)" />
                    <ellipse rx="11" ry="4.2" transform="rotate(120)" />
                </g>
            </svg>
        ),
    },
    {
        name: "Tailwind CSS",
        svg: (
            <svg viewBox="0 0 54 33" className="h-6 w-auto" fill="currentColor">
                <path fillRule="evenodd" d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z" clipRule="evenodd" />
            </svg>
        ),
    },
    {
        name: "Netlify",
        svg: (
            <svg viewBox="0 0 256 226" className="h-7 w-auto" fill="currentColor">
                <path d="M69.181 188.087h-2.417l-12.065-12.065v-2.417l18.444-18.444h12.778l1.704 1.704v12.778zM54.699 51.628v-2.417l12.065-12.065h2.417L87.625 55.59v12.778l-1.704 1.704H73.143z" />
                <path d="M160.906 149.198h-17.552l-1.466-1.466v-41.089c0-7.31-2.873-12.976-11.689-13.174-4.537-.119-9.727 0-15.274.218l-.833.852v53.173l-1.466 1.466H95.074l-1.466-1.466v-70.19l1.466-1.467h39.503c15.354 0 27.795 12.441 27.795 27.795v43.882l-1.466 1.466Z" />
                <path d="M71.677 122.889H1.466L0 121.423V103.83l1.466-1.466h70.211l1.466 1.466v17.593zM254.534 122.889h-70.211l-1.466-1.466V103.83l1.466-1.466h70.211L256 103.83v17.593zM117.876 54.124V1.466L119.342 0h17.593l1.466 1.466v52.658l-1.466 1.466h-17.593zM117.876 223.787v-52.658l1.466-1.466h17.593l1.466 1.466v52.658l-1.466 1.465h-17.593z" />
            </svg>
        ),
    },
    {
        name: "Stripe",
        svg: (
            <svg viewBox="0 0 512 214" className="h-6 w-auto" fill="currentColor">
                <path d="M512 110.08c0-36.409-17.636-65.138-51.342-65.138-33.85 0-54.33 28.73-54.33 64.854 0 42.808 24.179 64.426 58.88 64.426 16.925 0 29.725-3.84 39.396-9.244v-28.445c-9.67 4.836-20.764 7.823-34.844 7.823-13.796 0-26.027-4.836-27.591-21.618h69.547c0-1.85.284-9.245.284-12.658m-70.258-13.511c0-16.071 9.814-22.756 18.774-22.756 8.675 0 17.92 6.685 17.92 22.756zm-90.31-51.627c-13.939 0-22.899 6.542-27.876 11.094l-1.85-8.818h-31.288v165.83l35.555-7.537.143-40.249c5.12 3.698 12.657 8.96 25.173 8.96 25.458 0 48.64-20.48 48.64-65.564-.142-41.245-23.609-63.716-48.498-63.716m-8.534 97.991c-8.391 0-13.37-2.986-16.782-6.684l-.143-52.765c3.698-4.124 8.818-6.968 16.925-6.968 12.942 0 21.902 14.506 21.902 33.137 0 19.058-8.818 33.28-21.902 33.28M241.493 36.551l35.698-7.68V0l-35.698 7.538zm0 10.809h35.698v124.444h-35.698zm-38.257 10.524L200.96 47.36h-30.72v124.444h35.556V87.467c8.39-10.951 22.613-8.96 27.022-7.396V47.36c-4.551-1.707-21.191-4.836-29.582 10.524m-71.112-41.386-34.702 7.395-.142 113.92c0 21.05 15.787 36.551 36.836 36.551 11.662 0 20.195-2.133 24.888-4.693V140.8c-4.55 1.849-27.022 8.391-27.022-12.658V77.653h27.022V47.36h-27.022zM35.982 83.484c0-5.546 4.551-7.68 12.09-7.68 10.808 0 24.461 3.272 35.27 9.103V51.484c-11.804-4.693-23.466-6.542-35.27-6.542C19.2 44.942 0 60.018 0 85.192c0 39.252 54.044 32.995 54.044 49.92 0 6.541-5.688 8.675-13.653 8.675-11.804 0-26.88-4.836-38.827-11.378v33.849c13.227 5.689 26.596 8.106 38.827 8.106 29.582 0 49.92-14.648 49.92-40.106-.142-42.382-54.329-34.845-54.329-50.774" />
            </svg>
        ),
    },
    {
        name: "Claude",
        svg: (
            <svg viewBox="0 0 24 24" className="h-7 w-auto" fill="currentColor">
                <path d="M13.827 3.52h3.603L24 20h-3.603l-6.57-16.48zm-7.258 0h3.767L16.906 20h-3.674l-1.343-3.461H5.017l-1.344 3.46H0L6.57 3.522zm4.132 9.959L8.453 7.687 6.205 13.48H10.7z" />
            </svg>
        ),
    },
    {
        name: "Google",
        svg: (
            <svg viewBox="0 0 24 24" className="h-7 w-auto" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
        ),
    },
    {
        name: "Vite",
        svg: (
            <svg viewBox="0 0 410 404" className="h-7 w-auto" fill="none">
                <path d="M399.641 59.525 215.643 388.545c-3.136 5.614-11.202 5.614-14.337 0L17.309 59.525c-3.527-6.32 2.106-13.76 9.201-12.144L205.846 92.9a8.47 8.47 0 0 0 3.507-.001l178.137-45.52c7.094-1.614 12.726 5.826 9.2 12.146Z" fill="currentColor" fillOpacity="0.6" />
                <path d="m292.965 1.578-127.05 25.6a4.24 4.24 0 0 0-3.384 3.64l-17.764 162.9a4.24 4.24 0 0 0 5.063 4.593l36.576-7.596a4.24 4.24 0 0 1 5.003 5.168l-11.577 56.468a4.24 4.24 0 0 0 5.31 5.04l22.614-6.116a4.24 4.24 0 0 1 5.31 5.04l-18.395 89.772c-.699 3.413 3.818 5.283 5.585 2.313l1.181-1.987 130.1-245.61c1.761-3.324-1.291-7.064-4.89-5.988l-37.413 11.18a4.24 4.24 0 0 1-5.262-4.826l23.624-98.03a4.24 4.24 0 0 0-5.277-4.963l-9.877 2.104Z" fill="currentColor" />
            </svg>
        ),
    },
    {
        name: "TypeScript",
        svg: (
            <svg viewBox="0 0 400 400" className="h-7 w-auto" fill="none">
                <rect width="400" height="400" rx="20" fill="currentColor" fillOpacity="0.15" />
                <path d="M87 208h109v20H151v97h-27v-97H87v-20zm143.1.5c8.3-1 25.1-2.5 39.2.4 10.2 2.1 19.6 6.7 26.2 14.4 5.3 6.3 8.7 14.2 9.8 22.4.7 5.4.4 11-.6 16.3-2.3 12-9.4 21.2-19.8 27.3-5 2.9-10.5 4.9-16.2 6.2l44.4 57.4h-33.2l-39.4-53.6h-7.3V353h-27V209.7l23.9-1.2zm3.1 20.1v51.8c5.3-.1 10.7-.3 15.8-1.6 7.6-1.9 14-6.5 16.9-14 2-5.1 2.2-10.8 1-16.1-1.4-6.3-5.4-11.4-10.8-14.4-6.7-3.8-14.8-5-22.3-5.5l-.6-.2z" fill="currentColor" />
            </svg>
        ),
    },
];

function InfiniteSlider({
    children,
    gap = 16,
    duration = 30,
    reverse = false,
}: {
    children: React.ReactNode;
    gap?: number;
    duration?: number;
    reverse?: boolean;
}) {
    const [ref, { width }] = useMeasure();
    const translation = useMotionValue(0);

    useEffect(() => {
        if (width === 0) return;

        const contentSize = width + gap;
        const from = reverse ? -contentSize / 2 : 0;
        const to = reverse ? 0 : -contentSize / 2;

        const controls = animate(translation, [from, to], {
            ease: "linear",
            duration,
            repeat: Infinity,
            repeatType: "loop",
            repeatDelay: 0,
            onRepeat: () => translation.set(from),
        });

        return () => controls.stop();
    }, [translation, duration, width, gap, reverse]);

    return (
        <div className="overflow-hidden">
            <motion.div
                className="flex w-max"
                style={{ x: translation, gap: `${gap}px` }}
                ref={ref}
            >
                {children}
                {children}
            </motion.div>
        </div>
    );
}

export function TechMarquee() {
    return (
        <section className="py-12 bg-[#030305] relative border-b border-white/5">
            <div className="container mx-auto px-6">
                <div
                    className="flex flex-col md:flex-row items-center gap-8"
                    style={{
                        maskImage:
                            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                        WebkitMaskImage:
                            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                    }}
                >
                    <span className="flex-shrink-0 text-sm font-mono text-white/40 tracking-widest uppercase whitespace-nowrap md:border-r md:border-white/10 md:pr-8">
                        Built with
                    </span>

                    <div className="w-full overflow-hidden">
                        <InfiniteSlider gap={80} duration={25}>
                            {techLogos.map((logo) => (
                                <div
                                    key={logo.name}
                                    className="flex items-center gap-3 text-white/40 hover:text-white/80 transition-colors duration-300 flex-shrink-0"
                                >
                                    {logo.svg}
                                    <span className="text-sm font-medium tracking-wide whitespace-nowrap">
                                        {logo.name}
                                    </span>
                                </div>
                            ))}
                        </InfiniteSlider>
                    </div>
                </div>
            </div>
        </section>
    );
}
