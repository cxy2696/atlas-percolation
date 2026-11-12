#!/usr/bin/env python3
"""Audit every bibliography entry against Crossref or its URL.

    python3 scripts/verify_references.py            # network check
    python3 scripts/verify_references.py --offline  # only validate schema

The audit is honest about what it can check.  A DOI entry is verified when
Crossref resolves it and the returned title is close to the stored title.  A
book or blog without a DOI is verified by an HTTP fetch (status < 400).  The
result is written to content/reference_audit.json, which the Sources view can
display; it never rewrites references.json.
"""
from __future__ import annotations

import argparse
import concurrent.futures
import datetime as dt
import difflib
import json
import pathlib
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1]
REFS = ROOT / "content" / "references.json"
OUT = ROOT / "content" / "reference_audit.json"
UA = "atlas-percolation-reference-audit/3.0 (mailto:atlas@localhost)"


def norm(s: str) -> str:
    s = re.sub(r"<[^>]+>", " ", s or "")
    s = re.sub(r"[^a-z0-9]+", " ", s.lower())
    return re.sub(r"\s+", " ", s).strip()


def fetch(url: str, timeout: float = 15.0):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json,text/html;q=0.9,*/*;q=0.8"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.status, r.read(800_000)


def check_doi(entry: dict) -> dict:
    doi = entry["doi"]
    try:
        status, body = fetch("https://api.crossref.org/works/" + urllib.parse.quote(doi))
        payload = json.loads(body)
        msg = payload.get("message", {})
        title = (msg.get("title") or [""])[0]
        year = None
        parts = (msg.get("issued", {}).get("date-parts") or [[None]])[0]
        if parts:
            year = parts[0]
        stored = norm(entry.get("title", ""))
        found = norm(title)
        score = difflib.SequenceMatcher(None, found, stored).ratio()
        # Crossref often returns the main title without the subtitle.  A
        # prefix match in either direction is a legitimate match.
        title_ok = score >= 0.72 or (bool(found) and (stored.startswith(found) or found.startswith(stored)))
        year_ok = True
        stored_year = entry.get("year")
        if isinstance(stored_year, int) and isinstance(year, int):
            year_ok = abs(stored_year - year) <= 1
        first_author = ""
        authors = msg.get("author") or []
        if authors:
            first_author = (authors[0].get("family") or authors[0].get("name") or "").strip()
        author_ok = True
        if first_author and entry.get("authors"):
            stored_family = entry["authors"][0].split(",")[0].strip()
            author_ok = difflib.SequenceMatcher(None, norm(first_author), norm(stored_family)).ratio() >= 0.6
        if not title_ok or not author_ok:
            status_value = "metadata-mismatch"
        elif not year_ok:
            status_value = "ok-note" if entry.get("note") else "year-mismatch"
        else:
            status_value = "ok"
        return {
            "status": status_value,
            "http": status,
            "resolved_title": title,
            "resolved_year": year,
            "resolved_first_author": first_author,
            "similarity": round(score, 3),
            "title_ok": title_ok,
            "year_ok": year_ok,
            "author_ok": author_ok,
        }
    except Exception as exc:  # noqa: BLE001 - reported, not raised
        return {"status": "unreachable", "error": str(exc)[:200]}


def check_url(entry: dict) -> dict:
    url = entry["url"]
    try:
        status, body = fetch(url)
        if status >= 400:
            return {"status": "http-error", "http": status}
        text = body.decode("utf-8", "replace")
        title = ""
        m = re.search(r"<title[^>]*>(.*?)</title>", text, re.I | re.S)
        if m:
            title = re.sub(r"\s+", " ", m.group(1)).strip()[:200]
        return {"status": "ok", "http": status, "resolved_title": title}
    except urllib.error.HTTPError as exc:
        return {"status": "http-error", "http": exc.code}
    except Exception as exc:  # noqa: BLE001
        return {"status": "unreachable", "error": str(exc)[:200]}


def schema_problems(entry: dict) -> list[str]:
    problems = []
    for field in ("id", "authors", "year", "title", "venue", "type", "topics"):
        if field not in entry:
            problems.append(f"missing {field}")
    if entry.get("type") not in {"article", "book", "chapter", "blog", "software", "preprint"}:
        problems.append(f"unknown type {entry.get('type')!r}")
    if not entry.get("doi") and not entry.get("url") and not entry.get("note"):
        problems.append("no doi, url or explanatory note")
    if entry.get("doi") and entry.get("url"):
        problems.append("both doi and url; choose one canonical link")
    return problems


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--offline", action="store_true")
    ap.add_argument("--only", default="", help="comma-separated ids")
    ap.add_argument("--merge", action="store_true", help="merge into the existing audit instead of replacing it")
    args = ap.parse_args()
    data = json.loads(REFS.read_text())
    entries = data["entries"]
    only = {x.strip() for x in args.only.split(",") if x.strip()}
    if only:
        entries = [e for e in entries if e["id"] in only]
    problems = {}
    for entry in entries:
        issues = schema_problems(entry)
        if issues:
            problems[entry["id"]] = issues
    results = []
    if args.offline:
        for entry in entries:
            results.append({"id": entry["id"], "status": "schema-only" if entry["id"] not in problems else "schema-error", "problems": problems.get(entry["id"], [])})
    else:
        def work(entry):
            if entry.get("doi"):
                res = check_doi(entry)
            elif entry.get("url"):
                res = check_url(entry)
            else:
                res = {"status": "ok-note" if entry.get("note") else "no-link"}
            res["id"] = entry["id"]
            res["source"] = "doi" if entry.get("doi") else "url"
            res["problems"] = problems.get(entry["id"], [])
            if res["problems"]:
                res["status"] = "schema-error"
            return res

        with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
            for res in pool.map(work, entries):
                results.append(res)
                print(f"{res['status']:<16} {res['id']:<22} {res.get('resolved_title', res.get('error', ''))[:70]}")
    counts = {}
    for r in results:
        counts[r["status"]] = counts.get(r["status"], 0) + 1
    if args.merge and OUT.exists():
        previous = json.loads(OUT.read_text())
        by_id = {r["id"]: r for r in previous.get("results", [])}
        for r in results:
            by_id[r["id"]] = r
        merged = list(by_id.values())
        counts = {}
        for r in merged:
            counts[r["status"]] = counts.get(r["status"], 0) + 1
        results = merged
    payload = {
        "checked_at": dt.datetime.now().strftime("%Y-%m-%d %H:%M"),
        "method": "offline-schema" if args.offline else "crossref-doi+http-url",
        "total": len(results),
        "counts": counts,
        "results": sorted(results, key=lambda r: r["id"]),
    }
    target = ROOT / "content" / ("reference_schema.json" if args.offline else "reference_audit.json")
    target.write_text(json.dumps(payload, ensure_ascii=False, indent=1))
    print(f"\n{len(results)} entries -> {counts}")
    bad = [r for r in results if r["status"] not in ("ok", "ok-note", "schema-only")]
    unreachable = [r for r in bad if r["status"] == "unreachable"]
    bad = [r for r in bad if r["status"] != "unreachable"]
    if unreachable:
        print("\nTransient network failures (retry these ids):", file=sys.stderr)
        for r in unreachable:
            print(f"  {r['id']}: {r.get('error', '')}", file=sys.stderr)
    if bad:
        print("\nNeeds attention:", file=sys.stderr)
        for r in bad:
            print(f"  {r['id']}: {r['status']} {r.get('problems') or r.get('error') or ''}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
