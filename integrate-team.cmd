@echo off
REM Grants write access and integrates the Team section (run as Administrator if prompted).
cd /d "%~dp0"
echo Fixing permissions on frontend source files...
icacls "frontend\src\pages\Home.jsx" /grant "BUILTIN\Users:(M)" >nul 2>&1
icacls "frontend\src\components\Header.jsx" /grant "BUILTIN\Users:(M)" >nul 2>&1
icacls "frontend\src\components\Footer.jsx" /grant "BUILTIN\Users:(M)" >nul 2>&1
powershell -ExecutionPolicy Bypass -File "scripts\integrate-team-section.ps1"
if %ERRORLEVEL% neq 0 (
  echo.
  echo Integration failed. Run this file as Administrator, or apply scripts\team-section.patch manually.
  exit /b 1
)
echo.
echo Building frontend...
cd frontend
call npm run build
exit /b %ERRORLEVEL%
