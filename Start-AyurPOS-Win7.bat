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

:: Check for bundled portable Node or local node.exe
set NODE_EXEC=
if exist "%~dp0runtime\node.exe" (
    set "NODE_EXEC=%~dp0runtime\node.exe"
    echo [INFO] Using bundled Windows 7 Node.js runtime.
) else if exist "%~dp0node.exe" (
    set "NODE_EXEC=%~dp0node.exe"
    echo [INFO] Using local portable node.exe runtime.
) else (
    where node >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        :: Check if system node is at least v16
        for /f "tokens=1 delims=." %%v in ('node -v 2^>nul') do set SYS_VER=%%v
        setlocal enabledelayedexpansion
        set NUM_VER=!SYS_VER:v=!
        if !NUM_VER! LSS 16 (
            echo [WARNING] Your system Node.js is too old (!SYS_VER!).
            echo Next.js requires Node.js v16 or v18 to run.
            echo.
        ) else (
            endlocal
            set NODE_EXEC=node
            echo [INFO] Using system Node.js.
        )
        if defined SYS_VER endlocal
    )
)

if "%NODE_EXEC%"=="" (
    echo =====================================================================
    echo  [ACTION REQUIRED] Portable Node.js for Windows 7 is needed
    echo =====================================================================
    echo.
    echo  Your current system Node.js is an old version (like Node 10/12)
    echo  that crashes on modern JavaScript syntax.
    echo.
    echo  EASY 1-MINUTE FIX:
    echo  1. Download the portable Node.js 16.20.2 zip:
    echo     https://nodejs.org/dist/v16.20.2/node-v16.20.2-win-x64.zip
    echo     (or Node 18 for Win7: https://github.com/Alex313031/node18-win7/releases)
    echo.
    echo  2. Open the downloaded zip, copy node.exe, and paste it directly
    echo     inside this folder:
    echo     "%~dp0node.exe"
    echo.
    echo  3. Run Start-AyurPOS-Win7.bat again!
    echo =====================================================================
    echo.
    pause
    exit /b 1
)

:: Check for .next build folder
if not exist "%~dp0.next\BUILD_ID" (
    if exist "%~dp0ayur-pos-win7-main\.next\BUILD_ID" (
        echo [INFO] Detected files inside ayur-pos-win7-main subfolder.
        echo [INFO] Moving files to %~dp0 ...
        xcopy /E /Y /I "%~dp0ayur-pos-win7-main\*" "%~dp0" >nul 2>nul
    ) else if exist "%~dp0ayur-pos-win7\.next\BUILD_ID" (
        echo [INFO] Detected files inside ayur-pos-win7 subfolder.
        echo [INFO] Moving files to %~dp0 ...
        xcopy /E /Y /I "%~dp0ayur-pos-win7\*" "%~dp0" >nul 2>nul
    )
)

if not exist "%~dp0.next\BUILD_ID" (
    echo =====================================================================
    echo  [ERROR] Cannot find the compiled app folder (.next\BUILD_ID)
    echo =====================================================================
    echo.
    echo  The application requires the '.next' folder to run.
    echo.
    echo  Current directory: %~dp0
    echo  Current folder contents:
    dir /b /a "%~dp0"
    echo.
    echo  Make sure you extracted the full repo (including the '.next' folder).
    echo =====================================================================
    echo.
    pause
    exit /b 1
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
