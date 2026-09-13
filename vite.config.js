import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  server: {
    port: 3000,
    open: false,
    host: true,
    watch: {
      ignored: ['**/dist/**', '**/.git/**', '**/.vercel/**', '**/.netlify/**']
    }
  },
  preview: {
    port: 3000
  },
  publicDir: false,
  plugins: [
    {
      name: 'copy-all-assets-and-chrome',
      closeBundle() {
        const distDir = path.resolve(__dirname, 'dist');
        if (!fs.existsSync(distDir)) return;

        // 1. Root SEO, configuration, verification, and chrome files
        const rootFiles = ['robots.txt', 'sitemap.xml', 'site.webmanifest', 'favicon.ico', 'vercel.json'];
        // Also include any google site verification html files
        fs.readdirSync(__dirname).forEach(file => {
          if (file.startsWith('google') && file.endsWith('.html')) {
            rootFiles.push(file);
          }
        });

        rootFiles.forEach(f => {
          const src = path.resolve(__dirname, f);
          if (fs.existsSync(src)) {
            fs.copyFileSync(src, path.resolve(distDir, f));
          }
        });

        // 2. Copy css/ and js/ folders completely into dist/
        const cssSrc = path.resolve(__dirname, 'css');
        const cssDist = path.resolve(distDir, 'css');
        if (fs.existsSync(cssSrc)) {
          fs.cpSync(cssSrc, cssDist, { recursive: true });
        }

        const jsSrc = path.resolve(__dirname, 'js');
        const jsDist = path.resolve(distDir, 'js');
        if (fs.existsSync(jsSrc)) {
          fs.cpSync(jsSrc, jsDist, { recursive: true });
        }

        // 3. Copy the entire assets/ folder into dist/assets/
        const assetsSrc = path.resolve(__dirname, 'assets');
        const assetsDist = path.resolve(distDir, 'assets');
        if (fs.existsSync(assetsSrc)) {
          fs.cpSync(assetsSrc, assetsDist, { recursive: true });
        }

        // 4. Static subpage entry points for flawless routing on any CDN/host (Vercel/Netlify)
        ['about', 'playground'].forEach(route => {
          const routeDir = path.resolve(distDir, route);
          if (!fs.existsSync(routeDir)) fs.mkdirSync(routeDir, { recursive: true });
          fs.copyFileSync(path.resolve(distDir, 'index.html'), path.resolve(routeDir, 'index.html'));
        });
      }
    }
  ]
});
