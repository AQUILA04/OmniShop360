@echo off
REM ============================================
REM OmniShop360 - Build Docker Images (Windows)
REM ============================================

echo.
echo ============================================
echo Building OmniShop360 Docker Images
echo ============================================
echo.

REM Set the project root directory
set PROJECT_ROOT=%~dp0..\..

REM Build Keycloak Image
echo [1/4] Building Keycloak image...
docker build --no-cache -t omnishop360/keycloak:latest %PROJECT_ROOT%\keycloak
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to build Keycloak image
    exit /b 1
)
echo Keycloak image built successfully!
echo.

REM Build Backend Image
echo [2/4] Building Backend image...
docker build -t omnishop360/backend:latest %PROJECT_ROOT%\backend
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to build Backend image
    exit /b 1
)
echo Backend image built successfully!
echo.

REM Build Frontend Image
echo [3/4] Building Frontend image...
docker build -t omnishop360/frontend:latest %PROJECT_ROOT%\frontend
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to build Frontend image
    exit /b 1
)
echo Frontend image built successfully!
echo.

REM Build POS Image
echo [4/4] Building POS image...
docker build -t omnishop360/pos:latest %PROJECT_ROOT%\pos
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to build POS image
    exit /b 1
)
echo POS image built successfully!
echo.

echo ============================================
echo All images built successfully!
echo ============================================
echo.
echo Images created:
echo   - omnishop360/keycloak:latest
echo   - omnishop360/backend:latest
echo   - omnishop360/frontend:latest
echo   - omnishop360/pos:latest
echo.
echo To start the services, run:
echo   docker-compose up -d
echo.

exit /b 0
