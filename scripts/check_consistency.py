#!/usr/bin/env python3
"""Check that edition numbers and counts agree across the repository.

    python3 scripts/check_consistency.py

This is a maintenance check, not a proof. It catches the common drift between
README prose, package metadata, generated JSON and the service-worker cache
name. It also verifies that the generated content files are reproducible from
the sources rather than carrying a wall-clock timestamp.
"""

from __future__ import annotations

import hashlib
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
FAILS: list[str] = []


def fail(msg: str) -> None:
    FAILS.append(msg)
    print(f"FAIL {msg}")


def ok(msg: str) -> None:
    print(f"ok   {msg}")


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


def main() -> int:
    pkg = json.loads(read("package.json"))
    version = str(pkg["version"])

    for path, needle in [
        ("index.html", f"v{version}"),
        ("sw.js", f"atlas-v{version}"),
        ("lib/python/pyproject.toml", f'version = "{version}"'),
        ("lib/python/percolation_atlas/__init__.py", f'__version__ = "{version}"'),
        ("README.md", f"releases/tag/v{version}"),
        ("README_cn.md", f"releases/tag/v{version}"),
        ("README_de.md", f"releases/tag/v{version}"),
        ("wiki/Home.md", f"**Version {version}**"),
    ]:
        if needle not in read(path):
            fail(f"{path}: missing {needle!r}")
        else:
            ok(f"{path}: version {version}")

    manifest = json.loads(read("content/manifest.json"))
    if manifest.get("version") != version:
        fail(f"content/manifest.json: version {manifest.get('version')} != {version}")
    else:
        ok("content/manifest.json: version")

    chapters = sorted((ROOT / "content" / "en").glob("*.md"))
    if len(chapters) != len(manifest.get("chapters", [])):
        fail(f"chapters: {len(chapters)} files vs {len(manifest.get('chapters', []))} in manifest")
    else:
        ok(f"chapters: {len(chapters)}")

    labs_src = read("assets/js/labs/index.js")
    labs_block = labs_src.split("export const LABS = [", 1)[1].split("];", 1)[0]
    n_labs = len(re.findall(r"(?m)^    id: '", labs_block))
    if len(re.findall(r"mount: \(el, ctx\)", labs_block)) != n_labs:
        fail("labs: registry entries without a mount function")
    ok(f"experiments: {n_labs}")

    algo_src = read("assets/js/lib/algorithm-guide.js")
    m = re.search(r"ALGORITHM_ORDER = \[(.*?)\]", algo_src, re.S)
    if not m:
        fail("algorithms: ALGORITHM_ORDER not found")
    else:
        n_algos = len(re.findall(r"'[^']+'", m.group(1)))
        ok(f"algorithms: {n_algos}")

    refs = json.loads(read("content/references.json"))
    n_refs = len(refs.get("entries", []))
    audit = json.loads(read("content/reference_audit.json"))
    counts = audit.get("counts", {})
    n_ok = int(counts.get("ok", 0))
    n_note = int(counts.get("ok-note", 0))
    if manifest.get("references") != n_refs:
        fail(f"references: manifest {manifest.get('references')} != {n_refs}")
    if audit.get("total") != n_refs:
        fail(f"references: audit total {audit.get('total')} != {n_refs}")
    if n_ok + n_note != n_refs:
        fail(f"references: {n_ok} ok + {n_note} notes != {n_refs}")
    if n_ok and f"{n_refs}" not in read("README.md"):
        fail("README.md: reference count missing")
    if n_ok and f"{n_refs} 条" not in read("README_cn.md"):
        fail("README_cn.md: reference count missing")
    if n_ok and f"{n_refs} Quellen" not in read("README_de.md"):
        fail("README_de.md: reference count missing")
    if n_ok and f"{n_refs} references" not in read("assets/js/i18n.js"):
        fail("assets/js/i18n.js: English reference count missing")
    if n_ok and f"{n_ok} verified" not in read("docs/VERIFICATION.md"):
        fail("docs/VERIFICATION.md: verified count missing")
    ok(f"references: {n_refs} total, {n_ok} verified, {n_note} notes")

    # Generated content must be reproducible: the fingerprint covers the
    # chapters, references and citations; a wall-clock stamp would drift.
    digest = hashlib.sha256()
    sources = []
    for lang in ("en", "zh", "de"):
        sources.extend(sorted((ROOT / "content" / lang).glob("*.md")))
    sources.extend([ROOT / "content" / "references.json", ROOT / "content" / "citations.json"])
    for path in sources:
        digest.update(path.relative_to(ROOT).as_posix().encode("utf-8"))
        digest.update(path.read_bytes())
    fingerprint = digest.hexdigest()[:16]
    if manifest.get("fingerprint") != fingerprint:
        fail("content/manifest.json: fingerprint does not match the sources (run make content)")
    else:
        ok("content fingerprint")
    for path in ("content/manifest.json", "content/search.json", "content/code.json"):
        text = read(path)
        if re.search(r'"generated": "\d{4}-\d{2}-\d{2}', text):
            fail(f"{path}: wall-clock timestamp in generated file")
        elif f'"{fingerprint}"' not in text and f'"generated": "content-{fingerprint}"' not in text:
            fail(f"{path}: fingerprint missing")

    if "assets/css/reading.css" not in read("index.html"):
        fail("index.html: reading.css is not loaded")
    if "assets/css/reading.css" not in read("sw.js"):
        fail("sw.js: reading.css is not in the shell cache")

    if FAILS:
        print(f"\n{len(FAILS)} consistency check(s) failed", file=sys.stderr)
        return 1
    print("\nversion and count statements agree")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
