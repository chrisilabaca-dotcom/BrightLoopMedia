import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { siteData } from '../src/content/site';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The paths map to where Vite outputs the bundles
const toAbsolute = (p: string) => path.resolve(__dirname, '..', p);

const templatePath = toAbsolute('dist/client/index.html');
const ssrBundlePath = toAbsolute('dist/server/entry-server.js');
const outDir = toAbsolute('dist/client');

async function prerender() {
    console.log('Starting Static Site Generation...');

    // 1. Determine all valid routes
    const routes = [
        '/',
        '/about',
        '/services',
        '/packages',
        '/contact',
        ...siteData.services.map(service => `/services/${service.id}`)
    ];

    console.log(`Discovered ${routes.length} routes to prerender.`);

    // 2. Read the client-side template
    if (!fs.existsSync(templatePath)) {
        console.error(`Template not found at: ${templatePath}. Did you forget to run 'vite build'?`);
        process.exit(1);
    }
    const template = fs.readFileSync(templatePath, 'utf-8');

    // 3. Import the SSR render function
    if (!fs.existsSync(ssrBundlePath)) {
        console.error(`SSR Bundle not found at: ${ssrBundlePath}. Did you forget to run 'vite build --ssr'?`);
        process.exit(1);
    }
    const { render } = await import(ssrBundlePath);

    // 4. Render and write each page
    for (const url of routes) {
        try {
            console.log(`Prerendering ${url}...`);

            // Execute the SSR render function
            const { html: appHtml, head } = await render(url);

            // React renders the <SEO> tags inside the body <div id="root"> because there's no react-helmet
            // We need to extract them from appHtml and move them to the head
            let extractedSEO = '';
            let cleanedAppHtml = appHtml;

            // Extract <title>
            const titleMatch = cleanedAppHtml.match(/<title>[\s\S]*?<\/title>/);
            if (titleMatch) {
                extractedSEO += titleMatch[0] + '\n';
                cleanedAppHtml = cleanedAppHtml.replace(titleMatch[0], '');
            }

            // Extract all <meta> tags
            const metaRegex = /<meta\s+[^>]*\/?>/g;
            let match;
            while ((match = metaRegex.exec(cleanedAppHtml)) !== null) {
                // Ignore the charset and viewport meta if they happen to exist in the body, which they shouldn't
                extractedSEO += match[0] + '\n';
            }
            // Remove them from body
            cleanedAppHtml = cleanedAppHtml.replace(metaRegex, '');

            // Extract <link rel="canonical"
            const linkRegex = /<link\s+rel="canonical"\s+[^>]*\/?>/;
            const linkMatch = cleanedAppHtml.match(linkRegex);
            if (linkMatch) {
                extractedSEO += linkMatch[0] + '\n';
                cleanedAppHtml = cleanedAppHtml.replace(linkRegex, '');
            }

            // Extract JSON-LD script
            const scriptRegex = /<script\s+type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/;
            const scriptMatch = cleanedAppHtml.match(scriptRegex);
            if (scriptMatch) {
                extractedSEO += scriptMatch[0] + '\n';
                cleanedAppHtml = cleanedAppHtml.replace(scriptRegex, '');
            }

            const combinedHead = (head ?? '') + '\n' + extractedSEO;

            // Inject the rendered HTML into the template
            const fullHtml = template
                .replace(`<!--app-head-->`, combinedHead)
                .replace(`<!--app-html-->`, cleanedAppHtml);

            // Determine the output path (e.g., /services/websites -> dist/client/services/websites/index.html)
            const filePath = url === '/' ? 'index.html' : `${url.substring(1)}/index.html`;
            const absoluteFilePath = path.join(outDir, filePath);

            // Ensure the directory exists
            fs.mkdirSync(path.dirname(absoluteFilePath), { recursive: true });

            // Write the file
            fs.writeFileSync(absoluteFilePath, fullHtml, 'utf-8');
            console.log(`✓ Saved ${absoluteFilePath}`);

        } catch (e) {
            console.error(`Error prerendering ${url}:`, e);
        }
    }

    // 5. Generate and write sitemap.xml
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(url => `  <url>
    <loc>https://brightloop.co.uk${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>${url === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

    fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemapContent, 'utf-8');
    console.log(`✓ Saved ${path.join(outDir, 'sitemap.xml')}`);

    // 6. Generate and write robots.txt
    const robotsContent = `User-agent: *
Allow: /

Sitemap: https://brightloop.co.uk/sitemap.xml`;

    fs.writeFileSync(path.join(outDir, 'robots.txt'), robotsContent, 'utf-8');
    console.log(`✓ Saved ${path.join(outDir, 'robots.txt')}`);

    console.log('Static Site Generation complete!');
}

prerender().catch(e => {
    console.error('Prerendering failed:', e);
    process.exit(1);
});
