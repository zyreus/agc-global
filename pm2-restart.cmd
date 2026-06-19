@echo off
REM Restart AGC dev stack (Laravel API + Vite) via PM2.
cd /d "%~dp0"
node "%~dp0scripts\pm2-launcher.mjs" pm2 startOrRestart scripts\ecosystem.config.cjs --update-env
exit /b %ERRORLEVEL%
