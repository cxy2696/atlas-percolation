---
id: 02-history
part: Foundations
order: 2
title: A short history
subtitle: From coffee grounds to conformal invariance
reading: 9 min
---

The history of percolation is unusually clean: a definite starting paper, a definite golden age, and a definite resolution in two dimensions. What follows is a timeline with the primary sources attached, so that each claim can be traced.

## 1957: the founding paper

S. R. Broadbent and J. M. Hammersley, *Percolation processes: I. Crystals and mazes*, **Math. Proc. Cambridge Philos. Soc.** 53(3), 629–641. The paper introduces the model, distinguishes it from diffusion, and poses the question that defines the field: does a critical probability exist? Their examples are a gas diffusing through a random array of blocked channels, a disease spreading through an orchard, and fluid seeping through a porous solid. The vocabulary — open, closed, cluster, percolation probability — is theirs.

The companion note, J. M. Hammersley, *Percolation processes: II. The connective constant*, same volume, 642–645, treats the one-dimensional chain and the Bethe lattice. On a tree of degree $z$ the threshold is $1/(z-1)$, the first exact nontrivial value, and it remains the geometric incarnation of mean-field theory.

## 1960–1980: the square lattice

T. E. Harris, *A lower bound for the critical probability in a certain percolation process*, **Proc. Cambridge Philos. Soc.** 56 (1960), 13–20, proves $\theta(1/2)=0$ on $\mathbb{Z}^2$, i.e. $p_c\ge1/2$. The argument combines the planar duality of open and closed crossings with the colour symmetry at $p=1/2$; both ideas become permanent tools.

M. F. Sykes and J. W. Essam, *Exact critical percolation probabilities for site and bond problems in two dimensions*, **J. Math. Phys.** 5 (1964), 1117, introduce the matching method and obtain closed forms for the triangular and honeycomb bond thresholds. Their route runs through the star–triangle transformation; the algebra is reproduced, correctly, in Chapter 4, where the derivation is checked step by step.

L. Russo, *A note on percolation*, **Z. Wahrsch. Verw. Gebiete** 43 (1978), 39–48, and P. D. Seymour and D. J. A. Welsh, *Percolation probabilities on the square lattice*, **Ann. Discrete Math.** 3 (1978), 227–245, independently prove the box-crossing inequalities that make two-dimensional percolation tractable. The RSW lemma is the engine behind almost every rigorous two-dimensional result, including Kesten's theorem two years later.

H. Kesten, *The critical probability of bond percolation on the square lattice equals 1/2*, **Comm. Math. Phys.** 74 (1980), 41–59, closes the gap. The proof is long and technical. Bollobás and Riordan (2006) give a substantially shorter route using sharp-threshold technology.

## 1970s–1980s: critical phenomena

The translation of percolation into the language of critical phenomena is associated with P.-G. de Gennes, *On a relation between percolation theory and the elasticity of gels*, **J. Physique Lettres** 37 (1976), L1–L2, and with the Stauffer school. D. Stauffer and A. Aharony, *Introduction to Percolation Theory* (Taylor & Francis, 2nd ed. 1994), fixed the notation $\beta,\gamma,\nu,\delta,\eta$ that everyone now uses, and taught a generation to fit exponents from Monte Carlo data — sometimes too optimistically, a habit that Chapter 11 tries to correct.

On the rigorous side, H. Kesten, *Percolation Theory for Mathematicians* (Birkhäuser, 1982), established the subject as a branch of probability. M. Aizenman and D. J. Barsky, *Sharpness of the phase transition in percolation models*, **Comm. Math. Phys.** 108 (1987), 489–526, proved exponential decay below $p_c$; M. V. Menshikov proved the corresponding results independently (1986–87). The Burton–Keane uniqueness theorem (1989) completed the qualitative picture of the supercritical phase.

## 1986–1992: high dimensions and conformal field theory

M. Aizenman and R. Fernández, *On the critical behavior of the magnetization in high dimensional Ising models*, **J. Stat. Phys.** 44 (1986), 393, proved mean-field behaviour for the high-dimensional Ising model with the random-current representation. T. Hara and G. Slade, *Mean-field critical behaviour for percolation in high dimensions*, **Comm. Math. Phys.** 128 (1990), 333–391, developed the lace expansion for percolation and proved the corresponding result in sufficiently high dimension. The lace expansion is non-perturbative and remains the only rigorous route to critical exponents above the upper critical dimension. The current threshold for nearest-neighbour bond percolation is $d\ge11$ (Fitzner and van der Hofstad, 2017), building on Hara and Slade's $d\ge19$ result and later refinements of the expansion.

In parallel, J. L. Cardy, *Critical percolation in finite geometries*, **J. Phys. A** 25 (1992), L201, used conformal field theory to predict the exact crossing probability of a rectangle. R. Langlands, P. Pouliot and Y. Saint-Aubin, *Conformal invariance in two-dimensional percolation*, **Bull. Amer. Math. Soc.** 30 (1994), 1–61, checked it numerically and attributed the underlying conjecture to Aizenman.

## 2001: the two-dimensional revolution

S. Smirnov, *Critical percolation in the plane: conformal invariance, Cardy's formula, scaling limits*, **C. R. Acad. Sci. Paris Sér. I Math.** 333 (2001), 239–244, proved Cardy's formula for critical site percolation on the triangular lattice. The proof is short enough to be read in an afternoon and deep enough to have changed the subject: it identifies the continuum limit of the exploration interface as a conformally invariant object.

G. F. Lawler, O. Schramm and W. Werner, *Values of Brownian intersection exponents I, II*, **Acta Math.** 187 (2001), 237–273 and 275–308, and their subsequent work, identified the interface limit as SLE$_6$ and derived the exact exponent set. The chain Cardy → Smirnov → SLE is the most complete solution of a critical model in two dimensions after the Ising model.

## 2000s: networks

R. Cohen, K. Erez, D. ben-Avraham and S. Havlin, *Resilience of the Internet to random breakdowns*, **Phys. Rev. Lett.** 85 (2000), 4626, and D. S. Callaway, M. E. J. Newman, S. H. Strogatz and D. J. Watts, *Network robustness and fragility: percolation on random graphs*, **Phys. Rev. Lett.** 85 (2000), 5468, brought percolation into network science. The Molloy–Reed criterion, already implicit in M. Molloy and B. Reed, *A critical point for random graphs with a given degree sequence*, **Random Structures & Algorithms** 6 (1995), 161–180, became the standard tool.

S. V. Buldyrev, R. Parshani, G. Paul, H. E. Stanley and S. Havlin, *Catastrophic cascade of failures in interdependent networks*, **Nature** 464 (2010), 1025–1028, showed that coupling two networks turns a continuous transition into a discontinuous one. The result is the clearest example of a percolation transition whose *type* is a design variable.

## 2010s–2020s

The rigorous high-dimensional programme advanced to $d\ge11$ and produced a proof that the triangle condition holds there; the three-dimensional problem remains numerical. Higher-order percolation on simplicial complexes, percolation on temporal and multilayer networks, and the percolation threshold of quantum error-correcting codes are the active frontier. Chapter 13 lists the open problems in the order in which they look tractable.

Two dating conventions are worth flagging. The Aizenman–Barsky sharpness paper is often cited as 1986 because it circulated in preprint form that year; the journal volume is 1987. And the current high-dimensional threshold is $d\ge11$, not the older $d\ge19$ that still appears in secondary sources. Chapter 14 records both corrections.
