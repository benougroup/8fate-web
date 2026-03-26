import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import manifest from "@assets/data/images_manifest.json"
import path from 'path'
export default defineConfig({
  base: './', // needed for bundling into iOS app
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@services': path.resolve('/home/ubuntu/8fate/packages/services'),
      '@assets': path.resolve('/home/ubuntu/8fate/assets'),
      // Can drop
      '@ui': path.resolve('/home/ubuntu/8fate/packages/ui'), 
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true,
    cors: true,
    fs: {
      allow: [
        path.resolve(__dirname, '.'),
        '/home/ubuntu/8fate/packages',
        '/home/ubuntu/8fate/assets',
      ],
    },
  },
})
