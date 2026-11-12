---
id: 02-history
part: Foundations
order: 2
title: 一段简史
subtitle: 从咖啡渣到共形不变性
reading: 9 min
---

渗流的历史异常干净：有一篇确定的开山论文，一个确定的黄金时代，以及二维问题的一个确定解决。以下是一条附有原始文献的时间线，每一条说法都可追溯。

## 1957：奠基论文

S. R. Broadbent and J. M. Hammersley, *Percolation processes: I. Crystals and mazes*, **Math. Proc. Cambridge Philos. Soc.** 53(3), 629–641. 该文引入模型，把它与扩散区分开，并提出那个定义整个领域的问题：临界概率是否存在？他们举的例子包括：气体在随机排列的阻塞通道中扩散，疾病在果园中传播，以及流体在多孔固体中渗流。开、闭、团簇、渗流概率这一套词汇，都出自他们。

配套短文 J. M. Hammersley, *Percolation processes: II. The connective constant*, 同卷, 642–645，讨论一维链与 Bethe 格子。在度为 $z$ 的树上，阈值是 $1/(z-1)$，这是第一个精确的非平凡值，至今仍是平均场理论的几何化身。

## 1960–1980：正方格子

T. E. Harris, *A lower bound for the critical probability in a certain percolation process*, **Proc. Cambridge Philos. Soc.** 56 (1960), 13–20，证明了 $\mathbb{Z}^2$ 上 $\theta(1/2)=0$，即 $p_c\ge1/2$。论证把开横穿与闭横穿的平面对偶性，同 $p=1/2$ 处的颜色对称性结合起来；这两个想法此后都成了常备工具。

M. F. Sykes and J. W. Essam, *Exact critical percolation probabilities for site and bond problems in two dimensions*, **J. Math. Phys.** 5 (1964), 1117，引入匹配方法，得到三角格子与蜂窝格子键阈值的闭式。他们的路线经过星–三角变换；第 4 章正确复现了这一代数推导，并逐步核验。

L. Russo, *A note on percolation*, **Z. Wahrsch. Verw. Gebiete** 43 (1978), 39–48，以及 P. D. Seymour and D. J. A. Welsh, *Percolation probabilities on the square lattice*, **Ann. Discrete Math.** 3 (1978), 227–245，各自独立证明了盒子横穿不等式，使二维渗流变得可处理。RSW 引理几乎是每一个二维严格结果的发动机，包括两年后 Kesten 的定理。

H. Kesten, *The critical probability of bond percolation on the square lattice equals 1/2*, **Comm. Math. Phys.** 74 (1980), 41–59，补上了这道缺口。证明冗长而技术化。Bollobás 与 Riordan（2006）利用锐阈值技术给出了一条短得多的路线。

## 1970 年代–1980 年代：临界现象

把渗流转译成临界现象语言的工作，与 P.-G. de Gennes, *On a relation between percolation theory and the elasticity of gels*, **J. Physique Lettres** 37 (1976), L1–L2，以及 Stauffer 学派联系在一起。D. Stauffer and A. Aharony, *Introduction to Percolation Theory* (Taylor & Francis, 2nd ed. 1994)，固定了如今人人使用的记号 $\beta,\gamma,\nu,\delta,\eta$，并教会了一代人从 Monte Carlo 数据拟合指数——有时过于乐观，第 11 章试图纠正这一积习。

在严格理论方面，H. Kesten, *Percolation Theory for Mathematicians* (Birkhäuser, 1982)，把这门学问确立为概率论的一个分支。M. Aizenman and D. J. Barsky, *Sharpness of the phase transition in percolation models*, **Comm. Math. Phys.** 108 (1987), 489–526，证明了 $p_c$ 以下的指数衰减；M. V. Menshikov 独立证明了相应结果（1986–87）。Burton–Keane 唯一性定理（1989）补全了超临界相的定性图景。

## 1986–1992：高维与共形场论

M. Aizenman and R. Fernández, *On the critical behavior of the magnetization in high dimensional Ising models*, **J. Stat. Phys.** 44 (1986), 393，以及 T. Hara and G. Slade, *Mean-field critical behaviour for percolation in high dimensions*, **Comm. Math. Phys.** 128 (1990), 333–391，用 lace 展开证明充分高维下的平均场行为。该方法是非微扰的，至今仍是超越上临界维数后通往临界指数的唯一严格途径。目前最近邻键渗流的维数阈值为 $d\ge11$（Fitzner and van der Hofstad, 2017），这一结果建立在 Hara 与 Slade 的 $d\ge19$ 结果以及后来对展开的改进之上。

与此同时，J. L. Cardy, *Critical percolation in finite geometries*, **J. Phys. A** 25 (1992), L201，用共形场论预测了矩形的精确横穿概率。R. Langlands, P. Pouliot and Y. Saint-Aubin, *Conformal invariance in two-dimensional percolation*, **Bull. Amer. Math. Soc.** 30 (1994), 1–61，对这一预测做了数值检验，并把背后的猜想归功于 Aizenman。

## 2001：二维革命

S. Smirnov, *Critical percolation in the plane: conformal invariance, Cardy's formula, scaling limits*, **C. R. Acad. Sci. Paris Sér. I Math.** 333 (2001), 239–244，证明了三角格子上临界位点渗流的 Cardy 公式。这个证明短到一个下午就能读完，却又深到改变了整个学科：它把探索界面的连续极限认定为一个共形不变的对象。

G. F. Lawler, O. Schramm and W. Werner, *Values of Brownian intersection exponents I, II*, **Acta Math.** 187 (2001), 237–273 and 275–308，及其后续工作，把界面极限认定为 SLE$_6$，并导出了精确的指数集合。Cardy → Smirnov → SLE 这条链条，是继 Ising 模型之后二维临界模型最完整的解。

## 2000 年代：网络

R. Cohen, K. Erez, D. ben-Avraham and S. Havlin, *Resilience of the Internet to random breakdowns*, **Phys. Rev. Lett.** 85 (2000), 4626，以及 D. S. Callaway, M. E. J. Newman, S. H. Strogatz and D. J. Watts, *Network robustness and fragility: percolation on random graphs*, **Phys. Rev. Lett.** 85 (2000), 5468，把渗流带进了网络科学。Molloy–Reed 判据——在 M. Molloy and B. Reed, *A critical point for random graphs with a given degree sequence*, **Random Structures & Algorithms** 6 (1995), 161–180 中已具雏形——成了标准工具。

S. V. Buldyrev, R. Parshani, G. Paul, H. E. Stanley and S. Havlin, *Catastrophic cascade of failures in interdependent networks*, **Nature** 464 (2010), 1025–1028，表明把两个网络耦合起来，会把连续相变变成不连续相变。这一结果是“渗流相变的*类型*可以成为设计变量”的最清楚例子。

## 2010 年代–2020 年代

严格的高维纲领推进到了 $d\ge11$，并证明了三角条件在该维数范围内成立；三维问题仍只能依靠数值。单纯复形上的高阶渗流、时间网络与多层网络上的渗流，以及量子纠错码的渗流阈值，是当前活跃的前沿。第 13 章按“看起来可处理的先后”列出未解问题。

有两处年代惯例值得点明。Aizenman–Barsky 的锐性论文常被引作 1986 年，因为该年它以预印本形式流传；期刊卷册的年份是 1987。另外，目前的高维阈值是 $d\ge11$，而不是二手文献中仍能见到的旧值 $d\ge19$。第 14 章记录这两处更正。
