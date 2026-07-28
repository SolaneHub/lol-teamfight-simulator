import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'

import type { ViteDevServer, Connect } from 'vite'

import type { ServerResponse } from 'node:http'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Custom plugin to serve the local 'out/' directory at dev time and copy it at build time
const serveAndCopyOutPlugin = () => {
  return {
    name: 'serve-and-copy-out',
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req: Connect.IncomingMessage, res: ServerResponse, next: Connect.NextFunction) => {
        const url = req.url || ''
        if (url.startsWith('/out/')) {
          const safeUrl = url.replace('/out/', '').split('?')[0]
          const filePath = path.join(__dirname, 'out', safeUrl)
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const ext = path.extname(filePath).toLowerCase()
            let contentType = 'application/octet-stream'
            if (ext === '.png') contentType = 'image/png'
            else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg'
            else if (ext === '.json') contentType = 'application/json'
            else if (ext === '.svg') contentType = 'image/svg+xml'
            
            res.setHeader('Content-Type', contentType)
            res.setHeader('Access-Control-Allow-Origin', '*')
            fs.createReadStream(filePath).pipe(res)
            return
          }
        }
        next()
      })
    },
    closeBundle() {
      const src = path.resolve(__dirname, 'out')
      const dest = path.resolve(__dirname, 'dist/out')
      try {
        if (fs.existsSync(src)) {
          fs.cpSync(src, dest, { recursive: true, force: true })
          console.log('Successfully copied out/ to dist/out/')
        }
      } catch (err) {
        console.error('Error copying out/ to dist/out/:', err)
      }
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: '/lol-teamfight-simulator/',
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
    serveAndCopyOutPlugin(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
