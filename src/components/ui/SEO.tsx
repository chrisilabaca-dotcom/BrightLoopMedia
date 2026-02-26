import { siteData } from "../../content/site";

export function SEO({ title, description, url }: { title: string, description?: string, url: string }) {
    const fullTitle = `${title} | ${siteData.identity.name}`;
    const desc = description || siteData.identity.oneLiner;

    const structuredData = {
        "@context": "https://schema.org",
        "@type": ["LocalBusiness", "ProfessionalService"],
        "name": siteData.identity.name,
        "description": desc,
        "url": url,
        "telephone": "07859986848",
        "email": "brightloopuk@gmail.com",
        "priceRange": "££",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Wirral",
            "addressRegion": "Merseyside",
            "addressCountry": "UK"
        },
        // Dynamically inject the FAQPage schema if FAQS exist
        ...(siteData.faqs.length > 0 && {
            "hasFAQPage": {
                "@type": "FAQPage",
                "mainEntity": siteData.faqs.map(faq => ({
                    "@type": "Question",
                    "name": faq.question,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": faq.answer
                    }
                }))
            }
        })
    };

    return (
        <>
            <title>{fullTitle}</title>
            <meta name="description" content={desc} />
            <link rel="canonical" href={url} />

            {/* Open Graph / Twitter */}
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content={siteData.identity.name} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={desc} />
            <meta property="og:url" content={url} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={desc} />

            {/* JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
        </>
    );
}
