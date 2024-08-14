---
layout: post
title: "Kernel Mean Embedding (Part II)"
author: "Qinzi Zhang"
date: 2024-07-10
source: "/slides/2024-07-10-kernel-mean-embedding-II.pdf"
use_toc: true
use_macro: true
---

This post is a continuation of [Kernel Mean Embedding]({{ "/2024/06/12/kernel-mean-embedding.html" | relative_url }}). Check out this post if you haven't. In this second part, we will see an application of kernel mean embedding in statistics. As a motivating question, consider two distributions $P,Q$ and i.i.d. samples $X\_1,\ldots,X\_n\sim P, Y\_1,\ldots,Y\_n\sim Q$. We'd like to distinguish, statistically, whether $P$ and $Q$ are identical distributions. At the end of the day, we will see a hypothesis tesing using the concept of kernel mean embedding.

<div style="display:none">
$
\newcommand{\sign}{\mathop{\mathrm{sgn}}}
\newcommand{\mmd}{\mathrm{MMD}}
\newcommand{\one}{\mathbb{1}}
$
</div>

## Recap: RKHS and Kernel Mean Embedding
{: ._sec}

### Kernel, Riesz Representation Theorem, and Reproducing Kernel Hilbert Space
{: ._sec}

Before we start the main topic, let's recap the main concepts from last time. Given any data space $\calX$, consider an Hilbert space $\calH$ of functions $f:\x\mapsto f(\x)$ mapping from $\calX$ to $\RR$. For each $\x\in\calX$, we can define $\calF_x: f\mapsto f(\x)$, which is a linear functional mapping from $\calH$ to $\RR$. If $\calH$ satisfies that every $\calF_\x$ is bounded (and this is true if $\calH$ is an RKHS), then by Riesz' representation theorem, each $\calF_\x$ corresponds to a unique $k_\x\in\calH$ such that $\calF_\x[f] = \langle k_\x, f \rangle\_\calH$ for all $f\in\calH$. Recall that $\calF_\x[f]=f(\x)$. In other words, there exists a map $\phi: \x\mapsto k_\x$ such that

$$
f(\x) = \langle k_\x, f \rangle_\calH, \ \forall f\in\calH.
$$

This is known as the <ins>reproducing property</ins>. Moreover, note that $\phi$ is a feature map from $\calX$ to $\calH$. Therefore, with slight abuse of notation, we can define a kernel $k(\x,\y) = \langle k_\x, k_\y \rangle\_\calH$. This is known as the <ins>reproducing kernel</ins> of the RKHS $\calH$. As a consequence of the reproducing property and reproducing kernel, each function $k_\x$ can be explicitly written as 

$$
\begin{align}
k_\x(\y)
&= \langle k_\y, k_\x \rangle_\calH \tag{reproducing property} \\
&= k(\x,\y). \tag{reproducing kernel}
\end{align}
$$

This construction is depicted in the following graph.

{% include figure.html url="/images/20240710/rkhs.png" width="60%" description="Illustration of how an RKHS $\calH$ is constructed from a data space $\calX$." %}

To conclude, we summarize the most important identities below:

$$
\begin{align}
f(\x) &= \langle k_\x, f\rangle_\calH, \\
k(\x,\y) &= \langle k_\x, k_\y \rangle_\calH, \\
k_\x(\y) &= k(\x,\y).
\end{align}
$$


### Kernel Mean Embedding
{: ._sec}

Kernel mean embedding generalizes the concept of RKHS to a probability space. For now on, assume $\calX$ is a probability space with probability measure $\P$. For each distribution $P$ on $\calX$, we can define a linear functional $\calF_P: \calH\to\RR$ similar to $\calF_\x$ such that $\calF_P[f] = \Ex_{X\sim P}[f(X)]$. If distribution $P$ satisfies $\Ex_{X\sim P}[\sqrt{k(X,X)}] < \infty$, then functional $\calF_P$ is bounded. Consequently, following the same argument for RKHS, there exists a mapping that maps $P$ to a unique $\mu_P\in\calH$ such that

$$
\begin{align}
\mu_P(\y) &= \Ex_{X\sim P}[k(X,\y)], \\
\langle \mu_P, f \rangle_\calH &= \Ex_{X\sim P}[f(X)], \\
\langle \mu_P, \mu_Q \rangle_\calH &= \Ex_{X,Y\sim P\otimes Q}[k(X,Y)].
\end{align}
$$

Such $\mu_P$ is the <ins>kernel mean embedding</ins> of distribution $P$. Notably, depending on the complexity of the kernel, kernel mean embedding captures higher order information of $P$. For example, when $k$ is the linear kernel, $k(x,y)=xy$, then $\mu_P[\y] = \Ex_{X\sim P}[X]\cdot y$ represents the first-order moment of $X$. When $k(x,y) = \exp(xy)$, then $\mu_P$ is the MGF of $P$.


