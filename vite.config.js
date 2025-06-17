import { defineConfig } from 'vite'

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
    }
  ]
}) 