import { YoutubeTranscript } from "youtube-transcript";
import OpenAI from "openai";
import "dotenv/config";

const WORKFLOW_EXTRACTION_PROMPT = `You are an expert at analysing video transcripts and extracting structured workflow concepts.

Given the following transcript from a video, extract the workflow concept being described.

Return a structured JSON response with these fields:
{
  "title": "A clear, concise title for the workflow",
  "summary": "A 2-3 sentence summary of the overall workflow concept",
  "steps": [
    {
      "step": 1,
      "action": "What to do in this step",
      "details": "Additional context or specifics",
      "tools": ["Any tools, platforms, or technologies mentioned"]
    }
  ],
  "tools_mentioned": ["All tools/platforms referenced in the workflow"],
  "target_audience": "Who this workflow is for",
  "key_takeaway": "The main insight or value proposition"
}

Be thorough but concise. Extract every meaningful step. If the transcript is unclear, infer the most logical workflow from context.`;

function extractVideoId(urlOrId: string): string {
  // Handle various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = urlOrId.match(pattern);
    if (match) return match[1];
  }

  throw new Error(`Could not extract video ID from: ${urlOrId}`);
}

async function fetchTranscript(videoId: string): Promise<string> {
  console.log(`Fetching transcript for video: ${videoId}...`);

  let transcriptItems;
  try {
    transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("fetch failed") || message.includes("ECONNREFUSED") || message.includes("proxy")) {
      throw new Error(
        "Network error: Could not reach YouTube. If running in a restricted environment, try running this script locally:\n" +
        `  npx tsx scripts/scrape-video-workflow.ts ${videoId}`
      );
    }
    throw new Error(`Failed to fetch transcript: ${message}`);
  }

  if (!transcriptItems || transcriptItems.length === 0) {
    throw new Error("No transcript available for this video. It may not have captions enabled.");
  }

  const fullText = transcriptItems
    .map((item) => item.text)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  console.log(`Transcript fetched: ${fullText.length} characters, ${transcriptItems.length} segments\n`);
  return fullText;
}

async function analyseWorkflow(transcript: string): Promise<Record<string, unknown>> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.includes("placeholder")) {
    throw new Error(
      "OPENAI_API_KEY is not set. Add it to your .env file to enable AI analysis."
    );
  }

  console.log("Analysing transcript with AI...\n");

  const openai = new OpenAI({ apiKey });

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: WORKFLOW_EXTRACTION_PROMPT },
      {
        role: "user",
        content: `Here is the video transcript:\n\n${transcript}`,
      },
    ],
    temperature: 0.3,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from AI analysis.");
  }

  return JSON.parse(content);
}

function formatWorkflow(workflow: Record<string, unknown>): string {
  const lines: string[] = [];

  lines.push("=".repeat(60));
  lines.push(`WORKFLOW: ${workflow.title}`);
  lines.push("=".repeat(60));
  lines.push("");

  lines.push("SUMMARY:");
  lines.push(`  ${workflow.summary}`);
  lines.push("");

  if (Array.isArray(workflow.steps)) {
    lines.push("STEPS:");
    for (const step of workflow.steps) {
      const s = step as { step: number; action: string; details: string; tools?: string[] };
      lines.push(`  ${s.step}. ${s.action}`);
      if (s.details) lines.push(`     ${s.details}`);
      if (s.tools && s.tools.length > 0) {
        lines.push(`     Tools: ${s.tools.join(", ")}`);
      }
      lines.push("");
    }
  }

  if (Array.isArray(workflow.tools_mentioned) && workflow.tools_mentioned.length > 0) {
    lines.push(`TOOLS & PLATFORMS: ${(workflow.tools_mentioned as string[]).join(", ")}`);
    lines.push("");
  }

  if (workflow.target_audience) {
    lines.push(`TARGET AUDIENCE: ${workflow.target_audience}`);
    lines.push("");
  }

  if (workflow.key_takeaway) {
    lines.push(`KEY TAKEAWAY: ${workflow.key_takeaway}`);
  }

  lines.push("=".repeat(60));
  return lines.join("\n");
}

async function main() {
  const input = process.argv[2];

  if (!input) {
    console.error("Usage: npx tsx scripts/scrape-video-workflow.ts <youtube-url-or-id>");
    console.error("");
    console.error("Examples:");
    console.error("  npx tsx scripts/scrape-video-workflow.ts https://youtube.com/shorts/T2bd1kGEISo");
    console.error("  npx tsx scripts/scrape-video-workflow.ts T2bd1kGEISo");
    process.exit(1);
  }

  try {
    const videoId = extractVideoId(input);
    console.log(`Video ID: ${videoId}\n`);

    // Step 1: Fetch transcript
    const transcript = await fetchTranscript(videoId);

    // Step 2: Analyse with AI
    const workflow = await analyseWorkflow(transcript);

    // Step 3: Display results
    console.log(formatWorkflow(workflow));

    // Step 4: Save to file
    const outputPath = `scripts/output/workflow-${videoId}.json`;
    const { mkdirSync, writeFileSync } = await import("fs");
    mkdirSync("scripts/output", { recursive: true });
    writeFileSync(outputPath, JSON.stringify(workflow, null, 2));
    console.log(`\nFull JSON saved to: ${outputPath}`);
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
