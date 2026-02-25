import "dotenv/config";
import express, { type Request, type Response, type NextFunction } from "express";
import { createServer as createViteServer, type ViteDevServer } from "vite";
import { registerRoutes } from "./routes";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function createServer() {
    const app = express();
    app.use(express.json());

    // Register API routes First
    registerRoutes(app);

    const isProd = process.env.NODE_ENV === "production";

    let vite: ViteDevServer | undefined;

    if (!isProd) {
        // Vite integration for development
        vite = await createViteServer({
            server: { middlewareMode: true },
            appType: "custom",
        });
        app.use(vite.middlewares);
    } else {
        // Serve static files in production
        app.use(express.static(path.resolve(__dirname, "../dist/client"), { index: false }));
    }

    app.use(async (req: Request, res: Response, next: NextFunction) => {
        try {
            const url = req.originalUrl;
            let template, render;

            if (!isProd) {
                // Read index.html
                template = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf-8");
                // Apply Vite HTML transforms
                template = await vite!.transformIndexHtml(url, template);
                // Load the server entry
                render = (await vite!.ssrLoadModule("/src/entry-server.tsx")).render;
            } else {
                template = fs.readFileSync(path.resolve(__dirname, "../dist/client/index.html"), "utf-8");
                render = (await import("../dist/server/entry-server.js")).render;
            }

            const { html: appHtml, head } = await render(url);

            const html = template
                .replace(`<!--app-head-->`, head ?? "")
                .replace(`<!--app-html-->`, appHtml);

            res.status(200).set({ "Content-Type": "text/html" }).end(html);
        } catch (e: any) {
            if (!isProd) vite.ssrFixStacktrace(e);
            console.error(e.stack);
            res.status(500).end(e.stack);
        }
    });

    const port = process.env.PORT || 5000;
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
}

createServer();
