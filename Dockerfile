# syntax=docker/dockerfile:1
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# Install the algorithm package first so the layer is cached.
COPY lib/python /app/lib/python
RUN python -m pip install /app/lib/python

# Copy the static atlas and the data.
COPY index.html manifest.webmanifest sw.js robots.txt sitemap.xml 404.html /app/
COPY assets /app/assets
COPY content /app/content
COPY data /app/data
COPY docs /app/docs

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8080/api/health', timeout=3)"

CMD ["atlas-perc", "serve", "--host", "0.0.0.0", "--port", "8080"]
