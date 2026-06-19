@echo off
REM Delete all PM2 apps and start fresh (fixes stale config / port conflicts).
cd /d "%~dp0"
echo [pm2-clean] Stopping all registered apps...
node "%~dp0scripts\pm2-launcher.mjs" pm2 delete all
echo [pm2-clean] Starting scripts\ecosystem.config.cjs...
node "%~dp0scripts\pm2-launcher.mjs" pm2 start scripts\ecosystem.config.cjs --update-env
exit /b %ERRORLEVEL%
