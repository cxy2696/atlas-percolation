# Deployment

The repository is a static site plus an optional Python service.

## GitHub Pages

The canonical deployment is the Pages workflow in `.github/workflows/pages.yml`. On every push to `main` it:

1. runs `python3 scripts/build_content.py`;
2. assembles `_site/` from `index.html`, `assets/`, `content/`, `data/`, `lib/` and the PWA files;
3. uploads and deploys the artifact.

The live URL is <https://cxy2696.github.io/atlas-percolation/>.

`lib/` is required because the browser laboratories import the JavaScript engine directly from the repository layout.

## Docker

```sh
docker build -t atlas-percolation:4.1.0 .
docker run --rm -p 8080:8080 atlas-percolation:4.1.0
```

Open <http://127.0.0.1:8080/>. The API is at `/api/health`, `/api/thresholds`, `/api/sample`, `/api/sweep`, `/api/bootstrap`, `/api/invasion`, `/api/explosive`, `/api/openapi.json`.

The API is a reference service: bounded inputs, JSON errors, no authentication. Put it behind a reverse proxy and rate limiter if it is public.

## Static hosts

- Netlify: `netlify.toml`, publish directory `.`.
- Vercel: `vercel.json`, output directory `.`.
- Any object store: keep the root layout `index.html`, `assets/`, `content/`, `data/`, `manifest.webmanifest`, `sw.js`.

A static host does **not** run the Python API. Use Docker when you need `/api/*`.

## Package

```sh
cd lib/python
python3 -m build --wheel --sdist --outdir ../../dist
```

The wheel is `percolation_atlas-4.1.0-py3-none-any.whl`; the release assets are on the [v4.1.0 release](https://github.com/cxy2696/atlas-percolation/releases/tag/v4.1.0).

Next: [[Contributing]].
