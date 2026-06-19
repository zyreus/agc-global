/**
 * Production build with Team Section auto-injection (no source file edits required).
 * Usage: node scripts/build-with-team.cjs
 */
const { spawnSync } = require('child_process')
const path = require('path')

const root = path.resolve(__dirname, '..')
const frontend = path.join(root, 'frontend')
const viteBin = path.join(frontend, 'node_modules', 'vite', 'bin', 'vite.js')
const viteConfig = path.join(frontend, 'vite.config.team.mjs')

console.log('[build-with-team] Building frontend with Team Section injection…')

const result = spawnSync(process.execPath, [viteBin, 'build', '--config', viteConfig], {
  cwd: frontend,
  stdio: 'inherit',
  env: { ...process.env },
})

process.exit(result.status ?? 1)
