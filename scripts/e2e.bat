@echo off
setlocal

REM
cd /d "%~dp0..\Backoffice"
start dotnet watch run --launch-profile https

REM
cd /d "%~dp0..\Angular-View"
start cmd /k "ng e2e"

REM
cd /d "%~dp0..\Node-Api"
start cmd /k "npm run start"

endlocal