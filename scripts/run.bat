@echo off
setlocal

REM
cd /d "%~dp0..\Backoffice"
start dotnet run --launch-profile https

REM
cd /d "%~dp0..\Angular-View"
start cmd /k "ng serve --open"

REM
cd /d "%~dp0..\Node-Api"
start cmd /k "npm run start"

endlocal