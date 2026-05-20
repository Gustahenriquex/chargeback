$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$runner = Join-Path $root "run_chargeback_automation_silent.cmd"
$taskName = "Checklist Chargeback Mensal"

if (-not (Test-Path $runner)) {
    throw "Arquivo nao encontrado: $runner"
}

$action = New-ScheduledTaskAction -Execute $runner -WorkingDirectory $root
$trigger = New-ScheduledTaskTrigger -Monthly -DaysOfMonth 1 -At 08:00
$settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable

Register-ScheduledTask `
    -TaskName $taskName `
    -Action $action `
    -Trigger $trigger `
    -Settings $settings `
    -Description "Atualiza a planilha de Checklist Chargeback & Contestacao todo primeiro dia do mes." `
    -Force

Write-Host "Agendamento criado/atualizado: $taskName, todo dia 1 as 08:00."
