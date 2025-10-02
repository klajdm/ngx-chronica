@echo off
echo Installing dependencies for ngx-chronica...
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
echo   ng serve               - Run the demo application
echo   npm test               - Run tests
echo   npm run test:ci        - Run tests with coverage
echo.
pause
