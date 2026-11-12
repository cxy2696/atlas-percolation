"""Lattice generators (stdlib only).

Square: E, S. Triangular: E, S, SW. Honeycomb: brick-wall embedding with
alternating horizontal rungs and vertical struts.
"""

from __future__ import annotations

from dataclasses import dataclass, field

LATTICE_KINDS = ("square", "triangular", "honeycomb")


def _idx(L: int, i: int, j: int) -> int:
    return (i % L) * L + (j % L)


@dataclass
class Lattice:
    kind: str
    L: int
    torus: bool = False
    n: int = field(init=False)
    m: int = field(init=False)
    eu: list = field(init=False, default_factory=list)
    ev: list = field(init=False, default_factory=list)
    etype: list = field(init=False, default_factory=list)

    def __post_init__(self) -> None:
        if self.kind not in LATTICE_KINDS:
            raise ValueError(f"unknown lattice: {self.kind}")
        if self.L < 1:
            raise ValueError("L must be positive")
        if self.kind == "honeycomb" and self.L % 2 != 0:
            raise ValueError("honeycomb needs even L")
        if self.kind == "honeycomb" and self.L < 6:
            raise ValueError("honeycomb needs L >= 6")
        self.n = self.L * self.L
        L, torus = self.L, self.torus
        eu, ev, et = self.eu, self.ev, self.etype
        for i in range(L):
            for j in range(L):
                v = i * L + j
                if self.kind == "honeycomb":
                    if (i + j) % 2 == 0 and (j + 1 < L or torus):
                        eu.append(v)
                        ev.append(_idx(L, i, j + 1))
                        et.append(0)
                    if i + 1 < L or torus:
                        eu.append(v)
                        ev.append(_idx(L, i + 1, j))
                        et.append(1)
                    continue
                if j + 1 < L or torus:
                    eu.append(v)
                    ev.append(_idx(L, i, j + 1))
                    et.append(0)
                if i + 1 < L or torus:
                    eu.append(v)
                    ev.append(_idx(L, i + 1, j))
                    et.append(1)
                if self.kind == "triangular" and (i + 1 < L or torus) and (j - 1 >= 0 or torus):
                    eu.append(v)
                    ev.append(_idx(L, i + 1, j - 1))
                    et.append(2)
        self.m = len(eu)

    def position(self, v: int):
        i, j = divmod(v, self.L)
        if self.kind == "honeycomb":
            return ((j + 0.5 * (i % 2)) / self.L, i / self.L)
        if self.kind == "triangular":
            return ((j + 0.5 * i) / self.L, (i * 0.8660254037844386) / self.L)
        return (j / self.L, i / self.L)


def build_lattice(kind: str, L: int, torus: bool = False) -> Lattice:
    return Lattice(kind, L, torus)


def degree_histogram(lat: Lattice):
    deg = [0] * lat.n
    for e in range(lat.m):
        deg[lat.eu[e]] += 1
        deg[lat.ev[e]] += 1
    hist: dict[int, int] = {}
    for d in deg:
        hist[d] = hist.get(d, 0) + 1
    return deg, dict(sorted(hist.items()))
