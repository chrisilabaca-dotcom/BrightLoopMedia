import { lazy, Suspense } from "react";
import { Hero } from "../components/sections/Hero";
import { TechMarquee } from "../components/sections/TechMarquee";
import { SEO } from "../components/ui/SEO";

// Below-fold sections — lazy loaded so they don't block initial paint
const ServicesDeck = lazy(() => import("../components/sections/ServicesDeck").then(m => ({ default: m.ServicesDeck })));
const Pricing = lazy(() => import("../components/sections/Pricing").then(m => ({ default: m.Pricing })));

export function Home() {
    return (
        <div className="bg-[#030305]">
            <SEO
                title="Web Design & Digital Systems on the Wirral"
                description="Fast, conversion-focused websites and digital systems for small businesses. Based on the Wirral, working with clients across the UK."
                url="https://brightloop.co.uk"
            />

            <Hero />
            <TechMarquee />
            <Suspense fallback={<div className="min-h-screen bg-[#030305]" />}>
                <ServicesDeck />
                <Pricing />
            </Suspense>
        </div>
    );
}
