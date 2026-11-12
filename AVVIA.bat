@echo off
rem Avvia "La Principessa" con l'SDK di Ren'Py 8.5.3 (lo scarica la prima volta se manca).
cd /d "%~dp0"
if not exist "renpy-8.5.3-sdk\renpy.exe" (
    echo Scarico Ren'Py 8.5.3 SDK, solo la prima volta...
    curl -L -o renpy-sdk.zip https://www.renpy.org/dl/8.5.3/renpy-8.5.3-sdk.zip || goto errore
    tar -xf renpy-sdk.zip || goto errore
    del renpy-sdk.zip
)
start "" "renpy-8.5.3-sdk\renpy.exe" "%~dp0LaPrincipessa"
exit /b 0
:errore
echo Download non riuscito. Scarica a mano https://www.renpy.org/dl/8.5.3/renpy-8.5.3-sdk.zip ed estrailo in questa cartella.
pause
