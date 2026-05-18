# Dot-source once per PowerShell session so bare "pm2" resolves to this repo's wrapper:
#   . .\scripts\use-project-pm2.ps1
# Then:
#   pm2 start all
#
# (Do not run with .\use-project-pm2.ps1 — that uses a child process and will not change your PATH.)

$root = Split-Path $PSScriptRoot
$sep = [System.IO.Path]::PathSeparator
$parts = $env:Path -split [Regex]::Escape($sep) | Where-Object { $_ -and $_ -ne $root }
$env:Path = "$root$sep$($parts -join $sep)"
Write-Host "PM2 wrapper on PATH for this session ($root). Try: pm2 start all" -ForegroundColor Green
