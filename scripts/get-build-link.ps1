# Script PowerShell para obter o link do último build de produção

param(
    [string]$Platform = "android",
    [string]$Profile = "production"
)

Write-Host "🔍 Buscando último build para plataforma: $Platform, perfil: $Profile" -ForegroundColor Cyan
Write-Host ""

# Lista o último build e salva em JSON
$buildInfo = eas build:list --platform $Platform --profile $Profile --limit 1 --json | ConvertFrom-Json

if ($null -eq $buildInfo -or $buildInfo.Count -eq 0) {
    Write-Host "❌ Não foi possível encontrar o link do build" -ForegroundColor Red
    Write-Host ""
    Write-Host "Verifique se existe um build disponível:"
    Write-Host "  eas build:list --platform $Platform --profile $Profile"
    exit 1
}

$build = $buildInfo[0]
$link = $build.artifactUrl

if ([string]::IsNullOrEmpty($link)) {
    Write-Host "❌ Link não encontrado no build" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Link do build encontrado:" -ForegroundColor Green
Write-Host ""
Write-Host $link -ForegroundColor Yellow
Write-Host ""
Write-Host "📋 Próximos passos:" -ForegroundColor Cyan
Write-Host "   1. Copie o link acima" -ForegroundColor White
Write-Host "   2. Acesse: https://supabase.com/dashboard/project/pvtffkgbyqsqtaxntrgd" -ForegroundColor White
Write-Host "   3. Vá em Authentication > URL Configuration" -ForegroundColor White
Write-Host "   4. Em Redirect URLs, adicione: remedinuiv2://auth" -ForegroundColor White
Write-Host ""

