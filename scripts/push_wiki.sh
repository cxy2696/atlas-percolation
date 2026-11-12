#!/usr/bin/env bash
# Publish wiki/*.md to the GitHub wiki.
#
# GitHub does not expose an API for the first wiki page: the hidden
# <repo>.wiki.git remote exists only after a page has been saved once in the
# web UI. This script therefore checks for that condition and prints the exact
# URL to use.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WIKI_REMOTE="${WIKI_REMOTE:-https://github.com/cxy2696/atlas-percolation.wiki.git}"
SRC="$ROOT/wiki"

if [ ! -d "$SRC" ]; then
  echo "wiki source directory not found: $SRC" >&2
  exit 1
fi

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

if ! git clone --quiet "$WIKI_REMOTE" "$tmp/wiki" 2>/dev/null; then
  cat >&2 <<MSG
The wiki repository does not exist yet. GitHub creates it only after the first
page is saved in the browser:

  https://github.com/cxy2696/atlas-percolation/wiki/_new

Create a page titled "Home", save it, then run this script again.
MSG
  exit 1
fi

cd "$tmp/wiki"
for page in "$SRC"/*.md; do
  name="$(basename "$page")"
  [ "$name" = "README.md" ] && continue
  cp "$page" "$name"
done

git add .
if git diff --cached --quiet; then
  echo "wiki is already up to date"
  exit 0
fi

branch="$(git symbolic-ref --short HEAD)"
git -c user.name="Atlas Percolation contributors" \
    -c user.email="atlas@localhost" \
    commit -q -m "wiki: publish atlas documentation"
git push origin "$branch"
echo "published to $WIKI_REMOTE ($branch)"
