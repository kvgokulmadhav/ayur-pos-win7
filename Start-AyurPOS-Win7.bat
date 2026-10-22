@echo off
title AyurPOS ERP - Kottakkal Arya Vaidya Sala Dealership (Windows 7)
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

:: Determine Node.js binary
set "NODE_EXEC="
if exist "%~dp0node.exe" (
    set "NODE_EXEC=%~dp0node.exe"
    echo [INFO] Using local portable node.exe runtime.
) else (
    set "NODE_EXEC=node"
    echo [INFO] Using system Node.js.
)

echo [INFO] Starting AyurPOS server on http://localhost:3005 ...
echo [INFO] Keep this window open during shop hours.
echo.

:: Open browser
start "" http://localhost:3005

:: Launch Next.js standalone server
"%NODE_EXEC%" server.js

echo.
echo =====================================================================
echo  Server has stopped.
echo =====================================================================
pause
