/**
 * PM2 launcher with writable PM2_HOME fallback.
 * Use when project .pm2 is read-only (EPERM on pm2.log).
 *
 * Examples:
 *   node scripts/pm2-launcher.mjs pm2 startOrRestart ecosystem.config.cjs --update-env
 *   .\pm2-restart.cmd
 */
import { spawn, spawnSync } from 'node:child_process'
import crypto from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const ecosystemFile = process.env.AGC_PM2_ECOSYSTEM || path.join('scripts', 'ecosystem.config.cjs')
const pm2Home = resolvePm2Home()

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
    'Usage: node scripts/pm2-launcher.mjs <pm2|pm2-runtime> [args...]\n' +
      'Examples:\n' +
      '  node scripts/pm2-launcher.mjs pm2 startOrRestart ecosystem.config.cjs --update-env\n' +
      '  node scripts/pm2-launcher.mjs pm2 list\n' +
      '  .\\pm2-restart.cmd',
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

console.log(`[pm2] PM2_HOME=${pm2Home}`)

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

/** Prefer project .pm2; fall back to %LOCALAPPDATA%\\agc-global-pm2 when not writable. */
function resolvePm2Home() {
  if (process.env.AGC_PM2_HOME) {
    return path.resolve(process.env.AGC_PM2_HOME)
  }

  const projectHome = path.resolve(root, '.pm2')
  if (isPm2HomeWritable(projectHome)) {
    return projectHome
  }

  const fallback = path.join(
    process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local'),
    'agc-global-pm2',
  )

  console.warn(
    `[pm2] Project .pm2 is not writable (${projectHome}).\n` +
      `[pm2] Using fallback PM2_HOME: ${fallback}\n` +
      `[pm2] To fix permanently, run as admin: icacls "${projectHome}" /grant Users:(OI)(CI)M`,
  )

  return fallback
}

/** Test whether PM2 can append to pm2.log in this directory. */
function isPm2HomeWritable(home) {
  try {
    fs.mkdirSync(home, { recursive: true })
    const logPath = path.join(home, 'pm2.log')
    const fd = fs.openSync(logPath, 'a')
    fs.closeSync(fd)
    return true
  } catch {
    return false
  }
}

/**
 * `pm2 start all` only starts stopped apps; bootstrap from ecosystem when empty.
 * @returns {string[]|null} args for pm2, or null = already handled (exit 0)
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
    console.log(`[pm2] No apps registered yet; starting ${ecosystemFile}.`)
    return ['start', ecosystemFile]
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
    console.log('[pm2] All apps already online. Use pm2-restart.cmd or npm run dev:pm2:restart to reload.')
    return null
  }

  return binArgs
}
