#!/usr/bin/env python3
"""Check that the three editions of every chapter have the same structure.

A translation may legitimately change sentence length, but it must not change
the section numbering, the number of display equations, or the equation tags:
those are the parts a reader uses to cross-reference a derivation.  The check
is deliberately structural rather than semantic; prose quality remains an
editorial judgement.

    python3 scripts/check_translations.py

Exit status is 1 on any mismatch.  This catches the failure mode recorded in
Chapter 14, row 23: a correction applied to one edition and not the others.
"""
from __future__ import annotations

import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
LANGS = ("en", "zh", "de")


def front_matter(text: str) -> dict[str, str]:
    meta: dict[str, str] = {}
    if text.startswith("---"):
        end = text.find("\n---", 3)
        if end != -1:
            for line in text[3:end].strip().splitlines():
                if ":" in line:
                    key, value = line.split(":", 1)
                    meta[key.strip()] = value.strip().strip('"').strip("'")
    return meta


def structure(path: pathlib.Path) -> dict:
    text = path.read_text(encoding="utf-8")
    meta = front_matter(text)
    heads = re.findall(r"^##\s+(.+)$", text, flags=re.M)
    numbers = []
    for head in heads:
        match = re.match(r"^(\d+(?:\.\d+)*)", head.strip())
        numbers.append(match.group(1) if match else "#")
    tags = re.findall(r"\\tag\{([^}]+)\}", text)
    display = len(re.findall(r"\$\$", text)) // 2
    cites = sorted(set(re.findall(r"\b([a-z]+(?:[a-z]+)?\d{4}[a-z]?)\b", text)))
    return {
        "id": meta.get("id", ""),
        "order": meta.get("order", ""),
        "headings": numbers,
        "tags": tags,
        "display": display,
        "cites": cites,
    }


def main() -> int:
    chapters = sorted({p.stem for p in (ROOT / "content" / "en").glob("*.md")})
    problems: list[str] = []
    for stem in chapters:
        by_lang = {}
        for lang in LANGS:
            path = ROOT / "content" / lang / f"{stem}.md"
            if not path.exists():
                problems.append(f"{stem}: missing {lang}")
                continue
            by_lang[lang] = structure(path)
        if len(by_lang) != len(LANGS):
            continue
        base = by_lang["en"]
        if base["id"] != stem:
            problems.append(f"{stem}: front-matter id {base['id']!r} does not match filename")
        for lang in LANGS[1:]:
            other = by_lang[lang]
            for field, label in (
                ("order", "order"),
                ("headings", "section headings"),
                ("tags", "equation tags"),
                ("display", "display-equation count"),
            ):
                if base[field] != other[field]:
                    problems.append(
                        f"{stem}: {lang} {label} differs from en: {other[field]!r} != {base[field]!r}"
                    )
            if other["id"] != base["id"]:
                problems.append(f"{stem}: {lang} id {other['id']!r} != {base['id']!r}")
    if problems:
        print("TRANSLATION STRUCTURE PROBLEMS", file=sys.stderr)
        for problem in problems:
            print("  -", problem, file=sys.stderr)
        return 1
    print(f"translation structure: {len(chapters)} chapters x {len(LANGS)} languages agree")
    return 0


if __name__ == "__main__":
    sys.exit(main())
