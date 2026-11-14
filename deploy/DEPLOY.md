# Deploying Percolation Atlas

The site is static. The only required layout is `index.html`, `assets/`,
`content/`, `data/` and the PWA files (`manifest.webmanifest`, `sw.js`) at the
root of the published directory. `lib/` is needed if you want the browser to
load the JavaScript engine directly from the repository layout, which the labs
do.

## GitHub Pages (the canonical deployment)

`.github/workflows/pages.yml` builds the content index, assembles `_site/`,
and deploys it with the official Pages actions.

```sh
git push origin main
```

The published URL is <https://cxy2696.github.io/atlas-percolation/>. Enable
Pages → Source: GitHub Actions in the repository settings. The workflow runs on
every push to `main` and on manual dispatch.

## Docker

```sh
docker build -t atlas-percolation:4.2.0 .
docker run --rm -p 8080:8080 atlas-percolation:4.2.0
# site: http://127.0.0.1:8080/
# api:  http://127.0.0.1:8080/api/health
```

The container installs the Python package, serves the static site and exposes
the JSON API. For a public deployment put it behind a reverse proxy with rate
limiting; the API has no authentication by design.

## Fly.io

```sh
fly launch --dockerfile Dockerfile --name atlas-percolation
fly deploy
```

Set the internal port to 8080 and add a health check on `/api/health`.

## Render / Railway / any container host

Use the Dockerfile, port 8080, health check `/api/health`. No build-time
secrets are required.

## Netlify / Vercel

Both can serve the repository as a static site:

- Netlify: `netlify.toml` is included; publish directory is `.`.
- Vercel: `vercel.json` is included; output directory is `.`.

The JSON API is a Python service and is **not** available on a purely static
host. Use the Docker image when you need `/api/*`.

## Local preview

```sh
python3 scripts/build_content.py
python3 scripts/serve.py 8788      # static only
# or
python3 -m pip install -e lib/python
atlas-perc serve --port 8080       # static + API
```

The static server uses `fetch()`, so open it over HTTP; `file://` will not
load the content index.

## Verifying a deployment

```sh
curl -fsS https://<host>/api/health
curl -fsS https://<host>/content/manifest.json | python3 -m json.tool | head
```

For the static-only deployment, check that `content/manifest.json` returns JSON
and that a deep link such as `/#/en/labs/bootstrap` renders the laboratory.
