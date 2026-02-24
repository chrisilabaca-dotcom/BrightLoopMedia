import { siteData } from "../../content/site";
import { Check } from "lucide-react";

export function Pricing() {
    return (
        <section id="pricing" className="py-32 relative bg-[#030305]">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-900/10 to-transparent pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-sm font-mono text-cyan-400 tracking-widest uppercase mb-4">Investment</h2>
                    <h3 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">Fixed Price Packages</h3>
                    <p className="text-xl text-white/60 leading-relaxed">
                        No hidden fees. No trailing costs. Honest, upfront pricing designed around delivering raw business value.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {siteData.packages.websiteStandard.map((pkg, i) => (
                        <div
                            key={pkg.id}
                            className={`relative group rounded-[2rem] p-8 transition-transform hover:-translate-y-2 ${pkg.popular
                                    ? 'bg-gradient-to-b from-blue-900/40 to-white/5 border border-blue-500/30 shadow-[0_0_50px_rgba(59,130,246,0.15)]'
                                    : 'bg-white/[0.03] border border-white/10 hover:border-white/20'
                                }`}
                        >
                            {/* Glass reflection */}
                            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 rounded-[2rem] transition-opacity" />

                            {pkg.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full text-sm font-bold text-black shadow-lg">
                                    Most Popular
                                </div>
                            )}

                            <div className="relative z-10">
                                <h4 className="text-2xl font-semibold mb-2">{pkg.name}</h4>
                                <div className="text-4xl font-bold mb-2">{pkg.price}</div>
                                <div className="text-sm text-cyan-200/60 font-mono mb-8 block">Delivery: {pkg.timeline}</div>

                                <ul className="space-y-4 mb-10">
                                    {pkg.features.map((feature, j) => (
                                        <li key={j} className="flex items-start gap-3">
                                            <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                                                <Check className="w-3 h-3 text-cyan-400" />
                                            </div>
                                            <span className="text-white/80">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <a
                                    href="/contact"
                                    className={`block w-full text-center py-4 rounded-full font-medium transition-all ${pkg.popular
                                            ? 'bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                                            : 'bg-white/10 text-white hover:bg-white/20'
                                        }`}
                                >
                                    Select Package
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
