import { Hero } from "../components/sections/Hero";
import { ServicesDeck } from "../components/sections/ServicesDeck";
import { Pricing } from "../components/sections/Pricing";
import { SEO } from "../components/ui/SEO";

export function Home() {
    return (
        <div className="bg-[#030305]">
            <SEO
                title="Web Design & Digital Systems on the Wirral"
                description="Fast, conversion-focused websites and digital systems for small businesses. Based on the Wirral, working with clients across the UK."
                url="https://brightloop.co.uk"
            />

            <Hero />
            <ServicesDeck />
            <Pricing />
        </div>
    );
}
