import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  server: {
    port: 3000,
    open: false,
    host: true
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

        // 1. Root SEO, configuration, and chrome files
        const rootFiles = ['robots.txt', 'sitemap.xml', 'site.webmanifest', 'favicon.ico', 'vercel.json'];
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
      }
    }
  ]
});
