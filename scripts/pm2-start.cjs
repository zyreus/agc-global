/**
 * Cross-platform entry for npm run pm2:start (mirrors start-pm2.ps1).
 */
const { spawnSync } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')

const root = path.join(__dirname, '..')
const launcher = path.join(__dirname, 'pm2-launcher.mjs')
const indexHtml = path.join(root, 'backend', 'public', 'app', 'index.html')

if (!fs.existsSync(indexHtml)) {
  console.log('[pm2:start] Building frontend first…')
  const build = spawnSync('npm', ['run', 'build:vite'], {
    stdio: 'inherit',
    cwd: root,
    shell: true,
  })
  if (build.status !== 0) process.exit(build.status || 1)
}

function runPm2(args) {
  return spawnSync(process.execPath, [launcher, 'pm2', ...args], {
    stdio: 'inherit',
    cwd: root,
  })
}

runPm2(['delete', 'all'])
const start = runPm2(['start', 'process.config.json', '--update-env'])
if (start.status !== 0) process.exit(start.status || 1)

runPm2(['list'])
console.log('\nLogs: npm run pm2:logs')
