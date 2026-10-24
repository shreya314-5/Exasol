@echo off
setlocal
echo ========================================================
echo   VoiceShield AI - Push to GitHub Helper
echo ========================================================
echo.

set PATH=C:\SHREYA\tools\git\cmd;%PATH%

echo Enter your GitHub Repository URL (e.g., https://github.com/username/VoiceShield-AI.git):
set /p REPO_URL="Repo URL: "

if "%REPO_URL%"=="" (
    echo Error: Repository URL cannot be empty.
    pause
    exit /b
)

echo.
echo Linking repository to: %REPO_URL%
git remote remove origin >nul 2>&1
git remote add origin %REPO_URL%
git branch -M main

echo.
echo Pushing project and video to GitHub...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================================
    echo   SUCCESS! All files and video pushed to GitHub!
    echo ========================================================
) else (
    echo.
    echo If prompted, please sign in with your GitHub account.
)

echo.
pause
