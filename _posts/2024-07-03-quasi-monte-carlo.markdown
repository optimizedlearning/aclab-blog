---
layout: post
title:  "Quasi Monte Carlo"
author: "Jiujia Zhang"
date:   2024-07-03 20:24:26 -0400
use_toc: true
---


<div style="display:none">
$
\newcommand{\x}{\mathbf{x}}
\newcommand{\bu}{\mathbf{u}}
$
</div>


This topic addresses numerical integration in multiple dimensions $\mathbb{R}^s$ in the format of 

$$I_s(f):= \int_{[0,1]^s} f(\x) \, d \x $$

Quasi-Monte Carlo is one of the methods to approximate such integrals. This format of integration plays an essential role in evaluating solutions to certain Partial Differential Equations and in computing expectations of random variables. The latter application is more intriguing than it might seem, as it is non-obviously related to learning problems involving Gaussian Kernels.

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

{% include figure.html url="/images/20240703/numerical_1d.png" description="1d numerical integration" width="60%" %}

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

Above bound is stochastic and can potentially have high variance, if we are seeking for a deterministic approximation error guarantee as the classical methods, we should choose those sequence of evaluation points deterministically. Quasi-Monte Carlo chooses a particular sequence of evaluation points that distribute **evenly** on $[0,1]^s$, and the **eveness** is different from equally spaced but in the sense of 
**low discrepancy** which is captured by the bound for arbitrary sequence of deterministic evaluation sequence, known as the **Koksma–Hlawka inequality**.
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

The Koksma–Hlawka inequality also decompose the approximation error into function dependent term $V(f)$ and a sequence dependent term $D^{\ast}(S)$. 
- For the function dependent term $V(f)$, it depends on the regularity of $f$ captured by higher-order partial derivatives $\frac{\partial^{\|I\|} f}{ \partial \bu_{I}}$ for some multi index $I \subset [s]$ (for detailed explaination and examples on higher order partial derivatives see next section ), this is essentially analogous to the function dependent part appeared in the classical methods since it measures maximum amount function variation in any possible direction.
- In terms of sequence dependent terms $D^{\ast}(S)$, that is the difference between the volume of the hyper rectangle from the origin to vetex $\x$ and the percentage of evaluation points contained in the hyper rectangle. At this point, it might still sound convoluted, or has absolutely no difference to the equally spaced sequence. We will have a $1$ dimensional version to explain this concept better as well as some pictorial examples in 2d shortly.

The Koksma–Hlawka inequality basically says selecting $S$ that minimizes $D^{\ast}(S)$ will give smaller approximation error, and such $S$ is refered as the **low-discrepancy sequence**.

### Proof of Sketch
{: ._sec }



## Supplimentary for Notation
{: ._sec }





