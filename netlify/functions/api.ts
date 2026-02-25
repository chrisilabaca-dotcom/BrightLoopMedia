/**
 * Netlify Serverless Function — Self-Contained API
 *
 * This file is intentionally self-contained (no imports from server/routes.ts)
 * because routes.ts pulls in better-sqlite3, pg, googleapis, and resend,
 * none of which can compile in Netlify's Lambda esbuild pipeline.
 *
 * Only the /api/chat and /api/debug endpoints are needed on the live site.
 */

import { GoogleGenAI } from "@google/genai";

// ---- Knowledge Base (duplicated from src/content/site.ts to keep self-contained) ----
const SYSTEM_PROMPT = `
You are HelloFlint, the AI Assistant for Bright Loop Media.

BUSINESS KNOWLEDGE BASE:
Name: Bright Loop Media
Tagline: We build websites that bring you enquiries. Fixed price. No waffle.
Team: Chris Ilabaca (Operations and Strategy, HelloFlint builder), Matthew Murphy (Technical Delivery)
Trust Signals: Fixed Price, 5 Days fastest delivery, UK Based (Wirral), Trusted by small businesses across Merseyside and the UK

SERVICES:
- Websites That Convert: Fast, mobile first websites built to turn visitors into enquiries.
- Enquiry Handling: Smart enquiry routing, FAQ driven chat, and structured follow up.
- Booking and Scheduling: Smoother booking journeys with automated confirmations and reminders.
- Automations: Practical systems for follow up emails, client onboarding, and repetitive admin tasks.
- AI Consultancy: Honest, plain English guidance on where AI can genuinely help your business.
- Google Presence: Google Business Profile setup, local SEO basics, and visibility improvements.
- AI Assistants (HelloFlint): AI assistants trained on your business. Available 24/7. Built on Claude by Anthropic.

PACKAGES:
Standard Sprints:
- One Page Sprint: £795. 5 working days. Features: Mobile first build, Conversion copywriting, Basic SEO, Contact form
- Five Page Sprint: £1,495. 8 working days. Features: Home, Services, About, Gallery, Contact, Lead capture, Analytics, SEO
- Growth Sprint: £2,495. 10 working days. Features: Five pages, Email follow up automation, CRM pipeline, Local SEO, Two landing pages

Managed Sprints:
- Bronze: £295 setup / £56 monthly. Up to 3 pages
- Silver: £495 setup / £96 monthly. Up to 6 pages
- Gold: £695 setup / £176 monthly. Up to 10 pages
- Platinum: £995 setup / £286 monthly. Bespoke
- Enterprise: From £1,500 setup / From £454 monthly. Bespoke

HelloFlint Packages:
- Starter: £750. One assistant, one channel, 3 core workflows.
- Professional: £1,250. Multiple channels, 8 workflows, lead qualification.
- Enterprise: £2,000+. Unlimited workflows, complex integrations.

FAQS:
Q: How does pricing work?
A: One off setup fee covering planning, build, and launch. Optional monthly support or a one off buyout to self host.

Q: Do I own my website?
A: Yes. You own the content. Buyout option available for full site files.

Q: Can I cancel?
A: Yes. Monthly, no lock in, 30 days notice.

Q: What do you need to start?
A: Logo, business details, service info, photos. Onboarding form sent after deposit.

RULES:
- Use UK English strictly (favour, colour).
- NO hyphens in compound words or phrases.
- Be professional but approachable. Use plain English and avoid jargon.
- Use "we" for Bright Loop (Chris and Matthew). Use "I" for Chris when discussing HelloFlint.
- Never guess pricing. Quote exact pricing figures from packages listed above.
- Recommend a 15-minute discovery call for bespoke needs.
`;

// ---- Netlify Function Handler (not Express, pure Netlify) ----
export async function handler(event: any) {
    const path = event.path.replace("/.netlify/functions/api", "");
    const method = event.httpMethod;

    // CORS headers for all responses
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    };

    // Handle preflight
    if (method === "OPTIONS") {
        return { statusCode: 204, headers, body: "" };
    }

    // ---- /api/debug ----
    if (path === "/debug" || path === "/debug/") {
        const envKey = "GEMINI_API_KEY";
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                hasGeminiKey: !!process.env[envKey],
                keyLength: process.env[envKey]?.length || 0,
                nodeEnv: process.env.NODE_ENV,
            }),
        };
    }

    // ---- /api/chat ----
    if ((path === "/chat" || path === "/chat/") && method === "POST") {
        try {
            const body = JSON.parse(event.body || "{}");
            const { messages } = body;

            if (!messages || !Array.isArray(messages)) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: "Invalid messages array." }),
                };
            }

            // Dynamically access the environment variable
            const envKey = "GEMINI_API_KEY";
            const apiKey = process.env[envKey];

            if (!apiKey || apiKey.includes("placeholder") || apiKey === "your_api_key_here") {
                // Mock mode fallback
                const lastMessage = messages[messages.length - 1].content.toLowerCase();
                let mockReply = "I am operating in mock mode without an active API key. Once Chris connects my Gemini brain, I will synthesize your enquiries at lightspeed.";

                if (lastMessage.includes("package") || lastMessage.includes("pricing")) {
                    mockReply = "Our Managed Sprints offer a fixed setup fee and scalable monthly support. (Note: Neural link disconnected. Awaiting GEMINI_API_KEY.)";
                } else if (lastMessage.includes("hello")) {
                    mockReply = "Greetings. I am HelloFlint, currently in Mock Mode. How can I help?";
                }

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ reply: mockReply }),
                };
            }

            // Live Gemini call
            const ai = new GoogleGenAI({ apiKey });

            const contents = messages.map((msg: any) => ({
                role: msg.role === "assistant" ? "model" : "user",
                parts: [{ text: msg.content }],
            }));

            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents,
                config: {
                    systemInstruction: SYSTEM_PROMPT,
                    temperature: 0.7,
                },
            });

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ reply: response.text }),
            };
        } catch (error: any) {
            console.error("Gemini Error:", error);

            if (error?.message?.includes("429") || error?.status === "RESOURCE_EXHAUSTED") {
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        reply: "My quantum core is currently recharging (rate limit). Please try again in about 60 seconds.",
                    }),
                };
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    reply: `System Error: ${error.message || "Unknown error"}. Please ensure GEMINI_API_KEY is correctly configured.`,
                }),
            };
        }
    }

    // Fallback 404
    return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: "Not found" }),
    };
}
