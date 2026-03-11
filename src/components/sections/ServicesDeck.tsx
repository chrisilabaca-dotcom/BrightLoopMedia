import { useState, useCallback } from "react";
import { siteData } from "../../content/site";
import { Link } from "wouter";

const HERO_SERVICE_IDS = ["websites", "helloflint"];

export const SERVICE_IMAGES: Record<string, string> = {
    websites: "/services/websites.webp",
    enqs: "/services/enqs.webp",
    booking: "/services/booking.webp",
    automations: "/services/automations.webp",
    "ai-consultancy": "/services/ai-consultancy.webp",
    google: "/services/google.webp",
    helloflint: "/services/helloflint.webp",
};

function FlipCard({ service, isHero, index }: {
    service: typeof siteData.services[number];
    isHero: boolean;
    index: number;
}) {
    // State only used for mobile tap toggle
    const [mobileFlipped, setMobileFlipped] = useState(false);
    const isHelloFlint = service.id === "helloflint";
    const imageSrc = SERVICE_IMAGES[service.id];

    const handleClick = useCallback(() => {
        // Only toggle on touch devices — desktop uses CSS :hover
        if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) {
            setMobileFlipped(f => !f);
        }
    }, []);

    return (
        <div
            className={`flip-card ${isHero ? "flip-card-hero" : "flip-card-std"} ${mobileFlipped ? "is-flipped" : ""}`}
            onClick={handleClick}
        >
            <div className="flip-card-inner">
                {/* ===== FRONT ===== */}
                <div className="flip-card-face rounded-[2rem] border border-white/10 bg-[#050508] overflow-hidden">
                    {imageSrc && (
                        <img
                            src={imageSrc}
                            alt={service.title}
                            loading="lazy"
                            decoding="async"
                            className="absolute inset-0 w-full h-full object-contain p-4 opacity-90"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/50 to-transparent" />

                    {isHero && (
                        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-400/20 to-blue-500/20 border border-cyan-500/30 z-10">
                            <span className="text-xs font-bold text-cyan-300 tracking-wider uppercase">Flagship</span>
                        </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                        <span className="inline-flex items-center gap-2 text-cyan-300/80 font-mono text-xs mb-3 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-950/30">
                            SYS.{String(index + 1).padStart(2, '0')} // {service.id.toUpperCase()}
                        </span>
                        <h3 className={`font-bold text-white leading-tight ${isHero ? "text-3xl md:text-4xl" : "text-2xl"}`}>
                            {service.title}
                        </h3>
                    </div>
                </div>

                {/* ===== BACK ===== */}
                {isHelloFlint ? (
                    <a
                        href="https://helloflint.co.uk"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flip-card-face flip-card-back rounded-[2rem] border border-cyan-500/20 bg-[#050508] overflow-hidden p-8 flex flex-col justify-between no-underline text-inherit"
                    >
                        <div className="absolute -top-32 -right-32 w-80 h-80 bg-cyan-500/10 blur-[60px] rounded-full pointer-events-none" />

                        <div className="z-10 relative flex-1 overflow-y-auto">
                            <span className="inline-flex items-center gap-2 text-cyan-300/80 font-mono text-xs mb-4 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-950/30">
                                SYS.{String(index + 1).padStart(2, '0')} // {service.id.toUpperCase()}
                            </span>
                            <h3 className={`font-bold text-white leading-tight mb-4 ${isHero ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"}`}>
                                {service.title}
                            </h3>
                            <p className="text-white/60 leading-relaxed mb-6">
                                {service.description}
                            </p>

                            {service.useCases && (
                                <ul className="space-y-2">
                                    {service.useCases.slice(0, 3).map((useCase, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-white/50">
                                            <span className="text-cyan-400 mt-0.5 flex-shrink-0">→</span>
                                            <span>{useCase}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="z-10 pt-4">
                            <span className="inline-flex items-center gap-2 text-cyan-400 font-medium">
                                Visit HelloFlint.co.uk <span>→</span>
                            </span>
                        </div>
                    </a>
                ) : (
                    <Link
                        href={`/services/${service.id}`}
                        className="flip-card-face flip-card-back rounded-[2rem] border border-cyan-500/20 bg-[#050508] overflow-hidden p-8 flex flex-col justify-between no-underline text-inherit"
                    >
                        <div className="absolute -top-32 -right-32 w-80 h-80 bg-cyan-500/10 blur-[60px] rounded-full pointer-events-none" />

                        <div className="z-10 relative flex-1 overflow-y-auto">
                            <span className="inline-flex items-center gap-2 text-cyan-300/80 font-mono text-xs mb-4 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-950/30">
                                SYS.{String(index + 1).padStart(2, '0')} // {service.id.toUpperCase()}
                            </span>
                            <h3 className={`font-bold text-white leading-tight mb-4 ${isHero ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"}`}>
                                {service.title}
                            </h3>
                            <p className="text-white/60 leading-relaxed mb-6">
                                {service.description}
                            </p>

                            {service.useCases && (
                                <ul className="space-y-2">
                                    {service.useCases.slice(0, 3).map((useCase, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-white/50">
                                            <span className="text-cyan-400 mt-0.5 flex-shrink-0">→</span>
                                            <span>{useCase}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="z-10 pt-4">
                            <span className="inline-flex items-center gap-2 text-cyan-400 font-medium">
                                Explore Service <span>→</span>
                            </span>
                        </div>
                    </Link>
                )}
            </div>
        </div>
    );
}

export function ServicesDeck() {
    const heroServices = siteData.services.filter(s => HERO_SERVICE_IDS.includes(s.id));
    const standardServices = siteData.services.filter(s => !HERO_SERVICE_IDS.includes(s.id));

    return (
        <section id="services" className="py-32 bg-[#030305] relative border-t border-b border-white/5">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/10 via-[#030305] to-[#030305] pointer-events-none" />
            <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col gap-2 mb-20 text-center">
                    <span className="text-cyan-400 font-mono text-sm tracking-widest uppercase">01 // Architecture</span>
                    <h2 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/40">
                        The Holographic Deck
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {heroServices.map((service) => (
                        <FlipCard
                            key={service.id}
                            service={service}
                            isHero={true}
                            index={siteData.services.indexOf(service)}
                        />
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {standardServices.map((service) => (
                        <FlipCard
                            key={service.id}
                            service={service}
                            isHero={false}
                            index={siteData.services.indexOf(service)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
