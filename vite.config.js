import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// GitHub Pages project sites are served from /<repository-name>/.
// Change this if the repository is named differently, or set it to '/'
// for a user/organisation site or a custom domain.
const BASE = '/random-quote-generator/'

// https://vite.dev/config/
export default defineConfig({
  base: BASE,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Random Quote Generator',
        short_name: 'Random Quotes',
        description: 'Random proverbs and public-domain sayings, offline-ready.',
        theme_color: '#6366f1',
        background_color: '#f5f7fa',
        display: 'standalone',
        start_url: BASE,
        scope: BASE,
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any'
          }
        ]
      },
      workbox: {
        // The manifest icon (favicon.svg) is precached automatically by the plugin.
        globPatterns: ['**/*.{js,css,html,ico,png,json}'],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024
      }
    })
  ]
})
