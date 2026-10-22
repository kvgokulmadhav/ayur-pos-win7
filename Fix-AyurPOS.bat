@echo off
title AyurPOS Win7 Auto-Patcher
color 0B
echo ===================================================
echo  AyurPOS Windows 7 Patch Utility
echo ===================================================
echo.
cd /d "%~dp0"

set "NODE_EXEC=node"
if exist "%~dp0node.exe" set "NODE_EXEC=%~dp0node.exe"

"%NODE_EXEC%" -e "const fs=require('fs');let c=fs.readFileSync('server.js','utf8');if(!c.includes('@edge-runtime')){c=c.replace('require(\'next\')','try{const p=require(\'./node_modules/next/dist/compiled/@edge-runtime/primitives\');for(const [k,v] of Object.entries(p)){try{if(typeof globalThis[k]===\'undefined\')globalThis[k]=v;}catch(e){}}}catch(e){}\nrequire(\'next\')');fs.writeFileSync('server.js',c);console.log('[SUCCESS] server.js patched for Windows 7!');}else{console.log('[INFO] server.js already up to date.');}"

echo.
echo You can now double-click Start-AyurPOS-Win7.bat!
pause
