@echo off
title AyurPOS - Kottakkal Arya Vaidya Sala Dealership (Windows 7)
color 0A

echo =====================================================================
echo  AyurPOS ERP - Kottakkal Arya Vaidya Sala Dealership (Windows 7)
echo =====================================================================
echo.

cd /d "%~dp0"

:: Set Environment Variables
set PORT=3005
set HOSTNAME=0.0.0.0
set DATABASE_URL=file:./prisma/ayur_pos.db
set NODE_ENV=production
set NODE_SKIP_PLATFORM_CHECK=1

:: Check for bundled portable Node or system Node
set NODE_EXEC=node
if exist "%~dp0runtime\node.exe" (
    set "NODE_EXEC=%~dp0runtime\node.exe"
    echo [INFO] Using bundled Windows 7 Node.js runtime.
) else if exist "%~dp0node.exe" (
    set "NODE_EXEC=%~dp0node.exe"
    echo [INFO] Using local node.exe runtime.
) else (
    where node >nul 2>nul
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Node.js was not found!
        echo.
        echo Please copy a Windows 7 compatible node.exe into this folder:
        echo   1. Download Node 16.20.2 zip: https://nodejs.org/dist/v16.20.2/node-v16.20.2-win-x64.zip
        echo   2. Extract node.exe and paste it right here next to this .bat file.
        echo.
        pause
        exit /b 1
    )
    echo [INFO] Using system Node.js.
)

echo [INFO] Starting AyurPOS server on http://localhost:3005 ...
echo [INFO] Keep this window open during shop hours.
echo [INFO] To stop the server when closing shop, close this window or run Stop-AyurPOS-Win7.bat.
echo.

:: Automatically open browser after 2 seconds
start "" cmd /c "timeout /t 2 /nobreak >nul & start http://localhost:3005"

:: Launch Next.js standalone production server
"%NODE_EXEC%" server.js

pause
