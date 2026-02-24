import { SEO } from "../components/ui/SEO";
import { siteData } from "../content/site";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

gsap.registerPlugin(ScrollTrigger);

export function HowItWorks() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate the vertical line drawing down
            gsap.fromTo(".journey-line",
                { scaleY: 0 },
                {
                    scaleY: 1,
                    transformOrigin: "top center",
                    ease: "none",
                    scrollTrigger: {
                        trigger: ".journey-container",
                        start: "top 60%",
                        end: "bottom 80%",
                        scrub: 1
                    }
                }
            );

            // Animate each step fading and sliding in
            gsap.utils.toArray<HTMLElement>('.journey-step').forEach((step, i) => {
                gsap.from(step, {
                    x: i % 2 === 0 ? 50 : -50,
                    opacity: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: step,
                        start: "top 80%",
                    }
                });
            });

        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="bg-[#030305] min-h-screen pt-32 pb-32 relative overflow-hidden">
            <SEO
                title="How It Works | Our Delivery Process | Bright Loop Media"
                url="https://brightloop.co.uk/how-it-works"
                description="See how Bright Loop Media plans, builds, launches, and supports practical digital systems."
            />

            {/* Custom Background Splashes for Personality (Purple/Magenta tone to contrast the Cyan) */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-900/15 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-1/4 left-0 w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-[160px] pointer-events-none" />

            <div className="container mx-auto px-6 max-w-5xl relative z-10">
                <div className="text-center mb-24">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight">
                        How It Works
                    </h1>
                    <p className="text-xl md:text-2xl text-white/70 font-light max-w-2xl mx-auto">
                        A simple, repeatable delivery process. We focus on clear scopes and rapid execution.
                    </p>
                </div>

                {/* The Journey Section */}
                <div className="relative journey-container mb-32">
                    {/* The Central Line */}
                    <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-px bg-white/10 md:-translate-x-1/2" />
                    <div className="journey-line absolute left-[28px] md:left-1/2 top-0 bottom-0 w-[3px] bg-gradient-to-b from-purple-500 via-cyan-400 to-transparent md:-translate-x-1/2" />

                    <div className="space-y-12 md:space-y-24">
                        {siteData.process.map((step, idx) => (
                            <div key={idx} className={`journey-step relative flex flex-col md:flex-row items-center gap-8 md:gap-16 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>

                                {/* Timeline Dot */}
                                <div className="absolute left-[28px] md:left-1/2 w-6 h-6 rounded-full bg-[#030305] border-[4px] border-cyan-400 md:-translate-x-1/2 shadow-[0_0_15px_rgba(34,211,238,0.5)] z-10 transform -translate-x-1/2 md:translate-x-0" />

                                {/* Content Box */}
                                <div className={`w-full md:w-1/2 pl-16 md:pl-0 ${idx % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'}`}>
                                    <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl group hover:border-purple-500/30 transition-colors">
                                        <div className="text-sm font-mono text-purple-400 mb-2">Step 0{step.step}</div>
                                        <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                                        <p className="text-white/70 leading-relaxed">{step.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Expectations & Ownership */}
                <div className="grid md:grid-cols-2 gap-12 mb-24">
                    <div className="p-8 rounded-[2rem] bg-gradient-to-br from-cyan-900/20 to-transparent border border-white/10 backdrop-blur-xl">
                        <h3 className="text-3xl font-bold mb-6 text-white tracking-tight">Ownership & Handover</h3>
                        <p className="text-white/70 mb-4 leading-relaxed">
                            You own your content and the final website build. At handover we provide source code, usage guides, and admin access to everything we configure.
                        </p>
                        <ul className="space-y-3 text-white/60">
                            <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-cyan-400" /> Full source code access</li>
                            <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-cyan-400" /> Software subscriptions in your name</li>
                            <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-cyan-400" /> Optional ongoing support tier</li>
                        </ul>
                    </div>

                    <div className="p-8 rounded-[2rem] bg-gradient-to-br from-purple-900/20 to-transparent border border-white/10 backdrop-blur-xl">
                        <h3 className="text-3xl font-bold mb-6 text-white tracking-tight">Scope & Speed</h3>
                        <p className="text-white/70 mb-4 leading-relaxed">
                            All work is delivered with fixed scope. Fast delivery depends on fast inputs. Change requests outside scope are quoted separately before work starts.
                        </p>
                        <p className="text-white/60">
                            Ongoing support is entirely optional and separated from setup costs. It covers bug fixes, minor improvements, and system tuning.
                        </p>
                    </div>
                </div>

                <div className="text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-8 text-white">Ready to begin?</h2>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/contact">
                            <a className="px-8 py-4 rounded-full bg-white text-black font-bold hover:scale-105 transition-transform">
                                Book a Discovery Call
                            </a>
                        </Link>
                        <Link href="/packages">
                            <a className="px-8 py-4 rounded-full bg-white/10 text-white font-bold hover:bg-white/20 transition-colors">
                                View Packages
                            </a>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
