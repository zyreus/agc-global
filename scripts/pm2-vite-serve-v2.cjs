/**
 * PM2 frontend (v2): frees port 5172, skips rebuild when AGC_SKIP_BUILD=1.
 */
const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')
const { freePort } = require('./free-port.cjs')

const root = path.resolve(__dirname, '..')
const frontend = path.join(root, 'frontend')
const buildIndex = path.join(root, 'backend', 'public', 'app', 'index.html')
const viteBin = path.join(frontend, 'node_modules', 'vite', 'bin', 'vite.js')
const vitePort = Number(process.env.AGC_VITE_PORT || 5172)
const isDev = String(process.env.AGC_VITE_MODE || '').toLowerCase() === 'dev'
const skipBuild = String(process.env.AGC_SKIP_BUILD || '').toLowerCase() === '1'
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

function needsBuild() {
  if (isDev) return false
  if (skipBuild && fs.existsSync(buildIndex)) return false
  return true
}

async function main() {
  freePort(vitePort, 'agc-vite')

  if (isDev) {
    console.log('[agc-vite] Dev mode (HMR)')
    runDetached(['--host', '0.0.0.0', '--port', String(vitePort), '--strictPort'])
    return
  }

  if (needsBuild()) {
    console.log('[agc-vite] Building production bundle…')
    await runNode(['build'], 'build')
  } else {
    console.log('[agc-vite] Skipping build (output present / AGC_SKIP_BUILD=1)')
  }

  console.log(`[agc-vite] Starting preview on http://0.0.0.0:${vitePort}`)
  runDetached(['preview', '--host', '0.0.0.0', '--port', String(vitePort), '--strictPort'])
}

main().catch((err) => {
  console.error('[agc-vite]', err.message || err)
  process.exit(1)
})
