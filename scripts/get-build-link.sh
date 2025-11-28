#!/bin/bash

# Script para obter o link do último build de produção

PLATFORM=${1:-android}
PROFILE=${2:-production}

echo "🔍 Buscando último build para plataforma: $PLATFORM, perfil: $PROFILE"
echo ""

# Lista o último build
eas build:list --platform $PLATFORM --profile $PROFILE --limit 1 --json > build-info.json

# Extrai o link
LINK=$(cat build-info.json | grep -o '"artifactUrl":"[^"]*' | head -1 | cut -d'"' -f4)

if [ -z "$LINK" ]; then
    echo "❌ Não foi possível encontrar o link do build"
    echo ""
    echo "Verifique se existe um build disponível:"
    echo "  eas build:list --platform $PLATFORM --profile $PROFILE"
    rm -f build-info.json
    exit 1
fi

echo "✅ Link do build encontrado:"
echo ""
echo "$LINK"
echo ""
echo "📋 Copie este link e adicione no Supabase:"
echo "   1. Acesse: https://supabase.com/dashboard/project/pvtffkgbyqsqtaxntrgd"
echo "   2. Vá em Authentication > URL Configuration"
echo "   3. Em Redirect URLs, adicione: remedinuiv2://auth"
echo ""
rm -f build-info.json

