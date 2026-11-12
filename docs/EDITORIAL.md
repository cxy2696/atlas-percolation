# Editorial and translation guide

This file is the house style for the English source and the Chinese and German editions. It exists so that a translator, an editor and a future maintainer make the same choices.

## Voice

Write for a technically literate reader who is not necessarily a specialist in percolation. Prefer concrete nouns and short declarative sentences. Define a term at first use. Do not use promotional language, and do not add a sentence merely to fill a paragraph.

Avoid the tells of generated prose: three-item lists that all say the same thing, "it is important to note", "in today's world", "delve", "landscape", "testament", repeated sentence openings, and conclusions that restate the introduction. A little asymmetry is good. A paragraph may be one sentence long.

## Claims and sources

- A theorem is attributed to the paper that proves it.
- An exact value is marked exact; a numerical value carries its uncertainty and source; a conjecture is called a conjecture.
- Do not add a citation that is not in `content/references.json`. If a new source is needed, add it there with a DOI or a stable publisher URL and add the key to `content/citations.json`.
- Do not translate author names, journal titles, theorem labels, code identifiers, URLs or DOIs.
- Equations, displayed formulas, table numbers and section numbers are part of the structure: keep them unchanged.

## Mathematical labels

Displayed formulas are shared by all editions, byte for byte where possible. A short label inside `\text{...}` may stay in English when it names a standard object (for example `open crossing`, `closed`, `for all`), because the same LaTeX then compiles identically in every edition and two translations can be compared line by line. The surrounding prose must give the local term at first use. Do not translate variable names, theorem numbers, section numbers, code identifiers, DOIs or author names. If a label is translated, translate it in every edition and update the formula in all three files in the same commit.

## Chinese glossary (简体中文)

| English | Chinese | Notes |
|---|---|---|
| percolation | 渗流 | not 渗透 |
| site / bond | 位点 / 键 | site percolation 位点渗流 |
| cluster | 团簇 | not 簇 |
| open / closed | 开 / 闭 | 开键、闭键 |
| threshold | 阈值 | critical probability 临界概率 |
| critical | 临界 | critical point 临界点 |
| scaling | 标度 | finite-size scaling 有限尺度标度 |
| universality | 普适性 | universality class 普适类 |
| duality | 对偶 | self-dual 自对偶 |
| matching graph | 匹配图 | |
| star–triangle transformation | 星–三角变换 | |
| crossing | 横穿 | left–right crossing 左右横穿 |
| correlation length | 关联长度 | |
| susceptibility | 磁化率 | χ |
| order parameter | 序参量 | |
| mean-field | 平均场 | |
| random-cluster model | 随机簇模型 | |
| configuration model | 配置模型 | |
| giant component | 巨分量 | |
| k-core | k-核 | |
| interdependent networks | 相互依赖网络 | |
| cascade | 级联 | cascade step 级联步 |
| saddle-node bifurcation | 鞍结分岔 | |
| backbone | 骨干 | |
| dangling ends | 悬挂端 | |
| Boolean model | 布尔模型 | |
| continuum percolation | 连续渗流 | |
| Newman–Ziff | 纽曼–齐夫 | keep the en dash |
| bootstrap percolation | 自举渗流 | |
| one-arm exponent | 单臂指数 | |
| crossing probability | 横穿概率 | |
| positive association | 正关联 | FKG inequality FKG 不等式 |
| sharpness | 锐性 | sharpness of the phase transition 相变锐性 |
| regular lattice | 规则格子 | |
| Bethe lattice | Bethe 格子 | keep the name |
| torus | 环面 | periodic boundary conditions 周期边界条件 |

Use full-width Chinese punctuation in Chinese prose. Keep a space between Chinese characters and inline Latin/mathematics where it improves readability, but do not insert spaces inside formulas.

## German glossary

| English | German | Notes |
|---|---|---|
| percolation | Perkolation | |
| site / bond | Site / Kante | Site-Perkolation and Bond-Perkolation are standard; use Gitterplatz for a single site in prose |
| cluster | Cluster | plural Cluster |
| open / closed | offen / geschlossen | |
| threshold | Schwelle | Schwellenwert is acceptable |
| critical | kritisch | kritischer Punkt |
| scaling | Skalierung | Finite-Size-Skalierung |
| universality | Universalität | Universalitätsklasse |
| duality | Dualität | selbstdual |
| matching graph | Paarungsgraph | add (matching graph) at first use |
| star–triangle transformation | Stern-Dreieck-Transformation | |
| crossing | Durchgang | Links-rechts-Durchgang |
| correlation length | Korrelationslänge | |
| susceptibility | Suszeptibilität | |
| order parameter | Ordnungsparameter | |
| mean-field | Molekularfeld | Mean-Field is acceptable in technical contexts |
| random-cluster model | Random-Cluster-Modell | |
| configuration model | Konfigurationsmodell | |
| giant component | Riesenkomponente | |
| k-core | k-Kern | |
| interdependent networks | voneinander abhängige Netzwerke | |
| cascade | Kaskade | |
| saddle-node bifurcation | Sattel-Knoten-Bifurkation | |
| backbone | Rückgrat | |
| dangling ends | hängende Enden | |
| Boolean model | Boolesches Modell | |
| continuum percolation | Kontinuumsperkolation | |
| Newman–Ziff | Newman–Ziff | keep the en dash |
| bootstrap percolation | Bootstrap-Perkolation | |
| one-arm exponent | Einarm-Exponent | |
| crossing probability | Durchgangswahrscheinlichkeit | |
| positive association | positive Assoziation | FKG-Ungleichung |
| sharpness | Schärfe | Schärfe des Phasenübergangs |
| Bethe lattice | Bethe-Gitter | |
| torus | Torus | periodische Randbedingungen |

Use the impersonal register ("man", passive, or "wir" for a derivation) consistently within a chapter. Do not mix "du" and "Sie". German compounds are long; use a hyphen where it prevents ambiguity (Finite-Size-Skalierung, Random-Cluster-Modell). Keep English technical names in parentheses at first use if the German term is not standard.

## Front matter

Every translated chapter keeps the same `id`, `order` and `part` values as the English source. The `part` values are internal keys (`Foundations`, `Rigorous core`, `Critical phenomena`, `Networks and applications`, `Methods`, `Reference`) and must not be translated. Translate `title` and `subtitle`. `reading` is an integer number of minutes; adjust by at most two minutes for the target language.

## Structural checks

Before committing a translation:

```sh
python3 scripts/build_content.py     # fails on missing languages or bad front matter
```

The build checks that every chapter exists in every language, that the order is contiguous, and that every citation key resolves. It does not check prose quality; that is the editor's job.
