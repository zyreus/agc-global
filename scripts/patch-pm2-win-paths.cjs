/**
 * PM2 paths.js sets Windows named pipes *after* applying env overrides, so
 * PM2_DAEMON_RPC_PORT is ignored. Patch once so env wins (see pm2-with-project-pipes.mjs).
 * Idempotent; only runs on win32 when node_modules/pm2 exists.
 */
const fs = require('fs')
const path = require('path')

if (process.platform !== 'win32' && process.platform !== 'win64') {
  process.exit(0)
}

const target = path.join(__dirname, '..', 'node_modules', 'pm2', 'paths.js')
if (!fs.existsSync(target)) {
  process.exit(0)
}

let s = fs.readFileSync(target, 'utf8')
if (s.includes('PM2_AGC_HOME_PIPE_PATCH')) {
  process.exit(0)
}

const needle =
  "    pm2_file_stucture.DAEMON_RPC_PORT = '\\\\\\\\.\\\\pipe\\\\rpc.sock';\n" +
  "    pm2_file_stucture.DAEMON_PUB_PORT = '\\\\\\\\.\\\\pipe\\\\pub.sock';\n" +
  "    pm2_file_stucture.INTERACTOR_RPC_PORT = '\\\\\\\\.\\\\pipe\\\\interactor.sock';"

if (!s.includes(needle)) {
  console.warn('[patch-pm2-win-paths] PM2 paths.js does not match expected content; skip.')
  process.exit(0)
}

const replacement =
  '    // PM2_AGC_HOME_PIPE_PATCH: keep env overrides from the loop above\n' +
  "    if (!process.env.PM2_DAEMON_RPC_PORT)\n" +
  "      pm2_file_stucture.DAEMON_RPC_PORT = '\\\\\\\\.\\\\pipe\\\\rpc.sock';\n" +
  "    if (!process.env.PM2_DAEMON_PUB_PORT)\n" +
  "      pm2_file_stucture.DAEMON_PUB_PORT = '\\\\\\\\.\\\\pipe\\\\pub.sock';\n" +
  "    if (!process.env.PM2_INTERACTOR_RPC_PORT)\n" +
  "      pm2_file_stucture.INTERACTOR_RPC_PORT = '\\\\\\\\.\\\\pipe\\\\interactor.sock';"

fs.writeFileSync(target, s.replace(needle, replacement), 'utf8')
console.log('[patch-pm2-win-paths] Patched pm2/paths.js so Windows pipe env vars work.')
