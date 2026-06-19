@echo off
REM List PM2 processes for this project.
cd /d "%~dp0"
node "%~dp0scripts\pm2-launcher.mjs" pm2 list
exit /b %ERRORLEVEL%
