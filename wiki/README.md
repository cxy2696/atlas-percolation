# Wiki source

This directory holds the GitHub wiki pages in Markdown. GitHub has no API for
creating the first wiki page; the wiki Git repository is created only after a
human saves the first page in the web UI.

One-time setup:

1. Open <https://github.com/cxy2696/atlas-percolation/wiki/_new>.
2. Set the title to **Home** and save any placeholder body.
3. Run `scripts/push_wiki.sh` from the repository root.

After that, edit the Markdown here and re-run the publisher. The script clones
the wiki repository, copies every page except this README, commits and pushes.
