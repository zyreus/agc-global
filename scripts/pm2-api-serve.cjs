/**
 * PM2 Laravel API wrapper: free port before artisan serve (prevents orphan listeners).
 */
const { spawn } = require('child_process')
const path = require('path')
const { freePort } = require('./free-port.cjs')

const backend = path.resolve(__dirname, '..', 'backend')
const port = Number(process.env.AGC_API_PORT || 8201)
const php =
  process.env.PHP_BINARY ||
  process.env.PHP_PATH ||
  (require('fs').existsSync('C:\\xampp\\php\\php.exe') ? 'C:\\xampp\\php\\php.exe' : 'php')

freePort(port, 'agc-api')

const child = spawn(php, ['artisan', 'serve', '--host=127.0.0.1', `--port=${port}`], {
  cwd: backend,
  stdio: 'inherit',
  shell: false,
})

child.on('error', (err) => {
  console.error('[agc-api]', err.message || err)
  process.exit(1)
})
child.on('exit', (code) => process.exit(code ?? 0))
