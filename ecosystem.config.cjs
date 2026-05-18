/**
 * PM2: Laravel API + Vite dev server (same stack as npm run dev:full).
 *
 * First start (register apps): npm run dev:pm2   (or: npm run pm2 -- start ecosystem.config.cjs)
 * Daemon (background):        npm run dev:pm2
 * Then start everything stopped: npm run pm2:start:all   (same as: npm run pm2 -- start all; bootstraps ecosystem if empty)
 * Windows: .\\pm2.cmd start all   or   .\\pm2 start all   (PowerShell; leading .\\ is required.)
 * Bare "pm2" in PowerShell: dot-source once, then pm2 works for that session:
 *   . .\\scripts\\use-project-pm2.ps1
 *   pm2 start all
 * (Use "pm2 start all" — not "pm2 -- start all"; "--" is for npm only.)
 * Stop / remove:        npm run dev:pm2:stop
 * Logs:                 npm run dev:pm2:logs
 * Foreground (Ctrl+C): npm run dev:pm2:fg   — like concurrently; useful for Docker
 *
 * Note: PM2 may log "[WARN] Applications … not running, starting…" on start/restart;
 * that only means it is launching processes, not that something is wrong.
 *
 * PHP for agc-api: PM2 needs a real interpreter path on Windows if `php` is not on PATH.
 * Auto-detects XAMPP / Laragon, or set PHP_BINARY (full path to php.exe) in the environment.
 * On Windows, npm scripts use scripts/pm2-with-project-pipes.mjs so PM2 does not
 * fight the global \\.\pipe\rpc.sock (EPERM).
 */
const fs = require('fs')
const path = require('path')
const { resolveApiPort } = require('./scripts/resolve-api-port.cjs')

const root = __dirname
const apiPort = resolveApiPort()

/** @returns {string} interpreter for PM2 (absolute php.exe on Windows when found) */
function resolvePhpInterpreter() {
  const fromEnv = process.env.PHP_BINARY || process.env.PHP_PATH
  if (fromEnv) {
    const p = path.normalize(String(fromEnv).replace(/^["']|["']$/g, ''))
    if (fs.existsSync(p)) return p
  }

  if (process.platform === 'win32') {
    const fromHtdocs = path.resolve(root, '..', '..', 'php', 'php.exe')
    if (fs.existsSync(fromHtdocs)) return path.normalize(fromHtdocs)

    const xampp = 'C:\\xampp\\php\\php.exe'
    if (fs.existsSync(xampp)) return xampp

    try {
      const laragonBase = 'C:\\laragon\\bin\\php'
      if (fs.existsSync(laragonBase)) {
        for (const name of fs.readdirSync(laragonBase)) {
          const exe = path.join(laragonBase, name, 'php.exe')
          if (fs.existsSync(exe)) return exe
        }
      }
    } catch {
      /* ignore */
    }
  }

  return 'php'
}

const phpBin = resolvePhpInterpreter()

module.exports = {
  apps: [
    {
      name: 'agc-api',
      cwd: path.join(root, 'backend'),
      script: 'artisan',
      interpreter: phpBin,
      args: `serve --host=127.0.0.1 --port=${apiPort}`,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
    },
    {
      name: 'agc-vite',
      cwd: root,
      script: path.join(root, 'scripts', 'pm2-vite-serve.cjs'),
      interpreter: 'node',
      env: {
        AGC_API_PORT: String(apiPort),
        // Production preview (no @vite/client) — reliable through Cloudflare. Use AGC_VITE_MODE=dev for HMR.
      },
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
    },
  ],
}
