# Fix project .pm2 permissions so npm run dev:pm2:restart works without fallback.
# Run PowerShell as Administrator from project root:
#   powershell -ExecutionPolicy Bypass -File scripts\fix-pm2-permissions.ps1

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$pm2Dir = Join-Path $root '.pm2'

if (-not (Test-Path $pm2Dir)) {
    New-Item -ItemType Directory -Path $pm2Dir -Force | Out-Null
}

# Grant Modify to Users group on .pm2 and inherit to children
icacls $pm2Dir /grant 'BUILTIN\Users:(OI)(CI)M' /T

Write-Host "Fixed permissions on $pm2Dir" -ForegroundColor Green
Write-Host "You can now use: npm run dev:pm2:restart" -ForegroundColor Green
