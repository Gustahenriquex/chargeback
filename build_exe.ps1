$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

if (-not (Test-Path ".\.venv\Scripts\python.exe")) {
    py -3 -m venv .venv
}

.\.venv\Scripts\python.exe -m pip install --upgrade pip
.\.venv\Scripts\python.exe -m pip install -r requirements-automation.txt
.\.venv\Scripts\python.exe -m pip install -r requirements-build.txt

.\.venv\Scripts\python.exe -m PyInstaller `
    --onefile `
    --name ChargebackChecklist `
    --clean `
    --paths "$root" `
    chargeback_checklist.py

Write-Host "Executavel gerado em: $root\dist\ChargebackChecklist.exe"
