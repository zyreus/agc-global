/**
 * PM2 frontend: production preview by default (reliable through Cloudflare).
 * Set AGC_VITE_MODE=dev for Vite HMR (npm run dev:full style).
 */
const { spawn } = require('child_process')
const path = require('path')

const root = path.resolve(__dirname, '..')
const frontend = path.join(root, 'frontend')
const viteBin = path.join(frontend, 'node_modules', 'vite', 'bin', 'vite.js')
const isDev = String(process.env.AGC_VITE_MODE || '').toLowerCase() === 'dev'
const node = process.execPath

function runNode(args, label) {
  return new Promise((resolve, reject) => {
    const child = spawn(node, [viteBin, ...args], {
      cwd: frontend,
      stdio: 'inherit',
      shell: false,
      env: { ...process.env },
    })
    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`[${label}] exited with code ${code}`))
    })
  })
}

function runDetached(args) {
  const child = spawn(node, [viteBin, ...args], {
    cwd: frontend,
    stdio: 'inherit',
    shell: false,
    env: { ...process.env },
  })
  child.on('exit', (code) => process.exit(code ?? 0))
  return child
}

async function main() {
  if (isDev) {
    console.log('[agc-vite] Dev mode (HMR) — unset AGC_VITE_MODE or use preview for PM2 + agctek.co')
    runDetached(['--host', '0.0.0.0'])
    return
  }

  console.log('[agc-vite] Building production bundle…')
  await runNode(['build'], 'build')

  console.log('[agc-vite] Starting preview on http://0.0.0.0:5172')
  runDetached(['preview', '--host', '0.0.0.0', '--port', '5172', '--strictPort'])
}

main().catch((err) => {
  console.error('[agc-vite]', err.message || err)
  process.exit(1)
})
