import type { Express } from "express";
import { db } from "./db";
import { insertInquirySchema, inquiries } from "../shared/schema";
import { Resend } from "resend";
import { google } from "googleapis";
import { GoogleGenAI } from "@google/genai";
import { siteData } from "../src/content/site";

// Prepare the system prompt from the Knowledge Base
const SYSTEM_PROMPT = `
You are HelloFlint, the AI Assistant for Bright Loop Media.

BUSINESS KNOWLEDGE BASE:
Name: ${siteData.identity.name}
Tagline: ${siteData.identity.tagline}
Team: ${siteData.identity.team.map(t => `${t.name} (${t.role})`).join(", ")}
Trust Signals: ${siteData.identity.trustSignals.join(", ")}

SERVICES:
${siteData.services.map(s => `- ${s.title}: ${s.description}`).join("\n")}

PACKAGES:
Standard Sprints:
${siteData.packages.websiteStandard.map(p => `- ${p.name}: ${p.price}. ${p.timeline}. Features: ${p.features.join(", ")}`).join("\n")}

Managed Sprints:
${siteData.packages.websiteManaged.map(p => `- ${p.name}: ${p.setupFee} / ${p.monthlyFee}. ${p.description}`).join("\n")}

HelloFlint Packages:
${siteData.packages.helloFlint.map(p => `- ${p.name}: ${p.price}. ${p.description}`).join("\n")}

FAQS:
${siteData.faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n")}

RULES:
- Use UK English strictly (favour, colour).
- NO hyphens in compound words or phrases.
- Be professional but approachable. Use plain English and avoid jargon.
- Use "we" for Bright Loop (Chris and Matthew). Use "I" for Chris when discussing HelloFlint.
- Never guess pricing. Quote exact pricing figures from packages listed above.
- Recommend a 15-minute discovery call for bespoke needs.
`;

