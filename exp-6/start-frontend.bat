@echo off
title Frontend - React (port 5173)
cd /d "%~dp0frontend"
if not exist node_modules (
  echo Installing frontend packages, first run only...
  call npm install
)
call npm run dev
pause
