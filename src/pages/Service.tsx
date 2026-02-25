import { useRoute, useLocation } from "wouter";
import { siteData } from "../content/site";
import { SEO } from "../components/ui/SEO";
import { ArrowLeft, ArrowRight, Zap } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

export function Service() {
    const [match, params] = useRoute("/services/:id");
    const [, setLocation] = useLocation();
    const containerRef = useRef<HTMLDivElement>(null);

    if (!match || !params) return null;

    const service = siteData.services.find(s => s.id === params.id) as any;

    // If the service is not found, or it's helloflint (which should be external), redirect to home
    if (!service || service.id === "helloflint") {
        setLocation("/");
        return null;
    }

    const validServices = siteData.services.filter(s => s.id !== "helloflint");
    const currentIndex = validServices.findIndex(s => s.id === params.id);
    const prevService = validServices[(currentIndex - 1 + validServices.length) % validServices.length];
    const nextService = validServices[(currentIndex + 1) % validServices.length];

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate headers
            gsap.from(".hero-text", {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out"
            });

            // Animate implementation journey line
            gsap.fromTo(".svc-line",
                { scaleY: 0 },
                {
                    scaleY: 1,
                    transformOrigin: "top center",
                    ease: "none",
                    scrollTrigger: {
                        trigger: ".svc-journey",
                        start: "top 60%",
                        end: "bottom 80%",
                        scrub: 1
                    }
                }
            );

            // Animate journey steps
            gsap.utils.toArray<HTMLElement>('.svc-step').forEach((step, i) => {
                gsap.from(step, {
                    x: -50,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: step,
                        start: "top 85%",
                    }
                });
            });

            // Animate use cases
            gsap.from(".use-case-card", {
                y: 30,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: ".use-case-grid",
                    start: "top 80%",
                }
            });
        }, containerRef);
        return () => ctx.revert();
    }, [service.id]);

    return (
        <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo({ top: 0, left: 0, behavior: "instant" })}>
            <motion.div
                key={service.id}
                ref={containerRef}
                initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -40, filter: "blur(10px)" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="bg-[#030305] min-h-screen pt-32 pb-24 relative overflow-hidden"
            >
                <SEO
                    title={`${service.title} | Bright Loop Media`}
                    url={`https://brightloop.co.uk/services/${service.id}`}
                    description={service.description}
                />

                {/* High-Intensity Background Splashes for Personality */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-500/15 rounded-full blur-[150px] pointer-events-none" />
                <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-1/4 right-0 w-[900px] h-[900px] bg-pink-500/10 rounded-full blur-[160px] pointer-events-none" />

                <div className="container mx-auto px-6 relative z-10 max-w-5xl">
                    <button
                        onClick={() => setLocation("/")}
                        className="group flex items-center gap-2 text-cyan-400 font-mono text-sm tracking-widest uppercase mb-12 hover:text-cyan-300 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Protocol
                    </button>

                    <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white leading-tight hero-text">
                        {service.title}
                    </h1>

                    <p className="text-2xl text-white/70 font-light leading-relaxed mb-16 max-w-3xl hero-text">
                        {service.description}
                    </p>

                    {/* Primary CTA Block */}
                    <div className="p-10 rounded-[2.5rem] bg-gradient-to-r from-cyan-900/40 to-blue-900/20 border border-cyan-500/20 backdrop-blur-xl relative overflow-hidden mb-24 hero-text">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/10 blur-[80px] rounded-full pointer-events-none" />
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div>
                                <h3 className="text-3xl font-bold mb-3 text-white">Start the Protocol</h3>
                                <p className="text-white/70 max-w-xl">
                                    The reality of running a small business is that you simply don't have time to manage everything manually. Convert more visitors into high-quality enquiries with zero extra effort on your end.
                                </p>
                            </div>
                            <a
                                href="/contact"
                                className="shrink-0 px-8 py-4 rounded-full bg-cyan-400 text-black font-bold hover:bg-cyan-300 transition-colors shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:shadow-[0_0_50px_rgba(34,211,238,0.5)]"
                            >
                                Discuss Your Project
                            </a>
                        </div>
                    </div>

                    {/* Use Cases Grid */}
                    {service.useCases && (
                        <div className="mb-32">
                            <div className="text-center mb-12">
                                <h2 className="text-sm font-mono text-cyan-400 tracking-widest uppercase mb-4">Who is this for?</h2>
                                <h3 className="text-4xl font-bold text-white">Common Use Cases</h3>
                            </div>
                            <div className="use-case-grid grid md:grid-cols-3 gap-6">
                                {service.useCases.map((useCase: string, idx: number) => (
                                    <div key={idx} className="use-case-card p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-colors">
                                        <Zap className="w-6 h-6 text-cyan-400 mb-6" />
                                        <p className="text-white/80 leading-relaxed">{useCase}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Implementation Journey */}
                    {service.implementation && (
                        <div className="mb-24">
                            <div className="text-center mb-16">
                                <h2 className="text-sm font-mono text-purple-400 tracking-widest uppercase mb-4">The Process</h2>
                                <h3 className="text-4xl font-bold text-white">How It's Implemented</h3>
                            </div>

                            <div className="relative svc-journey max-w-3xl mx-auto pl-8 md:pl-0">
                                {/* Vertical Line */}
                                <div className="absolute left-[15px] md:left-[23px] top-6 bottom-6 w-px bg-white/10" />
                                <div className="svc-line absolute left-[15px] md:left-[23px] top-6 bottom-6 w-px bg-gradient-to-b from-cyan-400 to-purple-500" />

                                <div className="space-y-12">
                                    {service.implementation.map((imp: any, idx: number) => (
                                        <div key={idx} className="svc-step relative pl-12 md:pl-20">
                                            <div className="absolute left-0 top-1.5 w-8 h-8 rounded-full bg-[#030305] border-2 border-cyan-400 flex items-center justify-center -translate-x-1/2 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                                                <span className="text-xs font-bold text-cyan-400">{idx + 1}</span>
                                            </div>
                                            <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl group hover:border-white/20 transition-colors">
                                                <h4 className="text-2xl font-bold text-white mb-3">{imp.step}</h4>
                                                <p className="text-white/60 leading-relaxed">{imp.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Service Navigation */}
                    <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-white/10 pt-16 hero-text">
                        <button onClick={() => setLocation(`/services/${prevService.id}`)} className="group flex flex-col items-start gap-2 hover:bg-white/5 p-6 rounded-3xl transition-colors w-full sm:w-1/2 text-left border border-transparent hover:border-white/10">
                            <span className="text-sm font-mono text-white/50 tracking-widest uppercase flex items-center gap-2">
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                Previous Protocol
                            </span>
                            <span className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">{prevService.title}</span>
                        </button>

                        <button onClick={() => setLocation(`/services/${nextService.id}`)} className="group flex flex-col items-end gap-2 hover:bg-white/5 p-6 rounded-3xl transition-colors w-full sm:w-1/2 text-right border border-transparent hover:border-white/10">
                            <span className="text-sm font-mono text-white/50 tracking-widest uppercase flex items-center gap-2">
                                Next Protocol
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <span className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">{nextService.title}</span>
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
