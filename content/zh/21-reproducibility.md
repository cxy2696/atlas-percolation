---
id: 21-reproducibility
part: synthesis
order: 21
title: 可复现性、不确定性与误差预算
subtitle: 从一个种子到一个可发表的数，再原路返回
reading: 18 min
---

不可复现的结果只是故事。本章陈述本图册使用的契约、检查它的命令，以及细心的读者仍应怀疑的地方。目标不是宣称每个数都精确，而是让每个数都能追溯到种子、尺寸、估计量与版本。

## 21.1 制品契约

仓库就是制品。五类东西一起版本化。

1. **源。** Markdown 章节、JSON 文献库、引用映射。
2. **引擎。** Bernoulli 核心、v3 算法库、标号例程与树/流行病求解器都有 C++20、Julia、Python 与 JavaScript 实现。
3. **金标。** `data/golden/parity.json` 对应四语言核心，`data/golden/rng-seed42.json` 对应随机流，`data/golden/algorithms-v3.json` 对应新算法。
4. **数据。** 原始基准计数、分析后的记录，以及产生它们的工具。
5. **构建与部署。** 内容构建器、静态服务器、Python 包、API、Dockerfile 与 CI 工作流。

对随机数生成器、边序或消费顺序的任何改动都是破坏性变更：必须重新生成金标、提升版本，并在第 14 章记录修正。采样约定的改动同理，即使代码“看起来仍然正确”。

## 21.2 随机流

生成器是 xoshiro128**，用 SplitMix32 播种。约定固定：

- 种子对 $2^{32}$ 取模；
- 播种执行四步 SplitMix32；
- `random()` 消费两个 32 位输出，先高 26 位、后低 27 位，返回 $[0,1)$ 中 $2^{-53}$ 的精确倍数；
- `int(n)` 对不超过 $2^{32}$ 的 $n$ 的最大倍数做拒绝采样；
- 位点渗流按位点顺序抽 $n$ 个均匀数；键渗流按 `build_lattice` 的边序抽 $m$ 个均匀数。

每个实现都遵循这个顺序。金标文件保存固定抽数后的原始输出，所以分歧会在变成错误指数之前被抓住。完整规范见 `docs/RNG.md`。

## 21.3 一致性测试

核心契约是四语言的。`scripts/parity.py` 计算 Python 探针，运行 `scripts/parity_probe.mjs` 得到 JavaScript 结果，并与 `data/golden/parity.json` 比较；C++ 与 Julia 套件从同一文件断言相同值。

算法库是四语言契约。`scripts/parity_algorithms.py` 比较 Python 与 JavaScript 的自举激活时间、侵入顺序、Leath 团簇大小与 Achlioptas 轨迹；C++ 与 Julia 套件断言同一份 `data/golden/algorithms-v3.json` 的值，并覆盖确定性的 Hoshen–Kopelman、Bethe 与 SIR 探针。

运行：

```sh
python3 scripts/parity.py
python3 scripts/parity_algorithms.py
node --test tests/js/*.test.js
PYTHONPATH=lib/python python3 -m unittest discover -s lib/python/tests -v
```

一致性测试不是统计检验。它说的是：对固定输入，两个实现在整数或精确分量大小上一致。这是统计比较之前能做的最强检查，也是抓住大多数静默错误的那一个。

## 21.4 统计协议

蒙特卡洛估计需要四个数：样本量、种子（或种子表）、估计量与不确定度。本图册使用以下规则。

- **独立种子，而不是一条长跑。** 估计阈值时，用 $R$ 个独立种子各产生一个估计，报告 $R$ 个估计的均值与标准误。单条长跑会低估方差，因为相邻构型相关。
- **比较时用共同随机数。** 比较两个算法或两个设计时，使用同一批无序实现。比较是配对的，差值的方差远小于任一均值的方差。
- **相关扫描要分块。** Newman–Ziff 扫描给出相关的点。误差棒来自独立边序，而不是一条边序上的 $m$ 个点。
- **报区间，不报标准差。** 报告 95% 区间。比例接近 0 或 1 时用 Wilson 或 Jeffreys；种子数少时用 $t$ 区间并说明。
- **预先登记停止规则。** “跑到看起来收敛”不是停止规则。提前固定种子数或目标半宽。

## 21.5 误差预算

