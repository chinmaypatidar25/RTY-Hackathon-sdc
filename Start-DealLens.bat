@echo off
title DealLens AI - One Click Launcher
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0Start-DealLens.ps1"
if errorlevel 1 (
  echo.
  echo The startup check failed. Please screenshot this window for diagnostics.
  pause
)
