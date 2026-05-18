/**
 * PM2: Laravel API + Vite dev server (same stack as npm run dev:full).
 *
 * Daemon (background):  npm run dev:pm2
 * Stop / remove:        npm run dev:pm2:stop
 * Logs:                 npm run dev:pm2:logs
 * Foreground (Ctrl+C): npm run dev:pm2:fg   — like concurrently; useful for Docker
 *
 * Requires `php` on PATH (e.g. XAMPP: add C:\xampp\php).
 * On Windows, npm scripts use scripts/pm2-with-project-pipes.mjs so PM2 does not
 * fight the global \\.\pipe\rpc.sock (EPERM).
 */
const path = require('path')

const root = __dirname

module.exports = {
  apps: [
    {
      name: 'agc-api',
      cwd: path.join(root, 'backend'),
      script: 'artisan',
      interpreter: 'php',
      args: 'serve --host=127.0.0.1 --port=8201',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
    },
    {
      name: 'agc-vite',
      cwd: path.join(root, 'frontend'),
      script: 'node_modules/vite/bin/vite.js',
      interpreter: 'node',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
    },
  ],
}
