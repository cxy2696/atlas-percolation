# 渗流图册

[English](README.md) · **简体中文** · [Deutsch](README_de.md)

[![CI](https://github.com/cxy2696/atlas-percolation/actions/workflows/ci.yml/badge.svg)](https://github.com/cxy2696/atlas-percolation/actions/workflows/ci.yml) [![Pages](https://github.com/cxy2696/atlas-percolation/actions/workflows/pages.yml/badge.svg)](https://github.com/cxy2696/atlas-percolation/actions/workflows/pages.yml) [![Release](https://img.shields.io/github/v/release/cxy2696/atlas-percolation?label=release)](https://github.com/cxy2696/atlas-percolation/releases)

渗流研究的是：随机连接什么时候会贯穿介质？咖啡渣、森林、电网、接触网络或多孔电极，问的都是同一类问题。这个仓库是围绕该问题的一份三语参考：23 章正文、16 个交互实验、13 条算法精读、四种参考实现，以及 142 条带来源的文献。

站点是纯静态的 Markdown、JSON 和 JavaScript，没有应用服务器，也没有运行时框架；唯一的外部前端文件是随仓库附带的 KaTeX 与 marked。Python 包、命令行工具和 JSON API 只是同一套引擎的不同外壳。

**在线站点：** <https://cxy2696.github.io/atlas-percolation/> · **Wiki：** <https://github.com/cxy2696/atlas-percolation/wiki> · **发布：** [v4.4.0](https://github.com/cxy2696/atlas-percolation/releases/tag/v4.4.0)

## 从这里开始

- **读论证。** 从[第 1 章](https://cxy2696.github.io/atlas-percolation/#/zh/atlas/01-foundations)开始，再读第 3–7 章的严格核心。章节索引在[这里](https://cxy2696.github.io/atlas-percolation/#/zh/atlas)。
- **跑实验。** [实验索引](https://cxy2696.github.io/atlas-percolation/#/zh/labs)开头有三个引导实验：测量 `p = 1/2` 处的横穿概率、让三种尺寸的曲线坍缩、寻找磁化率峰值。每个实验都有读图指南、运行记录，以及它所检验的章节链接。
- **查数字。** [文献页](https://cxy2696.github.io/atlas-percolation/#/zh/sources)列出每条文献的 DOI 或稳定链接与审计状态。精确、数值、猜想三类陈述用不同标签区分；约定见[起始页](https://cxy2696.github.io/atlas-percolation/#/zh/guide)。

## 快速开始

需要 Python 3.10+、Node.js 20+ 和 C++20 编译器。只有 Julia 测试需要 Julia 1.9+。

```sh
git clone https://github.com/cxy2696/atlas-percolation.git
cd atlas-percolation
python3 scripts/build_content.py     # 生成 manifest、搜索索引、代码清单
python3 scripts/serve.py 8788        # http://127.0.0.1:8788/
```

打开 `http://127.0.0.1:8788/`。站点必须通过 HTTP 访问，因为内容加载器使用 `fetch()`；直接双击 `index.html` 不会工作。默认路由是英文、浅色模式的起始页。路由使用 `#/en/...`、`#/zh/...` 或 `#/de/...`；主题和语言会记在 `localStorage` 中。

## 仓库内容

| 层 | 内容 |
|---|---|
| 章节 | 23 章，英、简中、德三语，从 1957 年的论文写到对偶、锐性、指数、SLE、随机簇模型、网络、测量、应用、算法、有向与连续渗流、输运、证明、设计、可复现性、树与流行病。 |
| 实验 | 16 个交互模型：格子渗流、横穿坍缩、Newman–Ziff、三维位点渗流、Cardy、有向渗流、随机簇、自举、爆炸、侵入、网络鲁棒性、耦合级联、布尔模型、Bethe 树、SIR，以及算法工坊。 |
| 算法 | 13 条例程，给出想法、不变量、代价、源文件与常见错误：Bernoulli 采样器、并查集、键/位点 Newman–Ziff、Leath、自举、侵入、Achlioptas、k-核、Hoshen–Kopelman、Bethe 不动点、SIR 最终规模与消息传递。 |
| 代码 | C++20 头文件库、Julia、Python、JavaScript，共用同一条 xoshiro128** 随机流与同一套格子边序。 |
| 数据 | C++ 基准程序、Python 分析器，以及带原始计数、种子与拟合的 JSON 记录。 |
| 检查 | 四语言测试、跨语言一致性探针、RNG 金标、翻译结构、正文断言核对与文献审计。 |

## 复现检查

```sh
make test          # 四语言套件 + 一致性 + 翻译结构 + 正文断言
make verify        # 翻译结构 + 正文断言 + 文献审计
make bench         # C++ 程序 -> data/raw_bench.json
make analyse       # 原始 JSON -> data/benchmarks.json
make content       # 重建 manifest/搜索索引/代码清单
make audit         # Crossref/HTTP 文献审计
make package       # Python 包 wheel + sdist
```

单独运行一个套件：

```sh
node --test tests/js/*.test.js
PYTHONPATH=lib/python python3 -m unittest discover -s lib/python/tests -v
make -C lib/cpp test
julia --startup-file=no --project=lib/julia lib/julia/test/runtests.jl
```

一致性契约在 `data/golden/parity.json`；随机流向量在 `data/golden/rng-seed42.json`；算法库、v4 求解器、位点扫描与消息传递探针在 `data/golden/algorithms-v3.json`。改动 RNG、格子边序或消费顺序属于破坏性变更：重新生成金标、升版本，并在第 14 章记录。检查的覆盖范围与边界见 [`docs/VERIFICATION.md`](docs/VERIFICATION.md)。

## 基准流程

`scripts/bench.cpp` 只写原始计数、尺寸与种子。`scripts/analyse_bench.py` 加上派生量、Cardy 曲线、坍缩拟合与单臂斜率。Data 视图读取 `data/benchmarks.json`；文件缺失时它显示上面的命令，而不是编造一条曲线。

基准是教学数据集，不是高精度测量。它的规模适合在笔记本上几分钟跑完，并让有限尺寸行为可见。第 11 章说明它能支持什么、不能支持什么。

## Python 包、CLI 与 API

Python 包是引擎的可分发形式，除标准库外没有运行时依赖。

```sh
python3 -m pip install -e lib/python

atlas-perc info
atlas-perc sample    --lattice square --mode bond --L 128 --p 0.5 --seed 42
atlas-perc sweep     --lattice square --L 64 --seed 7
atlas-perc bootstrap --L 64 --p 0.55 --r 3 --seed 11
atlas-perc invasion  --L 48 --seed 3
atlas-perc explosive --n 2000 --rule product --seed 7
atlas-perc serve     --port 8080
```

`atlas-perc serve` 提供静态站点和 `/api` 下的 JSON API（`/api/health`、`/api/thresholds`、`/api/sample`、`/api/sweep`、`/api/bootstrap`、`/api/invasion`、`/api/explosive`、`/api/openapi.json`）。API 是带输入上限、无鉴权的参考服务；公开暴露时请放在反向代理后面。详见 [`docs/API.md`](docs/API.md)。

部署方式包括 GitHub Pages（正式站点）、Docker（`Dockerfile`）、Netlify、Vercel 与 Fly.io。详见 [`deploy/DEPLOY.md`](deploy/DEPLOY.md)。

## 仓库结构

```
README.md / README_cn.md / README_de.md  三语仓库说明
content/
  en/ zh/ de/           每章、每语的 Markdown
  references.json       DOI 或稳定出版方链接的文献表
  citations.json        章节 -> 文献键
  manifest.json         生成文件，不要手改
  search.json           生成的全文索引
  code.json             生成的代码清单
data/
  golden/               RNG 向量与跨语言一致性探针
  raw_bench.json        生成的原始记录
  benchmarks.json       生成的分析记录
lib/
  cpp/                  仅头文件的 C++20 库、Makefile 与测试
  julia/                Julia 包与测试
  python/               Python 包与测试
  js/                   与站点共用的 ES 模块引擎
assets/
  js/views/             总览、图册、实验、代码、算法、数据、检索、文献
  js/labs/              16 个实验与人工撰写的读图指南
  js/lib/               绘图、统计、运行记录与实验记录本
  css/hud.css           外壳样式
  css/reading.css       阅读层：字体、行宽、颜色与响应式规则
scripts/
  build_content.py      校验内容并生成 JSON
  check_translations.py 比较各语版本的节号、公式标签与展示块
  bench.cpp             C++ 原始数据程序
  analyse_bench.py      派生数据与拟合
  serve.py              本地静态预览服务器
  verify_references.py  Crossref/HTTP 文献审计
  parity_algorithms.py  算法库、v4 求解器与消息传递一致性
tests/js/               Node 测试
docs/                   API、RNG、算法、数据、标度、验证与编辑规范
wiki/                  GitHub wiki 源文件，由 scripts/push_wiki.sh 发布
```

## 设计与维护

- **阅读优先。** 正文用 720 px 的衬线行宽、句首大写的标题和浅色默认配色；仪表盘风格的等宽小字只留给实时读数，不用于正文。
- **内容。** Markdown + YAML 前页。每章有稳定 id，各语顺序一致。`scripts/build_content.py` 拒绝缺语、重复顺序或未解析的引用；`scripts/check_translations.py` 拒绝节号、公式标签或展示块数量漂移的章节。
- **翻译。** 人工撰写，不在运行时机器翻译。术语表与语气规则在 [`docs/EDITORIAL.md`](docs/EDITORIAL.md)；技术术语在三语中保持一致。新增第四种语言是内容与审校任务，不是引擎改动。
- **实验。** 每个实验运行与库测试相同的引擎。运行记录保存控制量、种子、读数、应用版本，以及在可得时的 commit；可下载为 JSON 或存入本地实验记录本。
- **可访问性。** 键盘导航、可见焦点、语义标题、图表的文字标签，以及保持对比度的明暗配色。图表用 canvas，但每个实验也以文字报告关键数字。
- **浏览器。** 支持当前 Chrome、Firefox、Safari 的 ES 模块与 `IntersectionObserver`。禁用 JavaScript 时，`content/` 中的 Markdown 仍可阅读。

## 范围与局限

这是参考书和教学工具，不声称新定理或新的高精度测量。每个数值都标为精确或数值；第 14 章的勘误表记录早期版本中的错误。

已知边界：

- 另一个仓库 `hmm-percolation` 中的合成市场示例不属于本图册。
- 基准是单种子、有限尺寸的教学数据，不是高精度测量。
- 三维指数是数值结果。二维指数只在三角格子位点渗流上有定理支持；其他平面格子仍是猜想。
- 树与消息传递的答案在树上精确、在局部树状图上渐近；在一般格子上是 Bethe 近似。
- SIR 对应在感染期恒定时精确；感染期变化时，它给出阈值与平均场最终规模，不是独立键。
- 站点不建模真实市场、流行病或基础设施数据。

## 参与

欢迎更正，尤其是带来源的更正。请先读 [`CONTRIBUTING.md`](CONTRIBUTING.md) 与 [`docs/EDITORIAL.md`](docs/EDITORIAL.md)。改动数值路径需要 `make test`、Python 套件与类似 `scripts/reproduce.sh` 的重新生成；改动一条断言需要补证明、补引用，或明确标为经验观察。

## 许可

代码：MIT（`LICENSE`）。文字与图：CC BY 4.0（`LICENSE-CONTENT`）。
