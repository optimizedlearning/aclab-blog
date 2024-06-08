---
layout: post
title:  "Local Rademacher Complexity"
date:   2024-06-06 20:24:26 -0400
---

Rademacher complexity is crucial in statistical learning theory for understanding generalization, model selection, and learnability. This post focuses on the generalization error and will discuss the paper: "Local Rademacher Complexity."

Before diving into the paper, let's use a motivating example to explain **generalization error** and provide some intuition on **Rademacher complexity**. (Feel free to skip directly to the discussion of the paper if you prefer.)

---
#### Table of Contents
- [Motivation](#motivation)
    - [Generalization Error](#generalization-error)
    - [Rademacher Complexity](#rademacher-complexity)
- [The Paper](#the-paper)

---

## Motivation

### Generalization Error

Supervised learning involves learning a task from a dataset consisting of data-label pairs $\mathcal{S} = \{ (x_i, y_i) \}_{i=1}^{m}$ using a chosen model. We can denote any model as $f: \mathcal{X} \to \mathcal{Y}$, since even a complex neural network takes data $x \in \mathcal{X}$ and outputs a label $y \in \mathcal{Y}$. The explicit formulation of the model might be complicated or might not even exist, but it can always be represented in this abstract format. This form of abstraction is particularly useful in studying theoretical topics in terms of a class of functions with particular properties such as Lipschitz, non-negative, convex, etc.

After selecting a loss function $\ell: \mathcal{Y} \times \mathcal{Y} \to \mathbb{R}$, we can train the model and report the loss on the training set $\mathcal{S}$:
$$\mathcal{L}_\mathcal{S} (\ell_f) = \frac{1}{|\mathcal{S}|} \sum_{i=1}^{|\mathcal{S}|} \ell(f(x_i), y_i)$$

Can we confidently claim that the trained model $f$ performs well? It likely to claim so by the comparison to other state-of-the-art models. Another objective approach is to consider the general learning framework and then we will realize the problem:
![Diagram showing Learning Problem](../../../assets/images/20240604/full.png)
<!-- ![20240605_local](https://hackmd.io/_uploads/ryqx2t1BR.png) -->

- We were only given a sample dataset $\mathcal{S} \subset \mathcal{D}$, which could be a small fraction of the population data $\mathcal{D}$. Let's assume $\mathcal{S} = \{(x_i,y_i) \}_{i=1}^{m}$ is uniformly sampled from $\mathcal{D}$.
- We trained a specifically chosen model $f \in \mathcal{F}$, which might not be the optimal choice.
- The definition of 'performing well' should be evaluated on the population $\mathcal{D}$, that is:
$$\mathcal{L} (\ell_f) = \mathbb{E}_{(x,y) \in \mathcal{D}} [ \ell(f(x), y) ]$$

We can only estimate how $f$ performs on $\mathcal{S}$. If $\mathcal{L}_{\mathcal{S}} (\ell\_f)$ is small, we hope $\mathcal{L} (\ell\_f)$ is also small. That is, we desire $\mathcal{L}\_{\mathcal{S}} (\ell_f) \approx \mathcal{L} (\ell_f)$. If this is the case, we say that $f$ generalizes well, and the discrepancy $\|\mathcal{L} (\ell_f) - \mathcal{L}\_{\mathcal{S}} (\ell_f)\|$ is referred to as the **generalization error**. Furthermore, we want to understand the worst-case scenario for any $f \in \mathcal{F}$, hence we consider $\sup\_{f \in \mathcal{F}}\|\mathcal{L} (\ell_f) - \mathcal{L}\_{\mathcal{S}} (\ell_f)\|$. Alternative explaination is that we desire a uniform generalization error for all $f \in \mathcal{F}$ through the supremum.

### Rademacher Complexity

Rademacher complexity is an important concept in studying generalization error. From classical results (refer to the original paper and more explanatory resources from Leture notes), the generalization error for bounded $\ell_f$ with probability at least $1-\delta$ is given by:
$$\sup_{f \in \mathcal{F}}|\mathcal{L} (\ell_f) - \mathcal{L}_{\mathcal{S}} (\ell_f)| \lessapprox R_{\mathcal{S}} (\ell, \mathcal{F}) + \sqrt{\frac{\ln \frac{1}{\delta}}{|\mathcal{S}|}}$$
where $R_{\mathcal{S}} (\ell, \mathcal{F})$ is the sample Rademacher complexity:
$$R_{\mathcal{S}} (\ell, \mathcal{F}) = \mathbb{E}\left[ \sup_{f \in \mathcal{F}} \frac{1}{|\mathcal{S}|} \sum_{i=1}^{|\mathcal{S}|} \sigma_i \ell(f(x_i), y_i ) \right]$$
and $\sigma_i$ are independent Rademacher random variables: $\sigma_i = \pm 1$ with equal probabilities.

The interpretation of $R_{\mathcal{S}} (\ell, \mathcal{F})$ is to quantify the complexity of $\ell_f$ for all $f \in \mathcal{F}$. The quantity $\frac{1}{\|\mathcal{S}\|} \sum_{i=1}^{\|\mathcal{S}\|} \sigma_i \ell(f(x_i), y_i )$ is a sample correlation between random noise $\sigma$ and $\ell_f$, interpreted as the ability to fit random labels.

---

## The Paper

The paper aims to tighten the generalization bound through the notion of 'Local Rademacher Complexity' by effectively bounding the generalization error through the Rademacher complexity of a subset $\mathcal{F}_r \subset \mathcal{F}$. Additionally, the sample size-dependent term in the previous bound was $O(1 / \sqrt{\|\mathcal{S}\|})$, which the paper also seeks to improve.

In particular, the following intermediate result suggests that the generalization error depends on the variation $r$ of $\mathcal{F}$:
![var_dependent](../../../assets/images/20240604/var_dependent.png)
<!-- ![var_dependent](https://hackmd.io/_uploads/HkvOfVGBR.png) -->
This highlights that if $\mathcal{F}$ naturally has a small $r$, then the sample size-dependent term is already improved.

The actual proof is more complicated which considers a reweighted function class $\mathcal{G} = \{g = \frac{f}{w(f)}: f \in \mathcal{F}\}$, where the weight $w(f) \propto \mathbb{E} [\ell_f^2]$. Hence, the variance of the weighted function class $\mathcal{G}$ is small. Then, by partitioning $\mathcal{G}$ by weights and bounding their generalization error respectively and then uniformly, and finally converting the result from $\mathcal{G}$ back to $\mathcal{F}$, the main result is presented as follows:
![res](../../../assets/images/20240604/res.png)
<!-- ![res](https://hackmd.io/_uploads/Sy-n24fr0.png) -->

In addition to the improved sample size term, the complexity term is also improved since $r^{\ast} \le \psi(r) = R_{\mathcal{S}} (\ell, \mathcal{F}\_r) \le R_{\mathcal{S}} (\ell, \mathcal{F})$ for most $r > 0$ (the advantage is particularly important when $r$ is large). However, this also comes with a loss as the coefficient $\frac{K-1}{K} < 1$.

$\mathcal{F}_r$ requires the entire dataset $\mathcal{D}$; through the standard procedure of replacing it with the empirical version, we obtain a data-dependent bound:
![res_data](../../../assets/images/20240604/res_data.png)
<!-- ![res_data](https://hackmd.io/_uploads/HkjnnVMSC.png) -->

