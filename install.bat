@echo off
echo Installing dependencies for Angular Inline Calendar...
npm install
if %errorlevel% neq 0 (
    echo.
    echo Installation failed. Please check the error messages above.
    pause
    exit /b 1
)
echo.
echo Dependencies installed successfully!
echo.
echo You can now run:
echo   npm run build          - Build the library
echo   ng serve demo-app      - Run the demo application
echo   npm test               - Run tests
echo.
pause
