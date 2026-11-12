#!/bin/bash
# Avvia "La Principessa" con l'SDK di Ren'Py 8.5.3 (lo scarica la prima volta se manca).
cd "$(dirname "$0")"
if [ ! -x renpy-8.5.3-sdk/renpy.sh ]; then
    echo "Scarico Ren'Py 8.5.3 SDK, solo la prima volta..."
    curl -L -o renpy-sdk.tar.bz2 https://www.renpy.org/dl/8.5.3/renpy-8.5.3-sdk.tar.bz2 && tar xjf renpy-sdk.tar.bz2 && rm renpy-sdk.tar.bz2 || { echo "Download non riuscito."; exit 1; }
fi
exec renpy-8.5.3-sdk/renpy.sh "$PWD/LaPrincipessa"
