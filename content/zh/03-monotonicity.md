---
id: 03-monotonicity
part: Rigorous core
order: 3
title: 单调性与阈值的存在性
subtitle: FKG、耦合，以及 p_c 为何必然存在
reading: 13 min
---

阈值必须先存在，才谈得上计算。本章证明它确实存在，并顺带引入此后每个论证都要用到的两个不等式：正关联（FKG）与 $\theta$ 的耦合单调性。这些证明都是初等的；之所以完整写出，是因为图册余下的部分都要倚仗它们。

## 3.1 构型空间

令 $\Omega=\{0,1\}^{E}$，配以由柱集生成的乘积 $\sigma$-代数 $\mathcal{F}$。若对每条边都有 $\omega_e\le\omega'_e$，就记 $\omega\le\omega'$。可测集 $A$ 若满足“$\omega\in A$ 且 $\omega\le\omega'$ 蕴含 $\omega'\in A$”，则称为**递增集**；递减集则把不等号反向定义。事件 $\{0\leftrightarrow\infty\}$、$\{\exists\text{ an open crossing}\}$ 与 $\{|C_0|\ge n\}$ 都是递增的；$\{0\nleftrightarrow\infty\}$ 则是递减的。

测度 $\mathbb{P}_p$ 是参数为 $p$ 的乘积 Bernoulli 测度。关于它，有两个事实被反复使用：

- **有限能量。** 只要 $0<p<1$，每个有限柱集的概率都落在 $(0,1)$ 内。
- **独立性。** 不相交的边集上的限制相互独立。

## 3.2 正关联

**定理 3.1（Harris 1960；Fortuin–Kasteleyn–Ginibre 1971）。** 对递增事件 $A,B$，
$$
\mathbb{P}_p(A\cap B)\ \ge\ \mathbb{P}_p(A)\,\mathbb{P}_p(B).
$$

**证明（★）。** 只需对有限指标集证明该不等式，再取极限；这是因为在柱集逼近下，不等式两端都连续。

于是设 $n$ 有限，记 $\mathbb{P}=\mathbb{P}_{n-1}\otimes\mu_n$，其中 $\mu_n$ 是最后一个坐标的 Bernoulli 分布。对递增事件 $A,B$，定义
$$
F(t)=\mathbb{P}_{n-1}\big(A\,\big|\,\omega_n=t\big),\qquad G(t)=\mathbb{P}_{n-1}\big(B\,\big|\,\omega_n=t\big),\qquad t\in\{0,1\}.
$$
在 $\omega_n=t$ 的条件下，$A$ 与 $B$ 是余下 $n-1$ 个坐标上的递增事件，故由归纳假设得
$$
\mathbb{P}_n(A\cap B\mid\omega_n=t)\ \ge\ F(t)G(t).
$$
以权重 $p_0=1-p$、$p_1=p$ 平均，得
$$
\mathbb{P}_n(A\cap B)\ \ge\ p_0F(0)G(0)+p_1F(1)G(1).
$$
另一方面
$$
\mathbb{P}_n(A)\mathbb{P}_n(B)=\big(p_0F(0)+p_1F(1)\big)\big(p_0G(0)+p_1G(1)\big).
$$
两式相减得
$$
\mathbb{P}_n(A\cap B)-\mathbb{P}_n(A)\mathbb{P}_n(B)\ \ge\ p_0p_1\big(F(1)-F(0)\big)\big(G(1)-G(0)\big)\ \ge\ 0,
$$
因为 $F$ 与 $G$ 均非降：调高最后一个坐标不可能破坏一个递增事件。基础情形 $n=1$ 直接可得，而极限 $n\to\infty$ 由柱代数上测度的连续性得到。$\blacksquare$

同一论证施于递减事件，或施于一增一减的混合情形，可给出四种单调组合；下文只需递增–递增这一种。

## 3.3 耦合与序参量的单调性

**推论 3.2。** $p\mapsto\theta(p)$ 非降；对每个递增事件 $A$，$p\mapsto\mathbb{P}_p(A)$ 也非降。