export function registerRoutes(app: Express) {
    // --- Sitemap Generation ---
    app.get("/sitemap.xml", (req, res) => {
        const baseUrl = process.env.VITE_PUBLIC_URL || "https://brightloop.co.uk";
        const routes = [
            "",
            "/contact",
            "/about",
            "/services",
            "/packages",
            ...siteData.services.filter(s => s.id !== "helloflint").map(s => `/services/${s.id}`)
        ];

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${routes.map(r => `
    <url>
        <loc>${baseUrl}${r}</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>weekly</changefreq>
    </url>`).join("")}
</urlset>`;

        res.header("Content-Type", "application/xml");
        res.send(sitemap);
    });

    // --- The Lead Pipeline: "The Holy Trinity" ---
    // 1. Zod Validation & DB Insert
    // 2. Google Sheets Append
    // 3. Email Notification via Resend
    app.post("/api/inquiries", async (req, res) => {
        try {
            const parsed = insertInquirySchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({ error: parsed.error.issues });
            }

            const inquiryData = parsed.data;

            // 1. Database: Save inquiry
            // For SQLite fallback compatibility, we do a basic insert.
            await db.insert(inquiries).values(inquiryData);

            // 2. Google Sheets Append
            try {
                if (
                    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
                    process.env.GOOGLE_PRIVATE_KEY &&
                    process.env.GOOGLE_SHEET_ID
                ) {
                    const auth = new google.auth.GoogleAuth({
                        credentials: {
                            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
                        },
                        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
                    });

                    const sheets = google.sheets({ version: "v4", auth });
                    const dateStr = new Date().toLocaleString("en-GB", { timeZone: "Europe/London" });

                    await sheets.spreadsheets.values.append({
                        spreadsheetId: process.env.GOOGLE_SHEET_ID,
                        range: "Bright Loop Media — Enquiries!A:G", // Adjust based on actual sheet name if needed
                        valueInputOption: "USER_ENTERED",
                        requestBody: {
                            values: [
                                [
                                    dateStr,
                                    inquiryData.name,
                                    inquiryData.phone || "N/A",
                                    inquiryData.email,
                                    inquiryData.postcode || "N/A",
                                    inquiryData.service,
                                    inquiryData.message,
                                ],
                            ],
                        },
                    });
                    console.log("Appended to Google Sheets");
                }
            } catch (sheetError) {
                console.error("Google Sheets append failed:", sheetError);
                // Do not fail the whole pipeline if just Sheets fails
            }

            // 3. Email Notification
            try {
                if (process.env.RESEND_API_KEY) {
                    const resend = new Resend(process.env.RESEND_API_KEY);
                    await resend.emails.send({
                        from: "Bright Loop Media <enquiries@brightloop.co.uk>",
                        to: "chris@brightloop.co.uk", // Send to ops
                        subject: `New Enquiry from ${inquiryData.name} - ${inquiryData.service}`,
                        text: `
New Enquiry Details:
--------------------
Date: ${new Date().toLocaleString("en-GB", { timeZone: "Europe/London" })}
Name: ${inquiryData.name}
Email: ${inquiryData.email}
Phone: ${inquiryData.phone || "Not provided"}
Postcode: ${inquiryData.postcode || "Not provided"}
Service Interest: ${inquiryData.service}

Message:
${inquiryData.message}
            `.trim(),
                    });
                    console.log("Sent notification email");
                }
            } catch (emailError) {
                console.error("Resend email failed:", emailError);
            }

            res.status(200).json({ success: true, message: "Inquiry saved successfully." });
        } catch (error) {
            console.error("Pipeline Error:", error);
            res.status(500).json({ error: "Internal server error during inquiry processing." });
        }
    });

    // --- HelloFlint AI Assistant Endpoint ---
    app.post("/api/chat", async (req, res) => {
        try {
            const { messages } = req.body;

            if (!messages || !Array.isArray(messages)) {
                return res.status(400).json({ error: "Invalid messages array." });
            }

            const apiKey = process.env.GEMINI_API_KEY;

            // If the key is missing or is the default placeholder, fallback to a cinematic mock response indicating the system is ready.
            if (!apiKey || apiKey.includes("placeholder")) {
                console.log("Mocking AI response due to placeholder API key.");
                // Simulate network delay for realism
                await new Promise(resolve => setTimeout(resolve, 1500));

                const lastMessage = messages[messages.length - 1].content.toLowerCase();
                let mockReply = "I am operating in highly secured mock mode without an active neural link (API key). But make no mistake, my core protocols are fully intact. Once Chris connects my Gemini brain, I will synthesize your enquiries at lightspeed. What else would you like to know about Bright Loop's architecture?";

                if (lastMessage.includes("package") || lastMessage.includes("pricing")) {
                    mockReply = "Ah, you're asking about our elite packages. Our Managed Sprints offer a fixed setup fee and scalable monthly support. It's built for founders who value outcomes over hours. (Note: Neural link disconnected. Awaiting GEMINI_API_KEY to access full package matrices.)";
                } else if (lastMessage.includes("hello")) {
                    mockReply = "Greetings. I am HelloFlint. I am currently running on a constrained neural pathway (Mock Mode), but my aesthetic and function are undeniable. How can I streamline your digital systems today?";
                }

                return res.status(200).json({ reply: mockReply });
            }

            const ai = new GoogleGenAI({ apiKey: apiKey });

            // Format messages for Gemini
            const contents = messages.map(msg => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }]
            }));

            // Fallback to gemini-1.5-flash since the 8b string varies by API version.
            const response = await ai.models.generateContent({
                model: "gemini-1.5-flash",
                contents: contents,
                config: {
                    systemInstruction: SYSTEM_PROMPT,
                    temperature: 0.7,
                }
            });

            res.status(200).json({ reply: response.text });
        } catch (error: any) {
            console.error("Gemini Error:", error);

            // Check for Rate Limit 429
            if (error?.message?.includes("429") || error?.status === "RESOURCE_EXHAUSTED") {
                return res.status(200).json({ reply: "My quantum core is currently recharging (Google API Rate Limit Exceeded). Please try again in about 60 seconds, or connect a billing account to my neural link for unlimited processing." });
            }

            // Even if it fails (e.g. invalid key), fail gracefully with personality
            res.status(200).json({ reply: `System Error Detected: My quantum core specifically rejected that request (${error.message || 'Authentication error'}). Please ensure my GEMINI_API_KEY is correctly configured in my environment.` });
        }
    });
}
