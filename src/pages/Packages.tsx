import { SEO } from "../components/ui/SEO";
import { Pricing } from "../components/sections/Pricing";
import { siteData } from "../content/site";
import { Plus, CheckCircle2 } from "lucide-react";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Packages() {
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".pkg-card", {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".pkg-container",
                    start: "top 80%",
                }
            });
        });
        return () => ctx.revert();
    }, []);
    return (
        <div className="bg-[#030305] min-h-screen pt-32 pb-24 relative overflow-hidden">
            <SEO
                title="Website Packages & Pricing | Bright Loop Media"
                url="https://brightloop.co.uk/packages"
                description="Compare our fixed-price website and digital systems packages. Transparent pricing, clear scope, and ongoing managed hosting with no hidden costs."
            />

            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10 max-w-5xl">
                <div className="text-center mb-20">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
                        Website Packages
                    </h1>
                    <p className="text-2xl text-white/70 font-light max-w-2xl mx-auto">
                        No hidden costs, no lock ins. Setup fee plus managed hosting and support, paid monthly.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-24">
                    <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl group hover:border-cyan-500/30 transition-colors">
                        <h3 className="text-xl font-bold mb-4 text-cyan-400">1. Setup Fee</h3>
                        <p className="text-white/70 leading-relaxed">
                            One time payment to build your website. Split 50% to start and 50% before launch.
                        </p>
                    </div>
                    <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl group hover:border-cyan-500/30 transition-colors">
                        <h3 className="text-xl font-bold mb-4 text-cyan-400">2. Managed Hosting & Support</h3>
                        <p className="text-white/70 leading-relaxed">
                            Monthly fee covering hosting, security, backups, monitoring, fixes, and a support allowance.
                        </p>
                    </div>
                    <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl group hover:border-cyan-500/30 transition-colors">
                        <h3 className="text-xl font-bold mb-4 text-cyan-400">3. No Lock ins</h3>
                        <p className="text-white/70 leading-relaxed">
                            Cancel with 30 days notice. Buyout option available if you want to self host.
                        </p>
                    </div>
                </div>

                {/* Managed Packages Grid */}
                <div className="mb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-sm font-mono text-cyan-400 tracking-widest uppercase mb-4">Standard Delivery</h2>
                        <h3 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">Managed Packages</h3>
                        <p className="text-xl text-white/60">Choose the structure that supports your business goals.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pkg-container">
                        {siteData.packages.websiteManaged.filter(pkg => pkg.id !== "enterprise").map((pkg) => (
                            <div
                                key={pkg.id}
                                className={`pkg-card p-8 rounded-[2rem] border transition-transform hover:-translate-y-2 flex flex-col h-full ${pkg.popular ? 'bg-gradient-to-b from-cyan-900/40 to-white/5 border-cyan-500/40 shadow-[0_0_30px_rgba(34,211,238,0.15)] relative' : 'bg-[#050508]/60 border-white/10 hover:border-white/20'}`}
                            >
                                {pkg.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-cyan-400 rounded-full text-xs font-bold text-black shadow-lg">
                                        Popular
                                    </div>
                                )}
                                <h4 className="text-2xl font-bold mb-1">{pkg.name}</h4>
                                <p className="text-sm text-cyan-200/60 font-mono mb-8">{pkg.description}</p>

                                <div className="space-y-4 mb-8">
                                    <div>
                                        <p className="text-sm text-white/50 mb-1">Setup Fee</p>
                                        <p className="text-2xl font-bold">{pkg.setupFee}</p>
                                    </div>
                                    <div className="flex justify-center"><Plus className="w-4 h-4 text-white/20" /></div>
                                    <div>
                                        <p className="text-sm text-white/50 mb-1">Managed Hosting</p>
                                        <p className="text-xl text-cyan-400 font-bold">{pkg.monthlyFee}</p>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-8 flex-grow">
                                    {(pkg as any).features?.map((feature: string, i: number) => (
                                        <div key={i} className="flex items-start gap-2 text-sm text-white/80">
                                            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <a
                                    href="/contact"
                                    className={`mt-auto block w-full text-center py-3 rounded-full font-medium transition-all ${pkg.popular
                                        ? 'bg-cyan-400 text-black hover:bg-cyan-300'
                                        : 'bg-white/10 text-white hover:bg-white/20'
                                        }`}
                                >
                                    Select Target
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sprint Pricing Component */}
            <Pricing />

            <div className="container mx-auto px-6 relative z-10 max-w-5xl mt-32">
                <div className="grid md:grid-cols-2 gap-12 mb-12">
                    {/* Left Card: Growth Upgrades */}
                    <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col h-full">
                        <h3 className="text-3xl font-bold mb-4 text-white tracking-tight">Growth Upgrades</h3>
                        <p className="text-white/70 mb-8 leading-relaxed">Enhance your package with additional systems designed to generate leads, automate admin and increase conversions.</p>

                        <div className="space-y-4 flex-grow">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start sm:items-center py-4 border-b border-white/10 gap-2">
                                <span className="text-white/80 font-medium">Google Business Profile Setup</span>
                                <span className="font-mono text-cyan-400 text-sm sm:text-right">£249 setup<br /><span className="text-white/50 text-xs">Ongoing management from £79/mo</span></span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start sm:items-center py-4 border-b border-white/10 gap-2">
                                <span className="text-white/80 font-medium">Chat Widget & Lead Capture</span>
                                <span className="font-mono text-cyan-400 text-sm sm:text-right">£199 setup<br /><span className="text-white/50 text-xs">£49/mo</span></span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start sm:items-center py-4 border-b border-white/10 gap-2">
                                <span className="text-white/80 font-medium">AI Enquiry Triage</span>
                                <span className="font-mono text-cyan-400 text-sm sm:text-right">£495 setup<br /><span className="text-white/50 text-xs">£149/mo</span></span>
                            </div>
                            <div className="py-4 border-b border-white/10 space-y-2">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start sm:items-center gap-2">
                                    <span className="text-white/80 font-medium">Online Booking System</span>
                                    <span className="font-mono text-cyan-400 text-sm sm:text-right">£295 setup<br /><span className="text-white/50 text-xs">£39/mo</span></span>
                                </div>
                                <p className="text-white/50 text-xs italic leading-relaxed">Optional payment/deposit integration £149 setup. Note: Third party booking subscriptions billed directly at cost.</p>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start sm:items-center py-4 border-b border-white/10 gap-2">
                                <span className="text-white/80 font-medium">Automation Discovery Session</span>
                                <span className="font-mono text-cyan-400 text-sm sm:text-right">£295 one off</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start sm:items-center py-4 border-b border-white/10 gap-2">
                                <span className="text-white/80 font-medium">Automation Build Pack</span>
                                <span className="font-mono text-cyan-400 text-sm sm:text-right">£795 setup</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start sm:items-center py-4 border-b border-white/10 gap-2">
                                <span className="text-white/80 font-medium">AI Audit & Roadmap</span>
                                <span className="font-mono text-cyan-400 text-sm sm:text-right">£595 one off</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start sm:items-center py-4 border-b border-white/10 gap-2">
                                <span className="text-white/80 font-medium">AI Implementation Sprint</span>
                                <span className="font-mono text-cyan-400 text-sm sm:text-right">From £1,995</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Card: Additional Development */}
                    <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col h-full">
                        <h3 className="text-3xl font-bold mb-4 text-white tracking-tight">Additional Development</h3>
                        <p className="text-white/70 mb-8 leading-relaxed">Need something outside your selected package? Additional work is billed at the following standard rates.</p>

                        <div className="space-y-4 flex-grow">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 border-b border-white/10 gap-2">
                                <span className="text-white/80 font-medium">Standard Build & Automation Time</span>
                                <span className="font-mono text-cyan-400 text-sm sm:text-right">£75/hr</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 border-b border-white/10 gap-2">
                                <span className="text-white/80 font-medium">Content Upload & Formatting</span>
                                <span className="font-mono text-cyan-400 text-sm sm:text-right">£50/hr</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 border-b border-white/10 gap-2">
                                <span className="text-white/80 font-medium">Large Scale Automation Projects</span>
                                <span className="font-mono text-cyan-400 text-sm sm:text-right">Quoted based on scope</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 border-b border-white/10 gap-2">
                                <span className="text-white/80 font-medium">AI Enablement & Automation Retainer</span>
                                <span className="font-mono text-cyan-400 text-sm sm:text-right">£399/mo</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 border-b border-white/10 gap-2">
                                <span className="text-white/80 font-medium">AI Strategy & Ongoing Advisory</span>
                                <span className="font-mono text-cyan-400 text-sm sm:text-right">£499/mo</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Text */}
                <div className="text-center p-6 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-xl">
                    <p className="text-white/80 italic font-medium">All packages include clearly defined scope. Any additional work is discussed and approved before implementation.</p>
                </div>
            </div>

            <div className="container mx-auto px-6 relative z-10 max-w-4xl mt-32">
                <h2 className="text-4xl font-bold mb-12 text-center text-white">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {siteData.faqs.map((faq, i) => (
                        <div key={i} className="p-8 rounded-[1.5rem] bg-white/5 border border-white/10">
                            <h4 className="text-xl font-bold mb-3 text-cyan-100">{faq.question}</h4>
                            <p className="text-white/70 leading-relaxed">{faq.answer}</p>
                        </div>
                    ))}
                    <div className="p-8 rounded-[1.5rem] bg-white/5 border border-white/10">
                        <h4 className="text-xl font-bold mb-3 text-cyan-100">Why is managed hosting and support more than basic hosting?</h4>
                        <p className="text-white/70 leading-relaxed">Basic hosting just keeps your site online. Our managed support includes security updates, minor content edits, performance monitoring, and priority access to our team if anything needs fixing.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
