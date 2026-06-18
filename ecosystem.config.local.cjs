/**
 * Optimized PM2 ecosystem (local) — fixes port conflicts and restart storms.
 * Start: node scripts/pm2-launcher.mjs pm2 startOrRestart ecosystem.config.local.cjs --update-env
 */
const fs = require('fs')
const path = require('path')
const { resolveApiPort } = require('./scripts/resolve-api-port.cjs')

const root = __dirname
const apiPort = resolveApiPort()

const sharedPm2 = {
  autorestart: true,
  watch: false,
  max_memory_restart: '500M',
  restart_delay: 5000,
  min_uptime: '10s',
  max_restarts: 15,
  exp_backoff_restart_delay: 200,
  kill_timeout: 8000,
}

module.exports = {
  apps: [
    {
      name: 'agc-api',
      cwd: root,
      script: path.join(root, 'scripts', 'pm2-api-serve.cjs'),
      interpreter: 'node',
      env: {
        AGC_API_PORT: String(apiPort),
        PHP_BINARY: resolvePhp(),
      },
      ...sharedPm2,
    },
    {
      name: 'agc-vite',
      cwd: root,
      script: path.join(root, 'scripts', 'pm2-vite-serve-v2.cjs'),
      interpreter: 'node',
      env: {
        AGC_API_PORT: String(apiPort),
        AGC_VITE_PORT: '5172',
        AGC_SKIP_BUILD: '1',
      },
      ...sharedPm2,
    },
  ],
}

function resolvePhp() {
  const fromEnv = process.env.PHP_BINARY || process.env.PHP_PATH
  if (fromEnv && fs.existsSync(fromEnv)) return fromEnv
  const xampp = 'C:\\xampp\\php\\php.exe'
  if (fs.existsSync(xampp)) return xampp
  return 'php'
}
