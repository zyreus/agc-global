/**
 * PM2 on Windows uses fixed named pipes (\\.\pipe\rpc.sock), which causes
 * EPERM / conflicts with another PM2 or daemon. PM2 reads PM2_DAEMON_RPC_PORT
 * etc. from env (see node_modules/pm2/paths.js) — set unique pipes + local PM2_HOME.
 */
import { spawn } from 'node:child_process'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const pm2Home = path.resolve(root, '.pm2')
fs.mkdirSync(pm2Home, { recursive: true })

const env = { ...process.env, PM2_HOME: pm2Home }

if (process.platform === 'win32') {
  const id = crypto.createHash('sha1').update(pm2Home).digest('hex').slice(0, 10)
  env.PM2_DAEMON_RPC_PORT = `\\\\.\\pipe\\pm2-agc-${id}-rpc`
  env.PM2_DAEMON_PUB_PORT = `\\\\.\\pipe\\pm2-agc-${id}-pub`
  env.PM2_INTERACTOR_RPC_PORT = `\\\\.\\pipe\\pm2-agc-${id}-interactor`
}

const forward = process.argv.slice(2)
if (forward.length === 0) {
  console.error('Usage: node scripts/pm2-with-project-pipes.mjs <pm2|pm2-runtime> [args...]')
  process.exit(1)
}

const binName = forward[0]
const binArgs = forward.slice(1)
const bin = path.join(root, 'node_modules', 'pm2', 'bin', binName)

const child = spawn(process.execPath, [bin, ...binArgs], {
  stdio: 'inherit',
  cwd: root,
  env,
  windowsHide: false,
})

child.on('exit', (code, signal) => {
  if (signal) process.exit(1)
  process.exit(code === null ? 1 : code)
})
