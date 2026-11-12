#!/usr/bin/env python3
"""Build content/manifest.json and content/search.json from the Markdown sources.

The Markdown files are the single source of truth.  This script reads their
front matter, checks that every chapter exists in every language, and writes
the two JSON files the site consumes.  It is idempotent: run it after editing
any chapter.

    python3 scripts/build_content.py
"""

from __future__ import annotations

import datetime as dt
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
CONTENT = ROOT / "content"
LANGS = ["en", "zh", "de"]

PART_MAP = {
    "foundations": "foundations",
    "Foundations": "foundations",
    "core": "core",
    "Rigorous core": "core",
    "critical": "critical",
    "Critical phenomena": "critical",
    "networks": "networks",
    "Networks and applications": "networks",
    "reference": "reference",
    "Reference": "reference",
    "methods": "methods",
    "Methods": "methods",
}


def parse_front_matter(text: str) -> tuple[dict, str]:
    meta: dict[str, str] = {}
    if text.startswith("---"):
        end = text.find("\n---", 3)
        if end != -1:
            for line in text[3:end].strip().splitlines():
                if ":" in line:
                    key, value = line.split(":", 1)
                    meta[key.strip()] = value.strip().strip('"').strip("'")
            return meta, text[end + 4 :]
    return meta, text


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text, flags=re.UNICODE)
    text = re.sub(r"[\s_]+", "-", text)
    return text.strip("-")[:60]


def plain(md: str) -> str:
    md = re.sub(r"```.*?```", " ", md, flags=re.S)
    md = re.sub(r"`([^`]*)`", r"\1", md)
    md = re.sub(r"\$\$.*?\$\$", " ", md, flags=re.S)
    md = md.replace("$", "")
    md = re.sub(r"\\[a-zA-Z]+", " ", md)
    md = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", md)
    md = re.sub(r"[*_>#|]", " ", md)
    md = re.sub(r"\s+", " ", md)
    return md.strip()


def code_manifest() -> dict:
    """Inventory the four reference libraries plus their tests and harness."""
    groups = [
        ("javascript", "lib/js", ["lib/js/**/*.js"], ["tests/js/*.test.js"]),
        ("python", "lib/python", ["lib/python/**/*.py"], ["lib/python/tests/*.py"]),
        ("cpp", "lib/cpp", ["lib/cpp/**/*.hpp", "lib/cpp/**/*.cpp", "scripts/bench.cpp"], []),
        ("julia", "lib/julia", ["lib/julia/src/*.jl"], ["lib/julia/test/*.jl"]),
    ]
    languages = []
    for lang_id, group, core_globs, test_globs in groups:
        seen = set()
        files = []
        for bucket, patterns in (("core", core_globs), ("tests", test_globs)):
            for pattern in patterns:
                for path in sorted(ROOT.glob(pattern)):
                    if not path.is_file() or any(
                        part in {"__pycache__", "build", "dist"} or part.endswith(".egg-info")
                        for part in path.parts
                    ):
                        continue
                    rel = path.relative_to(ROOT).as_posix()
                    if rel in seen:
                        continue
                    seen.add(rel)
                    files.append({
                        "path": rel,
                        "bucket": bucket,
                        "lines": len(path.read_text(encoding="utf-8", errors="replace").splitlines()),
                        "bytes": path.stat().st_size,
                    })
        languages.append({"id": lang_id, "group": group, "files": files})
    return {
        "generated": dt.datetime.now().strftime("%Y-%m-%d %H:%M"),
        "languages": languages,
    }


def load_json(path: pathlib.Path, default):
    if not path.exists():
        return default
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise SystemExit(f"{path}: invalid JSON: {exc}") from exc


