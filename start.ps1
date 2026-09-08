# Smart Farmer AI - Start Everything on One URL
# This script builds the frontend and starts the unified server at http://localhost:3000

Write-Host ""
Write-Host "🌾 Smart Farmer AI - Starting..." -ForegroundColor Green
Write-Host ""

# Step 1: Build the React frontend
Write-Host "📦 Building frontend..." -ForegroundColor Yellow
Set-Location $PSScriptRoot
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Frontend built successfully." -ForegroundColor Green
Write-Host ""

# Step 2: Start the unified backend (which also serves the frontend)
Write-Host "🚀 Starting server..." -ForegroundColor Yellow
Write-Host ""
Set-Location "$PSScriptRoot\backend"
npx tsx src/server.ts
