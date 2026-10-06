#!/usr/bin/env bash
# Monta uma folha de contato com a zona segura desenhada: scripts/contact-sheet.sh out/<composição>
set -euo pipefail
dir="$1"
tmp=$(mktemp -d)
for f in "$dir"/*.jpg; do
  convert "$f" -fill none -stroke '#00E5FF' -strokewidth 4 -draw "rectangle 72,260 1008,1580" \
    -resize 432x768 "$tmp/$(basename "$f")"
done
montage "$tmp"/*.jpg -tile 5x1 -geometry +6+6 -background '#222' "$dir.sheet.jpg"
rm -rf "$tmp"
echo "$dir.sheet.jpg"
