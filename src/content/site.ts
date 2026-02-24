export const siteData = {
    identity: {
        name: "Bright Loop Media",
        tagline: "We build websites that bring you enquiries. Fixed price. No waffle.",
        oneLiner: "Fast, conversion focused websites and digital systems for small businesses across the UK. Based on the Wirral, working with clients everywhere.",
        team: [
            { name: "Chris Ilabaca", role: "Operations and Strategy, HelloFlint builder" },
            { name: "Matthew Murphy", role: "Technical Delivery" }
        ],
        trustSignals: [
            "Fixed Price",
            "5 Days fastest delivery",
            "UK Based (Wirral)",
            "Trusted by small businesses across Merseyside and the UK"
        ]
    },
    services: [
        {
            id: "websites",
            title: "Websites That Convert",
            description: "Fast, mobile first websites built to turn visitors into enquiries.",
            useCases: [
                "Local service businesses looking to capture more leads",
                "Personal trainers needing a hub for bookings and guides",
                "Consultants wanting a high-authority digital presence"
            ],
            implementation: [
                { step: "Design Sprint", desc: "We map your customer journey and design a custom, conversion-focused wireframe." },
                { step: "Development", desc: "We build the site using modern tech for lightning-fast load times." },
                { step: "Launch & SEO", desc: "We deploy the site and submit dynamic sitemaps to Google for instant indexing." }
            ]
        },
        {
            id: "enqs",
            title: "Enquiry Handling",
            description: "Smart enquiry routing, FAQ driven chat, and structured follow up.",
            useCases: [
                "Trades businesses missing calls while on the job",
                "Service desks overwhelmed by the same 5 questions",
                "Sales teams needing better lead qualification"
            ],
            implementation: [
                { step: "Pipeline Mapping", desc: "We audit how leads currently enter your business." },
                { step: "System Build", desc: "We deploy smart forms and automated routing rules." },
                { step: "CRM Integration", desc: "We connect the flow directly into your sales tracker or email." }
            ]
        },
        {
            id: "booking",
            title: "Booking and Scheduling",
            description: "Smoother booking journeys with automated confirmations and reminders.",
            useCases: [
                "Salons and clinics reducing digital no-shows",
                "Coaches and trainers managing 1-on-1 availability",
                "Consultants offering paid discovery calls"
            ],
            implementation: [
                { step: "Calendar Sync", desc: "We securely connect your Google or Outlook calendar." },
                { step: "Payment Gateway", desc: "We integrate Stripe for upfront or deposit payments." },
                { step: "Reminder Flows", desc: "We build automated SMS and Email reminder sequences." }
            ]
        },
        {
            id: "automations",
            title: "Automations",
            description: "Practical systems for follow up emails, client onboarding, and repetitive admin tasks.",
            useCases: [
                "Agencies needing automated client onboarding workflows",
                "E-commerce stores triggering abandoned cart flows",
                "Administrators eliminating copy-paste data entry"
            ],
            implementation: [
                { step: "Audit", desc: "We identify the bottlenecks in your daily operations." },
                { step: "Zapier/Make Setup", desc: "We build the API bridges between your existing software." },
                { step: "Testing", desc: "We run dry-runs to ensure data flows perfectly without errors." }
            ]
        },
        {
            id: "ai-consultancy",
            title: "AI Consultancy",
            description: "Honest, plain English guidance on where AI can genuinely help your business.",
            useCases: [
                "Teams wanting to use ChatGPT securely",
                "Founders looking to automate content repurposing",
                "Operations managers seeking efficient data summarization"
            ],
            implementation: [
                { step: "Discovery", desc: "We assess your current operational capacity and tech stack." },
                { step: "Strategy Session", desc: "A practical workshop demonstrating real AI use-cases." },
                { step: "Action Plan", desc: "A roadmap of low-hanging fruit to deploy immediately." }
            ]
        },
        {
            id: "google",
            title: "Google Presence",
            description: "Google Business Profile setup, local SEO basics, and visibility improvements.",
            useCases: [
                "Local shops wanting to appear in 'near me' searches",
                "Contractors needing to harvest and showcase reviews",
                "New businesses establishing immediate trust"
            ],
            implementation: [
                { step: "Profile Claim", desc: "We secure and verify your exact Google Maps location." },
                { step: "Optimization", desc: "We load your profile with keyword-rich services and images." },
                { step: "Review Funnel", desc: "We set up an automated link to quickly gather 5-star reviews." }
            ]
        },
        {
            id: "helloflint",
            title: "AI Assistants (HelloFlint)",
            description: "AI assistants trained on your business. Available 24/7. Built on Claude by Anthropic.",
            useCases: [
                "E-commerce customer support deflection",
                "Interactive website concierges for lead generation",
                "Internal HR and policy query bots for staff"
            ],
            implementation: [
                { step: "Knowledge Scrape", desc: "We digest your entire website and PDF manuals." },
                { step: "Persona Design", desc: "We give the AI a name, tone, and strict conversational rules." },
                { step: "Widget Deployment", desc: "We embed the chat bubble onto your website." }
            ]
        }
    ],
    packages: {
        websiteStandard: [
            {
                id: "one-page",
                name: "One Page Sprint",
                price: "£795",
                timeline: "5 working days",
                features: ["Mobile first build", "Conversion copywriting", "Basic SEO", "Contact form"]
            },
            {
                id: "five-page",
                name: "Five Page Sprint",
                price: "£1,495",
                popular: true,
                timeline: "8 working days",
                features: ["Home, Services, About, Gallery, Contact", "Lead capture", "Analytics", "SEO"]
            },
            {
                id: "growth",
                name: "Growth Sprint",
                price: "£2,495",
                timeline: "10 working days",
                features: ["Five pages", "Email follow up automation", "CRM pipeline", "Local SEO", "Two landing pages"]
            }
        ],
        websiteManaged: [
            {
                id: "bronze",
                name: "Bronze",
                setupFee: "£295 setup",
                monthlyFee: "£56 monthly",
                description: "Up to 3 pages",
                features: ["Mobile first design", "Contact form", "Basic SEO setup", "Managed Hosting", "1hr monthly content edits"]
            },
            {
                id: "silver",
                name: "Silver",
                setupFee: "£495 setup",
                monthlyFee: "£96 monthly",
                description: "Up to 6 pages",
                features: ["5 Core Pages", "Lead Capture System", "Google Analytics", "Managed Security", "2hr monthly content edits"]
            },
            {
                id: "gold",
                name: "Gold",
                setupFee: "£695 setup",
                monthlyFee: "£176 monthly",
                popular: true,
                description: "Up to 10 pages",
                features: ["Full 10 Pages", "Advanced SEO Profiling", "Dynamic CMS integration", "Priority Support SLA", "Unlimited minor edits"]
            },
            {
                id: "platinum",
                name: "Platinum",
                setupFee: "£995 setup",
                monthlyFee: "£286 monthly",
                description: "Bespoke",
                features: ["Custom Architecture", "Third-party Integrations", "Advanced E-commerce features", "24/7 Priority Support", "Weekly Strategy Calls"]
            },
            {
                id: "enterprise",
                name: "Enterprise",
                setupFee: "From £1,500 setup",
                monthlyFee: "From £454 monthly",
                description: "Bespoke",
                features: ["Scale infrastructure", "Dedicated Success Manager", "Custom SLAs", "Complex Database Config"]
            }
        ],
        helloFlint: [
            {
                id: "hf-starter",
                name: "Starter",
                price: "£750",
                description: "One assistant, one channel, 3 core workflows."
            },
            {
                id: "hf-pro",
                name: "Professional",
                price: "£1,250",
                popular: true,
                description: "Multiple channels, 8 workflows, lead qualification."
            },
            {
                id: "hf-enterprise",
                name: "Enterprise",
                price: "£2,000+",
                description: "Unlimited workflows, complex integrations."
            }
        ]
    },
    process: [
        {
            step: 1,
            title: "Discovery Call",
            description: "15 minute call. We learn about the business and tell you honestly if we are a fit."
        },
        {
            step: 2,
            title: "Scope and Quote",
            description: "Clear scope document and fixed price quote. No surprises."
        },
        {
            step: 3,
            title: "Build and Review",
            description: "We build the site/system, share progress, and adjust before launch."
        },
        {
            step: 4,
            title: "Launch and Support",
            description: "Everything goes live. Handover documentation provided. Optional ongoing support."
        }
    ],
    faqs: [
        {
            question: "How does pricing work?",
            answer: "One off setup fee covering planning, build, and launch. Optional monthly support or a one off buyout to self host."
        },
        {
            question: "Do I own my website?",
            answer: "Yes. You own the content. Buyout option available for full site files."
        },
        {
            question: "Can I cancel?",
            answer: "Yes. Monthly, no lock in, 30 days notice."
        },
        {
            question: "What do you need to start?",
            answer: "Logo, business details, service info, photos. Onboarding form sent after deposit."
        }
    ]
};
