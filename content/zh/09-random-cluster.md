---
id: 09-random-cluster
part: Critical phenomena
order: 9
title: 随机簇模型
subtitle: 一个同时包含渗流、Ising 与 Potts 的模型
reading: 10 min
---

随机簇（RC）模型是给团簇形成以奖励的渗流。它是 $q$ 态 Potts 模型的 Fortuin–Kasteleyn 表示，在 $q=1$ 时就是普通渗流。它在图集中的价值有两重：一是在渗流与自旋系统之间架起严格的桥梁，二是提供使团簇更新成为计算物理标准做法的算法（Swendsen–Wang、Edwards–Sokal）。

## 9.1 定义

设 $G=(V,E)$ 有限。对 $p\in[0,1]$ 与 $q>0$，令
$$
\phi_{p,q}(\omega)=\frac{1}{Z_G(p,q)}\,p^{|\omega|}(1-p)^{|E|-|\omega|}\,q^{k(\omega)},
\qquad
Z_G(p,q)=\sum_{\omega\in\{0,1\}^E}p^{|\omega|}(1-p)^{|E|-|\omega|}q^{k(\omega)},
$$
其中 $k(\omega)$ 是开子图的连通分量数，孤立顶点也计入。在 $q=1$ 时，团簇权重消失，$\phi_{p,1}$ 就是伯努利渗流。要使测度有意义，$q$ 不必是整数；但自旋解释要求 $q\in\{2,3,\dots\}$。

## 9.2 Potts 对应

**命题 9.1（★）。** 对整数 $q\ge2$ 与 $\beta\ge0$，$q$ 态 Potts 配分函数
$$
Z_{\text{Potts}}(\beta)=\sum_{\sigma\in\{1,\dots,q\}^V}\exp\Big(-\beta\sum_{e=(u,v)}\big(1-\delta_{\sigma_u\sigma_v}\big)\Big)
$$
等于 $Z_G(p,q)$ 乘上一个显式因子，其中 $p=1-e^{-\beta}$。

**证明。** 对单条边，恒等式
$$
e^{-\beta(1-\delta_{\sigma_u\sigma_v})}=1+\big(e^{\beta}-1\big)\delta_{\sigma_u\sigma_v}
$$
分两种情况直接验证即可。把所有边乘起来并展开乘积，
$$
\prod_{e\in E}\Big(1+(e^\beta-1)\delta_{\sigma_u\sigma_v}\Big)
=\sum_{\omega\subseteq E}(e^\beta-1)^{|\omega|}\prod_{e\in\omega}\delta_{\sigma_u\sigma_v}.
$$
对 $\sigma$ 求和时，δ 的乘积迫使 $\sigma$ 在 $(V,\omega)$ 的每个连通分量上为常数，而每个分量可以取 $q$ 种颜色中的任意一种。共有 $q^{k(\omega)}$ 种染色，所以
$$
Z_{\text{Potts}}(\beta)=\sum_{\omega\subseteq E}(e^\beta-1)^{|\omega|}q^{k(\omega)}
=\sum_\omega p^{|\omega|}(1-p)^{|E|-|\omega|}q^{k(\omega)}\cdot(1-p)^{-|E|},
$$
这里用了 $e^\beta-1=p/(1-p)$。最后一个因子与 $\omega$ 无关，在归一化中消去。$\blacksquare$

在 $q=2$ 时，这是 Fortuin–Kasteleyn 形式的 Ising 模型，渗流概率变成磁化强度：$\langle\sigma_0\rangle$ 随原点连通到边界的概率单调递增。这种对应是精确的，不是类比；正因为如此，渗流指数可以用自旋模型的技术计算，反过来也一样。

## 9.3 推论

**共享临界点。** RC 模型在某个值 $p_c(q)$ 处发生相变，该值是 Potts 临界温度的像。对 $\mathbb{Z}^2$ 上的 $q=2$，自对偶点是 $p_c=\sqrt2/(1+\sqrt2)=0.585786\ldots$，它在 $p=1-e^{-2\beta_c}$ 下对应 Ising 临界点 $\sinh(2\beta_c)=1$。这个等式是定理，它不用转移矩阵计算就给出 $\mathbb{Z}^2$ 上的 Ising 临界温度。$p=1/2$ 是 $q=1$（渗流）的特例，不是 Ising 点。

**关于 $q$ 的单调性。** 当 $q\ge1$ 时 RC 测度正关联，满足 FKG；渗流概率关于 $p$ 单调，并且固定 $p$ 时，在适当的耦合下关于 $q$ 单调。这就是为什么增大 $q$ 可以把连续相变变成一级相变：团簇奖励偏向稠密相。

**对偶。** 在平面图上，RC 模型有一个参数经过变换的对偶模型；在正方格子上，自对偶曲线是 $p=\sqrt q/(1+\sqrt q)$，在 $q=1$ 时化为 $p\leftrightarrow1-p$。这些对偶关系是引理 4.2 的 RC 推广，也是通向正方格子与三角格子上依赖 $q$ 的临界点的最简洁路径。

## 9.4 算法

蒙特卡罗物理中两个最有用的算法，都来自 RC 表示。

**Swendsen–Wang (1987)。** 给定自旋构型，当一条边的两个端点自旋相同时，以概率 $p=1-e^{-J}$ 打开该边，否则永不打开，由此构造 Fortuin–Kasteleyn 团簇；其中 $J$ 是 Potts 耦合（对上面的 Ising 归一化，$J=2\beta$）。然后给每个团簇分配一种新的随机颜色。得到的新自旋构型对 Potts 测度是平稳的。这个更新是非局部的：它可以在一步内翻转整个关联区域，因此能在临界点附近胜过单自旋 Metropolis。

**Edwards–Sokal (1988)。** 对自旋与键的联合更新，是 RC 测度的 Gibbs 采样器；它给出在自旋图景与团簇图景之间系统插值的方法，是测量团簇可观测量的标准工具。

两个算法都不改变物理，改变的是关联时间。在临界点，单自旋 Metropolis 算法受临界慢化困扰，动力学指数 $z\approx2$；对 Potts 模型，团簇算法显著降低 $z$。对渗流本身（$q=1$），相关的算法不是 Swendsen–Wang，而是第 11 章的 Newman–Ziff 扫描：它从一次随机边序出发，采样整条耦合曲线，而不是依赖马尔可夫链。

## 9.5 RC 模型不解决什么

RC 模型不给出一般格子上的渗流阈值，因为 $q=1$ 的模型没有可解的自旋表示。除非借助 Coulomb 气体 / SLE 这套工具，它也不给出二维的完整标度极限，而那套工具是另一条发展路线。它也没有使三维指数变得严格：$d=3$ 时 $q=1$ 的 RC 模型与渗流一样难。

它真正提供的是一种语言。在伯努利图景中别扭的渗流陈述——边界条件、wired/free 极限、团簇权重、“以连通为条件”的含义——在 RC 图景中变得自然。本图集中的大部分严格技术（FKG、匹配定理、锐性证明）都是在 RC 语言中发展出来，然后专门化到 $q=1$ 的。
