@echo off
title AyurPOS Database Backup
cd /d "%~dp0"
if not exist "backups" mkdir backups
set TIMESTAMP=%date:~-4%-%date:~3,2%-%date:~0,2%_%time:~0,2%-%time:~3,2%-%time:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%
copy "prisma\ayur_pos.db" "backups\ayur_pos_backup_%TIMESTAMP%.db" /y
echo [SUCCESS] Backup created in backups\ayur_pos_backup_%TIMESTAMP%.db
timeout /t 3 >nul
