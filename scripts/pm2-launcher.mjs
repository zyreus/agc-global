/**
 * PM2 launcher with writable PM2_HOME fallback (fixes EPERM on project .pm2 logs).
 */
import { spawn, spawnSync } from 'node:child_process'
import crypto from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
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
  console.error('Usage: node scripts/pm2-launcher.mjs pm2 [args...]')
  process.exit(1)
}

const binName = forward[0]
let binArgs = forward.slice(1)
const bin = path.join(root, 'node_modules', 'pm2', 'bin', binName)

if (binName === 'pm2') {
  const pm2Bin = path.join(root, 'node_modules', 'pm2', 'bin', 'pm2')
  binArgs = resolvePm2StartAll(pm2Bin, binArgs)
  if (binArgs === null) process.exit(0)
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

function resolvePm2Home() {
  if (process.env.AGC_PM2_HOME) return path.resolve(process.env.AGC_PM2_HOME)

  const defaultHome = path.resolve(root, '.pm2')
  fs.mkdirSync(defaultHome, { recursive: true })
  const logPath = path.join(defaultHome, 'pm2.log')

  if (!fs.existsSync(logPath)) return defaultHome

  try {
    const fd = fs.openSync(logPath, 'a')
    fs.closeSync(fd)
    return defaultHome
  } catch {
    const fallback = path.join(
      process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local'),
      'agc-global-pm2',
    )
    console.warn(`[pm2] Using fallback PM2_HOME: ${fallback}`)
    return fallback
  }
}

function resolvePm2StartAll(pm2Bin, binArgs) {
  if (binArgs.length !== 2 || binArgs[0] !== 'start' || binArgs[1] !== 'all') return binArgs

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
    return ['start', 'process.config.json']
  }

  const stopped = list.filter((p) => {
    const st = p?.pm2_env?.status
    return ['stopped', 'stopping', 'errored', 'delayed', 'waiting restart'].includes(st)
  })

  if (stopped.length === 0) return null
  return binArgs
}