**证明（★）。** 取一族独立的均匀随机变量 $\{U_e\}$，定义 $\omega_e(p)=\mathbf 1\{U_e\le p\}$。于是 $p\le p'$ 逐边蕴含 $\omega(p)\le\omega(p')$。事件 $\{0\leftrightarrow\infty\}$ 是递增的，因此
$$
\theta(p)=\mathbb{P}\big(\omega(p)\in\{0\leftrightarrow\infty\}\big)\ \le\ \mathbb{P}\big(\omega(p')\in\{0\leftrightarrow\infty\}\big)=\theta(p').
$$
同一耦合对任意递增事件都给出单调性。$\blacksquare$

**推论 3.3（正则性）。** $\theta$ 在 $[0,1]$ 上右连续，且至多有可数多个不连续点。

**证明。** 对 $m\ge1$，令 $\theta^{(m)}(p)=\mathbb{P}_p(|C_0|\ge m)$。每个 $\theta^{(m)}$ 都是有限柱集上的概率，因而是 $p$ 的多项式，连续。由于 $\{|C_0|=\infty\}=\bigcap_m\{|C_0|\ge m\}$ 是递减交，$\theta(p)=\lim_m\downarrow\theta^{(m)}(p)$。连续函数的递减极限是上半连续的；再结合单调性，便得到右连续。单调函数至多有可数多个跳跃点。$\blacksquare$

右连续性正是 $p_c$ 可以用“$\inf$”而不是“模去零集后的 $\inf$”来定义的原因：集合 $\{p:\theta(p)>0\}$ 是形如 $(p_c,1]$ 或 $[p_c,1]$ 的区间，而两种可能取决于 $\theta$ 是否在 $p_c$ 处跳跃。二维时它不跳（定理 5.5）；平均场模型中也不跳；耦合网络里则可能跳——这正是第 10 章的主题。

## 3.4 存在性，以及显式界

**定理 3.4（Hammersley 1957）。** 设 $G$ 的最大度为 $\Delta<\infty$，连通常数为
$$
\lambda=\lim_{n\to\infty}\Big(\#\{\text{self-avoiding paths of length }n\text{ from }0\}\Big)^{1/n}.
$$
则
$$
\frac{1}{\Delta-1}\ \le\ p_c(G)\ \le\ \frac{1}{\lambda}.
$$
特别地，对每个 $d\ge2$ 的格子都有 $0<p_c<1$。

**下界的证明（★）。** 设 $N_n$ 为从原点出发、长度为 $n$ 的开自避路径数，按重数计，并令 $N=\sum_{n\ge0}N_n$。长度为 $n$ 的路径有 $n$ 条边，故 $\mathbb{E}_p[N_n]\le\Delta(\Delta-1)^{n-1}p^n$；对几何级数求和得
$$
\mathbb{E}_p[N]\ \le\ 1+\frac{\Delta p}{1-(\Delta-1)p}\ <\ \infty\qquad\text{whenever }p<\frac{1}{\Delta-1}.
$$
$C_0$ 的每个顶点都至少是一条从原点出发的开路径的终点，所以 $|C_0|\le N$，进而 $\mathbb{E}_p|C_0|<\infty$。若 $\theta(p)>0$，则 $\mathbb{P}_p(|C_0|=\infty)>0$，这迫使 $\mathbb{E}_p|C_0|=\infty$，矛盾。因此当 $p<1/(\Delta-1)$ 时 $\theta(p)=0$，即 $p_c\ge1/(\Delta-1)$。$\blacksquare$

**上界的证明梗概。** 固定满足 $p\lambda>1$ 的 $p$。此时 $\mathbb{E}_p[N_n]=\kappa_np^n$ 指数增长，其中 $\kappa_n$ 是长度为 $n$ 的自避路径数。二阶矩估计
$$
\mathbb{E}_p\big[N_n^2\big]\ \le\ C(p)\,\mathbb{E}_p[N_n]^2
$$
对 $1$ 的某邻域内一切 $p$ 成立，并借助自避游走的标准次乘性论证推广到每个 $p>1/\lambda$；常数吸收了相交路径对的数目，当 $p$ 足够接近 $1$ 时它是 $O(\theta^n)$，其中 $\theta<1$。于是由 Cauchy–Schwarz（Paley–Zygmund）不等式
$$
\mathbb{P}_p(N_n>0)\ \ge\ \frac{\mathbb{E}_p[N_n]^2}{\mathbb{E}_p[N_n^2]}
$$
可知，该概率被一个与 $n$ 无关的正常数 $c(p)$ 从下方界住。由于 $N_n>0$ 蕴含 $|C_0|\ge n$，于是对每个 $n$ 都有 $\mathbb{P}_p(|C_0|\ge n)\ge c(p)$。事件 $\{|C_0|\ge n\}$ 随 $n$ 递减，其极限是 $\{|C_0|=\infty\}$，故 $\mathbb{P}_p(|C_0|=\infty)\ge c(p)>0$，从而 $p>p_c$。因此 $p_c\le1/\lambda$。$\blacksquare$

**注。** 下界在树上是锐的：对 $z$-正则树，$\Delta=z$、$\lambda=z-1$，两个界都等于 $1/(z-1)$。在 $\mathbb{Z}^d$ 上，两个界之间留下一道很宽的缝，而这正是接下来两章的内容。

**定理 3.5（Peierls 论证）。** 对 $\mathbb{Z}^d$（$d\ge2$）上的键渗流，$p_c<1$。

**证明梗概。** 假设原点的开团簇有限。那么它被一层闭的 $\ast$-连通对偶面片包围：存在一个有限的、由对偶 $(d-1)$-面组成的集合 $S$，把原点与无穷隔开。$S$ 中每块面片都对偶于一条闭键，故 $\mathbb{P}_p(S\text{ is closed})=(1-p)^{|S|}$。

剩下的是数这样的曲面。一个由 $n$ 块对偶面片组成的 $\ast$-连通集合，若含有与原点相邻的固定面片，就可以一次一块地长出来；每块新面片沿一个面与当前集合相接，每一步至多有 $c_d$ 种选择，其中 $c_d=4d$（一个粗糙但够用的界）。因此这样的集合至多有 $c_d^{\,n}$ 个，于是
$$
\mathbb{P}_p(0\nleftrightarrow\infty)\ \le\ \sum_{n\ge1}c_d^{\,n}(1-p)^n.
$$
当 $1-p<c_d^{-1}$ 时级数收敛且严格小于 $1$，故 $\theta(p)=1-\mathbb{P}_p(0\nleftrightarrow\infty)>0$。因此 $p_c\le 1-c_d^{-1}<1$。$\blacksquare$

同一论证还给出一个显式（但很差）的数值界。更好的界来自带权地数曲面，Ising 模型与格点规范理论中的 Peierls 论证正是这样用的。

## 3.5 $p_c$ 的三种定义

**定理 3.6。** 在可迁可均图上，
$$
p_c=\inf\{p:\theta(p)>0\}=\sup\{p:\chi(p)<\infty\}.
$$

**证明。** 第一个等号是定义。若 $p<p_c$，则 $\theta(p)=0$，而 $\chi(p)<\infty$ 正是锐性定理（定理 5.1）所断言的，其证明见第 5 章。反之，若 $\chi(p)<\infty$，则 $\mathbb{P}_p(|C_0|=\infty)=0$，因为无穷团簇会在定义 $\chi$ 的求和中贡献一个无穷项。于是 $\sup\{p:\chi<\infty\}\le p_c$，再由锐性知等号成立。$\blacksquare$

这个恒等式在实际中很重要。数值工作通过 $\chi$ 的发散来定位 $p_c$，而正是这一定理允许把该发散解读为关于 $\theta$ 的陈述。它也解释了为什么两种常见的操作型定义——“磁化率爆炸”与“出现无穷团簇”——可以互换使用，以及为什么二者都不能取代有限尺度标度（第 11 章）。

## 3.6 单调性给不出的东西

单调性说的是*在图固定的前提下改变 $p$*，对改变图本身只字未提。加边会降低 $p_c$；把每条边细分，相当于把概率为 $p$ 的开键换成两个串联的键，于是键阈值移到 $\sqrt{p_c}$，反而升高。“连接越多，阈值越低”这一直觉，对加边是可靠的，对任意的图操作则不然。第 11 章列出由此产生的陷阱。

第二个局限：FKG 是不等式，不是恒等式。它只给出关联的符号，不给出关联的大小；要做定量工作（例如 RSW 常数），需要的是真正的横穿估计，其精细程度高得多。
