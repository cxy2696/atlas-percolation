#!/usr/bin/env python3
"""Local static server with the right MIME types and no caching.

    python3 scripts/serve.py [port]

The site must be served over HTTP: the content loader uses fetch(), which
browsers block for file:// URLs.
"""

from __future__ import annotations

import http.server
import pathlib
import socket
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8765

MIME = {
    ".js": "text/javascript; charset=utf-8",
    ".mjs": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".md": "text/markdown; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".svg": "image/svg+xml",
    ".woff2": "font/woff2",
}


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def guess_type(self, path):
        suffix = pathlib.Path(path).suffix
        return MIME.get(suffix, super().guess_type(path))

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, max-age=0")
        super().end_headers()

    def log_message(self, fmt, *args):
        sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))


def main() -> None:
    try:
        server = http.server.ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    except OSError as exc:
        print(f"cannot bind port {PORT}: {exc}")
        raise SystemExit(1)
    host = socket.gethostname()
    print(f"atlas-percolation serving {ROOT}")
    print(f"  http://127.0.0.1:{PORT}/")
    print(f"  http://{host}.local:{PORT}/  (may need firewall permission)")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nstopped")


if __name__ == "__main__":
    main()
