@echo off
REM Stop AGC PM2 processes.
cd /d "%~dp0"
node "%~dp0scripts\pm2-launcher.mjs" pm2 delete scripts\ecosystem.config.cjs
exit /b %ERRORLEVEL%
