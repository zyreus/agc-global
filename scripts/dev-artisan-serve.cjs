/**
 * Start `php artisan serve` for local API dev.
 * Windows: uses XAMPP / Laragon / PHP_BINARY when `php` is not on PATH.
 */
const { spawn, execSync } = require('child_process')
const fs = require('fs')
const net = require('net')
const path = require('path')

const { resolveApiPort } = require('./resolve-api-port.cjs')

const root = path.resolve(__dirname, '..')
const backend = path.join(root, 'backend')

function isPortListening(port) {
  if (process.platform === 'win32') {
    try {
      const out = execSync(`netstat -ano | findstr ":${port} "`, {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'ignore'],
      })
      return /LISTENING/i.test(out)
    } catch {
      return false
    }
  }
  return new Promise((resolve) => {
    const socket = net.connect({ port, host: '127.0.0.1' })
    socket.once('connect', () => {
      socket.destroy()
      resolve(true)
    })
    socket.once('error', () => resolve(false))
  })
}

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

async function main() {
  const apiPort = resolveApiPort()
  const inUse =
    process.platform === 'win32'
      ? isPortListening(apiPort)
      : await isPortListening(apiPort)

  if (inUse) {
    console.error(
      `[dev:api] Port ${apiPort} is already in use. Stop the other process or set AGC_API_PORT to a free port (e.g. 8021).`,
    )
    process.exit(1)
  }

  const phpBin = resolvePhpInterpreter()
  if (phpBin === 'php' && process.platform === 'win32') {
    try {
      execSync('php -v', { stdio: 'ignore' })
    } catch {
      console.error(
        '[dev:api] PHP not found on PATH. Install PHP, add it to PATH, or set PHP_BINARY (e.g. C:\\xampp\\php\\php.exe).',
      )
      process.exit(1)
    }
  }

  console.log(`[dev:api] Starting Laravel at http://127.0.0.1:${apiPort}`)

  const child = spawn(phpBin, ['artisan', 'serve', '--host=127.0.0.1', `--port=${apiPort}`], {
    cwd: backend,
    stdio: 'inherit',
    shell: false,
  })

  child.on('exit', (code, signal) => {
    if (signal) process.kill(process.pid, signal)
    process.exit(code ?? 0)
  })
}

main().catch((err) => {
  console.error('[dev:api]', err.message || err)
  process.exit(1)
})
