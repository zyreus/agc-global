# Stable PM2 start (writable PM2_HOME + optimized ecosystem)
Set-StrictMode -Version 1
$ErrorActionPreference = 'Continue'
$root = $PSScriptRoot
Set-Location $root

if (-not (Test-Path "$root\backend\public\app\index.html")) {
  Write-Host "[start-pm2] Building frontend first…" -ForegroundColor Yellow
  npm run build:vite
}

& node "$root\scripts\pm2-launcher.mjs" pm2 delete all 2>&1 | Out-Null
& node "$root\scripts\pm2-launcher.mjs" pm2 start process.config.json --update-env
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
& node "$root\scripts\pm2-launcher.mjs" pm2 list
Write-Host "`nLogs: node scripts\pm2-launcher.mjs pm2 logs" -ForegroundColor Green
exit 0
