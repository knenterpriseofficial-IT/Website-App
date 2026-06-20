# restart-backend.ps1
# Stops any process using port 3210, then restarts Convex dev backend

Write-Host "Checking for processes on port 3210..." -ForegroundColor Cyan

$netstatOutput = netstat -ano | Select-String "0.0.0.0:3210\s+0.0.0.0:0\s+LISTENING"
if ($netstatOutput) {
    $processId = ($netstatOutput.ToString().Trim() -split "\s+")[-1]
    Write-Host "Found process $processId on port 3210. Stopping it..." -ForegroundColor Yellow
    Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    Write-Host "Process stopped." -ForegroundColor Green
} else {
    Write-Host "No process found on port 3210." -ForegroundColor Green
}

Write-Host "Starting Convex backend..." -ForegroundColor Cyan
npx convex dev
