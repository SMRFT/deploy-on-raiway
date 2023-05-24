@echo off
setlocal

set "POETRY_HOME=%USERPROFILE%\.poetry\bin"
set "PATH=%POETRY_HOME%;%PATH%"

set "PYTHON_EXECUTABLE=python.exe"
set "MANAGE_PY=manage.py"

REM Set errexit behavior
powershell -Command "if ($?) { exit 0 } else { exit 1 }" || exit /b %errorlevel%

REM Install dependencies with Poetry
poetry install

REM Collect static files
%PYTHON_EXECUTABLE% %MANAGE_PY% collectstatic --no-input

REM Run database migrations
%PYTHON_EXECUTABLE% %MANAGE_PY% migrate
