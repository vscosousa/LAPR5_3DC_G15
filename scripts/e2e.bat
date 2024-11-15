@echo off
setlocal

REM
cd /d "%~dp0..\Backoffice"
start dotnet run --launch-profile https

REM
cd /d "%~dp0..\Angular-View"
start cmd /k "ng e2e"

endlocal