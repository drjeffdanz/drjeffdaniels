import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

// Dev-only: serve the parent Next.js site's /public directory so shared assets
// (/sisters-quest/assets/portraits, /sisters-quest/assets/music) resolve the same
// way they do in production, where both games live on the same origin.
function parentPublic(): Plugin {
  const root = path.resolve(import.meta.dirname, '../../public')
  const mime: Record<string, string> = {
    '.mp3': 'audio/mpeg',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
  }
  return {
    name: 'serve-parent-public',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = (req.url || '').split('?')[0]
        if (!url.startsWith('/sisters-quest/')) return next()
        const file = path.join(root, decodeURIComponent(url))
        if (!file.startsWith(root) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
          return next()
        }
        res.setHeader('Content-Type', mime[path.extname(file)] ?? 'application/octet-stream')
        fs.createReadStream(file).pipe(res)
      })
    },
  }
}

export default defineConfig({
  base: '/sisters-quest-2/',
  plugins: [react(), parentPublic()],
})
