---
id: 11-measurement
part: Networks and applications
order: 11
title: Measuring a threshold without fooling yourself
subtitle: Finite-size scaling, Newman–Ziff, and the arithmetic of honest error bars
reading: 15 min
---

A threshold is not a number that can be read off a single curve. Every finite sample has a rounded transition, and the rounding is not noise around a fixed answer: it is the answer changing with the system size. This chapter sets out a measurement protocol that separates the two, and it explains what the benchmark in this repository can and cannot support.

The protocol is deliberately conservative. It is written for someone who has to defend a number in a paper, a specification or a safety case, not for someone who wants the quickest possible estimate.

## 11.1 What is being estimated

The infinite-volume threshold is

$$
p_c=\inf\{p:\theta(p)>0\}.
$$

A simulation has finite $L$, so it never observes $\theta$. Instead it observes a pseudo-critical point $p_c(L)$, defined by a convention. Common conventions are:

- the $p$ at which the crossing probability $\pi(p,L)$ equals $1/2$;
- the $p$ at which the susceptibility proxy $\chi(p,L)$ is maximal;
- the crossing point of the Binder cumulant $U_4=1-\langle S^4\rangle/(3\langle S^2\rangle^2)$ for two sizes;
- the $p$ at which the largest-cluster fraction $S_{\max}(p,L)$ equals a fixed fraction of the box.

Each convention has a different finite-size correction. On the square lattice with bond percolation, the first has a useful limit: duality forces $\pi(1/2,L)\to1/2$ as $L\to\infty$, but the finite-$L$ values are not exactly $1/2$. The recorded rates at $L=32,64,128$ are $0.528$, $0.538$ and $0.505$. Use the trend, or a tolerance that accounts for the correction, and do not treat the limit as a per-size identity.

The differences between conventions are not cosmetic. If $p_c(L)=p_c+aL^{-1/\nu}(1+bL^{-\omega}+\cdots)$, then the coefficient $a$ depends on the observable, while $p_c$ and $\nu$ do not. Two conventions that disagree by $10^{-2}$ at $L=64$ can agree to $10^{-4}$ after extrapolation, or can reveal a bug. Reporting the convention is part of reporting the number.

## 11.2 Finite-size scaling, used as a test rather than a decoration

Near $p_c$, the scaling ansatz for an observable $A$ is

$$
A(p,L)=L^{y_A}\,\mathcal A\!\left((p-p_c)L^{1/\nu}\right)\left(1+cL^{-\omega}+\cdots\right),
$$

where $y_A$ is the scaling dimension of $A$ and $\omega$ is the leading correction exponent. For the crossing probability $y_A=0$, so the curves for different $L$ should cross at $p_c$ and collapse when plotted against $(p-p_c)L^{1/\nu}$. For $S_{\max}$, $y_A=d_f$; for $\chi$, $y_A=\gamma/\nu$.

A collapse is evidence, not proof. It can be produced by adjusting three parameters to fit noise, especially when the range of $L$ is small. Three safeguards make it informative:

1. **Hold out a size.** Fit on $L\le L_{\max}/2$ and predict $L_{\max}$. A collapse that only works when the largest size is included is a fit, not a test.
2. **Show the residuals.** A plot of residuals against the scaling variable exposes a trend that an overplotted collapse hides.
3. **Report the window.** The value of $\nu$ that minimises the collapse depends on the range of $p$ used. Publish the range; do not publish only the minimum.

The correction term matters. At $L=32$ to $128$ on the square lattice, ignoring $L^{-\omega}$ can shift an extrapolated $\nu$ by several percent. The benchmark in this repository uses sizes up to $128$ and reports the fit window with the result, but it is a teaching dataset, not a high-precision measurement.

## 11.3 The Newman–Ziff sweep

For bond percolation there is an algorithm that removes the outer loop over $p$. Draw one random ordering of the $m$ edges. Add the edges one at a time. After $k$ edges, the configuration is a sample from bond percolation at $p=k/m$, but the samples at different $k$ are strongly correlated by construction.

Maintain a union-find structure and the sum of squared cluster sizes. When an edge joins clusters of sizes $a$ and $b$, the sum increases by $2ab$. The largest cluster and the number of clusters are updated in $O(1)$. The full sweep costs $O(m\,\alpha(n))$, where $\alpha$ is the inverse Ackermann function, and it produces the whole curve $\{S_{\max}(k/m),\chi(k/m)\}_{k=0}^{m}$.

Two cautions. First, the curve from one edge order is one sample path, not an ensemble average; the visible smoothness comes from the monotone construction, not from averaging. Second, the samples at nearby $p$ are almost identical, so the effective number of independent configurations is much smaller than the number of plotted points. Error bars computed as if each point were independent are far too small.

The algorithm extends to site percolation by adding sites and their incident edges in a random order, but the bookkeeping is more delicate: an edge is active only when both endpoints have appeared. The JavaScript engine in this repository implements the bond version only.