def main() -> int:
    chapters: dict[str, dict] = {}
    search: list[dict] = []
    problems: list[str] = []
    chapter_ids_by_lang: dict[str, set[str]] = {}

    for lang in LANGS:
        folder = CONTENT / lang
        files = sorted(folder.glob("*.md"))
        if not files:
            problems.append(f"no files in content/{lang}")
        chapter_ids_by_lang[lang] = set()
        for path in files:
            meta, body = parse_front_matter(path.read_text(encoding="utf-8"))
            cid = meta.get("id", "").strip()
            if not cid:
                problems.append(f"{path}: missing id")
                continue
            chapter = chapters.setdefault(
                cid,
                {
                    "id": cid,
                    "order": 0,
                    "part": "foundations",
                    "title": {},
                    "subtitle": {},
                    "reading": {},
                    "files": {},
                },
            )
            if cid in chapter_ids_by_lang[lang]:
                problems.append(f"content/{lang}: duplicate id {cid}")
            chapter_ids_by_lang[lang].add(cid)
            chapter["order"] = int(meta.get("order", chapter["order"] or 0))
            chapter["part"] = PART_MAP.get(meta.get("part", ""), meta.get("part", "foundations").lower())
            chapter["title"][lang] = meta.get("title", cid)
            chapter["subtitle"][lang] = meta.get("subtitle", "")
            chapter["reading"][lang] = int(float(str(meta.get("reading", 10)).split()[0]))
            chapter["files"][lang] = f"content/{lang}/{path.name}"

            title = meta.get("title", cid)
            # intro section
            parts = re.split(r"^## ", body, flags=re.M)
            intro = parts[0]
            if intro.strip():
                search.append(
                    {
                        "lang": lang,
                        "chapter": cid,
                        "chapterTitle": title,
                        "heading": title,
                        "anchor": "",
                        "text": plain(intro),
                    }
                )
            for chunk in parts[1:]:
                lines = chunk.split("\n", 1)
                heading = lines[0].strip()
                text = lines[1] if len(lines) > 1 else ""
                search.append(
                    {
                        "lang": lang,
                        "chapter": cid,
                        "chapterTitle": title,
                        "heading": heading,
                        "anchor": slugify(heading),
                        "text": plain(text),
                    }
                )

    all_ids = set(chapters)
    for lang, ids in chapter_ids_by_lang.items():
        missing = sorted(all_ids - ids)
        extra = sorted(ids - all_ids)
        if missing:
            problems.append(f"content/{lang}: missing chapters {missing}")
        if extra:
            problems.append(f"content/{lang}: unknown chapters {extra}")

    orders = {}
    for cid, chapter in chapters.items():
        missing = [lang for lang in LANGS if lang not in chapter["title"]]
        if missing:
            problems.append(f"{cid}: missing languages {missing}")
        if not chapter["order"]:
            problems.append(f"{cid}: missing order")
        elif chapter["order"] in orders:
            problems.append(f"duplicate order {chapter['order']}: {orders[chapter['order']]} and {cid}")
        else:
            orders[chapter["order"]] = cid

    ordered = sorted(chapters.values(), key=lambda c: c["order"])
    expected = list(range(1, len(ordered) + 1))
    actual = [c["order"] for c in ordered]
    if actual != expected:
        problems.append(f"orders must be contiguous 1..{len(ordered)}, got {actual}")

    references = load_json(CONTENT / "references.json", {"entries": []})
    ref_ids = {e["id"] for e in references.get("entries", []) if e.get("id")}
    citations = load_json(CONTENT / "citations.json", {})
    for cid, ids in citations.items():
        if cid not in all_ids:
            problems.append(f"citations.json: unknown chapter {cid}")
        for ref_id in ids:
            if ref_id not in ref_ids:
                problems.append(f"citations.json: {cid} refers to unknown reference {ref_id}")
    for cid in all_ids:
        if cid not in citations:
            problems.append(f"citations.json: no entry for chapter {cid}")
    manifest = {
        "generated": dt.datetime.now().strftime("%Y-%m-%d %H:%M"),
        "languages": LANGS,
        "references": len(ref_ids),
        "chapters": ordered,
    }
    (CONTENT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=1), encoding="utf-8")
    (CONTENT / "search.json").write_text(
        json.dumps({"generated": manifest["generated"], "entries": search}, ensure_ascii=False),
        encoding="utf-8",
    )
    code = code_manifest()
    (CONTENT / "code.json").write_text(json.dumps(code, ensure_ascii=False, indent=1), encoding="utf-8")

    print(f"chapters: {len(ordered)}  search entries: {len(search)}  references: {len(ref_ids)}")
    for chapter in ordered:
        flags = " ".join(lang for lang in LANGS if lang in chapter["title"])
        print(f"  {chapter['order']:02d} {chapter['id']:<28} [{flags}]")
    if problems:
        print("\nPROBLEMS:")
        for problem in problems:
            print("  -", problem)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
