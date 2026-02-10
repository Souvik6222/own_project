@echo off
echo ========================================
echo Legal Agreement Analyzer - Backend
echo ========================================
echo.

REM Check if virtual environment exists
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
    echo.
)

echo Activating virtual environment...
call venv\Scripts\activate
echo.

REM Check if .env exists
if not exist ".env" (
    echo WARNING: .env file not found!
    echo Please create .env file and add your GOOGLE_API_KEY
    echo You can copy .env.example to .env and edit it
    echo.
    pause
    exit /b 1
)

REM Check if requirements are installed
echo Checking dependencies...
pip show fastapi >nul 2>&1
if errorlevel 1 (
    echo Installing dependencies...
    pip install -r requirements.txt
    echo.
)

echo ========================================
echo Starting Backend Server...
echo Server will be available at: http://localhost:8000
echo Press Ctrl+C to stop the server
echo ========================================
echo.

uvicorn api:app --reload --port 8000