## 11.4 Uncertainty that survives review

Three sources of error are usually conflated.

**Statistical error.** For an indicator such as a crossing event, the standard error at $n$ independent samples is $\sqrt{\hat\pi(1-\hat\pi)/n}$. At $\hat\pi=1/2$ and $n=1600$, that is $0.0125$ — larger than the differences between many published thresholds. For a cluster observable, the variance is dominated by the largest clusters; use a bootstrap over configurations, not a Gaussian formula.

**Finite-size error.** This is a bias, not a variance. It is estimated by repeating the measurement at several $L$ and extrapolating. The extrapolation is only as good as the assumed correction form. Report at least two fit forms and show that the conclusion is stable, or report the spread as part of the error.

**Systematic error.** The lattice geometry, boundary conditions, the definition of a spanning cluster, the random-number generator, and the way ties are broken can all shift the answer. The cross-language parity tests in this repository exist because the last two are easy to get wrong and hard to see.

A defensible statement has the form "we obtain $p_c=0.5927(3)$ from sizes $L=64$–$512$, with the crossing convention $\pi=1/2$, a fit window $p\in[0.58,0.60]$, and a correction exponent $\omega=1.5$ fixed." A number without those qualifiers is a rumour.

## 11.5 A protocol

1. **Fix the model.** Lattice, site or bond, boundary conditions, and the definition of spanning. Write them down before looking at data.
2. **Calibrate on a solved case.** Square-lattice bond percolation at $p=1/2$ must give a crossing rate consistent with $1/2$ and each language implementation must agree exactly for the same seed.
3. **Choose two observables.** One indicator (crossing) and one cluster statistic ($S_{\max}$ or $\chi$). If they disagree on $p_c(L)$, you have a finite-size problem or a bug.
4. **Use enough samples.** Start with $10^4$ crossing samples per size. At $\hat\pi=1/2$ this gives a standard error of about $0.5\%$; state the target as a standard error and increase the sample until it is below the effect you want to claim.
5. **Sweep $L$ geometrically.** At least four sizes spanning a factor of eight. A power law fitted to three points is a line through three points.
6. **Fit with corrections.** Use the ansatz of Section 11.2, hold out the largest size, and report the fit window.
7. **Check the residuals and the conventions.** A change of convention should move the estimate by less than the quoted error after extrapolation.
8. **Publish the raw counts.** The benchmark file in this repository stores `n` and `hits` for every point, so a reader can recompute the rate rather than trust a plotted curve.

## 11.6 What the benchmark in this repository shows

`scripts/bench.cpp` is a self-contained C++20 harness. It uses the shared xoshiro128** stream, the same lattice edge order as the libraries, and writes raw counts rather than fitted values. `scripts/analyse_bench.py` adds the Cardy curve, a collapse fit and a one-arm slope, and records the seed and the generation date in `data/benchmarks.json`.

The benchmark is designed to show the *shape* of a finite-size study, not to compete with dedicated high-precision work. The crossing experiment uses free boundaries and $L\in\{32,64,128\}$; the torus experiment uses $L\le128$; the one-arm experiment uses $L\le512$ and fits only $L\ge64$; the Cardy experiment uses a $96\times H$ rectangle with $H/W$ from $0.25$ to $4$. The headline collapse fixes $\nu=4/3$ and fits $p_c$ alone; the unconstrained two-parameter fit is reported as a diagnostic because it is ill-conditioned at these sizes. Every row carries its own sample count. The data view on the website reads the same file; if the file is missing, the page says so rather than inventing a curve.

The important test is not whether the fitted $p_c$ lands on $0.5$ to four decimals. It is whether the crossing rate at $p=1/2$ follows the finite-size trend towards $1/2$, whether the curves sharpen with $L$, and whether the same seed produces the same integer counts in C++, Julia, Python and JavaScript. Those are the checks that catch the errors which matter.

## 11.7 Traps, in the order they usually appear

| Trap | Symptom | Fix |
|---|---|---|
| Using one lattice size | A threshold quoted to four decimals from $L=64$ | Sweep $L$; extrapolate |
| Treating correlated sweep points as independent | Error bars shrinking as $1/\sqrt{m}$ | Block/bootstrap by edge order |
| Fitting a straight line on log–log axes | An exponent that drifts with the window | Include corrections; show residuals |
| Confusing $\pi=1/2$ with $p_c$ on an arbitrary lattice | A biased threshold that looks precise | Use the correct crossing convention |
| Using the wrong spanning definition | A crossing rate that is not comparable to the literature | State the boundary arcs and the cluster criterion |
| Comparing codes by mean only | A bug that cancels in the average | Compare integer counts for a fixed seed |
| Quoting a numerical exponent as exact | A "theorem" that changes in the next paper | Label exact, numerical, or conjectural |

The last row is an editorial rule as much as a numerical one. The atlas marks exact results with ★ and labels numerical values with their source and precision; Chapter 14 records the corrections that this policy has forced.
