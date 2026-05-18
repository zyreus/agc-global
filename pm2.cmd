@echo off
REM Local PM2 (project .pm2 + Windows pipes). Usage from this folder:  pm2.cmd start all
set "ROOT=%~dp0"
cd /d "%ROOT%"
node "%ROOT%scripts\pm2-with-project-pipes.mjs" pm2 %*
