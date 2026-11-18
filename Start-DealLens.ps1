$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location -LiteralPath $root

function Fail([string]$message) {
    Write-Host ""
    Write-Host "DEALLENS STARTUP ERROR: $message" -ForegroundColor Red
    Write-Host "If you need support, copy or screenshot this terminal message."
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor DarkGreen
Write-Host " DealLens AI - Local Startup" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor DarkGreen
Write-Host ""

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Fail "Node.js was not found. Install Node.js 20.9+ LTS from https://nodejs.org and reopen this launcher."
}
if (-not (Get-Command npm.cmd -ErrorAction SilentlyContinue)) {
    Fail "npm was not found. Reinstall Node.js LTS from https://nodejs.org."
}
$nodeVersion = (& node --version).Trim()
$majorVersion = [int](($nodeVersion -replace '^v','').Split('.')[0])
if ($majorVersion -lt 20) {
    Fail "Your Node.js is $nodeVersion. This app requires Node.js 20.9+ (or a newer LTS)."
}
Write-Host "Node.js $nodeVersion detected." -ForegroundColor Green

if (-not (Test-Path -LiteralPath (Join-Path $root "node_modules/next"))) {
    Write-Host "Installing dependencies for the first run..."
    & npm.cmd install --no-audit --no-fund
    if ($LASTEXITCODE -ne 0) { Fail "npm install failed. See the errors above." }
}

function IsDealLensRunning([int]$port) {
    try {
        $result = Invoke-RestMethod -Uri "http://127.0.0.1:$port/api/health" -Method Get -TimeoutSec 2 -ErrorAction Stop
        return ($result.status -eq "ok" -and $result.app -eq "DealLens AI")
    }
    catch { return $false }
}

# Reuse the existing running app if it is already available.
foreach ($candidate in 3000..3010) {
    if (IsDealLensRunning $candidate) {
        Write-Host "DealLens is already running on port $candidate." -ForegroundColor Green
        Start-Process "http://127.0.0.1:$candidate"
        exit 0
    }
}

$port = $null
foreach ($candidate in 3000..3010) {
    $listener = Get-NetTCPConnection -State Listen -LocalPort $candidate -ErrorAction SilentlyContinue
    if (-not $listener) { $port = $candidate; break }
}
if ($null -eq $port) {
    Fail "Ports 3000 through 3010 are busy. Close unused local servers and retry."
}

Write-Host "Starting DealLens on http://127.0.0.1:$port" -ForegroundColor Green
Write-Host "A separate terminal will run the app. Keep it open."
Start-Process -FilePath "cmd.exe" -ArgumentList @("/k", "npm run dev -- --port $port") -WorkingDirectory $root

Write-Host "Checking server readiness..."
$ready = $false
for ($i=0; $i -lt 90; $i++) {
    if (IsDealLensRunning $port) { $ready = $true; break }
    Start-Sleep -Seconds 1
}

if (-not $ready) {
    Fail "The local app did not become ready. Check the new server terminal for its error output."
}

Write-Host "DealLens is running. Opening your default Windows browser..." -ForegroundColor Green
Start-Process "http://127.0.0.1:$port"
Write-Host "Done. Do not close the server terminal while using the app."
exit 0
