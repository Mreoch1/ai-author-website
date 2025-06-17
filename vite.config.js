import { defineConfig } from 'vite'
import { resolve } from 'path'
import fs from 'fs'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        privacy: 'privacy-policy.html',
        terms: 'terms.html',
        cookie: 'cookie-policy.html'
      }
    }
  },
  plugins: [
    {
      name: 'copy-static-files',
      async writeBundle() {
        // Static files will be copied automatically since they're referenced in HTML
      }
    },
    {
      name: 'copy-sitemap',
      writeBundle() {
        // Ensure dist directory exists
        if (!fs.existsSync('dist')) {
          fs.mkdirSync('dist')
        }
        // Copy sitemap.xml to dist
        fs.copyFileSync('sitemap.xml', 'dist/sitemap.xml')
      }
    }
  ]
}) 