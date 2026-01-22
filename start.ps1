# Quick Start Guide

## Prerequisites Check
Write-Host "Checking prerequisites..." -ForegroundColor Cyan

# Check Node.js
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVersion = node --version
    Write-Host "✓ Node.js installed: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js not found. Please install Node.js from https://nodejs.org" -ForegroundColor Red
    exit
}

# Check MongoDB
if (Get-Command mongod -ErrorAction SilentlyContinue) {
    Write-Host "✓ MongoDB installed" -ForegroundColor Green
} else {
    Write-Host "⚠ MongoDB not found. Please install MongoDB from https://www.mongodb.com/try/download/community" -ForegroundColor Yellow
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Hostel Management System - Quick Start" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Backend
Write-Host "1. Starting Backend Server..." -ForegroundColor Yellow
Write-Host "   Location: http://localhost:5000" -ForegroundColor Gray
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\anita\Downloads\hostel management\backend'; npm run dev"

Start-Sleep -Seconds 3

# Admin Panel
Write-Host "`n2. Starting Admin Panel..." -ForegroundColor Yellow
Write-Host "   Location: http://localhost:8000" -ForegroundColor Gray
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\anita\Downloads\hostel management\admin'; npm start"

Start-Sleep -Seconds 3

# Website
Write-Host "`n3. Starting Website..." -ForegroundColor Yellow
Write-Host "   Location: http://localhost:3000" -ForegroundColor Gray
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\anita\Downloads\hostel management\website'; npm run dev"

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "All services are starting!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

Write-Host "Access Points:" -ForegroundColor Cyan
Write-Host "  • Backend API:  http://localhost:5000" -ForegroundColor White
Write-Host "  • Admin Panel:  http://localhost:8000" -ForegroundColor White
Write-Host "  • Website:      http://localhost:3000`n" -ForegroundColor White

Write-Host "First Time Setup:" -ForegroundColor Yellow
Write-Host "  1. Go to Admin Panel (http://localhost:8000)" -ForegroundColor White
Write-Host "  2. Click 'Register here'" -ForegroundColor White
Write-Host "  3. Create account with 'Central Authority' role" -ForegroundColor White
Write-Host "  4. Login and start managing hostels!`n" -ForegroundColor White

Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
