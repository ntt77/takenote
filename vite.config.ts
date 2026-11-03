import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import crypto from 'node:crypto';

const devAuthPlugin = () => ({
  name: 'dev-api-auth',
  apply: 'serve',
  configureServer(server: any) {
    server.middlewares.use((req: any, res: any, next: any) => {
      if (req.url === '/api/auth') {
        const expectedHash = process.env.APP_PASSWORD || crypto.createHash('sha256').update('123456').digest('hex');

        if (req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ required: true, devMode: true }));
          return;
        }

        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => (body += chunk));
          req.on('end', () => {
            try {
              const { password } = JSON.parse(body);
              const inputHash = crypto
                .createHash('sha256')
                .update(password || '')
                .digest('hex');
              if (inputHash === expectedHash.trim().toLowerCase()) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
              } else {
                res.statusCode = 401;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Incorrect password' }));
              }
            } catch {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Bad request' }));
            }
          });
          return;
        }
      }
      next();
    });
  },
});

export default defineConfig({
  plugins: [react(), devAuthPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: false,
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) {
              return 'react-vendor';
            }
            if (id.includes('codemirror')) {
              return 'codemirror-vendor';
            }
            if (id.includes('prettier')) {
              return 'prettier-vendor';
            }
            if (id.includes('jszip')) {
              return 'jszip-vendor';
            }
          }
        },
      },
    },
  },
});
