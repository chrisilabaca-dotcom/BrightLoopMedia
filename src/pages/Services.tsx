import { SEO } from "../components/ui/SEO";
import { ServicesDeck } from "../components/sections/ServicesDeck";

export function Services() {
    return (
        <div className="bg-[#030305] min-h-screen pt-32 pb-24 relative overflow-hidden">
            <SEO
                title="Our Services | Websites, Enquiry Handling, Automations | Bright Loop Media"
                url="https://brightloop.co.uk/services"
                description="Web development, enquiry handling, booking systems, automations, AI consultancy, and Google presence services for UK small businesses."
            />

            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10 max-w-4xl text-center mb-12">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
                    Our Services
                </h1>
                <p className="text-2xl text-white/70 font-light leading-relaxed">
                    We build modern, fast loading websites that are designed to convert visitors into enquiries, supported by intelligent systems that reduce your admin.
                </p>
            </div>

            {/* Reusing the grid we built */}
            <ServicesDeck />
        </div>
    );
}
