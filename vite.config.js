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
      name: 'copy-seo-files',
      closeBundle() {
        const distDir = path.resolve(__dirname, 'dist');
        if (fs.existsSync(distDir)) {
          const files = ['robots.txt', 'sitemap.xml', 'site.webmanifest', 'favicon.ico'];
          files.forEach(f => {
            const src = path.resolve(__dirname, f);
            if (fs.existsSync(src)) {
              fs.copyFileSync(src, path.resolve(distDir, f));
            }
          });
          const ogCardSrc = path.resolve(__dirname, 'assets', 'og-card.jpg');
          const ogCardDist = path.resolve(distDir, 'assets', 'og-card.jpg');
          if (fs.existsSync(ogCardSrc) && fs.existsSync(path.resolve(distDir, 'assets'))) {
            fs.copyFileSync(ogCardSrc, ogCardDist);
          }
          ['favicon-32.png', 'favicon-180.png'].forEach(fav => {
            const favSrc = path.resolve(__dirname, 'assets', fav);
            const favDist = path.resolve(distDir, 'assets', fav);
            if (fs.existsSync(favSrc) && fs.existsSync(path.resolve(distDir, 'assets'))) {
              fs.copyFileSync(favSrc, favDist);
            }
          });

          // Recursively copy dynamic asset folders used by JS (playground, projects)
          const playgroundSrc = path.resolve(__dirname, 'assets', 'playground');
          const playgroundDist = path.resolve(distDir, 'assets', 'playground');
          if (fs.existsSync(playgroundSrc)) {
            fs.cpSync(playgroundSrc, playgroundDist, { recursive: true });
          }

          const projectsSrc = path.resolve(__dirname, 'assets', 'projects');
          const projectsDist = path.resolve(distDir, 'assets', 'projects');
          if (fs.existsSync(projectsSrc)) {
            fs.cpSync(projectsSrc, projectsDist, { recursive: true });
          }
        }
      }
    }
  ]
});
