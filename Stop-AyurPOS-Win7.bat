@echo off
title Stop AyurPOS
echo Stopping AyurPOS server running on port 3005...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3005 ^| findstr LISTENING') do (
    taskkill /f /pid %%a >nul 2>nul
)
echo AyurPOS stopped successfully.
timeout /t 2 >nul
