#!/bin/bash
# Lint isolato per un capitolo: copia gli .rpy in una cartella privata (asset via symlink)
# così più persone possono fare lint in parallelo senza pestarsi i piedi.
# uso: bash tools/lint_chapter.sh N
N=${1:?numero capitolo}
P=/projects/sandbox/ionuta
W=/projects/sandbox/work/lint_$N
rm -rf "$W"; mkdir -p "$W/game"
for d in images audio fonts gui libs; do ln -s "$P/LaPrincipessa/game/$d" "$W/game/$d"; done
cp "$P"/LaPrincipessa/game/*.rpy "$W/game/"
mkdir -p "/projects/sandbox/work/home_$N"
cd "$P/renpy-8.5.3-sdk"
HOME="/projects/sandbox/work/home_$N" timeout 600 ./renpy.sh "$W" lint 2>&1 | sed -n '/lint report/,$p;/^File /,/^$/p' | grep -v '^$' | head -80
/projects/sandbox/work/venv/bin/python "$P/tools/wordcount.py" "$P/LaPrincipessa/game/chapter$N.rpy"