图册中的每个数值论断都有五行的误差预算。

| 来源 | 是什么 | 如何控制 | 典型大小 |
|---|---|---|---|
| 随机流 | 无序的有限样本 | 独立种子、配对比较 | $O(n^{-1/2})$ |
| 有限尺度 | $L/\xi$ 不是无限 | 坍缩拟合、修正项、多个 $L$ | $O(L^{-1/\nu})$ |
| 离散化 | 格子或时间步近似连续 | 细化步长、比较两种分辨率 | 依赖问题 |
| 估计量偏差 | 例如用 $S=0.5$ 交点代替坍缩 | 用更好的估计量，两者都报 | 教学基准中约 $10^{-2}$ |
| 模型误差 | 图或占据律是错的 | 留出数据验证、敏感性分析 | 常常是主导项 |

最后一行在应用中最重要的，也是模拟无法消除的。一个误差棒完美但图画错了的渗流模型，仍然是错的。

## 21.6 复现一张图

Data 视图中的每张图都标明源记录与产生它的命令。顺序是：

```sh
make content       # 重新生成 manifest、搜索索引、代码清单
make bench         # C++ 工具 -> data/raw_bench.json
make analyse       # 原始计数 -> data/benchmarks.json
make test          # 四语言套件 + 一致性
make serve         # http://127.0.0.1:8788/
```

基准是教学数据集，不是高精度测量。它的规模设计为几分钟内跑完，并让有限尺度行为可见。Data 视图显示确切的样本量、种子与日期；文件缺失时显示命令，而不是编造曲线。

## 21.7 算法包

Python 包是引擎的可分发形式。

```sh
python3 -m pip install -e lib/python
atlas-perc info
atlas-perc sample --lattice square --mode bond --L 128 --p 0.5 --seed 42
atlas-perc sweep  --lattice square --L 64 --seed 7
atlas-perc bootstrap --L 64 --p 0.55 --r 3 --seed 11
atlas-perc invasion  --L 48 --seed 3
atlas-perc explosive --n 2000 --rule product --seed 7
atlas-perc serve --port 8080
```

`atlas-perc serve` 同时提供静态站点与 JSON API：

| 路由 | 用途 |
|---|---|
| `GET /api/health` | 版本、构建时间、引擎状态 |
| `GET /api/thresholds` | 精确与数值阈值及其状态 |
| `POST /api/sample` | 单构型与团簇统计 |
| `POST /api/sweep` | Newman–Ziff 曲线 |
| `POST /api/bootstrap` | 自举闭包 |
| `POST /api/invasion` | 侵入团簇 |
| `POST /api/explosive` | Achlioptas 轨迹 |
| `GET /api/openapi.json` | 机器可读 schema |

API 故意很小，没有认证。它是参考服务，不是生产级多租户部署。公网部署时应放在限流器与反向代理之后；Dockerfile 是起点，不是加固设备。

## 21.8 报告清单

一个渗流数字离开笔记本之前，回答这些问题。

- [ ] 模型是否写成“图 + 占据律”？
- [ ] 边界条件是否说明（开、周期、wired）？
- [ ] 估计量是否有定义，且确实是你算的那个？
- [ ] 样本量是否给出，种子或种子表是否归档？
- [ ] 不确定度是标准误、置信区间还是标准差？
- [ ] 有限尺度修正是否估计，或论断是否明确为渐近？
- [ ] 数值是否标注为精确、数值或猜想？
- [ ] 代码版本或提交是否记录？
- [ ] 第二个实现是否复现整数探针？
- [ ] 模型的失效模式是否陈述？

能回答全部十项的读者可以复现这个数；不能的读者只有故事，没有结果。

## 21.9 哪些不能复现

本图册有三样东西不是逐位可复现的。

1. **墙钟时间。** 算法工坊报告浏览器计时用于教学；它们依赖机器、JIT 与负载。要比较实现，请用 C++ 工具。
2. **浮点超越函数。** `sin`、`exp`、`log` 与超几何求值在不同 libm 版本间可能末位不同。金标对这些值用容差，只对整数与分量大小用精确相等。
3. **已发布的网页。** 线上站点在发布后可能变化。仓库标签与归档的 `_site/` 制品才是可复现对象；URL 只是便利。

明确这些限制是可复现性主张的一部分，而不是对它的否定。
