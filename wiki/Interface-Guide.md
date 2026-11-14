# Interface guide

The site is a hash-routed static application. The default route is the start guide; the other views are one click away.

## The views

| View | Route | What it is for |
|---|---|---|
| Start | `#/en/guide` | What the atlas contains and which path to take |
| Overview | `#/en/overview` | Live isometric lattice, exact thresholds, critical exponents |
| Atlas | `#/en/atlas` | 23 chapters, grouped by part, with a rail and a table of contents |
| Labs | `#/en/labs` | 16 interactive instruments, grouped by purpose |
| Algorithms | `#/en/algorithms` | 13 routines, grouped into core, dynamics, labels/trees/messages |
| Code | `#/en/code` | Four-language source browser with deep links (`?file=...`) |
| Data | `#/en/data` | Benchmark record: sample sizes, seeds, dates, fits |
| Sources | `#/en/sources` | Bibliography, audit badges, chapter cross-links |
| Library | `#/en/library` | Full-text search and the complete section index |
| 3D lab | `#/en/labs/three-d` | Simple cubic site percolation, L³ sites, top–bottom spanning |

Replace `en` with `zh` or `de` in any route. The language switch is in the top bar and persists.

## Reading a laboratory

Each laboratory has a **reading guide** above the instrument. It has five tabs:

- **What you see** — what the picture and the readouts mean.
- **Controls** — what every slider, select and button does.
- **Reading the dynamics** — what changes as the run proceeds.
- **Try this** — three concrete experiments.
- **Limits** — where the model stops and what the plot cannot tell you.

Add `?guide=open` to a laboratory URL to open the guide immediately.

Parameter help text sits under the control, and every chart has a text readout. The colour palette is never the only carrier of meaning.

## Theme and language

- Default: light, English.
- The top-bar switch stores the choice in `localStorage`.
- `?theme=light` / `?theme=dark` override it for a link or a screenshot.
- All laboratory canvases and charts redraw from the active stylesheet.

## Keyboard and links

- `/` focuses the search box when one is present.
- Every chapter, laboratory and algorithm has a hash route; copy the address to share it.
- Source links in the algorithm reader open the Code workbench at the exact file.

## Status labels

| Label | Meaning |
|---|---|
| `EXACT` | A proven value or identity, e.g. square bond `p_c = 1/2` |
| `NUMERICAL` | A finite simulation with a seed, size and criterion |
| `CONJECTURE` | Strong evidence, no proof |
| Proof sketch | The mechanism is correct; the long step is cited |

Next: [[Algorithms]].
