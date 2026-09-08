$git = "C:\Users\rkswe\AppData\Local\GitHubDesktop\app-3.5.7\resources\app\git\cmd\git.exe"

Write-Host "Initializing Git..."
& $git init

Write-Host "Adding files..."
& $git add .

Write-Host "Configuring Git (if needed)..."
# Set some dummy config just in case it's not set, to avoid commit failing
& $git config user.email "kswetha1622@example.com"
& $git config user.name "kswetha1622"

Write-Host "Committing..."
& $git commit -m "Complete Smart Farm AI code with global translations and responsive UI"

Write-Host "Setting branch..."
& $git branch -M main

Write-Host "Setting remote..."
& $git remote add origin https://github.com/kswetha1622/smart-farm.git

Write-Host "Pushing to GitHub..."
& $git push -u origin main
