/**
 * Free a TCP port on Windows/Linux before PM2 starts a server.
 * Kills LISTENING processes bound to the port (stale Vite/artisan orphans).
 */
const { execSync } = require('child_process')

/**
 * @param {number} port
 * @param {string} [label]
 */
function freePort(port, label = String(port)) {
  const pids = findListeningPids(port)
  if (pids.length === 0) return

  console.log(`[free-port] Releasing :${port} (${label}) — stopping PID(s): ${pids.join(', ')}`)
  for (const pid of pids) {
    try {
      if (process.platform === 'win32') {
        execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' })
      } else {
        process.kill(Number(pid), 'SIGTERM')
      }
    } catch {
      /* already gone */
    }
  }
}

/**
 * @param {number} port
 * @returns {string[]}
 */
function findListeningPids(port) {
  const pids = new Set()
  try {
    if (process.platform === 'win32') {
      const out = execSync(`netstat -ano -p tcp`, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 })
      const suffix = `:${port}`
      for (const line of out.split('\n')) {
        if (!line.includes('LISTENING') || !line.includes(suffix)) continue
        const parts = line.trim().split(/\s+/)
        const local = parts[1] || ''
        if (!local.endsWith(suffix)) continue
        const pid = parts[parts.length - 1]
        if (pid && /^\d+$/.test(pid) && pid !== '0') pids.add(pid)
      }
    } else {
      const out = execSync(`lsof -ti tcp:${port} -sTCP:LISTEN`, { encoding: 'utf8' })
      for (const pid of out.split('\n').map((s) => s.trim()).filter(Boolean)) pids.add(pid)
    }
  } catch {
    /* port likely free */
  }
  return [...pids]
}

module.exports = { freePort, findListeningPids }
