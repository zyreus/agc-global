@echo off
REM Start AGC dev stack via PM2.
cd /d "%~dp0"
node "%~dp0scripts\pm2-launcher.mjs" pm2 start scripts\ecosystem.config.cjs --update-env
exit /b %ERRORLEVEL%
