/**
 * PM2 on Windows uses fixed named pipes (\\.\pipe\rpc.sock), which causes
 * EPERM / conflicts with another PM2 or daemon. PM2 reads PM2_DAEMON_RPC_PORT
 * etc. from env (see node_modules/pm2/paths.js) — set unique pipes + local PM2_HOME.
 */
import { spawn, spawnSync } from 'node:child_process'
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
  console.error(
    'Usage: node scripts/pm2-with-project-pipes.mjs <pm2|pm2-runtime> [args...]\n' +
      'Examples: npm run pm2 -- start all    npm run pm2 -- list    scripts\\pm2.cmd start all',
  )
  process.exit(1)
}

const binName = forward[0]
let binArgs = forward.slice(1)
const bin = path.join(root, 'node_modules', 'pm2', 'bin', binName)

if (binName === 'pm2') {
  const pm2Bin = path.join(root, 'node_modules', 'pm2', 'bin', 'pm2')
  binArgs = resolvePm2StartAll(pm2Bin, binArgs)
  if (binArgs === null) {
    process.exit(0)
  }
}

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

/**
 * `pm2 start all` only starts stopped apps; with an empty process list PM2 prints
 * "No process found". Bootstrap from ecosystem when nothing is registered yet.
 * @returns {string[]|null} args for pm2 (after `pm2`), or null = already handled (exit 0)
 */
function resolvePm2StartAll(pm2Bin, binArgs) {
  if (binArgs.length !== 2 || binArgs[0] !== 'start' || binArgs[1] !== 'all') {
    return binArgs
  }

  const r = spawnSync(process.execPath, [pm2Bin, 'jlist'], {
    env,
    cwd: root,
    encoding: 'utf8',
    windowsHide: false,
  })

  let list = []
  try {
    list = JSON.parse(r.stdout || '[]')
  } catch {
    list = []
  }

  if (!Array.isArray(list) || list.length === 0) {
    console.log(
      '[pm2] No apps in this project PM2 yet; starting ecosystem.config.cjs (same as npm run dev:pm2).',
    )
    return ['start', 'ecosystem.config.cjs']
  }

  const stopped = list.filter((p) => {
    const st = p?.pm2_env?.status
    return (
      st === 'stopped' ||
      st === 'stopping' ||
      st === 'errored' ||
      st === 'delayed' ||
      st === 'waiting restart'
    )
  })

  if (stopped.length === 0) {
    console.log(
      '[pm2] All apps already online; nothing to start. Use npm run dev:pm2:restart to reload.',
    )
    return null
  }

  return binArgs
}
