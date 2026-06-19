@echo off
REM Tail PM2 logs for AGC dev stack.
cd /d "%~dp0"
node "%~dp0scripts\pm2-launcher.mjs" pm2 logs
exit /b %ERRORLEVEL%
