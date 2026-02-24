import { SEO } from "../components/ui/SEO";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function About() {
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".about-card", {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".about-container",
                    start: "top 80%",
                }
            });
            gsap.from(".value-card", {
                y: 30,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: ".values-container",
                    start: "top 85%",
                }
            });
        });
        return () => ctx.revert();
    }, []);
    return (
        <div className="bg-[#030305] min-h-screen pt-32 pb-24 relative overflow-hidden">
            <SEO
                title="About Us | Meet Chris and Matthew | Bright Loop Media"
                url="https://brightloop.co.uk/about"
                description="Bright Loop Media is a web development agency based on the Wirral, run by Chris Ilabaca and Matthew Murphy. Direct founder access on every project."
            />

            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10 max-w-4xl">
                <div className="text-center mb-20">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
                        About Bright Loop Media
                    </h1>
                    <p className="text-2xl text-white/70 font-light leading-relaxed">
                        We lead with clarity and confidence, not agency jargon. We stay hands-on, avoid bloated retainers and fluff, and deliver outcomes you can actually measure.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 mb-24 about-container">
                    <div className="about-card p-8 rounded-[2rem] bg-gradient-to-br from-white/10 to-transparent border border-white/10 backdrop-blur-xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <h3 className="text-3xl font-bold mb-2 text-white relative z-10">Chris Ilabaca</h3>
                        <p className="text-cyan-400 font-mono text-sm mb-6 relative z-10">Operations & Strategy</p>
                        <p className="text-white/70 leading-relaxed relative z-10">
                            Leads operations, governance, coordination, delivery oversight, and strategic direction. Acts as the link between sales and delivery.
                        </p>
                    </div>

                    <div className="p-8 rounded-[2rem] bg-gradient-to-br from-white/10 to-transparent border border-white/10 backdrop-blur-xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <h3 className="text-3xl font-bold mb-2 text-white relative z-10">Matthew Murphy</h3>
                        <p className="text-cyan-400 font-mono text-sm mb-6 relative z-10">Technical Delivery</p>
                        <p className="text-white/70 leading-relaxed relative z-10">
                            Leads technical delivery including website development, AI integration, automation, and internal systems.
                        </p>
                    </div>
                </div>

                <h2 className="text-4xl font-bold mb-12 text-center text-white">Our Values</h2>
                <div className="grid md:grid-cols-2 gap-6 values-container">
                    <div className="value-card p-6 rounded-[1.5rem] bg-white/5 border border-white/5">
                        <h4 className="text-xl font-bold mb-2 text-cyan-300">Clarity Over Complexity</h4>
                        <p className="text-white/60">We explain things in plain English. If we can't explain it simply, we probably don't understand it well enough.</p>
                    </div>
                    <div className="p-6 rounded-[1.5rem] bg-white/5 border border-white/5">
                        <h4 className="text-xl font-bold mb-2 text-cyan-300">Outcomes Over Hours</h4>
                        <p className="text-white/60">We sell packages based on what you'll get, not how long it takes. You know exactly what you're paying for.</p>
                    </div>
                    <div className="p-6 rounded-[1.5rem] bg-white/5 border border-white/5">
                        <h4 className="text-xl font-bold mb-2 text-cyan-300">Honesty Over Sales</h4>
                        <p className="text-white/60">If we're not the right fit, we'll tell you. We'd rather give honest advice than make a quick sale.</p>
                    </div>
                    <div className="p-6 rounded-[1.5rem] bg-white/5 border border-white/5">
                        <h4 className="text-xl font-bold mb-2 text-cyan-300">Systems Over Heroics</h4>
                        <p className="text-white/60">We build repeatable processes so your business doesn't depend on any single person working overtime.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