---

## Maximum Mean Discrepancy
{: ._sec}

For now on, let $\calX$ be a probability space and $\calH$ be an RKHS on $\calX$ with reproducing kernel $k$. For convenience, we restrict to the subset of distributions that have kernel mean embedding. The <ins>maximum mean discrepancy (MMD)</ins> between two distribution is defined as the distance between their kernel mean embedding $\calH$, namely

$$
\mmd^2(P,Q) := \|\mu_P - \mu_Q\|_\calH^2.
$$

Upon expanding this quadratic term, we have

$$
\begin{align}
\mmd^2(P,Q) 
&= \langle \mu_P - \mu_Q, \mu_P - \mu_Q \rangle_\calH \\
&= \Ex_{X,X'\sim P\otimes P}[k(X,X')] + \Ex_{Y,Y'\sim Q\otimes Q}[k(Y,Y')] \\
&- \Ex_{X,Y'\sim P\otimes Q}[k(X,Y')] + \Ex_{X',Y\sim P\otimes Q}[k(X',Y)].
\end{align}
$$

The inner product in $\calH$ might not have an explicit form and could be difficult to compute. However, the kernels are explicitly defined and computable. In particular, denote 

$$
\begin{align}
&h(X,X',Y',Y') = k(X,X') + k(Y,Y') - k(X,Y') - k(X',Y).
\end{align}
$$

Moreover, consider i.i.d. samples $X_1,\ldots,X_n\sim P, Y_1,\ldots,Y_n\sim Q$. Then

$$
\widehat{\mmd^2(P,Q)} := \frac{1}{n(n-1)} \sum_{i\ne j} h(X_i, X_j, Y_i, Y_j)
$$

is an unbiased estimator of $\mmd^2(P,Q)$.


#### Integral Probability Metric

Alternatively, maximum mean discrepancy can also be viewed as a specific instance of a larger family of metrics. Given a collection of $\calF = \\{f: \calX\to \RR\\}$, the <ins>integral probability metric</ins> is defined as

$$
D_\calF(P,Q) := \sup_{f\in \calF} \Ex_{X\sim P}[f(X)] - \Ex_{Y\sim Q}[f(Y)].
$$

Intuitively, $D_\calF$ measures the maximum difference of $\calF$ under two distributions. 

Integral probability metric recovers maximum mean discrepancy when the function class is chosen to be the unit ball in the RKHS, namely $\calF = \\{f\in\calH : \\|f\\|_\calH \le 1\\}$. Under this class,

$$
\begin{align}
D_\calF(P,Q)
&= \sup_{f\in\calH, \|f\|_\calH\le 1} \Ex_{X\sim P}[f(X)] - \Ex_{Y\sim Q}[f(Y)] \\
&= \sup_{f\in\calH, \|f\|_\calH\le 1} \langle \mu_P, f\rangle_\calH - \langle \mu_Q, f\rangle_\calH \\
&= \|\mu_P - \mu_Q\|_\calH.
\end{align}
$$

Here the second line uses the reproducing property of kernel mean embedding. In particular, the function that maximimizes the right hand side is $f^* = \mu_P - \mu_Q$, or equivalently

$$
f^*(\z) = \Ex_{X\sim P}[k(X,\z)] - \Ex_{Y\sim Q}[k(Y,\z)].
$$


---

## Hypothesis Testing With MMD
{: ._sec}

It's been a lot of background introductions, and we are finally ready for the main topic---statistical testing. Formally, we consider the binary hypothesis test with null hypothesis $h_0: P=Q$ and alternative hypothesis $h_1:P\ne Q$. Given i.i.d. samples from $P$ and $Q$, the goal is to design a decision criterion whether to reject $h_0$ or not.
This problem would be much easier if we have some prior knowledge about the distributions. For example, if we knew $P,Q$ could only differ by first moment (e.g., $P=\calN(\mu_1,1)$ and $Q=\calN(\mu_2,1)$), then comparing their empirical mean would be sufficient to distinguish them. However, in general this problem is difficult without any prior knowledge. 

Fortunately, we can use the concept of maximum mean discrepancy for this general problem. As we saw earlier, the kernel mean embedding captures partial information of the distribution---the more complex the kernel is, the closer the kernel mean embedding aligns with the actual distribution. Consequently, MMD, which measures the distance between kernel mean embeddings, serves as a universal metric to distinguish two distributions.

### Distribution of MMD Empirical Estimator
{: ._sec}

#### Under alternative hypothesis $h_1: P\ne Q$

The key ingredient is the distribution of $\widehat{\mmd^2}$ under $h_0$ and $h_1$ respectively ([Theorem 8, Gretton et. al. 2006](https://papers.nips.cc/paper_files/paper/2006/file/e9fb2eda3d9c55a0d89c98d6c54b5b3e-Paper.pdf)). In particular, when $P\ne Q$, then the empirical estimator converges in distribuion to a Gaussian uniformly at rate $1/\sqrt{n}$, namely

$$
\begin{align}
& \sqrt{n} \cdot \frac{\widehat{\mmd^2(P,Q)} - \mmd^2(P,Q)}{\sigma(P,Q)} \to \calN(0,1), \\
& \text{where}~~ \sigma^2(P,Q) = 4\left(\Ex_{X,Y}[ \Ex_{X',Y'}[h(X,X',Y,Y')]^2 ] - \Ex[h(X,X',Y,Y')]^2\right).
\end{align}
$$

To give a concrete example, consider $P=\calN(0,1)$ and $Q=\calN(1,1)$ and consider the linear kernel $k(x,y)=xy$. Then 

$$
\begin{align}
\mmd^2(P,Q) 
&= \Ex[h(X,X',Y,Y')] \\
&= \Ex[k(X,X') + k(Y,Y') - k(X,Y') - k(X',Y)] \\
&= \Ex[XX' + YY' - XY' - X'Y] \\
&= 1.
\end{align}
$$

Moreover, we can compute the variance term as follows:

$$
\begin{align}
& \Ex_{X,Y}[ \Ex_{X',Y'}[h(X,X',Y,Y')]^2 ] \\
&= \Ex_{X,Y}[ \Ex_{X',Y'}[XX'+YY'-XY'-X'Y]^2 ] \\
&= \Ex_{X,Y}[(Y-X)^2] \\
&= \Ex[X^2 - 2XY + Y^2] \\
&= 3.
\end{align}
$$

The last line follows from $\E[Y^2]=2$. This suggests that $\sigma(P,Q) = \sqrt{8}$. Consequently,

$$
\sqrt{n} \cdot \frac{\widehat{\mmd^2(P,Q)} - 1}{\sqrt{8}} \to \calN(0,1).
$$

To illustrate, we simulated 1000 samples from $P$ and $Q$ and computed the normalized $\widehat{\mmd}$. The histogram of $10^4$ estimators is plotted below, and the source code of the simulation can be found [here](https://colab.research.google.com/drive/1aSUUWjwYNOp68vZMySFKWAV2h70dgEDd?usp=sharing). We can see that the histogram indeed converges to standard Gaussian.

{% include figure.html url="/images/20240710/mmd1.png" description="Simulation result: histogram of normalized $\widehat{\mmd^2(P,Q)}$ with $n=10^3$ samples and $10^4$ repetitions. Blue: histogram of empirical estimators; red: standard Gaussian probability density." width="60%" %}


#### Under null hypothesis $h_0: P = Q$

Under null hypothesis, the empirical estimator is mean-zero since $\mmd^2(P,Q)=0$. However, its distribution is more complicated, and often times impossible to compute. Formally, it converges in distribution according to

$$
n\cdot \widehat{\mmd^2(P,Q)} \to \sum_{i=1}^\infty 2\lambda_i (Z_i^2-1),
$$

where $Z_i$ are i.i.d. standard Gaussian, and $\lambda_i$ are eigenvalues such that

$$
\Ex_{X\sim P}[\tilde k(X,\y) f_i(X)] = \lambda_i f_i(\y).
$$

where $\tilde k(\x,\y) = \langle k_\x-\mu_P, k_\y-\mu_P\rangle\_\calH$ is the *centered RKHS kernel*.

{% include figure.html url="/images/20240710/mmd2.png" description="Simulation result: histogram of $n\cdot \widehat{\mmd^2(P,Q)}$ with $n=100$ samples and $1000$ repetitions." width="60%" %}

To give an intuition of what it looks like, we simulated the empirical estimator when $P=Q=\calN(0,1)$ and plot the histogram below. Notably, although the distribution is mean-zero, it is largely left-skewed, meaning that most probability corresponds to small values of the estimator. Consequently, this suggests a reasonable decision criterion is to reject the null hypothesis if the estimator is too large. More formally, we'd like to reject $h_0$ if $T_0 > c_\alpha$, where $T_0$ is the observed statistics of the estimator and $c_\alpha$ is the $\alpha$-th quantile of the distribution. 

Although straightforward, this decision rule is infeasible in practice---the distribution of $\widehat{\mmd^2(P,Q)}$ usually does not have a closed formula. This motivates a need for feasible alternatives with the same spirit. In the next section, we will focus on one of them---the permutation test.


### Permutation Test
{: ._sec}

Let's forget about MMD for a minute and just consider a simple problem. Consider some distribution $P$ on $\RR$ and some constant $X_0$. The question is: without knowing the distribution $P$, how to estimate which quantile $X_0$ is in? In statistics, this question is answered by the $p$-value of $X_0$. In particular, suppose we can sample $X\sim P$, then the <ins>$p$-value</ins> of $X_0$ is defined as

$$
p(X_0) := \Px_{X\sim P}\{ X > X_0 \},
$$

or, in words, the probability that a random sample from $P$ is greater than $X_0$. 

By definition, $p$, as a function, is monotonically decreasing---if $X_1 > X_0$, then $p(X_1)\le p(X_0)$, and vice versa. In particular, consider $c_\alpha$ such that $p(c_\alpha)=\alpha$, i.e., $c_\alpha$ is the $\alpha$-th quantile of $P$. Then $p(X_0) < \alpha$ if and only if $X_0 > c_\alpha$. Consequently, 
if the original decision rule is to reject $h_0$ when $X_0 > c_\alpha$, then an alternative will be to reject $h_0$ when $p(X_0) < \alpha$.

Although computing the exact $p$-value requires the knowledge of the distribution $P$, we can still estimate it without knowing $P$. In particular, note that

$$
\begin{align}
p(X_0) 
% &= \Px_{X\sim P}\{ X > X_0 \} \\
&= \Ex_{X\sim P}[\one\{ X > X_0 \}].
\end{align}
$$

Therefore, we can empirically estimate the $p$-value by sampling $X_1,\ldots,X_n$ i.i.d. from $P$, and compute

$$
\hat p(X_0) = \frac{1}{n}\sum_{i=1}^n \one\{X_i > X_0\}.
$$

Now let's come back to MMD testing, where we have observed samples $X_1,\ldots,X_n$ i.i.d. from $P$ and $Y_1,\ldots,Y_n$ from $Q$, and we have computed a test statistics

$$
T_0 = \frac{1}{n(n-1)} \sum_{i\ne j} h(X_i,X_j,Y_i,Y_j)
$$

as an empirical estimator of $\mmd^2(P,Q)$. A key observation is that, under null hypothesis $h_0:P=Q$, we can easily sample test statistics $T_1,\ldots,T_n$ i.i.d. from the same distribution as $T_0$. The procedure is as follows: randomly permute the sample set $\\{X_i,Y_j\\}_{i,j=1}^n$ and split into $\hat X_1,\ldots,\hat X_n,\hat Y_1,\ldots,\hat Y_n$, then

$$
T_k = \frac{1}{n(n-1)} \sum_{i\ne j} h(\hat X_i,\hat X_j,\hat Y_i,\hat Y_j).
$$

Since we assume $P=Q$, the permuted samples still satisfy $\hat X_i\sim P$ and $\hat Y_j\sim Q$, which implies that $T_k$ and $T_0$ has the same distribution under $h_0$.

In conclusion, upon combining the permutation trick and the $p$-value test, we end up with a feasible hypothesis test with MMD---reject $h_0$ if $\hat p(T_0) < \alpha$.


#### Simulation Results

To conclude this section, we also simulated the permutation test on different distributions, and the source code can be found [here](https://colab.research.google.com/drive/1aSUUWjwYNOp68vZMySFKWAV2h70dgEDd?usp=sharing). In particular, if $P,Q$ only differ by first moment, then a simple linear kernel manage to distinguish them. If the second moments are also different, then linear kernel fails because the kernel mean embedding of a linear kernel is simply the first moment. On the other hand, Gaussian kernel can successfully distinguish them. This is also the case even when $P,Q$ have the same mean and variance (e.g., $P=\calN(0,1)$ and $Q=\mathrm{Lap}(0,1/\sqrt{2})$).

```python
x = np.random.normal(0, 1, n)
y = np.random.normal(1, 1, n)
kernel = lambda x, y: x * y
# Reject h0 since (p=0.000) < (alpha=0.050)
```

```python
x = np.random.normal(0, 1, n)
y = np.random.normal(0, 0.5, n)
kernel = lambda x, y: np.exp(-(x-y)**2)
# Reject h0 since (p=0.000) < (alpha=0.050)
```

```python
x = np.random.normal(0, 1, n)
y = np.random.laplace(0, 1/np.sqrt(2), n)
kernel = lambda x, y: np.exp(-(x-y)**2)
# Reject h0 since (p=0.031) < (alpha=0.050)
```