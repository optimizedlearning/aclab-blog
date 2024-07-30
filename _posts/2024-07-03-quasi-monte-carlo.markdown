---
layout: post
title:  "Quasi Monte Carlo"
author: "Jiujia Zhang"
date:   2024-07-03 20:24:26 -0400
use_toc: true
---

This post is about numerical integration in $[0,1]^s$, where the quality of the approximation varies based on how the evaluation points are selected. 

<div style="display:none">
$
\newcommand{\x}{\mathbf{x}}
\newcommand{\bu}{\mathbf{u}}
$
</div>

## Overview
{: ._sec }

This topic addresses numerical integration in multiple dimensions $\mathbb{R}^s$ in the format of 

$$I_s(f):= \int_{[0,1]^s} f(\x) \, d \x $$

Quasi-Monte Carlo is one of the methods to approximate such integrals. This format of integration plays an essential role in evaluating solutions to certain Partial Differential Equations and in computing expectations of random variables. The latter application is more intriguing than it might seem, as it is non-obviously related to learning problems involving Gaussian Kernels. See papers in approximating Gaussian Kernels:

- [Rahimi, A., & Recht, B. (2007)](https://people.eecs.berkeley.edu/~brecht/papers/07.rah.rec.nips.pdf): this is equivlent of Monte-Carlo method
- [Yang, Jiyan, et al. (2014)](https://jmlr.org/papers/volume17/14-538/14-538.pdf): through Quasi-Monte Carlo
- [Munkhoeva, Marina, et al. (2018).](https://proceedings.neurips.cc/paper/2018/file/6e923226e43cd6fac7cfe1e13ad000ac-Paper.pdf): Quadrature-based method

Numerical integration typically involves selecting $n$ evaluation points $\{ \x_{1}, \cdots, \x_{n} \} \subset [0,1]^s$ and then computing a value $Q_{s, n}(f) \approx I_s(f)$ using those $n$ evaluation points.

In this post, we will introduce three rules for selecting evaluation points for $n$ evaluations and their approximation error, which is roughly in the format of $| Q_{s, n}(f) - I_s(f)|$
- Classical Numerical Integration $O\left(\frac{1}{n^{1/s}}\right)$
- Monte Carlo $ O\left(\frac{1}{\sqrt{n}}\right) $
- Quasi-Monte Carlo $O\left(\frac{(\log n)^s}{n} \right)$

## Classical Numerical Integration
{: ._sec }

### 1 Dimensional Problem
{: ._sec }

Let's begin with the fundamental problem of integration in a 1-dimensional space $(s = 1)$:

$$I_s(f):= \int_{0}^1 f(x) \, d x $$

The most naive approach is analogous to the Riemann integral upper approximation: selecting $n$ equally spaced points in the interval $[0,1]$ with width $w_i = \frac{1}{n}$ and approximating the area under the curve with the sum of rectangles defined by those evaluation points, as depicted below:

{% include figure.html url="/images/20240703/numerical_1d.png" description="1d numerical integration with equally spaced evaluation points" width="60%" %}

In this way, the approximation to $I_s(f)$ is

$$Q_{s,n} =  \sum_{i=0 }^{n-1} w_i f(x_i) \frac{1}{n} \sum_{i=0 }^{n-1} f(x_i)$$

The approximation error arises from possibly overestimating or underestimating the area under the curve between two adjacent evaluation points by a rectangle. By uniformly bounding the error from local triangles, we get:

$$| Q_{s, n}(f) - I_s(f)| \le \frac{\max_{x \in[0,1]} |f'(x)|}{2n } = O\left(\frac{1}{n}\right)$$

There are different methods for selecting those evaluation points with higher-order information about $f$ can achieve $O(\frac{1}{n^2}), O(\frac{1}{n^4})$, etc. However, since our ultimate goal is to consider $s > 1$, and those methods do not easily generalizes to higher dimensions and requires higher order information of $f$, we will not consider them in this post.

Overall, numerical integration in 1-dimension is very well studied. Given the regularity of $f$, we can select the best way to choose evaluation points for an accurate integral approximation where the error only depends on $s$. Let's move on to the higher-dimensional case!

### Multi-dimensional Problem
{: ._sec }

Now we consider the case of $s > 1$. Analogous to the 1-dimensional case, with $n$ evaluation points, we are essentially estimating $I_s(f)$ by computing the volume of hyper-rectangles:  

$$ \begin{align}I_s(f)& := \int_{0}^{1} \cdots \int_{0}^{1}  f(x_1, \cdots, x_s) \, d x_1 \cdots d x_s  \\
        & \approx \sum_{i_1=0}^{n-1} \cdots \sum_{i_s=0}^{n-1} w_{i_1} \cdots w_{i_s}  f(x_{i_1}, \cdots, x_{i_s}) \\
        & = \underbrace{\sum_{i_1=0}^{n-1}  w_{i_1}  \cdots \underbrace{ \sum_{i_{s-1}=0}^{n-1} w_{i_{s-1}} \underbrace{\sum_{i_s=0}^{n-1} w_{i_s}  f(x_{i_1}, \cdots, x_{i_s})}_{n \text{ evaluation}} }_{n^2 \text{ evaluation}}}_{n^s \text{ evaluation}} := Q_{s, n} (f) \end{align}$$

Since this approximation totally consists of $n^s$ function evaluations, we have 

$$| Q_{s, n}(f) - I_s(f)| \le O(\frac{1}{n^{1/s}})$$

As dimension increase, the approximation error $\rightarrow O(1)$. This means the classical method drastically deteriorates as dimensionality increases. 

## Monte Carlo
{: ._sec }

Monte Carlo method generally refers to sampling from a specific distribution and summarize the statistics for some approximation tasks [Wikepedia: Monte Carlo Method](https://en.wikipedia.org/wiki/Monte_Carlo_method).
In the context of numerical integration, we sample $n$ evaluation points i.i.d. from $[0,1]^s$ and approximate the integral:

$$ Q_{s,n} (f) := \frac{1}{n} \sum_{i=0}^{n-1} f(\x_i) $$

Note $Q_{s,n}(f)$ is random through this method, hence the approximation error is anticipated in the probabilistic sense $E[ \| I_s(f) - Q_{s,n}(f)\|]$. By Jensen's inequality, it suffices to bound

$$E[ | I_s(f) - Q_{s,n}(f)|] \le \sqrt{E[ | I_s(f) - Q_{s,n}(f)|^2]}$$

In addition, since evaluation points are uniformly sampled, $E [ Q_{s,n} (f) ] = I_s(f)$ is an unbiased estimator of $I_s(f)$, hence the right hand side is effectively the standard deviation of $Q_{s,n}(f)$. By standard variance formula for average of $n$ i.i.d. samples

$$E[ | I_s(f) - Q_{s,n}(f)|] \le \sqrt{E[ | I_s(f) - Q_{s,n}(f)|^2]} = \sqrt{ \frac{I_s(f^2) - I_s(f)^2 }{n}}$$

Notice above bound is function $f$ dependent, and $n$ dependent as the classical methods. The dependence on $n$ is better in expectation in comparison to the classical methods when $s>2$.


## Quasi-Monte Carlo
{: ._sec }
The bound provided by Monte Carlo methods is stochastic and can potentially exhibit high variance. To obtain a deterministic approximation error guarantee similar to classical methods, we should choose sequences of evaluation points deterministically. Quasi-Monte Carlo methods choose a particular sequence of evaluation points that are distributed **evenly** on $[0,1]^s$. This *evenness* is not in the sense of equally spaced points, but rather in terms of **low discrepancy**, as captured by the **Koksma–Hlawka inequality**.


{% capture Koksma-Hlawka-inequality %}
For any $S = \{ \x_0, \x_1, \cdots \x_{n-1} \} \subset [0,1]^s$

$$
| I_s (f) - Q_{s,n}(f)|  \le D^{\ast}(S) V(f) 
$$

where $V(f)$ quantifies the variation of $f$ as

$$
 V(f) = \sum_{I \subset [s], I \neq \emptyset  } \int_{[0,1]^{|I|}} \left| \frac{\partial^{|I|} f}{ \partial \bu_{I}}\right|_{u_j = 1, j \neq I} d \bu_{I}
$$

$D^{\ast}(S)$ the discrepancy (uniformity) of $S$ 

$$
D^{\ast}(S) = \sup_{\x \in [0,1]^{s}} \left| \prod_{j=1}^{s} x_j - \frac{1}{n} \sum_{i=0}^{n-1} \mathbf{1}_{[0, \x]} (\x_i) \right| 
$$

{% endcapture %}
{% include theorem.html title="Koksma–Hlawka inequality" content=Koksma-Hlawka-inequality %}

The Koksma–Hlawka inequality decomposes the approximation error into a function-dependent term $V(f)$ and a sequence-dependent term $D^{\ast}(S)$:

- The function-dependent term $V(f)$ depends on the regularity of $f$, captured by higher-order partial derivatives $\frac{\partial^{|I|} f}{ \partial \bu_{I}}$ for some multi-index $I \subset [s]$. This is analogous to the function-dependent part in classical methods, as it measures the maximum variation of the function in any possible direction. (more details for derivatives with multi index, see suplimentary section)
- The sequence-dependent term $D^{\ast}(S)$ represents the difference between the volume of the hyper-rectangle from the origin to vertex $\x \in [0,1]^s$ and the percentage of evaluation points contained in the hyper-rectangle. 

This concept of low $D^{\ast}(S)$ might still seem abstract, but it becomes clearer with a visual example. A post by [Martin Roberts](https://stats.stackexchange.com/users/34989/martin-roberts) on StackExchange provides an excellent illustration in 2D.

{% include figure.html url="/images/20240703/lds.png" description="low-discrepancy sequence in 2D by [Martin Roberts](https://stats.stackexchange.com/users/34989/martin-roberts)" width="60%" %}

In the illustration, the red squares represent the volume not covered by at least one point. A sequence with small $D^{\ast}(S)$ is characterized by the least number of red squares (corresponding to the part inside the supremum operation) and these red squares are spread out as uniformly as possible (corresponding to the supremum operation).

In this post, we will not delve into generating sequences with small $D^{\ast}(S)$, referred to as **low-discrepancy sequences**. For specific procedures in generating those sequence see [Dick, J., Kuo, F. Y., & Sloan, I. H. (2013)](https://web.maths.unsw.edu.au/~josefdick/preprints/DKS2013_Acta_Num_Version.pdf) Chapter 2,5,6. Nevertheless, the key takeaway from the Koksma–Hlawka inequality is that selecting \(S\) that minimizes \(D^{\ast}(S)\) will result in a smaller approximation error.

### Proof of Sketch
{: ._sec }
In this section, we will focus on the proof for the 1D case to gain more intuition about this "uniformity" that guarantees small $D^{\ast}(S)$. 

First we consider $s = 1$, and the proof is based on the fundamental theorem of Calculus (FTC): $\forall x \in [0,1]$

$$
        f(x) = f(1) - \int_{x}^{1} f'(y) dy = f(1) - \int_{0}^{1} \mathbf{1}[0, y] (x) f'(y) dy 
$$

Then first we spell out the definition of the approximation difference by selecting arbitrary sequence og $x_1, \cdotsm, x_n \in [0,1]$:

$$
\begin{align*} 
 I_s (f) - Q_{s,n}(f) & = \int_{0}^{1} f(x) dx - \frac{1}{n} \sum_{i=0}^{n-1} f(x_i)  \\
& = \int_{0}^{1} \left( f(1) - \int_{0}^{1} \mathbf{1}[0, y] (x) f'(y) dy \right) dx -  \frac{1}{n} \sum_{i=0}^{n-1} f(1) - \int_{0}^{1} \mathbf{1}[0, y] (x_i) f'(y) dy \\
& = \int_{0}^{1} f(1) dx -  \int_{0}^{1} \int_{0}^{1} \mathbf{1}[0, y] (x) f'(y) dy dx - \frac{1}{n} \sum_{i=0}^{n-1} f(1) -  \frac{1}{n} \sum_{i=0}^{n-1} \int_{0}^{1} \mathbf{1}[0, y] (x_i) f'(y) dy \\
& =  -  \int_{0}^{1} \int_{0}^{1} \mathbf{1}[0, y] (x) f'(y) dy dx  -  \frac{1}{n} \sum_{i=0}^{n-1} \int_{0}^{1} \mathbf{1}[0, y] (x_i) f'(y) dy \\
& = - \int_{0}^{1} \underbrace{ \left( \int_{0}^{1} \mathbf{1}[0, y] (x)  dx -   \frac{1}{n} \sum_{i=0}^{n-1}  \mathbf{1}[0, y] (x_i)  \right) }_{\text{local discrepancy: } \Delta(y, x_0, x_1, \cdots x_{n-1}) }f'(y) dy
\end{align*}
$$

where the second line is due to appling FTC to $f(x), f(x_i)$ respectively. Then the first and the third term cancells out which resultant to the forth line. Finally by Holder's inequality

$$ 
| I_s (f) - Q_{s,n}(f)| & \le \sup_{y \in [0, 1]} | \Delta(y, x_0, x_1, \cdots x_{n-1})| \cdot \int_{0}^{1} |f'(y) | dy
$$

This is exactly the Koksma–Hlawka inequality for $x = 1$. It is clear that $\sup_{y \in [0, 1]} | \Delta(y, x_0, x_1, \cdots x_{n-1})|$ is correlated to how uniform evaluation points being placed on $[0,1]$. Surly equally spaced points seems a great idea but in high dimension it is no longer the case.

In terms of general $s$ dimensional proof, we extend above argument through defining appropriate Reproducing kernel Hilbert space, see reference Chapter 3 of [Dick, J., Kuo, F. Y., & Sloan, I. H. (2013)](https://web.maths.unsw.edu.au/~josefdick/preprints/DKS2013_Acta_Num_Version.pdf)

## Supplimentary for Notation
{: ._sec }

This is a supplimental section to explain the notation for higher-order partial derivatives $\frac{\partial^{\|I\|} f}{ \partial \bu_{I}}$ for some multi index $I \subset [s]$ if needed. Some more generalized reference for this notation can be found via [Evans, L. C. (2022)](http://home.ustc.edu.cn/~wclw8181/wffc.files/Partial%20Differential%20Equations.Evans.pdf) Appendix A. But for our purpose to understand function variantions in the Koksma–Hlawka inequality, we only requires a very specific format of it. Hence we will only define an abstract way definition as well as some solid examples that is approproiate for understanding the Koksma–Hlawka inequality.

Let $I \subset [s] $, and $|I|$ be the cardinality of $I$, $\bu = [u_1, u_2, \cdots, n_s]$

$$ 
\frac{\partial^{|I|} f}{ \partial \bu_{I}} = \prod_{i \in I }\frac{\partial }{\partial u_i} f
$$ 

Consider the example of $s = 4$, $I = [1, 3] $, then 
$$ 
\frac{\partial^{|I|} f}{ \partial \bu_{I}} = \frac{\partial^2 f }{\partial u_1 \partial u_3} =  \frac{\partial^2 f }{\partial u_3 \partial u_1} = \frac{\partial }{\partial u_1 }  \frac{\partial }{\partial u_3 } f     
$$ 

After appreciating this definition, the function variation part of the Koksma–Hlawka inequality $V(f)$ quantify function variations by examines derivatives at every single possible directions.







