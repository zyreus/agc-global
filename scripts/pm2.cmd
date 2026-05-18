@echo off
REM Project PM2 (local PM2_HOME + Windows pipes). From repo root: scripts\pm2.cmd start all
cd /d "%~dp0.."
node "%~dp0pm2-with-project-pipes.mjs" pm2 %*
