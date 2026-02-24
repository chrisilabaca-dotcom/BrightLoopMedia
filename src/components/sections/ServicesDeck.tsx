import { siteData } from "../../content/site";
import { Link } from "wouter";

export function ServicesDeck() {
    return (
        <section id="services" className="py-32 bg-[#030305] relative border-t border-b border-white/5">
            {/* Holographic background elements */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/10 via-[#030305] to-[#030305] pointer-events-none" />
            <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col gap-2 mb-20 text-center">
                    <span className="text-cyan-400 font-mono text-sm tracking-widest uppercase">01 // Architecture</span>
                    <h2 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/40">
                        The Holographic Deck
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {siteData.services.map((service, index) => {
                        // Separate HelloFlint out to an external link
                        const isHelloFlint = service.id === "helloflint";
                        const cardContent = (
                            <div className="h-full rounded-[2rem] p-[1px] bg-gradient-to-br from-white/20 via-white/5 to-transparent relative group cursor-pointer transition-transform hover:-translate-y-2">
                                {/* Glow Behind Card */}
                                <div className="absolute -inset-1 bg-cyan-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                                <div className="w-full h-full bg-[#050508]/90 backdrop-blur-2xl rounded-[2rem] p-8 flex flex-col justify-between relative overflow-hidden">
                                    {/* Inner Glass Highlights */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                    <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-500/10 blur-[50px] rounded-full group-hover:bg-cyan-400/20 transition-colors duration-700 pointer-events-none" />

                                    <div className="z-10 relative">
                                        <span className="inline-flex items-center gap-2 text-cyan-300/80 font-mono text-xs mb-6 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-950/30">
                                            SYS.{String(index + 1).padStart(2, '0')} // {service.id.toUpperCase()}
                                        </span>
                                        <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white leading-tight">{service.title}</h3>
                                        <p className="text-white/60 leading-relaxed mb-8">
                                            {service.description}
                                        </p>
                                    </div>

                                    <div className="z-10 flex items-center gap-2 text-cyan-400 font-medium">
                                        {isHelloFlint ? "Visit HelloFlint.co.uk" : "Explore Service"}
                                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    </div>
                                </div>
                            </div>
                        );

                        if (isHelloFlint) {
                            return (
                                <a key={service.id} href="https://helloflint.co.uk" target="_blank" rel="noopener noreferrer" className="block outline-none">
                                    {cardContent}
                                </a>
                            );
                        }

                        return (
                            <Link key={service.id} href={`/services/${service.id}`} className="block outline-none">
                                {cardContent}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
