# 渗流图册（Percolation Atlas）

[English](README.md) · **简体中文** · [Deutsch](README_de.md)

[![CI](https://github.com/cxy2696/atlas-percolation/actions/workflows/ci.yml/badge.svg)](https://github.com/cxy2696/atlas-percolation/actions/workflows/ci.yml) [![Pages](https://github.com/cxy2696/atlas-percolation/actions/workflows/pages.yml/badge.svg)](https://github.com/cxy2696/atlas-percolation/actions/workflows/pages.yml) [![Release](https://img.shields.io/github/v/release/cxy2696/atlas-percolation?label=release)](https://github.com/cxy2696/atlas-percolation/releases)

一部有原始文献支撑、三语并行的渗流理论图册：四种参考实现、十六个交互实验室、十三条算法精读，以及可追溯的数值与勘误记录。站点是无运行时框架的静态 HUD，直接读取 Markdown、JSON 与 JavaScript 引擎，可被归档、镜像或部署到任意静态主机。

**当前内容：** 23 章（英文、简体中文、德文）· 16 个实验室 · 13 条算法精读 · 4 种语言实现 · 140 篇文献 · 一个可 `pip` 安装的算法包。站点默认以**浅色、英文**打开，并记住读者的语言与主题选择。

## 内容一览

| 层次 | 内容 |
|---|---|
| 知识库 | 23 章：从 1957 年奠基论文，到对偶、锐性、临界指数、SLE、随机簇模型、网络、测量、应用、算法、有向与连续渗流、输运、跨学科地图、证明附录、不确定性下的设计、可复现性、树与生成函数、流行病即渗流 |
| 文献 | 140 条（论文、专著、博客、软件），附 DOI 或稳定链接；Crossref/HTTP 审计记录（138 条通过，2 条解释性附注）；逐章来源表与勘误表 |
| 代码 | C++20（header-only）、Julia、Python、JavaScript；共享同一 xoshiro128** 随机流与同一格子边序 |
| 实验室 | 格子渗流、横穿坍缩、Newman–Ziff 扫描、网络鲁棒性、耦合级联、布尔模型、Cardy 公式、有向渗流、随机簇/Potts、自举渗流、爆炸渗流、侵入渗流、算法工坊、Bethe 树、SIR 即渗流、三维位点渗流 |
| 算法 | 13 条精读：Bernoulli 抽样、并查集、键/位点 Newman–Ziff、Leath 生长、自举、侵入、Achlioptas、k-core、Hoshen–Kopelman、Bethe 不动点、SIR 最终规模、消息传递。每条给出想法、不变量、代价、易错点与精确源码链接 |
| 数据 | C++ 基准程序、Python 分析器，以及 Data 视图直接读取的 JSON 记录；缺数据时如实说明，不伪造曲线 |
| 测试 | 四语言整数级一致性探针（含算法库、v4 树/流行病求解器、位点扫描与消息传递）、RNG 金标向量、性质测试与文献审计 |
| 示例 | 四语言并排调用：`docs/EXAMPLES.md`；代码阅读地图：`docs/ALGORITHMS.md`；CLI 与 JSON API：`docs/API.md` |

**在线站点：** <https://cxy2696.github.io/atlas-percolation/> · **Wiki：** <https://github.com/cxy2696/atlas-percolation/wiki>（源文件在 `wiki/`）· **发布：** [v4.3.0](https://github.com/cxy2696/atlas-percolation/releases/tag/v4.3.0) · **安装：** `pip install -e lib/python`

## 快速开始

要求：Python 3.10+、Node.js 20+（测试与站点构建）、C++20 编译器。只有 Julia 测试套件需要 Julia 1.9+。

```sh
git clone https://github.com/cxy2696/atlas-percolation.git
cd atlas-percolation

python3 scripts/build_content.py     # 生成 manifest、搜索索引、代码清单
python3 scripts/serve.py 8788        # http://127.0.0.1:8788/
```

打开 `http://127.0.0.1:8788/`。必须通过 HTTP 服务访问：内容加载器使用 `fetch()`，浏览器会阻止 `file://` 请求。

默认路由是“从这里开始”指南（`#/en/guide`），英文、浅色。九个主视图是 `#/en/guide`、`#/en/overview`、`#/en/atlas`、`#/en/labs`、`#/en/code`、`#/en/algorithms`、`#/en/data`、`#/en/library`、`#/en/sources`。把 `en` 换成 `zh` 或 `de` 即可切换语言；顶栏也有语言开关，选择会记在 `localStorage`。

## 复现全部检查

```sh
make test          # 四套测试 + 一致性契约 + 翻译结构 + 文字数值校验
make verify        # 翻译结构 + 文字数值校验 + 文献审计
make bench         # C++ 基准 -> data/raw_bench.json
make analyse       # 原始 JSON -> data/benchmarks.json
make content       # 重建 manifest/搜索索引/代码清单
make audit         # Crossref/HTTP 文献审计
make package       # Python 算法包的 wheel + sdist
```

也可单独运行：

```sh
node --test tests/js/*.test.js
PYTHONPATH=lib/python python3 -m unittest discover -s lib/python/tests -v
make -C lib/cpp test
julia --project=lib/julia lib/julia/test/runtests.jl
```

一致性契约在 `data/golden/parity.json`；随机流向量在 `data/golden/rng-seed42.json`；算法库、位点扫描、消息传递与 v4 求解器的探针在 `data/golden/algorithms-v3.json`，由四个测试套件共同断言。改动 RNG、格子边序或消耗顺序都是破坏性变更：必须重生成金标、提升版本，并在第 14 章记录。完整检查矩阵与边界见 [`docs/VERIFICATION.md`](docs/VERIFICATION.md)。

## 基准流水线

```sh
make bench
make analyse
```

`scripts/bench.cpp` 只写原始计数（`n`、`hits`、尺寸）与种子；`scripts/analyse_bench.py` 加入派生量、Cardy 曲线、坍缩拟合与单臂斜率，并写入生成时间。Data 视图读取 `data/benchmarks.json`；文件缺失时显示上述命令，而不是编造曲线。

这是教学数据集，不是高精度测量。它被刻意控制在几分钟内跑完，用来让有限尺度行为可见。第 11 章说明它能支持什么、不能支持什么。

## 算法包、CLI 与 API

Python 包是引擎的可分发形式，运行时只依赖标准库。

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

`atlas-perc serve` 同时提供静态站点与 `/api` 下的 JSON API（`/api/health`、`/api/thresholds`、`/api/sample`、`/api/sweep`、`/api/bootstrap`、`/api/invasion`、`/api/explosive`、`/api/openapi.json`）。API 是带输入上限、无鉴权的参考服务；公网部署请放在反向代理之后。详见 `docs/API.md`。

部署选项：GitHub Pages（正式站点）、Docker（`Dockerfile`）、Netlify、Vercel、Fly.io。细节见 [`deploy/DEPLOY.md`](deploy/DEPLOY.md)。

## 主题、指南与可访问性

首次访问默认浅色/英文；已保存的选择优先，`?theme=dark` 与 `?theme=light` 可覆盖，便于分享与截图。主题开关在顶栏，所有画布都会用当前样式表重绘。

每个实验室都有三种语言撰写的阅读指南：图里是什么、每个参数做什么、如何读动态、可以试什么、模型在哪里失效。浅/深色选择保存在 `localStorage`，首次访问跟随系统偏好，也可用 `?theme=light` 或 `?theme=dark` 强制。画布颜色解析自当前样式表，切换主题无需刷新。

## 仓库结构

```
README.md / README_cn.md / README_de.md  三语仓库说明
content/
  en/ zh/ de/           逐章 Markdown，三种语言各一份
  reference_audit.json  scripts/verify_references.py 生成
  references.json       主文献库（DOI 或稳定出版方链接）
  citations.json        章节 -> 文献键
  manifest.json         生成；不要手改
  search.json           生成的全全文索引
  code.json             生成的源码清单
data/
  golden/               RNG 向量与跨语言一致性探针
  raw_bench.json        生成的原始记录
  benchmarks.json       生成的分析记录
lib/
  cpp/                  header-only C++20 库 + Makefile + 测试
  julia/                Julia 包 + 测试
  python/               Python 包 + 测试
  js/                   与站点共享的 ES-module 引擎
                        （渗流、键/位点 Newman–Ziff、网络、连续渗流、
                         Cardy、有向、自举、侵入、爆炸、Leath、树、消息传递）
assets/
  js/views/             总览、图册阅读器、实验室、代码、算法、数据、文库、文献
  js/labs/              十五个实验仪器，附人工撰写的指南
  css/hud.css           HUD 外壳
scripts/
  build_content.py      校验内容并生成 JSON
  check_translations.py 检查三语版本的章节号、公式标签与显示公式数
  bench.cpp             C++ 原始数据程序
  analyse_bench.py      派生数据与拟合
  serve.py              静态预览服务器
  verify_references.py  Crossref/HTTP 文献审计
  parity_algorithms.py  算法库、v4 求解器与消息传递一致性
tests/js/               Node 测试套件
docs/                   API、RNG、算法、数据、扩展与编辑规范
wiki/                  GitHub Wiki 源文件，由 scripts/push_wiki.sh 发布
```

## 设计与维护

- **界面。** 石墨/青色仪器风 HUD、细线、等宽读数。总览是一张实时等距键渗流图，带状态滑杆。不用图片、不用 Web 字体、不用运行时框架；唯一的前端第三方文件是随仓库携带的 KaTeX 与 marked。
- **内容。** Markdown + YAML front matter。每章有稳定 id，三种语言顺序一致。`scripts/build_content.py` 拒绝缺语种、重复 order 或未解析引用；`scripts/check_translations.py` 拒绝章节号、公式标签或显示公式数量漂移的章节。
- **翻译。** 人工撰写，不在运行时机器翻译。术语与语气规范见 `docs/EDITORIAL.md`。README 提供 [English](README.md)、[简体中文](README_cn.md)、[Deutsch](README_de.md) 三个版本；站点顶栏切换会同时改变界面与正文语言。
- **可访问性。** 键盘导航、可见焦点、语义标题、可跳过的正文区、带文字读数的图表。颜色不是唯一的信息载体：每个阶段读数都有文字标签。浅色与深色主题都保持对比度检查过的调色板。
- **浏览器支持。** 当前 Chrome、Firefox、Safari（ES modules 与 `IntersectionObserver`）。禁用 JavaScript 时退化为可读的 Markdown。复杂度与内存上限见 `docs/SCALING.md`。

## 部署

仓库本身就是一个静态站点。把目录发布到 GitHub Pages、Netlify、对象存储或任意静态服务器即可；唯一要求是根目录有 `index.html`，旁边有 `assets/`、`content/`、`data/`。

`.github/workflows/pages.yml` 会把 `index.html`、`assets/`、`content/`、`data/` 组装进 `_site/` 并部署。正式地址是 <https://cxy2696.github.io/atlas-percolation/>。除 `python3 scripts/build_content.py` 外不需要构建步骤。

## 范围与诚实

这是参考与教学仪器，不是原始文献的替代品，也不声称提出新定理或新的高精度测量。每个数值都标注 exact 或 numerical；第 14 章的勘误表记录早期版本发现并修正的错误，包括曾把耦合级联一致性探针从 0.668 改为 0.5306666666666666 的算法错误。

## 许可

代码：MIT（`LICENSE`）。文字与图：CC BY 4.0（`LICENSE-CONTENT`）。
