# Project-local PM2 (same as .\pm2.cmd). PowerShell: .\pm2 start all
# (Bare "pm2" still requires PATH — dot-source .\scripts\use-project-pm2.ps1 first.)
Set-StrictMode -Version 1
$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
& node "$root\scripts\pm2-with-project-pipes.mjs" pm2 @args
exit $LASTEXITCODE
