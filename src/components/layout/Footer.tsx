import { Link } from "wouter";
import { siteData } from "../../content/site";

export function Footer() {
    return (
        <footer className="bg-[#050508] border-t border-white/5 pt-20 pb-10 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

            <div className="container mx-auto px-6 max-w-6xl relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link href="/">
                            <a className="text-2xl font-bold tracking-tighter text-white inline-flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-cyan-400" />
                                {siteData.identity.name}
                            </a>
                        </Link>
                        <p className="text-white/60 text-sm leading-relaxed">
                            {siteData.identity.oneLiner}
                        </p>
                        <div className="space-y-2">
                            <a href="mailto:brightloopuk@gmail.com" className="block text-cyan-400 hover:text-cyan-300 text-sm transition-colors">brightloopuk@gmail.com</a>
                            <a href="tel:07859986848" className="block text-white/80 hover:text-white text-sm transition-colors">07859 986848</a>
                        </div>
                    </div>

                    {/* Services Column */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Services</h4>
                        <ul className="space-y-3">
                            {siteData.services.slice(0, 5).map(service => (
                                <li key={service.id}>
                                    <Link href={`/services/${service.id}`}>
                                        <a className="text-sm text-white/60 hover:text-cyan-400 transition-colors">{service.title}</a>
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link href="/services">
                                    <a className="text-sm text-cyan-400/80 hover:text-cyan-400 transition-colors">View all services →</a>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Company</h4>
                        <ul className="space-y-3">
                            <li><Link href="/about"><a className="text-sm text-white/60 hover:text-cyan-400 transition-colors">About</a></Link></li>
                            <li><Link href="/how-it-works"><a className="text-sm text-white/60 hover:text-cyan-400 transition-colors">How It Works</a></Link></li>
                            <li><Link href="/packages"><a className="text-sm text-white/60 hover:text-cyan-400 transition-colors">Packages</a></Link></li>
                            <li><Link href="/contact"><a className="text-sm text-white/60 hover:text-cyan-400 transition-colors">Contact</a></Link></li>
                        </ul>
                    </div>

                    {/* Hours Column */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Hours</h4>
                        <ul className="space-y-3">
                            <li className="text-sm text-white/60 flex justify-between">
                                <span>Mon to Fri:</span>
                                <span>9am to 6pm</span>
                            </li>
                            <li className="text-sm text-white/60 flex justify-between">
                                <span>Sat:</span>
                                <span>10am to 4pm</span>
                            </li>
                            <li className="text-sm text-white/60 flex justify-between">
                                <span>Sun:</span>
                                <span>Closed</span>
                            </li>
                        </ul>
                        <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/5 inline-block">
                            <p className="text-xs text-white/40">Registered in England & Wales</p>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-white/40 text-xs">
                        © {new Date().getFullYear()} {siteData.identity.name}. All rights reserved.
                    </p>
                    <p className="text-white/40 text-xs">
                        Built on the Wirral. Working with clients across the UK.
                    </p>
                </div>
            </div>
        </footer>
    );
}
